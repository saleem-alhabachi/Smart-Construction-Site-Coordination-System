export class WorkItem {
  #id;
  #title;
  #status;

  constructor(id, title, initialStatus) {
    this.#id = id;
    this.#title = title;
    this.#status = initialStatus;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get status() {
    return this.#status;
  }

  updateStatus(status) {
    this.#status = status;
  }
}
