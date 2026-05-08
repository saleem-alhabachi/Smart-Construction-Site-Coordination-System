from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.domain.models import Risk, Task, User
from app.infrastructure.database import get_db
from app.infrastructure.ollama import ollama_client

router = APIRouter(prefix="/ai", tags=["ai"])


class AnalyzeRequest(BaseModel):
    title: str
    description: str


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class AIAnalysisResponse(BaseModel):
    priority: str
    risk_level: str
    estimated_effort: str
    recommendations: list[str]
    safety_concerns: list[str]
    resources_needed: list[str]
    summary: str


class ChatResponse(BaseModel):
    reply: str


@router.post("/analyze/task", response_model=AIAnalysisResponse)
async def analyze_task(
    body: AnalyzeRequest,
    _user: User = Depends(get_current_user),
):
    """Use Ollama to analyze a construction task and return structured recommendations."""
    result = await ollama_client.analyze_construction_item(
        title=body.title, description=body.description, item_type="task"
    )
    return AIAnalysisResponse(**result)


@router.post("/analyze/risk", response_model=AIAnalysisResponse)
async def analyze_risk(
    body: AnalyzeRequest,
    _user: User = Depends(get_current_user),
):
    """Use Ollama to analyze a construction risk and return mitigation guidance."""
    result = await ollama_client.analyze_construction_item(
        title=body.title, description=body.description, item_type="risk"
    )
    return AIAnalysisResponse(**result)


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Multi-turn AI chat with construction site context injected."""
    # Build context from live data
    tasks_q = await db.execute(select(Task))
    tasks = tasks_q.scalars().all()

    risks_q = await db.execute(select(Risk))
    risks = risks_q.scalars().all()

    context_lines = [
        f"Total tasks: {len(tasks)}",
        f"  - Completed: {sum(1 for t in tasks if t.status.value == 'Done')}",
        f"  - In Progress: {sum(1 for t in tasks if t.status.value == 'In Progress')}",
        f"  - To Do: {sum(1 for t in tasks if t.status.value == 'To Do')}",
        f"Total risks: {len(risks)}",
        f"  - Open: {sum(1 for r in risks if r.status.value == 'Open')}",
        f"  - Critical: {sum(1 for r in risks if r.severity.value == 'Critical')}",
    ]
    if tasks:
        recent = tasks[:3]
        context_lines.append("Recent tasks: " + ", ".join(t.title for t in recent))
    if risks:
        critical = [r for r in risks if r.severity.value in ("Critical", "High")][:3]
        if critical:
            context_lines.append(
                "High/Critical risks: " + ", ".join(r.title for r in critical)
            )

    context = "\n".join(context_lines)
    messages = [{"role": m.role, "content": m.content} for m in body.messages]

    reply = await ollama_client.chat(context=context, messages=messages)
    return ChatResponse(reply=reply)


@router.get("/status")
async def ai_status(_user: User = Depends(get_current_user)):
    """Check Ollama connectivity and available models."""
    connected = await ollama_client.check_connection()
    models = await ollama_client.list_models() if connected else []
    return {
        "connected": connected,
        "host": ollama_client.host,
        "active_model": ollama_client.default_model,
        "available_models": models,
    }
