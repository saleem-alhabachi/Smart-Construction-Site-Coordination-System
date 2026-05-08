from __future__ import annotations

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.dependencies import get_current_user, require_engineer_or_above
from app.domain.models import Risk, RiskSeverity, RiskStatus, User
from app.domain.schemas import RiskCreate, RiskOut, RiskStatusUpdate
from app.infrastructure.database import get_db

router = APIRouter(prefix="/risks", tags=["risks"])


class RiskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=5)
    severity: Optional[RiskSeverity] = None
    mitigation_plan: Optional[str] = Field(None, min_length=5)


@router.get("", response_model=List[RiskOut])
async def list_risks(
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Risk).options(selectinload(Risk.reporter)).order_by(Risk.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=RiskOut, status_code=status.HTTP_201_CREATED)
async def report_risk(
    body: RiskCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_engineer_or_above),
):
    risk = Risk(
        title=body.title,
        description=body.description,
        severity=body.severity,
        mitigation_plan=body.mitigation_plan,
        reporter_id=user.id,
    )
    db.add(risk)
    await db.flush()

    result = await db.execute(
        select(Risk).options(selectinload(Risk.reporter)).where(Risk.id == risk.id)
    )
    return result.scalar_one()


@router.get("/{risk_id}", response_model=RiskOut)
async def get_risk(
    risk_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Risk).options(selectinload(Risk.reporter)).where(Risk.id == risk_id)
    )
    risk = result.scalar_one_or_none()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found.")
    return risk


@router.put("/{risk_id}", response_model=RiskOut)
async def update_risk(
    risk_id: uuid.UUID,
    body: RiskUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_engineer_or_above),
):
    """Full update of a risk's fields."""
    result = await db.execute(
        select(Risk).options(selectinload(Risk.reporter)).where(Risk.id == risk_id)
    )
    risk = result.scalar_one_or_none()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found.")

    if body.title is not None:
        risk.title = body.title
    if body.description is not None:
        risk.description = body.description
    if body.severity is not None:
        risk.severity = body.severity
    if body.mitigation_plan is not None:
        risk.mitigation_plan = body.mitigation_plan

    await db.flush()
    await db.refresh(risk)
    return risk


@router.patch("/{risk_id}/status", response_model=RiskOut)
async def update_risk_status(
    risk_id: uuid.UUID,
    body: RiskStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_engineer_or_above),
):
    result = await db.execute(
        select(Risk).options(selectinload(Risk.reporter)).where(Risk.id == risk_id)
    )
    risk = result.scalar_one_or_none()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found.")
    risk.status = body.status
    await db.flush()
    await db.refresh(risk)
    return risk


@router.delete("/{risk_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_risk(
    risk_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_engineer_or_above),
):
    result = await db.execute(select(Risk).where(Risk.id == risk_id))
    risk = result.scalar_one_or_none()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found.")
    await db.delete(risk)
