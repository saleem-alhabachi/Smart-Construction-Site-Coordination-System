# Demo Plan

## Demo Objective
Demonstrate the fully operational Smart Construction Site Coordination System running on a live VPS with HTTPS, showing all core features including AI-powered analysis.

## Pre-Demo Checklist
- [ ] VPS is running with all Docker containers healthy
- [ ] HTTPS is accessible at the VPS IP address
- [ ] Ollama model is pulled and responding
- [ ] Test user accounts are created (PM, Engineer, Subcontractor)
- [ ] Sample tasks and risks are populated
- [ ] GitHub Actions CI pipeline shows green status
- [ ] GitHub Projects board is populated with sprint tasks

## Demo Flow

### 1. Repository Overview (2 min)
- Show GitHub repository structure
- Highlight the clean architecture: backend/, frontend/, nginx/, docker-compose.yml
- Show the README with architecture diagram

### 2. CI/CD Pipeline (2 min)
- Open GitHub Actions tab
- Show the latest successful workflow run
- Walk through the stages: lint, test, build, deploy

### 3. Live System Access (1 min)
- Open browser to `https://<VPS_IP>`
- Show the HTTPS certificate
- Note the professional dark-mode interface

### 4. Authentication (2 min)
- Register a new user with "Project Manager" role
- Log in and show the JWT-based session
- Show role-based navigation (PM sees Users tab)

### 5. Dashboard (2 min)
- Show KPI cards: total tasks, completed, active risks, overdue, team size
- Show task breakdown chart by status
- Show risk breakdown chart by severity

### 6. Task Management (3 min)
- Create a new task with title, description, deadline
- Show the Kanban board with 4 columns
- Move a task from "To Do" to "In Progress" using arrow buttons
- Delete a task

### 7. Risk Management (3 min)
- Report a new risk with severity and mitigation plan
- Show the risks table with severity badges
- Update a risk status from "Open" to "In Review"
- Show color-coded severity indicators

### 8. AI Assistant (3 min)
- Open the AI Assistant page
- Show the AI status indicator (green = online)
- Run a task analysis: enter a task title/description, click Analyze
- Show the structured response: priority, risk level, recommendations, safety concerns
- Send a chat message about project safety protocols
- Show the multi-turn conversation with project context

### 9. Weekly Report (1 min)
- Generate a weekly report
- Show the stats grid and summary narrative

### 10. Project Board (1 min)
- Show the GitHub Projects board
- Walk through sprint columns

## Expected Artifacts
- Live HTTPS URL with working system
- GitHub repository with clean commit history
- CI/CD pipeline with green builds
- GitHub Projects sprint board
- API documentation at /api/docs
- Risk documentation and updates
