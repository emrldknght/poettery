import type { Poem } from '@/api/api';
import { Checkbox } from '@/components/ui/Checkbox';
import { TagBadge } from './TagBadge';
import { TagInput } from './TagInput';

interface PoemRowProps {
  poem: Poem;
  isSelected: boolean;
  onSelect: (slug: string) => void;
  onTogglePublish: (slug: string) => void;
  onAddTag: (slug: string, tagName: string) => void;
  onRemoveTag: (slug: string, tagName: string) => void;
}

export function PoemRow({
  poem,
  isSelected,
  onSelect,
  onTogglePublish,
  onAddTag,
  onRemoveTag,
}: PoemRowProps) {
  return (
    <tr
      onClick={() => onSelect(poem.slug)}
      style={{
        cursor: 'pointer',
        background: isSelected ? 'var(--accent-soft)' : 'transparent',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Чекбокс published */}
      <td style={{ padding: '8px', width: '40px' }} onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={poem.published}
          onChange={() => onTogglePublish(poem.slug)}
        />
      </td>

      {/* Основная информация */}
      <td style={{ padding: '8px' }}>
        <div style={{ fontWeight: 500 }}>{poem.title || poem.slug}</div>
        <div className="mono" style={{ color: 'var(--text-subtle)', marginTop: '2px' }}>
          {poem.file_path}
        </div>

        {/* Теги */}
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {poem.tags.map((tag) => (
            <TagBadge
              key={tag}
              name={tag}
              onRemove={() => onRemoveTag(poem.slug, tag)}
            />
          ))}
          <TagInput onAdd={(tagName) => onAddTag(poem.slug, tagName)} />
        </div>
      </td>

      {/* Дата */}
      <td
        style={{
          padding: '8px',
          textAlign: 'right',
          color: 'var(--text-muted)',
          fontSize: '12px',
          width: '100px',
        }}
      >
        {poem.date || '—'}
      </td>
    </tr>
  );
}
