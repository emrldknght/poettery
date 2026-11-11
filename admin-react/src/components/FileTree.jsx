import { useEffect, useState, useMemo } from 'react';

const OPEN_KEY = 'poettery-tree-open';

function buildTree(files) {
  const root = { children: [] };

  files.forEach(filePath => {
    const parts = filePath.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const id = parts.slice(0, index + 1).join('/');

      let node = current.children.find(c => c.name === part);
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
      if (a.isLeaf !== b.isLeaf) return a.isLeaf ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(n => n.children && sortNodes(n.children));
  };
  sortNodes(root.children);

  return root.children;
}

// Собирает id всех родительских папок для пути файла
function collectParentIds(filePath) {
  if (!filePath) return new Set();
  const parts = filePath.split('/');
  const ids = new Set();
  for (let i = 1; i < parts.length; i++) {
    ids.add(parts.slice(0, i).join('/'));
  }
  return ids;
}

function TreeNode({ node, depth, openSet, toggle, onSelect, selectedFile, highlightedIds }) {
  const isOpen = openSet.has(node.id);
  const isSelected = selectedFile === node.path;
  const isHighlighted = highlightedIds.has(node.id);

  let background = 'transparent';
  if (isSelected) background = '#487395';
  else if (isHighlighted) background = '#3471a7';

  return (
    <div>
      <div
        onClick={() => {
          if (node.isLeaf) {
            onSelect(node.path);
          } else {
            toggle(node.id);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          paddingLeft: 8 + depth * 16,
          cursor: 'pointer',
          fontSize: 13,
          background,
          fontWeight: isSelected ? 600 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <span style={{ flexShrink: 0, width: 12, display: 'inline-block' }}>
          {node.isLeaf ? '' : (isOpen ? '▾' : '▸')}
        </span>
        <span style={{ flexShrink: 0 }}>{node.isLeaf ? '📄' : '📁'}</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.name}
        </span>
      </div>

      {!node.isLeaf && isOpen && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              openSet={openSet}
              toggle={toggle}
              onSelect={onSelect}
              selectedFile={selectedFile}
              highlightedIds={highlightedIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ onSelect, selectedFile }) {
  const [tree, setTree] = useState([]);
  const [openSet, setOpenSet] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/admin-list')
      .then(r => r.json())
      .then(({ files }) => {
        const built = buildTree(files);
        setTree(built);

        const allIds = new Set();
        const walk = (nodes) => nodes.forEach(n => {
          if (!n.isLeaf) { allIds.add(n.id); walk(n.children); }
        });
        walk(built);

        // восстанавливаем из localStorage, иначе раскрываем всё
        let initial = allIds;
        try {
          const saved = localStorage.getItem(OPEN_KEY);
          if (saved) {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr)) {
              initial = new Set(arr.filter(id => allIds.has(id)));
            }
          }
        } catch {}

        setOpenSet(initial);
        setLoaded(true);
      });
  }, []);

  // сохраняем openSet в localStorage при каждом изменении
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify([...openSet]));
    } catch {}
  }, [openSet, loaded]);

  const toggle = (id) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const highlightedIds = useMemo(() => collectParentIds(selectedFile), [selectedFile]);

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      borderRight: '1px solid #ddd',
      background: '#fafafa',
      padding: '8px 0',
    }}>
      {tree.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          openSet={openSet}
          toggle={toggle}
          onSelect={onSelect}
          selectedFile={selectedFile}
          highlightedIds={highlightedIds}
        />
      ))}
    </div>
  );
}