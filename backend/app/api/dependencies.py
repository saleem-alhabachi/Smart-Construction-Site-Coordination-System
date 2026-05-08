from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.domain.models import User, UserRole
from app.infrastructure.database import get_db

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: AsyncSession = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please log in.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise exc
    payload = decode_token(credentials.credentials)
    if not payload:
        raise exc
    email = payload.get("sub")
    if not email:
        raise exc
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise exc
    return user


async def require_project_manager(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.project_manager:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires Project Manager role.",
        )
    return user


async def require_engineer_or_above(user: User = Depends(get_current_user)) -> User:
    if user.role not in (UserRole.project_manager, UserRole.site_engineer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires Site Engineer or Project Manager role.",
        )
    return user
