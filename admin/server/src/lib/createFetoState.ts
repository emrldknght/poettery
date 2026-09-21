type RitmBall =  0 | 1 | 2 | 3;
type RifmBall = 0 | 1;
type AccentBall = 0 | 1;
type ClassicBall = 0 | 1 | 2 | 3

interface SbornikMasItem {
  id: string;
  stih: string;
  title: string;
  GlobalClassicBall: ClassicBall;
  ContainerTemplate: string;
  ContainerAnaliz: string;
  ContainerFlag1Report: string;
  ResumeCommentMiniReport: string;
}

interface FetoState {
  OriginalTextInput: string,
  stih: string;
  stihMas: string[];
  stih0: string;
  stihMas0: string[];
  StihText: string;
  //
  SbornikMas: SbornikMasItem[];

  // word dictionaries
  slovarGlobal: string;
  slovar_accent_Mas: string[];
  slovar_noaccent_Mas: string[];
  slovar_E_Mas: string[];
  slovar_noaccent_E_Mas: string[];
  slovar_narod_Mas: string[];
  slovar_noaccent_narod_Mas: string[];
  slovar_noaccent_classic_Mas: string[];
  slovar_classic_Mas: string[];
  slovar_neoclassic_Mas: string[];
  slovar_noaccent_neoclassic_Mas: string[];
  //
  // stihReport: string; // исходный стих
  TitulStihReport: string; //заголовок
  TitulStih: string;//заголовок стиха

  flagSetAccent: number;
  AccentCountSimvol: number;
  SimvolCount: number;
  NewAccentLentaText: string;
  HandAccent: number;
  CountSlov: number;
  CountSlog: number;
  // count by colors
  CountSlogSer: number;
  CountSlogBlack: number;
  CountSlogBlue: number;
  //
  CountStrok: number; // todo -- check usages
  CountBukv: number; // todo -- check usages
  CountStrofa: number; // todo -- check usages
  CountStrofaRitmEr: number;
  slovoAccent: string;
  CountAccentSlov: number;
  CountNoAccentSlov: number;
  ClassicBall: ClassicBall;  // стихотворение строго классическое ClassicBall=3, если строф больше одной, типов строф<3, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм чёткий, сбоев ритма нет, нерифмованных строк нет
  // стихотворение практически классическое ClassicBall=2, если строф больше одной, типов строф<4, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм явный или чёткий, сбоев ритма нет или один, нерифмованных строк не больше одной
  // стихотворение не совсем классическое по форме, если строф больше одной, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм найден, количество нерифмованных строк <=2
  // анализ не проводится, если не расставлены ударения, если строфа одна.
  ClassicBallMas: number[];
  BlockRitmTemplate: string;
  BlockRitmTemplateMas: string[];
  Ritm: number[];
  RitmErr: number[];
  RitmReport: string; // ритм в виде чисел через запятую
  RitmReportInt: string; // ритм в виде числа без запятых
  RitmComment: string;
  RitmCommentMin: string;
  RitmkontrastMas: (string | number)[];
  RifmComment: string;
  FlagRifm: string;
  SlovaRifmMas: string[];
  CommentRitmika: string;
  TemplateMas: string[];
  TemplateAccent: string;
  TemplateNumGlas: string;
  TemplateGlasn: string;
  TemplateGlasnMas: string[];
  TemplateNumGlasMas: string[];
  ProbelPositionMas: number[][]; // позиция пробела, чтобы соотносить гласную с конкретным словом.
  //
  StrofaPatternMas: string[];
  StrofaPatternTypeMas: string[];
  StrofaRepeatTypeMas: number[];
  StrofaPositionMas: number[];
  StrofaPatternReport: string;
  GroupStrof: string[];
  ResumeComment: string;
  ResumeCommentMini: string;
  razmerComment: string;
  FullRazmerComment: string;
  ResumeStrofaPatternType: string;
  CountStrofaPatternType: number;
  SbornikCount: number;

  Strof: number;
  UnicStrof: number; // счетчик уникальных несогласованных строф
  tonicBall: number;
  CountSlogBluetext: string;
  CountSlogSertext: string;
  CountSlogBlacktext: string;
  TriCodRitm: string; // todo - check var type in logic
  // reports
  ReportMas: string; // name marked as array
  ReportMasBall0: string;// строка массив отчёта балл=0
  ReportMasBall1: string;// строка массив отчёта балл=1
  ReportMasBall2: string;// строка массив отчёта  балл=2
  ReportMasBall3: string;// строка массив отчёта  балл=3

  ReportTab: string;

  ReportAccent: string; // строка массив стихи с ударениями
  ReportAccentBall0: string; // строка массив стихи с ударениями балл=0
  ReportAccentBall1: string;// строка массив стихи с ударениями балл=1
  ReportAccentBall2: string;// строка массив стихи с ударениями балл=2
  ReportAccentBall3: string;// строка массив стихи с ударениями балл=3

