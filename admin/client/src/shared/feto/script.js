'use strict';
// =============================================================================================
// Интеллектуальная система Fet.Online (c) Издательство «Венец поэзии». Версия №11 от 19-08-2023.
// =============================================================================================
// поиск по словарю упрощён, используется поиск по всему словарю с учётом его естественной индексации
// добавлено вычисление основного типа рифмовки, кода рифмовки всего произведения, запись кода в базу
// добавлена обработка однострофных четверостиший+
// ============================================= ПЛАН ==========================================
// поиск последней ударной буквы (рифмы), поиск строфы по рифме
// ударения вручную с чекбоксом над гласными
// подбор мелодии

// -----------режим отладки -------------------------------------------------------------------
// document.getElementById('adminPanel').style.display='';

// ==================================================================================================================================

var primer = [];

primer[0] = "Призрачно все в этом мире бушующем.\nЕсть только миг - за него и держись.\nЕсть только миг между прошлым и будущим.\nИменно он называется жизнь.\n\nВечный покой сердце вряд ли обрадует.\nВечный покой для седых пирамид\nА для звезды, что сорвалась и падает\nЕсть только миг - ослепительный миг.\n\nПусть этот мир вдаль летит сквозь столетия.\nНо не всегда по дороге мне с ним.\nЧем дорожу, чем рискую на свете я -\nМигом одним - только мигом одним.\n\nСчастье дано повстречать иль беду ещё\nЕсть только миг - за него и держись.\nЕсть только миг между прошлым и будущим.\nИменно он называется жизнь.";

primer[1] = "Буря мглою небо кроет,\nВихри снежные крутя;\nТо, как зверь, она завоет,\nТо заплачет, как дитя,\n\nТо по кровле обветшалой\nВдруг соломой зашумит,\nТо, как путник запоздалый,\nК нам в окошко застучит.\n\nНаша ветхая лачужка\nИ печальна и темна.\nЧто же ты, моя старушка,\nПриумолкла у окна?\n\nИли бури завываньем\nТы, мой друг, утомлена,\nИли дремлешь под жужжаньем\nСвоего веретена?\n\nВыпьем, добрая подружка\nБедной юности моей,\nВыпьем с горя; где же кружка?\nСердцу будет веселей.\n\nСпой мне песню, как синица\nТихо за морем жила;\nСпой мне песню, как девица\nЗа водой поутру шла.\n\nБуря мглою небо кроет,\nВихри снежные крутя;\nТо, как зверь, она завоет,\nТо заплачет, как дитя.\n\nВыпьем, добрая подружка\nБедной юности моей,\nВыпьем с горя; где же кружка?\nСердцу будет веселей.\n";

primer[2] = "Белеет парус одинокой\nВ тумане моря голубом!\nЧто ищет он в стране далекой?\nЧто кинул он в краю родном?\n\nИграют волны - ветер свищет,\nИ мачта гнется и скрыпит.\nУвы! он счастия не ищет\nИ не от счастия бежит!\n\nПод ним струя светлей лазури,\nНад ним луч солнца золотой.\nА он, мятежный, просит бури,\nКак будто в бурях есть покой!";

primer[3] = "Алый мрак в небесной черни\nНачертил пожаром грань.\nЯ пришел к твоей вечерне,\nПолевая глухомань.\n\nНелегка моя кошница,\nНо глаза синее дня.\nЗнаю, мать-земля чернИца,\nВсе мы тесная родня.\n\nРазошлись мы в даль и шири\nПод лазоревым крылом.\nНо сзовет нас из псалтыри\nЗаревой заре псалом.\n\nИ придем мы по равнинам\nК правде сошьего креста\nСветом книги голубиной\nНапоить свои уста.";

primer[4] = "Я тебЕ ничегО не скажУ,\nИ тебЯ не встревОжу ничУть,\nИ о тОм, что я мОлча твержУ,\nнЕ решУсь ни за чтО намекнУть.\n\nцЕлый дЕнь спят ночнЫе цветЫ,\nнО лишь сОлнце за рОщу зайдЕт,\nраскрывАются тИхо листЫ\nИ я слЫшу, как сЕрдце цветЕт.\n\nИ в больнУю, устАлую грУдь\nвЕет влАгой ночнОй… я дрожУ,\nЯ тебЯ не встревОжу ничУть,\nЯ тебЕ ничегО не скажУ.";

primer[5] = "Снова замерло всё до рассвета -\nДверь не скрипнет, не вспыхнет огонь.\nТолько слышно - на улице где-то\nОдинокая бродит гармонь:\n\nТо пойдет на поля, за ворота,\nТо обратно вернется опять,\nСловно ищет в потемках кого-то\nИ не может никак отыскать.\n";

primer[6] = "В те дни, когда мне были новы\nВсе впечатленья бытия -\nИ взоры дев, и шум дубровы,\nИ ночью пенье соловья,-\n\nКогда возвышенные чувства,\nСвобода, слава и любовь\nИ вдохновенные искусства\nТак сильно волновали кровь,-\n\nЧасы надежд и наслаждений\nТоской внезапной осеня,\nТогда какой-то злобный гений\nСтал тайно навещать меня.\n\nПечальны были наши встречи:\nЕго улыбка, чудный взгляд,\nЕго язвительные речи\nВливали в душу хладный яд.\n\nНеистощимой клеветою\nОн провиденье искушал;\nОн звал прекрасное мечтою;\nОн вдохновенье презирал;\n\nНе верил он любви, свободе;\nНа жизнь насмешливо глядел -\nИ ничего во всей природе\nБлагословить он не хотел.";

