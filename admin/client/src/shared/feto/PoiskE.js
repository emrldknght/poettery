export function PoiskE(NextSlovo) {

  let slovoAccent = "";
  for (let j = 0; j < slovar_noaccent_E_Mas.length; j++) {

    if (NextSlovo == slovar_noaccent_E_Mas[j]) {
      slovoAccent = slovar_E_Mas[j];
      slovoAccent = slovoAccent.replace(/[Е]/g, 'Ё');
      j = slovar_E_Mas.length;
      return slovoAccent;
      break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}