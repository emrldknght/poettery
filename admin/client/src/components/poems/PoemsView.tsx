import { usePoemsStore } from '@/store/poemsStore';
import { TabButton } from '@/components/ui/TabButton';
import { PoemsList } from './PoemsList';

export function PoemsView() {
  const {
    poems,
    view,
    setView,
    togglePublish,
    selectedSlug,
    selectPoem,
    isLoading,
    addTag,
    removeTag,
  } = usePoemsStore();

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Табы */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
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
        groupBy={view === 'by-sections' ? 'section' : 'folder'}
        onSelect={selectPoem}
        onTogglePublish={togglePublish}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />
    </div>
  );
}
