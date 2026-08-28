import { usePoemsStore } from '@/features/poems/store.ts';
import { TabButton } from '@/shared/ui/TabButton.tsx';
import { PoemsList } from './PoemsList.tsx';

export function PoemsView() {
  const {
    poems,
    view,
    setView,
    togglePublish,
    selectedSlug,
    selectPoem,
    isLoading,
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
      />
    </div>
  );
}
