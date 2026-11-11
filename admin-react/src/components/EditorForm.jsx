import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import './EditorForm.css';

const DRAFT_KEY = 'poettery-draft';
const METER_KEY = 'poettery-meter';
const HISTORY_PREFIX = 'poettery-history:';
const HISTORY_LIMIT = 12;
const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');

const todayISO = () => new Date().toISOString().split('T')[0];
const defaultFolder = () => {
  const n = new Date();
  return `${n.getFullYear()}/${String(n.getMonth() + 1).padStart(2, '0')}`;
};
const emptyForm = () => ({
  slug: '',
  folder: defaultFolder(),
  title: '',
  date: todayISO(),
  layout: 'poem',
  review: '',
  content: '',
});

const RU_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
function slugify(text) {
  return text
    .toLowerCase()
    .split('')
    .map((c) => (RU_MAP[c] !== undefined ? RU_MAP[c] : c))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function inlineMd(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, url) =>
      /^(https?:|mailto:|\/)/i.test(url)
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${txt}</a>`
        : txt
    );
}
function renderMarkdown(src) {
  const lines = escapeHtml(src || '').split('\n');
  let html = '';
  let inList = false;
  let inQuote = false;
  let para = [];
  const flushPara = () => {
    if (para.length) {
      html += `<p>${para.map(inlineMd).join('<br>')}</p>`;
      para = [];
    }
  };
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeQuote = () => { if (inQuote) { html += '</blockquote>'; inQuote = false; } };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) { flushPara(); closeList(); closeQuote(); continue; }

    const h = t.match(/^(#{1,5})\s+(.*)$/);
    if (h) {
      flushPara(); closeList(); closeQuote();
      const lvl = Math.min(h[1].length + 1, 6);
      html += `<h${lvl}>${inlineMd(h[2])}</h${lvl}>`;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flushPara(); closeList(); closeQuote();
      html += '<hr>';
      continue;
    }
    const li = t.match(/^[-*+]\s+(.*)$/);
    if (li) {
      flushPara(); closeQuote();
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inlineMd(li[1])}</li>`;
      continue;
    }
    const quote = t.match(/^>\s?(.*)$/);
    if (quote) {
      flushPara(); closeList();
      if (!inQuote) { html += '<blockquote>'; inQuote = true; }
      html += `<p>${inlineMd(quote[1])}</p>`;
      continue;
    }
    closeList(); closeQuote();
    para.push(t);
  }
  flushPara(); closeList(); closeQuote();
  return html;
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return iso;
  }
}
function formatDateTime(ts) {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}
function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

const VOWELS = /[аеёиоуыэюя]/gi;
const countSyllables = (line) => (line.match(VOWELS) || []).length;

