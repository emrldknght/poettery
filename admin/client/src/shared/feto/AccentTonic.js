/** @param state {FetoState} */
export function AccentTonic(state) {
  DelSpace(state);
  ClearForm2();

  let k = 0;
  let ResText = "";
  let NextZnak = "";
  var NextSlovo = "";
  state.CountSlov = 0;
  state.CountAccentSlov = 0;
  state.CountNoAccentSlov = 0;
  let LowGlasny = "";
  let flagYo = 0;

  let kirill = /[а-яА-ЯёЁ]/;
  stih = state.OriginalTextInput + "\n";
  stih0 = state.OriginalTextInput + "\n";
  stihMas0 = stih0.split("\n");
  let LowStih = stih.toLowerCase();

  console.log("AccentTonic");

  for (let i = 0; i < LowStih.length; i++) {
    let NextZnak = LowStih[i];
    if (NextZnak === "ё") {
      flagYo = 1;
    }
    ;
    let kir = kirill.test(NextZnak);
    if (kir) {
      NextSlovo = NextSlovo + NextZnak;
    } else {
      if (NextSlovo.length > 0) {
        // todo - check ++ expression
        ++state.CountSlov;
        // отображаем прогресс

        // односложные слова делаем ударными, ё делаем ударным, остальные ищем по словарю

        if (flagYo === 1) {
          slovoAccent = NextSlovo.replace(new RegExp("ё", 'g'), "Ё");
          flagYo = 0;
        } else {
          slovoAccent = CapsGlasny(NextSlovo);
        }
        ;
        NextSlovo = "";
      }
    }

    LowStih = LowStih.substr(0, i - slovoAccent.length) + slovoAccent + LowStih.substr(i,);
    slovoAccent = "";
  }

  console.log("цикл AccentTonic завершён");

  state.flagSetAccent = 1;
  state.AccentCountSimvol = CountSimvol(state);

  state.CountNoAccentSlov = state.CountSlov - state.CountAccentSlov;

  state.OriginalTextInput = LowStih;

}