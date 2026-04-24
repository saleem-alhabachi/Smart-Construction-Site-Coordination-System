function statusClass(value) {
  return String(value).toLowerCase().replace(/\s+/g, "-");
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function createStatCard(label, value, tone) {
  return `
    <article class="stat-card">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function createTaskCard(task) {
  return `
    <article class="task-card">
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <div class="meta-row">
        <span class="badge status-${statusClass(task.status)}">${task.status}</span>
        <span class="badge role">${task.assignee}</span>
        <span>Deadline: ${task.deadline}</span>
      </div>
    </article>
  `;
}

function createRiskCard(risk) {
  return `
    <article class="risk-card">
      <h3>${risk.title}</h3>
      <p>${risk.mitigationPlan}</p>
      <div class="meta-row">
        <span class="badge severity-${statusClass(risk.severity)}">${risk.severity} Severity</span>
        <span class="badge status-${statusClass(risk.status)}">${risk.status}</span>
        <span>Reported by ${risk.reportedBy}</span>
      </div>
    </article>
  `;
}

function createUserCard(user) {
  const permissions = Object.entries(user.permissions)
    .filter(([, allowed]) => allowed)
    .map(([name]) => `<span class="permission-chip">${name}</span>`)
    .join("");

  return `
    <article class="user-card">
      <h3>${user.name}</h3>
      <span>${user.role}</span>
      <div class="permission-row">${permissions || "<span class='permission-chip'>View only</span>"}</div>
    </article>
  `;
}

function createTimelineItem(item) {
  return `
    <article class="timeline-item">
      <h3>${item.title}</h3>
      <span class="badge status-${statusClass(item.status)}">${item.status}</span>
    </article>
  `;
}

async function init() {
  const response = await fetch("/api/dashboard");
  const data = await response.json();

  document.getElementById("reportTimestamp").textContent = formatDate(data.report.generatedAt);
  document.getElementById("completedTasks").textContent = data.report.completedTasks;
  document.getElementById("openRisks").textContent = data.report.openRisks;

  document.getElementById("statsGrid").innerHTML = [
    createStatCard("Registered Users", data.snapshot.totalUsers),
    createStatCard("Tracked Tasks", data.snapshot.totalTasks),
    createStatCard("Active Risks", data.snapshot.activeRisks),
    createStatCard("Overdue Tasks", data.snapshot.overdueTasks)
  ].join("");

  document.getElementById("taskList").innerHTML = data.tasks.map(createTaskCard).join("");
  document.getElementById("riskList").innerHTML = data.risks.map(createRiskCard).join("");
  document.getElementById("userList").innerHTML = data.users.map(createUserCard).join("");
  document.getElementById("workItemTimeline").innerHTML = data.workItems.map(createTimelineItem).join("");
}

init().catch((error) => {
  document.body.innerHTML = `<pre>Failed to load dashboard: ${error.message}</pre>`;
});
