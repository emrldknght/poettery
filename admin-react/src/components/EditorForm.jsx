import { useEffect, useMemo, useRef, useState } from 'react';
import './EditorForm.css';

const DRAFT_KEY = 'poettery-draft';
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

/* ---------------- slug транслитом ---------------- */

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

/* ---------------- мини-Markdown (безопасный, с сохранением переносов) ---------------- */

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
      html += `<p>${para.map(inlineMd).join('<br>')}</p>`; // переносы строк важны для стихов
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
      const lvl = Math.min(h[1].length + 1, 6); // # → h2, т.к. h1 — заголовок страницы
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

/* ---------------- мелочи ---------------- */

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
function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
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

/* ---------------- компонент ---------------- */

export default function EditorForm({
                                     selectedFile, folderPick, onDirtyChange, onSaved, onNew, onToast, onOpenTree,
                                   }) {
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
  const [view, setView] = useState('write'); // write | split | preview
  const [folderPulse, setFolderPulse] = useState(false);

  const loadSeq = useRef(0);
  const savingRef = useRef(false);

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);

  /* --- загрузка файла / режим нового файла --- */
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
          if (seq !== loadSeq.current) return; // ответ устарел — пользователь уже кликнул другой файл
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

  /* --- даблклик по папке в дереве → поле «Папка» --- */
  useEffect(() => {
    if (!folderPick) return;
    setFormData((prev) => ({ ...prev, folder: folderPick.path }));
    setDirty(true);
    setFolderPulse(true);
  }, [folderPick]);

  /* --- автосохранение черновика: один debounce вместо таймера на каждый keystroke --- */
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

  /* --- сохранение --- */
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

  /* --- Ctrl/Cmd+S: один слушатель, работает и на русской раскладке --- */
  const saveRef = useRef(handleSave);
  saveRef.current = handleSave;
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.code === 'KeyS')) {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* --- предупреждение при закрытии вкладки с правками --- */
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  /* --- новый файл --- */
  const handleNew = () => {
    if (!window.confirm('Очистить форму и черновик?')) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setFormData(emptyForm());
    setDirty(false);
    setLoadError(null);
    setDraftStatus('🆕 новый файл');
    onNew();
  };

  /* --- Tab в редакторе = два пробела --- */
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

  /* --- превью и счётчики --- */
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

  const paper = (
    <article className="paper">
      <div className="paper__meta">
        {formatDate(formData.date)}
        {formData.date ? ' · ' : ''}
        {formData.layout === 'music' ? '♪ песня' : '✒ стихотворение'}
      </div>
      <h1 className="paper__title">{formData.title || 'Без заголовка'}</h1>
      {formData.review && <p className="paper__review">{formData.review}</p>}
      <div className="paper__divider" aria-hidden="true">
        <span />{formData.layout === 'music' ? '♪' : '❦'}<span />
      </div>
      {formData.content
        ? <div className="paper__body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        : <p className="paper__empty">Текст пока пуст — начните писать во вкладке «Текст».</p>}
    </article>
  );

  return (
    <div className="editor">
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
              <div className="seg" role="tablist" aria-label="Режим редактора">
                <button role="tab" aria-selected={view === 'write'} className={view === 'write' ? 'is-active' : ''} onClick={() => setView('write')}>Текст</button>
                <button role="tab" aria-selected={view === 'split'} className={view === 'split' ? 'is-active' : ''} onClick={() => setView('split')}>Сплит</button>
                <button role="tab" aria-selected={view === 'preview'} className={view === 'preview' ? 'is-active' : ''} onClick={() => setView('preview')}>Превью</button>
              </div>
            </div>

            <div className={`content-body view-${view}`}>
              {view !== 'preview' && (
                <textarea
                  id="f-content"
                  className="editor-textarea"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  onKeyDown={handleTab}
                  spellCheck={false}
                  placeholder={'Пишите так, как дышится:\nкаждая строка — отдельная строка,\n\nпустая строка — пауза между строфами.\n\nMarkdown: **жирный**, *курсив*, > цитата'}
                />
              )}
              {view !== 'write' && <div className="preview-scroll">{paper}</div>}
            </div>
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
        <span className="editor-status__keys"><kbd>Ctrl</kbd>+<kbd>S</kbd> сохранить</span>
      </div>
    </div>
  );
}