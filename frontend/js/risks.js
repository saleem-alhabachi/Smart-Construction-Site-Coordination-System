/* risks.js - Risk CRUD + table */
const Risks = {
  risks: [],

  async load() {
    try {
      this.risks = await API.get('/risks');
      this.render();
    } catch (e) { App.toast('Failed to load risks: ' + e.message, 'error'); }
  },

  render() {
    var c = document.getElementById('risks-table-container');
    if (!this.risks.length) {
      c.innerHTML = '<div class="card" style="text-align:center;padding:40px"><p class="text-muted">No risks reported yet.</p></div>';
      return;
    }
    var badgeClass = function(s) { return ({ Low:'badge--low', Medium:'badge--medium', High:'badge--high', Critical:'badge--critical' })[s] || ''; };
    var statusBadge = function(s) { return ({ Open:'badge--high', 'In Review':'badge--medium', Mitigated:'badge--low', Closed:'badge--done' })[s] || ''; };
    var rows = this.risks.map(function(r) {
      return '<tr>' +
        '<td><strong>' + Risks.esc(r.title) + '</strong><br><span class="text-muted">' + Risks.esc(r.description).substring(0, 80) + '</span></td>' +
        '<td><span class="badge ' + badgeClass(r.severity) + '">' + r.severity + '</span></td>' +
        '<td><span class="badge ' + statusBadge(r.status) + '">' + r.status + '</span></td>' +
        '<td>' + (r.reporter ? Risks.esc(r.reporter.name) : '-') + '</td>' +
        '<td class="text-muted">' + new Date(r.created_at).toLocaleDateString() + '</td>' +
        '<td><div class="table-actions">' +
          '<button class="btn btn--ghost btn--small" onclick="Risks.showStatusModal(\'' + r.id + '\',\'' + r.status + '\')">Status</button>' +
          '<button class="btn btn--danger btn--small" onclick="Risks.showDeleteConfirm(\'' + r.id + '\')">Delete</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
    c.innerHTML = '<table class="data-table"><thead><tr><th>Title</th><th>Severity</th><th>Status</th><th>Reporter</th><th>Date</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table>';
  },

  showCreateModal() {
    var html = '<form id="form-create-risk">' +
      '<div class="form-group"><label class="form-label">Title</label><input type="text" id="cr-title" class="form-input" required minlength="3"></div>' +
      '<div class="form-group"><label class="form-label">Description</label><textarea id="cr-desc" class="form-input form-textarea" rows="3" required minlength="5"></textarea></div>' +
      '<div class="form-group"><label class="form-label">Severity</label><select id="cr-severity" class="form-input form-select"><option value="Low">Low</option><option value="Medium" selected>Medium</option><option value="High">High</option><option value="Critical">Critical</option></select></div>' +
      '<div class="form-group"><label class="form-label">Mitigation Plan</label><textarea id="cr-mitigation" class="form-input form-textarea" rows="3" required minlength="5"></textarea></div>' +
      '<button type="submit" class="btn btn--primary btn--full" style="margin-top:12px">Report Risk</button>' +
    '</form>';
    App.showModal('Report Risk', html);
    document.getElementById('form-create-risk').addEventListener('submit', async function(e) {
      e.preventDefault();
      try {
        await API.post('/risks', {
          title: document.getElementById('cr-title').value,
          description: document.getElementById('cr-desc').value,
          severity: document.getElementById('cr-severity').value,
          mitigation_plan: document.getElementById('cr-mitigation').value,
        });
        App.closeModal();
        await Risks.load();
        App.toast('Risk reported', 'success');
      } catch (err) { App.toast(err.message, 'error'); }
    });
  },

  showStatusModal(id, current) {
    var statuses = ['Open', 'In Review', 'Mitigated', 'Closed'];
    var options = statuses.map(function(s) { return '<option value="' + s + '"' + (s === current ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    var html = '<form id="form-risk-status">' +
      '<div class="form-group"><label class="form-label">New Status</label><select id="rs-status" class="form-input form-select">' + options + '</select></div>' +
      '<button type="submit" class="btn btn--primary btn--full" style="margin-top:12px">Update Status</button>' +
    '</form>';
    App.showModal('Update Risk Status', html);
    document.getElementById('form-risk-status').addEventListener('submit', async function(e) {
      e.preventDefault();
      try {
        await API.patch('/risks/' + id + '/status', { status: document.getElementById('rs-status').value });
        App.closeModal();
        await Risks.load();
        App.toast('Risk status updated', 'success');
      } catch (err) { App.toast(err.message, 'error'); }
    });
  },

  showDeleteConfirm(id) {
    var html = '<p style="margin-bottom:16px">Are you sure you want to delete this risk? This cannot be undone.</p>' +
      '<div style="display:flex;gap:10px">' +
        '<button class="btn btn--danger btn--full" onclick="Risks.deleteRisk(\'' + id + '\')">Delete</button>' +
        '<button class="btn btn--ghost btn--full" onclick="App.closeModal()">Cancel</button>' +
      '</div>';
    App.showModal('Delete Risk', html);
  },

  async deleteRisk(id) {
    try {
      App.closeModal();
      await API.del('/risks/' + id);
      await this.load();
      App.toast('Risk deleted', 'success');
    } catch (e) { App.toast(e.message, 'error'); }
  },

  esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
};
