import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://emrldknght.github.io',
  base: '/poettery',
  outDir: './dist',
  srcDir: './src',              // корень проекта — корень для Astro
  // publicDir: '.',           // все файлы доступны как статика
  vite: {
    // Разрешаем импорт этих файлов как ассетов
    assetsInclude: [
      '**/*.gp5',
      // '**/*.sf2',
      // '**/*.worker.mjs'
    ],
  }
});