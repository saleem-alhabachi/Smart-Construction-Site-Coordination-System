# Risk Updates

This document records how project risks evolved after the initial planning phase.

## Updated Risk Status

| Risk | Original Concern | Current Update | Current Priority |
| --- | --- | --- | --- |
| Delayed implementation of core modules | MVP features might not be completed in time | Full production MVP is implemented with backend API, web GUI, and AI integration. All core modules (tasks, risks, users, dashboard, reports, AI) are functional. | Low |
| Requirement ambiguity | Scope could expand beyond available time | Scope is focused on task management, risk tracking, AI analysis, and reporting. Clear API contracts defined. | Low |
| Integration issues | Separate modules may fail to work together | Docker Compose orchestration ensures all services start together with health checks and dependency ordering. CI pipeline validates integration. | Low |
| Security and access control gaps | Roles may not be enforced consistently | JWT-based authentication implemented. Three roles enforced: Project Manager, Site Engineer, Subcontractor. Role guards on all endpoints. | Low |
| Demo failure risk | The system may not be ready for live presentation | System is deployed on VPS with HTTPS, all features are accessible via web browser. Demo plan is documented with step-by-step walkthrough. | Low |
| VPS infrastructure failure | Server could become unavailable during demo | Docker containers have restart policies (unless-stopped). Health checks monitor all services. Database uses persistent volumes. | Medium |
| AI model unavailability | Ollama service might fail or model might not load | Fallback analysis is built into the AI client. System functions normally without AI. Status indicator in GUI shows AI availability. | Medium |
| HTTPS certificate issues | Self-signed cert may cause browser warnings | Users will see a browser warning for self-signed cert. This is expected and documented. Production deployment can use Let's Encrypt. | Low |
| Database data loss | PostgreSQL data could be lost on container restart | Docker volume (pgdata) persists data across container restarts. Alembic migrations track schema changes. | Low |

## New Risks Identified During Implementation

| Risk | Description | Mitigation | Priority |
| --- | --- | --- | --- |
| Ollama memory usage | LLM model requires significant RAM on VPS | Using llama3.2:1b (smallest model). VPS should have minimum 4GB RAM. | Medium |
| Docker build cache | Large Docker images may slow down CI/CD | Multi-stage builds reduce image size. Build cache is utilized in Docker Compose. | Low |
| Concurrent user load | System not load-tested for multiple simultaneous users | Uvicorn runs with 2 workers. PostgreSQL connection pool configured with 10 connections + 20 overflow. | Medium |

## Monitoring Approach

1. Docker health checks run continuously for all services
2. Prometheus metrics available at /metrics endpoint
3. Structured logging with structlog for backend traceability
4. Review risks at end of each sprint
5. Use CI workflow status as integration health indicator
