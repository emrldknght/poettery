import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import * as vm from "node:vm";
import {MOCK_DOM} from "./jsDom";
import {createLegacyState} from "./createFetoState";

let currentRawState: any = null;
export function getRawState() {
  return currentRawState;
}

// ИСПРАВЛЕНИЕ ПУТИ: __dirname указывает на папку lib, поднимаемся на 2 уровня вверх и идём в client
const FETO_DIR = path.resolve(__dirname, '../../../client/src/shared/feto');

// 1. ПОЛНЫЙ HTML (не пустой!)
const dom = new JSDOM(MOCK_DOM, { url: 'http://localhost' });

// 2. Глобальные переменные
const g = global as any;
g.document = dom.window.document;
g.window = dom.window;
// g.window.onload = null;

// === ИСПРАВЛЕНИЕ: Явная эмуляция document.formName для legacy-кода в JSDOM ===
const formEl = g.document.querySelector('form[name="formStih1"]');
if (formEl) {
  g.document.formStih1 = formEl;
  // На всякий случай явно прокидываем и поле TextStih
  (g.document.formStih1 as any).TextStih = formEl.querySelector('textarea[name="TextStih"]');
}
// ============================================================================
// === ИСПРАВЛЕНИЕ: Явная эмуляция form.TextStih для legacy-кода в JSDOM ===
// Находим ВСЕ формы и явно добавляем им свойство TextStih, указывающее на textarea внутри них
const allForms = g.document.querySelectorAll('form');
allForms.forEach((form: any) => {
  form.TextStih = form.querySelector('textarea[name="TextStih"]');
});
// ============================================================================

// Фикс для Node.js 22 (navigator read-only)
Object.defineProperty(g, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true
});

// fix fir ids
// g.LentaMode = g.document.getElementById('LentaMode');
// g.SaveRecord = g.document.getElementById('SaveRecord');

g.$ = () => ({ change: () => {}, attr: () => {}, text: () => '', val: () => '', html: () => '', css: () => ({}) });
g.confirm = () => false;
g.performance = { now: () => Date.now() };



// 4. Загрузка всех JS-файлов из папки feto (с исключениями)
const EXCLUDE = [
  // 'script.js',
  'test', 'convert', 'fetoAdapter.ts'
];

const files = fs.readdirSync(FETO_DIR).filter(f => {
  // Проверяем расширение .js
  if (!f.endsWith('.js')) return false;

  // Проверяем на исключения
  for (const exclude of EXCLUDE) {
    if (f.includes(exclude)) return false;
  }

  return true;
});

console.log(`[FETO] Загружаем ${files.length} файлов...`);
console.log(`[FETO] Исключены: ${EXCLUDE.join(', ')}`);

