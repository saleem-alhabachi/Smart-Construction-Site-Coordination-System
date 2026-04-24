import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemoSystem } from "./demoData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

function getContentType(filePath) {
  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }
  if (filePath.endsWith(".js")) {
    return "application/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }
  return "text/html; charset=utf-8";
}

function buildDashboardPayload() {
  const { system, users } = buildDemoSystem();

  return {
    snapshot: system.getDashboardSnapshot(),
    users: system.listUsers(),
    tasks: system.listTasks(),
    risks: system.listRisks(),
    workItems: system.listWorkItems(),
    report: system.generateWeeklyReport(users.projectManager)
  };
}

const server = http.createServer(async (request, response) => {
  const url = request.url ?? "/";

  if (url === "/api/dashboard") {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(buildDashboardPayload()));
    return;
  }

  const safePath = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  const filePath = path.resolve(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const file = await readFile(filePath);
    response.writeHead(200, { "Content-Type": getContentType(filePath) });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`Smart Construction Site Coordination System running at http://localhost:${port}`);
});
