import { useState, useEffect } from 'react';
import { tagApi as tagsApi } from './api';
import { Button } from '@/shared/ui/Button';

interface Tag {
  id: number;
  name: string;
  poemsCount: number;
}

export function TagEditor() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagsApi.getAll();
      setTags(data);
    } catch (e) {
      console.error('Failed to load tags:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await tagsApi.rename(id, editName.trim());
      setEditingId(null);
      setEditName('');
      await loadTags();
    } catch (e) {
      console.error('Failed to rename tag:', e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тег? Это действие нельзя отменить.')) return;
    try {
      await tagsApi.delete(id);
      await loadTags();
    } catch (e) {
      console.error('Failed to delete tag:', e);
    }
  };

  const handleCreate = async () => {
    if (!newTagName.trim()) return;
    try {
      // Создаём тег через добавление к несуществующему стиху (хак)
      // Лучше сделать отдельный эндпоинт POST /api/tags
      await tagsApi.create(newTagName.trim());
      setNewTagName('');
      await loadTags();
    } catch (e) {
      console.error('Failed to create tag:', e);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;
  }

  return (
    <div>
      {/* Создание нового тега */}
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

      {/* Список тегов */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tags.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Нет тегов
          </div>
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
                  <Button variant="primary" size="sm" onClick={() => handleRename(tag.id)}>
                    ✓
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    ×
                  </Button>
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{tag.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {tag.poemsCount} {tag.poemsCount === 1 ? 'стих' : 'стихов'}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}>
                    ✎
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)}>
                    🗑
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}