primer[7] = "Не напрасно дули ветры,\nНе напрасно шла гроза.\nКто-то тайный тихим светом\nНапоил мои глаза.\n\nС чьей-то ласковости вешней\nОтгрустил я в синей мгле\nО прекрасной, но нездешней,\nНеразгаданной земле.\n\nНе гнетет немая млечность\nНе тревожит звездный страх.\nПолюбил я мир и вечность\nКак родительский очаг.\n\nВсе в них благостно и свято,\nВсе тревожное светло.\nПлещет рдяный мак заката\nНа озерное стекло.\n\nИ невольно в море хлеба\nРвется образ с языка:\nОтелившееся небо\nЛижет красного телка.\n";

primer[8] = "Мне голос был. Он звал утешно,\nОн говорил: «Иди сюда,\nОставь свой край глухой и грешный,\nОставь Россию навсегда.\n\nЯ кровь от рук твоих отмою,\nИз сердца выну чёрный стыд,\nЯ новым именем покрою\nБоль поражений и обид».\n\nНо равнодушно и спокойно\nРуками я замкнула слух,\nЧтоб этой речью недостойной\nНе осквернялся скорбный дух.";

primer[9] = "Сжала руки под темной вуалью…\n'Отчего ты сегодня бледна?'\n— Оттого, что я терпкой печалью\nНапоила его допьяна.\n\nКак забуду? Он вышел, шатаясь,\nИскривился мучительно рот…\nЯ сбежала, перил не касаясь,\nЯ бежала за ним до ворот.\n\nЗадыхаясь, я крикнула: 'Шутка\nВсе, что было. Уйдешь, я умру.'\nУлыбнулся спокойно и жутко\nИ сказал мне: 'Не стой на ветру'.";

primer[10] = "Я научилась просто, мудро жить,\nСмотреть на небо и молиться Богу,\nИ долго перед вечером бродить,\nЧтоб утомить ненужную тревогу.\n\nКогда шуршат в овраге лопухи\nИ никнет гроздь рябины желто-красной,\nСлагаю я веселые стихи\nО жизни тленной, тленной и прекрасной.\n\nЯ возвращаюсь. Лижет мне ладонь\nПушистый кот, мурлыкает умильней,\nИ яркий загорается огонь\nНа башенке озерной лесопильни.\n\nЛишь изредка прорезывает тишь\nКрик аиста, слетевшего на крышу.\nИ если в дверь мою ты постучишь,\nМне кажется, я даже не услышу.\n";

primer[11] = "Ночь, улица, фонарь, аптека,\nБессмысленный и тусклый свет.\nЖиви еще хоть четверть века —\nВсе будет так. Исхода нет.\n\nУмрешь — начнешь опять сначала\nИ повторится все, как встарь:\nНочь, ледяная рябь канала,\nАптека, улица, фонарь.";

primer[12] = "Никогда не забуду (он был, или не был,\nЭтот вечер): пожаром зари\nСожжено и раздвинуто бледное небо,\nИ на жёлтой заре — фонари.\n\nЯ сидел у окна в переполненном зале.\nГде-то пели смычки о любви.\nЯ послал тебе чёрную розу в бокале\nЗолотого, как нёбо, аи.\n\nТы взглянула. Я встретил смущённо и дерзко\nВзор надменный и отдал поклон.\nОбратясь к кавалеру, намеренно резко\nТы сказала: «И этот влюблён».\n\nИ сейчас же в ответ что-то грянули струны,\nИсступлённо запели смычки…\nНо была ты со мной всем презрением юным,\nЧуть заметным дрожаньем руки…\n\nТы рванулась движеньем испуганной птицы,\nТы прошла, словно сон мой легка…\nИ вздохнули духи, задремали ресницы,\nЗашептались тревожно шелка.\n\nНо из глуби зеркал ты мне взоры бросала\nИ, бросая, кричала: «Лови!..»\nА монисто бренчало, цыганка плясала\nИ визжала заре о любви.";

primer[13] = "Я пропал, как зверь в загоне.\nГде-то люди, воля, свет,\nА за мною шум погони,\nМне наружу ходу нет.\n\nТемный лес и берег пруда,\nЕли сваленной бревно.\nПуть отрезан отовсюду.\nБудь что будет, все равно.\n\nЧто же сделал я за пакость,\nЯ убийца и злодей?\nЯ весь мир заставил плакать\nНад красой земли моей.\n\nНо и так, почти у гроба,\nВерю я, придет пора —\nСилу подлости и злобы\nОдолеет дух добра.";


