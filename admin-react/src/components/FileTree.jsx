import { useEffect, useMemo, useRef, useState } from 'react';
import './FileTree.css';

const OPEN_KEY = 'poettery-tree-open';
const DBLCLICK_DELAY = 220; // пауза, чтобы одиночный клик не срабатывал при даблклике

/* ---------------- утилиты ---------------- */

function buildTree(files, dir = 1) {
  const root = { children: [] };
  files.forEach((filePath) => {
    const parts = filePath.split('/');
    let current = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const id = parts.slice(0, index + 1).join('/');
      let node = current.children.find((c) => c.name === part);
      if (!node) {
        node = {
          id,
          name: part,
          isLeaf: isFile,
          path: isFile ? filePath : undefined,
          children: isFile ? undefined : [],
        };
        current.children.push(node);
      }
      current = node;
    });
  });
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.isLeaf !== b.isLeaf) return a.isLeaf ? 1 : -1; // папки всегда сверху
      return a.name.localeCompare(b.name, 'ru') * dir;
    });
    nodes.forEach((n) => n.children && sortNodes(n.children));
  };
  sortNodes(root.children);
  return root.children;
}

function collectFolderIds(nodes, set = new Set()) {
  nodes.forEach((n) => {
    if (!n.isLeaf) {
      set.add(n.id);
      collectFolderIds(n.children, set);
    }
  });
  return set;
}

function collectParentIds(filePath) {
  if (!filePath) return new Set();
  const parts = filePath.split('/');
  const ids = new Set();
  for (let i = 1; i < parts.length; i++) ids.add(parts.slice(0, i).join('/'));
  return ids;
}

function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

/* ---------------- иконки ---------------- */

const svgProps = {
  width: 14, height: 14, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
  strokeLinecap: 'round', strokeLinejoin: 'round',
};

