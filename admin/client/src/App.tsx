import { useEffect } from 'react';
import { Layout } from '@/layout/Layout';
import { Header } from '@/layout/Header';
import { Sidebar } from '@/layout/Sidebar';
import { PoemsView } from './features/poems/PoemsView.tsx';
import { Preview } from './features/poems/Preview.tsx';
import { usePoemsStore } from '@/features/poems/store.ts';

function App() {
  const loadPoems = usePoemsStore(s => s.loadPoems);

  useEffect(() => {
    loadPoems();
  }, [loadPoems]);

  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
      main={<PoemsView />}
      preview={<Preview />}
    />
  );
}

export default App;