from __future__ import annotations

import json
import httpx
import structlog

from app.core.config import settings

logger = structlog.get_logger()


class OllamaClient:
    def __init__(self) -> None:
        self.host = settings.OLLAMA_HOST.rstrip("/")
        self.default_model = settings.OLLAMA_MODEL

    async def check_connection(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                r = await client.get(f"{self.host}/")
                return r.status_code == 200
        except Exception:
            return False

    async def list_models(self) -> list[str]:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                r = await client.get(f"{self.host}/api/tags")
                if r.status_code == 200:
                    return [m["name"] for m in r.json().get("models", [])]
        except Exception as e:
            logger.error("ollama_list_models_failed", error=str(e))
        return []

    async def pull_model(self, model: str) -> bool:
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                r = await client.post(
                    f"{self.host}/api/pull",
                    json={"name": model, "stream": False},
                )
                return r.status_code == 200
        except Exception as e:
            logger.error("ollama_pull_failed", error=str(e), model=model)
            return False

    async def analyze_construction_item(
        self, title: str, description: str, item_type: str = "task"
    ) -> dict:
        """
        Analyze a construction task or risk using Ollama.
        Returns structured JSON with priority, risk level, recommendations.
        """
        system_prompt = (
            "You are an expert construction site project management AI. "
            f"Your job is to analyze the given construction site {item_type} and provide a structured assessment. "
            "You MUST respond ONLY with a valid JSON object containing these exact keys:\n"
            "- 'priority': String. One of: 'Low', 'Medium', 'High', 'Critical'.\n"
            "- 'risk_level': String. One of: 'Low', 'Medium', 'High', 'Critical'.\n"
            "- 'estimated_effort': String. E.g. '2 hours', '1 day', '3 days'.\n"
            "- 'recommendations': List of 3-5 strings. Actionable steps for site teams.\n"
            "- 'safety_concerns': List of strings. Safety issues to address immediately.\n"
            "- 'resources_needed': List of strings. Equipment, materials, or personnel required.\n"
            "- 'summary': String. 2-3 sentence executive summary for the project manager.\n"
            "Return ONLY the raw JSON object. No markdown, no explanations, no text outside JSON."
        )
        prompt = f"Construction {item_type.title()} Title: {title}\nDetails: {description}"

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                r = await client.post(
                    f"{self.host}/api/generate",
                    json={
                        "model": self.default_model,
                        "system": system_prompt,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json",
                    },
                )
                if r.status_code == 200:
                    return json.loads(r.json().get("response", "{}"))
                raise Exception(f"Ollama status {r.status_code}")
        except Exception as e:
            logger.error("ollama_analysis_failed", error=str(e), title=title)
            return self._fallback_analysis(item_type)

    async def chat(self, context: str, messages: list[dict]) -> str:
        """
        Multi-turn chat with construction site context injected as system prompt.
        """
        system_prompt = (
            "You are a knowledgeable construction site coordination assistant. "
            "You help project managers, site engineers, and subcontractors with "
            "task planning, risk assessment, safety protocols, and project coordination. "
            f"Current project context:\n{context}\n\n"
            "Be concise, practical, and always prioritize site safety."
        )
        ollama_messages = [{"role": "system", "content": system_prompt}]
        ollama_messages.extend(messages[-10:])  # keep last 10 turns

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                r = await client.post(
                    f"{self.host}/api/chat",
                    json={"model": self.default_model, "messages": ollama_messages, "stream": False},
                )
                if r.status_code == 200:
                    return r.json().get("message", {}).get("content", "No response from AI.")
                return f"AI service returned status {r.status_code}."
        except Exception as e:
            logger.error("ollama_chat_failed", error=str(e))
            return f"AI service temporarily unavailable. ({e})"

    def _fallback_analysis(self, item_type: str) -> dict:
        return {
            "priority": "Medium",
            "risk_level": "Medium",
            "estimated_effort": "1-2 days",
            "recommendations": [
                "Conduct a site inspection to evaluate scope",
                "Assign qualified personnel with relevant expertise",
                "Ensure all safety equipment is available before starting",
                "Document progress and report blockers to the project manager",
            ],
            "safety_concerns": [
                "Wear appropriate PPE at all times",
                "Follow site safety protocols",
                "Ensure area is clear of unauthorized personnel",
            ],
            "resources_needed": ["Site personnel", "Standard construction tools", "Safety equipment"],
            "summary": (
                f"AI analysis for this {item_type} could not be completed at this time. "
                "A manual review by the project manager is recommended. "
                "Standard construction protocols should be followed."
            ),
        }


ollama_client = OllamaClient()
