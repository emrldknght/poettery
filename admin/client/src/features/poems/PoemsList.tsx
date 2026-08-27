import type { Poem } from '@/shared/api/api.ts';
import { Badge } from '@/shared/ui/Badge.tsx';
import { PoemRow } from './PoemRow.tsx';

type GroupBy = 'section' | 'folder';

interface PoemsListProps {
  poems: Poem[];
  selectedSlug: string | null;
  groupBy: GroupBy;
  onSelect: (slug: string) => void;
  onTogglePublish: (slug: string) => void;
  onAddTag: (slug: string, tagName: string) => void;
  onRemoveTag: (slug: string, tagName: string) => void;
}

function getFolder(filePath: string): string {
  const parts = filePath.split('/');
  return parts.length > 1 ? parts[0] : 'root';
}

export function PoemsList({
  poems,
  selectedSlug,
  groupBy,
  onSelect,
  onTogglePublish,
  onAddTag,
  onRemoveTag,
}: PoemsListProps) {
  // Группируем стихи
  const groups = new Map<string, Poem[]>();
  for (const poem of poems) {
    const key = groupBy === 'section' ? poem.section : getFolder(poem.file_path);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(poem);
  }

  // Сортируем группы по алфавиту
  const sortedGroups = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {sortedGroups.map(([groupName, items]) => (
        <div key={groupName}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {groupName}
            </span>
            <Badge variant="muted">{items.length}</Badge>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <tbody>
              {items.map((poem) => (
                <PoemRow
                  key={poem.slug}
                  poem={poem}
                  isSelected={selectedSlug === poem.slug}
                  onSelect={onSelect}
                  onTogglePublish={onTogglePublish}
                  onAddTag={onAddTag}
                  onRemoveTag={onRemoveTag}
                />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