  // sbornik
  SbornikContainerTemplate: string;
  SbornikContainerAnaliz: string;
  SbornikContainerFlag1Report: string;
  SbornikResumeCommentMiniReport: string;
  // flags
  flagRitm: string;
  flagRifmBall: RifmBall;
  flagRitmBall: RitmBall; // 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  flagAccentBall: AccentBall; // Ударения в словах не расставлены. flagAccentBall=0
  flagStrofaRazbita:  0 | 1; // строфа не разбита =0, разбита =1
  ProcentCountSlogSer: number;
  flagCountStrofaPatternType: number; // количество типов строф, если 1 - то все строфы одного размера
  flagGroupStrofaBall: number; // количество строф в одной группе
  flagCountRitmError: number; // количество сбоев ритма
  flagCountErrorRifma: number; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  flagRitmError: string; // krest? + txt
  GlobalflagCountErrorRifmaMas: number; // todo - find usages
  GlobalflagRitmBallMas: number;
  GlobalflagCountStrofaPatternTypeMas: number; // Обнаружено ${#} разных типов строф.
  GlobalflagStrofaRazbitaMas: number;
  GlobalflagAccentBallMas: number;
  GlobalClassicBall: number;
  flagProcentCountSlogSer: number;
  // flags 2
  ResumeLentaMode: string;
  flagStrofaBallMas: number[]; // количество типов строф, если 1 - то все строфы одного размера
  flagRitmBallMas: RitmBall[];// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
  flagRifmBallMas: RifmBall[];// Рифма точная - flagRifmBall=1
  flagAccentBallMas: AccentBall[];// Ударения в словах не расставлены. flagAccentBall=0
  flagStrofaRazbitaMas: (0 | 1)[];// строфа не разбита =0, разбита =1
  flagGroupStrofaBallMas: number[];// количество строф в одной группе
  flagCountStrofaPatternTypeMas: number[];// количество типов строф, если 1 - то все строфы одного размера
  flagCountErrorRifmaMas: number[]; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
  flagProcentCountSlogSerMas: number[]; // процент серых гласных
  flagCountRitmErrorMas: number[]; // количество сбоев ритма
  flagErrorRifma: string;
  FlagStrofaMultiPatternType: number;
  // flagRazmer: string;
  flagStrofa: string;
  flagAccent: string;
  //

  flagUpdateRecord: number;
  lenta: number;
  lentacount: number;
  LentaStihMas: string[]; // разбивка стиха на простые строфы без группировки (анализировать будем каждую)
  LentaStihText: string;

  ReturnStrofaPositionMas: number[];

  CrossOverMode: number; // todo - 0 | 1 ? make bool
  LentaCountSlog: number;
  LentaCountSlogSer: number;

  CrossRitm: number[]; // массив базового ритмического рисунка (запасной)
  CrossRitmStrofa: string[];
  CrossRitmResult: string[]; // массив базового ритмического рисунка (результат)
  CrossOverStihMas: string[]; //массив содержит исходный стих до сортировки (для перекрёсных строф)
  CrossOverProbelStrofMas: string[]; // исходный стих отсортирован и разбит на суперстрофы
  CrossOverProbelStrofMas2: string[]; // исходный стих отсортирован и разбит на суперстрофы (с маленькими строфами)
  CrossTemplateGlasnMas: string[]; //массив содержит гласные - сортируем его (создаем кросс-строфы)
  OldCrossTemplateGlasnMas: string[];
  OldCrossOverStihMas: string[];
  NewPosCrossOverStihMas: number[];
  CrossLentaRitm: string[]; // массив базового ритмического рисунка для перекрестных строф (одна строфа-один ритм). После перекрёстного анализа служит восстановлению ритма в востановленных строфах
  CrossTemplateGlasn: string[]; // массив гласных для перекрестных строф
  epigramma: number;
  epigrammatype: string;

  ritmkontrastplus: string;
  ritmkontrastminus: string;

  rifmovkatext: '' | 'полная' | 'смежная' | 'перекрёстная' | 'полуперекрёстная' | 'кольцевая';
  rifmovkalong: string;
  rifmovkatype: string;
  
  inWindow: Record<string, unknown> & {
    project?: 'konkurs_pesni' | 'book' | 'zadanie' | 'epigramma' | 'admin';
    type?: 'noclassic';
    lastnameReport?: string;
    firstnameReport?: string;
    middlenameReport?: string;
    regionReport?: string;
    sityReport?: string;
    phoneReport?: string;
    emailReport?: string;
    rubrikaReport?: string;
    targetReport?: string;
    urlReport?: string;
    styleReport?: string;
    sourceReport?: string;
    accordsReport?: string;
  }
  
