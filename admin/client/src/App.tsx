import { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

interface Poem {
  slug: string;
  file_path: string;
  layout: string;
  title: string | null;
  date: string | null;
  section: string;
  published: boolean;
  tags?: string[];
}

function App() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const fetchPoems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/poems');

      // Проверяем, что запрос успешен
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Проверяем, что data — это массив
      if (!Array.isArray(data)) {
        throw new Error('Сервер вернул неверный формат данных');
      }

      setPoems(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert(`Ошибка загрузки стихов: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      alert(data.message || 'Синхронизация завершена');
      fetchPoems();
    } catch (err) {
      console.error('Ошибка синхронизации:', err);
      alert(`Ошибка синхронизации: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setSyncing(false);
    }
  };

  const togglePublished = async (slug: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/poems/${slug}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      // Оптимистичное обновление UI
      setPoems(prev => prev.map(p =>
        p.slug === slug ? { ...p, published: !currentStatus } : p
      ));
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const showPreview = async (slug: string) => {
    try {
      const res = await fetch(`/api/files/${slug}`);
      const data = await res.json();
      // Убираем YAML-хедер для чистого превью (простая эвристика)
      const contentWithoutHeader = data.content.replace(/^---[\s\S]*?---\n/, '');
      setPreviewContent(md.render(contentWithoutHeader));
    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📚 Админка Poettery</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          {syncing ? 'Синхронизация...' : '🔄 Синхронизировать файлы'}
        </button>
      </header>

      {loading ? (
        <p>Загрузка данных...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Левая колонка: Список */}
          <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '15px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3>Список файлов ({poems.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Pub</th>
                <th style={{ padding: '8px' }}>Section</th>
                <th style={{ padding: '8px' }}>Title / Slug</th>
                <th style={{ padding: '8px' }}>Date</th>
                <th style={{ padding: '8px' }}>Действия</th>
              </tr>
              </thead>
              <tbody>
              {poems.map(poem => (
                <tr key={poem.slug} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="checkbox"
                      checked={poem.published}
                      onChange={() => togglePublished(poem.slug, poem.published)}
                    />
                  </td>
                  <td style={{ padding: '8px', fontSize: '14px', color: '#666' }}>{poem.section}</td>
                  <td style={{ padding: '8px' }}>
                    <strong>{poem.title || poem.slug}</strong>
                    <div style={{ fontSize: '12px', color: '#888' }}>{poem.file_path}</div>
                  </td>
                  <td style={{ padding: '8px', fontSize: '14px' }}>{poem.date || '—'}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => showPreview(poem.slug)}
                      style={{ padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      👁 Превью
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Правая колонка: Превью */}
          <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '15px', maxHeight: '80vh', overflowY: 'auto', background: '#fafafa' }}>
            <h3>Предпросмотр</h3>
            {previewContent ? (
              <div
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: previewContent }}
                style={{ lineHeight: '1.6' }}
              />
            ) : (
              <p style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>
                Выберите стих для предпросмотра
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;