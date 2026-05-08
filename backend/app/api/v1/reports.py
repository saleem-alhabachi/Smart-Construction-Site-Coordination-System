from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.domain.models import Risk, RiskStatus, Task, TaskStatus, User
from app.domain.schemas import WeeklyReport
from app.infrastructure.database import get_db

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/weekly", response_model=WeeklyReport)
async def get_weekly_report(
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Generate a current-state weekly progress report."""
    now = datetime.now(timezone.utc)

    tasks_q = await db.execute(select(Task))
    tasks = tasks_q.scalars().all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == TaskStatus.done)
    in_progress_tasks = sum(1 for t in tasks if t.status == TaskStatus.in_progress)
    overdue_tasks = sum(
        1
        for t in tasks
        if t.deadline
        and t.status != TaskStatus.done
        and t.deadline < now.strftime("%Y-%m-%d")
    )

    risks_q = await db.execute(select(Risk))
    risks = risks_q.scalars().all()
    total_risks = len(risks)
    open_risks = sum(1 for r in risks if r.status == RiskStatus.open)
    mitigated_risks = sum(1 for r in risks if r.status == RiskStatus.mitigated)
    closed_risks = sum(1 for r in risks if r.status == RiskStatus.closed)

    completion_pct = round((completed_tasks / total_tasks * 100) if total_tasks else 0)

    if overdue_tasks > 0:
        health = "at risk"
    elif completion_pct >= 75:
        health = "on track"
    else:
        health = "progressing"

    summary = (
        f"Weekly report as of {now.strftime('%Y-%m-%d %H:%M UTC')}. "
        f"Overall completion: {completion_pct}% ({completed_tasks}/{total_tasks} tasks done). "
        f"Project is {health}. "
        f"Active risks: {open_risks} open, {mitigated_risks} mitigated, {closed_risks} closed. "
        f"Overdue tasks requiring immediate attention: {overdue_tasks}."
    )

    return WeeklyReport(
        generated_at=now,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        in_progress_tasks=in_progress_tasks,
        overdue_tasks=overdue_tasks,
        total_risks=total_risks,
        open_risks=open_risks,
        mitigated_risks=mitigated_risks,
        closed_risks=closed_risks,
        summary=summary,
    )
