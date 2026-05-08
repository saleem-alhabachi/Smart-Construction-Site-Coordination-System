from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.domain.models import Risk, RiskSeverity, RiskStatus, Task, TaskStatus, User
from app.domain.schemas import DashboardSnapshot
from app.infrastructure.database import get_db

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardSnapshot)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Return KPI snapshot for the project dashboard."""
    now = datetime.now(timezone.utc)

    # User count
    total_users_q = await db.execute(select(func.count()).select_from(User))
    total_users = total_users_q.scalar_one()

    # Task counts
    tasks_q = await db.execute(select(Task))
    tasks = tasks_q.scalars().all()
    total_tasks = len(tasks)

    tasks_by_status: dict[str, int] = {s.value: 0 for s in TaskStatus}
    completed_tasks = 0
    overdue_tasks = 0

    for task in tasks:
        tasks_by_status[task.status.value] = tasks_by_status.get(task.status.value, 0) + 1
        if task.status == TaskStatus.done:
            completed_tasks += 1
        if (
            task.deadline
            and task.status != TaskStatus.done
            and task.deadline < now.strftime("%Y-%m-%d")
        ):
            overdue_tasks += 1

    # Risk counts
    risks_q = await db.execute(select(Risk))
    risks = risks_q.scalars().all()

    active_risks = sum(
        1 for r in risks if r.status in (RiskStatus.open, RiskStatus.in_review)
    )

    risks_by_severity: dict[str, int] = {s.value: 0 for s in RiskSeverity}
    for risk in risks:
        risks_by_severity[risk.severity.value] = (
            risks_by_severity.get(risk.severity.value, 0) + 1
        )

    return DashboardSnapshot(
        total_users=total_users,
        total_tasks=total_tasks,
        active_risks=active_risks,
        overdue_tasks=overdue_tasks,
        completed_tasks=completed_tasks,
        tasks_by_status=tasks_by_status,
        risks_by_severity=risks_by_severity,
    )
