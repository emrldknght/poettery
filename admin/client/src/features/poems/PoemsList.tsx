import type { Poem } from '@/shared/api/api.ts';
import { useUIStore } from '@/store/uiStore';
import { Badge } from '@/shared/ui/Badge.tsx';
import { PoemRow } from './PoemRow.tsx';

interface PoemsListProps {
  poems: Poem[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onTogglePublish: (slug: string) => void;
}

export function PoemsList({
                            poems,
                            selectedSlug,
                            onSelect,
                            onTogglePublish,
                          }: PoemsListProps) {
  const { collapsedSections, toggleSection } = useUIStore();

  // Группируем стихи по секциям
  const groups = new Map<string, Poem[]>();
  for (const poem of poems) {
    const section = poem.section || 'без секции';
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section)!.push(poem);
  }

  // Сортируем группы по алфавиту
  const sortedGroups = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {sortedGroups.map(([sectionName, items]) => {
        const isCollapsed = collapsedSections.includes(sectionName);

        return (
          <div key={sectionName}>
            <div
              onClick={() => toggleSection(sectionName)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                {isCollapsed ? '+' : '−'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {sectionName}
              </span>
              <Badge variant="muted">{items.length}</Badge>
            </div>

            {!isCollapsed && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                {items.map((poem) => (
                  <PoemRow
                    key={poem.slug}
                    poem={poem}
                    isSelected={selectedSlug === poem.slug}
                    onSelect={onSelect}
                    onTogglePublish={onTogglePublish}
                  />
                ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}