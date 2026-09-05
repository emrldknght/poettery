import {PoiskE} from "./PoiskE.js";

/**
 @param tryRifma {number}
 @param state {FetoState}
 */
export function AnalizRifm(tryRifma, state)
// Ищем рифмы - последние ударные гласные. Заменяем на фонетические аналоги. Заодно записываем рифмующиеся слова в массив. Ёфицируем рифмующееся слово. Если ёфикация была лишней, то не учитываем ёфикацию.

{
  let AccentRifmPos = 0;
  let AccentRifm = "";
  let Strofa = 0;
  let strok = 0;
  let RifmTypeMas = [];
  let CountRifmType = 0;
  let CountGlasnZ = 0;
  let UnicRifmMas = [];
  let UnicRifm = 0;
  let RealRifmMas = [];
  state.SlovaRifmMas = [];
  let RealRifm = 0;
  let PosNoUnicRifm = 0;
  let FullRifmMas = []; // рифмы c фонетической заменой

  let FullRifmMasLatin = []; // рифмы c заменой на ABCDE
  let Foneticrifmrus = "АИУОЭ";
  let Foneticrifmlatin = "ABCDE";
  let Firstrifm = "";

  let NumStrofaRifm = 0;
  let NumStrokaRifm = 0;
  let Rifmovkaflag = 0;

  let StrokaFullRifm = "";
  let Findrifm = "";
  let Numberrifm = 0;
  let RifmGlasn = "ОАЭИУ";
  let cntrifm = 0;

  state.rifmovkatext = "";
  state.rifmovkalong = "";
  state.rifmovkatype = "";

  const SlovaRifmBegin = []; // позиция начала рифмующегося слова
  const SlovaRifmDlina = []; // длина рифмующегося слова


  let NaturalFullRifmMas = []; // натуральные рифмы без фонетической замены
  let NextRifm = "";
  let NaturalNextRifm = "";
  let NextStr = "";
  let NextStrStih = "";
  let nextStrNumGlas = "";
  let NextZnak = "";
  let glasnyCaps = "АОИЕЁЭЫУЮЯ";
  state.FlagRifm = "";
  state.flagErrorRifma = "";
  let FlagRifmaYo = 0;
  state.flagCountErrorRifma = 0;
  state.RifmComment = "";

  state.flagRifmBall = 0;

  let startRifm = 0;
  let EndRifm = 0;
  let SlovoRifm = "";
  let SlovoRifmBegin = 0;
  let SlovoRifmEnd = 0;
  let SlovoRifmEnd1 = 0;
  let Eslovo = "";

  let nexttext = state.OriginalTextInput;
  if (nexttext.length === 0) {
    return;
  }


  state.stih = state.OriginalTextInput + "\n";
  state.stihMas = state.stih.split("\n");


// сканируем все строки - берем последний ударный столбец AccentRifmPos
  state.BlockRitmTemplateMas = state.BlockRitmTemplate.split("\n");

  let KolStrok = state.BlockRitmTemplateMas.length;
// строки стихотворения (цветной шаблон) перебираем в цикле
  for (let s = 0; s < KolStrok; s++) {
    NextStr = state.BlockRitmTemplateMas[s];
    NextStrStih = state.stihMas[s];
    nextStrNumGlas = state.TemplateNumGlasMas[s];

    let dlina = NextStr.length;

    // базовый ритм смотрим с последней буквы - ищем ударный
    for (let k = dlina; k > 0; k--) {
      NextZnak = NextStr.substr(k - 1, 1);
      let glcaps = glasnyCaps.includes(NextZnak);
      if (glcaps && state.Ritm[k] === 3) {
        // заодно делаем массив рифмующихся слов, используем ProbelPositionMas =[] это позиции пробелов по отношению к позиции конкретной гласной

        SlovoRifmBegin = state.ProbelPositionMas[s][k];
        SlovoRifmEnd1 = state.ProbelPositionMas[s][k]; // это для начала, потом будем искать ближайшее большее в цикле
        for (let z = k; z < state.ProbelPositionMas[s].length; z++) {
          SlovoRifmEnd = state.ProbelPositionMas[s][z];
          if (SlovoRifmEnd > SlovoRifmEnd1) {
            break
          }
          // нашли позицию ближайшего справа пробела
        }

        SlovoRifm = NextStrStih.substring(SlovoRifmBegin, SlovoRifmEnd - 1); // вырезали слово по пробелам
        state.SlovaRifmMas[s] = SlovoRifm.replace(/[.,;:!?()«»"…]/g, ''); // очищаем от знаков препинания

        SlovaRifmBegin[s] = SlovoRifmBegin; // заодно записываем позицию начала рифмующегося слова в массив
        SlovaRifmDlina[s] = state.SlovaRifmMas[s].length; // заодно записываем длину рифмующегося слова в массив

        // есть массив рифмующихся слов SlovaRifmMas   -------------------alex
        break
      }

    }


    // выделяем концевые ударные гласные (рифмы) в переменную AccentRifm

    AccentRifm = NextZnak;

    NaturalFullRifmMas[s] = AccentRifm; // натуральные рифмы без фонетической замены и ёфикации

// попробуем ёфицировать текущее слово в строке s -------------------
    if (AccentRifm === "Е" && tryRifma === 2) {
      console.log("SlovaRifmMas[s]:", s, state.SlovaRifmMas[s]);
      Eslovo = PoiskE(state.SlovaRifmMas[s], state);
      if (Eslovo !== "") {
        AccentRifm = "Ё";
        FlagRifmaYo = 1
      }

      console.log("Eslovo", Eslovo);
    }



// ёфицировали текущее слово в строке s -------------------

    // заменяем на фонетические аналоги
    if (AccentRifm === "Я") {
      AccentRifm = "А";
    }

    if (AccentRifm === "Ю") {
      AccentRifm = "У";
    }

    if (AccentRifm === "Ё") {
      AccentRifm = "О";
    }

    if (AccentRifm === "Е") {
      AccentRifm = "Э";
    }

    if (AccentRifm === "Ы") {
      AccentRifm = "И";
    }



    FullRifmMas[s] = AccentRifm;
    AccentRifm = "#";
    NextZnak = "#";
  }
//создали массив концевых ударных гласных (рифм). Строфы разделены знаком #
  console.log("FullRifmMas");
  console.log(FullRifmMas);

  for (let s = 0; s < KolStrok; s++) {
    // если конец строфы
    AccentRifm = FullRifmMas[s];
    if (AccentRifm === "#") {

      EndRifm = s - 1;

      ++Strofa;
      CountRifmType = RifmTypeMas.length;

      // когда строфа закончилась - ищем уникальные рифмы (без пары) - заново перебираем  массив рифм FullRifmMas и ищем соответствующие строки стихотворения stihMas
      for (let n = startRifm; n < EndRifm; n++) {
        NextRifm = FullRifmMas[n];
        NaturalNextRifm = NaturalFullRifmMas[n]; // натуральные рифмы без фонетической замены
        RealRifm = RealRifmMas.includes(NextRifm);

        // здесь добавляем проверку рифмующегося слова на Ёфикацию (если рифма на О-Ё). Если ёфикация сработала, но ё оказалость нерифмующимся (то есть ёфикация была лишней), то не учитываем ёфикацию

        if (!RealRifm && NaturalNextRifm !== "Е" && NextRifm !== "О") {
          state.RifmComment = state.RifmComment + 'Для строки "' + state.stihMas[n] + '" отсутствует рифма. ';
          state.flagErrorRifma = state.krest + 'Есть сбои рифмы! ';
          state.flagCountErrorRifma = state.flagCountErrorRifma + 1;
        }


      }

// обнуляем массивы FullRifmMas RifmTypeMas RealRifmMas перед новой строфой
      startRifm = EndRifm + 2;
      strok = 0;
      RifmTypeMas = [];
      RealRifmMas = [];
      CountRifmType = 0;
    } else {
      ++strok;

      PosNoUnicRifm = RifmTypeMas.indexOf(AccentRifm);  //найдена позиция следующей рифмы в массиве уникальных типов рифм

      if (PosNoUnicRifm >= 0) {
        RealRifmMas.push(AccentRifm);
      } else {
        RifmTypeMas.push(AccentRifm);
      }//если такая рифма была, то запишем эту гласную в массив реальных рифм RealRifmMas, а если не было, то запишем гласную в массив уникальных типов рифм RifmTypeMas (RifmTypeMas нужен только на этапе сортировки)
    }
  }

  if (KolStrok < 3) {
    state.flagErrorRifma = state.krest + 'Есть сбои рифмы.';
  }


  if (state.flagErrorRifma === "") {
    state.RifmComment = state.RifmComment + "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
  }

  if (state.flagErrorRifma !== "") {
    state.FlagRifm = state.krest + "Есть сбои рифмы. "
  }


  console.log("SlovaRifmMas");
  console.log(state.SlovaRifmMas);
  console.log("SlovaRifmBegin");
  console.log(SlovaRifmBegin);
  console.log("SlovaRifmDlina");
  console.log(SlovaRifmDlina);

// вычислим тип рифмовки отдельной строфы AABB ABAB ABAB 03.06.2023
  console.log("FullRifmMas-02");
  console.log(FullRifmMas);
  // === ВРЕМЕННЫЙ КОСТЫЛЬ ДЛЯ АДАПТЕРА (TODO: refactor) ===
  state._TempFullRifmMas = FullRifmMas.slice();

  NumStrofaRifm = 0;
  NumStrokaRifm = 0;
  for (let s = 0; s < FullRifmMas.length; s++) {
    Rifmovkaflag = 0;
    NumStrokaRifm = NumStrokaRifm + 1;
    NextRifm = FullRifmMas[s];
    if (NextRifm === "#") {
      NumStrofaRifm = NumStrofaRifm + 1;
      if (NumStrokaRifm === 5) {
        //четверостишие
        if (FullRifmMas[s - 4] == FullRifmMas[s - 3] && FullRifmMas[s - 4] == FullRifmMas[s - 2] && FullRifmMas[s - 4] == FullRifmMas[s - 1]) {
          console.log("полная");
          state.rifmovkatext = "полная";
          state.rifmovkatype = state.rifmovkatype + "1";
          Rifmovkaflag = 1;
        }
        if (FullRifmMas[s - 4] == FullRifmMas[s - 3] && FullRifmMas[s - 2] == FullRifmMas[s - 1] && Rifmovkaflag != 1) {
          console.log("смежная");
          state.rifmovkatext = "смежная";
          state.rifmovkatype = state.rifmovkatype + "2";
        }
        if (FullRifmMas[s - 4] == FullRifmMas[s - 2] && FullRifmMas[s - 3] == FullRifmMas[s - 1] && Rifmovkaflag != 1) {
          console.log("перекрёстная");
          state.rifmovkatext = "перекрёстная";
          state.rifmovkatype = state.rifmovkatype + "3";
        }

        if (FullRifmMas[s - 4] != FullRifmMas[s - 2] && FullRifmMas[s - 3] == FullRifmMas[s - 1] && Rifmovkaflag != 1) {
          console.log("полуперекрёстная");
          state.rifmovkatext = "полуперекрёстная";
          state.rifmovkatype = state.rifmovkatype + "6";
        }

        if (FullRifmMas[s - 4] == FullRifmMas[s - 1] && FullRifmMas[s - 3] == FullRifmMas[s - 2] && Rifmovkaflag != 1) {
          console.log("кольцевая");
          state.rifmovkatext = "кольцевая";
          state.rifmovkatype = state.rifmovkatype + "4";
        }


        NumStrokaRifm = 0;
      }
    }

    //следующая строфа
  }

  console.log("rifmovkatype 1-полная, 2-смежная, 3-перекрестная, 4-кольцевая (первая рифмуется с четвёртой), 6-полуперекрёстная.");
  console.log(state.rifmovkatype);

// закончили вычислять тип рифмовки ==================================




// строку рифм FullRifmMas переводим в формат 123456
  Numberrifm = 0;
  RifmGlasn = "ОАЭИУ";
  cntrifm = 0;
  for (let i = 0; i < FullRifmMas.length; i++) {
    Findrifm = FullRifmMas[i];
    if (RifmGlasn.includes(Findrifm)) {
      cntrifm = cntrifm + 1;

      for (let s = 0; s < FullRifmMas.length; s++) {
        NextRifm = FullRifmMas[s];
        if (NextRifm == Findrifm && RifmGlasn.includes(NextRifm)) {
          FullRifmMas[s] = cntrifm;
        }

      }
    }
  }

  console.log(FullRifmMas);
// строку рифм переводим в формат 123456
  state.rifmovkalong = FullRifmMas.join('');
  console.log("rifmovkalong");
  console.log(state.rifmovkalong);


// 02.06.2023 эпиграммы -----------------------------


  if (state.epigramma === 1 && state.epigrammatype === "Крендель"
    && state.inWindow.project === "epigramma"
    && (state.rifmovkatext === "полуперекрёстная" || state.rifmovkatext === "перекрёстная" || state.rifmovkatext === "полная")
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }

  if (state.epigramma === 1 && state.epigrammatype === "Калач"
    && state.inWindow.project === "epigramma"
    && (state.rifmovkatext === "полуперекрёстная" || state.rifmovkatext === "перекрёстная" || state.rifmovkatext === "полная")
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }

  if (state.epigramma === 1 && state.epigrammatype === "Бублик"
    && state.inWindow.project === "epigramma"
    && (state.rifmovkatext === "полуперекрёстная" || state.rifmovkatext === "перекрёстная" || state.rifmovkatext === "полная")
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }

  if (state.epigramma === 1 && state.epigrammatype === "Ватрушка"
    && state.inWindow.project === "epigramma"
    && (state.rifmovkatext === "полная" || state.rifmovkatext === "смежная")
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }

  if (state.epigramma === 1 && state.epigrammatype === "Пампушка"
    && state.inWindow.project === "epigramma"
    && (state.rifmovkatext === "полуперекрёстная" || state.rifmovkatext === "перекрёстная")
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "Рифмы в строфах достаточно точные, в рифмующихся словах ударные гласные совпадают. ";
    state.FlagRifm = state.galka + "Рифма точная!";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }

  if (state.epigramma === 1 && state.epigrammatype === "Пирожок"
    && state.inWindow.project === "epigramma"
  ) {
    state.flagErrorRifma = "";
    state.RifmComment = "";
    state.FlagRifm = state.galka + "Рифма не требуется.";
    state.flagRifmBall = 1;
    // GlobalflagCountErrorRifmaMas = 0;
    state.GlobalClassicBall = 3;
    state.ClassicBall = 3;
    state.UnicStrof = 0;
    state.GlobalflagStrofaRazbitaMas = 1;
    state.GlobalflagCountStrofaPatternTypeMas = 0;
  }


}