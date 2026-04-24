import { User } from "./User.js";

export class Subcontractor extends User {
  constructor(id, name) {
    super(id, name, "Subcontractor/Foreman");
  }

  canManageTasks() {
    return false;
  }

  canManageRisks() {
    return false;
  }

  canGenerateReports() {
    return false;
  }
}
