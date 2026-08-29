export function CapsGlasny(NextSlovo)
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
    return slovoAccent.toLowerCase();
  }

  if (LowGlasny.length === 1) {
    for (let s = 0; s < lens; s++) {
      NextZnak = Slovo.substr(s, 1);
      gllow = glasnyLow.includes(NextZnak);
      if (gllow) {
        slovoAccent = Slovo.substr(0, s) + NextZnak.toUpperCase() + Slovo.substr(s + 1,);
      }
    }
  } else {

    slovoAccent = PoiskSlov(NextSlovo)
    //slovoAccent=PoiskSlovClassic(NextSlovo);
    //if (slovoAccent==NextSlovo || slovoAccent=="") {slovoAccent=PoiskSlov(NextSlovo)};
  }


  return slovoAccent;
}