/* dashboard.js - KPI cards and charts */
const Dashboard = {
  async load() {
    try {
      const data = await API.get('/dashboard');
      this.renderKPIs(data);
      this.renderTasksChart(data.tasks_by_status);
      this.renderRisksChart(data.risks_by_severity);
    } catch (e) {
      App.toast('Failed to load dashboard: ' + e.message, 'error');
    }
  },

  renderKPIs(d) {
    const grid = document.getElementById('dashboard-grid');
    grid.innerHTML = `
      <div class="kpi-card kpi-card--tasks"><div class="kpi-card__label">Total Tasks</div><div class="kpi-card__value">${d.total_tasks}</div></div>
      <div class="kpi-card kpi-card--done"><div class="kpi-card__label">Completed</div><div class="kpi-card__value">${d.completed_tasks}</div></div>
      <div class="kpi-card kpi-card--risks"><div class="kpi-card__label">Active Risks</div><div class="kpi-card__value">${d.active_risks}</div></div>
      <div class="kpi-card kpi-card--overdue"><div class="kpi-card__label">Overdue</div><div class="kpi-card__value">${d.overdue_tasks}</div></div>
      <div class="kpi-card kpi-card--users"><div class="kpi-card__label">Team Members</div><div class="kpi-card__value">${d.total_users}</div></div>
    `;
  },

  renderTasksChart(byStatus) {
    const el = document.getElementById('tasks-chart');
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0) || 1;
    const colors = { 'To Do': 'var(--status-todo)', 'In Progress': 'var(--status-progress)', 'Review': 'var(--status-review)', 'Done': 'var(--status-done)' };
    el.innerHTML = Object.entries(byStatus).map(([k, v]) => `
      <div class="chart-bar-group">
        <div class="chart-bar-label"><span>${k}</span><span>${v}</span></div>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(v/total)*100}%;background:${colors[k]||'var(--accent-primary)'}"></div></div>
      </div>
    `).join('');
  },

  renderRisksChart(bySev) {
    const el = document.getElementById('risks-chart');
    const total = Object.values(bySev).reduce((a, b) => a + b, 0) || 1;
    const colors = { 'Low': 'var(--severity-low)', 'Medium': 'var(--severity-medium)', 'High': 'var(--severity-high)', 'Critical': 'var(--severity-critical)' };
    el.innerHTML = Object.entries(bySev).map(([k, v]) => `
      <div class="chart-bar-group">
        <div class="chart-bar-label"><span>${k}</span><span>${v}</span></div>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(v/total)*100}%;background:${colors[k]||'var(--accent-primary)'}"></div></div>
      </div>
    `).join('');
  }
};
