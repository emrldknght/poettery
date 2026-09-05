import {DelSpace} from "./DelSpace.js";

/** @param state {FetoState} */
export function StrofRevers(state) { // used in #adminPanel
  DelSpace(state);
  let StrofaFullPattern = state.StrofaPatternMas.join(',');
  console.log("StrofaFullPattern", StrofaFullPattern);
// ---- разбивка на строфы повторно после анализа (подсчёт длины строк и количества строк, ищем кратность - количество делим на 2, 3, 4; поиск повторяющихся паттернов по 2, 3, 4 строки) alex

  let BeginPattern = [];
  let istr = "";
  let kstr = "";
  let CountPattern = 0;

// размер строфы от 4 до 8 строк (по три символа - двузначное число и запятая) ==================================================
  for (let i = 12; i < 24; i += 3) {
// i-длина паттерна
    istr = StrofaFullPattern.substr(1, i);
    console.log("==================================istr=" + istr);
    console.log("StrofaFullPattern.length=" + StrofaFullPattern.length);

// берём начало паттерна
// в цикле сравниваем паттерн ==== если есть аналогичный паттерн - записываем в массив BeginPattern ==============================================
    for (let k = i + 1; k < StrofaFullPattern.length - i; k += 3) {
      // k-начало искомого паттерна
      kstr = StrofaFullPattern.substr(k, i);

      console.log("k=", k);
      console.log("i=", i);
      console.log("istr=" + istr);
      console.log("kstr=" + kstr);
      if (istr === kstr) {
        ++CountPattern;
        BeginPattern[CountPattern] = (k - 1) / 3;
        console.log("------------BeginPattern=", (k - 1) / 3);
      }
    }
  }
  console.log(BeginPattern);

}