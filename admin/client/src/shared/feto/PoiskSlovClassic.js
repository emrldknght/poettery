/** @param NextSlovo {string|undefined}
 @param state {FetoState} */
export function PoiskSlovClassic(NextSlovo, state) {

  let slovoAccent = "";
  if (NextSlovo.length < 3 || NextSlovo === undefined) {
    slovoAccent = "";
    return slovoAccent;
  }

  for (let j = 0; j < state.slovar_noaccent_classic_Mas.length; j++) {

    if (NextSlovo === state.slovar_noaccent_classic_Mas[j]) {
      slovoAccent = state.slovar_classic_Mas[j];
      j = state.slovar_noaccent_classic_Mas.length;
      return slovoAccent;
      break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}