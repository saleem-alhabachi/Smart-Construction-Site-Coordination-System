# Smart Construction Site Coordination System (SCSCS)

## Project Overview
The Smart Construction Site Coordination System (SCSCS) is a project management-oriented software prototype designed to improve coordination, scheduling, risk management, and progress reporting on construction sites. The system provides a centralized environment where project stakeholders can effectively collaborate throughout the construction process.

## Problem Statement
Construction projects often experience delays, cost overruns, and coordination problems due to fragmented communication, unclear task responsibilities, and late identification of risks. Tasks are frequently tracked using disconnected tools or manual methods, making it difficult to monitor progress in real time and respond proactively to issues.

## Proposed Solution
SCSCS addresses these challenges by offering a centralized platform that organizes construction activities into structured tasks and work packages. The system enables clear task assignment, real-time progress tracking, risk reporting and mitigation, and weekly progress reporting to support informed decision-making and effective project management.

## Project Objectives
- Improve coordination between construction project stakeholders
- Enhance task visibility and responsibility tracking
- Identify and manage risks at an early stage
- Support schedule management and progress monitoring
- Apply project management principles in a realistic construction use case

## Project Management Tools
- Jira Software for task and workflow management
- GitHub for version control and repository hosting
- PlantUML or draw.io for UML diagrams
- Microsoft Excel for planning, budgeting, and risk tracking

## Repository Structure
docs/
- `Class_Diagram.md`
- `Class_Diagram.puml`
- `Risk_Analysis_and_Testing_Plan.md`
- `Risk_Updates.md`
- `Sprint_Board.md`
- `Demo_Plan.md`
- `Project Description.pdf`
- `Smart_Construction_Site_Project_Plan.xlsx`
- `UML diagram.png`

src/
- `index.js`
- `models/`
- `services/`

test/
- `system.test.js`

.github/workflows/
- `ci.yml`

## Additional Project Documentation
- [Class Diagram](docs/Class_Diagram.md)
- [PlantUML Class Diagram](docs/Class_Diagram.puml)
- [Risk Analysis, Security, Roadmap, and Testing Plan](docs/Risk_Analysis_and_Testing_Plan.md)
- [Risk Updates](docs/Risk_Updates.md)
- [Sprint Board](docs/Sprint_Board.md)
- [Demo Plan](docs/Demo_Plan.md)

## MVP Source Code
The repository now includes a minimal runnable MVP that demonstrates:

- user role registration
- task creation and status tracking
- risk reporting and mitigation workflow
- weekly progress report generation
- dashboard snapshot reporting

The core implementation follows object-oriented design with:

- encapsulated state through private fields
- inheritance for user roles and work-item types
- polymorphic permission behavior across user subclasses

Run the MVP locally with:

```bash
npm start
```

Run automated tests with:

```bash
npm test
```

## CI/CD
GitHub Actions is configured in `.github/workflows/ci.yml` to run the automated test suite on every push and pull request to `main`.

## Jira Task Management
All project tasks were managed using Jira Software. Tasks were tracked through different workflow stages such as To Do, In Progress, Review, and Done to demonstrate task planning and progress monitoring.

## Notes
This repository contains project planning artifacts, documentation, and a minimal MVP implementation prepared for the Project Management course.
