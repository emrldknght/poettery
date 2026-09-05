import {usePoemsStore} from "@/features/poems/store.ts";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();
export const Analyzer = () => {
  const { selectedSlug, previewContent, poems } = usePoemsStore();
  const poem = poems.find(p => p.slug === selectedSlug);

  if (!selectedSlug || !poem) {
    return (
      <div style={{
        padding: '20px',
        color: 'blue',
        fontSize: '13px',
        backgroundColor: 'peru',
      }}>
        Выбери стих для анализа
      </div>
    );
  }

  const body = (previewContent || '').replace(/^---\s*[\s\S]*?\s*---\s*\n?/, '');
  const html = md.render(body);

  return (
    <div style={{
      marginTop: 'auto',
      padding: '10px',
      backgroundColor: 'peru',
    }}>
      Analyzer<br />
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
  )
}