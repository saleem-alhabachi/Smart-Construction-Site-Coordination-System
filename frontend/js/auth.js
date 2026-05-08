/* auth.js - Login, register, token management */
const Auth = {
  currentUser: null,

  init() {
    document.getElementById('form-login').addEventListener('submit', e => { e.preventDefault(); this.login(); });
    document.getElementById('form-register').addEventListener('submit', e => { e.preventDefault(); this.register(); });
    document.getElementById('btn-logout').addEventListener('click', () => this.logout());
  },

  async login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.hidden = true;
    try {
      const data = await API.post('/auth/token', { email, password });
      API.setToken(data.access_token);
      await this.loadUser();
      App.showApp();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.hidden = false;
    }
  },

  async register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const errEl = document.getElementById('register-error');
    const sucEl = document.getElementById('register-success');
    errEl.hidden = true; sucEl.hidden = true;
    try {
      await API.post('/auth/register', { name, email, password, role });
      sucEl.textContent = 'Account created. You can now sign in.';
      sucEl.hidden = false;
      document.getElementById('form-register').reset();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.hidden = false;
    }
  },

  async loadUser() {
    try {
      this.currentUser = await API.get('/users/me');
      document.getElementById('sidebar-user-name').textContent = this.currentUser.name;
      document.getElementById('sidebar-user-role').textContent = this.currentUser.role.replace('_', ' ');
      // Show/hide users nav based on role
      const usersNav = document.getElementById('nav-users');
      if (usersNav) usersNav.style.display = this.currentUser.role === 'project_manager' ? '' : 'none';
    } catch (e) {
      this.logout();
    }
  },

  logout() {
    API.clearToken();
    this.currentUser = null;
    location.reload();
  },

  isLoggedIn() { return !!API.getToken(); },
  isManager() { return this.currentUser?.role === 'project_manager'; }
};
