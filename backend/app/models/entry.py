from sqlalchemy import Column, Integer, String, Numeric, Date, Text, ForeignKey, Table, Enum as SAEnum
from sqlalchemy.orm import relationship
import enum
from ..database import Base

entry_projects = Table(
    "entry_projects",
    Base.metadata,
    Column("entry_id", Integer, ForeignKey("entries.id", ondelete="CASCADE"), primary_key=True),
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
)


class EntryType(str, enum.Enum):
    EINNAHME = "Einnahme"
    AUSGABE = "Ausgabe"


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)


class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    description = Column(String(500), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    entry_type = Column(SAEnum(EntryType), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    notes = Column(Text, nullable=True)

    category = relationship("Category", lazy="selectin")
    projects = relationship("Project", secondary=entry_projects, lazy="selectin")


# Alias for import convenience
EntryProject = entry_projects
