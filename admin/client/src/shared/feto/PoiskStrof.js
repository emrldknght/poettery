import {DelSpace} from "./DelSpace.js";

/** @param state {FetoState} */
export function PoiskStrof(state) {
  DelSpace(state);
//
  let StihText3 = state.OriginalTextInput + "\n";
  let stihMas3 = StihText3.split("\n");
  let stihMas4 = "";
  let CountStrok = 0;
  let CountStrof = 0;
// считаем количество строф
  for (let i = 0; i < stihMas3.length - 1; i++) {
    let str = stihMas3[i];
    console.log(str);
    //конец строки
    if (str === "") {
      ++CountStrof
    } else {
      ++CountStrok;
    }
  }
// если количество строф=1 , то делим текст на строфы
  if (CountStrof < 2) {
// можно разделить на четверостишия

    CountStrok = 0;

    for (let i = 0; i < stihMas3.length; i++) {
      let str = stihMas3[i];
      ++CountStrok;

      // после 4 строки прибавить пустую строку
      if (CountStrok === 4) {
        stihMas4 = stihMas4 + str + "\n\n";
        CountStrok = 0;
      } else {
        stihMas4 = stihMas4 + str + "\n";
      }
    }

    state.OriginalTextInput = stihMas4;
  }

}