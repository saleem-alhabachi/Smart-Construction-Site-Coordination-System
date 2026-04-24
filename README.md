# Smart Construction Site Coordination System (SCSCS)

## Executive Overview
The Smart Construction Site Coordination System (SCSCS) is a project management-oriented software prototype designed to improve coordination on construction sites. The project brings together task management, schedule visibility, risk tracking, and progress reporting in one structured system so project stakeholders can collaborate more effectively.

## Problem Statement
Construction projects often face delays, cost overruns, and communication problems because information is spread across different tools and responsibilities are not always tracked clearly. When risks are reported late or task ownership is unclear, decision-making becomes slower and project performance is affected.

## Proposed Solution
SCSCS addresses these issues through a centralized coordination system that supports:

- task creation, assignment, and status tracking
- schedule and deadline visibility
- risk reporting, review, and mitigation
- weekly progress reporting
- role-based responsibility management

The goal is to provide a functional MVP that demonstrates how project management practices can be applied in a realistic construction-site scenario.

## Project Objectives
- Improve coordination between project stakeholders
- Increase visibility of tasks, deadlines, and responsibilities
- Support earlier identification and management of project risks
- Provide structured progress reporting for weekly monitoring
- Demonstrate project planning and object-oriented software design in one repository

## Team Roles
- Saleem Alhabachi: Project Manager and Documentation Lead
- Waleed: Backend and System Logic
- Mohammed: Frontend Support and Testing

## Project Management Tools
- Jira Software for task tracking and workflow management
- GitHub for version control and project hosting
- PlantUML and Mermaid for system diagrams
- Microsoft Excel for planning, budgeting, and risk tracking

## Repository Structure
`docs/`
- `Project Description.pdf`
- `Smart_Construction_Site_Project_Plan.xlsx`
- `Risk_Analysis_and_Testing_Plan.md`
- `Risk_Updates.md`
- `Sprint_Board.md`
- `Demo_Plan.md`
- `Class_Diagram.md`
- `Class_Diagram.puml`
- `UML diagram.png`

`src/`
- `index.js`
- `models/`
- `services/`

`test/`
- `system.test.js`

`.github/workflows/`
- `ci.yml`

## Documentation Guide
The following documents support the project presentation:

- [Project Description](docs/Project%20Description.pdf): full system vision, features, architecture, technology stack, security, deployment, integration, and technical requirements
- [Project Plan](docs/Smart_Construction_Site_Project_Plan.xlsx): team roles, project timeline, budget planning, and initial risk planning
- [Risk Analysis and Testing Plan](docs/Risk_Analysis_and_Testing_Plan.md): risk identification, risk assessment, risk matrix, mitigation actions, roadmap, validation, and success criteria
- [Risk Updates](docs/Risk_Updates.md): updates to risk status during implementation
- [Sprint Board](docs/Sprint_Board.md): workflow stages and sprint organization
- [Demo Plan](docs/Demo_Plan.md): suggested live demonstration structure
- [Class Diagram](docs/Class_Diagram.md): class relationships and object-oriented design overview
- [PlantUML Class Diagram](docs/Class_Diagram.puml): diagram source file

## MVP Implementation
The repository includes a minimal runnable MVP implemented in Node.js with a lightweight frontend dashboard. It demonstrates the main project concepts through code:

- user role registration
- task creation and assignment
- task status updates
- risk reporting and mitigation flow
- weekly progress report generation
- dashboard-style summary output
- web-based visual presentation of tasks, risks, roles, and work items

Run the MVP locally with:

```bash
npm start
```

Then open:

```bash
http://localhost:3000
```

Run automated tests with:

```bash
npm test
```

## Object-Oriented Design
The implementation is structured around core classes such as `User`, `ProjectManager`, `SiteEngineer`, `Subcontractor`, `WorkItem`, `Task`, `Risk`, `ProgressReport`, and `SmartConstructionSystem`.

The code demonstrates:

- Encapsulation through private fields such as `#id`, `#role`, and `#status`
- Inheritance through role-based user subclasses and the shared `WorkItem` base class
- Polymorphism through role-specific permission behavior in different user types

## CI/CD
The project includes a GitHub Actions workflow in `.github/workflows/ci.yml`. The workflow automatically runs the test suite on pushes and pull requests to `main`, helping ensure that the MVP remains stable as the repository evolves.

## Presentation Flow
For a live presentation from GitHub, the recommended order is:

1. Start with this README for the project overview, problem, solution, and repository structure.
2. Open the project description document for the full system vision and architecture.
3. Show the project plan file for team roles, timeline, budget, and initial planning.
4. Open the risk analysis and testing plan to explain project control and validation.
5. Show the risk updates and sprint board documents to explain project tracking.
6. Open the class diagram to explain the system design.
7. Show `src/` to present the MVP implementation.
8. End with `.github/workflows/ci.yml` to show CI/CD support.

## Current Scope
This repository contains a project-management-focused prototype and a minimal working MVP. It is intended to demonstrate planning, coordination, risk management, testing preparation, and object-oriented implementation rather than a full production deployment.
