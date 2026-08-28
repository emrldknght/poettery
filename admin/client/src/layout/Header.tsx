import { usePoemsStore } from '@/features/poems/store.ts';
import { useFilesStore } from '@/features/files/store';
import { Button } from '@/shared/ui';
import {TagEditorModal} from "@/features/layout/TagEditorModal.tsx";
import {useEffect, useState} from "react";
import {useTagsStore} from "@/features/tags/store.ts";

export function Header() {
  const { poems, error, clearError } = usePoemsStore();

  const { sync, isSyncing } = useFilesStore();
  const { tags, fetchTags } = useTagsStore();
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const [isTagEditorOpen, setIsTagEditorOpen] = useState(false);

  return (
    <>
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <h1 style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>
          poettery
        </h1>
        <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
          admin · {poems.length} poems
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {error && (
          <button
            onClick={clearError}
            style={{
              fontSize: '12px',
              color: 'var(--danger)',
              padding: '4px 8px',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              background: '#fef2f2',
            }}
          >
            ⚠ {error}
          </button>
        )}
        <Button variant="secondary" onClick={() => setIsTagEditorOpen(true)}>
          🏷 Теги [{tags.length}]
        </Button>
        <Button variant="primary" onClick={sync} disabled={isSyncing}>
          {isSyncing ? 'Синхронизация...' : '↻ Sync'}
        </Button>
      </div>
    </header>

      <TagEditorModal isOpen={isTagEditorOpen} onClose={() => setIsTagEditorOpen(false)} />
    </>
  );
}