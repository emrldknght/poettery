// Preview.tsx
import { usePoemsStore } from '@/features/poems/store.ts';
import MarkdownIt from 'markdown-it';
import { MetadataEditor } from "@/features/poems/MetadataEditor.tsx";
import { PoemAnalysis } from "@/features/analyzer/PoemAnalysis.tsx";
import {useAnalyzerStore} from "@/features/analyzer/store.ts";


const md = new MarkdownIt();

export function Preview() {
  const { selectedSlug, previewContent, poems } = usePoemsStore();
  // const [analysisResult, setAnalysisResult] = useState<any>(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const { result, isLoading, error, setAnalysisResult,
    setLoading, setError, clearAnalysis } = useAnalyzerStore();

  // ... (твой код получения body)


  const poem = poems.find(p => p.slug === selectedSlug);

  if (!selectedSlug || !poem) {
    return (
      <div style={{ padding: '20px', color: 'var(--text-subtle)', fontSize: '13px' }}>
        Выбери стих для предпросмотра
      </div>
    );
  }

  const body = (previewContent || '').replace(/^---\s*[\s\S]*?\s---\s*\n?/, '');
  const html = md.render(body);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    // setAnalysisResult(null);
    clearAnalysis(); // Очищаем старый результат перед новым запросом

    try {
      const response = await fetch('/api/feto/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: body }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <MetadataEditor
        slug={poem.slug}
        title={poem.title}
        date={poem.date}
        section={poem.section}
      />

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !body.trim()}
        style={{
          margin: '10px 0',
          padding: '8px 16px',
          cursor: isLoading ? 'wait' : 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {isLoading ? 'Анализ...' : 'Анализ стиха (FETO)'}
      </button>

      {error && (
        <div style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffebee' }}>
          {error}
        </div>
      )}

      {/* Оригинальный текст */}
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: '14px',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#fafafa',
          borderRadius: '4px'
        }}
      />

      {/* Результат анализа */}
      {result && (
        <PoemAnalysis data={result} />
      )}
    </div>
  );
}