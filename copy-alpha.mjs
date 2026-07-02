import fs from 'node:fs';
import path from 'node:path';

const src = 'node_modules/@coderline/alphatab/dist';
const dest = 'public/alphatab';

// Удаляем старую папку если есть
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

// Копируем всё
fs.cpSync(src, dest, { recursive: true });

console.log('✅ AlphaTab скопирован в public/alphatab');