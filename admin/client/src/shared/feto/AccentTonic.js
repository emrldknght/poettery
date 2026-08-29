export function AccentTonic() {
  DelSpace();
  ClearForm2();
  if (slovarMas.length < 1) {
    slovarMas = slovarGlobal.split(",");
  }
  ;
  if (slovarEMas.length < 1) {
    slovarEMas = slovarGlobalE.split(",");
  }
  ;

  slovarMas = slovarGlobal.split(",");
  slovarEMas = slovarGlobalE.split(",");

  let k = 0;
  let ResText = "";
  let NextZnak = "";
  var NextSlovo = "";
  CountSlov = 0;
  CountAccentSlov = 0;
  CountNoAccentSlov = 0;
  let LowGlasny = "";
  let flagYo = 0;

  let kirill = /[а-яА-ЯёЁ]/;
  stih = document.formStih1.TextStih.value + "\n";
  stih0 = document.formStih1.TextStih.value + "\n";
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
        ++CountSlov;
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

  flagSetAccent = 1;
  AccentCountSimvol = CountSimvol();

  CountNoAccentSlov = CountSlov - CountAccentSlov;

  document.formStih1.TextStih.value = LowStih;

}