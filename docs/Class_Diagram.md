# Class Diagram

The following class diagram represents the main object-oriented structure of the Smart Construction Site Coordination System MVP.

```mermaid
classDiagram
    class User {
        -id
        -name
        -role
        +canManageTasks()
        +canManageRisks()
        +canGenerateReports()
        +getPermissions()
    }

    class ProjectManager {
        +canGenerateReports()
    }

    class SiteEngineer {
        +canGenerateReports()
    }

    class Subcontractor {
        +canManageTasks()
        +canManageRisks()
        +canGenerateReports()
    }

    class WorkItem {
        -id
        -title
        -status
        +updateStatus(status)
    }

    class Task {
        -description
        -assignee
        -deadline
        +assignTo(user)
        +toJSON()
    }

    class Risk {
        -severity
        -mitigationPlan
        -reportedBy
        +review()
        +mitigate()
        +close()
        +toJSON()
    }

    class ProgressReport {
        -generatedAt
        -tasks
        -risks
        +summarize()
        +toJSON()
    }

    class SmartConstructionSystem {
        -users
        -tasks
        -risks
        +registerUser(user)
        +createTask(id, title, description, assignee, deadline)
        +reportRisk(id, title, severity, mitigationPlan, reportedBy)
        +generateWeeklyReport(requestedBy)
        +getDashboardSnapshot()
        +listTasks()
        +listRisks()
        +listWorkItems()
    }

    User <|-- ProjectManager
    User <|-- SiteEngineer
    User <|-- Subcontractor
    WorkItem <|-- Task
    WorkItem <|-- Risk
    SmartConstructionSystem --> User
    SmartConstructionSystem --> Task
    SmartConstructionSystem --> Risk
    SmartConstructionSystem --> ProgressReport
    Task --> User : assigned to
    Risk --> User : reported by
```

## Object-Oriented Design Notes

- Encapsulation is applied through private class fields such as `#id`, `#status`, and `#role`.
- Inheritance is used in the `User` hierarchy and the `WorkItem` hierarchy.
- Polymorphism is used when different user subclasses respond differently to the same permission methods.
