from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import auth, tasks, risks, users, reports, ai, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/v1")
api_router.include_router(users.router, prefix="/v1")
api_router.include_router(tasks.router, prefix="/v1")
api_router.include_router(risks.router, prefix="/v1")
api_router.include_router(reports.router, prefix="/v1")
api_router.include_router(dashboard.router, prefix="/v1")
api_router.include_router(ai.router, prefix="/v1")
