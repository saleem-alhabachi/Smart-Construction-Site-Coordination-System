from __future__ import annotations

import asyncio
import structlog
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.router import api_router
from app.core.config import settings
from app.domain.models import Base
from app.infrastructure.database import engine
from app.infrastructure.ollama import ollama_client

logger = structlog.get_logger()


async def _warmup_ollama():
    """Pull the Ollama model in the background so startup is not blocked."""
    try:
        ok = await ollama_client.check_connection()
        if ok:
            logger.info("ollama_connected", host=settings.OLLAMA_HOST)
            models = await ollama_client.list_models()
            if settings.OLLAMA_MODEL not in models:
                logger.info("ollama_pulling_model", model=settings.OLLAMA_MODEL)
                pulled = await ollama_client.pull_model(settings.OLLAMA_MODEL)
                if pulled:
                    logger.info("ollama_model_ready", model=settings.OLLAMA_MODEL)
                else:
                    logger.warning("ollama_model_pull_failed", model=settings.OLLAMA_MODEL)
            else:
                logger.info("ollama_model_available", model=settings.OLLAMA_MODEL)
        else:
            logger.warning("ollama_unavailable", host=settings.OLLAMA_HOST)
    except Exception as e:
        logger.warning("ollama_warmup_error", error=str(e))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ────────────────────────────────────────────────────────────
    logger.info("startup_begin", env=settings.APP_ENV)

    # Create tables
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("database_tables_ready")
    except Exception as e:
        logger.warning("database_create_tables_skipped", reason=str(e))

    # Pull Ollama model in background (non-blocking)
    asyncio.create_task(_warmup_ollama())
    logger.info("startup_complete")

    yield

    # ── Shutdown ───────────────────────────────────────────────────────────
    await engine.dispose()
    logger.info("shutdown_complete")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Smart Construction Site Coordination System",
        description=(
            "A production-grade construction project management API with "
            "task tracking, risk management, role-based access control, and AI assistance."
        ),
        version="2.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    # ── CORS ───────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── API Routes ─────────────────────────────────────────────────────────
    app.include_router(api_router, prefix="/api")

    # ── Prometheus Metrics ─────────────────────────────────────────────────
    Instrumentator().instrument(app).expose(app, endpoint="/metrics")

    return app


app = create_app()
