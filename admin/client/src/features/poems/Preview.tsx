import { usePoemsStore } from '@/features/poems/store.ts';
import MarkdownIt from 'markdown-it';
import {MetadataEditor} from "@/features/poems/MetadataEditor.tsx";

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
  const body = (previewContent || '').replace(/^---\s*[\s\S]*?\s*---\s*\n?/, '');
  const html = md.render(body);

  return (
    <div style={{ padding: '20px' }}>
      <MetadataEditor
        slug={poem.slug}
        title={poem.title}
        date={poem.date}
        section={poem.section}
      />

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