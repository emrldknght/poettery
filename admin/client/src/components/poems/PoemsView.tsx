import { usePoemsStore } from '@/store/poemsStore.ts';
import { Badge } from '@/components/ui/Badge';
import { Checkbox } from '@/components/ui/Checkbox';

export function PoemsView() {
  const { poems, view, setView, togglePublish, selectedSlug, selectPoem, isLoading } = usePoemsStore();

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Табы */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <TabButton active={view === 'by-sections'} onClick={() => setView('by-sections')}>
          По секциям
        </TabButton>
        <TabButton active={view === 'by-folders'} onClick={() => setView('by-folders')}>
          По каталогам
        </TabButton>
      </div>

      {/* Список стихов */}
      <PoemsList
        poems={poems}
        selectedSlug={selectedSlug}
        onSelect={selectPoem}
        onTogglePublish={togglePublish}
        groupBy={view === 'by-sections' ? 'section' : 'folder'}
      />
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 500,
        color: active ? 'var(--text)' : 'var(--text-muted)',
        background: 'none',
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: '-1px',
      }}
    >
      {children}
    </button>
  );
}

function PoemsList({ poems, selectedSlug, onSelect, onTogglePublish, groupBy }: any) {
  // Группируем
  const groups = new Map<string, typeof poems>();
  for (const poem of poems) {
    const key = groupBy === 'section' ? poem.section : getFolder(poem.file_path);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(poem);
  }

  // Сортируем группы по алфавиту
  const sortedGroups = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {sortedGroups.map(([groupName, items]) => (
        <div key={groupName}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {groupName}
            </span>
            <Badge variant="muted">{items.length}</Badge>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
            {items.map((poem: any) => (
              <tr
                key={poem.slug}
                onClick={() => onSelect(poem.slug)}
                style={{
                  cursor: 'pointer',
                  background: selectedSlug === poem.slug ? 'var(--accent-soft)' : 'transparent',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <td style={{ padding: '8px', width: '40px' }} onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={poem.published}
                    onChange={() => onTogglePublish(poem.slug)}
                  />
                </td>
                <td style={{ padding: '8px' }}>
                  <div style={{ fontWeight: 500 }}>{poem.title || poem.slug}</div>
                  <div className="mono" style={{ color: 'var(--text-subtle)', marginTop: '2px' }}>
                    {poem.file_path}
                  </div>
                </td>
                <td style={{ padding: '8px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '12px', width: '100px' }}>
                  {poem.date || '—'}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function getFolder(filePath: string): string {
  const parts = filePath.split('/');
  return parts.length > 1 ? parts[0] : 'root';
}