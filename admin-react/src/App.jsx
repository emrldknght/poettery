import { useState } from 'react';
import FileTree from './components/FileTree';
import EditorForm from './components/EditorForm';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', flexShrink: 0 }}>
        <FileTree onSelect={setSelectedFile} selectedFile={selectedFile} />
      </div>
      <EditorForm selectedFile={selectedFile} />
    </div>
  );
}

export default App;