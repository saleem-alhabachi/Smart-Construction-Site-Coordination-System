from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.domain.models import RiskSeverity, RiskStatus, TaskStatus, UserRole


# ─── Auth ──────────────────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ─── User ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole


class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: UserRole
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Task ──────────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    deadline: Optional[str] = None
    assignee_id: Optional[uuid.UUID] = None


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    status: TaskStatus
    deadline: Optional[str]
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserOut]

    model_config = {"from_attributes": True}


# ─── Risk ──────────────────────────────────────────────────────────────────────

class RiskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    severity: RiskSeverity
    mitigation_plan: str = Field(..., min_length=5)


class RiskStatusUpdate(BaseModel):
    status: RiskStatus


class RiskOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    severity: RiskSeverity
    mitigation_plan: str
    status: RiskStatus
    created_at: datetime
    updated_at: datetime
    reporter: Optional[UserOut]

    model_config = {"from_attributes": True}


# ─── Dashboard ─────────────────────────────────────────────────────────────────

class DashboardSnapshot(BaseModel):
    total_users: int
    total_tasks: int
    active_risks: int
    overdue_tasks: int
    completed_tasks: int
    tasks_by_status: dict[str, int]
    risks_by_severity: dict[str, int]


# ─── Report ────────────────────────────────────────────────────────────────────

class WeeklyReport(BaseModel):
    generated_at: datetime
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    overdue_tasks: int
    total_risks: int
    open_risks: int
    mitigated_risks: int
    closed_risks: int
    summary: str
