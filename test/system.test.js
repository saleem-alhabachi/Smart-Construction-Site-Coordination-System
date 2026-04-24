import test from "node:test";
import assert from "node:assert/strict";

import { ProjectManager } from "../src/models/ProjectManager.js";
import { SiteEngineer } from "../src/models/SiteEngineer.js";
import { SmartConstructionSystem } from "../src/services/SmartConstructionSystem.js";
import { Subcontractor } from "../src/models/Subcontractor.js";

test("project manager can generate a weekly report", () => {
  const system = new SmartConstructionSystem();
  const manager = system.registerUser(new ProjectManager("U1", "Saleem"));
  const engineer = system.registerUser(new SiteEngineer("U2", "Waleed"));

  const task = system.createTask("T1", "Inspect scaffolding", "Run safety inspection.", engineer, "2099-05-01");
  task.updateStatus("Done");

  system.reportRisk("R1", "Late supplier delivery", "Medium", "Follow up with supplier.", engineer);

  const report = system.generateWeeklyReport(manager);

  assert.equal(report.totalTasks, 1);
  assert.equal(report.completedTasks, 1);
  assert.equal(report.openRisks, 1);
});

test("non-project-manager cannot generate weekly reports", () => {
  const system = new SmartConstructionSystem();
  const engineer = system.registerUser(new SiteEngineer("U2", "Waleed"));

  assert.throws(() => {
    system.generateWeeklyReport(engineer);
  }, /Only the Project Manager/);
});

test("dashboard snapshot reflects active project state", () => {
  const system = new SmartConstructionSystem();
  const manager = system.registerUser(new ProjectManager("U1", "Saleem"));
  const engineer = system.registerUser(new SiteEngineer("U2", "Waleed"));

  system.createTask("T1", "Review concrete plan", "Validate work package.", manager, "2099-06-01");
  system.reportRisk("R1", "Equipment downtime", "High", "Prepare backup equipment.", engineer);

  const snapshot = system.getDashboardSnapshot();

  assert.equal(snapshot.totalUsers, 2);
  assert.equal(snapshot.totalTasks, 1);
  assert.equal(snapshot.activeRisks, 1);
});

test("subcontractor cannot be assigned as task manager or risk reporter", () => {
  const system = new SmartConstructionSystem();
  const subcontractor = system.registerUser(new Subcontractor("U3", "Mohammed"));

  assert.throws(() => {
    system.createTask("T1", "Receive materials", "Confirm unloading.", subcontractor, "2099-07-01");
  }, /can manage construction tasks/);

  assert.throws(() => {
    system.reportRisk("R1", "Storage issue", "Medium", "Move stock to backup zone.", subcontractor);
  }, /can manage project risks/);
});
