/* tasks.js - Task CRUD + Kanban board */
const Tasks = {
  tasks: [],
  statuses: ['To Do', 'In Progress', 'Review', 'Done'],

  async load() {
    try {
      this.tasks = await API.get('/tasks');
      this.render();
    } catch (e) { App.toast('Failed to load tasks: ' + e.message, 'error'); }
  },

  render() {
    const board = document.getElementById('kanban-board');
    const statusColors = { 'To Do': 'var(--status-todo)', 'In Progress': 'var(--status-progress)', 'Review': 'var(--status-review)', 'Done': 'var(--status-done)' };
    board.innerHTML = this.statuses.map(function(s) {
      var items = Tasks.tasks.filter(function(t) { return t.status === s; });
      return '<div class="kanban-column">' +
        '<div class="kanban-column__header" style="border-top:3px solid ' + statusColors[s] + '">' +
          '<span class="kanban-column__title">' + s + '</span>' +
          '<span class="kanban-column__count">' + items.length + '</span>' +
        '</div>' +
        '<div class="kanban-column__body">' + items.map(function(t) { return Tasks.cardHTML(t, s); }).join('') + '</div>' +
      '</div>';
    }).join('');
  },

  cardHTML(t, currentStatus) {
    var nextIdx = this.statuses.indexOf(currentStatus) + 1;
    var prevIdx = this.statuses.indexOf(currentStatus) - 1;
    var actions = '';
    if (prevIdx >= 0) actions += '<button class="btn btn--ghost btn--small" onclick="Tasks.moveStatus(\'' + t.id + '\',\'' + this.statuses[prevIdx] + '\')" title="Move to ' + this.statuses[prevIdx] + '">&larr;</button>';
    if (nextIdx < this.statuses.length) actions += '<button class="btn btn--ghost btn--small" onclick="Tasks.moveStatus(\'' + t.id + '\',\'' + this.statuses[nextIdx] + '\')" title="Move to ' + this.statuses[nextIdx] + '">&rarr;</button>';
    actions += '<button class="btn btn--danger btn--small" onclick="Tasks.showDeleteConfirm(\'' + t.id + '\')" title="Delete">Delete</button>';
    var assignee = t.assignee ? t.assignee.name : 'Unassigned';
    var deadline = t.deadline || 'No deadline';
    return '<div class="kanban-card">' +
      '<div class="kanban-card__title">' + this.esc(t.title) + '</div>' +
      '<div class="kanban-card__desc">' + this.esc(t.description) + '</div>' +
      '<div class="kanban-card__footer">' +
        '<span class="kanban-card__assignee">' + this.esc(assignee) + '</span>' +
        '<span>' + deadline + '</span>' +
      '</div>' +
      '<div class="kanban-card__actions" style="margin-top:8px">' + actions + '</div>' +
    '</div>';
  },

  async moveStatus(id, newStatus) {
    try {
      await API.patch('/tasks/' + id + '/status', { status: newStatus });
      await this.load();
      App.toast('Task moved to ' + newStatus, 'success');
    } catch (e) { App.toast(e.message, 'error'); }
  },

  showDeleteConfirm(id) {
    var html = '<p style="margin-bottom:16px">Are you sure you want to delete this task? This cannot be undone.</p>' +
      '<div style="display:flex;gap:10px">' +
        '<button class="btn btn--danger btn--full" onclick="Tasks.deleteTask(\'' + id + '\')">Delete</button>' +
        '<button class="btn btn--ghost btn--full" onclick="App.closeModal()">Cancel</button>' +
      '</div>';
    App.showModal('Delete Task', html);
  },

  async deleteTask(id) {
    try {
      App.closeModal();
      await API.del('/tasks/' + id);
      await this.load();
      App.toast('Task deleted', 'success');
    } catch (e) { App.toast(e.message, 'error'); }
  },

  showCreateModal() {
    var html = '<form id="form-create-task">' +
      '<div class="form-group"><label class="form-label">Title</label><input type="text" id="ct-title" class="form-input" required minlength="3"></div>' +
      '<div class="form-group"><label class="form-label">Description</label><textarea id="ct-desc" class="form-input form-textarea" rows="3" required minlength="5"></textarea></div>' +
      '<div class="form-group"><label class="form-label">Deadline (YYYY-MM-DD)</label><input type="date" id="ct-deadline" class="form-input"></div>' +
      '<button type="submit" class="btn btn--primary btn--full" style="margin-top:12px">Create Task</button>' +
    '</form>';
    App.showModal('New Task', html);
    document.getElementById('form-create-task').addEventListener('submit', async function(e) {
      e.preventDefault();
      try {
        await API.post('/tasks', {
          title: document.getElementById('ct-title').value,
          description: document.getElementById('ct-desc').value,
          deadline: document.getElementById('ct-deadline').value || null,
        });
        App.closeModal();
        await Tasks.load();
        App.toast('Task created', 'success');
      } catch (err) { App.toast(err.message, 'error'); }
    });
  },

  esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
};
