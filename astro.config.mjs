import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://emrldknght.github.io',
    base: '/poettery/',  // ← ВАЖНО: добавлен слеш в конце

    outDir: './dist',
    srcDir: './src',

    // Для GitHub Pages рекомендуется явно указать поведение слешей
    trailingSlash: 'never',  // или 'always', в зависимости от ваших предпочтений

    vite: {
        assetsInclude: [
            '**/*.gp5',
        ],
    }
});