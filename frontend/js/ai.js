/* ai.js - AI chat + analysis panel */
const AI = {
  chatHistory: [],

  init() {
    document.getElementById('ai-chat-form').addEventListener('submit', e => { e.preventDefault(); this.sendChat(); });
    document.getElementById('btn-ai-analyze').addEventListener('click', () => this.runAnalysis());
    this.checkStatus();
  },

  async checkStatus() {
    const ind = document.getElementById('ai-status-indicator');
    try {
      const s = await API.get('/ai/status');
      ind.className = 'ai-status ' + (s.connected ? 'ai-status--online' : 'ai-status--offline');
      ind.querySelector('.ai-status__text').textContent = s.connected ? 'AI Online' : 'AI Offline';
    } catch { ind.className = 'ai-status ai-status--offline'; }
  },

  async sendChat() {
    const input = document.getElementById('ai-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    this.chatHistory.push({ role: 'user', content: msg });
    this.appendMessage('user', msg);
    this.appendMessage('assistant', '<span class="spinner"></span> Thinking...');
    try {
      const res = await API.post('/ai/chat', { messages: this.chatHistory });
      this.chatHistory.push({ role: 'assistant', content: res.reply });
      this.removeLastMessage();
      this.appendMessage('assistant', this.esc(res.reply));
    } catch (e) {
      this.removeLastMessage();
      this.appendMessage('assistant', 'Error: ' + this.esc(e.message));
    }
  },

  appendMessage(role, html) {
    const el = document.getElementById('ai-messages');
    const div = document.createElement('div');
    div.className = 'ai-message ai-message--' + role;
    div.innerHTML = '<p>' + html + '</p>';
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  },

  removeLastMessage() {
    const el = document.getElementById('ai-messages');
    if (el.lastChild) el.removeChild(el.lastChild);
  },

  async runAnalysis() {
    const type = document.getElementById('ai-analyze-type').value;
    const title = document.getElementById('ai-analyze-title').value.trim();
    const desc = document.getElementById('ai-analyze-desc').value.trim();
    const resultEl = document.getElementById('ai-analysis-result');
    if (!title || !desc) { App.toast('Please enter title and description', 'error'); return; }
    resultEl.hidden = false;
    resultEl.innerHTML = '<span class="spinner"></span> Analyzing...';
    try {
      const r = await API.post('/ai/analyze/' + type, { title, description: desc });
      resultEl.innerHTML = `
        <h4>Priority: ${this.esc(r.priority)} | Risk Level: ${this.esc(r.risk_level)}</h4>
        <h4>Estimated Effort</h4><p>${this.esc(r.estimated_effort)}</p>
        <h4>Summary</h4><p>${this.esc(r.summary)}</p>
        <h4>Recommendations</h4><ul>${r.recommendations.map(x => '<li>' + this.esc(x) + '</li>').join('')}</ul>
        <h4>Safety Concerns</h4><ul>${r.safety_concerns.map(x => '<li>' + this.esc(x) + '</li>').join('')}</ul>
        <h4>Resources Needed</h4><ul>${r.resources_needed.map(x => '<li>' + this.esc(x) + '</li>').join('')}</ul>
      `;
    } catch (e) { resultEl.innerHTML = 'Analysis failed: ' + this.esc(e.message); }
  },

  esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
};
