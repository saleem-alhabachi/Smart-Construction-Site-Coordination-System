export class ProgressReport {
  #generatedAt;
  #tasks;
  #risks;

  constructor(tasks, risks) {
    this.#generatedAt = new Date().toISOString();
    this.#tasks = tasks;
    this.#risks = risks;
  }

  get generatedAt() {
    return this.#generatedAt;
  }

  summarize() {
    const taskSummary = this.#tasks.reduce((summary, task) => {
      summary.total += 1;
      if (task.status === "Done") {
        summary.completed += 1;
      }
      return summary;
    }, { total: 0, completed: 0 });

    const openRisks = this.#risks.filter((risk) => risk.status !== "Closed").length;

    return {
      generatedAt: this.#generatedAt,
      totalTasks: taskSummary.total,
      completedTasks: taskSummary.completed,
      openRisks
    };
  }

  toJSON() {
    return this.summarize();
  }
}
