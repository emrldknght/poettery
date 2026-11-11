import {useEffect, useState} from "react";
import {Tree} from "react-arborist";
function buildTree(files) {
  const root = { id: 'root', name: 'content', children: [] };

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
          children: isFile ? undefined : [],
          isLeaf: isFile,
          path: filePath,
          // Начальное состояние: папки раскрыты, файлы не имеют состояния
          isOpen: isFile ? undefined : true,
        };
        current.children.push(node);
      }
      current = node;
    });
  });

  return root.children;
}
export default function FileTree({ onSelect, selectedFile }) {
  const [data, setData] = useState([]);
  const [openState, setOpenState] = useState({});

  useEffect(() => {
    fetch('/admin-list')
      .then(r => r.json())
      .then(({ files }) => {
        const tree = buildTree(files);
        setData(tree);
        // все папки раскрыты по умолчанию
        const init = {};
        const walk = (nodes) => nodes.forEach(n => {
          if (n.children) { init[n.id] = true; walk(n.children); }
        });
        walk(tree);
        setOpenState(init);
      });
  }, []);

  const handleToggle = (id) => {
    setOpenState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Tree
      data={data}
      initialOpenState={openState}
      width={300}
      height={600}
      onToggle={handleToggle}
      rowHeight={28}
      indent={16}
      onSelect={(nodes) => {
        if (nodes.length && nodes[0].isLeaf) onSelect(nodes[0].data.path);
      }}
    >
      {({ node, style }) => (
        <div
          style={{ ...style, /* ваши стили */ }}
          onClick={() => {
            if (node.isLeaf) {
              onSelect(node.data.path);
            } else {
              node.toggle();   // ← используйте это вместо handlers.toggle()
            }
          }}
        >
          <span style={{ flexShrink: 0 }}>{node.isLeaf ? '📄' : '📁'}</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {node.data.name}
    </span>
        </div>
      )}
    </Tree>
  );
}