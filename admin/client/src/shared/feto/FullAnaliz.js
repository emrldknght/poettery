/** @param state {FetoState} */
export function FullAnaliz(state) {
  console.log("START -- Full Analiz");
  console.log("LOG state.OriginalTextInput", state.OriginalTextInput);
  console.log("LOG BallClassicManual", state.BallClassicManual);
  console.log("LOG BallContentManual", state.BallContentManual);

  let NoLentaComment = '';

  const project = state.inWindow.project;


  /*
  // удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
   */
  ClearForm2();  // закрываем запись

  state.CountSlov = 0;
  state.CountSlog = 0;
  state.CountStrok = 0;
  state.CountBukv = 0;
  state.CountStrofa = 0;

  DelSpace(state);
  PoiskStrof(state);
  DelSpace(state);
  ClearForm2();
  let Comment0 = ""; // todo - check window
//оценки фрагмента
  state.flagStrofaRazbita = 0; // строфа не разбита =0, разбита =1
  state.flagCountStrofaPatternType = 0; // количество типов строф, если 1 - то все строфы одного размера
  state.flagGroupStrofaBall = 0; // количество строф в одной группе
  state.flagRitmBall = 0; // 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  state.flagCountRitmError = 0; // количество сбоев ритма
  state.flagRifmBall = 0; // Рифма точная - flagRifmBall=1
  state.flagCountErrorRifma = 0; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  state.flagAccentBall = 0; // Ударения в словах не расставлены. flagAccentBall=0
  state.ClassicBall = 0; // стихотворение строго классическое ClassicBall=3, если строф больше одной, типов строф<3, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм чёткий, сбоев ритма нет, нерифмованных строк нет
// стихотворение практически классическое ClassicBall=2, если строф больше одной, типов строф<4, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм явный или чёткий, сбоев ритма нет или один, нерифмованных строк не больше одной
// стихотворение не совсем классическое по форме, если строф больше одной, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм найден, количество нерифмованных строк <=2
// анализ не проводится, если не расставлены ударения, если строфа одна.


  let flagRitmError1 = "";
  let flagStrofa1 = "";
  let flagRitm1 = "";
  let flagErrorRifma1 = "";
  let FlagRifm1 = "";
  let flagProcentCountSlogSer = 0;


//массивы с оценками по каждому фрагменту
  state.flagStrofaBallMas = [];// количество типов строф, если 1 - то все строфы одного размера
  state.flagRitmBallMas = [];// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  state.flagRifmBallMas = [];// Рифма точная - flagRifmBall=1
  state.flagAccentBallMas = [];// Ударения в словах не расставлены. flagAccentBall=0
  state.flagStrofaRazbitaMas = [];// строфа не разбита =0, разбита =1
  state.flagGroupStrofaBallMas = [];// количество строф в одной группе
  state.flagCountStrofaPatternTypeMas = [];// количество типов строф, если 1 - то все строфы одного размера
  state.flagCountErrorRifmaMas = []; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  state.flagCountRitmErrorMas = []; // количество сбоев ритма
  state.flagProcentCountSlogSerMas = []; // процент серых гласных

//интегральная оценка всех фрагментов
  let GlobalflagStrofaBallMas = 0;// количество типов строф, если 1 - то все строфы одного размера
  state.GlobalflagRitmBallMas = 3;// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  let GlobalflagRifmBallMas = 1;// Рифма точная - flagRifmBall=1
  state.GlobalflagAccentBallMas = 0;// Ударения в словах не расставлены. flagAccentBall=0
  state.GlobalflagStrofaRazbitaMas = 0;// строфа не разбита =0, разбита =1
  let GlobalflagGroupStrofaBallMas = 0;// количество строф в одной группе
  state.GlobalflagCountStrofaPatternTypeMas = 0;// количество типов строф, если 1 - то все строфы одного размера
  let GlobalflagCountErrorRifmaMas = 0; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  let GlobalflagCountRitmErrorMas = 0; // количество сбоев ритма
  let GlobalSumSlogSer = 0; // сумма серых гласных (по всем фрагментам)
  let SumSlogSer = 0; // сумма серых гласных (по всем фрагментам)
  let SumGlobalflagProcentCountSlogSer = 0; // процент серых гласных 2
  let GlobalflagProcentCountSlogSer = 0; // процент серых гласных
  let ProcentSumFragmentSlogSer = 0; // процент серых гласных как сумма серых по фрагментам от общего количества гласных
  let GlobalClassicBall = 0; // не классическое=0 -по умолчанию; всё стихотворение строго классическое=3


  let GlobalResumeComment = "";
  let GlobalResumeCommentMini = "";
  let UpFlag1 = "";

  let GlobalResumeCommentRitmBallMas0 = "";
  let GlobalResumeCommentRitmErrorMas0 = "";
  let GlobalResumeCommentCountErrorRifmaMas0 = "";
  let GlobalResumeCommentCountStrofaPatternTypeMas0 = "";

  let FragmentResumeComment = "";
  let FragmentResumeCommentStrofaRazbita = "";
  let FragmentResumeCommentCountStrofaPatternType = "";
  let FragmentResumeCommentRitmBall = "";
  let FragmentResumeCommentCountRitmError = "";
  let FragmentResumeCommentCountErrorRifma = "";
  let FragmentResumeCommentSlogSer = "";


  let GroupStrofMas = [];
  let fragment = "";
  let textfragment = "";
  state.flagRitmError = "";
  state.FullRazmerComment = "";
  state.FlagStrofaMultiPatternType = 0;


  state.razmerComment = "";
  // CommentGroupStrof = "";
  state.RitmComment = "";
  state.RifmComment = "";

  state.ResumeComment = "";
  let flagCountStrofaRitmEr = "";
  state.ProcentCountSlogSer = 0;
  let rezumeProcentCountSlogSer = "";

  let BallClassicManualText = ""; //"Оценка классики вручную"
  let BallContentManualText = ""; //Оценка содержания вручную


  let tableRef = ''; // находим таблицу
  let row1 = ''; // строка таблицы
  let nextrow = ''; // строка таблицы (клон)
  let nextrow1 = ''; // строка таблицы (клон)
  let row2 = '';
  let nextrow2 = '';
  let row3 = '';
  let nextrow3 = '';
  let elem = "";
  let elem2 = "";
  let NextID = "";
  let FullContainerTemplate = "";
  let FragmentReports = "";
  let FragmentN = 0;
  state.lenta = 1;
  state.lentacount = 1;
  const elementArray = [];
  state.CrossLentaRitm = []; // массив базового ритмического рисунка для перекрестных строф (одна строфа-один ритм). После перекрёстного анализа служит восстановлению ритма в востановленных строфах
  state.CrossTemplateGlasn = []; // массив гласных для перекрестных строф
  let kolStrokTemplateGlasn = 0;
  let countStrokTemplateGlasn = 0;
  let TemplateGlasn2 = [];
  let CrossRitmStr = "";
  state.NewAccentLentaText = "";

  state.epigramma = 0;
  state.epigrammatype = "";


  state.ResumeLentaMode = "Ниже приводится анализ фрагментов, в которых сгруппированы строфы одного размера.";

  if (state.LentaMode.checked) {
    state.ResumeLentaMode = "Группировка одинаковых по размеру строф не дала положительного результата. Ниже приводится анализ отдельных строф.";
  }


// проверяем чек бокс "не расставлять ударения" - если обрабатываем файл, в котором они уже расставлены
  let FileAccent = state.FileAccent.checked;
  if (FileAccent) {
    state.flagSetAccent = 1
  }



  if (state.flagSetAccent === 0) {
    state.ContainerComment1 = "Расставьте ударения в словах. " + "\n" + "УдарЕния обозначАются заглАвной бУквой. " + "\n" + "Для автоматической расстановки ударений нажмите кнопку [Анализ стихотворения]. ";
    state.ResumeComment = "";
    return;
  }

// Заголовок =========================================
  state.stih = state.OriginalTextInput + "\n";
  state.stihMas = state.stih.split("\n");

  console.log('stihMas', state.stihMas);


  state.TitulStih = state.stihMas[0];
  state.TitulStih = state.TitulStih.toUpperCase();
  state.TitulStih = state.TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";    // удалить знаки препинания в конце строки заголовка

  // disclamer = '<a href="https://vpoezii.online" target="_blank" style="text-decoration: none; color: #0d6f9c; link: #aaaaaa;">
  // * Мнение редакции альманаха «Венец поэзии» может отличаться от выводов интеллектуальной системы. Содержание текста требует отдельного анализа.
  // Не забудьте проверить правильность расстановки ударений</a>.';

  let TitleComment = 'Структурный анализ стихотворения «' + state.TitulStih + '» подготовлен* интеллектуальной системой Fet.Online&nbsp;<a href="https://vpoezii.online/document/4502/" target="_blank" style="text-decoration: none; color: #0d6f9c!important;  link: #aaaaaa!important;">&nbsp;(свидетельство Роспатента от 22.03.2021 №2021614295)</a>.';
  // document.title = 'Анализ стихотворения «' + state.TitulStih + '»';

// НАЧАЛО АНАЛИЗА =========================================


// Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
  AnalizRazmera(state);
// if (window.flagStrofaRazbita===0 && !LentaMode.checked) {document.getElementById('ContainerComment1').innerHTML ="Стихотворение не разбито на строфы. Нужно добавить пустую строку между строфами. "; document.getElementById('ContainerFlag1').innerHTML=krest+"Разбейте на строфы. "; document.getElementById('level-full').checked=true; epigramma=1;};

  if (state.flagStrofaRazbita === 0 && !state.LentaMode.checked) {
    state.ContainerComment1 = "Стихотворение не разбито на строфы. Нужно добавить пустую строку между строфами. ";
    state.ContainerFlag1 = state.krest + "Разбейте на строфы. ";
    // document.getElementById('level-full').checked = true;
    state.levelFull = true;
  }



  if (state.LentaMode.checked) {
    LentaPoiskStrof(state);
  }

  if (!state.LentaMode.checked) {
    AnalizGroupStrof(state);
    CreateGroupStrof(state);
  }

//если строфы разные, то добавляем исходный стих к массиву групп строф и делаем анализ отдельных групп строф
  if (state.GroupStrof.length > 1) {
    state.GroupStrof.unshift(state.stih);
  }

  if (state.UnicStrof === 1) {
    state.FullRazmerComment = state.FullRazmerComment
      + ' Только одна строфа по размеру не согласована с другими строфами. ';
  }

  if (state.UnicStrof === 2 || state.UnicStrof === 3 || state.UnicStrof === 4) {
    state.FullRazmerComment = state.FullRazmerComment
      + state.UnicStrof
      + ' строфы по размеру вообще не согласованы с другими строфами, то есть они все написаны «вразнобой». Создаётся впечатление, что произведение состоит из фрагментов нескольких стихотворений, написанных в разное время и по разным поводам. ';
  }

  if (state.UnicStrof > 4) {
    state.FullRazmerComment = state.FullRazmerComment
      + state.UnicStrof
      + ' строф имеют каждая свой размер, то есть они все написаны совершенно «вразнобой». Создаётся впечатление, что произведение состоит из фрагментов нескольких стихотворений, написанных в разное время и по разным поводам. ';
  }


  if (state.GroupStrof.length > 2) {
    Comment0 = TitleComment + "<br><br>" + state.FullRazmerComment + '<br><br>';
  }


  for (let FragmentNumber = state.GroupStrof.length - 1; FragmentNumber >= 0; FragmentNumber--) {

    FragmentResumeCommentStrofaRazbita = "";
    FragmentResumeCommentCountStrofaPatternType = "";
    FragmentResumeCommentRitmBall = "";
    FragmentResumeCommentCountRitmError = "";
    FragmentResumeCommentCountErrorRifma = "";


    state.OriginalTextInput = state.GroupStrof[FragmentNumber];
    console.log("with value - state.OriginalTextInput", state.OriginalTextInput);

    DelSpace(state);
    console.log("StrofaRepeatTypeMas[FragmentNumber]");
    console.log(state.StrofaRepeatTypeMas[FragmentNumber]);
    console.log("AnalizRazmera");
    AnalizRazmera(state);
    console.log("CreateTemplateAccent");
    // Создаём шаблон ударений. Выбираем гласные, заменяем маркерами ударений О:. и записываем шаблон в переменную TemplateAccent. Заодно создаём массив номеров гласных в словах - TemplateNumGlas.
    CreateTemplateAccent(state);

    console.log("AnalizRifm(1)");
    // Ищем рифмы - последние ударные гласные. Заменяем на фонетические аналоги. Заодно записываем рифмующиеся слова в массив. Ёфицируем рифмующееся слово. Если ёфикация была лишней, то не учитываем ёфикацию.
    AnalizRifm(1, state);
    if (!FileAccent) {
      console.log("ReversAccent()");
      // Находим неразмеченные слова и размечаем по шаблону Ritm[]. Если не помогло, то предлагаем несколько ударений на выбор.
      ReversAccent(state);
    }
    console.log("AnalizRazmera()");
    // Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
    AnalizRazmera(state);
    console.log("CreateTemplateAccent()");
    // Создаём шаблон ударений. Выбираем гласные, заменяем маркерами ударений О:. и записываем шаблон в переменную TemplateAccent. Заодно создаём массив номеров гласных в словах - TemplateNumGlas.
    CreateTemplateAccent(state);
    console.log("AnalizRifm(2)");
    // Ищем рифмы - последние ударные гласные. Заменяем на фонетические аналоги. Заодно записываем рифмующиеся слова в массив. Ёфицируем рифмующееся слово. Если ёфикация была лишней, то не учитываем ёфикацию.
    AnalizRifm(2, state);

    if (!FileAccent) {
      console.log("ReversAccent() -2");
      // Находим неразмеченные слова и размечаем по шаблону Ritm[]. Если не помогло, то предлагаем несколько ударений на выбор.
      ReversAccent(state);
    }

    DelSpace(state);

// Здесь мы имеем массив гласных, размер строфы, шаблон ударений стиха или фрагмента стиха --------------------------------------------------------------
// пробуем формировать перекрёстные строфы
// ======================================================================================================================================================

// Заголовок фрагмента стиха --------------------------------------------------------------
    if (state.GroupStrof.length > 2) {
      fragment = "фрагмента стихотворения";
    } else {
      fragment = "стихотворения";
    }
    ;
    let NextStih = state.OriginalTextInput + "\n";
    let NextStihMas = NextStih.split("\n");

    console.log('NextStihMas', NextStihMas);

    let TitulStih = NextStihMas[0];
    TitulStih = TitulStih.toUpperCase();
    TitulStih = TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";    // удалить знаки препинания в конце строки заголовка
    let TitleComment = 'Структурный анализ ' + fragment + ' «' + TitulStih + '» подготовлен* интеллектуальной системой Fet.Online' + '<a href="https://vpoezii.online/document/4502/" target="_blank" style="text-decoration: none; color: #0d6f9c!important; ; link: #aaaaaa!important; ;">&nbsp;(свидетельство Роспатента от 22.03.2021 №2021614295)</a>.';
    // document.title = 'Анализ стихотворения «' + TitulStih + '»';
    state.TitulStihReport = TitulStih; //заголовок
// установка флагов -----------------------------------------------------------------------

// ---уточнение процента серых гласных и балла за ритм -------------------------
    if (state.CountStrofaRitmEr > 0) {
      flagCountStrofaRitmEr = state.krest + "Сбойных строф:" + state.CountStrofaRitmEr + " ";
    } else {
      flagCountStrofaRitmEr = "";
    }

    state.ProcentCountSlogSer = Math.round(state.CountSlogSer / state.CountSlog * 100);
// сумма серых гласных по фрагментам -------------------------

    if (FragmentNumber > 0 || state.GroupStrof.length === 1) {
      SumSlogSer = SumSlogSer + state.LentaCountSlogSer
    }



//rezumeProcentCountSlogSer=" Слабоударных (смешанных) гласных:"+ProcentCountSlogSer+"%  ";
    if (state.ProcentCountSlogSer > 40) {
      rezumeProcentCountSlogSer = ' Слишком много слабоударных (смешанных) гласных:<span style="color:#FF0000 ; font-weight: bold;">'
        + state.ProcentCountSlogSer + '%  &nbsp;</span>';
    }

    if (state.ProcentCountSlogSer <= 40) {
      rezumeProcentCountSlogSer = ' Количество слабоударных (смешанных) гласных в норме:' + state.ProcentCountSlogSer + '%  &nbsp;</span>';
    }



// ---уточнение процента серых гласных и балла за ритм -------------------------

    if (state.CrossOverMode === 1) {
      state.RifmComment = "";
      state.FlagRifm = "";
      FlagRifm1 = "";
      state.flagCountErrorRifma = 0;
      state.flagErrorRifma = "";
      flagErrorRifma1 = "";
      state.flagRifmBall = 1;
    }
    // в режиме кроссовера рифма не учитывается

    let UpFlag = state.flagStrofa + state.flagAccent + // + state.flagRazmer
      state.flagRitm + state.flagRitmError + state.FlagRifm +
      rezumeProcentCountSlogSer + flagCountStrofaRitmEr;
    state.ContainerFlag1 = UpFlag;
    if (state.flagAccent.length > 0) {
      state.ResumeComment = "";
    }


// state.ClassicBall=state.flagCountStrofaPatternType+state.flagRitmBall+state.flagRifmBall;
    state.flagAccentBall = 1;
    if (state.GroupStrof.length === 1) {
      state.flagGroupStrofaBall = state.Strof
    }


// проверка критериев  ФРАГМЕНТОВ стихотворения (FragmentNumber=1,2,3)

    if (state.LentaMode.checked) {
      state.UnicStrof = 0;
      state.flagStrofaRazbita = 1;
      state.flagGroupStrofaBall = 2;
      state.flagCountStrofaPatternType = 0;
      state.flagStrofa = "";
    } // если ленточный режим, то анализируем каждую строфу - ошибки за разбивку строф не начисляем


    if (FragmentNumber > 0 || state.GroupStrof.length === 1) {
// проверка критериев ФрАГМЕНТА стихотворения не совсем классического

      if (state.ProcentCountSlogSer < 50) {
        if (state.UnicStrof < 3) {
          if (state.flagStrofaRazbita > 0) {
            if (state.flagAccentBall > 0) {
              if (state.flagGroupStrofaBall > 1) {
                if (state.flagCountStrofaPatternType < 4) {
                  if (state.flagRitmBall > 0) {
                    if (state.flagCountRitmError < 5) {
                      if (state.flagCountErrorRifma < 5) {
                        state.ClassicBall = 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
// проверка критериев практически классического ФрАГМЕНТА стихотворения
      if (state.ProcentCountSlogSer < 40) {
        if (state.UnicStrof < 2) {
          if (state.flagStrofaRazbita > 0) {
            if (state.flagAccentBall > 0) {
              if (state.flagGroupStrofaBall > 1) {
                if (state.flagCountStrofaPatternType < 4) {
                  if (state.flagRitmBall > 1) {
                    if (state.flagCountRitmError < 2) {
                      if (state.flagCountErrorRifma < 2) {
                        state.ClassicBall = 2;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

// проверка критериев строго классического ФрАГМЕНТА стихотворения
      if (state.ProcentCountSlogSer < 30) {
        if (state.UnicStrof === 0) {
          if (state.flagStrofaRazbita > 0) {
            if (state.flagAccentBall > 0) {
              if (state.flagGroupStrofaBall > 1) {
                if (state.flagCountStrofaPatternType < 3) {
                  if (state.flagRitmBall === 3) {
                    if (state.flagCountRitmError === 0) {
                      if (state.flagCountErrorRifma === 0) {
                        state.ClassicBall = 3;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

// дополнительные комментарии для ФРАГМЕНТА стихотворения

      if (state.flagStrofaRazbita === 0) {
        FragmentResumeCommentStrofaRazbita = "строфы не разбиты, "
      }
      if (state.flagCountStrofaPatternType > 2) {
        FragmentResumeCommentCountStrofaPatternType = "несогласованность строф по размеру, ";
      }
      if (state.flagRitmBall < 2) {
        FragmentResumeCommentRitmBall = "отсутствие чёткого ритма, ";
      }
      if (state.ProcentCountSlogSer > 40) {
        FragmentResumeCommentSlogSer = "смешение ударных гласных с безударными, ";
      }
      if (state.flagCountRitmError > 0) {
        FragmentResumeCommentCountRitmError = "сбои ритма, ";
      }
      if (state.flagCountErrorRifma > 0) {
        FragmentResumeCommentCountErrorRifma = "отсутствие рифмы,";
      }

      FragmentResumeComment = FragmentResumeCommentCountStrofaPatternType + FragmentResumeCommentRitmBall + FragmentResumeCommentSlogSer + FragmentResumeCommentCountRitmError + FragmentResumeCommentCountErrorRifma;


// ================================================================

      state.flagStrofaRazbitaMas[FragmentNumber] = state.flagStrofaRazbita; // строфа не разбита =0, разбита =1
      state.flagAccentBallMas[FragmentNumber] = state.flagAccentBall; // Ударения в словах не расставлены. flagAccentBall=0
      state.flagGroupStrofaBallMas[FragmentNumber] = state.flagGroupStrofaBall; // количество строф в одной группе
      state.flagCountStrofaPatternTypeMas[FragmentNumber] = state.flagCountStrofaPatternType; // количество типов строф, если 1 - то все строфы одного размера
      state.flagCountRitmErrorMas[FragmentNumber] = state.flagCountRitmError; // количество сбоев ритма
      state.flagCountErrorRifmaMas[FragmentNumber] = state.flagCountErrorRifma; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)

      state.flagProcentCountSlogSerMas[FragmentNumber] = window.flagProcentCountSlogSer; // процент серых гласных

      state.flagRitmBallMas[FragmentNumber] = state.flagRitmBall;// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
      state.flagRifmBallMas[FragmentNumber] = state.flagRifmBall;// Рифма точная - flagRifmBall=1 (реально используется количество нерифмованных строк)
      state.ClassicBallMas[FragmentNumber] = state.ClassicBall;


//интегральная оценка всех фрагментов - ищем максимумы (минимумы)
      if (state.flagStrofaRazbitaMas[FragmentNumber] > state.GlobalflagStrofaRazbitaMas) {
        state.GlobalflagStrofaRazbitaMas = state.flagStrofaRazbitaMas[FragmentNumber]
      }
      // строфа не разбита =0, разбита =1
      if (state.flagAccentBallMas[FragmentNumber] > state.GlobalflagAccentBallMas) {
        state.GlobalflagAccentBallMas = state.flagAccentBallMas[FragmentNumber]
      }
      // Ударения в словах не расставлены. flagAccentBall=0
      if (state.flagGroupStrofaBallMas[FragmentNumber] < GlobalflagGroupStrofaBallMas) {
        GlobalflagGroupStrofaBallMas = state.flagGroupStrofaBallMas[FragmentNumber]
      }
      // количество строф в одной группе (минимум)
      if (state.flagCountStrofaPatternTypeMas[FragmentNumber] > state.GlobalflagCountStrofaPatternTypeMas) {
        state.GlobalflagCountStrofaPatternTypeMas = state.flagCountStrofaPatternTypeMas[FragmentNumber]
      }
      // количество типов строф, если 1 - то все строфы одного размера
      if (state.flagRitmBallMas[FragmentNumber] < state.GlobalflagRitmBallMas) {
        state.GlobalflagRitmBallMas = state.flagRitmBallMas[FragmentNumber]
      }
      // 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий. (ищем худший) базовый =3
      if (state.flagRifmBallMas[FragmentNumber] > GlobalflagRifmBallMas) {
        GlobalflagRifmBallMas = state.flagRifmBallMas[FragmentNumber]
      }
      // Рифма точная - flagRifmBall=1 (ищем худший)
      GlobalflagCountRitmErrorMas = GlobalflagCountRitmErrorMas + state.flagCountRitmErrorMas[FragmentNumber];// количество сбоев ритма (сумма)
      GlobalflagCountErrorRifmaMas = GlobalflagCountErrorRifmaMas + state.flagCountErrorRifmaMas[FragmentNumber];// количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара) -сумма
      if (state.flagStrofaBallMas[FragmentNumber] < GlobalflagStrofaBallMas) {
        GlobalflagStrofaBallMas = state.flagStrofaBallMas[FragmentNumber]
      }
      // количество типов строф (в группе), если 1 - то все строфы одного размера

// надо добавить вычисление максимального количества серых гласных
      if (state.flagProcentCountSlogSerMas[FragmentNumber] > GlobalflagProcentCountSlogSer) {
        GlobalflagProcentCountSlogSer = state.flagProcentCountSlogSerMas[FragmentNumber]
      }
      // процент серых гласных - ищем максимум

//======================================================================

// завершение проверки критериев  ФРАГМЕНТОВ стихотворения (FragmentNumber=1,2,3)
    }

// интегральная оценка ВСЕГО СТИХОТВОРЕНИЯ - сумма фрагментов (переменные Global вычисляются по массивам)
    if (FragmentNumber === 0) {

// проверка критериев не совсем классического ВСЕГО СТИХОТВОРЕНИЯ

      if (GlobalflagProcentCountSlogSer < 50) {
        if (state.UnicStrof < 3) {
          if (state.GlobalflagStrofaRazbitaMas > 0) {
            if (state.GlobalflagAccentBallMas > 0) {
              if (state.GlobalflagCountStrofaPatternTypeMas < 4) {
                if (state.GlobalflagRitmBallMas > 0) {
                  if (GlobalflagCountRitmErrorMas < 5) {
                    if (GlobalflagCountErrorRifmaMas < 5) {
                      GlobalClassicBall = 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
// проверка критериев практически классического ВСЕГО СТИХОТВОРЕНИЯ

      if (GlobalflagProcentCountSlogSer < 40) {
        if (state.UnicStrof < 2) {
          if (state.GlobalflagStrofaRazbitaMas > 0) {
            if (state.GlobalflagAccentBallMas > 0) {
              if (state.GlobalflagCountStrofaPatternTypeMas < 4) {
                if (state.GlobalflagRitmBallMas > 1) {
                  if (GlobalflagCountRitmErrorMas < 2) {
                    if (GlobalflagCountErrorRifmaMas < 2) {
                      GlobalClassicBall = 2;
                    }
                  }
                }
              }
            }
          }
        }
      }
// проверка критериев строго классического ВСЕГО СТИХОТВОРЕНИЯ

      if (GlobalflagProcentCountSlogSer < 30) {
        if (state.UnicStrof === 0) {
          if (state.GlobalflagStrofaRazbitaMas > 0) {
            if (state.GlobalflagAccentBallMas > 0) {
              if (state.GlobalflagCountStrofaPatternTypeMas < 3) {
                if (state.GlobalflagRitmBallMas === 3) {
                  if (GlobalflagCountRitmErrorMas === 0) {
                    if (GlobalflagCountErrorRifmaMas === 0) {
                      GlobalClassicBall = 3;
                    }
                  }
                }
              }
            }
          }
        }
      }
// завершение проверки критериев  ВСЕГО стихотворения (FragmentNumber=1,2,3)

      if (state.LentaMode.checked) {
        GlobalClassicBall = 0
      }
      // в режиме ленты - только неклассические


// комментарии в кроссрежиме не нужны alex
      if (state.CrossOverMode === 0 && !state.levelStrok) {


// обратное восстановление комментариев СТРОФА-ТИП для глобальной оценки

        if (state.GlobalflagCountStrofaPatternTypeMas === 1) {
          state.ResumeStrofaPatternType = "Все строфы имеют регулярный размер. ";
          flagStrofa1 = state.galka + "Размер регулярный!  ";
        }
        if (state.GlobalflagCountStrofaPatternTypeMas === 2) {
          state.ResumeStrofaPatternType = "Обнаружено 2 разных типа строф. Такое строение иногда используется в классических стихотворениях, но чаще всего в песнях с куплетами и припевами. ";
          flagStrofa1 = "* Два разных типа строфы! ";
        }
        if (state.GlobalflagCountStrofaPatternTypeMas === 3) {
          state.ResumeStrofaPatternType = "Обнаружено 3 разных типа строф. Такое строение редко используется в классических стихотворениях. ";
          flagStrofa1 = "* Три разных типа строфы! ";
        }
        if (state.GlobalflagCountStrofaPatternTypeMas === 4) {
          state.ResumeStrofaPatternType = "Обнаружено 4 разных типа строф с размерами. Такая несогласованность размеров не характерна для классических стихотворений. ";
          flagStrofa1 = state.krest + "Строфы не имеют регулярного размера! ";
          GlobalResumeCommentCountStrofaPatternTypeMas0 = "несогласованность размеров,";
        }
        if (state.GlobalflagCountStrofaPatternTypeMas > 4) {
          state.ResumeStrofaPatternType = "Обнаружено "
            + state.GlobalflagCountStrofaPatternTypeMas
            + " разных типов строф. Такая несогласованность размеров не характерна для классических стихотворений. ";
          flagStrofa1 = state.krest + "Строфы не имеют регулярного размера! ";
          GlobalResumeCommentCountStrofaPatternTypeMas0 = "несогласованность размеров,";
        }

// обратное восстановление комментариев СТРОФА для глобальной оценки


// обратное восстановление комментариев РИТМ для глобальной оценки
        let CommentStopa = ''

        if (state.GlobalflagRitmBallMas === 0) {
          CommentStopa = "В тексте не обнаружен ритм. ";
          flagRitm1 = state.krest + "Ритм не найден! ";
          GlobalResumeCommentRitmBallMas0 = "разнобой в ритме,";
        }
        if (state.GlobalflagRitmBallMas === 1) {
          CommentStopa = "Текст имеет слабые признаки ритма. ";
          flagRitm1 = state.galka + "Ритм слабый! ";
        }
        if (state.GlobalflagRitmBallMas === 2) {
          CommentStopa = "Строфы имеют явный ритмический рисунок, повторяющийся в каждой строке. ";
          flagRitm1 = state.galka + "Ритм явный! ";
        }
        if (state.GlobalflagRitmBallMas === 3) {
          CommentStopa = "Строфы имеют очень чёткий ритмический рисунок, повторяющийся в каждой строке. ";
          flagRitm1 = state.galka + "Ритм чёткий! ";
        }

        // === ВРЕМЕННЫЙ КОСТЫЛЬ ДЛЯ АДАПТЕРА (TODO: refactor) ===
        state._TempCommentStopa = CommentStopa;




// обратное восстановление комментариев РИТМ-СБОИ для глобальной оценки
        if (GlobalflagCountRitmErrorMas > 0) {
          flagRitmError1 = state.krest + "Есть сбои ритма: " + GlobalflagCountRitmErrorMas + ". ";
          GlobalResumeCommentRitmErrorMas0 = "отдельные сбои ритма,";
        } else {
          flagRitmError1 = "";
        }

// обратное восстановление комментариев РИФМА для глобальной оценки

        if (GlobalflagCountErrorRifmaMas > 0) {
          flagErrorRifma1 = state.krest + "Есть сбои рифмы: " + GlobalflagCountErrorRifmaMas + ". ";
          FlagRifm1 = "";
          GlobalResumeCommentCountErrorRifmaMas0 = "отсутствие рифмы в некоторых строках,";
        }
        if (GlobalflagCountErrorRifmaMas === 0) {
          FlagRifm1 = state.galka + "Рифма точная! ";
          flagErrorRifma1 = "";
        }

        const mobilenavigator = '';

        if (GlobalClassicBall === 3) {
          GlobalResumeComment = 'Cтруктура ' + fragment + ' вполне соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = state.greengalka + 'Структура стихотворения вполне соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }


        if (GlobalClassicBall === 2) {
          GlobalResumeComment = 'В целом, структура ' + fragment + ' практически соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = state.greengalka + ' Структура стихотворения практически соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }

        if (GlobalClassicBall === 1) {
          GlobalResumeComment = 'В целом, структура ' + fragment + ' не совсем классическая. Некоторая доработка ' + fragment + ' позволит повысить лёгкость его чтения и запоминания. А ритмически согласованные строки можно попробовать положить на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = state.redkrest + ' Структура стихотворения не совсем классическая. ' + mobilenavigator;
        }


        if (GlobalClassicBall === 0 && state.epigramma !== 1) {
          state.ResumeComment = 'В целом, структура «произведения» не соответствует канонам русского классического стихосложения. Автор допустил ' + GlobalResumeCommentRitmBallMas0 + GlobalResumeCommentRitmErrorMas0 + GlobalResumeCommentCountErrorRifmaMas0 + GlobalResumeCommentCountStrofaPatternTypeMas0 + ' что в результате усложняет задачу читателям, затрудняет восприятие содержания, негативно отражается на запоминании. А попытка положить такие слова на музыку, наверняка приведёт к искажению естественных ударений в словах. ' + '<br><br>';
          GlobalResumeCommentMini = state.redkrest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }

        if (state.GlobalflagStrofaRazbitaMas === 0 && !state.LentaMode.checked) {
          state.ResumeComment = 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br><br>';
          GlobalResumeCommentMini = state.krest + 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br><br>';
        }


      }
// завершение глобальной оценки ===============================================================================================================
    }



    if (state.ClassicBall === 3) {
      state.ResumeComment = 'Cтруктура ' + fragment + ' вполне соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
      state.ResumeCommentMini = state.greengalka + ' Структура ' + fragment + ' вполне соответствует стандартам русского классического стихосложения. ';
    }


    if (state.ClassicBall === 2) {
      state.ResumeComment = 'В целом, структура ' + fragment + ' практически соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
      state.ResumeCommentMini = state.greengalka + ' Структура ' + fragment + ' практически соответствует стандартам русского классического стихосложения. ';
    }

    if (state.ClassicBall === 1) {
      state.ResumeComment = 'В целом, структура ' + fragment + ' не совсем классическая. Некоторая доработка ' + fragment + ' позволит повысить лёгкость его чтения и запоминания. А ритмически согласованные строки можно попробовать положить на музыку. <br><br>Только после этого можно рассматривать возможность публикации стихотворения в альманахе «Венец поэзии». ' + '<br><br>';
      state.ResumeCommentMini = state.redkrest + ' Структура ' + fragment + ' не совсем классическая. ';
      state.ResumeCommentMini = state.redkrest + ' Структура ' + fragment + ' не совсем классическая. ';
    }

    if (state.ClassicBall === 0 && state.epigramma !== 1) {
      state.ResumeComment = 'В целом, структура «произведения» не соответствует канонам русского классического стихосложения. Автор допустил ' + FragmentResumeComment + ' что усложняет задачу читателю, затрудняет ему восприятие содержания. Такой текст труднее запомнить и воспроизвести. А попытка положить такие слова на музыку, наверняка приведёт к искажению естественных ударений в словах. <br><br>Такие произведения не подлежат  публикации в  альманахе «Венец поэзии». ' + '<br><br>';
      state.ResumeCommentMini = state.redkrest + ' Структура ' + fragment + ' не соответствует стандартам русского классического стихосложения. ';
    }

    if (state.GlobalflagStrofaRazbitaMas === 0 && !state.LentaMode.checked) {
      state.ResumeComment = 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br>';
      state.ResumeCommentMini = state.krest + 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br>';
    }


    state.ContainerAnaliz1 = TitleComment + "<br><br>"
      + state.razmerComment + state.RitmComment
      + state.RifmComment + state.ResumeComment;


// запомним комментарий по всему стихотворению, чтобы вернуть его после обработки ленты

//		if (fragment=="стихотворения") {NoLentaComment=TitleComment+"<br><br>"+razmerComment+CommentGroupStrof+ResumeLentaMode;}

    // document.getElementById('ContainerComment1').innerHTML = ResumeCommentMini;

    /*
    if (LentaMode.checked || CrossOverMode == 1) {
      // disclamer = ""
    }
    // в режиме ленты или кроссовера без дисклеймера
     */

    // document.getElementById('ContainerAnaliz1f').innerHTML = disclamer;


    // если текст короткий - заменить на пустой и очистить комментарии ???
    let nexttext = state.OriginalTextInput;
    GroupStrofMas = nexttext.split("\n");
    if (GroupStrofMas.length < 4 && state.CrossOverMode === 0) {
      state.OriginalTextInput = "";
      state.ContainerComment1 = "";
      state.ContainerFlag1 = "";
      state.ContainerAnaliz1 = "";
      state.ContainerTemplate1 = "";
      console.log("CrossOverMode=0");
    }



// переносим результаты из первого блока в следующий (клонируем первую вторую и далее строку в конец таблицы)  --------lenta-------------------------------------
    TextStihResize();

    if (state.GroupStrof.length > 1 && FragmentNumber > 0) {
      // todo - ! REFACTOR

      state.lenta = state.lenta + 1;

      tableRef = document.getElementById('global-table1'); // находим таблицу

      console.log('tableRef', tableRef);

      row1 = tableRef.rows[0]; //0 строка - это флаг

      console.log('tableRef row1', row1);

      row2 = tableRef.rows[1]; //1 строка - это комментарий
      row3 = tableRef.rows[2]; //2 строка - это стих

      nextrow1 = row1.cloneNode(true); // клонируем
      nextrow = tableRef.appendChild(nextrow1); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerFlag1/g, 'ContainerFlag' + state.lenta); // id-метку надо переименовать (извлекаем html, делаем текстовую замену и возвращаем)
      nextrow.innerHTML = elem;
      nextrow1.innerHTML = elem;
      nextrow1.id = 'lenta1-' + state.lenta;  // новое имя всему блоку

      nextrow2 = row2.cloneNode(true); // клонируем
      nextrow = tableRef.appendChild(nextrow2); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerComment1/g, 'ContainerComment' + state.lenta); // id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow2.innerHTML = elem;
      nextrow2.id = 'lenta2-' + state.lenta;

      nextrow3 = row3.cloneNode(true); // клонируем, в этом блоке три id-метки, их надо переименовать
      nextrow = tableRef.appendChild(nextrow3); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerTemplate1/g, 'ContainerTemplate' + state.lenta);// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;
      nextrow3.id = 'lenta3-' + state.lenta;


      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerAnaliz1/g, 'ContainerAnaliz' + state.lenta);// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerAnaliz1f/g, 'ContainerAnaliz' + state.lenta + 'f');// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

// тест переносим последним =============

      elem = nextrow.innerHTML;
      elem = elem.replace(/formStih1/g, 'formStih' + state.lenta);// name-метку  надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = nextrow.innerHTML;
      elem = elem.replace(/TextStih1/g, 'TextStih' + state.lenta);// name-метку  надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = document.getElementsByName('formStih' + state.lenta)[0];// ищем name-метку
      console.log('!elem', 'formStih' + state.lenta, elem);
      if (elem) {
        textfragment = state.OriginalTextInput; // переносим текст из первого блока
        const target = elem.TextStih;
        console.log('fragment', textfragment, 'to target', target);
        // elem.TextStih.value = textfragment;
      }

      state.lentacount = state.lenta;
// потом искать будем по номерам строк tableRef.rows[1] с шагом 3 или по новым id (второй способ пригодился для очистки форм)


// заодно перенесём очередной ContainerTemplate из текущей позиции ленты в первый блок вместе с легендой  (если режим ленты)
      if (state.LentaMode.checked) {
        NextID = 'ContainerTemplate' + state.lenta;
        elem = document.getElementById(NextID).innerHTML;
        elem2 = elem.replace(/NextID/g, '');// id-метку надо убрать
        FullContainerTemplate = FullContainerTemplate + elem2 + '<br>';
      }

//--------------------- блоку шаблона присваиваем класс (даже не в режиме ленты)
      NextID = 'ContainerTemplate' + state.lenta;
      elem = document.getElementById(NextID);
      elem.classList.add("ContainerTemplate" + state.lenta);

//--------------------- заодно запомним ритм блока ??? это для кросс-анализа
      console.log("Ritm ================================================================================");
      console.log(state.lenta);
      console.log(state.Ritm);
      console.log(state.CrossRitm);
//--------------------- сформировать массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строФА стиха - одна строка ритма.

      state.CrossLentaRitm[state.lenta] = state.CrossRitm.join(',');
      console.log(state.CrossLentaRitm[state.lenta]);

//формируем массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строка стиха - одна строка ритма.
//считаем количество строк в строфе

      TemplateGlasn2 = state.TemplateGlasn.split("\n");
      kolStrokTemplateGlasn = TemplateGlasn2.length;

//создаём в цикле массив строф-ритмов (по аналогии с шаблоном гласных) одна строка стиха - одна строка ритма. CrossRitmStrofa

      for (let q = 0; q < kolStrokTemplateGlasn; q++) {
        countStrokTemplateGlasn = countStrokTemplateGlasn + 1;
        state.CrossRitmStrofa[countStrokTemplateGlasn] = state.CrossLentaRitm[state.lenta];
      }


//--------------------- заодно запомним шаблон гласных  ??? TemplateGlasn -- CrossTemplateGlasn
      state.CrossTemplateGlasn[state.lenta] = state.TemplateGlasn;
      console.log(state.CrossTemplateGlasn[state.lenta]);
//--------------------- заодно запомним в NewAccentLentaText сам текст стихотворения с расставленными построфно ударениями textfragment
      state.NewAccentLentaText = state.NewAccentLentaText + textfragment;

    }

// КОНЕЦ переноса результатов из первого блока в следующий ----------------------------------------------

  }

// выводим глобальную интегрированную оценку==============================================================================================

  state.ProcentCountSlogSer = Math.round(state.CountSlogSer / state.CountSlog * 100);

// процент серых гласных как сумма серых по фрагментам от отобщего количества гласных (кроме первого фрагмента)
  if (state.GroupStrof.length > 2) {
    state.ProcentCountSlogSer = Math.round(SumSlogSer / state.CountSlog * 100);
  }

  // state.ProcentCountSlogSer = state.ProcentCountSlogSer; // todo - check logic
  rezumeProcentCountSlogSer = "Слабоударных (смешанных) гласных:" + state.ProcentCountSlogSer + "%  ";

  if (state.ProcentCountSlogSer > 40) {
    rezumeProcentCountSlogSer = ' Слишком много слабоударных (смешанных) гласных:<span style="color:#FF0000 ; font-weight: bold;">'
      + state.ProcentCountSlogSer + '%  &nbsp;</span>';
  }

  if (state.ProcentCountSlogSer <= 40) {
    rezumeProcentCountSlogSer = ' Количество слабоударных (смешанных) гласных в норме:<span style="color:#FF0000 ; font-weight: bold;">'
      + state.ProcentCountSlogSer + '%  &nbsp;</span>';
  }


  if (state.CountStrofaRitmEr > 0) {
    flagCountStrofaRitmEr = state.krest + "Сбойных строф:" + state.CountStrofaRitmEr + " ";
  } else {
    flagCountStrofaRitmEr = "";
  }


  if (state.CrossOverMode === 1) {
    state.RifmComment = "";
    state.FlagRifm = "";
    FlagRifm1 = "";
    state.flagCountErrorRifma = 0;
    state.flagErrorRifma = "";
    flagErrorRifma1 = "";
    state.flagRifmBall = 1;
  }
   // в режиме кроссовера рифма не учитывается

  if (state.CrossOverMode === 1 && !state.levelStrok) {
    GlobalResumeCommentMini = state.krest + "Не классическое произведение. Каждая строка в строфе имеет свой ритм. ";
    flagRitm1 = state.krest + "Единого ритма нет! ";
  }


  if (state.levelStrok) {
    GlobalResumeCommentMini = state.galka + "Вы выбрали анализ на уровне отдельных строк. Другие варианты анализа могут дать другие результаты. Не забудьте проверить правильность расстановки ударений.";
    flagRitm1 = "";
  }

  if (state.levelStrof) { // document.getElementById('level-strof').checked
    GlobalResumeCommentMini = state.galka + "Вы выбрали анализ на уровне отдельных строф. Другие варианты анализа могут дать другие результаты. Не забудьте проверить правильность расстановки ударений.";
    flagRitm1 = "";
  }


// if (LentaMode.checked && CrossOverMode==0) {GlobalResumeCommentMini=krest+"Анализ проводился на уровне отдельных строф. Другие варианты анализа могут дать другие результаты."; flagRitm1="";} ;


  if (state.levelStrok) {
    state.ContainerAnaliz1 = "Структурный анализ стихотворения «"
      + state.TitulStihReport
      + "» подготовлен интеллектуальной системой Fet.Online&nbsp; (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Анализ ритма проводился на уровне отдельных строк. Ниже приводится анализ строк, имеющих схожий размер и ритм.";
  }

  if (!state.levelStrok && state.CrossOverMode === 1) {
    state.ContainerAnaliz1 = "Структурный анализ стихотворения «"
      + state.TitulStihReport
      + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Каждая строка в строфе имеет свой ритм, что характерно для неклассических произведений. Ниже приводится анализ строк, имеющих схожий размер и ритм. ";
  }


  if (state.LentaMode.checked && state.CrossOverMode === 0) {
    state.ContainerAnaliz1 = "Структурный анализ стихотворения «"
      + state.TitulStihReport
      + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Не удалось определить единый ритм для всего стихотворения. Ниже приводится анализ каждой строфы по-отдельности. ";
  }

  if (state.levelStrof) { // document.getElementById('level-strof').checked
    state.ContainerAnaliz1 = "Структурный анализ стихотворения «" +
      state.TitulStihReport
      + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Анализ ритма проводился на уровне отдельных строф. Ниже приводится анализ каждой строфы по-отдельности. ";
  }



  if (state.GroupStrof.length > 2) {

    UpFlag1 = flagStrofa1 + flagRitm1 + flagRitmError1 + flagErrorRifma1 + FlagRifm1 + rezumeProcentCountSlogSer + flagCountStrofaRitmEr;
    state.ContainerFlag1 = UpFlag1;
    state.ContainerComment1 = GlobalResumeCommentMini;
    state.ContainerAnaliz1 = state.ContainerAnaliz1 + "<br><br>" + GlobalResumeComment;
    state.ContainerTemplate1 = ""; // если строфы разные, то общий шаблон удаляем alex

  }


//if (FlagStrofaMultiPatternType===1 && !LentaMode.checked) {
  if (state.FlagStrofaMultiPatternType === 1) {

// NoLentaComment=TitleComment+"<br><br>"+razmerComment+CommentGroupStrof+ResumeLentaMode;}
    NoLentaComment = Comment0;

    state.ContainerAnaliz1 = Comment0;
    Comment0 = "";
    state.ContainerAnaliz1 = state.ContainerAnaliz1 + GlobalResumeCommentMini + "<br><br>"
      + state.ResumeLentaMode + "<br><br>";
  }


// выводим в отчёт базовые характеристики стиха====================================================================================================

// 2023 эпиграммы


// if (window.project=='epigramma' && epigramma!=1) {
// state.ClassicBall=0; GlobalClassicBall=0; flagErrorRifma="";
// document.getElementById('ContainerAnaliz1').innerText="В режиме поэтических миниатюр принимаются только четверостишия
// определённого формата!"; document.getElementById('ContainerComment1').innerText="В режиме поэтических миниатюр принимаются
// только четверостишия определённого формата!";
// document.getElementById('ContainerAnaliz1f').innerText="";
// document.getElementById('openrecordstih1').style.display='none';
// }

  if (project !== 'epigramma' && state.epigramma === 1) {
    state.ClassicBall = 0;
    GlobalClassicBall = 0;
    state.flagErrorRifma = "";
    state.GlobalflagStrofaRazbitaMas = 0;
    state.ContainerComment1 = "Редакция альманаха «Венец поэзии» принимает стихи такого размера только в рамках специальных проектов.";
    state.ContainerAnaliz1f = "Редакция альманаха «Венец поэзии» принимает стихи такого размера только в рамках специальных проектов.";
    // document.getElementById('openrecordstih1').style.display = 'none';
  }

  if (project === "epigramma" && state.epigrammatype === "") {
    state.ClassicBall = 0;
    GlobalClassicBall = 0;
    state.flagErrorRifma = "";
    state.ContainerAnaliz1 = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата.  Для просмотра форматов нажмите кнопку «Пример».";
    state.ContainerComment1 = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата. ";
    state.ContainerAnaliz1f = "";
    // document.getElementById('openrecordstih1').style.display = 'none';
  }


  if (GlobalClassicBall === 3 && project !== 'zadanie') {
    // document.getElementById('openrecordstih1').style.display = '';
  }
  if (GlobalClassicBall === 2 && project !== 'zadanie') {
    // document.getElementById('openrecordstih1').style.display = '';
  }
  if (GlobalClassicBall === 3 && project !== 'zadanie') {
    // document.getElementById('openrecordstih2').style.display = '';
    // document.getElementById('TextStih1').readOnly = 'true';
  }
  if (GlobalClassicBall === 2 && project !== 'zadanie') {
    // document.getElementById('openrecordstih2').style.display = '';
    // document.getElementById('TextStih1').readOnly = 'true';
  }

  if (window.type == "noclassic") {
    // document.getElementById('openrecordstih2').style.display = '';
    // document.getElementById('TextStih1').readOnly = 'true';
  }


// анализ вручную -------------------------------------------------------------------------------------------------------------------------
//document.getElementById("FileAccent").checked=true; // галочка - Акценты есть;
  BallClassicManualText = state.BallClassicManual; //"Оценка классики вручную"
  if (BallClassicManualText !== "") {
    GlobalClassicBall = Number(BallClassicManualText);
  }  // если не пустая, тогда вместо автоматической оценки подставляет ручную

// Оценка эксперта за содержание всегда вручную (если не пустая) -------------------------------------------------------------------------------
  let BallContentManualText1 = state.BallContentManual;
  window.BallContentManual = BallContentManualText1;
  if (BallContentManualText1 !== "") {
    BallContentManualText = "\nОценка эксперта за содержание: {" + document.getElementById("BallContentManual").value + "}\n";
  }



// формируем отчёты ----------------------------------------------------------------------------------------


  let tab = String.fromCharCode(9);
  let separ = "\n=\n";

// контакты автора var FIOAuthorReport;var GodAuthorReport;var AdresAuthorReport;var EmailAuthorReport;
  const stihReport = state.stih; // исходный стих
  state.StrofaPatternReport = state.StrofaPatternTypeMas[0]; //размер
  state.RitmReport = state.Ritm.join(); // массив в виде строки
  state.RitmReportInt = state.RitmReport.replace(/,/g, '');
  const ResumeCommentMiniReport = state.ContainerComment1; // резюме
  const ContainerFlag1Report = state.ContainerFlag1; // флаги
  const ContainerAnaliz1Report = state.ContainerAnaliz1; // Полный анализ

// формируем отчёт для сборника стихов с фамилиями, баллами и анализом
  const Report = state.TitulStihReport + tab + state.StrofaPatternReport + tab + state.RitmReport
    + tab + state.flagCountStrofaPatternType + tab
    + state.flagRitmBall
    + tab + state.flagRifmBall + tab + state.UnicStrof
    // + tab + FIOAuthorReport + tab + AdresAuthorReport + tab + EmailAuthorReport
  ;

// формируем отчёт для сборника стихов с фамилиями, баллами без анализа
  const Report2 = state.StrofaPatternReport + separ + state.RitmReport + separ + state.flagCountStrofaPatternType + separ
    + state.flagRitmBall + separ + state.flagRifmBall + separ + state.UnicStrof
    // + separ + FIOAuthorReport + separ + AdresAuthorReport + separ + EmailAuthorReport + separ
  ;

// если запись не отключена - вносим блок во все отчёты ----------------------------------------------------------------------------------------
  let SaveRecord = state.SaveRecord.checked;
  if (SaveRecord) {

// формируем отчёт для сборника стихов с акцентами без анализа ----- lenta


    for (let FragmentN = 1; FragmentN < state.GroupStrof.length; FragmentN++) {
      FragmentReports = FragmentReports + document.getElementById('ContainerAnaliz' + FragmentN).innerText + '\n\n'
        + state.OriginalTextInput + '\n\n';
    }
    FragmentReports = FragmentReports + 'РЕЗЮМЕ:\n' + state.ContainerComment1;

// формируем отчёт по сборнику в виде csv для последующей загрузки в базу
    if (GlobalClassicBall > 1) {
      state.ReportTab = state.ReportTab + "'';'';'" + window.lastnameReport + "';'" + window.firstnameReport + "';'" + window.middlenameReport +
        "';'" + window.regionReport + "';'" + window.sityReport + "';'" + window.phoneReport + "';'" + window.emailReport + "';'" +
        window.rubrikaReport + "';'" + state.TitulStihReport + "';'" + state.OriginalTextInput + "';'" + window.targetReport +
        "';'" + state.flagCountStrofaPatternType + "';'" + state.Strof + "';'" + state.StrofaPatternReport + "';'" + state.RitmReport.replace(/,/g, '') +
        "';'" + state.flagCountRitmError + "';'" + state.flagRitmBall + "';'" + state.flagRifmBall + "';'" + GlobalClassicBall +
        "';'" + state.ProcentCountSlogSer + "';'" + window.BallContentManual + "';'" + window.urlReport + "';'" + window.styleReport +
        "';'" + window.sourceReport + "';'" + window.accordsReport + "'" + "\n";
    }


// сохраняем файл сборника стихов с акцентами без анализа
    state.ReportAccent = state.ReportAccent + state.OriginalTextInput + separ;
// сохраняем файл сборника стихов с акцентами без анализа раздельно, в зависимости от балла-классики (3-классика)
    if (GlobalClassicBall === 0) {
      state.ReportAccentBall0 = state.ReportAccentBall0 + state.OriginalTextInput + BallContentManualText + separ;
    }

    if (GlobalClassicBall === 1) {
      state.ReportAccentBall1 = state.ReportAccentBall1 + state.OriginalTextInput + BallContentManualText + separ;
    }

    if (GlobalClassicBall === 2) {
      state.ReportAccentBall2 = state.ReportAccentBall2 + state.OriginalTextInput + BallContentManualText + separ;
    }

    if (GlobalClassicBall === 3) {
      state.ReportAccentBall3 = state.ReportAccentBall3 + state.OriginalTextInput + BallContentManualText + separ;
    }


// сохраняем файл сборника стихов с акцентами и анализом
    state.ReportMas = state.ReportMas + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";

// сохраняем файл сборника стихов с акцентами и анализом раздельно, в зависимости от балла-классики (3-классика)
    if (GlobalClassicBall === 0) {
      state.ReportMasBall0 = state.ReportMasBall0 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }

    if (GlobalClassicBall === 1) {
      state.ReportMasBall1 = state.ReportMasBall1 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }

    if (GlobalClassicBall === 2) {
      state.ReportMasBall2 = state.ReportMasBall2 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }

    if (GlobalClassicBall === 3) {
      state.ReportMasBall3 = state.ReportMasBall3 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }



//==================================================================================
    state.ContainerAnaliz1f = state.ContainerAnaliz1f
      + '<br>Ещё вы можете:<br><a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(FragmentReports) + '" download="' + document.title + '.txt">Сохранить отчёт в файл</a>';

  } // конец если запись не отключена


// сохранение отчёта в файл // todo -- check state usage in report text
  const reportText = '<div  style="line-height: 2;"><br>Ещё вы можете:<br>' +
    '<a href="https://fet.vpoezii.online/findritm.php?razmer=' + state.StrofaPatternReport + '&ritm=' + state.RitmReportInt
    + '&ritmkontrastplus=' + state.ritmkontrastplus
    + '&ritmkontrastminus=' + state.ritmkontrastminus + '' +
    '"  target="_blank">Найти стихи или песни с аналогичным ритмом и размером</a><br>' +
    `<a href="#" onClick="grekinsert(state); return false;">Узнать греческое название этого размера</a><br>` +
    '<a href="#" onClick="atoprint(\'shema\'); return false;">Напечатать схему ритма стихотворения</a><br>' +
    '<a href="#" onClick="ReadZadanie(state); return false;">Открыть задачник по стихосложению</a><br><br></div>';

  state.ContainerAnaliz1f = state.ContainerAnaliz1f + reportText;

//==================================================================================
// если режим ленты, то перенесём FullContainerTemplate в первый блок и уберём легенду
  if (state.LentaMode.checked && false) { // todo - fix if
    state.ContainerTemplate1 = FullContainerTemplate;

    /*
    // убирем легенду
    elem = document.getElementById('ContainerTemplate1');
    elem.querySelectorAll('.legenda1').forEach(function (a) {
      a.remove()
    })
     */
  // перенесли FullContainerTemplate в первый блок и убрали легенду
  // вернём комментарий по всему стихотворению в первое поле после обработки ленты

    state.ResumeLentaMode = state.krest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. Нет единого ритма для всего стихотворения. Одинаковые по размеру строфы имеют разный ритм. Ниже приводится анализ каждой строфы по отдельности.';

    if (state.CrossOverMode === 1) {
      state.ResumeLentaMode = state.krest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. Нет единого ритма для всего стихотворения. Каждая строка в строфе имеет свой ритм. Обнаружено некоторое повторение ритма только между строфами. Ниже приводится анализ сгруппированных строк, имеющих схожий ритм и размер.';
    }

    if (state.levelStrok) {
      state.ResumeLentaMode = state.krest + "Анализ проводился на уровне отдельных строк. Другие варианты анализа могут дать другие результаты.";
    }

    if (state.levelStrof) { // document.getElementById('level-strof').checked
      state.ResumeLentaMode = state.krest + "Анализ проводился на уровне отдельных строф. Другие варианты анализа могут дать другие результаты.";
    }



    state.ContainerAnaliz1 = NoLentaComment + state.ResumeLentaMode + "<br><br>";

  }

}