primer[14] = "Окна в решЕтках, и сУмрачны лИца,\nзлОба глядИт ненавИстно на брАта;\nЯ признаЮ твоИ стЕны, темнИца,—\nЮности пИр ликовАл здесь когдА-то.\n\nчтО ж там мелькнУло красОю нетлЕнной?\nАх, то цветОк мой весЕнний, любИмый!\nкАк уцелЕл ты, засОхший, смирЕнный,\nтУт, под ногАми толпЫ нелюдИмой?\n\nрАдость сиЯла, чистА безупрЕчно,\nв чАс, как тебЯ обронИла невЕста.\nнЕт, не покИну тебЯ бессердЕчно,\nздЕсь, у менЯ на грудИ тебЕ мЕсто.";


primer[15] = "человЕку нАдо мАло:\nчтОб искАл И находИл.\nчтОб имЕлись длЯ начАла\nдрУг — одИн И враг — одИн…\n\nчеловЕку нАдо мАло:\nчтОб тропИнка вдАль велА.\nчтОб жилА нА свЕте мАма.\nскОлько нУжно Ей — жилА.\n\nчеловЕку нАдо мАло:\nпОсле грОма — тишинУ.\nгОлубой клочОк тумАна.\nжИзнь — однУ.И смерть — однУ.\n\nУтром свЕжую газЕту —\nс человЕчеством родствО.\nИ всегО однУ планЕту:\nзЕмлю! тОлько И всегО.\n\nИ — межзвЕздную дорОгу\nдА мечтУ О скоростЯх.\nЭто, в сУщности,- немнОго.\nЭто, в Общем-тО,- пустЯк.\n\nневелИкая нагрАда.\nневысОкий пьедестАл.\nчеловЕку мАло нАдо.\nлИшь бы дОма ктО-то ждАл.";

primer[16] = "цЕлую нОчь сОловей нам насвИстывал, \nгОрод молчАл И молчАли домА... \nбЕлой акАции грОздья душИстые\nнОчь напролЕт нАс сводИли с умА. \n\nсАд весь умЫт бЫл весЕнними лИвнями, \nв тЕмных оврАгах стоЯла водА. \nбОже, какИми мы бЫли наИвными, \nкАк же мы мОлоды бЫли тогдА! \n\nгОды промчАлись, седЫми нас дЕлая... \nгдЕ чистотА Этих вЕток живЫх? \nтОлько зимА И метЕль Эта бЕлая\nнапоминАет сегОдня о нИх. \n\nв чАс, когдА вЕтер бушУет неИстово, \nс нОвою сИлою чУвствую Я: \nбЕлой акАции грОздья душИстые\nневозвратИмы, как Юность моЯ! ";

primer[17] = "нА святОй русИ, нашей мАтушке,\nнЕ найтИ, не сыскАть такОй красАвицы:\nхОдит плАвно — бУдто лебЕдушка;\nсмОтрит слАдко — кАк голУбушка; \n\nМолвит слово — соловей поет;\nГорят щеки ее румяные,\nКак заря на небе божием;\nКосы русые, золотистые,\n\nВ ленты яркие заплетенные,\nПо плечам бегут, извиваются,\nС грудью белою цалуются.";


let legenda1 = "Обозначения:\nО  ударный слог\n:  слабоударный слог\n.  безударный слог.";

const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
if (isMobile != null) {
  var mobilenavigator = " Подробный анализ ниже.";
} else {
  var mobilenavigator = "";
}
;

var html = "";
var admin = false;
var slovarGlobal = "";
var slovarGlobalOmogr = "";
var slovarGlobalE = "";
var slovarE = "";


var slovar_accent_Mas = [];
var slovar_noaccent_Mas = [];
var slovar_narod_Mas = [];
var slovar_classic_Mas = [];
var slovar_neoclassic_Mas = [];
var slovar_E_Mas = [];

var slovar_noaccent_E_Mas = [];
var slovar_noaccent_narod_Mas = [];
var slovar_noaccent_classic_Mas = [];
var slovar_noaccent_neoclassic_Mas = [];

var slovoAccent = "";
var CountAccentSlov = 0;
var CountNoAccentSlov = 0;

var stih = "";
var stih0 = "";
var StihText = "";
var stihMas = [];
var SbornikMas = [];
var SbornikMasText = [];
var KonkursMas = [];
var Sbornik = "";
var stihMas0 = [];
var NaturalStih = "";
var slovarOmogrMas = [];
var slovarEMas = [];
var slovarMas = [];
var TemplateMas = [];
var TemplateAccent = "";
var TemplateNumGlas = "";
var TemplateGlasn = "";
var TemplateGlasnMas = []; //массив содержит гласные
var Ritm = [];
var RitmkontrastMas = [];
var RitmErr = [];
var resSecond = "";
var RitmComment = "";
var RitmCommentMin = "";
var RitmCommentErr = "";
var RifmComment = "";
var FlagRifm = "";
var SlovaRifmMas = [];
var CommentRitmika = "";
var razmerComment = "";
var minRazmerComment = "";
var ResumeComment = "В целом, текст не вполне соответствует канонам русского классического стихосложения. ";
var ResumeCommentMini = "Текст не вполне соответствует стандартам русского классического стихосложения. ";
var rn = 999;
var galka = '<span style="color:#32CD32 ; font-weight: 900;">' + String.fromCharCode(10003) + '&nbsp;</span>';
var greengalka = '<span style="background-color: #32CD32; color: #ffffff; font-weight: 900;">&nbsp;' + String.fromCharCode(10003) + '&nbsp;</span>';

