import { defineConfig } from 'astro/config';
import yamlCheckPlugin from "./vite-plugin-yaml-check.mjs";

export default defineConfig({
    site: 'https://emrldknght.github.io',
    base: '/poettery/',  // ← ВАЖНО: добавлен слеш в конце

    outDir: './dist',
    srcDir: './src',

    // Для GitHub Pages рекомендуется явно указать поведение слешей
    trailingSlash: 'never', //, в зависимости от ваших предпочтений

    vite: {
        server: {
            watch: {
                // Следим за папкой content вне src/
                ignored: ['!content/**/*'],
            },
        },
        plugins: [yamlCheckPlugin()],
        assetsInclude: [
            '**/*.gp5',
        ],
    }
});