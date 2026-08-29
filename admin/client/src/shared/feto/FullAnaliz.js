export function FullAnaliz() {

// удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
  ClearForm2();  // закрываем запись

  CountSlov = 0;
  CountSlog = 0;
  CountStrok = 0;
  CountBukv = 0;
  CountStrofa = 0;

  DelSpace();
  PoiskStrof();
  DelSpace();
  ClearForm2();
  window.Comment0 = "";
//оценки фрагмента
  window.flagStrofaRazbita = 0; // строфа не разбита =0, разбита =1
  window.flagCountStrofaPatternType = 0; // количество типов строф, если 1 - то все строфы одного размера
  window.flagGroupStrofaBall = 0; // количество строф в одной группе
  window.flagRitmBall = 0; // 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  window.flagCountRitmError = 0; // количество сбоев ритма
  window.flagRifmBall = 0; // Рифма точная - flagRifmBall=1
  window.flagCountErrorRifma = 0; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  window.flagAccentBall = 0; // Ударения в словах не расставлены. flagAccentBall=0
  window.ClassicBall = 0; // стихотворение строго классическое ClassicBall=3, если строф больше одной, типов строф<3, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм чёткий, сбоев ритма нет, нерифмованных строк нет
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
  flagStrofaBallMas = [];// количество типов строф, если 1 - то все строфы одного размера
  flagRitmBallMas = [];// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  flagRifmBallMas = [];// Рифма точная - flagRifmBall=1
  flagAccentBallMas = [];// Ударения в словах не расставлены. flagAccentBall=0
  flagStrofaRazbitaMas = [];// строфа не разбита =0, разбита =1
  flagGroupStrofaBallMas = [];// количество строф в одной группе
  flagCountStrofaPatternTypeMas = [];// количество типов строф, если 1 - то все строфы одного размера
  flagCountErrorRifmaMas = []; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  flagCountRitmErrorMas = []; // количество сбоев ритма
  flagProcentCountSlogSerMas = []; // процент серых гласных

//интегральная оценка всех фрагментов
  let GlobalflagStrofaBallMas = 0;// количество типов строф, если 1 - то все строфы одного размера
  GlobalflagRitmBallMas = 3;// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  let GlobalflagRifmBallMas = 1;// Рифма точная - flagRifmBall=1
  GlobalflagAccentBallMas = 0;// Ударения в словах не расставлены. flagAccentBall=0
  GlobalflagStrofaRazbitaMas = 0;// строфа не разбита =0, разбита =1
  let GlobalflagGroupStrofaBallMas = 0;// количество строф в одной группе
  GlobalflagCountStrofaPatternTypeMas = 0;// количество типов строф, если 1 - то все строфы одного размера
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
  window.flagRitmError = "";
  FullRazmerComment = "";
  FlagStrofaMultiPatternType = 0;


  razmerComment = "";
  CommentGroupStrof = "";
  RitmComment = "";
  RifmComment = "";
  ResumeComment = "";
  let flagCountStrofaRitmEr = "";
  ProcentCountSlogSer = 0;
  let rezumeProcentCountSlogSer = "";

  let BallClassicManualText = ""; //"Оценка классики вручную"
  let BallContentManualText = ""; //Оценка содержания вручную


  var tableRef = ''; // находим таблицу
  var row1 = ''; // строка таблицы
  var nextrow = ''; // строка таблицы (клон)
  var nextrow1 = ''; // строка таблицы (клон)
  var row2 = '';
  var nextrow2 = '';
  var row3 = '';
  var nextrow3 = '';
  var elem = "";
  var elem2 = "";
  var NextID = "";
  FullContainerTemplate = "";
  let FragmentReports = "";
  let FragmentN = 0;
  lenta = 1;
  lentacount = 1;
  var elementArray = [];
  CrossLentaRitm = []; // массив базового ритмического рисунка для перекрестных строф (одна строфа-один ритм). После перекрёстного анализа служит восстановлению ритма в востановленных строфах
  CrossTemplateGlasn = []; // массив гласных для перекрестных строф
  let kolStrokTemplateGlasn = 0;
  let countStrokTemplateGlasn = 0;
  let TemplateGlasn2 = [];
  let CrossRitmStr = "";
  NewAccentLentaText = "";

  epigramma = 0;
  epigrammatype = "";


  ResumeLentaMode = "Ниже приводится анализ фрагментов, в которых сгруппированы строфы одного размера.";

  if (LentaMode.checked) {
    ResumeLentaMode = "Группировка одинаковых по размеру строф не дала положительного результата. Ниже приводится анализ отдельных строф.";
  }
  ;

// проверяем чек бокс "не расставлять ударения" - если обрабатываем файл, в котором они уже расставлены
  let FileAccent = document.getElementById("FileAccent").checked;
  if (FileAccent) {
    flagSetAccent = 1
  }
  ;


  if (flagSetAccent === 0) {
    document.getElementById('ContainerComment1').innerHTML = "Расставьте ударения в словах. " + "\n" + "УдарЕния обозначАются заглАвной бУквой. " + "\n" + "Для автоматической расстановки ударений нажмите кнопку [Анализ стихотворения]. ";
    ResumeComment = "";
    return;
  }

// Заголовок =========================================
  stih = document.formStih1.TextStih.value + "\n";
  stihMas = stih.split("\n");


  TitulStih = stihMas[0];
  TitulStih = TitulStih.toUpperCase();
  TitulStih = TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";    // удалить знаки препинания в конце строки заголовка

  disclamer = '<a href="https://vpoezii.online" target="_blank" style="text-decoration: none; color: #0d6f9c; alink: #aaaaaa; vlink: #aaaaaa; link: #aaaaaa;">* Мнение редакции альманаха «Венец поэзии» может отличаться от выводов интеллектуальной системы. Содержание текста требует отдельного анализа. Не забудьте проверить правильность расстановки ударений</a>.';

  let TitleComment = 'Структурный анализ стихотворения «' + TitulStih + '» подготовлен* интеллектуальной системой Fet.Online&nbsp;<a href="https://vpoezii.online/document/4502/" target="_blank" style="text-decoration: none; color: #0d6f9c!important;  alink: #aaaaaa!important; vlink: #aaaaaa!important; link: #aaaaaa!important;">&nbsp;(свидетельство Роспатента от 22.03.2021 №2021614295)</a>.';
  document.title = 'Анализ стихотворения «' + TitulStih + '»';

// НАЧАЛО АНАЛИЗА =========================================


// Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
  AnalizRazmera();
// if (window.flagStrofaRazbita===0 && !LentaMode.checked) {document.getElementById('ContainerComment1').innerHTML ="Стихотворение не разбито на строфы. Нужно добавить пустую строку между строфами. "; document.getElementById('ContainerFlag1').innerHTML=krest+"Разбейте на строфы. "; document.getElementById('level-full').checked=true; epigramma=1;};

  if (window.flagStrofaRazbita === 0 && !LentaMode.checked) {
    document.getElementById('ContainerComment1').innerHTML = "Стихотворение не разбито на строфы. Нужно добавить пустую строку между строфами. ";
    document.getElementById('ContainerFlag1').innerHTML = krest + "Разбейте на строфы. ";
    document.getElementById('level-full').checked = true;
  }
  ;


  if (LentaMode.checked) {
    LentaPoiskStrof();
  }

  if (!LentaMode.checked) {
    AnalizGroupStrof();
    CreateGroupStrof();
  }

//если строфы разные, то добавляем исходный стих к массиву групп строф и делаем анализ отдельных групп строф
  if (GroupStrof.length > 1) {
    GroupStrof.unshift(stih);
  }

  if (UnicStrof === 1) {
    FullRazmerComment = FullRazmerComment + ' Только одна строфа по размеру не согласована с другими строфами. ';
  }
  ;

  if (UnicStrof === 2 || UnicStrof === 3 || UnicStrof === 4) {
    FullRazmerComment = FullRazmerComment + UnicStrof + ' строфы по размеру вообще не согласованы с другими строфами, то есть они все написаны «вразнобой». Создаётся впечатление, что произведение состоит из фрагментов нескольких стихотворений, написанных в разное время и по разным поводам. ';
  }
  ;

  if (UnicStrof > 4) {
    FullRazmerComment = FullRazmerComment + UnicStrof + ' строф имеют каждая свой размер, то есть они все написаны совершенно «вразнобой». Создаётся впечатление, что произведение состоит из фрагментов нескольких стихотворений, написанных в разное время и по разным поводам. ';
  }
  ;


  if (GroupStrof.length > 2) {
    window.Comment0 = TitleComment + "<br><br>" + FullRazmerComment + '<br><br>';
  }
  ;


  for (let FragmentNumber = GroupStrof.length - 1; FragmentNumber >= 0; FragmentNumber--) {

    FragmentResumeCommentStrofaRazbita = "";
    FragmentResumeCommentCountStrofaPatternType = "";
    FragmentResumeCommentRitmBall = "";
    FragmentResumeCommentCountRitmError = "";
    FragmentResumeCommentCountErrorRifma = "";


    document.formStih1.TextStih.value = GroupStrof[FragmentNumber];
    DelSpace();
    console.log("StrofaRepeatTypeMas[FragmentNumber]");
    console.log(StrofaRepeatTypeMas[FragmentNumber]);
    console.log("AnalizRazmera");
    AnalizRazmera();
    console.log("CreateTemplateAccent");
    // Создаём шаблон ударений. Выбираем гласные, заменяем маркерами ударений О:. и записываем шаблон в переменную TemplateAccent. Заодно создаём массив номеров гласных в словах - TemplateNumGlas.
    CreateTemplateAccent();

    console.log("AnalizRifm(1)");
    // Ищем рифмы - последние ударные гласные. Заменяем на фонетические аналоги. Заодно записываем рифмующиеся слова в массив. Ёфицируем рифмующееся слово. Если ёфикация была лишней, то не учитываем ёфикацию.
    AnalizRifm(1);
    if (!FileAccent) {
      console.log("ReversAccent()");
      // Находим неразмеченные слова и размечаем по шаблону Ritm[]. Если не помогло, то предлагаем несколько ударений на выбор.
      ReversAccent();
    }
    console.log("AnalizRazmera()");
    // Создаём массив гласных. Заодно создаём массив позиций пробелов, чтобы соотносить гласную с конкретным словом. Выявляем уникальные и повторяющиеся типы строф.
    AnalizRazmera();
    console.log("CreateTemplateAccent()");
    // Создаём шаблон ударений. Выбираем гласные, заменяем маркерами ударений О:. и записываем шаблон в переменную TemplateAccent. Заодно создаём массив номеров гласных в словах - TemplateNumGlas.
    CreateTemplateAccent();
    console.log("AnalizRifm(2)");
    // Ищем рифмы - последние ударные гласные. Заменяем на фонетические аналоги. Заодно записываем рифмующиеся слова в массив. Ёфицируем рифмующееся слово. Если ёфикация была лишней, то не учитываем ёфикацию.
    AnalizRifm(2);

    if (!FileAccent) {
      console.log("ReversAccent() -2");
      // Находим неразмеченные слова и размечаем по шаблону Ritm[]. Если не помогло, то предлагаем несколько ударений на выбор.
      ReversAccent();
    }

    DelSpace();

// Здесь мы имеем массив гласных, размер строфы, шаблон ударений стиха или фрагмента стиха --------------------------------------------------------------
// пробуем формировать перекрёстные строфы
// ======================================================================================================================================================

// Заголовок фрагмента стиха --------------------------------------------------------------
    if (GroupStrof.length > 2) {
      fragment = "фрагмента стихотворения";
    } else {
      fragment = "стихотворения";
    }
    ;
    let NextStih = document.formStih1.TextStih.value + "\n";
    let NextStihMas = NextStih.split("\n");
    let TitulStih = NextStihMas[0];
    TitulStih = TitulStih.toUpperCase();
    TitulStih = TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";    // удалить знаки препинания в конце строки заголовка
    let TitleComment = 'Структурный анализ ' + fragment + ' «' + TitulStih + '» подготовлен* интеллектуальной системой Fet.Online' + '<a href="https://vpoezii.online/document/4502/" target="_blank" style="text-decoration: none; color: #0d6f9c!important; ; alink: #aaaaaa!important; ; vlink: #aaaaaa!important; ; link: #aaaaaa!important; ;">&nbsp;(свидетельство Роспатента от 22.03.2021 №2021614295)</a>.';
    document.title = 'Анализ стихотворения «' + TitulStih + '»';
    TitulStihReport = TitulStih; //заголовок
// установка флагов -----------------------------------------------------------------------

// ---уточнение процента серых гласных и балла за ритм -------------------------
    if (CountStrofaRitmEr > 0) {
      flagCountStrofaRitmEr = krest + "Сбойных строф:" + CountStrofaRitmEr + " ";
    } else {
      flagCountStrofaRitmEr = "";
    }
    ;
    ProcentCountSlogSer = Math.round(CountSlogSer / CountSlog * 100);
// сумма серых гласных по фрагментам -------------------------

    if (FragmentNumber > 0 || GroupStrof.length === 1) {
      SumSlogSer = SumSlogSer + LentaCountSlogSer
    }
    ;


//rezumeProcentCountSlogSer=" Слабоударных (смешанных) гласных:"+ProcentCountSlogSer+"%  ";
    if (ProcentCountSlogSer > 40) {
      rezumeProcentCountSlogSer = ' Слишком много слабоударных (смешанных) гласных:<span style="color:#FF0000 ; font-weight: bold;">' + ProcentCountSlogSer + '%  &nbsp;</span>';
    }
    ;
    if (ProcentCountSlogSer <= 40) {
      rezumeProcentCountSlogSer = ' Количество слабоударных (смешанных) гласных в норме:' + ProcentCountSlogSer + '%  &nbsp;</span>';
    }
    ;


// ---уточнение процента серых гласных и балла за ритм -------------------------

    if (CrossOverMode == 1) {
      RifmComment = "";
      FlagRifm = "";
      FlagRifm1 = "";
      flagCountErrorRifma = 0;
      flagErrorRifma = "";
      flagErrorRifma1 = "";
      flagRifmBall = 1;
    }
    ; // в режиме кроссовера рифма не учитывается

    let UpFlag = flagStrofa + flagRazmer + flagAccent + flagRitm + flagErrorRitm + window.flagRitmError + FlagRifm + rezumeProcentCountSlogSer + flagCountStrofaRitmEr;
    document.getElementById('ContainerFlag1').innerHTML = UpFlag;
    if (flagAccent.length > 0) {
      ResumeComment = "";
    }
    ;

// window.ClassicBall=window.flagCountStrofaPatternType+window.flagRitmBall+window.flagRifmBall;
    flagAccentBall = 1;
    if (GroupStrof.length === 1) {
      flagGroupStrofaBall = Strof
    }
    ;

// проверка критериев  ФРАГМЕНТОВ стихотворения (FragmentNumber=1,2,3)

    if (LentaMode.checked) {
      UnicStrof = 0;
      window.flagStrofaRazbita = 1;
      window.flagGroupStrofaBall = 2;
      window.flagCountStrofaPatternType = 0;
      flagStrofa = "";
    } // если ленточный режим, то анализируем каждую строфу - ошибки за разбивку строф не начисляем


    if (FragmentNumber > 0 || GroupStrof.length === 1) {
// проверка критериев ФрАГМЕНТА стихотворения не совсем классического

      if (ProcentCountSlogSer < 50) {
        if (UnicStrof < 3) {
          if (window.flagStrofaRazbita > 0) {
            if (window.flagAccentBall > 0) {
              if (window.flagGroupStrofaBall > 1) {
                if (window.flagCountStrofaPatternType < 4) {
                  if (window.flagRitmBall > 0) {
                    if (window.flagCountRitmError < 5) {
                      if (window.flagCountErrorRifma < 5) {
                        window.ClassicBall = 1;
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
      if (ProcentCountSlogSer < 40) {
        if (UnicStrof < 2) {
          if (window.flagStrofaRazbita > 0) {
            if (window.flagAccentBall > 0) {
              if (window.flagGroupStrofaBall > 1) {
                if (window.flagCountStrofaPatternType < 4) {
                  if (window.flagRitmBall > 1) {
                    if (window.flagCountRitmError < 2) {
                      if (window.flagCountErrorRifma < 2) {
                        window.ClassicBall = 2;
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
      if (ProcentCountSlogSer < 30) {
        if (UnicStrof === 0) {
          if (window.flagStrofaRazbita > 0) {
            if (window.flagAccentBall > 0) {
              if (window.flagGroupStrofaBall > 1) {
                if (window.flagCountStrofaPatternType < 3) {
                  if (window.flagRitmBall === 3) {
                    if (window.flagCountRitmError === 0) {
                      if (window.flagCountErrorRifma === 0) {
                        window.ClassicBall = 3;
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

      if (window.flagStrofaRazbita === 0) {
        FragmentResumeCommentStrofaRazbita = "строфы не разбиты, "
      }
      if (window.flagCountStrofaPatternType > 2) {
        FragmentResumeCommentCountStrofaPatternType = "несогласованность строф по размеру, ";
      }
      if (window.flagRitmBall < 2) {
        FragmentResumeCommentRitmBall = "отсутствие чёткого ритма, ";
      }
      if (ProcentCountSlogSer > 40) {
        FragmentResumeCommentSlogSer = "смешение ударных гласных с безударными, ";
      }
      if (window.flagCountRitmError > 0) {
        FragmentResumeCommentCountRitmError = "сбои ритма, ";
      }
      if (window.flagCountErrorRifma > 0) {
        FragmentResumeCommentCountErrorRifma = "отсутствие рифмы,";
      }

      FragmentResumeComment = FragmentResumeCommentCountStrofaPatternType + FragmentResumeCommentRitmBall + FragmentResumeCommentSlogSer + FragmentResumeCommentCountRitmError + FragmentResumeCommentCountErrorRifma;


// ================================================================

      flagStrofaRazbitaMas[FragmentNumber] = window.flagStrofaRazbita; // строфа не разбита =0, разбита =1
      flagAccentBallMas[FragmentNumber] = window.flagAccentBall; // Ударения в словах не расставлены. flagAccentBall=0
      flagGroupStrofaBallMas[FragmentNumber] = window.flagGroupStrofaBall; // количество строф в одной группе
      flagCountStrofaPatternTypeMas[FragmentNumber] = window.flagCountStrofaPatternType; // количество типов строф, если 1 - то все строфы одного размера
      flagCountRitmErrorMas[FragmentNumber] = window.flagCountRitmError; // количество сбоев ритма
      flagCountErrorRifmaMas[FragmentNumber] = window.flagCountErrorRifma; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)

      flagProcentCountSlogSerMas[FragmentNumber] = window.flagProcentCountSlogSer; // процент серых гласных

      flagRitmBallMas[FragmentNumber] = window.flagRitmBall;// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
      flagRifmBallMas[FragmentNumber] = window.flagRifmBall;// Рифма точная - flagRifmBall=1 (реально используется количество нерифмованных строк)
      ClassicBallMas[FragmentNumber] = window.ClassicBall;


//интегральная оценка всех фрагментов - ищем максимумы (минимумы)
      if (flagStrofaRazbitaMas[FragmentNumber] > GlobalflagStrofaRazbitaMas) {
        GlobalflagStrofaRazbitaMas = flagStrofaRazbitaMas[FragmentNumber]
      }
      ;// строфа не разбита =0, разбита =1
      if (flagAccentBallMas[FragmentNumber] > GlobalflagAccentBallMas) {
        GlobalflagAccentBallMas = flagAccentBallMas[FragmentNumber]
      }
      ;// Ударения в словах не расставлены. flagAccentBall=0
      if (flagGroupStrofaBallMas[FragmentNumber] < GlobalflagGroupStrofaBallMas) {
        GlobalflagGroupStrofaBallMas = flagGroupStrofaBallMas[FragmentNumber]
      }
      ;// количество строф в одной группе (минимум)
      if (flagCountStrofaPatternTypeMas[FragmentNumber] > GlobalflagCountStrofaPatternTypeMas) {
        GlobalflagCountStrofaPatternTypeMas = flagCountStrofaPatternTypeMas[FragmentNumber]
      }
      ;// количество типов строф, если 1 - то все строфы одного размера
      if (flagRitmBallMas[FragmentNumber] < GlobalflagRitmBallMas) {
        GlobalflagRitmBallMas = flagRitmBallMas[FragmentNumber]
      }
      ;// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий. (ищем худший) базовый =3
      if (flagRifmBallMas[FragmentNumber] > GlobalflagRifmBallMas) {
        GlobalflagRifmBallMas = flagRifmBallMas[FragmentNumber]
      }
      ;// Рифма точная - flagRifmBall=1 (ищем худший)
      GlobalflagCountRitmErrorMas = GlobalflagCountRitmErrorMas + flagCountRitmErrorMas[FragmentNumber];// количество сбоев ритма (сумма)
      GlobalflagCountErrorRifmaMas = GlobalflagCountErrorRifmaMas + flagCountErrorRifmaMas[FragmentNumber];// количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара) -сумма
      if (flagStrofaBallMas[FragmentNumber] < GlobalflagStrofaBallMas) {
        GlobalflagStrofaBallMas = flagStrofaBallMas[FragmentNumber]
      }
      ;// количество типов строф (в группе), если 1 - то все строфы одного размера

// надо добавить вычисление максимального количества серых гласных
      if (flagProcentCountSlogSerMas[FragmentNumber] > GlobalflagProcentCountSlogSer) {
        GlobalflagProcentCountSlogSer = flagProcentCountSlogSerMas[FragmentNumber]
      }
      ;// процент серых гласных - ищем максимум

//======================================================================

// завершение проверки критериев  ФРАГМЕНТОВ стихотворения (FragmentNumber=1,2,3)
    }

// интегральная оценка ВСЕГО СТИХОТВОРЕНИЯ - сумма фрагментов (переменные Global вычисляются по массивам)
    if (FragmentNumber === 0) {

// проверка критериев не совсем классического ВСЕГО СТИХОТВОРЕНИЯ

      if (GlobalflagProcentCountSlogSer < 50) {
        if (UnicStrof < 3) {
          if (GlobalflagStrofaRazbitaMas > 0) {
            if (GlobalflagAccentBallMas > 0) {
              if (GlobalflagCountStrofaPatternTypeMas < 4) {
                if (GlobalflagRitmBallMas > 0) {
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
        if (UnicStrof < 2) {
          if (GlobalflagStrofaRazbitaMas > 0) {
            if (GlobalflagAccentBallMas > 0) {
              if (GlobalflagCountStrofaPatternTypeMas < 4) {
                if (GlobalflagRitmBallMas > 1) {
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
        if (UnicStrof === 0) {
          if (GlobalflagStrofaRazbitaMas > 0) {
            if (GlobalflagAccentBallMas > 0) {
              if (GlobalflagCountStrofaPatternTypeMas < 3) {
                if (GlobalflagRitmBallMas === 3) {
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

      if (LentaMode.checked) {
        GlobalClassicBall = 0
      }
      ; // в режиме ленты - только неклассические


// комментарии в кроссрежиме не нужны alex
      if (CrossOverMode == 0 && !document.getElementById('level-strok').checked) {


// обратное восстановление комментариев СТРОФА-ТИП для глобальной оценки

        if (GlobalflagCountStrofaPatternTypeMas === 1) {
          ResumeStrofaPatternType = "Все строфы имеют регулярный размер. ";
          flagStrofa1 = galka + "Размер регулярный!  ";
        }
        if (GlobalflagCountStrofaPatternTypeMas === 2) {
          ResumeStrofaPatternType = "Обнаружено 2 разных типа строф. Такое строение иногда используется в классических стихотворениях, но чаще всего в песнях с куплетами и припевами. ";
          flagStrofa1 = "* Два разных типа строфы! ";
        }
        if (GlobalflagCountStrofaPatternTypeMas === 3) {
          ResumeStrofaPatternType = "Обнаружено 3 разных типа строф. Такое строение редко используется в классических стихотворениях. ";
          flagStrofa1 = "* Три разных типа строфы! ";
        }
        if (GlobalflagCountStrofaPatternTypeMas === 4) {
          ResumeStrofaPatternType = "Обнаружено 4 разных типа строф с размерами. Такая несогласованность размеров не характерна для классических стихотворений. ";
          flagStrofa1 = krest + "Строфы не имеют регулярного размера! ";
          GlobalResumeCommentCountStrofaPatternTypeMas0 = "несогласованность размеров,";
        }
        if (GlobalflagCountStrofaPatternTypeMas > 4) {
          ResumeStrofaPatternType = "Обнаружено " + GlobalflagCountStrofaPatternTypeMas + " разных типов строф. Такая несогласованность размеров не характерна для классических стихотворений. ";
          flagStrofa1 = krest + "Строфы не имеют регулярного размера! ";
          GlobalResumeCommentCountStrofaPatternTypeMas0 = "несогласованность размеров,";
        }

// обратное восстановление комментариев СТРОФА для глобальной оценки


// обратное восстановление комментариев РИТМ для глобальной оценки
        if (GlobalflagRitmBallMas === 0) {
          window.CommentStopa = "В тексте не обнаружен ритм. ";
          flagRitm1 = krest + "Ритм не найден! ";
          GlobalResumeCommentRitmBallMas0 = "разнобой в ритме,";
        }
        if (GlobalflagRitmBallMas === 1) {
          window.CommentStopa = "Текст имеет слабые признаки ритма. ";
          flagRitm1 = galka + "Ритм слабый! ";
        }
        if (GlobalflagRitmBallMas === 2) {
          window.CommentStopa = "Строфы имеют явный ритмический рисунок, повторяющийся в каждой строке. ";
          flagRitm1 = galka + "Ритм явный! ";
        }
        if (GlobalflagRitmBallMas === 3) {
          window.CommentStopa = "Строфы имеют очень чёткий ритмический рисунок, повторяющийся в каждой строке. ";
          flagRitm1 = galka + "Ритм чёткий! ";
        }


// обратное восстановление комментариев РИТМ-СБОИ для глобальной оценки
        if (GlobalflagCountRitmErrorMas > 0) {
          flagRitmError1 = krest + "Есть сбои ритма: " + GlobalflagCountRitmErrorMas + ". ";
          GlobalResumeCommentRitmErrorMas0 = "отдельные сбои ритма,";
        } else {
          flagRitmError1 = "";
        }

// обратное восстановление комментариев РИФМА для глобальной оценки

        if (GlobalflagCountErrorRifmaMas > 0) {
          flagErrorRifma1 = krest + "Есть сбои рифмы: " + GlobalflagCountErrorRifmaMas + ". ";
          FlagRifm1 = "";
          GlobalResumeCommentCountErrorRifmaMas0 = "отсутствие рифмы в некоторых строках,";
        }
        if (GlobalflagCountErrorRifmaMas === 0) {
          FlagRifm1 = galka + "Рифма точная! ";
          flagErrorRifma1 = "";
        }


        if (GlobalClassicBall === 3) {
          GlobalResumeComment = 'Cтруктура ' + fragment + ' вполне соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = greengalka + 'Структура стихотворения вполне соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }


        if (GlobalClassicBall === 2) {
          GlobalResumeComment = 'В целом, структура ' + fragment + ' практически соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = greengalka + ' Структура стихотворения практически соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }

        if (GlobalClassicBall === 1) {
          GlobalResumeComment = 'В целом, структура ' + fragment + ' не совсем классическая. Некоторая доработка ' + fragment + ' позволит повысить лёгкость его чтения и запоминания. А ритмически согласованные строки можно попробовать положить на музыку. ' + '<br><br>';
          GlobalResumeCommentMini = redkrest + ' Структура стихотворения не совсем классическая. ' + mobilenavigator;
        }


        if (GlobalClassicBall === 0 && epigramma != 1) {
          ResumeComment = 'В целом, структура «произведения» не соответствует канонам русского классического стихосложения. Автор допустил ' + GlobalResumeCommentRitmBallMas0 + GlobalResumeCommentRitmErrorMas0 + GlobalResumeCommentCountErrorRifmaMas0 + GlobalResumeCommentCountStrofaPatternTypeMas0 + ' что в результате усложняет задачу читателям, затрудняет восприятие содержания, негативно отражается на запоминании. А попытка положить такие слова на музыку, наверняка приведёт к искажению естественных ударений в словах. ' + '<br><br>';
          GlobalResumeCommentMini = redkrest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. ' + mobilenavigator;
        }

        if (GlobalflagStrofaRazbitaMas === 0 && !LentaMode.checked) {
          ResumeComment = 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br><br>';
          GlobalResumeCommentMini = krest + 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br><br>';
        }


      }
// завершение глобальной оценки ===============================================================================================================
    }
    ;


    if (window.ClassicBall === 3) {
      ResumeComment = 'Cтруктура ' + fragment + ' вполне соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
      ResumeCommentMini = greengalka + ' Структура ' + fragment + ' вполне соответствует стандартам русского классического стихосложения. ';
    }


    if (window.ClassicBall === 2) {
      ResumeComment = 'В целом, структура ' + fragment + ' практически соответствует канонам русского классического стихосложения. Такая форма ' + fragment + ' сравнительно легко читается и быстро запоминается. А ритмически согласованные строки естественным образом ложатся на музыку. ' + '<br><br>';
      ResumeCommentMini = greengalka + ' Структура ' + fragment + ' практически соответствует стандартам русского классического стихосложения. ';
    }

    if (window.ClassicBall === 1) {
      ResumeComment = 'В целом, структура ' + fragment + ' не совсем классическая. Некоторая доработка ' + fragment + ' позволит повысить лёгкость его чтения и запоминания. А ритмически согласованные строки можно попробовать положить на музыку. <br><br>Только после этого можно рассматривать возможность публикации стихотворения в альманахе «Венец поэзии». ' + '<br><br>';
      ResumeCommentMini = redkrest + ' Структура ' + fragment + ' не совсем классическая. ';
    }

    if (window.ClassicBall === 0 && epigramma != 1) {
      ResumeComment = 'В целом, структура «произведения» не соответствует канонам русского классического стихосложения. Автор допустил ' + FragmentResumeComment + ' что усложняет задачу читателю, затрудняет ему восприятие содержания. Такой текст труднее запомнить и воспроизвести. А попытка положить такие слова на музыку, наверняка приведёт к искажению естественных ударений в словах. <br><br>Такие произведения не подлежат  публикации в  альманахе «Венец поэзии». ' + '<br><br>';
      ResumeCommentMini = redkrest + ' Структура ' + fragment + ' не соответствует стандартам русского классического стихосложения. ';
    }

    if (GlobalflagStrofaRazbitaMas === 0 && !LentaMode.checked) {
      ResumeComment = 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br>';
      ResumeCommentMini = krest + 'Одной строфы недостаточно, чтобы считать данный текст стихотворением. ' + '<br>';
    }


    document.getElementById('ContainerAnaliz1').innerHTML = TitleComment + "<br><br>" + razmerComment + CommentGroupStrof + RitmComment + RifmComment + ResumeComment;


// запомним комментарий по всему стихотворению, чтобы вернуть его после обработки ленты

//		if (fragment=="стихотворения") {NoLentaComment=TitleComment+"<br><br>"+razmerComment+CommentGroupStrof+ResumeLentaMode;}

    document.getElementById('ContainerComment1').innerHTML = ResumeCommentMini;

    if (LentaMode.checked || CrossOverMode == 1) {
      disclamer = ""
    }
    ; // в режиме ленты или кроссовера без дисклеймера

    document.getElementById('ContainerAnaliz1f').innerHTML = disclamer;


    // если текст короткий - заменить на пустой и очистить комментарии ???
    let nexttext = document.formStih1.TextStih.value;
    GroupStrofMas = nexttext.split("\n");
    if (GroupStrofMas.length < 4 && CrossOverMode == 0) {
      document.formStih1.TextStih.value = "";
      document.getElementById('ContainerComment1').innerHTML = "";
      document.getElementById('ContainerFlag1').innerHTML = "";
      document.getElementById('ContainerAnaliz1').innerHTML = "";
      document.getElementById('ContainerTemplate1').innerHTML = "";
      console.log("CrossOverMode=0");
    }
    ;


// переносим результаты из первого блока в следующий (клонируем первую вторую и далее строку в конец таблицы)  --------lenta-------------------------------------
    TextStihResize();

    if (GroupStrof.length > 1 && FragmentNumber > 0) {

      lenta = lenta + 1;

      tableRef = document.getElementById('global-table1'); // находим таблицу
      row1 = tableRef.rows[0]; //0 строка - это флаг
      row2 = tableRef.rows[1]; //1 строка - это комментарий
      row3 = tableRef.rows[2]; //2 строка - это стих

      nextrow1 = row1.cloneNode(true); // клонируем
      nextrow = tableRef.appendChild(nextrow1); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerFlag1/g, 'ContainerFlag' + lenta); // id-метку надо переименовать (извлекаем html, делаем текстовую замену и возвращаем)
      nextrow.innerHTML = elem;
      nextrow1.innerHTML = elem;
      nextrow1.id = 'lenta1-' + lenta;  // новое имя всему блоку

      nextrow2 = row2.cloneNode(true); // клонируем
      nextrow = tableRef.appendChild(nextrow2); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerComment1/g, 'ContainerComment' + lenta); // id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow2.innerHTML = elem;
      nextrow2.id = 'lenta2-' + lenta;

      nextrow3 = row3.cloneNode(true); // клонируем, в этом блоке три id-метки, их надо переименовать
      nextrow = tableRef.appendChild(nextrow3); // добавляем в конец таблицы
      nextrow.classList.add("lenta");

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerTemplate1/g, 'ContainerTemplate' + lenta);// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;
      nextrow3.id = 'lenta3-' + lenta;


      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerAnaliz1/g, 'ContainerAnaliz' + lenta);// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = nextrow.innerHTML;
      elem = elem.replace(/ContainerAnaliz1f/g, 'ContainerAnaliz' + lenta + 'f');// id-метку надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

// тест переносим последним =============

      elem = nextrow.innerHTML;
      elem = elem.replace(/formStih1/g, 'formStih' + lenta);// name-метку  надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = nextrow.innerHTML;
      elem = elem.replace(/TextStih1/g, 'TextStih' + lenta);// name-метку  надо переименовать
      nextrow.innerHTML = elem;
      nextrow3.innerHTML = elem;

      elem = document.getElementsByName('formStih' + lenta)[0];// ищем name-метку
      textfragment = document.formStih1.TextStih.value; // переносим текст из первого блока
      elem.TextStih.value = textfragment;

      lentacount = lenta;
// потом искать будем по номерам строк tableRef.rows[1] с шагом 3 или по новым id (второй способ пригодился для очистки форм)


// заодно перенесём очередной ContainerTemplate из текущей позиции ленты в первый блок вместе с легендой  (если режим ленты)
      if (LentaMode.checked) {
        NextID = 'ContainerTemplate' + lenta;
        elem = document.getElementById(NextID).innerHTML;
        elem2 = elem.replace(/NextID/g, '');// id-метку надо убрать
        FullContainerTemplate = FullContainerTemplate + elem2 + '<br>';
      }

//--------------------- блоку шаблона присваиваем класс (даже не в режиме ленты)
      NextID = 'ContainerTemplate' + lenta;
      elem = document.getElementById(NextID);
      elem.classList.add("ContainerTemplate" + lenta);

//--------------------- заодно запомним ритм блока ??? это для кросс-анализа
      console.log("Ritm ================================================================================");
      console.log(lenta);
      console.log(Ritm);
      console.log(CrossRitm);
//--------------------- сформировать массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строФА стиха - одна строка ритма.

      CrossLentaRitm[lenta] = CrossRitm.join(',');
      console.log(CrossLentaRitm[lenta]);

//формируем массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строка стиха - одна строка ритма.
//считаем количество строк в строфе

      TemplateGlasn2 = TemplateGlasn.split("\n");
      kolStrokTemplateGlasn = TemplateGlasn2.length;

//создаём в цикле массив строф-ритмов (по аналогии с шаблоном гласных) одна строка стиха - одна строка ритма. CrossRitmStrofa

      for (let q = 0; q < kolStrokTemplateGlasn; q++) {
        countStrokTemplateGlasn = countStrokTemplateGlasn + 1;
        CrossRitmStrofa[countStrokTemplateGlasn] = CrossLentaRitm[lenta];
      }


//--------------------- заодно запомним шаблон гласных  ??? TemplateGlasn -- CrossTemplateGlasn
      CrossTemplateGlasn[lenta] = TemplateGlasn;
      console.log(CrossTemplateGlasn[lenta]);
//--------------------- заодно запомним в NewAccentLentaText сам текст стихотворения с расставленными построфно ударениями textfragment
      NewAccentLentaText = NewAccentLentaText + textfragment;

    }

// КОНЕЦ переноса результатов из первого блока в следующий ----------------------------------------------

  }

// выводим глобальную интегрированную оценку==============================================================================================

  ProcentCountSlogSer = Math.round(CountSlogSer / CountSlog * 100);

// процент серых гласных как сумма серых по фрагментам от отобщего количества гласных (кроме первого фрагмента)
  if (GroupStrof.length > 2) {
    ProcentCountSlogSer = Math.round(SumSlogSer / CountSlog * 100);
  }

  window.ProcentCountSlogSer = ProcentCountSlogSer;
  rezumeProcentCountSlogSer = "Слабоударных (смешанных) гласных:" + ProcentCountSlogSer + "%  ";

  if (ProcentCountSlogSer > 40) {
    rezumeProcentCountSlogSer = ' Слишком много слабоударных (смешанных) гласных:<span style="color:#FF0000 ; font-weight: bold;">' + ProcentCountSlogSer + '%  &nbsp;</span>';
  }
  ;
  if (ProcentCountSlogSer <= 40) {
    rezumeProcentCountSlogSer = ' Количество слабоударных (смешанных) гласных в норме:<span style="color:#FF0000 ; font-weight: bold;">' + ProcentCountSlogSer + '%  &nbsp;</span>';
  }
  ;

  if (CountStrofaRitmEr > 0) {
    flagCountStrofaRitmEr = krest + "Сбойных строф:" + CountStrofaRitmEr + " ";
  } else {
    flagCountStrofaRitmEr = "";
  }
  ;


  if (CrossOverMode == 1) {
    RifmComment = "";
    FlagRifm = "";
    FlagRifm1 = "";
    flagCountErrorRifma = 0;
    flagErrorRifma = "";
    flagErrorRifma1 = "";
    flagRifmBall = 1;
  }
  ; // в режиме кроссовера рифма не учитывается

  if (CrossOverMode == 1 && !document.getElementById('level-strok').checked) {
    GlobalResumeCommentMini = krest + "Не классическое произведение. Каждая строка в строфе имеет свой ритм. ";
    flagRitm1 = krest + "Единого ритма нет! ";
  }
  ;

  if (document.getElementById('level-strok').checked) {
    GlobalResumeCommentMini = galka + "Вы выбрали анализ на уровне отдельных строк. Другие варианты анализа могут дать другие результаты. Не забудьте проверить правильность расстановки ударений.";
    flagRitm1 = "";
  }
  ;
  if (document.getElementById('level-strof').checked) {
    GlobalResumeCommentMini = galka + "Вы выбрали анализ на уровне отдельных строф. Другие варианты анализа могут дать другие результаты. Не забудьте проверить правильность расстановки ударений.";
    flagRitm1 = "";
  }
  ;

// if (LentaMode.checked && CrossOverMode==0) {GlobalResumeCommentMini=krest+"Анализ проводился на уровне отдельных строф. Другие варианты анализа могут дать другие результаты."; flagRitm1="";} ;


  if (document.getElementById('level-strok').checked) {
    document.getElementById('ContainerAnaliz1').innerHTML = "Структурный анализ стихотворения «" + TitulStihReport + "» подготовлен интеллектуальной системой Fet.Online&nbsp; (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Анализ ритма проводился на уровне отдельных строк. Ниже приводится анализ строк, имеющих схожий размер и ритм.";
  }
  ;
  if (!document.getElementById('level-strok').checked && CrossOverMode == 1) {
    document.getElementById('ContainerAnaliz1').innerHTML = "Структурный анализ стихотворения «" + TitulStihReport + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Каждая строка в строфе имеет свой ритм, что характерно для неклассических произведений. Ниже приводится анализ строк, имеющих схожий размер и ритм. ";
  }
  ;

  if (LentaMode.checked && CrossOverMode == 0) {
    document.getElementById('ContainerAnaliz1').innerHTML = "Структурный анализ стихотворения «" + TitulStihReport + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Не удалось определить единый ритм для всего стихотворения. Ниже приводится анализ каждой строфы по-отдельности. ";
  }
  ;
  if (document.getElementById('level-strof').checked) {
    document.getElementById('ContainerAnaliz1').innerHTML = "Структурный анализ стихотворения «" + TitulStihReport + "» подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295).<br><br>Анализ ритма проводился на уровне отдельных строф. Ниже приводится анализ каждой строфы по-отдельности. ";
  }
  ;


  if (GroupStrof.length > 2) {

    UpFlag1 = flagStrofa1 + flagRitm1 + flagRitmError1 + flagErrorRifma1 + FlagRifm1 + rezumeProcentCountSlogSer + flagCountStrofaRitmEr;
    document.getElementById('ContainerFlag1').innerHTML = UpFlag1;
    document.getElementById('ContainerComment1').innerHTML = GlobalResumeCommentMini;
    document.getElementById('ContainerAnaliz1').innerHTML = document.getElementById('ContainerAnaliz1').innerHTML + "<br><br>" + GlobalResumeComment;
    document.getElementById('ContainerTemplate1').innerHTML = ""; // если строфы разные, то общий шаблон удаляем alex

  }


//if (FlagStrofaMultiPatternType===1 && !LentaMode.checked) {
  if (FlagStrofaMultiPatternType === 1) {

// NoLentaComment=TitleComment+"<br><br>"+razmerComment+CommentGroupStrof+ResumeLentaMode;}
    NoLentaComment = window.Comment0;

    document.getElementById('ContainerAnaliz1').innerHTML = window.Comment0;
    window.Comment0 = "";
    document.getElementById('ContainerAnaliz1').innerHTML = document.getElementById('ContainerAnaliz1').innerHTML + GlobalResumeCommentMini + "<br><br>" + ResumeLentaMode + "<br><br>";
  }
  ;

// выводим в отчёт базовые характеристики стиха====================================================================================================

// 2023 эпиграммы


// if (window.project=='epigramma' && epigramma!=1) {window.ClassicBall=0; GlobalClassicBall=0; flagErrorRifma=""; document.getElementById('ContainerAnaliz1').innerText="В режиме поэтических миниатюр принимаются только четверостишия определённого формата!"; document.getElementById('ContainerComment1').innerText="В режиме поэтических миниатюр принимаются только четверостишия определённого формата!"; document.getElementById('ContainerAnaliz1f').innerText=""; document.getElementById('openrecordstih1').style.display='none'; }

  if (window.project != 'epigramma' && epigramma == 1) {
    window.ClassicBall = 0;
    GlobalClassicBall = 0;
    flagErrorRifma = "";
    GlobalflagStrofaRazbitaMas = 0;
    document.getElementById('ContainerComment1').innerText = "Редакция альманаха «Венец поэзии» принимает стихи такого размера только в рамках специальных проектов.";
    document.getElementById('ContainerAnaliz1f').innerText = "Редакция альманаха «Венец поэзии» принимает стихи такого размера только в рамках специальных проектов.";
    document.getElementById('openrecordstih1').style.display = 'none';
  }

  if (window.project == "epigramma" && epigrammatype == "") {
    window.ClassicBall = 0;
    GlobalClassicBall = 0;
    flagErrorRifma = "";
    document.getElementById('ContainerAnaliz1').innerText = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата.  Для просмотра форматов нажмите кнопку «Пример».";
    document.getElementById('ContainerComment1').innerText = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата. ";
    document.getElementById('ContainerAnaliz1f').innerText = "";
    document.getElementById('openrecordstih1').style.display = 'none';
  }


  if (GlobalClassicBall === 3 && window.project != 'zadanie') {
    document.getElementById('openrecordstih1').style.display = '';
  }
  if (GlobalClassicBall === 2 && window.project != 'zadanie') {
    document.getElementById('openrecordstih1').style.display = '';
  }
  if (GlobalClassicBall === 3 && window.project != 'zadanie') {
    document.getElementById('openrecordstih2').style.display = '';
    document.getElementById('TextStih1').readOnly = 'true';
  }
  if (GlobalClassicBall === 2 && window.project != 'zadanie') {
    document.getElementById('openrecordstih2').style.display = '';
    document.getElementById('TextStih1').readOnly = 'true';
  }

  if (window.type == "noclassic") {
    document.getElementById('openrecordstih2').style.display = '';
    document.getElementById('TextStih1').readOnly = 'true';
  }


// анализ вручную -------------------------------------------------------------------------------------------------------------------------
//document.getElementById("FileAccent").checked=true; // галочка - Акценты есть;
  BallClassicManualText = document.getElementById("BallClassicManual").value; //"Оценка классики вручную"
  if (BallClassicManualText !== "") {
    GlobalClassicBall = Number(BallClassicManualText);
  }  // если не пустая, тогда вместо автоматической оценки подставляет ручную

// Оценка эксперта за содержание всегда вручную (если не пустая) -------------------------------------------------------------------------------
  let BallContentManualText1 = document.getElementById("BallContentManual").value;
  window.BallContentManual = BallContentManualText1;
  if (BallContentManualText1 !== "") {
    BallContentManualText = "\nОценка эксперта за содержание: {" + document.getElementById("BallContentManual").value + "}\n";
  }
  ;


// формируем отчёты ----------------------------------------------------------------------------------------


  let tab = String.fromCharCode(9);
  let separ = "\n=\n";

// контакты автора var FIOAuthorReport;var GodAuthorReport;var AdresAuthorReport;var EmailAuthorReport;
  stihReport = stih; // исходный стих
  StrofaPatternReport = StrofaPatternTypeMas[0]; //размер
  window.RitmReport = Ritm.join(); // массив в виде строки
  window.RitmReportInt = window.RitmReport.replace(/,/g, '');
  ResumeCommentMiniReport = document.getElementById('ContainerComment1').innerText; // резюме
  ContainerFlag1Report = document.getElementById('ContainerFlag1').innerText; // флаги
  ContainerAnaliz1Report = document.getElementById('ContainerAnaliz1').innerText; // Полный анализ

// формируем отчёт для сборника стихов с фамилиями, баллами и анализом
  Report = TitulStihReport + tab + StrofaPatternReport + tab + window.RitmReport + tab + window.flagCountStrofaPatternType + tab + window.flagRitmBall + tab + window.flagRifmBall + tab + UnicStrof + tab + FIOAuthorReport + tab + AdresAuthorReport + tab + EmailAuthorReport;

// формируем отчёт для сборника стихов с фамилиями, баллами без анализа
  Report2 = StrofaPatternReport + separ + window.RitmReport + separ + window.flagCountStrofaPatternType + separ + window.flagRitmBall + separ + window.flagRifmBall + separ + UnicStrof + separ + FIOAuthorReport + separ + AdresAuthorReport + separ + EmailAuthorReport + separ;

// если запись не отключена - вносим блок во все отчёты ----------------------------------------------------------------------------------------
  let SaveRecord = document.getElementById("SaveRecord").checked;
  if (SaveRecord) {

// формируем отчёт для сборника стихов с акцентами без анализа ----- lenta


    for (let FragmentN = 1; FragmentN < GroupStrof.length; FragmentN++) {
      FragmentReports = FragmentReports + document.getElementById('ContainerAnaliz' + FragmentN).innerText + '\n\n' + document.formStih1.TextStih.value + '\n\n';
    }
    FragmentReports = FragmentReports + 'РЕЗЮМЕ:\n' + document.getElementById('ContainerComment1').innerText;

// формируем отчёт по сборнику в виде csv для последующей загрузки в базу
    if (GlobalClassicBall > 1) {
      ReportTab = ReportTab + "'';'';'" + window.lastnameReport + "';'" + window.firstnameReport + "';'" + window.middlenameReport + "';'" + window.regionReport + "';'" + window.sityReport + "';'" + window.phoneReport + "';'" + window.emailReport + "';'" + window.rubrikaReport + "';'" + TitulStihReport + "';'" + document.formStih1.TextStih.value + "';'" + window.targetReport + "';'" + window.flagCountStrofaPatternType + "';'" + Strof + "';'" + StrofaPatternReport + "';'" + RitmReport.replace(/,/g, '') + "';'" + window.flagCountRitmError + "';'" + window.flagRitmBall + "';'" + window.flagRifmBall + "';'" + GlobalClassicBall + "';'" + window.ProcentCountSlogSer + "';'" + window.BallContentManual + "';'" + window.urlReport + "';'" + window.styleReport + "';'" + window.sourceReport + "';'" + window.accordsReport + "'" + "\n";
    }
    ;

// сохраняем файл сборника стихов с акцентами без анализа
    ReportAccent = ReportAccent + document.formStih1.TextStih.value + separ;
// сохраняем файл сборника стихов с акцентами без анализа раздельно, в зависимости от балла-классики (3-классика)
    if (GlobalClassicBall === 0) {
      ReportAccentBall0 = ReportAccentBall0 + document.formStih1.TextStih.value + BallContentManualText + separ;
    }
    ;
    if (GlobalClassicBall === 1) {
      ReportAccentBall1 = ReportAccentBall1 + document.formStih1.TextStih.value + BallContentManualText + separ;
    }
    ;
    if (GlobalClassicBall === 2) {
      ReportAccentBall2 = ReportAccentBall2 + document.formStih1.TextStih.value + BallContentManualText + separ;
    }
    ;
    if (GlobalClassicBall === 3) {
      ReportAccentBall3 = ReportAccentBall3 + document.formStih1.TextStih.value + BallContentManualText + separ;
    }
    ;

// сохраняем файл сборника стихов с акцентами и анализом
    ReportMas = ReportMas + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";

// сохраняем файл сборника стихов с акцентами и анализом раздельно, в зависимости от балла-классики (3-классика)
    if (GlobalClassicBall === 0) {
      ReportMasBall0 = ReportMasBall0 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }
    ;
    if (GlobalClassicBall === 1) {
      ReportMasBall1 = ReportMasBall1 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }
    ;
    if (GlobalClassicBall === 2) {
      ReportMasBall2 = ReportMasBall2 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }
    ;
    if (GlobalClassicBall === 3) {
      ReportMasBall3 = ReportMasBall3 + FragmentReports + separ + "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n";
    }
    ;


//==================================================================================
    document.getElementById('ContainerAnaliz1f').innerHTML = document.getElementById('ContainerAnaliz1f').innerHTML + '<br>Ещё вы можете:<br><a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(FragmentReports) + '" download="' + document.title + '.txt">Сохранить отчёт в файл</a>';

  } // конец если запись не отключена


// сохранение отчёта в файл

  document.getElementById('ContainerAnaliz1f').innerHTML = document.getElementById('ContainerAnaliz1f').innerHTML + '<div  style="line-height: 2;"><br>Ещё вы можете:<br><a href="https://fet.vpoezii.online/findritm.php?razmer=' + StrofaPatternReport + '&ritm=' + window.RitmReportInt + '&ritmkontrastplus=' + ritmkontrastplus + '&ritmkontrastminus=' + ritmkontrastminus + '"  target="_blank">Найти стихи или песни с аналогичным ритмом и размером</a><br><a href="#" onClick="grekinsert(); return false;">Узнать греческое название этого размера</a><br><a href="#" onClick="atoprint(\'shema\'); return false;">Напечатать схему ритма стихотворения</a><br><a href="#" onClick="ReadZadanie(); return false;">Открыть задачник по стихосложению</a><br><br></div>';

//==================================================================================
// если режим ленты, то перенесём FullContainerTemplate в первый блок и уберём легенду
  if (LentaMode.checked && 1 == 2) {
    document.getElementById('ContainerTemplate1').innerHTML = FullContainerTemplate;
// убирем легенду
    elem = document.getElementById('ContainerTemplate1');
    elem.querySelectorAll('.legenda1').forEach(function (a) {
      a.remove()
    })
// перенесли FullContainerTemplate в первый блок и убрали легенду
// вернём комментарий по всему стихотворению в первое поле после обработки ленты

    ResumeLentaMode = krest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. Нет единого ритма для всего стихотворения. Одинаковые по размеру строфы имеют разный ритм. Ниже приводится анализ каждой строфы по отдельности.';

    if (CrossOverMode == 1) {
      ResumeLentaMode = krest + ' Структура стихотворения не соответствует стандартам русского классического стихосложения. Нет единого ритма для всего стихотворения. Каждая строка в строфе имеет свой ритм. Обнаружено некоторое повторение ритма только между строфами. Ниже приводится анализ сгруппированных строк, имеющих схожий ритм и размер.';
    }

    if (document.getElementById('level-strok').checked) {
      ResumeLentaMode = krest + "Анализ проводился на уровне отдельных строк. Другие варианты анализа могут дать другие результаты.";
    }
    ;
    if (document.getElementById('level-strof').checked) {
      ResumeLentaMode = krest + "Анализ проводился на уровне отдельных строф. Другие варианты анализа могут дать другие результаты.";
    }
    ;


    document.getElementById('ContainerAnaliz1').innerHTML = NoLentaComment + ResumeLentaMode + "<br><br>";

  }

}