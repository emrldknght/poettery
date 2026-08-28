import { useState, useEffect, useMemo } from 'react';
import { useFilesStore } from '@/features/files/store';
import { usePoemsStore } from '@/features/poems/store';
import { FileTreeNode } from './FileTreeNode';
import { TabButton } from '@/shared/ui/TabButton';
import type { FileNode } from '@/features/files';

type SidebarView = 'files' | 'sections';

export function Sidebar() {
  const { fileTree, fetchFileTree } = useFilesStore();
  const { poems } = usePoemsStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['']));
  const [view, setView] = useState<SidebarView>('files');

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

  const sectionTree = useMemo<FileNode[]>(() => {
    const groups = new Map<string, FileNode[]>();

    for (const poem of poems) {
      const section = poem.section || 'без секции';
      if (!groups.has(section)) groups.set(section, []);
      groups.get(section)!.push({
        name: `${poem.title || poem.slug}.md`,
        type: 'file',
        path: poem.slug,
        slug: poem.slug,
        inDb: true,
      });
    }

    return Array.from(groups.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sectionName, children]) => ({
        name: sectionName,
        type: 'folder' as const,
        path: `section:${sectionName}`,
        children: children.sort((a, b) => a.name.localeCompare(b.name)),
      }));
  }, [poems]);

  const currentTree = view === 'files' ? fileTree : sectionTree;
  const title = view === 'files' ? 'Структура файлов' : 'По секциям';

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px'
      }}>
        {title}
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <TabButton active={view === 'files'} onClick={() => setView('files')}>
          📁 Файлы
        </TabButton>
        <TabButton active={view === 'sections'} onClick={() => setView('sections')}>
          📑 Секции
        </TabButton>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentTree.length === 0 ? (
          <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-subtle)' }}>
            {view === 'files' ? 'Загрузка...' : 'Нет стихов'}
          </div>
        ) : (
          currentTree.map((node, idx) => (
            <FileTreeNode
              key={node.path}
              node={node}
              level={0}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              isLast={idx === currentTree.length - 1}
              showSyncButton={view === 'files'}
            />
          ))
        )}
      </div>
    </div>
  );
}