export function AnalizRazmera()
//==================================================================================
// Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
{
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
  StrofaPositionMas = [];

  StrofaPatternMas = [];
  StrofaPatternTypeMas = [];
  TemplateGlasn = "";
  window.flagCountStrofaPatternType = 0;
  StrofaRepeatTypeMas = [];
  Strof = 0;

  StrofaPositionMas[1] = 0;
  let glasny = "аоиеёэыуюяАОИЕЁЭЫУЮЯ";
  stih = document.formStih1.TextStih.value + "\n";
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
      TemplateGlasn = TemplateGlasn + NextZnak;
      ProbelPositionMas[CountStrok][CountSlog] = ProbelPos; 	// добавляем поиск позиция пробела, чтобы соотносить гласную с конкретным словом
    }
    //конец строки
    else if (NextZnak === "\n") {
      // *количество строк в строфе (позиция строфы) CountStrok
      ProbelPositionMas[CountStrok][CountSlog + 1] = CountZnak; // добавляем позицию конца строки в массив пробелов
      ++CountStrok;
      if (CountSlog > 0) {
        ResText = ResText + " - " + String(CountSlog) + "\n";
        TemplateGlasn = TemplateGlasn + "\n";
        if (CountSlog < 10) {
          TextCountSlog = " " + String(CountSlog) + ",";
        } else {
          TextCountSlog = String(CountSlog) + ",";
        }
        ;
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
        TemplateGlasn = TemplateGlasn + "\n";
        StrofaPatternMas[CountStrofa] = StrofaPattern.substr(0, StrofaPattern.length - 1);
        ResumeStrofa = ResumeStrofa + StrofaPattern + "\n";
        StrofaPattern = "";
        CountSlog = 0;
        CountZnak = 0;
        ProbelPos = 0;
        ProbelPositionMas[CountStrok] = [];
        // запоминаем позицию (конец) строфы
        StrofaPositionMas[CountStrofa + 1] = CountStrok;
      }
    }
  }


  console.log("TemplateGlasn");
  console.log(TemplateGlasn);
  console.log("StrofaPatternMas");
  console.log(StrofaPatternMas);
  console.log("ProbelPositionMas");
  console.log(ProbelPositionMas);

// анализ типов строф (паттернов) по массиву StrofaPatternMas[] ---------------------------------------------------
// выявление уникальных и повторяющихся типов строф ---------------------------------------------------------------

  let StrofaPatternTypeText = "";

  for (let s = 1; s < StrofaPatternMas.length; s++) {
    if (StrofaPatternMas[s].length === 0) {
      break;
    }
    ++Strof;
    if (!StrofaPatternTypeMas.includes(StrofaPatternMas[s])) {
      StrofaPatternTypeMas.push(StrofaPatternMas[s]);
      StrofaPatternTypeText = StrofaPatternTypeText + StrofaPatternMas[s] + ";<br>";
    }
  }
  CountStrofaPatternType = StrofaPatternTypeMas.length;

  if (CountStrofaPatternType > 1) {
    FlagStrofaMultiPatternType = 1
  }
  ;
  if (LentaMode.checked) {
    FlagStrofaMultiPatternType = 0
  }
  ;

// Создание комментариев по типам строф ---------------------------------------------------------------------------------------------

  if (Strof < 2 && !LentaMode.checked) {
    ResumeStrofaCount = "Стихотворение не разбито на строфы. " + "<br>" + "Нужно добавить пустую строку между строфами. ";
    flagStrofa = krest + "Разбейте на строфы. ";
    window.flagStrofaRazbita = 0;
    document.getElementById('level-full').checked = true;
  } else {
    window.flagStrofaRazbita = 1;
  }

  if (Strof < 2) {
    epigramma = 1;
  }

