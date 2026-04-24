import { WorkItem } from "./WorkItem.js";

export class Risk extends WorkItem {
  #severity;
  #mitigationPlan;
  #reportedBy;

  constructor(id, title, severity, mitigationPlan, reportedBy) {
    super(id, title, "Open");
    this.#severity = severity;
    this.#mitigationPlan = mitigationPlan;
    this.#reportedBy = reportedBy;
  }

  get severity() {
    return this.#severity;
  }

  get mitigationPlan() {
    return this.#mitigationPlan;
  }

  get reportedBy() {
    return this.#reportedBy;
  }

  review() {
    this.updateStatus("In Review");
  }

  mitigate() {
    this.updateStatus("Mitigated");
  }

  close() {
    this.updateStatus("Closed");
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      severity: this.#severity,
      status: this.status,
      mitigationPlan: this.#mitigationPlan,
      reportedBy: this.#reportedBy?.name ?? "Unknown"
    };
  }
}
