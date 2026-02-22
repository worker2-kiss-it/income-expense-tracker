# Income & Expense Tracker

Einnahmen-Ausgaben-Rechnung tracker with FastAPI backend and Next.js frontend.

## Stack
- **Backend**: FastAPI (port 8003), PostgreSQL, Alembic, SQLAlchemy
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Recharts
- **Database**: PostgreSQL (port 5433)

## Setup

### 1. Database
Create the `income_tracker` database in your PostgreSQL instance:
```sql
CREATE DATABASE income_tracker;
```

### 2. Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Backend
```bash
cd backend
pip install -r requirements.txt
alembic revision --autogenerate -m "initial"
alembic upgrade head
python -m app.seed  # Seed with sample data
uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3002

## Features
- CRUD for income/expense entries (Einnahmen/Ausgaben)
- Categories & project labeling
- Dashboard with pie, bar, and line charts
- Dark theme with glass/glow effects
- Date range and category/project filters
