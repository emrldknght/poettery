import { useEffect, useState } from 'react';

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

  // сортируем: папки сверху, файлы снизу, внутри — по алфавиту
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

function TreeNode({ node, depth, openSet, toggle, onSelect, selectedFile }) {
  const isOpen = openSet.has(node.id);

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
          background: selectedFile === node.path ? '#e3f2fd' : 'transparent',
          fontWeight: selectedFile === node.path ? 600 : 400,
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

  useEffect(() => {
    fetch('/admin-list')
      .then(r => r.json())
      .then(({ files }) => {
        const built = buildTree(files);
        setTree(built);
        // раскрываем все папки по умолчанию
        const all = new Set();
        const walk = (nodes) => nodes.forEach(n => {
          if (!n.isLeaf) { all.add(n.id); walk(n.children); }
        });
        walk(built);
        setOpenSet(all);
      });
  }, []);

  const toggle = (id) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
        />
      ))}
    </div>
  );
}