// режим эпиграмм
  if (window.project == "epigramma" && epigramma == 1) {
    ResumeStrofaCount = "";
    flagStrofa = galka + "Однострофное произведение. "
    // убираем знаки препинания
    stih = document.formStih1.TextStih.value + "\n";
    stih = stih.replace(/[.,:!?()-;—…']/gm, ' ');    // удалить знаки препинания
    document.formStih1.TextStih.value = stih + "\n\n";
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
      ResumeStrofaPatternType = "Все строфы имеют регулярный размер: " + StrofaPatternTypeMas[0] + ". Согласованный размер строф характерен именно для классических стихотворений. ";
      flagStrofa = galka + "Размер регулярный!  ";
      window.flagCountStrofaPatternType = 1;
    }

    if (CountStrofaPatternType === 2) {
      ResumeStrofaPatternType = "Первый тип строф имеет размер " + StrofaPatternTypeMas[0] + ". " + "Второй тип строф имеет размер " + StrofaPatternTypeMas[1] + ". Такое строение иногда используется в классических стихотворениях, но чаще всего в песнях с куплетами и припевами. ";
      flagStrofa = krest + "Два разных типа строфы.  ";
      window.flagCountStrofaPatternType = 2;
    }

    if (CountStrofaPatternType === 3) {
      ResumeStrofaPatternType = "Обнаружено 3 разных типа строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такое строение редко используется в классических стихотворениях. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      window.flagCountStrofaPatternType = 3;
    }

    if (CountStrofaPatternType === 4) {
      ResumeStrofaPatternType = "Обнаружено 4 разных типа строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такая несогласованность размеров не характерна для классических стихотворений. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      window.flagCountStrofaPatternType = 4;
    }

    if (CountStrofaPatternType > 4) {
      ResumeStrofaPatternType = "Обнаружено " + CountStrofaPatternType + " разных типов строф с размерами:" + "<br>" + StrofaPatternTypeText + "Такая несогласованность размеров не характерна для классических стихотворений. ";
      flagStrofa = krest + "Строфы не имеют регулярного размера.  ";
      window.flagCountStrofaPatternType = CountStrofaPatternType;
    }

    if (FlagStrofaMultiPatternType === 1) {
      FullRazmerComment = ResumeStrofaCount + ResumeStrofaPatternType;
      //ResumeStrofaPatternType="Выбранные строфы имеют размер: "+StrofaPatternTypeMas[0]+". ";
      ResumeStrofaPatternType = "Выбранные строфы имеют размер: " + "<br>" + StrofaPatternTypeText;

      //flagStrofa=galka+"Размер регулярный! ";
      //window.flagCountStrofaPatternType=1;
      window.flagGroupStrofaBall = 1;
      if (Strof === 2) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 2 строф. ";
        window.flagGroupStrofaBall = 2;
      }
      if (Strof === 3) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 3 строф. ";
        window.flagGroupStrofaBall = 3;
      }
      if (Strof === 4) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из 4 строф. ";
        window.flagGroupStrofaBall = 4
      }
      if (Strof > 4) {
        ResumeStrofaCount = "Анализируем фрагмент, состоящий из " + Strof + " строф. ";
        window.flagGroupStrofaBall = Strof;
      }

    }
  }


// 31.05.2023
  if (epigramma == 1 && StrofaPatternReport == " 9, 8, 9, 2") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого хитрого размера можно условно назвать «Крендель». ";
    epigrammatype = "Крендель";
  }

  if (epigramma == 1 && StrofaPatternReport == "11, 9,11, 2") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого запоминающегося размера можно условно назвать «Калач». Последее слово в нём твёрдое, как ручка у калача. ";
    epigrammatype = "Калач";
  }

  if (epigramma == 1 && StrofaPatternReport == " 6, 5, 6, 5") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого нехитрого размера можно условно назвать «Бублик», потому что он ровный со всех сторон. ";
    epigrammatype = "Бублик";
  }

  if (epigramma == 1 && StrofaPatternReport == " 8, 8, 7, 7") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого знакомого размера можно условно назвать «Ватрушка». Такой стих можно спеть как частушку. ";
    epigrammatype = "Ватрушка";
  }

  if (epigramma == 1 && StrofaPatternReport == " 8, 7, 8, 7") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А миниатюру такого знакомого размера можно условно назвать «Пампушка». Такой стих можно спеть как частушку. ";
    epigrammatype = "Пампушка";
  }

  if (epigramma == 1 && StrofaPatternReport == " 9, 8, 9, 8") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А самый простой «пирожок» – это четверостишие с рифмованным или вообще нерифмованным ямбом. ";
    epigrammatype = "Пирожок";
  }

  if (epigramma == 1 && StrofaPatternReport == " 8, 9, 8, 9") {
    ResumeStrofaPatternType = ResumeStrofaPatternType + "Лепить однострофные поэтические миниатюры легко и весело, поэтому их называют «пирожками». А самый простой «пирожок» – это четверостишие с рифмованным или вообще нерифмованным ямбом. ";
    epigrammatype = "Пирожок";
  }


  razmerComment = ResumeStrofaCount + ResumeStrofaPatternType;


// массив позиций (конца) строфы
  console.log("StrofaPositionMas");
  console.log(StrofaPositionMas);
  CountPatternStrofaType = CountStrofaPatternType;
  TextStihResize();
}
