import { TagBadge } from './TagBadge';
import { TagInput } from './TagInput';

interface TagDisplayProps {
  slug: string;
  tags: string[];
  onAdd: (slug: string, tagName: string) => void;
  onRemove: (slug: string, tagName: string) => void;
}

export function TagDisplay({ slug, tags, onAdd, onRemove }: TagDisplayProps) {
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          name={tag}
          onRemove={() => onRemove(slug, tag)}
        />
      ))}
      <TagInput onAdd={(tagName) => onAdd(slug, tagName)} />
    </div>
  );
}