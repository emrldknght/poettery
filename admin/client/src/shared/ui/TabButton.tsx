import type { ReactNode } from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        fontSize: '13px',
        fontWeight: 500,
        color: active ? 'var(--text)' : 'var(--text-muted)',
        background: 'none',
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: '-1px',
      }}
    >
      {children}
    </button>
  );
}
