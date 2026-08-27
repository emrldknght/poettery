import { useState, useEffect } from 'react';
import { useFilesStore } from '@/features/files/store';
import { FileTreeNode } from './FileTreeNode';
import type { FileNode } from '@/features/files/api';

export function Sidebar() {
  const { fileTree, fetchFileTree } = useFilesStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px'
      }}>
        Структура файлов
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {fileTree.length === 0 ? (
          <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-subtle)' }}>
            Загрузка...
          </div>
        ) : (
          fileTree.map(node => (
            <FileTreeNode
              key={node.path}
              node={node}
              level={0}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
}