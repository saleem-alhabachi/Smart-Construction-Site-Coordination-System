import { User } from "./User.js";

export class ProjectManager extends User {
  constructor(id, name) {
    super(id, name, "Project Manager");
  }

  canGenerateReports() {
    return true;
  }
}
