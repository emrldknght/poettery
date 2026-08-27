import type { FileNode } from '@/features/files/api';
import { FileNodeItem } from './FileNodeItem';

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

export function FileTreeNode({ node, level, expandedFolders, onToggleFolder }: FileTreeNodeProps) {
  const isExpanded = expandedFolders.has(node.path);
  const paddingLeft = level * 16 + 8;

  if (node.type === 'folder') {
    return (
      <div>
        <div
          onClick={() => onToggleFolder(node.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            background: isExpanded ? 'var(--border)' : 'transparent',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '14px' }}>{isExpanded ? '📂' : '📁'}</span>
          {node.name}
        </div>
        {isExpanded && node.children?.map(child => (
          <FileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
          />
        ))}
      </div>
    );
  }

  // Для файла делегируем рендер FileNodeItem
  return (
    <FileNodeItem node={node} paddingLeft={paddingLeft + 16} />
  );
}