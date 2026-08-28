import { usePoemsStore } from '@/features/poems/store';
import { TagBadge } from './TagBadge';
import { TagInput } from './TagInput';

interface TagDisplayProps {
  slug: string;
  tags: string[];
}

export function TagDisplay({ slug, tags }: TagDisplayProps) {
  const addTag = usePoemsStore((state) => state.addTag);
  const removeTag = usePoemsStore((state) => state.removeTag);

  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {tags.map((tag) => (
        <TagBadge
          key={tag}
          name={tag}
          onRemove={() => removeTag(slug, tag)}
        />
      ))}
      <TagInput onAdd={(tagName) => addTag(slug, tagName)} />
    </div>
  );
}