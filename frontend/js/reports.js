/* reports.js - Weekly report viewer */
const Reports = {
  async load() {
    const el = document.getElementById('report-content');
    el.innerHTML = '<div style="text-align:center;padding:40px"><span class="spinner"></span><p class="text-muted" style="margin-top:12px">Click "Generate Weekly Report" to view the latest report.</p></div>';
  },

  async generate() {
    const el = document.getElementById('report-content');
    el.innerHTML = '<div style="text-align:center;padding:40px"><span class="spinner"></span><p class="text-muted" style="margin-top:12px">Generating report...</p></div>';
    try {
      const r = await API.get('/reports/weekly');
      el.innerHTML = `
        <div class="report-header">
          <h3>Weekly Progress Report</h3>
          <p>Generated: ${new Date(r.generated_at).toLocaleString()}</p>
        </div>
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat__value">${r.total_tasks}</div><div class="report-stat__label">Total Tasks</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--status-done)">${r.completed_tasks}</div><div class="report-stat__label">Completed</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--status-progress)">${r.in_progress_tasks}</div><div class="report-stat__label">In Progress</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--severity-critical)">${r.overdue_tasks}</div><div class="report-stat__label">Overdue</div></div>
          <div class="report-stat"><div class="report-stat__value">${r.total_risks}</div><div class="report-stat__label">Total Risks</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--severity-high)">${r.open_risks}</div><div class="report-stat__label">Open Risks</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--severity-low)">${r.mitigated_risks}</div><div class="report-stat__label">Mitigated</div></div>
          <div class="report-stat"><div class="report-stat__value" style="color:var(--status-done)">${r.closed_risks}</div><div class="report-stat__label">Closed</div></div>
        </div>
        <div class="report-summary"><p>${r.summary}</p></div>
      `;
    } catch (e) { el.innerHTML = '<p class="text-muted">Failed to generate report: ' + e.message + '</p>'; }
  }
};
