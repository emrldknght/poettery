interface TagBadgeProps {
  name: string;
  onRemove: () => void;
}

export function TagBadge({ name, onRemove }: TagBadgeProps) {
  return (
    <span
      onClick={onRemove}
      title="Нажми, чтобы удалить"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        fontSize: '11px',
        borderRadius: '4px',
        background: 'var(--bg-soft)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {name}
      <span style={{ fontSize: '14px', lineHeight: 1, fontWeight: 'bold' }}>×</span>
    </span>
  );
}
