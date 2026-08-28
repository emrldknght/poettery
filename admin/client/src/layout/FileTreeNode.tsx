import type { FileNode } from '@/features/files';
import { FileNodeItem } from './FileNodeItem';

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  isLast: boolean;
  showSyncButton?: boolean;
}

export function FileTreeNode({
                               node,
                               level,
                               expandedFolders,
                               onToggleFolder,
                               isLast,
                               showSyncButton = true,
                             }: FileTreeNodeProps) {
  const isExpanded = expandedFolders.has(node.path);

  const prefix = Array.from({ length: level }).map(() => '│  ').join('');
  const connector = isLast ? '└─ ' : '─ ';

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => onToggleFolder(node.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            cursor: 'pointer',
            background: isExpanded ? 'var(--border)' : 'transparent',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          <span style={{ color: 'var(--text-muted)', userSelect: 'none' }}>
            {prefix}{connector}
          </span>
          <span>{isExpanded ? '📂' : '📁'}</span>
          <span>{node.name}</span>
        </div>

        {isExpanded && node.children?.map((child, idx) => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
            isLast={idx === node.children!.length - 1}
            showSyncButton={showSyncButton}
          />
        ))}
      </div>
    );
  }

  return (
    <FileNodeItem
      node={node}
      prefix={`${prefix}${connector}`}
      showSyncButton={showSyncButton}
    />
  );
}