let code = '';
for (const file of files) {
  const content = fs.readFileSync(path.join(FETO_DIR, file), 'utf-8');

  const patchedContent = content
    .replace(/console\.log\s*\(/g, '(function(){})(')
    .replace(/console\.error\s*\(/g, '(function(){})(')
    .replace(/console\.warn\s*\(/g, '(function(){})(')
    .replace(/console\.info\s*\(/g, '(function(){})(')
    .replace(/console\.time\s*\(/g, '(function(){})(')
    .replace(/console\.timeEnd\s*\(/g, '(function(){})(')
    .replace(/console\.timeLog\s*\(/g, '(function(){})(');

  code += content.replace(/export\s+/g, '').replace(/import\s+.*?from\s+['"].*?['"];?/g, '') + '\n';

}

/*
const script = new dom.window.Function(code);
script();

console.log('[FETO] Все функции загружены');
 */
// Подавляем console.log оригинального кода
const realConsole = console;
const silentConsole = {
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  time: () => {},
  timeEnd: () => {},
  timeLog: () => {}
};
g.console = silentConsole;
g.window.console = silentConsole;

try {
  vm.createContext(g);
  vm.runInContext(code, g);
} catch (err) {
  // Если ошибка, используем realConsole, чтобы мы её увидели
  realConsole.error('[FETO] КРИТИЧЕСКАЯ ОШИБКА при выполнении кода в VM:', err);
  process.exit(1);
}

// возвращаем нормальный console для нашего кода
g.console = realConsole;
g.window.console = realConsole;

console.log('[FETO] Все функции загружены. Проверка LayerAnaliz:', typeof g.LayerAnaliz);

// 3. Загрузка словарей
console.log('[FETO] Загрузка словарей...');
const accentContent = fs.readFileSync(path.join(FETO_DIR, 'slovar_full_accent.txt'), 'utf-8');
const yoContent = fs.readFileSync(path.join(FETO_DIR, 'slovar_Yo.txt'), 'utf-8');

g.slovar_accent_Mas = accentContent.split(',');
g.slovar_noaccent_Mas = accentContent.toLowerCase().split(',');
g.slovar_E_Mas = yoContent.split(',');
g.slovar_noaccent_E_Mas = yoContent.toLowerCase().split(',');



console.log(`[FETO] Словари загружены: ${g.slovar_accent_Mas.length} слов`);

// 5. Функция анализа
export function analyzePoemWithFeto(text: string) {
  // g.Ritm = [];
  // g.TemplateGlasn = "";
  // g.BlockRitmTemplate = "";
  g.CountSlog = 0;
  g.CountSlogSer = 0;
  g.CountSlogBlue = 0;
  g.CountSlogBlack = 0;
  g.ClassicBall = 0;
  g.window.ClassicBall = 0;

  dom.window.document.getElementById('ContainerTemplate1')!.innerHTML = '';
  dom.window.document.getElementById('ContainerAnaliz1')!.innerHTML = '';
  dom.window.document.getElementById('ContainerComment1')!.innerHTML = '';
  dom.window.document.getElementById('ContainerFlag1')!.innerHTML = '';

  /*
  const textArea = dom.window.document.querySelector('form[name="formStih1"] textarea[name="TextStih"]') as any;
  textArea.value = text;
   */

  g.window.onload = null;

  const textArea = g.document.querySelector('form[name="formStih1"] textarea[name="TextStih"]');
  if (textArea) {
    textArea.value = text;
  }

  // dom.window.document.formStih1.TextStih.value = text;
  g.FileAccent = { checked: false };

  console.log('[DEBUG] typeof AnalizRazmera:', typeof g.AnalizRazmera);
  console.log('[DEBUG] typeof ClassicAnaliz:', typeof g.ClassicAnaliz);
  console.log('[DEBUG] level-full checked:', g.document.getElementById('level-full')?.checked);
  console.log('[DEBUG] level-tonic checked:', g.document.getElementById('level-tonic')?.checked);

  console.log('[DEBUG] Перед вызовом LayerAnaliz');
  console.log('[DEBUG] text в textarea:', g.TextArea);


  // integrate new state -
  const state = createLegacyState();
  currentRawState = state;

  state.OriginalTextInput = text;

  state.slovar_accent_Mas = accentContent.split(',');
  state.slovar_noaccent_Mas = accentContent.toLowerCase().split(',');
  state.slovar_E_Mas = yoContent.split(',');
  state.slovar_noaccent_E_Mas = yoContent.toLowerCase().split(',');



  try {
    g.LayerAnaliz(state);
    console.log('[DEBUG] LayerAnaliz завершился успешно');

    // g.FullAnaliz(state);
    // console.log('[DEBUG] FullAnaliz завершился успешно');
  } catch (error) {
    console.error('[DEBUG] Ошибка в LayerAnaliz:', error);
  }

  /*
  g.DelSpace();
  g.AnalizRazmera();
  g.CreateTemplateAccent();
  g.CreateBlockRitm();
   */

  // Вспомогательные функции
  const cleanArray = (arr: any[]) => (arr || []).filter((item) => item !== undefined && item !== "");
  const trimArray = (arr: any[]) => cleanArray(arr).map((item) => typeof item === 'string' ? item.trim() : item);

  // Парсинг HTML-флага из ResumeCommentMini: извлекаем X или ✓
  const parseFlag = (html: string): { passed: boolean; flag: string; text: string } => {
    console.log('[DEBUG] parseFlag:', html);
    if (!html) return { passed: true, flag: '', text: '' };
    const hasX = html.includes('>X<') || html.includes('>X&nbsp;');
    const hasCheck = html.includes('>✓<') || html.includes('>✓&nbsp;');
    const cleanText = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    return {
      passed: !hasX && hasCheck,
      flag: hasX ? 'X' : (hasCheck ? '✓' : ''),
      text: cleanText
    };
  };

  // const textArea = g.document.querySelector('form[name="formStih1"] textarea[name="TextStih"]');
  const resumeFlag = parseFlag(state.ResumeCommentMini || '');

  // console.log('[DEBUG] g.Ritmstring:', g.Ritmstring);
  // console.log('[DEBUG] g._TempRitmstring:', g._TempRitmstring);
  // console.log('[DEBUG] g._TempFullRifmMas:', g._TempFullRifmMas);
  // console.log('[DEBUG] g.flagRitmBall:', g._TempFlagfRitmBall);
  // console.log('[DEBUG] g._TempTriCodeRitm:', g._TempTriCodeRitm);

  // console.log('[DEBUG] g.CountSlogBlue:', g.CountSlogBlue);
  // console.log('[DEBUG] g.CountSlogBlack:', g.CountSlogBlack);
  // console.log('[DEBUG] g.CountSlogSer:', g.CountSlogSer);

  // console.log('[DEBUG] state.ContainerFlag1Report:', state.ContainerFlag1Report);

  const flagPassed = (state.ClassicBall || 0) >= 2 && (state.flagStrofaRazbita ?? 0) === 0;
  const flagValue = ((state.ClassicBall || 0) >= 2 && (state.flagStrofaRazbita ?? 0) === 0) ? '✓' : 'X'

  console.log('[DEBUG] state.RitmReport:', state.RitmReport);

  return {
    containerFlag1: state.SbornikContainerFlag1Report || "",

    accentedText: state.OriginalTextInput, // textArea ? textArea.value : text,

    stats: {
      total: state.CountSlog || 0,
      blue: state.CountSlogBlue || 0,
      gray: state.CountSlogSer || 0,
      black: state.CountSlogBlack || 0,
    },

    structure: {
      size: (state.StrofaPatternMas && state.StrofaPatternMas[1]) ? state.StrofaPatternMas[1].trim() : "",
      rhythmString: state.RitmReport || "", // || g._TempRitmstring ||
      rhythm: cleanArray(state.Ritm || []).map(Number),
      vowelTemplates: cleanArray(state.TemplateGlasnMas || []),
      accentTemplates: (state.TemplateAccent || '')
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0),
      numGlasTemplates: cleanArray(state.TemplateNumGlasMas || []),
      rhythmContrast: {
        plus: state.ritmkontrastplus || "",
        minus: state.ritmkontrastminus || "",
      },
      triCode: state._TempTriCodeRitm,

      // additional blocks
      // BlockRitmTemplate: state.BlockRitmTemplate,
      // BlockRitmTemplateMas: cleanArray(state.BlockRitmTemplateMas || []),
      // StrofaPatternMas: state.StrofaPatternMas,
      StrofaPatternTypeMas: state.StrofaPatternTypeMas,
      StrofaRepeatTypeMas: state.StrofaRepeatTypeMas,
      StrofaPositionMas:  state.StrofaPositionMas,
      ResumeComment: state.ResumeComment,
      ResumeCommentMini: state.ResumeCommentMini,
      razmerComment: state.razmerComment,
      ReportMas: state.ReportMas,
      GlobalflagRitmBallMas: state.GlobalflagRitmBallMas,
    },

    rhymes: {
      words: trimArray(state.SlovaRifmMas || []),
      // sounds: cleanArray(g.FullRifmMas || []),
      sounds: cleanArray(state._TempFullRifmMas || []), // state.FullRifmMas ||
      type: state.rifmovkatext || "",
      typeCode: state.rifmovkatype || "",
      scheme: state.rifmovkalong || "",
    },

    scoring: {
      classicBall: state.ClassicBall || 0,
      tonicBall: state.tonicBall || 0,
      rhythmBall: state._TempFlagRitmBall || 0,
      rhymeBall: state.flagRifmBall || 0,
      accentBall: state.flagAccentBall || 0,
      groupStrofaBall: state.flagGroupStrofaBall || 0,
      rhythmErrors: state.flagCountRitmError || 0,
      rhymeErrors: state.flagCountErrorRifma || 0,
      isStrofaBroken: state.flagStrofaRazbita || 0,
      uniqueStrof: state.UnicStrof || 0,
      percentSecondarySyllables: state.ProcentCountSlogSer || 0,
    },

    comments: {
      resume: state.ResumeComment || "",
      resumeMini: resumeFlag.text,
      lentaModeResume: state.ResumeLentaMode || "",
      rhythm: state.RitmComment || "",
      rhyme: state.RifmComment || "",
      stopa: state._TempCommentStopa || "", // state.CommentStopa ||
    },

    legend: {
      blue: { code: 0, label: 'БЕЗУДАРНЫЕ ГЛАСНЫЕ', count: state.CountSlogBlue || 0 },
      gray: { code: 1, label: 'СЛАБОУДАРНЫЕ ГЛАСНЫЕ', count: state.CountSlogSer || 0 },
      black: { code: 2, label: 'УДАРНЫЕ ГЛАСНЫЕ', count: state.CountSlogBlack || 0 },
    },

    flags: {
      passed: flagPassed, // resumeFlag.passed,
      flag: flagValue, // resumeFlag.flag,
    },

    dom: {
      // ContainerTemplate1: state.ContainerTemplate1, // ok
      ContainerAnaliz1: state.ContainerAnaliz1,
      ContainerAnaliz1f: state.ContainerAnaliz1f,
      ContainerComment0: state.ContainerComment0,
      ContainerComment1: state.ContainerComment1,
      ContainerFlag1: state.ContainerFlag1,
    }
  };

  /*
  return {
    accentedText: textArea.value, // dom.window.document.formStih1.TextStih.value,
    templateHtml: dom.window.document.getElementById('ContainerTemplate1')!.innerHTML,
    stats: {
      total: g.CountSlog,
      blue: g.CountSlogBlue,
      gray: g.CountSlogSer,
      black: g.CountSlogBlack,
    }
  };
   */
}