var krest = '<span style="color:#FF0000 ; font-weight: bold;">X&nbsp;</span>';
var redkrest = '<span style="background-color: #FF0000; color:#ffffff ; font-weight: bold;">&nbsp;X&nbsp;</span>';

var flagRitm = "";
var flagErrorRitm = "";
var flagErrorRifma = "";
var FlagRifmaYo = 0;
var flagRazmer = "";
var flagStrofa = "";
var flagAccent = "";
var LastAccent = 0;
var flagSetAccent = 0;
var BlockRitmTemplate = "";
var BlockRitmTemplateMas = [];
var TemplateNumGlasMas = []; // номера гласных в шаблоне (разбивка на слова)
var ProbelPositionMas = []; // позиция пробела, чтобы соотносить гласную с конкретным словом.
var SlovaRifmBegin = []; // позиция начала рифмующегося слова
var SlovaRifmDlina = []; // длина рифмующегося слова
var BlockRitmTemplateColor = "";
var TriCodRitm = "";
var SbornikCount = 0;
var SbornikCountTxt = "";
var SbornikHTML = "";
var FullContainerTemplate = "";

var SbornikContainerTemplate = "";
var SbornikContainerAnaliz = "";
var SbornikContainerFlag1Report = "";
var SbornikResumeCommentMiniReport = "";

var typeSbornik = 0;
var idSbornik = 0;
var nameSbornik = "";

var StrofaPatternMas = [];
var StrofaPatternTypeMas = [];
var StrofaRepeatTypeMas = [];
var StrofaPositionMas = [];
var GroupStrof = [];
var CountGroupStrof = 0;
var CommentGroupStrof = "";
var ResumeStrofaPatternType = "";
var CountStrofaPatternType = 0;
var FullRazmerComment = "";
var StrofaRepeatTypeMas = [];
var ReportMas = [];

var FIOAuthorReport;
var GodAuthorReport;
var AdresAuthorReport
var EmailAuthorReport
var lastnameReport;
var firstnameReport;
var middlenameReport;
var regionReport;
var sityReport;
var phoneReport;
var emailReport;
var rubrikaReport;
var targetReport;
var urlReport;
var styleReport;
var songReport;
var popularReport;
var sourceReport;
var accordsReport;


// строка отчёта для базы данных
var stihReport; // исходный стих
var TitulStihReport; //заголовок
var TitulStih;//заголовок стиха
var StrofaPatternReport; //размер
var RitmReport; // ритм в виде чисел через запятую
var RitmReportInt; // ритм в виде числа без запятых
var ResumeCommentMiniReport; // резюме
var ContainerFlag1Report; // флаги
var ContainerAnaliz1Report; // Полный анализ
var Report = ""; // строка отчёта для базы данных
var Report2 = ""; // строка отчёта для базы данных

var ReportMas = "";// строка массив отчёты анализ
var ReportMasBall0 = "";// строка массив отчёта балл=0
var ReportMasBall1 = "";// строка массив отчёта балл=1
var ReportMasBall2 = "";// строка массив отчёта  балл=2
var ReportMasBall3 = "";// строка массив отчёта  балл=3

var ReportTab = "";// строка-таблицы для записи в базу (текстовая строка для последующего импорта файла в базу SQL)
var ReportTabBall0 = "";// строка-таблицы для записи в базу балл=0
var ReportTabBall1 = "";// строка-таблицы для записи в базу балл=1
var ReportTabBall2 = "";// строка-таблицы для записи в базу балл=2
var ReportTabBall3 = "";// строка-таблицы для записи в базу балл=3


var ReportAccent = ""; // строка массив стихи с ударениями
var ReportAccentBall0 = ""; // строка массив стихи с ударениями балл=0
var ReportAccentBall1 = "";// строка массив стихи с ударениями балл=1
var ReportAccentBall2 = "";// строка массив стихи с ударениями балл=2
var ReportAccentBall3 = "";// строка массив стихи с ударениями балл=3

var ReportCount;// счетчик строк отчёта для базы данных
UnicStrof = 0;// счетчик уникальных несогласованных строф
var FlagStrofaMultiPatternType = 0; //признак строф разного размера

var CountSlov = 0;
var CountSlog = 0;
var CountSlogSer = 0;
var CountSlogBlack = 0;
var CountSlogBlue = 0;
var CountStrok = 0;
var CountBukv = 0;
var CountStrofa = 0;
var CountStrofaRitmEr = 0;
var CountStrofaRifmEr = 0;

var ClassicBallMas = []; // стихотворение строго классическое ClassicBall=3, если строф больше одной, типов строф<3, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм чёткий, сбоев ритма нет, нерифмованных строк нет
// стихотворение практически классическое ClassicBall=2, если строф больше одной, типов строф<4, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм явный или чёткий, сбоев ритма нет или один, нерифмованных строк не больше одной
// стихотворение не совсем классическое по структуре, если строф больше одной, одиночных строф (без пары) нет, количество строф в любой группе >1, ударения расставлены, ритм найден, количество нерифмованных строк <=2
// анализ не проводится, если не расставлены ударения, если строфа одна.

