/** @param state {FetoState} */
export function AnalizGroupStrof(state)
// группировка (сортировка) по типам строф и анализ каждой группы по отдельности (анализ песен), удаление уникальных строф AnalizGroupStrof CreateGroupStrof DelUnicStrof	StrofaPatternMas = [];		StrofaPatternTypeMas = [];
{

  state.StrofaRepeatTypeMas = [];
  // let StartStrofy = 0;
  state.UnicStrof = 0;

// перебираем массив уникальных паттернов и определяем количество повторов в общем массиве паттернов - результат StrofaRepeatTypeMas
  for (let s = 0; s < state.StrofaPatternTypeMas.length; s++) {
    state.StrofaRepeatTypeMas[s] = 0;
    for (let n = 1; n < state.StrofaPatternMas.length; n++) {

      if (state.StrofaPatternMas[n] === state.StrofaPatternTypeMas[s]) {
        state.StrofaRepeatTypeMas[s] = state.StrofaRepeatTypeMas[s] + 1;
      }
    }
  }
  console.log("StrofaRepeatTypeMas");
  console.log(state.StrofaRepeatTypeMas);
  let cur = 0;
// сортируем типы паттернов строф по частоте повторяемости - сортируем StrofaRepeatTypeMas
// попарная перестановка m-максимум
  for (let k = 0; k < state.StrofaRepeatTypeMas.length; k++) {
    for (let m = 0; m < state.StrofaRepeatTypeMas.length; m++) {

      if (state.StrofaRepeatTypeMas[k] > state.StrofaRepeatTypeMas[m]) {
        // меняем местами максимум М и текущий К в StrofaRepeatTypeMas
        cur = state.StrofaRepeatTypeMas[k];
        state.StrofaRepeatTypeMas[k] = state.StrofaRepeatTypeMas[m];
        state.StrofaRepeatTypeMas[m] = cur;
        // одновременно меняем местами максимум М и текущий К в StrofaPatternTypeMas
        cur = state.StrofaPatternTypeMas[k];
        state.StrofaPatternTypeMas[k] = state.StrofaPatternTypeMas[m];
        state.StrofaPatternTypeMas[m] = cur;


      }
    }
  }


  for (let k = 0; k < state.StrofaRepeatTypeMas.length; k++) {
    if (state.StrofaRepeatTypeMas[k] === 1) {
      ++state.UnicStrof
    } //подсчёт количества уникальных строф
  }

  console.log("StrofaRepeatTypeMas после сортировки");
  console.log(state.StrofaRepeatTypeMas);
  console.log("StrofaPatternTypeMas после сортировки");
  console.log(state.StrofaPatternTypeMas);
  console.log("StrofaPatternMas");
  console.log(state.StrofaPatternMas);

  state.stih = state.OriginalTextInput + "\n";
  state.stihMas = state.stih.split("\n");
}