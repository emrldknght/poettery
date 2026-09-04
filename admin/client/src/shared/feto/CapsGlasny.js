/** @param NextSlovo
 @param state {FetoState} */
export function CapsGlasny(NextSlovo, state)
// односложные слова делаем ударными, остальные ищем по словарю
{
  let OneAccent = "";
  let gllow = "";
  let NextZnak = "";
  let Slovo = NextSlovo;
  let glasnyLow = "аоиеёэыуюя";
  let LowGlasny = Slovo.replace(/[йцкнгшщзхъфвпрлджчсмтьбЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ]/g, '');
  let lens = Slovo.length;
  let flagtonic = document.getElementById('level-tonic').checked;

  if (flagtonic && LowGlasny.length === 1) {
    return state.slovoAccent.toLowerCase();
  }

  if (LowGlasny.length === 1) {
    for (let s = 0; s < lens; s++) {
      NextZnak = Slovo.substr(s, 1);
      gllow = glasnyLow.includes(NextZnak);
      if (gllow) {
        state.slovoAccent = Slovo.substr(0, s) + NextZnak.toUpperCase() + Slovo.substr(s + 1,);
      }
    }
  } else {

    state.slovoAccent = PoiskSlov(NextSlovo, state)
    //slovoAccent=PoiskSlovClassic(NextSlovo);
    //if (slovoAccent==NextSlovo || slovoAccent=="") {slovoAccent=PoiskSlov(NextSlovo)};
  }


  return state.slovoAccent;
}