import { useEffect, useState } from 'react';

const DRAFT_KEY = 'poettery-draft';

export default function EditorForm({ selectedFile }) {
  const [formData, setFormData] = useState({
    slug: '',
    folder: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    layout: 'poem',
    review: '',
    content: '',
  });
  const [message, setMessage] = useState('');
  const [draftStatus, setDraftStatus] = useState('');

  useEffect(() => {
    if (selectedFile) {
      fetch(`/admin-load?file=${encodeURIComponent(selectedFile)}`)
        .then(r => r.json())
        .then(data => {
          setFormData(data);
          localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
          setDraftStatus(`📂 загружен ${selectedFile}`);
        });
    } else {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
          setDraftStatus('♻️ черновик восстановлен');
        } catch {}
      } else {
        const now = new Date();
        setFormData(prev => ({
          ...prev,
          date: now.toISOString().split('T')[0],
          folder: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`,
        }));
      }
    }
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, [name]: value }));
      setDraftStatus(`✏️ автосохранение...`);
    }, 400);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/admin-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Сохранено: ${result.path}`);
        setDraftStatus('💾 записано на диск');
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch {
      setMessage('❌ Ошибка сети');
    }
  };

  const handleNew = () => {
    if (!confirm('Очистить форму и черновик?')) return;
    localStorage.removeItem(DRAFT_KEY);
    const now = new Date();
    setFormData({
      slug: '',
      folder: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`,
      title: '',
      date: now.toISOString().split('T')[0],
      layout: 'poem',
      review: '',
      content: '',
    });
    setMessage('');
    setDraftStatus('🆕 новый файл');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  return (
    <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: message.startsWith('✅') ? '#155724' : '#721c24',
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <div>
          <label>Slug:</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
          <div className="hint">Без .md</div>

          <label>Папка:</label>
          <input type="text" name="folder" value={formData.folder} onChange={handleChange} />

          <label>Заголовок:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />

          <label>Дата:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          <label>Layout:</label>
          <select name="layout" value={formData.layout} onChange={handleChange}>
            <option value="poem">Poem</option>
            <option value="music">Music</option>
          </select>

          <label>Review:</label>
          <input type="text" name="review" value={formData.review} onChange={handleChange} />

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={handleSave} style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              💾 Сохранить
            </button>
            <button onClick={handleNew} style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              🆕 Новый
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
            {draftStatus}
          </div>
        </div>

        <div>
          <label>Контент (Markdown):</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            style={{
              width: '100%',
              minHeight: '500px',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              lineHeight: '1.5',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
}