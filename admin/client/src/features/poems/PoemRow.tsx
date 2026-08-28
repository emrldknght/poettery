import type { Poem } from '@/shared/api/api.ts';
import { Checkbox } from '@/shared/ui/Checkbox.tsx';
import { TagDisplay } from '@/features/tags/TagDisplay.tsx';

interface PoemRowProps {
  poem: Poem;
  isSelected: boolean;
  onSelect: (slug: string) => void;
  onTogglePublish: (slug: string) => void;
}

export function PoemRow({
                          poem,
                          isSelected,
                          onSelect,
                          onTogglePublish,
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
        <TagDisplay
          slug={poem.slug}
          tags={poem.tags}
        />
      </td>
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