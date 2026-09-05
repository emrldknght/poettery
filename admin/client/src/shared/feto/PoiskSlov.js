/** @param NextSlovo
 @param state {FetoState} */
export function PoiskSlov(NextSlovo, state) {

  let slovoAccent = "";
  if (NextSlovo.length < 3) {
    slovoAccent = "";
    return slovoAccent;
  }

  for (let j = 0; j < state.slovar_noaccent_Mas.length; j++) {

    if (NextSlovo === state.slovar_noaccent_Mas[j]) {
      slovoAccent = state.slovar_accent_Mas[j];
      j = state.slovar_noaccent_Mas.length;
      return slovoAccent;
      // break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}