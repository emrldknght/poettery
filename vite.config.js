import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/scripts/tabs.js',
      name: 'Tabs',
      fileName: 'tabs',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        dir: 'public/dist'
      }
    }
  }
});