import { User } from "./User.js";

export class SiteEngineer extends User {
  constructor(id, name) {
    super(id, name, "Site Engineer");
  }

  canGenerateReports() {
    return false;
  }
}
