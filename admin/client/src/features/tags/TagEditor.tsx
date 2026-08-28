import { useState, useEffect } from 'react';
import { useTagsStore } from './store';
import { Button } from '@/shared/ui/Button';

export function TagEditor() {
  const { tags, isLoading, fetchTags, createTag, renameTag, deleteTag } = useTagsStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleRename = async (id: number) => {
    if (!editName.trim()) return;
    await renameTag(id, editName.trim());
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тег? Это действие удалит его из всех стихов.')) return;
    await deleteTag(id);
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    await createTag(newTagName.trim());
    setNewTagName('');
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Новый тег..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        />
        <Button variant="primary" onClick={handleCreate} disabled={!newTagName.trim()}>
          Создать
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tags.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Нет тегов</div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
              }}
            >
              {editingId === tag.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(tag.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      fontSize: '13px',
                    }}
                  />
                  <Button variant="primary" size="sm" onClick={() => handleRename(tag.id)}>✓</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>×</Button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{tag.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {tag.poemsCount} {tag.poemsCount === 1 ? 'стих' : 'стихов'}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}>✎</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)}>🗑</Button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}