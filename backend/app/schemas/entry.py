from pydantic import BaseModel
from datetime import date
from typing import Optional
from ..models.entry import EntryType


class CategoryOut(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


class ProjectOut(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    name: str


class EntryCreate(BaseModel):
    date: date
    description: str
    amount: float
    entry_type: EntryType
    category_id: Optional[int] = None
    project_ids: list[int] = []
    notes: Optional[str] = None


class EntryUpdate(BaseModel):
    date: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    entry_type: Optional[EntryType] = None
    category_id: Optional[int] = None
    project_ids: Optional[list[int]] = None
    notes: Optional[str] = None


class EntryOut(BaseModel):
    id: int
    date: date
    description: str
    amount: float
    entry_type: EntryType
    category_id: Optional[int] = None
    category: Optional[CategoryOut] = None
    projects: list[ProjectOut] = []
    notes: Optional[str] = None
    model_config = {"from_attributes": True}
