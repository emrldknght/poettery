import { useCallback, useState } from 'react';
import FileTree from './components/FileTree';
import EditorForm from './components/EditorForm';
import './App.css';

const WIDTH_KEY = 'poettery-sidebar-width';
const MIN_W = 220;
const MAX_W = 520;
const DEFAULT_W = 300;

const TOAST_ICONS = { success: '✓', error: '✕', folder: '⤷', info: 'ℹ' };
let toastSeq = 0;

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [folderPick, setFolderPick] = useState(null); // { path, ts } — последний даблклик по папке
  const [treeVersion, setTreeVersion] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    try {
      const saved = Number(localStorage.getItem(WIDTH_KEY));
      if (saved >= MIN_W && saved <= MAX_W) return saved;
    } catch {}
    return DEFAULT_W;
  });

  const pushToast = useCallback((text, type = 'info') => {
    const id = ++toastSeq;
    setToasts(prev => [...prev.slice(-3), { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800);
  }, []);

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleSelect = (path) => {
    setMobileTreeOpen(false);
    if (path === selectedFile) return;
    if (dirty && !window.confirm('Есть несохранённые изменения. Открыть другой файл? Текущий черновик будет заменён.')) return;
    setSelectedFile(path);
  };

  // Даблклик (или кнопка ⤷) по папке в дереве
  const handleFolderPick = (path) => {
    setFolderPick({ path, ts: Date.now() });
    pushToast(`Папка «${path}» подставлена в поле «Папка»`, 'folder');
    setMobileTreeOpen(false);
  };

  const handleSaved = (path) => {
    setTreeVersion(v => v + 1); // обновить дерево — новый файл появится сразу
    if (path) setSelectedFile(path);
  };

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

  return (
    <div
      className={`app${resizing ? ' is-resizing' : ''}${mobileTreeOpen ? ' tree-open' : ''}`}
      style={{ '--sidebar-w': `${sidebarWidth}px` }}
    >
      <div className="bg-glow bg-glow--amber" aria-hidden="true" />
      <div className="bg-glow bg-glow--violet" aria-hidden="true" />
      <div className="bg-grain" aria-hidden="true" />

      <aside className="sidebar">
        <FileTree
          onSelect={handleSelect}
          selectedFile={selectedFile}
          onFolderPick={handleFolderPick}
          pickedFolder={folderPick?.path}
          refreshKey={treeVersion}
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
          selectedFile={selectedFile}
          folderPick={folderPick}
          onDirtyChange={setDirty}
          onSaved={handleSaved}
          onNew={() => setSelectedFile(null)}
          onToast={pushToast}
          onOpenTree={() => setMobileTreeOpen(true)}
        />
      </main>

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