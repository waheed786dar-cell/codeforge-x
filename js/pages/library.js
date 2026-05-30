// ============================================
// CODEFORGE X — Library Page
// Grid view + Filter + Search
// ============================================

const LibraryPage = {
  items: [],
  filter: 'all',
  view: 'grid',

  async onEnter() {
    await this.loadItems();
    this.initSearch();
    this.initFilters();
  },

  async loadItems() {
    this.items = await DB.getAll('library');
    this.renderItems(this.items);
  },

  initSearch() {
    const search = document.getElementById('library-search');
    if (search) {
      search.addEventListener('input', Utils.debounce(() => {
        const q = search.value.toLowerCase();
        const filtered = this.items.filter(item =>
          item.title?.toLowerCase().includes(q) || item.data?.toLowerCase().includes(q)
        );
        this.renderItems(filtered);
      }, 300));
    }
  },

  initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filter = btn.dataset.filter;
        const filtered = this.filter === 'all' ? this.items :
          this.filter === 'favorite' ? this.items.filter(i => i.favorite) :
          this.items.filter(i => i.type === this.filter);
        this.renderItems(filtered);
        Utils.vibrate([20]);
      });
    });
  },

  renderItems(items) {
    const grid = document.getElementById('library-grid');
    if (!grid) return;

    if (!items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:span 2">
          <div class="empty-icon">📚</div>
          <div class="empty-text">Nothing here yet</div>
          <div class="empty-sub">Save codes to see them here</div>
        </div>`;
      return;
    }

    grid.innerHTML = items.reverse().map((item, idx) => `
      <div class="library-card" style="animation-delay:${idx * 0.04}s" onclick="LibraryPage.openItem(${item.id})">
        <div class="library-card-preview">
          ${item.image
            ? `<img src="${item.image}" style="width:80px;height:80px;object-fit:contain;border-radius:8px">`
            : item.svgData
              ? `<div style="transform:scale(0.5);transform-origin:center">${item.svgData}</div>`
              : `<span style="font-size:36px">${item.type === 'qr' ? '▦' : item.type === 'barcode' ? '▐▌' : '{ }'}</span>`
          }
        </div>
        <div class="library-card-info">
          <div class="library-card-title">${item.title || 'Untitled'}</div>
          <div class="library-card-meta">${item.type?.toUpperCase()} • ${Utils.formatDate(item.createdAt)}</div>
        </div>
        <div class="library-card-fav" onclick="event.stopPropagation(); LibraryPage.toggleFav(${item.id})">
          ${item.favorite ? '★' : '☆'}
        </div>
      </div>
    `).join('');

    // Animate in
    setTimeout(() => {
      grid.querySelectorAll('.library-card').forEach(card => card.classList.add('visible'));
    }, 50);
  },

  async toggleFav(id) {
    const item = await DB.get('library', id);
    if (item) {
      item.favorite = !item.favorite;
      await DB.update('library', item);
      await this.loadItems();
      Utils.vibrate([20]);
    }
  },

  async openItem(id) {
    const item = await DB.get('library', id);
    if (!item) return;
    Utils.showToast(`Opening ${item.type} code...`, 'info');
    Router.navigate(item.type + '-generator');
  },

  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
    const grid = document.getElementById('library-grid');
    if (grid) {
      grid.style.gridTemplateColumns = this.view === 'grid'
        ? 'repeat(2, 1fr)'
        : '1fr';
    }
    Utils.vibrate([20]);
  }
};
