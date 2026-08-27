import type {ReactNode} from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  preview: ReactNode;
  header: ReactNode;
}

export function Layout({ sidebar, main, preview, header }: LayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '260px 1fr 380px',
        gridTemplateAreas: `
          "header header header"
          "sidebar main preview"
        `,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div style={{ gridArea: 'header', borderBottom: '1px solid var(--border)' }}>
        {header}
      </div>
      <aside
        style={{
          gridArea: 'sidebar',
          borderRight: '1px solid var(--border)',
          overflowY: 'auto',
          background: 'var(--bg-soft)',
        }}
      >
        {sidebar}
      </aside>
      <main style={{ gridArea: 'main', overflowY: 'auto' }}>
        {main}
      </main>
      <aside
        style={{
          gridArea: 'preview',
          borderLeft: '1px solid var(--border)',
          overflowY: 'auto',
          background: 'var(--bg-soft)',
        }}
      >
        {preview}
      </aside>
    </div>
  );
}