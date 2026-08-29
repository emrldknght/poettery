import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// В ES модулях __dirname нет по умолчанию, создаём его вручную
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к твоему файлу
const filePath = path.join(__dirname, 'slovar_full_accent.txt');

console.log('Читаем файл...');
const content = fs.readFileSync(filePath, 'utf-8');

// Разбиваем по запятым
const words = content.split(',');
console.log(`Всего слов в словаре: ${words.length}`);

// Показываем первые 10 слов для проверки
console.log('Первые 10 слов:', words.slice(0, 10));

// Создаем быстрый словарь (Map) для мгновенного поиска
const accentMap = new Map();
for (const word of words) {
  if (word.trim()) {
    accentMap.set(word.toLowerCase(), word);
  }
}

console.log(`Загружено в Map: ${accentMap.size} слов`);

// Тест поиска
const testWord = 'молоко';
const result = accentMap.get(testWord);
console.log(`Проверка слова "${testWord}": ${result || 'не найдено'}`);