import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PoemsView } from './components/poems/PoemsView';
import { Preview } from './components/poems/Preview';
import { usePoemsStore } from './store/poemsStore';

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