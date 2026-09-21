import { analyzePoemWithFeto } from './lib/fetoAdapter.js';

const testPoemShort = `Ночь, улица, фонарь, аптека,
Бессмысленный и тусклый свет.
Живи еще хоть четверть века —
Все будет так. Исхода нет.`;

const testPoem = `Ночь, улица, фонарь, аптека,
Бессмысленный и тусклый свет.
Живи еще хоть четверть века —
Всё будет так. Исхода нет.

Умрёшь — начнёшь опять сначала
И повторится всё, как встарь:
Ночь, ледяная рябь канала,
Аптека, улица, фонарь.`;

console.log('Запускаем анализ...');
const result = analyzePoemWithFeto(testPoem);

console.log('\n=== РЕЗУЛЬТАТ ===');
console.log(result);
/*
console.log('Текст с ударениями:', result.accentedText);
console.log('\nСтатистика:', result.stats);
console.log('\nHTML шаблона (первые 500 символов):');
console.log(result.templateHtml.substring(0, 500));
*/