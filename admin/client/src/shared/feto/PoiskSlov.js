export function PoiskSlov(NextSlovo) {

  let slovoAccent = "";
  if (NextSlovo.length < 3 || NextSlovo === undefined) {
    slovoAccent = "";
    return slovoAccent;
  }

  for (let j = 0; j < slovar_noaccent_Mas.length; j++) {

    if (NextSlovo == slovar_noaccent_Mas[j]) {
      slovoAccent = slovar_accent_Mas[j];
      j = slovar_noaccent_Mas.length;
      return slovoAccent;
      break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}