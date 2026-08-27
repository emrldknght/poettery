import { usePoemsStore } from '@/features/poems/store.ts';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export function Preview() {
  const { selectedSlug, previewContent, poems } = usePoemsStore();
  const poem = poems.find(p => p.slug === selectedSlug);

  if (!selectedSlug || !poem) {
    return (
      <div style={{ padding: '20px', color: 'var(--text-subtle)', fontSize: '13px' }}>
        Выбери стих для предпросмотра
      </div>
    );
  }

  // Убираем YAML-хедер
  const body = (previewContent || '').replace(/^---[\s\S]*?---\n/, '');
  const html = md.render(body);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Preview
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>{poem.title || poem.slug}</div>
        <div className="mono" style={{ color: 'var(--text-subtle)', fontSize: '11px', marginTop: '4px' }}>
          {poem.file_path}
        </div>
      </div>

      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: '14px',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
        }}
      />
    </div>
  );
}