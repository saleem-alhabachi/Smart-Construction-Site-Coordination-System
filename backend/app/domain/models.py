from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, DateTime, Enum as SAEnum, ForeignKey, String, Text, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class UserRole(str, enum.Enum):
    project_manager = "project_manager"
    site_engineer = "site_engineer"
    subcontractor = "subcontractor"


class TaskStatus(str, enum.Enum):
    todo = "To Do"
    in_progress = "In Progress"
    review = "Review"
    done = "Done"


class RiskSeverity(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class RiskStatus(str, enum.Enum):
    open = "Open"
    in_review = "In Review"
    mitigated = "Mitigated"
    closed = "Closed"


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)

    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    assigned_tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    reported_risks = relationship("Risk", back_populates="reporter", foreign_keys="Risk.reporter_id")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SAEnum(TaskStatus), default=TaskStatus.todo, nullable=False)
    deadline = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now, nullable=False)

    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assignee = relationship("User", back_populates="assigned_tasks", foreign_keys=[assignee_id])


class Risk(Base):
    __tablename__ = "risks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(SAEnum(RiskSeverity), nullable=False)
    mitigation_plan = Column(Text, nullable=False)
    status = Column(SAEnum(RiskStatus), default=RiskStatus.open, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=_now, onupdate=_now, nullable=False)

    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reporter = relationship("User", back_populates="reported_risks", foreign_keys=[reporter_id])
