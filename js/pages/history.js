// ============================================
// CODEFORGE X — History Page
// ============================================

const HistoryPage = {
  async onEnter() {
    await this.loadHistory();
  },

  async loadHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;

    const history = await DB.getAll('history');
    const sorted = history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (!sorted.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🕐</div>
          <div class="empty-text">No history yet</div>
          <div class="empty-sub">Your activity will appear here</div>
        </div>`;
      return;
    }

    list.innerHTML = sorted.map(item => `
      <div class="history-item" onclick="Router.navigate('${item.type}-generator')">
        <div class="history-type-badge">${item.type?.toUpperCase()}</div>
        <div class="recent-info">
          <div class="recent-title">${item.title || 'Untitled'}</div>
          <div class="recent-meta">${Utils.formatDate(item.createdAt)}</div>
        </div>
        <div class="recent-arrow">→</div>
      </div>
    `).join('');
  },

  async clearAll() {
    if (!confirm('Clear all history?')) return;
    await DB.clearStore('history');
    await this.loadHistory();
    Utils.showToast('History cleared', 'success');
  }
};
