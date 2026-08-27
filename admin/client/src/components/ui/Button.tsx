import type {ButtonHTMLAttributes, ReactNode} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '4px 10px' : '6px 14px',
        fontSize: size === 'sm' ? '12px' : '13px',
        fontWeight: 500,
        borderRadius: '4px',
        border: '1px solid',
        transition: 'all 0.15s',
        ...(variant === 'primary' && {
          background: 'var(--accent)',
          color: 'white',
          borderColor: 'var(--accent)',
        }),
        ...(variant === 'secondary' && {
          background: 'white',
          color: 'var(--text)',
          borderColor: 'var(--border-strong)',
        }),
        ...(variant === 'ghost' && {
          background: 'transparent',
          color: 'var(--text-muted)',
          borderColor: 'transparent',
        }),
      }}
    >
      {children}
    </button>
  );
}