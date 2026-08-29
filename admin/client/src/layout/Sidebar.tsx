import { useEffect, useMemo, useState } from 'react';
import { useFilesStore } from '@/features/files/store';
import { useUIStore } from '@/store/uiStore';
import { FileTreeNode } from './FileTreeNode';

export function Sidebar() {
  const { fileTree, fetchFileTree } = useFilesStore();
  const { expandedFolders, toggleFolder } = useUIStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  const expandedFoldersSet = useMemo(
    () => new Set(expandedFolders),
    [expandedFolders]
  );

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchFileTree();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px'
      }}>
        <span>Структура файлов</span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Обновить список файлов"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: isRefreshing ? 'wait' : 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.15s, color 0.15s, transform 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.background = 'var(--bg-hover, rgba(255,255,255,0.08))';
              e.currentTarget.style.color = 'var(--text-primary, #fff)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
            }}
          >
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

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