export class User {
  #id;
  #name;
  #role;

  constructor(id, name, role) {
    this.#id = id;
    this.#name = name;
    this.#role = role;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get role() {
    return this.#role;
  }

  canManageTasks() {
    return true;
  }

  canManageRisks() {
    return true;
  }

  canGenerateReports() {
    return false;
  }

  getPermissions() {
    return {
      manageTasks: this.canManageTasks(),
      manageRisks: this.canManageRisks(),
      generateReports: this.canGenerateReports()
    };
  }
}
