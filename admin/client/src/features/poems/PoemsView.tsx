import { usePoemsStore } from '@/features/poems/store.ts';
import { PoemsList } from './PoemsList.tsx';

export function PoemsView() {
  const {
    poems,
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
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px'
      }}>
        По секциям
      </div>

      <PoemsList
        poems={poems}
        selectedSlug={selectedSlug}
        onSelect={selectPoem}
        onTogglePublish={togglePublish}
      />
    </div>
  );
}