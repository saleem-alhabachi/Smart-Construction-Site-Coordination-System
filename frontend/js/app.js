/* app.js - SPA router, navigation, modals, toasts */
const App = {
  currentPage: 'dashboard',

  async init() {
    Auth.init();

    if (Auth.isLoggedIn()) {
      try {
        await Auth.loadUser();
        AI.init();
        this.showApp();
      } catch (e) {
        // Token invalid, show login
        this.showLogin();
      }
    } else {
      this.showLogin();
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) this.navigate(page);
      });
    });

    // Sidebar toggle (mobile)
    document.getElementById('btn-sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) this.closeModal();
    });

    // Action buttons
    document.getElementById('btn-new-task').addEventListener('click', () => Tasks.showCreateModal());
    document.getElementById('btn-new-risk').addEventListener('click', () => Risks.showCreateModal());
    document.getElementById('btn-generate-report').addEventListener('click', () => Reports.generate());

    // Hash navigation
    window.addEventListener('hashchange', () => {
      const page = location.hash.replace('#', '') || 'dashboard';
      if (Auth.isLoggedIn()) this.navigate(page, false);
    });
  },

  showLogin() {
    document.getElementById('page-login').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
  },

  showApp() {
    document.getElementById('page-login').style.display = 'none';
    document.getElementById('app-shell').style.display = 'flex';
    var page = location.hash.replace('#', '') || 'dashboard';
    this.navigate(page, false);
  },

  navigate(page, pushHash = true) {
    this.currentPage = page;
    if (pushHash) location.hash = page;

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const active = document.querySelector('.nav-link[data-page="' + page + '"]');
    if (active) active.classList.add('active');

    // Show view
    document.querySelectorAll('.view').forEach(function(v) { v.style.display = 'none'; });
    var view = document.getElementById('view-' + page);
    if (view) view.style.display = 'block';

    // Update topbar title
    const titles = { dashboard: 'Dashboard', tasks: 'Task Board', risks: 'Risk Tracker', users: 'Team Management', ai: 'AI Assistant', reports: 'Reports' };
    document.getElementById('page-title').textContent = titles[page] || page;

    // Load data
    this.loadPageData(page);

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
  },

  async loadPageData(page) {
    try {
      switch (page) {
        case 'dashboard': await Dashboard.load(); break;
        case 'tasks': await Tasks.load(); break;
        case 'risks': await Risks.load(); break;
        case 'users': await Users.load(); break;
        case 'reports': await Reports.load(); break;
        case 'ai': AI.checkStatus(); break;
      }
    } catch (e) {
      // Silently handle load errors - individual modules show their own errors
    }
  },

  showModal(title, bodyHTML) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-overlay').classList.add('active');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('modal-body').innerHTML = '';
  },

  toast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = 'toast toast--' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 300); }, 4000);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', function() { App.init(); });