var flagStrofaBallMas = [];// количество типов строф, если 1 - то все строфы одного размера
var flagRitmBallMas = [];// 1 - ритм найден, 2 - ритм явный, 3 -ритм чёткий.
var flagRifmBallMas = [];// Рифма точная - flagRifmBall=1
var flagAccentBallMas = [];// Ударения в словах не расставлены. flagAccentBall=0
var flagStrofaRazbitaMas = [];// строфа не разбита =0, разбита =1
var flagGroupStrofaBallMas = [];// количество строф в одной группе
var flagCountStrofaPatternTypeMas = [];// количество типов строф, если 1 - то все строфы одного размера
var flagCountErrorRifmaMas = []; // количество нерифмованных строк (надо делить на два, у рифмы всегда есть пара)
var flagProcentCountSlogSerMas = []; // процент серых гласных

var flagCountRitmErrorMas = []; // количество сбоев ритма
var Strof = 0;
var disclamer = '<a href="https://vpoezii.online" target="_blank" style="text-decoration: none; color: #0d6f9c; alink: #aaaaaa; vlink: #aaaaaa; link: #aaaaaa;">* Мнение редакции альманаха «Венец поэзии» может отличаться от выводов интеллектуальной системы</a>.';

var JsonBase = "";
var RecordMas = "";
var tryRifma = 1;
var lenta = 1;
var lentacount = 0;
var LentaStihMas = []; // разбивка стиха на простые строфы без группировки (анализировать будем каждую)
var LentaStihText = "";

var ReturnStrofaPositionMas = [];
var CountPatternStrofaType = 0;
var SimvolCount = 0;
var AccentCountSimvol = 0;
var NoLentaComment = "";

var LentaCountSlogSer = 0;
var LentaCountSlog = 0;
var CrossRitm = []; // массив базового ритмического рисунка (запасной)
var CrossRitmResult = []; // массив базового ритмического рисунка (результат)
var CrossOverStihMas = []; //массив содержит исходный стих до сортировки (для перекрёсных строф)
var CrossOverProbelStrofMas = []; // исходный стих отсортирован и разбит на суперстрофы
var CrossOverProbelStrofMas2 = []; // исходный стих отсортирован и разбит на суперстрофы (с маленькими строфами)
var CrossTemplateGlasnMas = []; //массив содержит гласные - сортируем его (создаем кросс-строфы)
var OldCrossTemplateGlasnMas = []; //массив содержит гласные - сохраняем его до сортировки
var OldCrossOverStihMas = []; //массив содержит исходный стих - сохраняем его до сортировки
var NewPosCrossOverStihMas = []; //массив содержит новые позиции строк стиха после сортировки и разбивки на строфы (индекс - исходная позиция строки, значение - новая позиция строки)
var CrossLentaRitm = []; // массив базового ритмического рисунка для перекрестных строф (одна строфа-один ритм). После перекрёстного анализа служит восстановлению ритма в востановленных строфах
var CrossTemplateGlasn = []; // массив гласных для перекрестных строф
var CrossOverMode = 0;
var CrossRitmStrofa = []; // массив ритмов для строф в режиме кросс-ленты
var CrossRitmStrofaMas = [];
var CrossRitmStrofaProbelMas = [];
var NewAccentLentaText = "";
var HandAccent = 1;
var picsize = 0;
var picsrc = "";
var picnaturalWidth = 0;
var picnaturalHeight = 0;
var objdemoimage = "";

var ritmkontrastplus = "";
var ritmkontrastminus = "";

var rifmovkatext = "";
var rifmovkalong = "";
var rifmovkatype = "";

var epigramma = 0;
var epigrammatype = "";
var flagrealimg = 0;
var objuserstatus = "";


// переменные для плоского анализа ======================================================
var MassivStrok = [];
var MasPosAccGlasn = [];
var MasCodKlauzula = [];
var MasKlauzulaProbel = [];
var MasCodKlauzulaBaserazmer = [];
var MasKratnoBase = [];
var MasRealRifma = [];
var CountFindRifm = 0;
var maxKratnoBase = 0;

var CountSlogBluetext = "";
var CountSlogSertext = "";
var CountSlogBlacktext = "";
var realotvet = "";
// переменные для тонического анализа ======================================================
var tonicBall = 0;


// конец объявления глобальных переменных ======================================================
// ??? ======================================================

LentaMode.checked = false;
var ResumeLentaMode = "";
var flagStrofaRazbita = 0;
var ProcentCountSlogSer = 0;
var GlobalflagProcentCountSlogSer = 0;
var UnicStrof = 0;
var GlobalflagStrofaRazbitaMas = 0;
var GlobalflagAccentBallMas = 0;
var GlobalflagCountStrofaPatternTypeMas = 0;
var GlobalflagRitmBallMas = 0;
var GlobalflagCountRitmErrorMas = 0;
var GlobalflagCountErrorRifmaMas = 0;

