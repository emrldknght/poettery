export function Sidebar() {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
        Files
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
        (дерево файлов — на следующем шаге)
      </div>
    </div>
  );
}