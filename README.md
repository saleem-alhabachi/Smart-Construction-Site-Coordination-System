# Smart Construction Site Coordination System (SCSCS)

## Overview

A production-grade construction project management platform with task tracking, risk management, role-based access control, AI-powered analysis, and a modern web GUI.

**Live System**: `https://<VPS_IP>` (self-signed certificate)
**API Docs**: `https://<VPS_IP>/api/docs`
**Sprint Board**: [GitHub Projects](https://github.com/saleem-alhabachi/Smart-Construction-Site-Coordination-System/projects)

---

## Architecture

```
Internet (HTTPS :443)
       |
   [Nginx] --> [Frontend: Static HTML/CSS/JS]
       |
       +-----> [Backend: FastAPI]
                    |
             +------+-------+
          [PostgreSQL]   [Ollama AI]
```

All services run in Docker containers orchestrated by `docker-compose.yml`.

| Service    | Technology          | Purpose                              |
|------------|---------------------|--------------------------------------|
| Backend    | FastAPI + SQLAlchemy | REST API, business logic, auth       |
| Frontend   | HTML/CSS/JS SPA     | Web GUI dashboard                    |
| Database   | PostgreSQL 16       | Persistent data storage              |
| AI Engine  | Ollama (llama3.2)   | Task/risk analysis, chat assistant   |
| Proxy      | Nginx               | HTTPS termination, reverse proxy     |

---

## Features

### Core
- JWT authentication with role-based access control
- Task management with Kanban board (To Do / In Progress / Review / Done)
- Risk tracking with severity levels and mitigation workflows
- User management (Project Manager only)
- Dashboard with KPI cards and chart breakdowns
- Weekly progress report generation

### AI-Powered (Ollama)
- Task analysis: priority, risk level, effort estimation, recommendations
- Risk analysis: safety concerns, resource needs, mitigation guidance
- Multi-turn chat assistant with live project context injection

### Infrastructure
- Dockerized microservices architecture
- PostgreSQL with Alembic migrations
- Nginx reverse proxy with HTTPS (self-signed TLS)
- Prometheus metrics endpoint
- GitHub Actions CI/CD pipeline with VPS auto-deploy

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone
git clone https://github.com/saleem-alhabachi/Smart-Construction-Site-Coordination-System.git
cd Smart-Construction-Site-Coordination-System

# Copy environment config
cp .env.example .env

# Generate SSL certs (use 127.0.0.1 for local)
chmod +x nginx/generate-certs.sh
bash nginx/generate-certs.sh 127.0.0.1

# Start all services
docker compose up -d --build

# Open in browser
open https://localhost
```

### VPS Deployment

```bash
# On VPS
git clone <repo> /opt/scscs && cd /opt/scscs
cp .env.example .env
bash nginx/generate-certs.sh <VPS_PUBLIC_IP>
docker compose up -d --build
```

---

## API Reference

All endpoints require JWT auth (except register/login). Pass `Authorization: Bearer <token>` header.

| Method   | Endpoint                   | Description                  | Access             |
|----------|----------------------------|------------------------------|--------------------|
| POST     | /api/v1/auth/register      | Create account               | Public             |
| POST     | /api/v1/auth/token         | Login, get JWT               | Public             |
| GET      | /api/v1/users/me           | Current user profile         | Authenticated      |
| GET      | /api/v1/users              | List all users               | Project Manager    |
| DELETE   | /api/v1/users/:id          | Remove user                  | Project Manager    |
| GET      | /api/v1/tasks              | List all tasks               | Authenticated      |
| POST     | /api/v1/tasks              | Create task                  | Engineer+          |
| GET      | /api/v1/tasks/:id          | Get task                     | Authenticated      |
| PUT      | /api/v1/tasks/:id          | Update task                  | Engineer+          |
| PATCH    | /api/v1/tasks/:id/status   | Change task status           | Authenticated      |
| DELETE   | /api/v1/tasks/:id          | Delete task                  | Engineer+          |
| GET      | /api/v1/risks              | List all risks               | Authenticated      |
| POST     | /api/v1/risks              | Report risk                  | Engineer+          |
| PUT      | /api/v1/risks/:id          | Update risk                  | Engineer+          |
| PATCH    | /api/v1/risks/:id/status   | Change risk status           | Engineer+          |
| DELETE   | /api/v1/risks/:id          | Delete risk                  | Engineer+          |
| GET      | /api/v1/dashboard          | KPI snapshot                 | Authenticated      |
| GET      | /api/v1/reports/weekly      | Weekly report                | Authenticated      |
| POST     | /api/v1/ai/analyze/task    | AI task analysis             | Authenticated      |
| POST     | /api/v1/ai/analyze/risk    | AI risk analysis             | Authenticated      |
| POST     | /api/v1/ai/chat            | AI chat                      | Authenticated      |
| GET      | /api/v1/ai/status          | AI service health            | Authenticated      |

---

## Team

| Name              | Role                              |
|-------------------|-----------------------------------|
| Saleem Alhabachi  | Project Manager, Documentation    |
| Waleed            | Backend, System Logic, DevOps     |
| Mohammed          | Frontend Support, Testing         |

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

1. **Lint**: Python code analysis with `ruff`
2. **Test**: Backend tests with real PostgreSQL service container
3. **Build**: Docker images for backend and nginx
4. **Deploy**: SSH into VPS, pull latest code, rebuild and restart containers

Required GitHub Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

---

## Documentation

| Document | Description |
|----------|-------------|
| [Project Description](docs/Project%20Description.pdf) | Full system vision, architecture, requirements |
| [Project Plan](docs/Smart_Construction_Site_Project_Plan.xlsx) | Timeline, budget, team roles |
| [Risk Analysis](docs/Risk_Analysis_and_Testing_Plan.md) | Risk identification, assessment, mitigation |
| [Risk Updates](docs/Risk_Updates.md) | Implementation risk status changes |
| [Sprint Board](docs/Sprint_Board.md) | Sprint workflow and board link |
| [Demo Plan](docs/Demo_Plan.md) | Live demonstration structure |
| [Class Diagram](docs/Class_Diagram.md) | System design overview |
| [API Reference](docs/API_Reference.md) | Full endpoint documentation |
