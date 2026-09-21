import { analyzePoemWithFeto, getRawState } from './lib/fetoAdapter.js';
import fs from 'fs';
import path from 'path';

const TEST_POEM = `Ночь, улица, фонарь, аптека,
Бессмысленный и тусклый свет.
Живи еще хоть четверть века —
Все будет так. Исхода нет.`;

const SNAPSHOT_PATH = path.resolve(__dirname, 'state-snapshot.json');

// Функция для очистки стейта от мусора перед сохранением в JSON
function sanitizeState(obj: any, depth = 0): any {
  // Защита от бесконечной рекурсии
  if (depth > 5) return '[MAX_DEPTH]';
  if (obj === null || obj === undefined) return null;

  // Пропускаем функции и DOM-узлы
  if (typeof obj === 'function') return '[FUNCTION]';
  if (typeof obj === 'object' && obj !== null && 'nodeName' in obj) return '[DOM_NODE]';

  if (Array.isArray(obj)) {
    // Если это огромный словарь, сохраняем только его длину, а не содержимое
    if (obj.length > 1000) {
      return `[ARRAY_LENGTH_${obj.length}]`;
    }
    return obj.map(item => sanitizeState(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Пропускаем огромные словари по ключу
        if (key.includes('slovar') && key.includes('Mas') && Array.isArray(obj[key]) && obj[key].length > 1000) {
          result[key] = `[DICT_LENGTH_${obj[key].length}]`;
        } else {
          result[key] = sanitizeState(obj[key], depth + 1);
        }
      }
    }
    return result;
  }

  return obj;
}

async function runTest() {
  console.log('🚀 Запуск анализа тестового стихотворения...');

  // 1. Запускаем анализ
  const result = analyzePoemWithFeto(TEST_POEM);

  // 2. Получаем "сырой" стейт (нужно добавить экспорт в fetoAdapter, см. шаг 2)
  const rawState = getRawState();

  // 3. Очищаем стейт для снапшота
  const cleanState = sanitizeState(rawState);
  const actualJson = JSON.stringify(cleanState, null, 2);

  // 4. Логика обновления или проверки
  const shouldUpdate = process.env.UPDATE_SNAPSHOT === '1';

  if (shouldUpdate) {
    console.log('🔄 Режим обновления: сохраняем новый эталон...');
    fs.writeFileSync(SNAPSHOT_PATH, actualJson, 'utf-8');
    console.log(`✅ Эталон сохранён в ${SNAPSHOT_PATH}`);
    console.log('💡 Теперь можно рефакторить. Для проверки запускайте без UPDATE_SNAPSHOT=1');
  } else {
    console.log('🔍 Режим проверки: сравниваем с эталоном...');

    if (!fs.existsSync(SNAPSHOT_PATH)) {
      console.error('❌ ОШИБКА: Файл эталона state-snapshot.json не найден!');
      console.log('💡 Запустите: UPDATE_SNAPSHOT=1 npx tsx test-refactor.ts');
      process.exit(1);
    }

    const expectedJson = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');

    if (actualJson === expectedJson) {
      console.log('✅ ВСЁ СОВПАДАЕТ! Рефакторинг не сломал внутреннее состояние.');
    } else {
      console.error('❌ ПРОВАЛ! Состояние изменилось.');
      console.log('📝 Различия можно посмотреть, сравнив файлы:');
      console.log(`   - Ожидалось: ${SNAPSHOT_PATH}`);

      const actualPath = path.resolve(__dirname, 'state-actual-failed.json');
      fs.writeFileSync(actualPath, actualJson, 'utf-8');
      console.log(`   - Получилось: ${actualPath}`);
      console.log('💡 Используйте VS Code (выделить оба файла -> Сравнить) или diff, чтобы найти отличия.');
      process.exit(1);
    }
  }
}

runTest();