import { useFilesStore } from '@/features/files/store';
import { Button } from '@/shared/ui/Button';
import type { FileNode } from '@/features/files/api';

interface FileNodeItemProps {
  node: FileNode;
  paddingLeft: number;
}

export function FileNodeItem({ node, paddingLeft }: FileNodeItemProps) {
  const { syncSingleFile, isSyncing } = useFilesStore();

  if (!node.path) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 8px',
        paddingLeft: `${paddingLeft}px`,
        fontSize: '12px',
        color: node.inDb ? 'var(--text)' : 'var(--text-muted)',
        borderRadius: '4px',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flex: 1,
        overflow: 'hidden'
      }}>
        <span style={{ fontSize: '12px' }}>📄</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name.replace(/\.md$/, '')}
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => syncSingleFile(node.path!)}
        disabled={isSyncing}
        style={{
          padding: '2px 6px',
          fontSize: '14px',
          lineHeight: 1,
          fontWeight: 'bold',
          color: node.inDb ? 'var(--text-muted)' : 'var(--accent)',
        }}
        title={node.inDb ? 'Обновить данные из файла' : 'Добавить в БД'}
      >
        {node.inDb ? '↻' : '+'}
      </Button>
    </div>
  );
}