/* api.js - HTTP client with JWT injection */
const API = {
  base: '/api/v1',
  getToken() { return localStorage.getItem('scscs_token'); },
  setToken(t) { localStorage.setItem('scscs_token', t); },
  clearToken() { localStorage.removeItem('scscs_token'); },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    if (res.status === 401) {
      this.clearToken();
      // Only reload once - prevent infinite loops
      if (!window._scscs_reloading) {
        window._scscs_reloading = true;
        location.reload();
      }
      throw new Error('Session expired. Please log in again.');
    }
    if (res.status === 204) return null;
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.detail || 'Request failed');
    return data;
  },

  get(p) { return this.request('GET', p); },
  post(p, b) { return this.request('POST', p, b); },
  put(p, b) { return this.request('PUT', p, b); },
  patch(p, b) { return this.request('PATCH', p, b); },
  del(p) { return this.request('DELETE', p); },
};
