import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const CONTENT_DIR = path.join(__dirname, 'src', 'content');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'admin-ui')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-ui', 'index.html'));
});

// Список всех файлов
app.get('/admin-list', (req, res) => {
    const walk = (dir) => {
        let out = [];
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) out = out.concat(walk(full));
            else if (e.name.endsWith('.md')) {
                out.push(path.relative(CONTENT_DIR, full).replace(/\\/g, '/'));
            }
        }
        return out;
    };
    res.json({ files: walk(CONTENT_DIR).sort() });
});

// Загрузка одного файла
app.get('/admin-load', (req, res) => {
    try {
        const rel = String(req.query.file || '');
        const filePath = path.resolve(CONTENT_DIR, rel);
        if (!filePath.startsWith(CONTENT_DIR)) throw new Error('Bad path');

        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);
        const parts = rel.replace(/\.md$/, '').split('/');
        const slug = parts.pop();
        const folder = parts.join('/');

        res.json({
            slug,
            folder,
            title: data.title || '',
            date: data.date ? String(data.date).slice(0, 10) : '',
            layout: data.layout || 'poem',
            review: Array.isArray(data.review) ? data.review.join(', ') : (data.review || ''),
            content: content.replace(/^\r?\n/, ''),
        });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

// Сохранение файла
app.post('/admin-save', (req, res) => {
    try {
        const { slug, folder, title, date, layout, review, content } = req.body;
        if (!slug || !title || !date) {
            return res.status(400).json({ error: 'Заполни slug, title и date' });
        }

        let yaml = `---\nlayout: ${layout}\ntitle: "${title}"\ndate: "${date}"\n`;
        const reviewArray = (review || '').split(',').map(r => r.trim()).filter(Boolean);
        if (reviewArray.length) {
            yaml += `review:\n`;
            reviewArray.forEach(r => { yaml += `  - ${r}\n`; });
        }
        yaml += `---\n\n${content}`;

        const targetDir = folder ? path.resolve(CONTENT_DIR, folder) : CONTENT_DIR;
        if (!targetDir.startsWith(CONTENT_DIR)) throw new Error('Bad folder');
        fs.mkdirSync(targetDir, { recursive: true });

        const filePath = path.join(targetDir, `${slug}.md`);
        fs.writeFileSync(filePath, yaml, 'utf-8');

        const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
        console.log(`✨ Сохранён: ${relativePath}`);
        res.json({ success: true, path: relativePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🎸 Poettery Admin: http://localhost:${PORT}\n`);
});