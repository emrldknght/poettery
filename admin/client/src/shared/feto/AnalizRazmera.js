export function AnalyzeEpigram(epigramma, StrofaPatternReport) {
  let ResumeStrofaPatternType = ''
  let epigrammatype = ''

  // 31.05.2023
  if (epigramma === 1 && StrofaPatternReport === " 9, 8, 9, 2") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого хитрого размера можно условно назвать «Крендель». ";
    epigrammatype = "Крендель";
  }

  if (epigramma === 1 && StrofaPatternReport === "11, 9,11, 2") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого запоминающегося размера можно условно назвать «Калач». Последее слово в нём твёрдое, как ручка у калача. ";
    epigrammatype = "Калач";
  }

  if (epigramma === 1 && StrofaPatternReport === " 6, 5, 6, 5") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого нехитрого размера можно условно назвать «Бублик», потому что он ровный со всех сторон. ";
    epigrammatype = "Бублик";
  }

  if (epigramma === 1 && StrofaPatternReport === " 8, 8, 7, 7") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого знакомого размера можно условно назвать «Ватрушка». Такой стих можно спеть как частушку. ";
    epigrammatype = "Ватрушка";
  }

  if (epigramma === 1 && StrofaPatternReport === " 8, 7, 8, 7") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого знакомого размера можно условно назвать «Пампушка». Такой стих можно спеть как частушку. ";
    epigrammatype = "Пампушка";
  }

  if (epigramma === 1 && StrofaPatternReport === " 9, 8, 9, 8") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А самый простой «пирожок» – это четверостишие с рифмованным или вообще нерифмованным ямбом. ";
    epigrammatype = "Пирожок";
  }

  if (epigramma === 1 && StrofaPatternReport === " 8, 9, 8, 9") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А самый простой «пирожок» – это четверостишие с рифмованным или вообще нерифмованным ямбом. ";
    epigrammatype = "Пирожок";
  }

  return {
    ResumeStrofaPatternType,
    epigrammatype,
  }
}

