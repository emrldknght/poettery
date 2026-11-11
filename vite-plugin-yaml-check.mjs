// vite-plugin-yaml-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export default function yamlCheckAndHmrPlugin() {
    return {
        name: 'yaml-check-and-hmr',

        // 1. Проверяем всё при старте сервера
        buildStart() {
            checkAllYaml();
        },

        // 2. 🚀 HOT RELOAD: Слушаем изменения .md файлов
        handleHotUpdate({ file, server }) {
            // Нормализуем пути, чтобы работало и на Windows (\), и на Mac/Linux (/)
            const normalizedFile = path.normalize(file);
            const normalizedContentDir = path.normalize('src/content');

            if (normalizedFile.endsWith('.md') && normalizedFile.includes(normalizedContentDir)) {
                console.log(`\n🔄 [HMR] Изменён контент: ${path.relative(process.cwd(), file)}`);
                console.log('🔄 Выполняется полная перезагрузка страницы в браузере...\n');

                // Принудительно перезагружаем страницу (full-reload)
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });

                // Заодно мгновенно проверяем YAML изменённого файла
                checkSingleFile(file);
            }
        }
    };
}

// --- Вспомогательные функции (без изменений) ---

function checkAllYaml() {
    const contentDir = path.resolve(process.cwd(), 'src', 'content');
    if (!fs.existsSync(contentDir)) return;

    const files = getAllMdFiles(contentDir);
    let errors = 0;

    for (const file of files) {
        const result = checkSingleFile(file);
        if (!result.ok) {
            console.error(`\n❌ ${result.file}`);
            console.error(`   Строка ${result.line}, колонка ${result.column}`);
            console.error(`   → ${result.message}\n`);
            errors++;
        }
    }

    if (errors === 0) {
        console.log(`✅ YAML check: ${files.length} files OK`);
    }
}

function checkSingleFile(file) {
    try {
        const raw = fs.readFileSync(file, 'utf8');
        matter(raw);
        return { file, ok: true };
    } catch (err) {
        return {
            file,
            ok: false,
            line: err.mark ? err.mark.line + 1 : '?',
            column: err.mark ? err.mark.column + 1 : '?',
            message: err.reason || err.message,
        };
    }
}

function getAllMdFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...getAllMdFiles(full));
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            results.push(full);
        }
    }

    return results;
}