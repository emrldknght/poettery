import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'slovar_full_accent.txt');
const outputPath = path.join(__dirname, 'slovar_full_accent.json');

console.log('Читаем файл...');
const content = fs.readFileSync(inputPath, 'utf-8');

console.log('Разбиваем...');
const words = content.split(',');

console.log('Строим Map...');
const accentMap = new Map();
for (const word of words) {
  if (word.trim()) {
    accentMap.set(word.toLowerCase(), word);
  }
}

console.log(`Слов: ${accentMap.size}`);
console.log('Сохраняем JSON...');
const dictObject = Object.fromEntries(accentMap);
fs.writeFileSync(outputPath, JSON.stringify(dictObject), 'utf-8');

const size = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
console.log(`✓ Готово! Размер: ${size} МБ`);