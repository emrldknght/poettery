/** @param state {FetoState} */
export function TemplateAnaliz(state) {
  // todo - check if passed correctly
  const Ritm = state.Ritm;

// Анализ шаблона О:О. Подсчёт ударных, слабоударных, безударных. Выявление ритма (ударных и безударных столбцов). Создание массива базового ритмического рисунка и комментариев.
  state.TemplateMas = state.TemplateAccent.split("\n");
  state.flagRitmBall = 0;
  Ritm.length = 0;
  state.RitmErr.length = 0;
// обнуляем массив базового ритмического рисунка
  // let k = 0;
  let max = 0;

  // Accent3 - подсчёт ударений, обозначенных О
  // let Accent3 = 0;
  // let Accent2 = 0;
  // let Accent1 = 0;
  let Accent12 = 0;
  let Accent23 = 0;
  let KolSpace = 0;
  let CommentText = "";
  let CommentTextMin = "";
  let CommentNext = "";
  let KolStrok = state.TemplateMas.length;
  let RealKolStrok = "";
  let proc = 0;
// типы ударных (безударных) столбцов
  let TypeSlogU = 0;
  let TypeSlogUU = 0;
  let TypeSlogB = 0;
  let TypeSlogBB = 0;
  let TypeSlogUB = 0;
  let TypeSlogErr = 0;
// перебираем столбцы слева направо (количество столбцов уточняется в процессе методом замены max)
  for (let k = 0; k < 1000; k++) {
    let Accent3 = 0;
    let Accent2 = 0;
    let Accent1 = 0;
// перебираем столбец шаблона
    for (let s = 0; s < KolStrok; s++) {
      let nextStr = state.TemplateMas[s];
//количество столбцов уточняется в цикле методом замены max
      if (max < nextStr.length) {
        max = nextStr.length
      }

// уточняем количество пробелов (строф)
      let nextB = nextStr[k];
      if (nextStr === "" || nextB === undefined) {
        ++KolSpace;
      }

//if (nextB=== undefined) {++KolSpace;}; // если буквы нет (строка короткая) то подсчёт как пустой сторки

      if (nextB === "О") {
        ++Accent3;
      }
      // подсчёт ударных
      if (nextB === ":") {
        ++Accent2;
      }
      // подсчёт слабоударных
      if (nextB === ".") {
        ++Accent1;
      }
      // подсчёт безударных
    }
    if (k === max) {
      // let k = 1000;
      break
    }


    RealKolStrok = KolStrok - KolSpace;

    Accent12 = Accent1 + Accent2; // количество безударных и слабоударных
    Accent23 = Accent2 + Accent3; // количество ударных и слабоударных
    proc = RealKolStrok * 0.8;

// статистика ударных-слабоударных и типизация столбцов (создаем массив базового ритмического рисунка и комментарии к столбцам)
    if (Accent3 > (RealKolStrok * 0.8) && (Accent23 !== RealKolStrok)) {
      CommentNext = (k + 1) + " слог - ударный";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogU;
      Ritm[k + 1] = 3;
    } else if ((Accent1 > (RealKolStrok * 0.8)) && (Accent3 > 0)) {
      CommentNext = (k + 1) + " слог - сбой ритма";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogErr;
      Ritm[k + 1] = 1;
      state.RitmErr[k + 1] = 9;
    } else if (Accent3 === 0) {
      CommentNext = (k + 1) + " слог - ПОЛНОСТЬЮ БЕЗУДАРНЫЙ";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogBB;
      Ritm[k + 1] = 1;
    } else if (Accent23 === RealKolStrok) {
      CommentNext = (k + 1) + " слог - УДАРНЫЙ";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogUU;
      Ritm[k + 1] = 3;
    } else if (Accent12 === RealKolStrok) {
      CommentNext = (k + 1) + " слог - безударный";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogB;
      Ritm[k + 1] = 1;
    } else if (Accent3 > (RealKolStrok * 0.3) && Accent23 > (RealKolStrok * 0.4)) {
      CommentNext = (k + 1) + " слог - частично ударный";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogU;
      Ritm[k + 1] = 2;
    } else {
      CommentNext = (k + 1) + " слог - смешанный";
      CommentText = CommentText + CommentNext + "\n";
      ++TypeSlogUB;
      Ritm[k + 1] = 2;
    }
    KolSpace = 0;
  }

  state.RitmCommentMin = CommentTextMin;

}