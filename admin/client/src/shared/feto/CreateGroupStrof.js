/** @param state {FetoState} */
export function CreateGroupStrof(state) {
// выводим строфы в порядке частотности типов строф (сначала часто повторяющиеся) перебираем отсортированный StrofaPatternTypeMas[k], находим совпадающие в StrofaPatternMas[s] и выводим строки с позициями StrofaPositionMas; на выходе массив GroupStrof;
// заодно запоминаем, куда какая строфа переместилась. Массив StrofaPositionMas - позиция начала каждой строфы. Создадим новый массив ReturnStrofaPositionMas, который запомнит, в какой группе  строфа оказалась, а порядок их следования - это порядок следования индексов в массиве.
  state.GroupStrof = [];

  ReturnStrofaPositionMas = [];
  let CountStroka = 0;
  let kk = 0;
  let flagkk = 0;

  for (let k = 0; k < state.StrofaPatternTypeMas.length; k++) {
    if (state.StrofaRepeatTypeMas[k] > 1) {
      kk = k
    }
    ; // если это уникальная строфа, то прибавляем к предыдущей уникальной строфе

    for (let s = 1; s < state.StrofaPatternMas.length; s++) {
      if (state.StrofaPatternMas[s] === state.StrofaPatternTypeMas[k]) {
        // вывод строфы
        // начало CountStroka, конец - количество строк в паттерне = StrofaPatternMas[s].length
        let StartStrofy = state.StrofaPositionMas[s];
        let FinalStrofy = state.StrofaPositionMas[s + 1];


        if (state.StrofaRepeatTypeMas[k] > 1) {
          kk = k
        }
        ; //если это неуникальная строфа, то прибавляем к текущей строфе
        if (state.StrofaRepeatTypeMas[k] === 1) {
          if (flagkk === 0) {
            flagkk = k;
          }
          ; // если это первая уникальная строфа, то прибавляем к следующей после неуникальной
        }


        if (flagkk > 0) {
          kk = flagkk;
        }
        ; // если это очередная уникальная строфа, то прибавляем к текущей уникальной

        for (let i = StartStrofy; i < FinalStrofy; i++) {
          let NextStr = stihMas[i] + "\n";

          if (typeof state.GroupStrof[kk] == "undefined") {
            state.GroupStrof[kk] = "";
          }
          state.GroupStrof[kk] = state.GroupStrof[kk] + NextStr;

          ReturnStrofaPositionMas [s] = state.StrofaPatternTypeMas.length - kk + 1; // в обратном порядке запоминаем, в какую группу kk какая строфа s переместилась (+1 для переноса из ленты в первый блок).


        }
      }
    }

  }


}