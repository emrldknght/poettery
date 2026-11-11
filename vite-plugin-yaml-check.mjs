// vite-plugin-yaml-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export default function yamlCheckPlugin() {
    return {
        name: 'yaml-check',

        // Проверяем при старте dev-сервера
        buildStart() {
            checkAllYaml();
        },

        // Проверяем при каждом изменении файла
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.md') || file.endsWith('.mdx') || file.endsWith('.astro')) {
                const result = checkSingleFile(file);
                if (!result.ok) {
                    server.config.logger.error(`\n❌ YAML Error in ${result.file}`);
                    server.config.logger.error(`   Строка ${result.line}, колонка ${result.column}`);
                    server.config.logger.error(`   → ${result.message}\n`);
                }
            }
        }
    };
}

function checkAllYaml() {
    const contentDir = './content';
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
    } else {
        console.error(`❌ YAML check: ${errors} errors found`);
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