/** @param state {FetoState} */
export function AnalizRazmera(state)
//==================================================================================
// Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
{
  console.log('[DEBUG] AnalizRazmera');
  epigramma = 0;
  let k = 0;
  let CountStrok = 0;
  let CountBukv = 0;
  let ProbelPos = 0; // позиция пробела, чтобы соотносить гласную с конкретным словом.
  let CountSlog = 0;
  let CountZnak = 0;
  let CountProbel = 0;
  ProbelPositionMas = []; // позиция пробела, чтобы соотносить гласную с конкретным словом.
  ProbelPositionMas[0] = []; // массив массивов

  let CountStrofa = 0;
  let ResText = "";
  let NextZnak = "";
  var NextSlovo = "";
  let StrofaPattern = "";

  let ResumeStrofaCount = "";
  let ResumeStrofa = "";


  let TextCountSlog = "";
  let StrofaRepeat = 0;
  CountStrofaPatternType = 1;
  ResumeStrofaPatternType = "";
  state.StrofaPositionMas = [];

  state.StrofaPatternMas = [];
  state.StrofaPatternTypeMas = [];
  state.TemplateGlasn = "";
  state.flagCountStrofaPatternType = 0;
  state.StrofaRepeatTypeMas = [];
  Strof = 0;

  state.StrofaPositionMas[1] = 0;
  let glasny = "аоиеёэыуюяАОИЕЁЭЫУЮЯ";
  stih = state.OriginalTextInput + "\n";
  CountBukv = stih.length;

  for (let i = 0; i < stih.length; i++) {
    let NextZnak = stih[i];
    ++CountZnak;
    // ИЩЕМ ГЛАСНУЮ
    let gl = glasny.includes(NextZnak);
    if (NextZnak == " ") {
      ProbelPos = CountZnak;
    } // запоминаем позицию пробела

    if (gl) {
      ++k;
      ++CountSlog;
      ResText = ResText + NextZnak;
      state.TemplateGlasn = state.TemplateGlasn + NextZnak;
      ProbelPositionMas[CountStrok][CountSlog] = ProbelPos; 	// добавляем поиск позиция пробела, чтобы соотносить гласную с конкретным словом
    }
    //конец строки
    else if (NextZnak === "\n") {
      // *количество строк в строфе (позиция строфы) CountStrok
      ProbelPositionMas[CountStrok][CountSlog + 1] = CountZnak; // добавляем позицию конца строки в массив пробелов
      ++CountStrok;
      if (CountSlog > 0) {
        ResText = ResText + " - " + String(CountSlog) + "\n";
        state.TemplateGlasn = state.TemplateGlasn + "\n";
        if (CountSlog < 10) {
          TextCountSlog = " " + String(CountSlog) + ",";
        } else {
          TextCountSlog = String(CountSlog) + ",";
        }

        StrofaPattern = StrofaPattern + TextCountSlog;
        CountSlog = 0;
        CountZnak = 0;
        ProbelPos = 0;
        ProbelPositionMas[CountStrok] = [];
      }



      //конец строфы
      else {
        ++CountStrofa;
        ResText = ResText + "\n";
        state.TemplateGlasn = state.TemplateGlasn + "\n";
        state.StrofaPatternMas[CountStrofa] = StrofaPattern.substr(0, StrofaPattern.length - 1);
        ResumeStrofa = ResumeStrofa + StrofaPattern + "\n";
        StrofaPattern = "";
        CountSlog = 0;
        CountZnak = 0;
        ProbelPos = 0;
        ProbelPositionMas[CountStrok] = [];
        // запоминаем позицию (конец) строфы
        state.StrofaPositionMas[CountStrofa + 1] = CountStrok;
      }
    }
  }


  console.log("TemplateGlasn");
  console.log(state.TemplateGlasn);
  console.log("StrofaPatternMas");
  console.log(state.StrofaPatternMas);
  console.log("ProbelPositionMas");
  console.log(ProbelPositionMas);

// анализ типов строф (паттернов) по массиву StrofaPatternMas[] ---------------------------------------------------
// выявление уникальных и повторяющихся типов строф ---------------------------------------------------------------

  let StrofaPatternTypeText = "";

  for (let s = 1; s < state.StrofaPatternMas.length; s++) {
    if (state.StrofaPatternMas[s].length === 0) {
      break;
    }
    ++Strof;
    if (!state.StrofaPatternTypeMas.includes(state.StrofaPatternMas[s])) {
      state.StrofaPatternTypeMas.push(state.StrofaPatternMas[s]);
      StrofaPatternTypeText = StrofaPatternTypeText + state.StrofaPatternMas[s] + ";<br>";
    }
  }
  CountStrofaPatternType = state.StrofaPatternTypeMas.length;

  if (CountStrofaPatternType > 1) {
    FlagStrofaMultiPatternType = 1
  }

  if (LentaMode.checked) {
    FlagStrofaMultiPatternType = 0
  }


// Создание комментариев по типам строф ---------------------------------------------------------------------------------------------

  console.log('AnalizRazmera -> Strof', Strof);
  console.log('AnalizRazmera -> LentaMode', LentaMode.checked);


  if (Strof < 2 && !LentaMode.checked) {
    ResumeStrofaCount = "Стихотворение не разбито на строфы. " + "<br>" + "Нужно добавить пустую строку между строфами. ";
    flagStrofa = krest + "Разбейте на строфы. ";
    state.flagStrofaRazbita = 0;
    document.getElementById('level-full').checked = true;
  } else {
    state.flagStrofaRazbita = 1;
  }

  if (Strof < 2) {
    epigramma = 1;
  }

// режим эпиграмм
  if (window.project == "epigramma" && epigramma == 1) {
    ResumeStrofaCount = "";
    flagStrofa = galka + "Однострофное произведение. "
    // убираем знаки препинания
    stih = state.OriginalTextInput + "\n";
    stih = stih.replace(/[.,:!?()-;—…']/gm, ' ');    // удалить знаки препинания
    state.OriginalTextInput = stih + "\n\n";
    TextStihResize();
  }

  if (window.project == "epigramma") {
    ResumeStrofaCount = "";
    flagStrofa = galka + "Однострофное произведение. "
  }


  if (Strof > 1) {

    if (Strof === 2) {
      ResumeStrofaCount = "В стихотворении всего 2 строфы. ";
    }
    if (Strof === 3) {
      ResumeStrofaCount = "В стихотворении всего 3 строфы. ";
    }
    if (Strof === 4) {
      ResumeStrofaCount = "В стихотворении всего 4 строфы. ";
    }
    if (Strof > 4) {
      ResumeStrofaCount = "В стихотворении всего " + Strof + " строф. ";
    }


    if (CountStrofaPatternType === 1) {
      ResumeStrofaPatternType = "Все строфы имеют регулярный размер: " + state.StrofaPatternTypeMas[0] + ". Согласованный размер строф характерен именно для классических стихотворений. ";
      flagStrofa = galka + "Размер регулярный!  ";
      state.flagCountStrofaPatternType = 1;
    }

    if (CountStrofaPatternType === 2) {
      ResumeStrofaPatternType = "Первый тип строф имеет размер " + state.StrofaPatternTypeMas[0] + ". " + "Второй тип строф имеет размер " + state.StrofaPatternTypeMas[1] + ". Такое строение иногда используется в классических стихотворениях, но чаще всего в песнях с куплетами и припевами. ";
      flagStrofa = krest + "Два разных типа строфы.  ";
      state.flagCountStrofaPatternType = 2;
    }

    if (CountStrofaPatternType === 3) {
      ResumeStrofaPatternType = "Обнаружено 3 разных типа строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такое строение редко используется в классических стихотворениях. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      state.flagCountStrofaPatternType = 3;
    }

    if (CountStrofaPatternType === 4) {
      ResumeStrofaPatternType = "Обнаружено 4 разных типа строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такая несогласованность размеров не характерна для классических стихотворений. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      state.flagCountStrofaPatternType = 4;
    }

    if (CountStrofaPatternType > 4) {
      ResumeStrofaPatternType = "Обнаружено " + CountStrofaPatternType + " разных типов строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такая несогласованность размеров не характерна для классических стихотворений. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      state.flagCountStrofaPatternType = CountStrofaPatternType;
    }

    if (FlagStrofaMultiPatternType === 1) {
      FullRazmerComment = ResumeStrofaCount + ResumeStrofaPatternType;
      //ResumeStrofaPatternType="Выбранные строфы имеют размер: "+StrofaPatternTypeMas[0]+". ";
      ResumeStrofaPatternType = "Выбранные строфы имеют размер: " + "<br>" + StrofaPatternTypeText;

      //flagStrofa=galka+"Размер регулярный! ";
      //state.flagCountStrofaPatternType=1;
      state.flagGroupStrofaBall = 1;
      if (Strof === 2) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 2 строф. ";
        state.flagGroupStrofaBall = 2;
      }
      if (Strof === 3) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 3 строф. ";
        state.flagGroupStrofaBall = 3;
      }
      if (Strof === 4) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 4 строф. ";
        state.flagGroupStrofaBall = 4
      }
      if (Strof > 4) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из " + Strof + " строф. ";
        state.flagGroupStrofaBall = Strof;
      }

    }
  }

  const { ResumeStrofaPatternType: pType, epigrammatype: eType }
  =  AnalyzeEpigram(epigramma, StrofaPatternReport);
  if (pType) {
    ResumeStrofaPatternType = pType;
  }
  if (eType) {
    epigrammatype = eType;
  }



  state.razmerComment = ResumeStrofaCount + ResumeStrofaPatternType;


// массив позиций (конца) строфы
  console.log("StrofaPositionMas");
  console.log(state.StrofaPositionMas);
  CountPatternStrofaType = CountStrofaPatternType;
  TextStihResize();

  console.log('AnalizRazmera -> StrofaPatternReport',StrofaPatternReport);

}
