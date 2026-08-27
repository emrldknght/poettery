import type {ReactNode} from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'muted';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        fontSize: '11px',
        fontWeight: 500,
        borderRadius: '10px',
        border: '1px solid',
        letterSpacing: '0.02em',
        ...(variant === 'default' && {
          background: 'var(--bg-soft)',
          color: 'var(--text)',
          borderColor: 'var(--border)',
        }),
        ...(variant === 'success' && {
          background: '#f0fdf4',
          color: 'var(--success)',
          borderColor: '#bbf7d0',
        }),
        ...(variant === 'muted' && {
          background: 'transparent',
          color: 'var(--text-subtle)',
          borderColor: 'var(--border)',
        }),
      }}
    >
      {children}
    </span>
  );
}