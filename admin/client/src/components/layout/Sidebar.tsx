import { useState, useEffect } from 'react';
import { usePoemsStore } from '@/store/poemsStore';
import { Button } from '@/components/ui/Button';
import type { FileNode } from '@/api/api';

export function Sidebar() {
  const { fileTree, fetchFileTree, syncSingleFile, isSyncing } = usePoemsStore();
  // По умолчанию раскрываем корневую папку
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

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const paddingLeft = level * 16 + 8;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            onClick={() => toggleFolder(node.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 8px', cursor: 'pointer',
              background: isExpanded ? 'var(--border)' : 'transparent',
              fontSize: '13px', fontWeight: 500,
              borderRadius: '4px',
              transition: 'background 0.1s'
            }}
          >
            <span style={{ fontSize: '14px' }}>{isExpanded ? '📂' : '📁'}</span>
            {node.name}
          </div>
          {isExpanded && node.children?.map(child => renderNode(child, level + 1))}
        </div>
      );
    }

    // File node
    return (
      <div
        key={node.path}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 8px', paddingLeft: `${paddingLeft + 16}px`,
          fontSize: '12px', color: node.inDb ? 'var(--text)' : 'var(--text-muted)',
          borderRadius: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, overflow: 'hidden' }}>
          <span style={{ fontSize: '12px' }}>📄</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.name.replace(/\.md$/, '')}
          </span>
        </div>

        {!node.inDb && node.path ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => syncSingleFile(node.path!)}
            disabled={isSyncing}
            style={{ padding: '2px 6px', fontSize: '14px', lineHeight: 1, fontWeight: 'bold' }}
            title="Добавить в БД"
          >
            +
          </Button>
        ) : (
          <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Верхние кнопки (пока заглушки, добавим функционал позже) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <Button variant="secondary" size="sm" style={{ flex: 1 }} disabled>
          + Файл
        </Button>
        <Button variant="secondary" size="sm" style={{ flex: 1 }} disabled>
          + Папка
        </Button>
      </div>

      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        Структура файлов
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {fileTree.length === 0 ? (
          <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-subtle)' }}>
            Загрузка структуры...
          </div>
        ) : (
          fileTree.map(node => renderNode(node))
        )}
      </div>
    </div>
  );
}