/** @param NextSlovo
 @param state {FetoState} */
export function PoiskE(NextSlovo, state) {

  let slovoAccent = "";
  for (let j = 0; j < state.slovar_noaccent_E_Mas.length; j++) {

    if (NextSlovo === state.slovar_noaccent_E_Mas[j]) {
      slovoAccent = state.slovar_E_Mas[j];
      slovoAccent = slovoAccent.replace(/[Е]/g, 'Ё');
      j = state.slovar_E_Mas.length;
      return slovoAccent;
      break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}