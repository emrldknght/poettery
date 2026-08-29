function CreateTemplateAccent() {
// Создаём шаблон ударений. Выбираем гласные, заменяем маркерами ударений О:. и записываем шаблон в переменную TemplateAccent.
// Заодно создаём массив номеров гласных в словах - TemplateNumGlas. Каждая гласная помечается числом 1 -  если она первая в слове, числом 2 - если вторая и тд (NumGlas)

  console.log("CreateTemplateAccent()");


  let ResText = "";
  let FlagProbel = "0";
  let NextZnak = "";
  var NextSlovo = "";
  let TemplateStr = "";
  let TemplateZnak = "";
  TemplateNumGlas = "";
  let TemplateNumGlasStr = "";
  let NextBukva = "";
  let Countgl = 0;
  let onlycaps = "";
  let OneGlasny = "";
  flagAccent = "";
  let onlyGlasny = "";

  let glasny = "аоиеёэыуюяАОИЕЁЭЫУЮЯ";
  let glasnyLow = "аоиеёэыуюя";
  let glasnyCaps = "АОИЕЁЭЫУЮЯ";
  let kirill = /[а-яА-ЯёЁ]/;
  let TemplateZnak31 = ".";
  let TemplateZnak32 = "О";
  let TemplateZnak33 = ":";

  let stih = document.formStih1.TextStih.value + "\n";
  for (let i = 0; i < stih.length; i++) {
    let NextZnak = stih[i];

    let gl = glasny.includes(NextZnak);
    let glcaps = glasnyCaps.includes(NextZnak);
    let gllow = glasnyLow.includes(NextZnak);
    let kir = kirill.test(NextZnak);

    // ИЩЕМ кириллицу (отделяем слова от пробелов и знаков препинания)
    if (kir) {
      NextSlovo = NextSlovo + NextZnak;
    } else {
      // анализируем слово (по буквам)
      TemplateStr = "";
      TemplateNumGlasStr = "";
      Countgl = 0;
      // удаляем строчные и согласные
      if (NextSlovo.length > 1) {
        onlycaps = NextSlovo.replace(/[ёйцукенгшщзхъфывапролджэячсмитьбюЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ]/g, '');
        onlyGlasny = NextSlovo.replace(/[йцкнгшщзхъфвпрлджчсмтьбЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ]/g, '');
        // если в слове нет заглавных гласных и слово не односложное, то слово не размечено ударением
        if (onlyGlasny.length > 1) {
          if (onlycaps.length === 0) {
            flagAccent = krest + "Не во всех словах расставлены ударения! ";
            window.flagAccentBall = 0;
          }
        }
      }
      // анализируем гласные в слове (заглавные-строчные) и заменяем на маркеры О:.)
      for (let s = 0; s < NextSlovo.length; s++) {
        NextBukva = NextSlovo[s];

        let gl = glasny.includes(NextBukva);
        let glcaps = glasnyCaps.includes(NextBukva);
        let gllow = glasnyLow.includes(NextBukva);

        if (gl) {
          ++Countgl;
          if (gllow) {
            TemplateZnak = TemplateZnak31
          }
          ;
          if (glcaps) {
            TemplateZnak = TemplateZnak32
          }
          ;
          TemplateStr = TemplateStr + TemplateZnak;
          TemplateNumGlasStr = TemplateNumGlasStr + String(Countgl); // заодно создаём массив номеров гласных

        }
      }
      if (Countgl === 1) {
        TemplateStr = TemplateZnak33
      }
      ;
      NextSlovo = "";
      Countgl = 0;
      ResText = ResText + TemplateStr;
      if (NextZnak === "\n") {
        ResText = ResText + "\n";
      }

      TemplateNumGlas = TemplateNumGlas + TemplateNumGlasStr; // заодно создаём массив номеров гласных
      if (NextZnak === "\n") {
        TemplateNumGlas = TemplateNumGlas + "\n";
      } // заодно создаём массив номеров гласных

    }

  }
  TemplateAccent = ResText;
  console.log("TemplateAnaliz()");
// Анализ шаблона О:О. Подсчёт ударных, слабоударных, безударных. Выявление ритма (ударных и безударных столбцов). Создание массива базового ритмического рисунка и комментариев.
  TemplateAnaliz();
  console.log("TemplateAccent1");
  console.log(TemplateAccent);
  console.log("SecondTemplateAnaliz");
// На основе вычисленного базового ритмического рисунка заменяем в шаблоне слабоударные ударными или безударными. Заодно корректируем TemplateGlasn - двусложные слова в безударных столбцах делаем безударными
  SecondTemplateAnaliz();
  console.log("TemplateAccent2");
  console.log(TemplateAccent);
  console.log("TemplateAnaliz()");
// Анализ шаблона О:О. Подсчёт ударных, слабоударных, безударных. Выявление ритма (ударных и безударных столбцов). Создание массива базового ритмического рисунка и комментариев.
  TemplateAnaliz();
  console.log("SecondTemplateAnaliz()");
// На основе вычисленного базового ритмического рисунка заменяем в шаблоне слабоударные ударными или безударными. Заодно корректируем TemplateGlasn - двусложные слова в безударных столбцах делаем безударными
  SecondTemplateAnaliz();
  console.log("TemplateNumGlas");
  console.log(TemplateNumGlas);
}