import { WorkItem } from "./WorkItem.js";

export class Task extends WorkItem {
  #description;
  #assignee;
  #deadline;

  constructor(id, title, description, assignee, deadline) {
    super(id, title, "To Do");
    this.#description = description;
    this.#assignee = assignee;
    this.#deadline = deadline;
  }

  get description() {
    return this.#description;
  }

  get assignee() {
    return this.#assignee;
  }

  get deadline() {
    return this.#deadline;
  }

  assignTo(user) {
    this.#assignee = user;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.#description,
      assignee: this.#assignee?.name ?? "Unassigned",
      deadline: this.#deadline,
      status: this.status
    };
  }
}
