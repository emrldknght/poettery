export function PoiskSlovClassic(NextSlovo) {

  let slovoAccent = "";
  if (NextSlovo.length < 3 || NextSlovo === undefined) {
    slovoAccent = "";
    return slovoAccent;
  }

  for (let j = 0; j < slovar_noaccent_classic_Mas.length; j++) {

    if (NextSlovo == slovar_noaccent_classic_Mas[j]) {
      slovoAccent = slovar_classic_Mas[j];
      j = slovar_noaccent_classic_Mas.length;
      return slovoAccent;
      break;
    }
  }
  slovoAccent = NextSlovo;
  return slovoAccent;
}