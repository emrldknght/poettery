// check-yaml.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const TARGET_DIR = 'content';
const EXTENSIONS = ['.md', '.mdx', '.astro'];

async function* walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* walk(full);
        } else if (EXTENSIONS.includes(path.extname(entry.name))) {
            yield full;
        }
    }
}

async function checkFile(file) {
    const raw = await fs.readFile(file, 'utf8');

    // Ищем блок frontmatter между ---
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { file, ok: true, skipped: true }; // нет фронтматтера

    try {
        matter(raw); // gray-matter сам парсит YAML и бросает ошибку при проблемах
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

async function main() {
    const errors = [];
    let total = 0;

    for await (const file of walk(TARGET_DIR)) {
        total++;
        const result = await checkFile(file);
        if (!result.ok) errors.push(result);
    }

    console.log(`\nПроверено файлов: ${total}`);

    if (errors.length === 0) {
        console.log('✅ Все frontmatter-блоки валидны!');
        return;
    }

    console.log(`\n❌ Найдено ошибок: ${errors.length}\n`);
    for (const e of errors) {
        console.log(`📄 ${e.file}`);
        console.log(`   Строка ${e.line}, колонка ${e.column}`);
        console.log(`   → ${e.message}\n`);
    }

    process.exit(1); // ненулевой код, чтобы CI/скрипты видели проблему
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});