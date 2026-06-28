import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'content/tabs';
const destDir = 'public/content/tabs';

function copyGp5() {
  if (!fs.existsSync(srcDir)) {
    console.log('⚠️ Папка content/tabs не найдена');
    return;
  }

  // Удаляем старую папку
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  fs.mkdirSync(destDir, { recursive: true });

  function findGp5Files(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findGp5Files(fullPath));
      } else if (entry.name.endsWith('.gp5')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const gp5Files = findGp5Files(srcDir);

  for (const file of gp5Files) {
    const relativePath = path.relative(srcDir, file);
    const destPath = path.join(destDir, relativePath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(file, destPath);
    console.log(`✅ Скопирован: ${relativePath}`);
  }

  console.log(`🎵 Все .gp5 скопированы в public/ (${gp5Files.length} шт.)`);
}

copyGp5();