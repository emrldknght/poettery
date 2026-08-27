import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from './db';
import { poems } from './schema';
// import { eq } from 'drizzle-orm';

// Путь к папке content относительно этого файла (admin/server/src -> ../../content)
const CONTENT_DIR = path.join(__dirname, '..', '..', '..', 'content');

export async function syncFiles() {
  console.log('🔄 Начало синхронизации...');

  // Рекурсивный обход папки
  function walkDir(dir: string, basePath: string = ''): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(walkDir(filePath, path.join(basePath, file)));
      } else if (file.endsWith('.md')) {
        results.push(path.join(basePath, file));
      }
    }
    return results;
  }

  const files = walkDir(CONTENT_DIR);
  console.log(`Найдено файлов: ${files.length}`);

  for (const relativePath of files) {
    const fullPath = path.join(CONTENT_DIR, relativePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const parsed = matter(fileContent);

    const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/'); // Убираем .md и нормализуем слеши
    const dirName = path.dirname(relativePath).replace(/\\/g, '/');
    const folderName = dirName === '.' ? 'main' : path.basename(dirName);

    // Логика Section: из хедера, если нет — из папки
    const sectionFromHeader = parsed.data.section;
    const finalSection = sectionFromHeader ? String(sectionFromHeader) : folderName;

    // Обновляем или вставляем запись.
    // Важно: мы НЕ перезаписываем published и tags, они остаются как есть в БД!
    await db.insert(poems).values({
      slug: slug,
      file_path: relativePath.replace(/\\/g, '/'),
      layout: parsed.data.layout || 'poem',
      title: parsed.data.title || null,
      date: parsed.data.date || null,
      section: finalSection,
    }).onConflictDoUpdate({
      target: poems.slug,
      set: {
        layout: parsed.data.layout || 'poem',
        title: parsed.data.title || null,
        date: parsed.data.date || null,
        section: finalSection,
        updated_at: new Date(),
      },
    });
  }

  console.log('✅ Синхронизация завершена!');
}