import { useEffect, useMemo, useRef, useState } from 'react';
import './CommandPalette.css';

const svgProps = {
  width: 14, height: 14, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round', strokeLinejoin: 'round',
};

const FileGlyph = () => (
  <svg {...svgProps}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
);
const CommandGlyph = () => (
  <svg {...svgProps}><path d="m9 9 3 3-3 3" /><path d="M14 15h3" /><rect x="3" y="4" width="18" height="16" rx="2" /></svg>
);

export default function CommandPalette({ open, onClose, files, commands, onSelectFile, selectedFile }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setIndex(0);
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  const q = query.trim().toLowerCase();

  const items = useMemo(() => {
    const cmds = commands
      .filter(c => !q || c.label.toLowerCase().includes(q))
      .map(c => ({ type: 'command', ...c }));
    const fs = files
      .filter(f => !q || f.toLowerCase().includes(q))
      .slice(0, q ? 40 : 8)
      .map(f => ({ type: 'file', id: f, label: f }));
    return [...cmds, ...fs];
  }, [q, commands, files]);

  useEffect(() => { setIndex(0); }, [q]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${index}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const run = (item) => {
    if (!item) return;
    onClose();
    if (item.type === 'file') onSelectFile(item.id);
    else item.run();
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(items[index]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="palette-layer" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Командная палитра">
        <div className="palette__input">
          <span className="palette__glyph">⌁</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Файл или команда…"
            aria-label="Поиск файлов и команд"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="palette__list" ref={listRef} role="listbox">
          {items.length === 0 && <div className="palette__empty">Ничего не найдено</div>}
          {items.map((item, i) => (
            <button
              key={`${item.type}:${item.id}`}
              data-idx={i}
              role="option"
              aria-selected={i === index}
              className={`palette__item${i === index ? ' is-active' : ''}${item.type === 'file' && item.id === selectedFile ? ' is-current' : ''}`}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(item)}
            >
              <span className="palette__item-icon">
                {item.type === 'file' ? <FileGlyph /> : <CommandGlyph />}
              </span>
              <span className="palette__item-label">{item.label}</span>
              {item.hint && <kbd>{item.hint}</kbd>}
              {item.type === 'file' && <span className="palette__item-kind">файл</span>}
            </button>
          ))}
        </div>

        <div className="palette__foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> навигация</span>
          <span><kbd>Enter</kbd> открыть</span>
          <span className="palette__foot-count">{items.length} результатов</span>
        </div>
      </div>
    </div>
  );
}