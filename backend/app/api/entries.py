from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import date
from typing import Optional
from ..database import get_db
from ..models.entry import Entry, Project, entry_projects
from ..schemas.entry import EntryCreate, EntryUpdate, EntryOut

router = APIRouter(prefix="/api/entries", tags=["entries"])


@router.get("", response_model=list[EntryOut])
async def list_entries(
    category_id: Optional[int] = None,
    project_id: Optional[int] = None,
    entry_type: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(Entry).order_by(Entry.date.desc())
    if category_id:
        q = q.where(Entry.category_id == category_id)
    if project_id:
        q = q.join(entry_projects).where(entry_projects.c.project_id == project_id)
    if entry_type:
        q = q.where(Entry.entry_type == entry_type)
    if date_from:
        q = q.where(Entry.date >= date_from)
    if date_to:
        q = q.where(Entry.date <= date_to)
    result = await db.execute(q)
    return result.scalars().unique().all()


@router.post("", response_model=EntryOut, status_code=201)
async def create_entry(data: EntryCreate, db: AsyncSession = Depends(get_db)):
    entry = Entry(
        date=data.date,
        description=data.description,
        amount=data.amount,
        entry_type=data.entry_type,
        category_id=data.category_id,
        notes=data.notes,
    )
    if data.project_ids:
        projects = (await db.execute(select(Project).where(Project.id.in_(data.project_ids)))).scalars().all()
        entry.projects = projects
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=EntryOut)
async def update_entry(entry_id: int, data: EntryUpdate, db: AsyncSession = Depends(get_db)):
    entry = await db.get(Entry, entry_id)
    if not entry:
        raise HTTPException(404, "Entry not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "project_ids":
            projects = (await db.execute(select(Project).where(Project.id.in_(value)))).scalars().all()
            entry.projects = projects
        else:
            setattr(entry, field, value)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: int, db: AsyncSession = Depends(get_db)):
    entry = await db.get(Entry, entry_id)
    if not entry:
        raise HTTPException(404, "Entry not found")
    await db.delete(entry)
    await db.commit()


@router.get("/summary")
async def summary(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(Entry)
    if date_from:
        q = q.where(Entry.date >= date_from)
    if date_to:
        q = q.where(Entry.date <= date_to)
    result = await db.execute(q)
    entries = result.scalars().unique().all()

    total_income = sum(float(e.amount) for e in entries if e.entry_type.value == "Einnahme")
    total_expense = sum(float(e.amount) for e in entries if e.entry_type.value == "Ausgabe")

    # Monthly breakdown
    monthly = {}
    for e in entries:
        key = e.date.strftime("%Y-%m")
        if key not in monthly:
            monthly[key] = {"month": key, "income": 0, "expense": 0}
        if e.entry_type.value == "Einnahme":
            monthly[key]["income"] += float(e.amount)
        else:
            monthly[key]["expense"] += float(e.amount)

    # Category breakdown (expenses only)
    by_category = {}
    for e in entries:
        if e.entry_type.value == "Ausgabe" and e.category:
            name = e.category.name
            by_category[name] = by_category.get(name, 0) + float(e.amount)

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "monthly": sorted(monthly.values(), key=lambda x: x["month"]),
        "by_category": [{"name": k, "value": v} for k, v in sorted(by_category.items())],
    }
