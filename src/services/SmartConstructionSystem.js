import { ProgressReport } from "../models/ProgressReport.js";
import { Risk } from "../models/Risk.js";
import { Task } from "../models/Task.js";

export class SmartConstructionSystem {
  #users;
  #tasks;
  #risks;

  constructor() {
    this.#users = [];
    this.#tasks = [];
    this.#risks = [];
  }

  registerUser(user) {
    this.#users.push(user);
    return user;
  }

  createTask(id, title, description, assignee, deadline) {
    if (!assignee || !assignee.canManageTasks()) {
      throw new Error("Tasks must be assigned to a user who can manage construction tasks.");
    }

    const task = new Task(id, title, description, assignee, deadline);
    this.#tasks.push(task);
    return task;
  }

  reportRisk(id, title, severity, mitigationPlan, reportedBy) {
    if (!reportedBy || !reportedBy.canManageRisks()) {
      throw new Error("Risks must be reported by a user who can manage project risks.");
    }

    const risk = new Risk(id, title, severity, mitigationPlan, reportedBy);
    this.#risks.push(risk);
    return risk;
  }

  generateWeeklyReport(requestedBy) {
    if (!requestedBy.canGenerateReports()) {
      throw new Error("Only the Project Manager can generate weekly reports.");
    }

    return new ProgressReport(this.#tasks, this.#risks).toJSON();
  }

  listWorkItems() {
    return [...this.#tasks, ...this.#risks].map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status
    }));
  }

  getDashboardSnapshot() {
    return {
      totalUsers: this.#users.length,
      totalTasks: this.#tasks.length,
      activeRisks: this.#risks.filter((risk) => risk.status !== "Closed").length,
      overdueTasks: this.#tasks.filter((task) => task.status !== "Done" && new Date(task.deadline) < new Date()).length
    };
  }

  listTasks() {
    return this.#tasks.map((task) => task.toJSON());
  }

  listRisks() {
    return this.#risks.map((risk) => risk.toJSON());
  }
}
