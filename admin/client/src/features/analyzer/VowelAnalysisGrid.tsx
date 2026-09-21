interface VowelAnalysisGridProps {
  vowelTemplates: string[];
  rhythm: number[];
  stats: { blue: number; gray: number; black: number };
}

export function VowelAnalysisGrid({ vowelTemplates, rhythm, stats }: VowelAnalysisGridProps) {
  const maxLen = Math.max(...vowelTemplates.map(s => s.length));

  const getColor = (ritmValue: number) => {
    if (ritmValue === 3) return '#212121';
    if (ritmValue === 2) return '#757575';
    return '#0d47a1';
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <table style={{ borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
        <tr>
          <th style={{ padding: 4, border: '1px solid #ddd', background: '#f5f5f5', width: 30 }}></th>
          {Array.from({ length: maxLen }, (_, i) => (
            <th key={i} style={{ padding: 4, border: '1px solid #ddd', background: '#f5f5f5', width: 28, fontSize: 12 }}>
              {i + 1}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {vowelTemplates.map((row, r) => (
          <tr key={r}>
            <td style={{ padding: 4, border: '1px solid #ddd', background: '#f5f5f5', textAlign: 'center', fontWeight: 'bold' }}>
              {row.length}
            </td>
            {Array.from({ length: maxLen }, (_, c) => {
              const vowel = row[c] || '';
              const ritmValue = rhythm[c] ?? 1;
              const bgColor = (vowel) ? getColor(ritmValue) : 'transparent';

              return (
                <td key={c} style={{
                  padding: 4,
                  border: '1px solid #ddd',
                  background: bgColor,
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 14,
                  minWidth: 24,
                }}>
                  {vowel}
                </td>
              );
            })}
          </tr>
        ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: 8, background: '#0d47a1', color: '#fff', fontWeight: 'bold' }}>
          0-БЕЗУДАРНЫЕ ГЛАСНЫЕ: {stats.blue} шт.
        </div>
        <div style={{ padding: 8, background: '#757575', color: '#fff', fontWeight: 'bold' }}>
          1-СЛАБОУДАРНЫЕ ГЛАСНЫЕ: {stats.gray} шт.
        </div>
        <div style={{ padding: 8, background: '#212121', color: '#fff', fontWeight: 'bold' }}>
          2-УДАРНЫЕ ГЛАСНЫЕ: {stats.black} шт.
        </div>
      </div>
    </div>
  );
}