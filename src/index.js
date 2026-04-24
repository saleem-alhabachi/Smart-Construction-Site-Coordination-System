import { ProjectManager } from "./models/ProjectManager.js";
import { SiteEngineer } from "./models/SiteEngineer.js";
import { SmartConstructionSystem } from "./services/SmartConstructionSystem.js";
import { Subcontractor } from "./models/Subcontractor.js";

const system = new SmartConstructionSystem();

const projectManager = system.registerUser(new ProjectManager("U1", "Saleem Alhabachi"));
const siteEngineer = system.registerUser(new SiteEngineer("U2", "Waleed"));
const subcontractor = system.registerUser(new Subcontractor("U3", "Mohammed"));

const foundationTask = system.createTask(
  "T1",
  "Prepare foundation work package",
  "Coordinate labor, concrete delivery, and safety checks.",
  siteEngineer,
  "2026-05-01"
);
foundationTask.updateStatus("In Progress");

const materialsTask = system.createTask(
  "T2",
  "Track material delivery schedule",
  "Monitor procurement and update delivery deadlines.",
  projectManager,
  "2026-05-03"
);
materialsTask.updateStatus("Done");

const weatherRisk = system.reportRisk(
  "R1",
  "Severe weather may delay concrete pouring",
  "High",
  "Reschedule critical work and maintain a two-day buffer.",
  siteEngineer
);
weatherRisk.review();

const report = system.generateWeeklyReport(projectManager);

console.log("Dashboard Snapshot");
console.log(system.getDashboardSnapshot());
console.log("");
console.log("Tasks");
console.log(system.listTasks());
console.log("");
console.log("Risks");
console.log(system.listRisks());
console.log("");
console.log("Work Items");
console.log(system.listWorkItems());
console.log("");
console.log("Weekly Report");
console.log(report);
