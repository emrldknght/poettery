import { useCallback, useEffect, useRef, useState } from 'react';
import FileTree from './components/FileTree';
import EditorForm from './components/EditorForm';
import CommandPalette from './components/CommandPalette';
import './App.css';

const WIDTH_KEY = 'poettery-sidebar-width';
const MIN_W = 220;
const MAX_W = 520;
const DEFAULT_W = 300;

const TOAST_ICONS = { success: '✓', error: '✕', folder: '⤷', info: 'ℹ' };
let toastSeq = 0;

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderPick, setFolderPick] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [files, setFiles] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [listKey, setListKey] = useState(0);
  const listSeq = useRef(0);

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(WIDTH_KEY));
      if (saved >= MIN_W && saved <= MAX_W) return saved;
    } catch {}
    return DEFAULT_W;
  });
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const editorRef = useRef(null);

  const pushToast = useCallback((text, type = 'info') => {
    const id = ++toastSeq;
    setToasts(prev => [...prev.slice(-3), { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  const refreshList = useCallback(() => setListKey(k => k + 1), []);

  useEffect(() => {
    const seq = ++listSeq.current;
    setListLoading(true);
    setListError(null);
    fetch('/admin-list')
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(data => {
        if (seq !== listSeq.current) return;
        setFiles(Array.isArray(data.files) ? data.files : []);
      })
      .catch(() => {
        if (seq !== listSeq.current) return;
        setListError('Не удалось загрузить список файлов');
      })
      .finally(() => {
        if (seq === listSeq.current) setListLoading(false);
      });
  }, [listKey]);

  const handleSelect = useCallback((path) => {
    setMobileTreeOpen(false);
    setPaletteOpen(false);
    if (path === selectedFile) return;
    if (dirty && !window.confirm('Есть несохранённые изменения. Открыть другой файл? Текущий черновик будет заменён.')) return;
    setSelectedFile(path);
  }, [selectedFile, dirty]);

  const handleFolderPick = (path) => {
    setFolderPick({ path, ts: Date.now() });
    pushToast(`Папка «${path}» подставлена в поле «Папка»`, 'folder');
    setMobileTreeOpen(false);
    setFocusMode(false);
  };

  const handleSaved = (path) => {
    refreshList();
    if (path) setSelectedFile(path);
  };

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && (e.key.toLowerCase() === 'k' || e.code === 'KeyK')) {
        e.preventDefault();
        setPaletteOpen(o => !o);
        return;
      }
      if (mod && (e.key === '.' || e.code === 'Period')) {
        e.preventDefault();
        setFocusMode(f => !f);
        return;
      }
      if (e.key === 'Escape') {
        if (paletteOpen) setPaletteOpen(false);
        else if (mobileTreeOpen) setMobileTreeOpen(false);
        else if (focusMode) setFocusMode(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, mobileTreeOpen, focusMode]);

  const startResize = (e) => {
    e.preventDefault();
    setResizing(true);
    const startX = e.clientX;
    const startW = sidebarWidth;
    const clamp = (w) => Math.min(MAX_W, Math.max(MIN_W, w));
    const onMove = (ev) => setSidebarWidth(clamp(startW + ev.clientX - startX));
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setResizing(false);
      const w = clamp(startW + ev.clientX - startX);
      try { localStorage.setItem(WIDTH_KEY, String(w)); } catch {}
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const resetWidth = () => {
    setSidebarWidth(DEFAULT_W);
    try { localStorage.setItem(WIDTH_KEY, String(DEFAULT_W)); } catch {}
  };

  const commands = [
    { id: 'save', label: 'Сохранить файл', hint: 'Ctrl+S', run: () => editorRef.current?.save() },
    { id: 'new', label: 'Новый файл', run: () => editorRef.current?.createNew() },
    { id: 'history', label: 'История версий', run: () => editorRef.current?.openHistory() },
    { id: 'export', label: 'Скачать .md', run: () => editorRef.current?.exportMarkdown() },
    { id: 'copy', label: 'Скопировать Markdown', run: () => editorRef.current?.copyMarkdown() },
    { id: 'focus', label: focusMode ? 'Выйти из фокус-режима' : 'Фокус-режим', hint: 'Ctrl+.', run: () => setFocusMode(f => !f) },
    { id: 'view-write', label: 'Редактор: текст', run: () => editorRef.current?.setView('write') },
    { id: 'view-split', label: 'Редактор: сплит', run: () => editorRef.current?.setView('split') },
    { id: 'view-preview', label: 'Редактор: превью', run: () => editorRef.current?.setView('preview') },
    { id: 'refresh', label: 'Обновить список файлов', run: refreshList },
  ];

  return (
    <div
      className={`app${resizing ? ' is-resizing' : ''}${mobileTreeOpen ? ' tree-open' : ''}${focusMode ? ' is-focus' : ''}`}
      style={{ '--sidebar-w': `${sidebarWidth}px` }}
    >
      <div className="bg-glow bg-glow--amber" aria-hidden="true" />
      <div className="bg-glow bg-glow--violet" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />

      <aside className="sidebar">
        <FileTree
          files={files}
          loading={listLoading}
          error={listError}
          onRetry={refreshList}
          onSelect={handleSelect}
          selectedFile={selectedFile}
          onFolderPick={handleFolderPick}
          pickedFolder={folderPick?.path}
          onToast={pushToast}
        />
      </aside>

      <div
        className="divider"
        role="separator"
        aria-orientation="vertical"
        title="Потяните, чтобы изменить ширину. Двойной клик — сброс."
        onPointerDown={startResize}
        onDoubleClick={resetWidth}
      />

      {mobileTreeOpen && <div className="scrim" onClick={() => setMobileTreeOpen(false)} />}

      <main className="workspace">
        <EditorForm
          ref={editorRef}
          selectedFile={selectedFile}
          folderPick={folderPick}
          onDirtyChange={setDirty}
          onSaved={handleSaved}
          onNew={() => setSelectedFile(null)}
          onToast={pushToast}
          onOpenTree={() => setMobileTreeOpen(true)}
          focusMode={focusMode}
          onToggleFocus={() => setFocusMode(f => !f)}
        />
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        files={files}
        commands={commands}
        onSelectFile={handleSelect}
        selectedFile={selectedFile}
      />

      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast__icon">{TOAST_ICONS[t.type] || 'ℹ'}</span>
            <span className="toast__text">{t.text}</span>
            <button className="toast__close" onClick={() => dismissToast(t.id)} aria-label="Закрыть">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}