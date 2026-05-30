// ============================================
// CODEFORGE X — Router v2.0 (Speed Optimized)
// Instant navigation, pre-render, page pool
// ============================================

const Router = {
  currentPage: null,
  history: [],
  pages: {},
  pageCache: new Map(),
  transitioning: false,

  register(pageId, pageObject) {
    this.pages[pageId] = pageObject || { onEnter(){}, onLeave(){} };
  },

  async navigate(pageId, data = {}, addToHistory = true) {
    // Duplicate navigation prevent
    if (this.transitioning || this.currentPage === pageId) return;
    this.transitioning = true;

    const pageObj = this.pages[pageId];
    if (!pageObj) {
      console.error('Page not registered:', pageId);
      this.transitioning = false;
      return;
    }

    const newEl = document.getElementById('page-' + pageId);
    if (!newEl) {
      console.error('DOM element missing: page-' + pageId);
      this.transitioning = false;
      return;
    }

    // History
    if (addToHistory && this.currentPage && this.currentPage !== pageId) {
      this.history.push(this.currentPage);
      if (this.history.length > 20) this.history.shift();
    }

    // Previous page hide (fast)
    if (this.currentPage) {
      const prevEl = document.getElementById('page-' + this.currentPage);
      if (prevEl) {
        prevEl.classList.remove('page-active');
        // Defer hide to avoid layout thrash
        setTimeout(() => {
          if (prevEl.classList.contains('page-active')) return;
          prevEl.style.display = 'none';
          Perf.demoteLayer(prevEl);
        }, 280);
      }
      const prevObj = this.pages[this.currentPage];
      if (prevObj?.onLeave) prevObj.onLeave();
    }

    this.currentPage = pageId;

    // Show new page instantly
    newEl.style.display = 'flex';
    Perf.promoteLayer(newEl);

    // Double RAF for smooth paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newEl.classList.add('page-active');
        this.transitioning = false;
      });
    });

    window.location.hash = pageId;
    this.updateBottomNav(pageId);

    // onEnter in next tick (don't block paint)
    if (pageObj?.onEnter) {
      setTimeout(() => pageObj.onEnter(data), 60);
    }

    // Sound + haptic
    if (typeof SoundSystem !== 'undefined') SoundSystem.tap();
    if (typeof HapticSystem !== 'undefined') HapticSystem.play('navigate');
  },

  back() {
    if (this.transitioning) return;
    if (this.history.length > 0) {
      this.navigate(this.history.pop(), {}, false);
      if (typeof SoundSystem !== 'undefined') SoundSystem.back();
    } else {
      this.navigate('home', {}, false);
    }
  },

  updateBottomNav(pageId) {
    // Batch DOM reads then writes
    const items = document.querySelectorAll('.nav-item');
    const updates = [];
    items.forEach(item => {
      updates.push({ el: item, active: item.dataset.page === pageId });
    });
    // Single write pass
    Perf.scheduleRender(() => {
      updates.forEach(({ el, active }) => {
        el.classList.toggle('active', active);
      });
    });
  },

  initHashListener() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && this.pages[hash] && hash !== this.currentPage) {
        this.navigate(hash, {}, false);
      }
    });
  },

  initBackGesture() {
    let startX = 0;
    let startY = 0;
    let swiping = false;

    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = startX < 30;
    }, { passive: true });

    document.addEventListener('touchmove', e => {
      if (!swiping) return;
      const dx = e.touches[0].clientX - startX;
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 0 && dy < 50) {
        const progress = Math.min(dx / 120, 1);
        const currentEl = document.getElementById('page-' + this.currentPage);
        if (currentEl) {
          currentEl.style.transform = `translateX(${dx * 0.4}px)`;
          currentEl.style.opacity = 1 - progress * 0.3;
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', e => {
      if (!swiping) return;
      const dx = e.changedTouches[0].clientX - startX;
      const currentEl = document.getElementById('page-' + this.currentPage);

      if (dx > 80) {
        this.back();
      } else if (currentEl) {
        currentEl.style.transform = '';
        currentEl.style.opacity = '';
      }
      swiping = false;
    }, { passive: true });
  }
};	