const historyKeyFor = (file, slug) => file || `draft:${slug || 'new'}`;
function readHistory(key) {
  try {
    const raw = localStorage.getItem(HISTORY_PREFIX + key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeHistory(key, items) {
  try {
    localStorage.setItem(HISTORY_PREFIX + key, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}
function pushSnapshot(key, data) {
  const entry = { ts: Date.now(), data: { ...data } };
  let next = [entry, ...readHistory(key)].slice(0, HISTORY_LIMIT);
  if (!writeHistory(key, next)) {
    next = next.slice(0, 6);
    writeHistory(key, next);
  }
  return next;
}

const yamlEscape = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
function buildMarkdown(d) {
  const fm = [
    '---',
    `title: "${yamlEscape(d.title)}"`,
    `date: ${d.date || todayISO()}`,
    `layout: ${d.layout || 'poem'}`,
  ];
  if (d.review) fm.push(`review: "${yamlEscape(d.review)}"`);
  if (d.slug) fm.push(`slug: "${yamlEscape(d.slug)}"`);
  fm.push('---', '');
  return fm.join('\n') + (d.content || '');
}
function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const svgProps = {
  width: 14, height: 14, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round', strokeLinejoin: 'round',
};
const MenuIcon = () => (
  <svg {...svgProps} width={16} height={16}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
);
const PlusIcon = () => (
  <svg {...svgProps}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
);
const SaveIcon = () => (
  <svg {...svgProps}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>
);
const WandIcon = () => (
  <svg {...svgProps}><path d="M9.9 2.6 11.4 6.6 15.4 8.1 11.4 9.6 9.9 13.6 8.4 9.6 4.4 8.1 8.4 6.6Z" /><path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z" /></svg>
);
const FolderSmallIcon = () => (
  <svg {...svgProps}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
);
const FeatherSmallIcon = () => (
  <svg {...svgProps}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
);
const MusicIcon = () => (
  <svg {...svgProps}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);
const HistoryIcon = () => (
  <svg {...svgProps}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
);
const DownloadIcon = () => (
  <svg {...svgProps}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
);
const FocusIcon = () => (
  <svg {...svgProps}><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
);
const CopyIcon = () => (
  <svg {...svgProps}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const MeterIcon = () => (
  <svg {...svgProps}><path d="M4 9h16" /><path d="M4 15h16" /><path d="M10 3 8 21" /><path d="M16 3l-2 18" /></svg>
);
const CloseIcon = () => (
  <svg {...svgProps} width={16} height={16}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const Paper = forwardRef(function Paper({ data, mini = false }, ref) {
  const html = useMemo(() => renderMarkdown(data.content), [data.content]);
  return (
    <article ref={ref} className={`paper${mini ? ' paper--mini' : ''}`}>
      <div className="paper__meta">
        {formatDate(data.date)}
        {data.date ? ' · ' : ''}
        {data.layout === 'music' ? '♪ песня' : '✒ стихотворение'}
      </div>
      <h1 className="paper__title">{data.title || 'Без заголовка'}</h1>
      {data.review && <p className="paper__review">{data.review}</p>}
      <div className="paper__divider" aria-hidden="true">
        <span />{data.layout === 'music' ? '♪' : '❦'}<span />
      </div>
      {data.content
        ? <div className="paper__body" dangerouslySetInnerHTML={{ __html: html }} />
        : <p className="paper__empty">Текст пока пуст.</p>}
    </article>
  );
});

const EditorForm = forwardRef(function EditorForm({
  selectedFile, folderPick, onDirtyChange, onSaved, onNew, onToast, onOpenTree,
  focusMode, onToggleFocus,
}, ref) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return { ...emptyForm(), ...JSON.parse(saved) };
    } catch {}
    return emptyForm();
  });
  const [draftStatus, setDraftStatus] = useState(() => {
    try {
      return localStorage.getItem(DRAFT_KEY) ? '♻️ черновик восстановлен' : '🆕 новый файл';
    } catch {
      return '🆕 новый файл';
    }
  });
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('write');
  const [folderPulse, setFolderPulse] = useState(false);
  const [meterOn, setMeterOn] = useState(() => {
    try { return localStorage.getItem(METER_KEY) === '1'; } catch { return false; }
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const loadSeq = useRef(0);
  const savingRef = useRef(false);
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const apiRef = useRef({});
  const saveRef = useRef(null);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  useEffect(() => {
    try { localStorage.setItem(METER_KEY, meterOn ? '1' : '0'); } catch {}
  }, [meterOn]);

  useEffect(() => {
    document.title = `${dirty ? '• ' : ''}${formData.title || 'Без заголовка'} — Poettery`;
  }, [dirty, formData.title]);

  useEffect(() => {
    const seq = ++loadSeq.current;
    if (selectedFile) {
      setLoading(true);
      setLoadError(null);
      fetch(`/admin-load?file=${encodeURIComponent(selectedFile)}`)
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then((data) => {
          if (seq !== loadSeq.current) return;
          const normalized = { ...emptyForm(), ...data };
          if (normalized.date) normalized.date = String(normalized.date).slice(0, 10);
          setFormData(normalized);
          try { localStorage.setItem(DRAFT_KEY, JSON.stringify(normalized)); } catch {}
          setDraftStatus(`📂 ${selectedFile}`);
          setDirty(false);
          setLoading(false);
        })
        .catch(() => {
          if (seq !== loadSeq.current) return;
          setLoading(false);
          setLoadError(`Не удалось открыть ${selectedFile}`);
        });
    } else {
      let restored = false;
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          setFormData({ ...emptyForm(), ...JSON.parse(saved) });
          restored = true;
        }
      } catch {}
      if (restored) {
        setDraftStatus('♻️ черновик восстановлен');
      } else {
        setFormData(emptyForm());
        setDraftStatus('🆕 новый файл');
      }
      setDirty(false);
      setLoading(false);
      setLoadError(null);
    }
  }, [selectedFile, reloadKey]);

  useEffect(() => {
    if (!folderPick) return;
    setFormData((prev) => ({ ...prev, folder: folderPick.path }));
    setDirty(true);
    setFolderPulse(true);
  }, [folderPick]);

  useEffect(() => {
    if (!dirty) return;
    setDraftStatus('✏️ правки…');
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        setDraftStatus('💾 черновик сохранён');
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [formData, dirty]);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setDirty(true);
  };
  const handleChange = (e) => setField(e.target.name, e.target.value);

  const handleSave = async () => {
    if (savingRef.current || loading) return;
    if (!formData.slug.trim() || !formData.title.trim() || !formData.date) {
      onToast('Заполните Slug, Заголовок и Дату', 'error');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    const payload = {
      ...formData,
      slug: formData.slug.trim(),
      title: formData.title.trim(),
      folder: formData.folder.trim().replace(/^\/+|\/+$/g, ''),
    };
    try {
      const response = await fetch('/admin-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        const key = result.path || selectedFile || historyKeyFor(null, payload.slug);
        pushSnapshot(key, payload);
        setDirty(false);
        setDraftStatus('💾 записано на диск');
        onToast(`Сохранено: ${result.path || payload.slug}`, 'success');
        onSaved(result.path);
      } else {
        onToast(result.error || `Ошибка сохранения (HTTP ${response.status})`, 'error');
      }
    } catch {
      onToast('Ошибка сети — файл не сохранён', 'error');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };
  saveRef.current = handleSave;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.code === 'KeyS')) {
        e.preventDefault();
        saveRef.current?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleNew = () => {
    if (!window.confirm('Очистить форму и черновик?')) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setFormData(emptyForm());
    setDirty(false);
    setLoadError(null);
    setDraftStatus('🆕 новый файл');
    onNew();
  };

  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const { selectionStart, selectionEnd, value } = el;
    const next = value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd);
    setField('content', next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 2;
    });
  };

  const syncGutter = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };
  useEffect(() => { syncGutter(); }, [meterOn, view, formData.content]);

  const exportMarkdown = () => {
    const name = (formData.slug || 'untitled').replace(/[^\w-]+/g, '-');
    downloadText(`${name}.md`, buildMarkdown(formData));
    onToast('Файл .md скачан', 'success');
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown(formData));
      onToast('Markdown скопирован в буфер', 'success');
    } catch {
      onToast('Буфер обмена недоступен', 'error');
    }
  };

  const openHistory = () => {
    const key = historyKeyFor(selectedFile, formData.slug);
    setHistoryItems(readHistory(key));
    setHistoryIndex(0);
    setHistoryOpen(true);
  };

  const takeSnapshot = () => {
    const key = historyKeyFor(selectedFile, formData.slug);
    const next = pushSnapshot(key, formData);
    setHistoryItems(next);
    setHistoryIndex(0);
    onToast('Снимок сохранён в истории', 'success');
  };

  const restoreSnapshot = (snap) => {
    if (dirty && !window.confirm(`Заменить текущий текст версией от ${formatDateTime(snap.ts)}?`)) return;
    setFormData({ ...emptyForm(), ...snap.data });
    setDirty(true);
    setHistoryOpen(false);
    onToast('Версия восстановлена в редактор — не забудьте сохранить', 'info');
  };

  useEffect(() => {
    if (!historyOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setHistoryOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [historyOpen]);

  const previewHtml = useMemo(() => renderMarkdown(formData.content), [formData.content]);
  const stats = useMemo(() => {
    const c = formData.content || '';
    return {
      lines: c ? c.split('\n').length : 0,
      stanzas: c.trim() ? c.trim().split(/\n\s*\n/).length : 0,
      words: (c.match(/\S+/g) || []).length,
      chars: c.length,
    };
  }, [formData.content]);

  const meter = useMemo(() => {
    const lines = (formData.content || '').split('\n');
    const counts = lines.map(countSyllables);
    const nonEmpty = counts.filter((c, i) => lines[i].trim().length > 0);
    const freq = {};
    let dominant = 0;
    let best = 0;
    nonEmpty.forEach((c) => {
      freq[c] = (freq[c] || 0) + 1;
      if (freq[c] > best) { best = freq[c]; dominant = c; }
    });
    const inMeter = nonEmpty.filter((c) => c === dominant).length;
    return { lines, counts, dominant, total: nonEmpty.length, inMeter };
  }, [formData.content]);

  const activeSnap = historyItems[historyIndex];

  apiRef.current = {
    save: handleSave,
    createNew: handleNew,
    exportMarkdown,
    copyMarkdown,
    openHistory,
    setView,
  };
  useImperativeHandle(ref, () => ({
    save: () => apiRef.current.save(),
    createNew: () => apiRef.current.createNew(),
    exportMarkdown: () => apiRef.current.exportMarkdown(),
    copyMarkdown: () => apiRef.current.copyMarkdown(),
    openHistory: () => apiRef.current.openHistory(),
    setView: (v) => apiRef.current.setView(v),
  }), []);

  const activeHistoryHtml = useMemo(
    () => (activeSnap ? renderMarkdown(activeSnap.data.content || '') : ''),
    [activeSnap]
  );

  return (
    <div className={`editor${focusMode ? ' is-focus' : ''}`}>
      <div className="editor-top">
        <button className="icon-btn only-mobile" onClick={onOpenTree} title="Файлы" aria-label="Открыть список файлов">
          <MenuIcon />
        </button>
        <div className="editor-top__file">
          {selectedFile ? (
            <>
              <span className="file-badge">файл</span>
              <span className="file-path" title={selectedFile}>{selectedFile}</span>
            </>
          ) : (
            <span className="file-badge file-badge--new">новый файл</span>
          )}
          {dirty && <span className="dirty-dot" title="Есть несохранённые изменения" />}
          {loading && <span className="loading-hint">загрузка…</span>}
        </div>

        <div className="editor-top__tools">
          <button className="icon-btn" onClick={openHistory} title="История версий" aria-label="История версий">
            <HistoryIcon />
          </button>
          <button className="icon-btn" onClick={exportMarkdown} title="Скачать .md" aria-label="Скачать .md">
            <DownloadIcon />
          </button>
          <button
            className={`icon-btn${focusMode ? ' is-active' : ''}`}
            onClick={onToggleFocus}
            title="Фокус-режим (Ctrl+.)"
            aria-label="Фокус-режим"
            aria-pressed={focusMode}
          >
            <FocusIcon />
          </button>
        </div>

        <div className="editor-top__actions">
          <button className="btn btn--ghost" onClick={handleNew}>
            <PlusIcon /> Новый
          </button>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving || loading}>
            <SaveIcon /> {saving ? 'Сохраняю…' : 'Сохранить'}
            <kbd>{IS_MAC ? '⌘S' : 'Ctrl+S'}</kbd>
          </button>
        </div>
      </div>

      <div className="editor-main">
        {loadError && (
          <div className="banner banner--error">
            <span>⚠ {loadError}</span>
            <button className="btn btn--ghost" onClick={() => setReloadKey((k) => k + 1)}>Повторить</button>
          </div>
        )}

        <div className={`editor-grid${loading ? ' is-loading' : ''}`}>
          <aside className="meta-panel">
            <div className="meta-panel__head"><span className="meta-panel__tick" />Параметры</div>

            <div className="field">
              <label htmlFor="f-slug">Slug</label>
              <div className="input-group">
                <input
                  id="f-slug" type="text" name="slug" autoComplete="off"
                  value={formData.slug} onChange={handleChange} required
                />
                <button
                  className="icon-btn"
                  title="Сгенерировать из заголовка (транслит)"
                  aria-label="Сгенерировать slug из заголовка"
                  disabled={!formData.title.trim()}
                  onClick={() => setField('slug', slugify(formData.title))}
                >
                  <WandIcon />
                </button>
              </div>
              <div className="hint">Латиница, без .md — имя файла.</div>
            </div>

            <div className="field">
              <label htmlFor="f-folder">Папка</label>
              <div className="folder-wrap">
                <span className="folder-wrap__icon"><FolderSmallIcon /></span>
                <input
                  id="f-folder" type="text" name="folder" autoComplete="off"
                  className={`folder-input${folderPulse ? ' is-pulse' : ''}`}
                  value={formData.folder}
                  onChange={handleChange}
                  onAnimationEnd={() => setFolderPulse(false)}
                />
              </div>
              <div className="hint">
                Двойной клик по папке в дереве — путь подставится сюда.
                Или кнопка ⤷ на папке при наведении.{' '}
                <button className="hint-link" onClick={() => setField('folder', defaultFolder())}>
                  текущий месяц
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-title">Заголовок</label>
              <input
                id="f-title" type="text" name="title"
                value={formData.title} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label htmlFor="f-date">Дата</label>
              <input
                id="f-date" type="date" name="date"
                value={formData.date} onChange={handleChange} required
              />
            </div>

            <div className="field">
              <label>Layout</label>
              <div className="chips" role="radiogroup" aria-label="Layout">
                <button
                  className={`chip${formData.layout === 'poem' ? ' is-active' : ''}`}
                  data-layout="poem"
                  role="radio" aria-checked={formData.layout === 'poem'}
                  onClick={() => setField('layout', 'poem')}
                >
                  <FeatherSmallIcon /> Poem
                </button>
                <button
                  className={`chip${formData.layout === 'music' ? ' is-active' : ''}`}
                  data-layout="music"
                  role="radio" aria-checked={formData.layout === 'music'}
                  onClick={() => setField('layout', 'music')}
                >
                  <MusicIcon /> Music
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-review">Review</label>
              <input
                id="f-review" type="text" name="review"
                value={formData.review} onChange={handleChange}
              />
              <div className="hint">Короткое описание / эпиграф над текстом.</div>
            </div>
          </aside>

          <section className="content-panel">
            <div className="content-head">
              <label htmlFor="f-content">Контент · Markdown</label>
              <div className="content-head__tools">
                <button
                  className={`tool-toggle${meterOn ? ' is-active' : ''}`}
                  onClick={() => setMeterOn((v) => !v)}
                  title="Слоги по строкам: гласные = слоги. Строки вне основного размера подсвечиваются."
                  aria-pressed={meterOn}
                >
                  <MeterIcon /> Слоги
                </button>
                <button className="icon-btn" onClick={copyMarkdown} title="Скопировать Markdown с frontmatter" aria-label="Скопировать Markdown">
                  <CopyIcon />
                </button>
                <div className="seg" role="tablist" aria-label="Режим редактора">
                  <button role="tab" aria-selected={view === 'write'} className={view === 'write' ? 'is-active' : ''} onClick={() => setView('write')}>Текст</button>
                  <button role="tab" aria-selected={view === 'split'} className={view === 'split' ? 'is-active' : ''} onClick={() => setView('split')}>Сплит</button>
                  <button role="tab" aria-selected={view === 'preview'} className={view === 'preview' ? 'is-active' : ''} onClick={() => setView('preview')}>Превью</button>
                </div>
              </div>
            </div>

            <div className={`content-body view-${view}`}>
              {view !== 'preview' && (
                <div className="write-wrap">
                  {meterOn && (
                    <div className="meter-gutter" ref={gutterRef} aria-hidden="true">
                      {meter.counts.map((c, i) => (
                        <div
                          key={i}
                          className={`meter-gutter__line${!meter.lines[i].trim() ? ' is-empty' : (meter.dominant && c !== meter.dominant ? ' is-off' : '')}`}
                          title={`${c} ${plural(c, ['слог', 'слога', 'слогов'])}`}
                        >
                          {!meter.lines[i].trim() ? '·' : c}
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    id="f-content"
                    className="editor-textarea"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    onKeyDown={handleTab}
                    onScroll={syncGutter}
                    wrap={meterOn ? 'off' : 'soft'}
                    spellCheck={false}
                    placeholder={'Пишите так, как дышится:\nкаждая строка — отдельная строка,\n\nпустая строка — пауза между строфами.\n\nMarkdown: **жирный**, *курсив*, > цитата'}
                  />
                </div>
              )}
              {view !== 'write' && (
                <div className="preview-scroll">
                  <Paper data={formData} />
                </div>
              )}
            </div>

            {meterOn && view !== 'preview' && meter.total > 0 && (
              <div className="meter-summary">
                <span className="meter-summary__label">Размер строки:</span>
                <span className="meter-summary__value">{meter.dominant} {plural(meter.dominant, ['слог', 'слога', 'слогов'])}</span>
                <span className={`meter-summary__score${meter.inMeter < meter.total ? ' is-off' : ''}`}>
                  {meter.inMeter}/{meter.total} строк в размер
                </span>
                <span className="meter-summary__hint">слог = гласная буква</span>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="editor-status">
        <span className="editor-status__draft" title={draftStatus}>{draftStatus}</span>
        <span className="editor-status__stats">
          {stats.lines} {plural(stats.lines, ['строка', 'строки', 'строк'])}
          {' · '}{stats.stanzas} {plural(stats.stanzas, ['строфа', 'строфы', 'строф'])}
          {' · '}{stats.words} {plural(stats.words, ['слово', 'слова', 'слов'])}
          {' · '}{stats.chars} {plural(stats.chars, ['знак', 'знака', 'знаков'])}
        </span>
        <span className="editor-status__keys"><kbd>Ctrl</kbd>+<kbd>K</kbd> файлы · <kbd>Ctrl</kbd>+<kbd>S</kbd> сохранить</span>
      </div>

      {historyOpen && (
        <div className="drawer-layer">
          <div className="drawer-scrim" onClick={() => setHistoryOpen(false)} />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="История версий">
            <div className="drawer__head">
              <div className="drawer__head-text">
                <div className="drawer__title">История версий</div>
                <div className="drawer__sub">{selectedFile || 'черновик'} · {historyItems.length} {plural(historyItems.length, ['снимок', 'снимка', 'снимков'])}</div>
              </div>
              <button className="icon-btn" onClick={() => setHistoryOpen(false)} aria-label="Закрыть историю">
                <CloseIcon />
              </button>
            </div>

            <div className="drawer__body">
              <div className="drawer__list">
                <button className="btn btn--ghost btn--small drawer__snapshot-btn" onClick={takeSnapshot}>
                  <PlusIcon /> Снимок сейчас
                </button>
                {historyItems.length === 0 && (
                  <div className="drawer__empty">
                    Снимки появятся после первого сохранения.<br />Или сделайте снимок вручную.
                  </div>
                )}
                {historyItems.map((s, i) => (
                  <button
                    key={s.ts}
                    className={`drawer__item${i === historyIndex ? ' is-active' : ''}`}
                    onClick={() => setHistoryIndex(i)}
                  >
                    <span className="drawer__item-time">{formatDateTime(s.ts)}</span>
                    <span className="drawer__item-title">{s.data.title || 'Без заголовка'}</span>
                    <span className="drawer__item-meta">
                      {(s.data.content || '').length} {plural((s.data.content || '').length, ['знак', 'знака', 'знаков'])}
                    </span>
                  </button>
                ))}
              </div>

              <div className="drawer__preview">
                {activeSnap ? (
                  <>
                    <div className="drawer__preview-head">
                      <span>{formatDateTime(activeSnap.ts)}</span>
                      <div className="drawer__preview-actions">
                        <button
                          className="btn btn--ghost btn--small"
                          onClick={() => {
                            const name = (activeSnap.data.slug || 'snapshot').replace(/[^\w-]+/g, '-');
                            downloadText(`${name}.md`, buildMarkdown(activeSnap.data));
                            onToast('Снимок скачан как .md', 'success');
                          }}
                        >
                          <DownloadIcon /> Скачать
                        </button>
                        <button className="btn btn--primary btn--small" onClick={() => restoreSnapshot(activeSnap)}>
                          Восстановить
                        </button>
                      </div>
                    </div>
                    <div className="drawer__paper">
                      <article className="paper paper--mini">
                        <div className="paper__meta">{formatDate(activeSnap.data.date)}</div>
                        <h1 className="paper__title">{activeSnap.data.title || 'Без заголовка'}</h1>
                        {activeSnap.data.review && <p className="paper__review">{activeSnap.data.review}</p>}
                        <div className="paper__divider" aria-hidden="true"><span />❦<span /></div>
                        <div className="paper__body" dangerouslySetInnerHTML={{ __html: activeHistoryHtml }} />
                      </article>
                    </div>
                  </>
                ) : (
                  <div className="drawer__empty drawer__empty--center">Выберите снимок слева</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
});

export default EditorForm;