export function AnalizGroupStrof()
// группировка (сортировка) по типам строф и анализ каждой группы по отдельности (анализ песен), удаление уникальных строф AnalizGroupStrof CreateGroupStrof DelUnicStrof	StrofaPatternMas = [];		StrofaPatternTypeMas = [];
{

  StrofaRepeatTypeMas = [];
  let StartStrofy = 0;
  UnicStrof = 0;

// перебираем массив уникальных паттернов и определяем количество повторов в общем массиве паттернов - результат StrofaRepeatTypeMas
  for (let s = 0; s < StrofaPatternTypeMas.length; s++) {
    StrofaRepeatTypeMas[s] = 0;
    for (let n = 1; n < StrofaPatternMas.length; n++) {

      if (StrofaPatternMas[n] === StrofaPatternTypeMas[s]) {
        StrofaRepeatTypeMas[s] = StrofaRepeatTypeMas[s] + 1;
      }
    }
  }
  console.log("StrofaRepeatTypeMas");
  console.log(StrofaRepeatTypeMas);
  let cur = 0;
// сортируем типы паттернов строф по частоте повторяемости - сортируем StrofaRepeatTypeMas
// попарная перестановка m-максимум
  for (let k = 0; k < StrofaRepeatTypeMas.length; k++) {
    for (let m = 0; m < StrofaRepeatTypeMas.length; m++) {

      if (StrofaRepeatTypeMas[k] > StrofaRepeatTypeMas[m]) {
        // меняем местами максимум М и текущий К в StrofaRepeatTypeMas
        cur = StrofaRepeatTypeMas[k];
        StrofaRepeatTypeMas[k] = StrofaRepeatTypeMas[m];
        StrofaRepeatTypeMas[m] = cur;
        // одновременно меняем местами максимум М и текущий К в StrofaPatternTypeMas
        cur = StrofaPatternTypeMas[k];
        StrofaPatternTypeMas[k] = StrofaPatternTypeMas[m];
        StrofaPatternTypeMas[m] = cur;


      }
    }
  }


  for (let k = 0; k < StrofaRepeatTypeMas.length; k++) {
    if (StrofaRepeatTypeMas[k] === 1) {
      ++UnicStrof
    } //подсчёт количества уникальных строф
  }

  console.log("StrofaRepeatTypeMas после сортировки");
  console.log(StrofaRepeatTypeMas);
  console.log("StrofaPatternTypeMas после сортировки");
  console.log(StrofaPatternTypeMas);
  console.log("StrofaPatternMas");
  console.log(StrofaPatternMas);

  stih = document.formStih1.TextStih.value + "\n";
  stihMas = stih.split("\n");
}