from __future__ import annotations

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.dependencies import get_current_user, require_engineer_or_above
from app.domain.models import Task, TaskStatus, User, UserRole
from app.domain.schemas import TaskCreate, TaskOut, TaskStatusUpdate
from app.infrastructure.database import get_db

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=5)
    deadline: Optional[str] = None
    assignee_id: Optional[uuid.UUID] = None


@router.get("", response_model=List[TaskOut])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Task).options(selectinload(Task.assignee)).order_by(Task.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(
    body: TaskCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_engineer_or_above),
):
    assignee = None
    if body.assignee_id:
        result = await db.execute(select(User).where(User.id == body.assignee_id))
        assignee = result.scalar_one_or_none()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assignee user not found.")
        if assignee.role == UserRole.subcontractor:
            raise HTTPException(
                status_code=400,
                detail="Tasks cannot be assigned to a Subcontractor.",
            )

    task = Task(
        title=body.title,
        description=body.description,
        deadline=body.deadline,
        assignee_id=body.assignee_id,
    )
    db.add(task)
    await db.flush()

    result = await db.execute(
        select(Task).options(selectinload(Task.assignee)).where(Task.id == task.id)
    )
    return result.scalar_one()


@router.get("/{task_id}", response_model=TaskOut)
async def get_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Task).options(selectinload(Task.assignee)).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


@router.put("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: uuid.UUID,
    body: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_engineer_or_above),
):
    """Full update of a task's fields."""
    result = await db.execute(
        select(Task).options(selectinload(Task.assignee)).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if body.title is not None:
        task.title = body.title
    if body.description is not None:
        task.description = body.description
    if body.deadline is not None:
        task.deadline = body.deadline
    if body.assignee_id is not None:
        asgn = await db.execute(select(User).where(User.id == body.assignee_id))
        assignee = asgn.scalar_one_or_none()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assignee user not found.")
        task.assignee_id = body.assignee_id

    await db.flush()
    await db.refresh(task)
    return task


@router.patch("/{task_id}/status", response_model=TaskOut)
async def update_task_status(
    task_id: uuid.UUID,
    body: TaskStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Task).options(selectinload(Task.assignee)).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    task.status = body.status
    await db.flush()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_engineer_or_above),
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    await db.delete(task)
