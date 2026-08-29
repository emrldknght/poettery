import {useEffect, useState} from 'react';
import { usePoemsStore } from './store';
import { Button } from '@/shared/ui/Button';
import {SectionInput} from "@/features/poems/SectionInput.tsx";

interface MetadataEditorProps {
  slug: string;
  title: string | null;
  date: string | null;
  section: string;
}

export function MetadataEditor({ slug, title, date, section }: MetadataEditorProps) {
  const updateMetadata = usePoemsStore((state) => state.updateMetadata);

  // Синхронизация состояния с пропсами при смене стиха
  useEffect(() => {
    setEditTitle(title || '');
    setEditDate(date || '');
    setEditSection(section || '');
    setIsEditing(false); // Выходим из режима редактирования
  }, [slug, title, date, section]);

  const [editTitle, setEditTitle] = useState(title || '');
  const [editDate, setEditDate] = useState(date || '');
  const [editSection, setEditSection] = useState(section || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMetadata(slug, {
        title: editTitle.trim() || null,
        date: editDate.trim() || null,
        section: editSection.trim() || section,
      });
      setIsEditing(false);
    } catch (e) {
      console.error('Failed to update metadata:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(title || '');
    setEditDate(date || '');
    setEditSection(section || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Название
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{title || slug}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            ✎
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Дата публикации
            </div>
            <div className="mono" style={{ color: 'var(--text-subtle)' }}>
              {date || '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Секция
            </div>
            <div className="mono" style={{ color: 'var(--text-subtle)' }}>
              {section}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Title
          </label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontSize: '13px',
              marginTop: '4px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date
            </label>
            <input
              type="text"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '13px',
                marginTop: '4px',
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Section
            </label>
            <SectionInput
              value={editSection}
              onChange={setEditSection}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}