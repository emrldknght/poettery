// test-snapshot.ts
import { analyzePoemWithFeto } from './lib/fetoAdapter.js';
import fs from 'fs';

const testPoem = `Ночь, улица, фонарь, аптека,
Бессмысленный и тусклый свет.
Живи еще хоть четверть века —
Все будет так. Исхода нет.`;

const result = analyzePoemWithFeto(testPoem);
const actual = JSON.stringify(result, null, 2);

try {
  const expected = fs.readFileSync('snapshot-expected.txt', 'utf-8');
  if (actual === expected) {
    console.log('✅ OK — результат совпадает с эталоном');
  } else {
    console.log('❌ FAIL — результат изменился!');
    fs.writeFileSync('snapshot-actual.txt', actual);
    console.log('Сравни: snapshot-expected.txt vs snapshot-actual.txt');
    process.exit(1);
  }
} catch {
  console.log('⚠️  Эталон не найден, создаю snapshot-expected.txt');
  fs.writeFileSync('snapshot-expected.txt', actual);
}