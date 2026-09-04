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
  state.stih = state.OriginalTextInput + "\n";
  state.stih0 = state.OriginalTextInput + "\n";
  state.stihMas0 = state.stih0.split("\n");
  let LowStih = state.stih.toLowerCase();

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
          state.slovoAccent = NextSlovo.replace(new RegExp("ё", 'g'), "Ё");
          flagYo = 0;
        } else {
          state.slovoAccent = CapsGlasny(NextSlovo, state);
        }
        ;
        NextSlovo = "";
      }
    }

    LowStih = LowStih.substr(0, i - state.slovoAccent.length) + state.slovoAccent + LowStih.substr(i,);
    state.slovoAccent = "";
  }

  console.log("цикл AccentTonic завершён");

  state.flagSetAccent = 1;
  state.AccentCountSimvol = CountSimvol(state);

  state.CountNoAccentSlov = state.CountSlov - state.CountAccentSlov;

  state.OriginalTextInput = LowStih;

}