var GlobalflagCountStrofaPatternTypeMas = 0;
var GlobalResumeCommentCountStrofaPatternTypeMas0 = "";
var GlobalflagRitmBallMas = 0;
var GlobalflagCountErrorRifmaMas = 0;
var GlobalClassicBall = 0;
var ClassicBall = 0;
var ResumeComment = "";
var TitleComment = "";
var razmerComment = "";
var CommentGroupStrof = "";
var RitmComment = "";
var ResumeCommentMini = "";
var disclamer = "";

var user = "";
var user_id = 0;
var email = "";
var userjson = "";
var KonkursHTML = "";
var konkurs_id = -1;
var konkursnameText = "";
var slog = '<div id="slog" >&nbsp;&nbsp;123456789012345</div>';
var indikator = '<img src="https://fet.vpoezii.online/idikator.gif" style="vertical-align: middle; text-align:center;">';
// var  urlimage=document.recordstih.urlimage;
var flagupdaterecord = 0;
var SbornikMasRubrika = [];
var zahod = 0;

// конец объявления глобальных переменных ======================================================


function ontargetpole(targetpole) {
  document.getElementById('ustav_konkurs').style.display = 'none';
  document.getElementById('ustav_music_venec').style.display = 'none';
  var targettext = document.getElementById('targetpole').options[document.getElementById('targetpole').selectedIndex].text;
  document.recordstih.targettext.value = targettext;
}


// предпросмотр иллюстрации -------------------------------
$("#picfile").change(function () {
  readURL(this);
});

