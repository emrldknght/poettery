// PoemStats.tsx
interface PoemStatsProps {
  stats: {
    total: number;
    blue: number;
    gray: number;
    black: number;
  };
  legend: {
    blue: { code: number; label: string; count: number };
    gray: { code: number; label: string; count: number };
    black: { code: number; label: string; count: number };
  };
}

export function PoemStats({ stats, legend }: PoemStatsProps) {
  return (
    <div className="poem-stats" style={{ marginBottom: '20px' }}>
      <h3>Статистика гласных:</h3>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <strong>{legend.blue.label}:</strong> {stats.blue}
        </div>
        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>{legend.gray.label}:</strong> {stats.gray}
        </div>
        <div style={{ padding: '10px', backgroundColor: '#212121', color: 'white', borderRadius: '4px' }}>
          <strong>{legend.black.label}:</strong> {stats.black}
        </div>
        <div style={{ padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
          <strong>Всего слогов:</strong> {stats.total}
        </div>
      </div>
    </div>
  );
}