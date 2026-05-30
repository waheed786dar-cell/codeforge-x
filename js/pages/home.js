// ============================================
// CODEFORGE X — Home Page
// Stats + Recent Activity
// ============================================

const HomePage = {
  onEnter() {
    this.updateStats();
    this.loadRecentActivity();
    this.updateBottomNav();
  },

  async updateStats() {
    const stats = App.stats;
    this.animateCounter('stat-total', stats.totalGenerated);
    this.animateCounter('stat-qr', stats.qrGenerated);
    this.animateCounter('stat-barcode', stats.barcodeGenerated);
    this.animateCounter('stat-code', stats.codeGenerated);
  },

  animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const duration = 800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Utils.formatNumber(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
  },

  async loadRecentActivity() {
    const list = document.getElementById('recent-list');
    if (!list) return;

    try {
      const history = await DB.getAll('history');
      const recent = history
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      if (recent.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">✦</div>
            <div class="empty-text">No activity yet</div>
            <div class="empty-sub">Start generating to see history</div>
          </div>`;
        return;
      }

      list.innerHTML = recent.map(item => `
        <div class="recent-item" onclick="Router.navigate('${item.type}-generator')">
          <div class="recent-icon">${this.getTypeIcon(item.type)}</div>
          <div class="recent-info">
            <div class="recent-title">${item.title || 'Untitled'}</div>
            <div class="recent-meta">${item.type.toUpperCase()} • ${Utils.formatDate(item.createdAt)}</div>
          </div>
          <div class="recent-arrow">→</div>
        </div>
      `).join('');
    } catch(e) {
      console.error('History load error:', e);
    }
  },

  getTypeIcon(type) {
    const icons = { qr: '▦', barcode: '▐▌', code: '{ }', scan: '◎' };
    return icons[type] || '✦';
  },

  updateBottomNav() {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('[data-page="home"]').forEach(n => n.classList.add('active'));
  }
};
