/* users.js - User management (PM only) */
const Users = {
  async load() {
    try {
      var users = await API.get('/users');
      this.render(users);
    } catch (e) {
      // Non-PM users will get 403 - show message instead of error
      var el = document.getElementById('users-list');
      el.innerHTML = '<div class="card" style="text-align:center;padding:40px"><p class="text-muted">User management is available for Project Managers only.</p></div>';
    }
  },

  render(users) {
    var el = document.getElementById('users-list');
    if (!users.length) { el.innerHTML = '<p class="text-muted">No users found.</p>'; return; }
    el.innerHTML = users.map(function(u) {
      var deleteBtn = '';
      if (Auth.currentUser && Auth.currentUser.id !== u.id) {
        deleteBtn = '<button class="btn btn--ghost btn--small" onclick="Users.showDeleteConfirm(\'' + u.id + '\')">Remove</button>';
      }
      return '<div class="user-card">' +
        '<div class="user-card__name">' + Users.esc(u.name) + '</div>' +
        '<div class="user-card__email">' + Users.esc(u.email) + '</div>' +
        '<div class="user-card__role">' + u.role.replace('_', ' ') + '</div>' +
        '<div class="user-card__footer">' +
          '<span class="user-card__date">Joined ' + new Date(u.created_at).toLocaleDateString() + '</span>' +
          deleteBtn +
        '</div>' +
      '</div>';
    }).join('');
  },

  showDeleteConfirm(id) {
    var html = '<p style="margin-bottom:16px">Are you sure you want to remove this user?</p>' +
      '<div style="display:flex;gap:10px">' +
        '<button class="btn btn--danger btn--full" onclick="Users.deleteUser(\'' + id + '\')">Remove</button>' +
        '<button class="btn btn--ghost btn--full" onclick="App.closeModal()">Cancel</button>' +
      '</div>';
    App.showModal('Remove User', html);
  },

  async deleteUser(id) {
    try {
      App.closeModal();
      await API.del('/users/' + id);
      await this.load();
      App.toast('User removed', 'success');
    } catch (e) { App.toast(e.message, 'error'); }
  },

  esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
};
