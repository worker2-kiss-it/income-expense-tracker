import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.get("/api/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_crud_entry():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        # Create
        r = await c.post("/api/entries", json={
            "date": "2024-06-01",
            "description": "Test entry",
            "amount": 100.0,
            "entry_type": "Einnahme",
            "category_id": 1,
            "project_ids": [1],
        })
        assert r.status_code == 201
        entry_id = r.json()["id"]

        # Read
        r = await c.get("/api/entries")
        assert r.status_code == 200
        assert len(r.json()) == 1

        # Update
        r = await c.put(f"/api/entries/{entry_id}", json={"amount": 200.0})
        assert r.status_code == 200
        assert r.json()["amount"] == 200.0

        # Delete
        r = await c.delete(f"/api/entries/{entry_id}")
        assert r.status_code == 204

        r = await c.get("/api/entries")
        assert len(r.json()) == 0


@pytest.mark.asyncio
async def test_categories():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        r = await c.get("/api/categories")
        assert r.status_code == 200
        assert len(r.json()) == 2


@pytest.mark.asyncio
async def test_summary():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        await c.post("/api/entries", json={
            "date": "2024-06-01", "description": "Income", "amount": 1000, "entry_type": "Einnahme",
        })
        await c.post("/api/entries", json={
            "date": "2024-06-15", "description": "Expense", "amount": 300, "entry_type": "Ausgabe", "category_id": 1,
        })
        r = await c.get("/api/entries/summary")
        assert r.status_code == 200
        data = r.json()
        assert data["total_income"] == 1000
        assert data["total_expense"] == 300
        assert data["balance"] == 700
