/** @param state {FetoState} */
export function ReversAccent(state)
// Находим неразмеченные слова и размечаем по шаблону Ritm[]. Если не помогло, то предлагаем несколько ударений на выбор.
{
  let flagAccentSlovo = 0;
  let NextZnak = "";
  let CountNextZnak = 0;
  let NextSlovo = "";
  let CaseSlovo = "";
  let CountCase = 0;
  let NoAccentSlovo = "";
  let LowGlasny = "";
  let NextStrStihMas = "";
  let newStrStih = "";
  let Countgl = 0;
  let CountglSlovo = 0;
  let glasny = "аоиеёэыуюяАОИЕЁЭЫУЮЯ";
  let glasnyLow = "аоиеёэыуюя";
  let glasnyCaps = "АОИЕЁЭЫУЮЯ";
  let kirill = /[а-яА-ЯёЁ]/;
  let StrStih = state.OriginalTextInput + "\n";
  let StrStihMas = StrStih.split("\n");
  let CaseAccent = [];
  state.CountSlov = 0;
  state.CountAccentSlov = 0;
  state.CountNoAccentSlov = 0;
  const Ritm = state.Ritm;

  let SbornikCountTxt = '';


  let nexttext = state.OriginalTextInput;
  if (nexttext.length === 0) {
    return;
  }
  ;


  // берем строку в стихотворении
  for (let k = 0; k < StrStihMas.length; k++) {
    NextStrStihMas = StrStihMas[k] + "\n";
    NextSlovo = "";
    // ищем слово в строке
    for (let i = 0; i < NextStrStihMas.length; i++) {
      ++CountNextZnak;
      let NextZnak = NextStrStihMas[i];
      // ищем промежуток между словами
      let kir = kirill.test(NextZnak);
      if (kir) {
        NextSlovo = NextSlovo + NextZnak;
      } else {
        // todo - check ++ expression
        ++state.CountSlov; //количество слов
        // размечаем слово по шаблону Ritm[]
        let onlycaps = NextSlovo.replace(/[ёйцукенгшщзхъфывапролджэячсмитьбюЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ]/g, '');
        let onlyGlasny = NextSlovo.replace(/[йцкнгшщзхъфвпрлджчсмтьбЙЦКНГШЩЗХЪФВПРЛДЖЧСМТЬБ]/g, '');

        // если в слове нет заглавных гласных, то слово не размечено ударением
        if (onlycaps.length > 0) {
          flagAccentSlovo = 2;
        } // если слово ранее размечено

        for (let s = 0; s < NextSlovo.length; s++) {

          let NextBukva = NextSlovo[s];
          let gl = glasny.includes(NextBukva);
          let gllow = glasnyLow.includes(NextBukva);
          //если буква гласная gl, слово неразмеченное !glcaps и в шаблоне на соответствующей позиции стоит ударение Ritm[Countgl]===3, то делаем букву ударной
          if (gl) {
            ++Countgl; // счетчик гласных в строке
            ++CountglSlovo;
            CaseAccent[CountglSlovo] = s; // номер безударной в слове;
            // если в слове нет заглавных гласных, то слово не размечено ударением
            if (flagAccentSlovo === 0) {
              if (Ritm[Countgl - 1] === 1 || Ritm[Countgl + 1] === 1) {
                if (Ritm[Countgl] === 2 || Ritm[Countgl] === 3) {
                  if (onlycaps.length === 0) {
                    if (gllow) {
                      NextBukva = NextBukva.toUpperCase();
                      NextSlovo = NextSlovo.substr(0, s) + NextBukva + NextSlovo.substr(s + 1, NextSlovo.length - s);
                      flagAccentSlovo = 1;
                      ++state.CountAccentSlov;
                    }
                  }
                }
              }
            }

            if (onlyGlasny.length === 1)  // односложное слово - надо скорректировать - привести к базовому ритму -----
            {
              if (Ritm[Countgl] === 2 || Ritm[Countgl] === 3) {
                NextBukva = NextBukva.toUpperCase();
                NextSlovo = NextSlovo.substr(0, s) + NextBukva + NextSlovo.substr(s + 1, NextSlovo.length - s);
              }
              if (Ritm[Countgl] === 1) {
                NextBukva = NextBukva.toLowerCase();
                NextSlovo = NextSlovo.substr(0, s) + NextBukva + NextSlovo.substr(s + 1, NextSlovo.length - s);
              }
            }
            // односложное слово - cкорректировали - привели к базовому ритму ------------
          }
          //следующая гласная
        }
        //завершён просмотр (разметка) слова
        //размеченное слово возвращаем в текст, слово обнуляем
        let fr1 = NextStrStihMas.substr(0, CountNextZnak - NextSlovo.length - 1);
        let fr2 = NextStrStihMas.substr(CountNextZnak - 1, NextStrStihMas.length - CountNextZnak + 1);
        NextStrStihMas = fr1 + NextSlovo + fr2;

        //
        if (onlyGlasny.length > 1) {
          if (flagAccentSlovo === 0) //слово ранее не размечено по словарю flagAccentSlovo=2  и теперь не размечено по шаблону flagAccentSlovo=1
          {
            // НЕ размеченное слово возвращаем в текст ЗАГЛАВНЫМИ
            let fr1 = NextStrStihMas.substr(0, CountNextZnak - NextSlovo.length - 1);
            let fr2 = NextStrStihMas.substr(CountNextZnak - 1, NextStrStihMas.length - CountNextZnak + 1);
            NextStrStihMas = fr1 + NextSlovo.toUpperCase() + fr2;
            // НЕ размеченное слово возвращаем в текст НЕ ЗАГЛАВНЫМИ
            NextStrStihMas = fr1 + NextSlovo + fr2;

            // ==============

            if (!state) {
              console.error('[ERROR] No state in ctx')
            }
            const HandAccent = state.HandAccent;

            // или предлагаем несколько ударений на выбор CaseAccent[] - номер безударной в слове;
            // если ручной режим расстановки ударений отключен то HandAccent=0;
            if (state.UnicStrof < 2 && HandAccent > 0 && state.inWindow.project !== 'epigramma') // если уникальных строф не много, то это не вольный стих (будет слишком много иправлений)
            {
              ++CountCase;
              for (let b = 1; b < CaseAccent.length; b++) {
                let PosGlasCase = CaseAccent[b];
                let GlasCase = NextSlovo.substr(PosGlasCase, 1);
                // делаем одну гласную в слове заглавной (и вставляем слово в строку)
                CaseSlovo = NextSlovo.substr(0, PosGlasCase) + GlasCase.toUpperCase() + NextSlovo.substr(PosGlasCase + 1, NextSlovo.length - PosGlasCase);
                let StrCase = fr1 + CaseSlovo + fr2;
                let StrCasePromt = fr1 + "[" + CaseSlovo + "]" + fr2;
                console.log(StrCase);

                let СonfirmStrCase = confirm("№ " + SbornikCountTxt + " Ударение верно: " + StrCasePromt);
                if (СonfirmStrCase) {
                  NextStrStihMas = StrCase;
                  break;
                } // если пользователь согласен - вставляем вариант в текст
              }
            }
          }
        }


        // НОВЫЙ ==============
        NextSlovo = "";
        CaseAccent = [];
        CountCase = 0;

      }


      flagAccentSlovo = 0;
      CountglSlovo = 0;
      // конец слова

    }
    // следующая строка
    Countgl = 0;
    CountNextZnak = 0;
    newStrStih = newStrStih + NextStrStihMas;
    NextSlovo = "";
  }
  //закончились строки в стихотворении
  state.OriginalTextInput = newStrStih;
  StrStih = newStrStih;

  state.CountNoAccentSlov = state.CountSlov - state.CountAccentSlov;

}