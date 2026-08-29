import { useEffect, useMemo } from 'react';
import { useFilesStore } from '@/features/files/store';
import { useUIStore } from '@/store/uiStore';
import { FileTreeNode } from './FileTreeNode';

export function Sidebar() {
  const { fileTree, fetchFileTree } = useFilesStore();
  const { expandedFolders, toggleFolder } = useUIStore();

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  const expandedFoldersSet = useMemo(
    () => new Set(expandedFolders),
    [expandedFolders]
  );

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
          fileTree.map((node, idx) => (
            <FileTreeNode
              key={node.path}
              node={node}
              level={0}
              expandedFolders={expandedFoldersSet}
              onToggleFolder={toggleFolder}
              isLast={idx === fileTree.length - 1}
              showSyncButton={true}
            />
          ))
        )}
      </div>
    </div>
  );
}