  // dom replacement strings
  lentaContainerTemplates: string[]; // patch for ContainerTemplate#

  ContainerTemplate1: string;
  ContainerAnaliz1: string;
  ContainerAnaliz1f: string;
  ContainerComment0: string;
  ContainerComment1: string;
  ContainerFlag1: string;
  // levelStrokCb: boolean;
  explorerPanel: string;
  LentaMode: {
    checked: boolean;
  };
  SaveRecord: {
    checked: boolean;
  };
  FileAccent: {
    checked: boolean,
  };
  // dom flags - level
  levelFull: boolean;
  levelTonic: boolean
  levelStrof: boolean;
  levelStrok: boolean;
  // dom constants - to show content
  postscriptum: string;
  BallClassicManual: string;
  BallContentManual: string;
  TriCodLegend: string;
  mySlog: string;
  // temp dom constants
  galka: string;
  greengalka: string;
  krest: string;
  redkrest: string;
  indikator: string;
  slog: string;
  // temp globals
  _TempFullRifmMas: [];
  _TempRitmstring: string;
  _TempFlagRitmBall: number;
  _TempCommentStopa: string;
  _TempTriCodeRitm: string;

  FinalAccentedText: string;
  AccentedFragments: string[];
}

type LegacyState = FetoState & Record<string, any>;
export const createFetoState = (): FetoState => {
  return {
    OriginalTextInput: '',
    stih: '',
    stihMas: [],
    stih0: '',
    stihMas0: [],
    StihText: '',
    SbornikMas: [],
    slovarGlobal: '',
    slovar_accent_Mas: [],
    slovar_noaccent_Mas: [],
    slovar_E_Mas: [],
    slovar_noaccent_E_Mas: [],
    slovar_narod_Mas: [],
    slovar_noaccent_narod_Mas: [],
    slovar_noaccent_classic_Mas: [],
    slovar_classic_Mas: [],
    slovar_neoclassic_Mas: [],
    slovar_noaccent_neoclassic_Mas: [],

    // stihReport: '',
    TitulStih: '',
    TitulStihReport: '',

    flagSetAccent: 0,
    AccentCountSimvol: 0,
    SimvolCount: 0,
    NewAccentLentaText: '',
    HandAccent: 1,
    CountSlov: 0,
    CountSlog: 0,
    CountSlogSer: 0,
    CountSlogBlack: 0,
    CountSlogBlue: 0,
    CountStrok: 0,
    CountBukv: 0,
    slovoAccent: '',
    CountAccentSlov: 0,
    CountNoAccentSlov: 0,
    CountStrofa: 0,
    CountStrofaRitmEr: 0,
    ClassicBall: 0,
    ClassicBallMas: [],
    BlockRitmTemplate: '',
    BlockRitmTemplateMas: [],
    Ritm: [],
    RitmErr: [],
    RitmReport: '',
    RitmReportInt: '',
    RitmComment: '',
    RitmCommentMin: '',
    RitmkontrastMas: [],
    RifmComment: '',
    FlagRifm: '',
    SlovaRifmMas: [],
    CommentRitmika: '',
    TemplateMas: [],
    TemplateAccent: '',
    TemplateNumGlas: '',
    TemplateGlasn: '',
    TemplateGlasnMas: [],
    TemplateNumGlasMas: [],
    ProbelPositionMas: [],
    //
    StrofaPatternMas: [],
    StrofaPatternTypeMas: [],
    StrofaRepeatTypeMas: [], // todo - check logic
    StrofaPositionMas: [],
    StrofaPatternReport: '',
    GroupStrof: [],
    ResumeComment: '',
    ResumeCommentMini: '',
    razmerComment: '',
    FullRazmerComment: '',
    ResumeStrofaPatternType: '',
    CountStrofaPatternType: 0,
    SbornikCount: 0,
    Strof: 0,
    UnicStrof: 0,
    tonicBall: 0,
    CountSlogBluetext: '',
    CountSlogSertext: '',
    CountSlogBlacktext: '',
    TriCodRitm: '',
    // reports
    ReportMas: '',
    ReportMasBall0: '',
    ReportMasBall1: '',
    ReportMasBall2: '',
    ReportMasBall3: '',

    ReportTab: '',
    ReportAccent: '',
    ReportAccentBall0: '',
    ReportAccentBall1: '',
    ReportAccentBall2: '',
    ReportAccentBall3: '',
    // sbornik
    SbornikContainerTemplate: '',
    SbornikContainerAnaliz: '',
    SbornikContainerFlag1Report: '',
    SbornikResumeCommentMiniReport: '',
    // flags
    flagRitm: '',
    flagRifmBall: 0,
    flagRitmBall: 0,
    flagAccentBall: 0,
    flagStrofaRazbita: 0,
    ProcentCountSlogSer: 0,
    flagCountStrofaPatternType: 0,
    flagGroupStrofaBall: 0,
    flagCountRitmError: 0,
    flagCountErrorRifma: 0,
    flagRitmError: '',
    GlobalflagCountErrorRifmaMas: 0,
    GlobalflagRitmBallMas: 0,
    GlobalflagCountStrofaPatternTypeMas: 0,
    GlobalflagStrofaRazbitaMas: 0,
    GlobalflagAccentBallMas: 0,
    GlobalClassicBall: 0,
    flagProcentCountSlogSer: 0,
    // flags 2
    ResumeLentaMode: '',
    flagStrofaBallMas: [],
    flagRitmBallMas: [],
    flagRifmBallMas: [],
    flagAccentBallMas: [],
    flagStrofaRazbitaMas: [],
    flagGroupStrofaBallMas: [],
    flagCountStrofaPatternTypeMas: [],
    flagCountErrorRifmaMas: [],
    flagProcentCountSlogSerMas: [],
    flagCountRitmErrorMas: [],
    flagErrorRifma: '',
    FlagStrofaMultiPatternType: 0,
    // flagRazmer: '',
    flagStrofa: '',
    flagAccent: '',
    //
    flagUpdateRecord: 0,

    lenta: 1,
    lentacount: 0,
    LentaStihMas: [],
    LentaStihText: '',

    ReturnStrofaPositionMas: [],

    CrossOverMode: 0,
    LentaCountSlog: 0,
    LentaCountSlogSer: 0,
    CrossRitm: [],
    CrossRitmStrofa: [],
    CrossRitmResult: [],
    CrossOverStihMas: [],
    CrossOverProbelStrofMas: [],
    CrossOverProbelStrofMas2: [],
    CrossTemplateGlasnMas: [],
    OldCrossTemplateGlasnMas: [],
    OldCrossOverStihMas: [],
    NewPosCrossOverStihMas: [],
    CrossLentaRitm: [],
    CrossTemplateGlasn: [],

    epigramma: 0,
    epigrammatype: '',

    ritmkontrastplus: '',
    ritmkontrastminus: '',

    rifmovkatext: '',
    rifmovkalong: '',
    rifmovkatype: '',

    inWindow: {},

    // dom replacement strings
    lentaContainerTemplates: [],

    ContainerTemplate1: '',
    ContainerAnaliz1: '',
    ContainerAnaliz1f: '',
    ContainerComment0: '',
    ContainerComment1: '',
    ContainerFlag1: '',
    // levelStrokCb: false,
    explorerPanel: '',
    LentaMode: {
      checked: false,
    },
    SaveRecord: {
      checked: false,
    },
    FileAccent: {
      checked: false,
    },
    // dom flags - level
    levelFull: true,
    levelTonic: false,
    levelStrof: false,
    levelStrok: false,
    // dom constants - to show content
    postscriptum: '',
    BallClassicManual: '',
    BallContentManual: '',
    TriCodLegend: '',
    mySlog: '',
    // temp dom constants
    galka: '<span style="color:#32CD32 ; font-weight: 900;">' + String.fromCharCode(10003) + '&nbsp;</span>',
    greengalka: '<span style="background-color: #32CD32; color: #ffffff; font-weight: 900;">&nbsp;' + String.fromCharCode(10003) + '&nbsp;</span>',
    krest: '<span style="color:#FF0000 ; font-weight: bold;">X&nbsp;</span>',
    redkrest: '<span style="background-color: #FF0000; color:#ffffff ; font-weight: bold;">&nbsp;X&nbsp;</span>',
    indikator: '<img alt="i" src="https://fet.vpoezii.online/idikator.gif" style="vertical-align: middle; text-align:center;">',
    slog: '<div id="slog" >&nbsp;&nbsp;123456789012345</div>',
    // temp globals
    _TempFullRifmMas: [],
    _TempRitmstring: '',
    _TempFlagRitmBall: 0,
    _TempCommentStopa: '',
    _TempTriCodeRitm: '',

    //
    FinalAccentedText: '',
    AccentedFragments: [],
  }
}

export const createLegacyState = (): FetoState => {
  const state = createFetoState() as FetoState;
  const warnedKeys = new Set<string>();

  return new Proxy(state, {
    get(target, key) {
      if (typeof key === 'symbol') return (target as any)[key];

      if (!(key in target) && !warnedKeys.has(key as string)) {
        console.warn(`[state] key not found: ${String(key)}`);
        warnedKeys.add(key as string);
      }
      return target[key as keyof FetoState];
    },
    set(target, prop, newValue, receiver) {
      (target as any)[prop] = newValue;
      return true;
    }
  })
}