import { ProjectManager } from "./models/ProjectManager.js";
import { SiteEngineer } from "./models/SiteEngineer.js";
import { SmartConstructionSystem } from "./services/SmartConstructionSystem.js";
import { Subcontractor } from "./models/Subcontractor.js";

export function buildDemoSystem() {
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

  const safetyTask = system.createTask(
    "T3",
    "Inspect scaffolding zones",
    "Verify equipment stability and worker access points.",
    siteEngineer,
    "2026-05-06"
  );
  safetyTask.updateStatus("Review");

  const weatherRisk = system.reportRisk(
    "R1",
    "Severe weather may delay concrete pouring",
    "High",
    "Reschedule critical work and maintain a two-day buffer.",
    siteEngineer
  );
  weatherRisk.review();

  const deliveryRisk = system.reportRisk(
    "R2",
    "Material delivery congestion at site entrance",
    "Medium",
    "Stagger truck arrivals and assign unloading windows.",
    projectManager
  );
  deliveryRisk.mitigate();

  return {
    system,
    users: {
      projectManager,
      siteEngineer,
      subcontractor
    }
  };
}
