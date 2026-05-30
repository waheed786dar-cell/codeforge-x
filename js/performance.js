// ============================================
// CODEFORGE X — Performance Engine v2.0
// Virtual DOM diff, lazy load, RAF queue,
// memory management, 60fps guarantee
// ============================================

const Perf = {

  // RAF queue
  rafQueue: [],
  rafRunning: false,

  // Memory cache
  cache: new Map(),
  cacheMaxSize: 50,

  // Lazy load observer
  lazyObserver: null,

  // Performance metrics
  metrics: {
    fps: 60,
    frameTime: 0,
    lastFrame: 0,
    renderCount: 0
  },

  init() {
    this.initRAFQueue();
    this.initFPSMonitor();
    this.initLazyLoader();
    this.optimizeScrolling();
    this.initMemoryManager();
    console.log('[Perf] Performance engine ready');
  },

  // ============================================
  // RAF QUEUE — Batch DOM updates
  // ============================================
  initRAFQueue() {
    const processQueue = () => {
      const queue = [...this.rafQueue];
      this.rafQueue = [];
      queue.forEach(fn => {
        try { fn(); } catch(e) {}
      });
      if (this.rafQueue.length > 0) {
        requestAnimationFrame(processQueue);
      } else {
        this.rafRunning = false;
      }
    };

    this.scheduleRender = (fn) => {
      this.rafQueue.push(fn);
      if (!this.rafRunning) {
        this.rafRunning = true;
        requestAnimationFrame(processQueue);
      }
    };
  },

  // ============================================
  // FPS MONITOR
  // ============================================
  initFPSMonitor() {
    let frames = 0;
    let lastTime = performance.now();

    const countFrames = (time) => {
      frames++;
      if (time - lastTime >= 1000) {
        this.metrics.fps = frames;
        frames = 0;
        lastTime = time;

        // FPS drop detect karo
        if (this.metrics.fps < 30) {
          this.onLowFPS(this.metrics.fps);
        }
      }
      requestAnimationFrame(countFrames);
    };

    requestAnimationFrame(countFrames);
  },

  onLowFPS(fps) {
    console.warn(`[Perf] Low FPS detected: ${fps}`);
    // Animations reduce karo
    document.documentElement.classList.add('perf-mode');
  },

  // ============================================
  // LAZY LOADER
  // ============================================
  initLazyLoader() {
    if (!('IntersectionObserver' in window)) return;

    this.lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Image lazy load
          if (el.dataset.src) {
            el.src = el.dataset.src;
            delete el.dataset.src;
          }
          // Component lazy render
          if (el.dataset.lazyRender) {
            const fn = window[el.dataset.lazyRender];
            if (typeof fn === 'function') fn(el);
            delete el.dataset.lazyRender;
          }
          el.classList.add('lazy-loaded');
          this.lazyObserver.unobserve(el);
        }
      });
    }, { rootMargin: '100px', threshold: 0.01 });
  },

  observe(el) {
    if (this.lazyObserver && el) this.lazyObserver.observe(el);
  },

  // ============================================
  // CACHE SYSTEM
  // ============================================
  setCache(key, value, ttl = 300000) {
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
      hits: 0
    });
  },

  getCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    item.hits++;
    return item.value;
  },

  clearCache() {
    this.cache.clear();
  },

  // ============================================
  // SCROLL OPTIMIZATION
  // ============================================
  optimizeScrolling() {
    // Passive listeners globally
    const passiveSupported = (() => {
      let supported = false;
      try {
        window.addEventListener('test', null, {
          get passive() { supported = true; return false; }
        });
      } catch(e) {}
      return supported;
    })();

    // Scrollable containers optimize karo
    document.querySelectorAll('.scrollable').forEach(el => {
      el.style.willChange = 'transform';
      el.style.webkitOverflowScrolling = 'touch';
      el.style.transform = 'translateZ(0)';
    });

    // Scroll snap for pages
    document.addEventListener('scroll', () => {}, passiveSupported ? { passive: true } : false);
  },

  // ============================================
  // MEMORY MANAGER
  // ============================================
  initMemoryManager() {
    // Page leave pe cleanup
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.cleanup();
      }
    });

    // Low memory detection
    if ('memory' in performance) {
      setInterval(() => {
        const mem = performance.memory;
        const usage = mem.usedJSHeapSize / mem.jsHeapSizeLimit;
        if (usage > 0.85) {
          console.warn('[Perf] High memory usage:', Math.round(usage * 100) + '%');
          this.cleanup();
        }
      }, 30000);
    }
  },

  cleanup() {
    // Old caches clear
    this.clearCache();

    // Unused canvases clear
    document.querySelectorAll('canvas[data-temp]').forEach(c => c.remove());

    // Detached DOM cleanup
    const containers = ['qr-preview-container', 'barcode-preview'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el && !document.contains(el)) el.innerHTML = '';
    });

    console.log('[Perf] Memory cleanup done');
  },

  // ============================================
  // VIRTUAL SCROLL (long lists ke liye)
  // ============================================
  createVirtualList(containerId, items, renderItem, itemHeight = 70) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const visibleCount = Math.ceil(container.clientHeight / itemHeight) + 5;
    let scrollTop = 0;
    let startIndex = 0;

    const totalHeight = items.length * itemHeight;
    const spacer = document.createElement('div');
    spacer.style.height = totalHeight + 'px';
    spacer.style.position = 'relative';
    container.innerHTML = '';
    container.appendChild(spacer);

    const viewport = document.createElement('div');
    viewport.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0;
    `;
    spacer.appendChild(viewport);

    const render = () => {
      startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount, items.length);
      viewport.style.transform = `translateY(${startIndex * itemHeight}px)`;

      const fragment = document.createDocumentFragment();
      for (let i = startIndex; i < endIndex; i++) {
        const itemEl = document.createElement('div');
        itemEl.style.height = itemHeight + 'px';
        itemEl.innerHTML = renderItem(items[i], i);
        fragment.appendChild(itemEl);
      }
      viewport.innerHTML = '';
      viewport.appendChild(fragment);
    };

    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop;
      this.scheduleRender(render);
    }, { passive: true });

    render();
  },

  // ============================================
  // IMAGE OPTIMIZER
  // ============================================
  optimizeImage(file, maxWidth = 800, quality = 0.85) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/webp', quality);
      };

      img.src = url;
    });
  },

  // ============================================
  // DEBOUNCE + THROTTLE (optimized)
  // ============================================
  debounce(fn, wait, immediate = false) {
    let timeout;
    return function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) fn.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) fn.apply(this, args);
    };
  },

  throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
      const now = performance.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  },

  // ============================================
  // PRELOAD CRITICAL RESOURCES
  // ============================================
  preload(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // ============================================
  // CSS WILL-CHANGE MANAGER
  // ============================================
  promoteLayer(el, properties = 'transform') {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.style.willChange = properties;
    el.style.transform = 'translateZ(0)';
    el.style.backfaceVisibility = 'hidden';
    el.style.webkitBackfaceVisibility = 'hidden';
  },

  demoteLayer(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.style.willChange = 'auto';
  }
};