window.onload = function () {

// ----------------- загружаем словари -------------------------------------------------------------------------------------------


// считываем параметры урл -----------------

  var paramsString = document.location.search;
  var searchParams = new URLSearchParams(paramsString);

  var project = searchParams.get("project"); // варианты konkurs_pesni, book, zadanie, epigramma, admin
  var type = searchParams.get("type"); // варианты noclassic
  var video = searchParams.get("video");
  var audio = searchParams.get("audio");
  var image = searchParams.get("image");
  var writer = searchParams.get("writer");
  var composer = searchParams.get("composer");
  var musician = searchParams.get("musician");
  var vocalist = searchParams.get("vocalist");
  var soavtor = searchParams.get("soavtor");


  window.project = project;
  window.type = type;
  window.video = video;
  window.audio = audio;
  window.image = image;
  window.writer = writer;
  window.composer = composer;
  window.musician = musician;
  window.vocalist = vocalist;
  window.soavtor = soavtor;


  var konkurs_id = searchParams.get("konkurs_id");
  var screen = searchParams.get("screen");
  var nomination1 = searchParams.get("nomination1");
  var nomination2 = searchParams.get("nomination2");
  var nomination3 = searchParams.get("nomination3");
  var nomination4 = searchParams.get("nomination4");
  var nomination5 = searchParams.get("nomination5");
  var konkurs_title = searchParams.get("title");

  window.konkurs_title = konkurs_title;

  if (screen == "login") {
    loginprofile();
  }
  ;

  if (konkurs_id != "" && konkurs_id != null) {

    var ustav = "https://konkurs.vpoezii.online/ustav.php?konkurs_id=" + konkurs_id;
    var ustav_text = '<p>Согласен с Положением о конкурсе <a href="' + ustav + '" target="_blank">(открыть)</a></p>';
    document.getElementById('ustav').innerHTML = ustav_text;

  }
  ;
  if (nomination1 != "" && nomination1 != null) {

// заменяем рубрики   если есть
    var objRubrika = document.recordstih.rubrika;
    objRubrika.options.length = 0;

    objRubrika.options[0] = new Option(nomination1, nomination1);
    objRubrika.options[1] = new Option(nomination2, nomination2);
    objRubrika.options[2] = new Option(nomination3, nomination3);
    objRubrika.options[3] = new Option(nomination4, nomination4);
    objRubrika.options[4] = new Option(nomination5, nomination5);
  }
  ;

// добавляем цель-название конкурса (если есть)
  if (konkurs_title != "" && konkurs_title != null) {
    var objTarget = document.recordstih.targetpole;
    var lenTarget = objTarget.options.length - 1;
    objTarget.options[lenTarget] = new Option(konkurs_title, konkurs_id);
// и номер конкурса
// document.recordstih.konkurs_id.value=konkurs_id;
    document.recordstih.konkurs_title.value = konkurs_title;

    document.getElementById('konkurs_title_note').innerHTML = "<br>Прямо сейчас вы можете отправить стихи на " + window.konkurs_title + ".";
  }

// примеры для эпиграмм
  if (window.project == 'epigramma') {

    primer = [];

    primer[0] = "СТИХИ ЗАКРУЧЕНЫ КАК КРЕНДЕЛЬ\nИ КРУЧЕ НИХ НА СВЕТЕ НЕТ\nТЫ САМЫЙ ЛУЧШИЙ НА ПЛАНЕТЕ\nПОЭТ";
    primer[1] = "СТИХИ АМФИБРАХИЕМ Я НАПИШУ\nЯ ТЕРТЫЙ КАЛАЧ Я НЕ СТРУШУ\nВ ПОСЛЕДНЕЕ СЛОВО С РАЗМАХУ ВЛОЖУ\nДУШУ";
    primer[2] = "БУБЛИК СОЧИНЮ Я\nПРИГЛАШУ ГОСТЕЙ\nВЕДЬ МОИ ПОДРУГИ\nНА ДИЕТЕ ВСЕ";
    primer[3] = "Я ВАТРУШКУ СОЧИНИЛА\nИ КУСОЧЕК ОТКУСИЛА\nНИКОГО НЕ БУДУ ЖДАТЬ\nБУДУ СРОЧНО ДОЕДАТЬ";
    primer[4] = "Я ПАМПУШКУ СОЧИНИЛА\nЧЕСНОКОМ ЕЁ НАТРУ\nЧТОБЫ ЕЛ ЕЁ МОЙ МИЛЫЙ\nИ НЕ БЕГАЛ ДО ПОДРУГ";
    primer[5] = "КОГДА ГОТОВЛЮ Я ПИРОГ\nЯ ВЕРЮ ЧТО ТВОРЮ ИСКУССТВО\nЯ ВСЕМ КРИЧУ УРА Я СМОГ\nА ВСЕ ЖУЮТ ИМ ПРОСТО ВКУСНО";
    primer[6] = "НА НАШЕМ ФЛОТЕ ПОВЕЛОСЬ\nКОГДА МЫ ВСЕ С ДРУЗЬЯМИ В СБОРЕ\nТО САМЫЙ ЛУЧШИЙ ПЕРВЫЙ ТОСТ\nУ НАС ТАКОЙ ЗА ТЕХ КТО В МОРЕ";

  }


  if (window.project == 'primer') {

    primer = [];

    primer[0] = "Ехали нА трОйке с бубенцАми,\nА вдалИ мелькАли огонькИ.\nЭх, когдА бЫ мнЕ тепЕрь зА вАми,\nдУшу бЫ развЕять От тоскИ…\n\nдорогой длинною, дА нОчью лУнною,\nдА с пЕсней тОй, чтО вдАль летИт, звенЯ.\nИ с тОй старИнною, дА с семистрУнною,\nчтО пО ночАм тАк мУчила менЯ.\n\nдА, выходит пЕли мЫ задАром,\nпонапрАсну нОчь зА нОчью жглИ.\nЕсли мЫ покОнчили сО стАрым,\nтАк И ночи Эти отошлИ.\n\nдорогой длинною, дА нОчью лУнною,\nдА с пЕсней тОй, чтО вдАль летИт, звенЯ.\nИ с тОй старИнною, дА с семистрУнною,\nчтО пО ночАм тАк мУчила менЯ.\n\nЕхали нА трОйке с бубенцАми,\nА вдалИ мелькАли огонькИ.\nЭх, когдА бЫ мнЕ тепЕрь зА вАми,\nдУшу бЫ развЕять От тоскИ…\n\nдорогой длинною, дА нОчью лУнною,\nдА с пЕсней тОй, чтО вдАль летИт, звенЯ.\nИ с тОй старИнною, дА с семистрУнною,\nчтО пО ночАм тАк мУчила менЯ.";


    primer[1] = "Темная ночь, только пули свистят по степи\nТолько ветер гудит в проводах, тускло звезды мерцают\nВ темную ночь ты, любимая, знаю, не спишь\nИ у детской кроватки тайком ты слезу утираешь\n\nКак я люблю глубину твоих ласковых глаз\nКак я хочу к ним прижаться сейчас губами!\n\Темная ночь разделяет, любимая, нас\nИ тревожная, черная степь пролегла между нами\n\nВерю в тебя, дорогую подругу мою\nЭта вера от пули меня темной ночью хранила\nРадостно мне, я спокоен в смертельном бою:\nЗнаю, встретишь с любовью меня, что б со мной ни случилось\n\nСмерть не страшна, с ней не раз мы встречались в степи\nВот и сейчас надо мною она кружится\nТы меня ждешь и у детской кроватки не спишь\nИ поэтому, знаю, со мной ничего не случится!";

    primer[2] = "Когда простым и нежным взором\nЛаскаешь ты меня, мой друг\nНеобычайным, цветным узором\nЗемля и небо вспыхивают вдруг\n\nВеселья час и боль разлуки\nХочу делить с тобой всегда\nДавай пожмём друг другу руки\nИ в дальний путь на долгие года\n\nМы так близки, что слов не нужно\nЧтоб повторять друг другу вновь\nЧто наша нежность и наша дружба\nСильнее страсти, больше чем любовь\n\nВеселья час придёт к нам снова\nВернёшься ты и вот тогда\nТогда дадим друг другу слово\nЧто будем вместе, вместе навсегда\n\nВеселья час и боль разлуки\nХочу делить с тобой всегда\nДавай пожмём друг другу руки\nИ в дальний путь на долгие года";

    primer[3] = "Слышу голос из прекрасного далёка\nГолос утренний в серебряной росе\nСлышу голос и манящая дорога\nКружит голову как в детстве карусель\n\nПрекрасное далёко\nНе будь ко мне жестоко\nНе будь ко мне жестоко\nЖестоко не будь\n\nОт чистого истока\nВ прекрасное далёко\nВ прекрасное далёко\nЯ начинаю путь\n\nСлышу голос из прекрасного далёко\nОн зовет меня в чудесные края\nСлышу голос, голос спрашивает строго:\nА сегодня что для завтра сделал я?\n\nЯ клянусь, что стану чище и добрее\nИ в беде не брошу друга никогда\nСлышу голос - и спешу на зов скорее\nПо дороге, на которой нет следа!"

    primer[4] = "В темно-синем лесу\nГде трепещут осины\nГде с дубов-колдунов\nОблетает листва\nНа поляне траву\nЗайцы в полночь косили\nИ при этом напевали странные слова:\n\nА нам все равно, а нам все равно\nПусть боимся мы волка и сову\nДело есть у нас, в самый жуткий час\nМы волшебную, косим трын-траву\n\nА дубы-колдуны\nЧто-то шепчут в тумане\nИз поганых болот,\nчьи-то тени встают\nКосят зайцы траву,\nтрын-траву на поляне\nИ от страха все быстрее Песенку поют:\n\nА нам все равно, а нам все равно\nТвердо верим мы в древнюю молву\nСильным станет тот, кто три раза в год\nВ самый жуткий час Косит трын-траву\n\nА нам все равно, а нам все равно\nСтанем мы храбрей и отважней льва\nУстоим хоть раз В самый жуткий час\nВсе напасти нам будут трын-трава";

    primer[5] = "Если вы, нахмурясь\nВыйдете из дома\nЕсли вам не в радость\nСолнечный денёк\nПусть вам улыбнётся\nКак своей знакомой\nС вами вовсе незнакомый\nВстречный паренёк\n\nИ улыбка без сомненья\nВдруг коснётся ваших глаз\nИ хорошее настроение\nНе покинет больше вас!\n\nЕсли вас с любимой\nВдруг поссорил случай\nЧасто тот, кто любит\nСсорится зазря\nВы в глаза друг другу\nПоглядите лучше\nЛучше всяких слов порою\nВзгляды говорят\n\nИ улыбка без сомненья\nВдруг коснётся ваших глаз\nИ хорошее настроение\nНе покинет больше вас!\n\nЕсли кто-то другом\nБыл в несчастье брошен\nИ поступок этот\nВ сердце вам проник\nВспомните, как много\nЕсть людей хороших\nИх у нас гораздо больше\nВспомните про них\n\nИ улыбка без сомненья\n Вдруг коснётся ваших глаз\nИ хорошее настроение\nНе покинет больше вас!"

    primer[6] = "нЕ срАзу всЕ устрОилось,\nмосквА нЕ срАзу стрОилась\nмосквА слезАм нЕ вЕрила, \nА вЕрила любвИ\nснегАми запорОшена,\nлиствОю заворОжена\nнайдЕт теплО прохОжему,\nА дЕревцу - землИ\n\nалексАндра, алексАндра,\nЭтот гОрод нАш с тобОю\nстАли мЫ егО судьбОю -\nтЫ вглядИсь в егО лицО\nчтОбы нИ было вначАле,\nутолИт Он всЕ печАли\nвОт И стАло обручАльным\nнАм садОвое кольцО!\n\nмосквУ рябИны крАсили,\nдубЫ стоЯли кнЯзями\nнО нЕ онИ, А Ясени \nбЕз спрОсу нарослИ\nмосквА нЕ зрЯ надЕется,\nчтО всЯ в листвУ одЕнется\nмосквА найдЕт длЯ дЕревца \nхОть крАешек землИ\n\nалексАндра, алексАндра,\nчтО тАм вьЕтся перед нАми?\nЭто Ясень семенАми\nкрУжит вАльс нАд мостовОй\nЯсень с вИдом деревЕнским\nприобщИлся к вАльсам вЕнским\nОн пробьЕтся, алексАндра,\nОн надЫшится москвОй\n\nмосквА тревОг нЕ прЯтала,\nмосквА видАла всЯкое\nнО беды всЕ И гОрести \nсклонЯлись перед нЕй\nлюбОвь москвЫ нЕ бЫстрая,\nнО вЕрная И чИстая\nпоскОльку матерИнская \nлюбОвь другИх сильнЕй\n\nалексАндра, алексАндра,\nЭтот гОрод нАш с тобОю\nстАли мЫ его судьбОю -\nтЫ вглядИсь в егО лицО\nчтОбы нИ было вначАле,\nутолИт Он всЕ печАли\nвОт И стАло обручАльным\nнАм садОвое кольцО!";

  }

  if (window.project == 'zadanie') {
    ReadZadanie();
    LentaClear1
  }
  ;


  if (window.project != 'zadanie') {
    LoadPrimer();
  }
  ; // ----------------- загружаем примеры


  Load_slovar_full_accent(); // ----------------- загружаем полный словарь ударений

  LoadSlovarE(); // ----------------- загружаем словарь Ё

// Load_slovar_narod_accent(); // ----------------- загружаем народный словарь ударений

// Load_slovar_classic_accent(); // ----------------- загружаем классический словарь ударений

// Load_slovar_neoclassic_accent(); // ----------------- загружаем неоклассический словарь ударений


}