const ChevronIcon = () => (
  <svg {...svgProps} width={12} height={12}><path d="m9 18 6-6-6-6" /></svg>
);
const FolderIcon = () => (
  <svg {...svgProps}><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
);
const FolderOpenIcon = () => (
  <svg {...svgProps}><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></svg>
);
const FileIcon = () => (
  <svg {...svgProps}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
);
const SearchIcon = () => (
  <svg {...svgProps}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const RefreshIcon = () => (
  <svg {...svgProps}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
);
const PickIcon = () => (
  <svg {...svgProps} width={13} height={13}><path d="m15 10 5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" /></svg>
);
const ExpandIcon = () => (
  <svg {...svgProps}><path d="m7 6 5 5 5-5" /><path d="m7 13 5 5 5-5" /></svg>
);
const CollapseIcon = () => (
  <svg {...svgProps}><path d="m7 18 5-5 5 5" /><path d="m7 11 5-5 5 5" /></svg>
);
const FeatherIcon = () => (
  <svg {...svgProps} width={18} height={18}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
);

/* ---------------- подсветка совпадений поиска ---------------- */

function Highlight({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

/* ---------------- узел дерева ---------------- */

function TreeNode({
                    node, depth, openSet, toggle, onSelect, selectedFile,
                    highlightedIds, onFolderPick, pickedFolder, searching, query,
                  }) {
  const clickTimer = useRef(null);
  useEffect(() => () => clearTimeout(clickTimer.current), []);

  const isOpen = openSet.has(node.id);
  const isSelected = node.isLeaf && selectedFile === node.path;
  const isHighlighted = highlightedIds.has(node.id);
  const isPicked = !node.isLeaf && pickedFolder === node.id;

  const handleClick = () => {
    if (node.isLeaf) {
      onSelect(node.path);
      return;
    }
    if (searching) return; // при поиске всё раскрыто
    // откладываем toggle, чтобы даблклик не «щёлкнул» папкой
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => toggle(node.id), DBLCLICK_DELAY);
  };

  const handleDoubleClick = () => {
    if (node.isLeaf) return;
    clearTimeout(clickTimer.current);
    onFolderPick(node.id); // ← путь папки в поле «Папка»
  };

  const handleKey = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (node.isLeaf) onSelect(node.path);
    else if (!searching) toggle(node.id);
  };

  const rowClass = [
    'tree-row',
    node.isLeaf ? '' : 'tree-row--folder',
    isSelected ? 'is-selected' : '',
    isHighlighted ? 'is-trail' : '',
    isPicked ? 'is-picked' : '',
    searching && !node.isLeaf ? 'is-static' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="tree-node">
      <div
        className={rowClass}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKey}
        role="treeitem"
        aria-selected={isSelected}
        tabIndex={0}
        title={node.isLeaf ? node.path : `${node.id}\nДвойной клик — подставить в поле «Папка»`}
      >
        <span className={`tree-row__chev${isOpen ? ' is-open' : ''}`}>
          {!node.isLeaf && <ChevronIcon />}
        </span>
        <span className="tree-row__icon">
          {node.isLeaf ? <FileIcon /> : isOpen ? <FolderOpenIcon /> : <FolderIcon />}
        </span>
        <span className="tree-row__name">
          <Highlight text={node.name} query={query} />
        </span>
        {!node.isLeaf && (
          <button
            className="tree-row__pick"
            tabIndex={-1}
            title="Подставить в поле «Папка»"
            aria-label={`Подставить папку ${node.id} в поле «Папка»`}
            onClick={(e) => {
              e.stopPropagation();
              clearTimeout(clickTimer.current);
              onFolderPick(node.id);
            }}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <PickIcon />
          </button>
        )}
      </div>

      {!node.isLeaf && isOpen && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              openSet={openSet}
              toggle={toggle}
              onSelect={onSelect}
              selectedFile={selectedFile}
              highlightedIds={highlightedIds}
              onFolderPick={onFolderPick}
              pickedFolder={pickedFolder}
              searching={searching}
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- дерево ---------------- */

export default function FileTree({ onSelect, selectedFile, onFolderPick, pickedFolder, refreshKey }) {
  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [query, setQuery] = useState('');
  const [sortDir, setSortDir] = useState(1);

  // null = ещё ни разу не сохранялось → при первой загрузке раскрыть всё
  const [openSet, setOpenSet] = useState(() => {
    try {
      const saved = localStorage.getItem(OPEN_KEY);
      const arr = saved && JSON.parse(saved);
      if (Array.isArray(arr)) return new Set(arr);
    } catch {}
    return null;
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/admin-list')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        setFiles(Array.isArray(data.files) ? data.files : []);
        setLoaded(true);
      })
      .catch(() => setError('Не удалось загрузить список файлов'))
      .finally(() => setLoading(false));
  }, [refreshKey, retryKey]);

  // первое раскрытие
  useEffect(() => {
    if (!loaded || openSet !== null) return;
    setOpenSet(collectFolderIds(buildTree(files)));
  }, [loaded, files, openSet]);

  // персист раскрытых папок
  useEffect(() => {
    if (openSet === null) return;
    try { localStorage.setItem(OPEN_KEY, JSON.stringify([...openSet])); } catch {}
  }, [openSet]);

  const q = query.trim().toLowerCase();
  const visibleFiles = useMemo(
    () => (q ? files.filter((f) => f.toLowerCase().includes(q)) : files),
    [files, q]
  );
  const tree = useMemo(() => buildTree(visibleFiles, sortDir), [visibleFiles, sortDir]);
  const searchOpen = useMemo(() => (q ? collectFolderIds(tree) : null), [q, tree]);
  const effectiveOpen = searchOpen || openSet || new Set();
  const highlightedIds = useMemo(() => collectParentIds(selectedFile), [selectedFile]);
  const folderCount = useMemo(() => collectFolderIds(buildTree(files)).size, [files]);

  const toggle = (id) => {
    setOpenSet((prev) => {
      const next = new Set(prev || []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const retry = () => setRetryKey((k) => k + 1);
  const searching = Boolean(q);

  return (
    <div className="file-tree">
      <div className="tree-head">
        <div className="brand">
          <div className="brand__mark"><FeatherIcon /></div>
          <div className="brand__text">
            <div className="brand__name">Poettery</div>
            <div className="brand__sub">рукописи · песни</div>
          </div>
          <button className="icon-btn" onClick={retry} disabled={loading} title="Обновить список" aria-label="Обновить список">
            <span className={loading ? 'spin' : ''} style={{ display: 'grid' }}><RefreshIcon /></span>
          </button>
        </div>

        <div className="brand__staff" aria-hidden="true" />

        <div className="tree-search">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
            placeholder="Поиск по файлам…"
            aria-label="Поиск по файлам"
          />
          {query && (
            <button className="tree-search__clear" onClick={() => setQuery('')} aria-label="Сбросить поиск">×</button>
          )}
        </div>
      </div>

      {error && loaded && (
        <div className="tree-error-strip">
          Не удалось обновить список
          <button onClick={retry}>повторить</button>
        </div>
      )}

      <div className="tree-scroll" role="tree" aria-label="Файлы">
        {!loaded && loading && (
          <div className="skel" aria-hidden="true">
            {[82, 64, 74, 58, 70, 48, 66, 52].map((w, i) => (
              <div key={i} className="skel-row" style={{ width: `${w}%`, marginLeft: i % 3 === 2 ? 18 : 0 }} />
            ))}
          </div>
        )}

        {!loaded && error && (
          <div className="tree-note">
            <div className="tree-note__glyph">⚠</div>
            {error}
            <br />
            <button className="btn btn--ghost" onClick={retry}>Повторить</button>
          </div>
        )}

        {loaded && files.length === 0 && (
          <div className="tree-note">
            <div className="tree-note__glyph">✒</div>
            Файлов пока нет.<br />Создайте первый — форма справа.
          </div>
        )}

        {loaded && files.length > 0 && visibleFiles.length === 0 && (
          <div className="tree-note">
            Ничего не найдено по «{query.trim()}»
            <br />
            <button className="btn btn--ghost" onClick={() => setQuery('')}>Сбросить поиск</button>
          </div>
        )}

        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            openSet={effectiveOpen}
            toggle={toggle}
            onSelect={onSelect}
            selectedFile={selectedFile}
            highlightedIds={highlightedIds}
            onFolderPick={onFolderPick}
            pickedFolder={pickedFolder}
            searching={searching}
            query={q}
          />
        ))}
      </div>

      <div className="tree-foot">
        <span className="tree-foot__count">
          {searching
            ? `${visibleFiles.length} из ${files.length}`
            : `${files.length} ${plural(files.length, ['файл', 'файла', 'файлов'])} · ${folderCount} ${plural(folderCount, ['папка', 'папки', 'папок'])}`}
        </span>
        <button
          className="icon-btn"
          title="Развернуть всё"
          aria-label="Развернуть всё"
          disabled={searching || !loaded}
          onClick={() => setOpenSet(collectFolderIds(buildTree(files)))}
        >
          <ExpandIcon />
        </button>
        <button
          className="icon-btn"
          title="Свернуть всё"
          aria-label="Свернуть всё"
          disabled={searching || !loaded}
          onClick={() => setOpenSet(new Set())}
        >
          <CollapseIcon />
        </button>
        <button
          className="tree-foot__sort"
          title="Порядок сортировки"
          onClick={() => setSortDir((d) => -d)}
        >
          {sortDir === 1 ? 'А→Я' : 'Я→А'}
        </button>
      </div>
    </div>
  );
}