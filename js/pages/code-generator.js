// ============================================
// CODEFORGE X — Code Generator Page
// Live Editor + Preview + Export
// ============================================

const CodePage = {
  onEnter() {
    this.initEditor();
    this.initTemplatePicker();
    this.initPreviewTabs();
  },

  initEditor() {
    const editor = document.getElementById('code-editor');
    if (!editor) return;

    editor.addEventListener('input', () => {
      this.updateLineNumbers();
      this.updatePreview();
    });

    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        this.updateLineNumbers();
      }
    });

    this.updateLineNumbers();
  },

  updateLineNumbers() {
    const editor = document.getElementById('code-editor');
    const lineNums = document.getElementById('line-numbers');
    if (!editor || !lineNums) return;
    const lines = editor.value.split('\n').length;
    lineNums.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
  },

  initTemplatePicker() {
    const langSel = document.getElementById('code-lang');
    const tmplSel = document.getElementById('code-template');
    if (tmplSel) {
      tmplSel.addEventListener('change', () => {
        const lang = langSel?.value || 'javascript';
        const tmpl = tmplSel.value;
        const code = this.getTemplate(lang, tmpl);
        const editor = document.getElementById('code-editor');
        if (editor) {
          editor.value = code;
          this.updateLineNumbers();
          this.updatePreview();
        }
      });
    }
  },

  getTemplate(lang, template) {
    const templates = {
      'hello-world': {
        html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to CODEFORGE X</p>\n</body>\n</html>',
        css: 'body {\n  background: #0a0a0f;\n  color: #c9a84c;\n  font-family: Rajdhani, sans-serif;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n}\n\nh1 {\n  font-size: 2rem;\n  letter-spacing: 3px;\n}',
        javascript: 'console.log("Hello, World!");\n\nconst greeting = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greeting("CODEFORGE X"));',
        python: 'def hello_world():\n    print("Hello, World!")\n    return "Hello from Python"\n\nif __name__ == "__main__":\n    hello_world()',
        gdscript: 'extends Node\n\nfunc _ready():\n    print("Hello, World!")\n    print("Running on: ", OS.get_name())',
        default: '# Hello World\nprint("Hello from CODEFORGE X!")'
      },
      'dark-card': {
        html: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n* { margin:0; padding:0; box-sizing:border-box; }\nbody { background:#0a0a0f; display:flex; align-items:center; justify-content:center; height:100vh; }\n.card {\n  background: rgba(255,255,255,0.05);\n  border: 1px solid rgba(201,168,76,0.2);\n  border-radius: 20px;\n  padding: 32px;\n  width: 300px;\n  backdrop-filter: blur(20px);\n  box-shadow: 0 8px 32px rgba(0,0,0,0.6);\n}\n.card h2 { color: #c9a84c; font-family: Rajdhani; font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 12px; }\n.card p { color: #a0a0b0; font-size: 0.9rem; line-height: 1.6; }\n</style>\n</head>\n<body>\n  <div class="card">\n    <h2>DARK CARD</h2>\n    <p>Glass morphism card with gold accent borders.</p>\n  </div>\n</body>\n</html>',
        default: '/* Dark card template — switch to HTML tab */'
      },
      'fetch-api': {
        javascript: 'async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    \n    const data = await response.json();\n    console.log("Data received:", data);\n    return data;\n    \n  } catch (error) {\n    console.error("Fetch error:", error);\n    throw error;\n  }\n}\n\n// Usage example:\nfetchData("https://jsonplaceholder.typicode.com/posts/1")\n  .then(data => console.log(data));',
        default: '// Switch to JavaScript for Fetch API template'
      },
      'firebase-init': {
        javascript: 'import { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\nimport { getAuth } from "firebase/auth";\n\nconst firebaseConfig = {\n  apiKey: "YOUR_API_KEY",\n  authDomain: "YOUR_PROJECT.firebaseapp.com",\n  projectId: "YOUR_PROJECT_ID",\n  storageBucket: "YOUR_PROJECT.appspot.com",\n  messagingSenderId: "YOUR_SENDER_ID",\n  appId: "YOUR_APP_ID"\n};\n\nconst app = initializeApp(firebaseConfig);\nexport const db = getFirestore(app);\nexport const auth = getAuth(app);\n\nconsole.log("Firebase initialized!");',
        default: '// Switch to JavaScript for Firebase template'
      },
      'class-template': {
        javascript: 'class CodeForgeItem {\n  constructor(id, type, data) {\n    this.id = id;\n    this.type = type;\n    this.data = data;\n    this.createdAt = new Date();\n    this.favorite = false;\n  }\n\n  toJSON() {\n    return {\n      id: this.id,\n      type: this.type,\n      data: this.data,\n      createdAt: this.createdAt.toISOString(),\n      favorite: this.favorite\n    };\n  }\n\n  static fromJSON(json) {\n    const item = new CodeForgeItem(json.id, json.type, json.data);\n    item.createdAt = new Date(json.createdAt);\n    item.favorite = json.favorite;\n    return item;\n  }\n\n  toggleFavorite() {\n    this.favorite = !this.favorite;\n    return this;\n  }\n}\n\n// Usage:\nconst item = new CodeForgeItem(1, "qr", "https://example.com");\nconsole.log(item.toJSON());',
        python: 'class CodeForgeItem:\n    def __init__(self, item_id, item_type, data):\n        self.id = item_id\n        self.type = item_type\n        self.data = data\n        self.favorite = False\n\n    def __repr__(self):\n        return f"CodeForgeItem(id={self.id}, type={self.type})"\n\n    def to_dict(self):\n        return {\n            "id": self.id,\n            "type": self.type,\n            "data": self.data,\n            "favorite": self.favorite\n        }\n\n# Usage:\nitem = CodeForgeItem(1, "qr", "https://example.com")\nprint(item)',
        gdscript: 'class_name CodeForgeItem\n\nvar id: int\nvar type: String\nvar data: String\nvar favorite: bool = false\n\nfunc _init(p_id: int, p_type: String, p_data: String):\n    id = p_id\n    type = p_type\n    data = p_data\n\nfunc to_dict() -> Dictionary:\n    return {\n        "id": id,\n        "type": type,\n        "data": data,\n        "favorite": favorite\n    }\n\nfunc _to_string() -> String:\n    return "CodeForgeItem(%d, %s)" % [id, type]',
        default: '// Select a language above to see class template'
      },
      'blank': { default: '' }
    };

    const tmplData = templates[template];
    if (!tmplData) return '';
    return tmplData[lang] || tmplData['default'] || '';
  },

  initPreviewTabs() {
    document.querySelectorAll('#page-code-generator [data-preview]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#page-code-generator [data-preview]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const render = document.getElementById('code-render-preview');
        const image = document.getElementById('code-image-preview');
        if (btn.dataset.preview === 'render') {
          if (render) render.style.display = 'block';
          if (image) image.style.display = 'none';
        } else {
          if (render) render.style.display = 'none';
          if (image) image.style.display = 'flex';
          this.renderToCanvas();
        }
      });
    });
  },

  updatePreview() {
    const editor = document.getElementById('code-editor');
    const iframe = document.getElementById('preview-iframe');
    const lang = document.getElementById('code-lang')?.value;
    if (!editor || !iframe) return;

    if (lang === 'html') {
      iframe.srcdoc = editor.value;
    } else if (lang === 'css') {
      iframe.srcdoc = `<!DOCTYPE html><html><head><style>${editor.value}</style></head><body><div style="padding:20px;background:#111;color:#fff;min-height:100vh">CSS Preview Active</div></body></html>`;
    } else {
      iframe.srcdoc = `<!DOCTYPE html><html><head><style>
        body { background:#0a0a0f; color:#c9a84c; font-family:'Courier New',monospace; padding:16px; margin:0; font-size:13px; line-height:1.6; }
        pre { white-space:pre-wrap; }
      </style></head><body><pre>${editor.value.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></body></html>`;
    }
  },

  renderToCanvas() {
    const editor = document.getElementById('code-editor');
    const canvas = document.getElementById('code-canvas');
    if (!editor || !canvas) return;

    const code = editor.value || '// Empty';
    const lines = code.split('\n');
    const lineHeight = 20;
    const padding = 20;
    const headerH = 44;

    canvas.width = Math.max(400, window.innerWidth - 80);
    canvas.height = headerH + lines.length * lineHeight + padding * 2;

    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bar
    ctx.fillStyle = '#161b22';
    ctx.fillRect(0, 0, canvas.width, headerH);

    // Traffic lights
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(20 + i * 20, 22, 6, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });

    // Filename
    ctx.fillStyle = '#8b949e';
    ctx.font = '12px Rajdhani, monospace';
    ctx.fillText(document.getElementById('code-lang')?.value + ' — CODEFORGE X', 80, 27);

    // Code lines
    ctx.font = '13px "Courier New", monospace';
    lines.forEach((line, i) => {
      // Line number
      ctx.fillStyle = '#3d4451';
      ctx.fillText(String(i + 1).padStart(3), padding, headerH + padding + i * lineHeight);

      // Code text (basic highlighting)
      const keywords = /\b(const|let|var|function|class|return|if|else|for|while|import|export|async|await|def|print|self|pass|extends|func|var)\b/g;
      ctx.fillStyle = '#c9a84c';
      ctx.fillText(line, padding + 36, headerH + padding + i * lineHeight);
    });

    // Watermark
    const wm = App.settings.watermark || 'CODEFORGE X';
    ctx.fillStyle = 'rgba(201,168,76,0.15)';
    ctx.font = 'bold 11px Rajdhani, sans-serif';
    ctx.fillText(wm, canvas.width - ctx.measureText(wm).width - 12, canvas.height - 10);
  },

  formatCode() {
    Utils.showToast('Formatter coming soon!', 'info');
  },

  copyCode() {
    const editor = document.getElementById('code-editor');
    if (editor) Utils.copyToClipboard(editor.value);
  },

  clearCode() {
    const editor = document.getElementById('code-editor');
    if (editor) {
      editor.value = '';
      this.updateLineNumbers();
      this.updatePreview();
    }
  },

  async exportAs(format) {
    const editor = document.getElementById('code-editor');
    if (!editor?.value.trim()) { Utils.showToast('Write some code first!', 'warning'); return; }
    const timestamp = Date.now();

    if (format === 'image') {
      this.renderToCanvas();
      const canvas = document.getElementById('code-canvas');
      if (canvas) Utils.canvasToPNG(canvas, `code-${timestamp}.png`);
    } else if (format === 'file') {
      const lang = document.getElementById('code-lang')?.value || 'js';
      const exts = { html:'html', css:'css', javascript:'js', python:'py', gdscript:'gd', json:'json', sql:'sql', bash:'sh', cpp:'cpp', java:'java' };
      const ext = exts[lang] || 'txt';
      const blob = new Blob([editor.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      Utils.downloadFile(url, `code-${timestamp}.${ext}`);
    } else if (format === 'pdf') {
      Utils.showToast('PDF export coming soon!', 'info');
    }
  },

  share() {
    const editor = document.getElementById('code-editor');
    if (editor) Utils.shareContent({ title: 'Code by CODEFORGE X', text: editor.value });
  }
};
