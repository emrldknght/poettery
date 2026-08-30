import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import * as vm from "node:vm";
import {MOCK_DOM} from "./jsDom";

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
g.LentaMode = g.document.getElementById('LentaMode');
g.SaveRecord = g.document.getElementById('SaveRecord');

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
  g.Ritm = [];
  g.TemplateGlasn = "";
  g.BlockRitmTemplate = "";
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

  try {
    g.LayerAnaliz();
    console.log('[DEBUG] LayerAnaliz завершился успешно');
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
  const resumeFlag = parseFlag(g.ResumeCommentMini || '');

  // console.log('[DEBUG] g.Ritmstring:', g.Ritmstring);
  // console.log('[DEBUG] g._TempRitmstring:', g._TempRitmstring);
  // console.log('[DEBUG] g._TempFullRifmMas:', g._TempFullRifmMas);
  // console.log('[DEBUG] g.flagRitmBall:', g._TempFlagfRitmBall);
  // console.log('[DEBUG] g._TempTriCodeRitm:', g._TempTriCodeRitm);

  // console.log('[DEBUG] g.CountSlogBlue:', g.CountSlogBlue);
  // console.log('[DEBUG] g.CountSlogBlack:', g.CountSlogBlack);
  // console.log('[DEBUG] g.CountSlogSer:', g.CountSlogSer);

  console.log('[DEBUG] g.ContainerFlag1Report:', g.ContainerFlag1Report);
  console.log('[DEBUG] g.flagStrofa:', g.flagStrofa);

  const flagPassed = (g.ClassicBall || 0) >= 2 && (g.window?.flagStrofaRazbita ?? g.flagStrofaRazbita ?? 0) === 0;
  const flagValue = ((g.ClassicBall || 0) >= 2 && (g.window?.flagStrofaRazbita ?? g.flagStrofaRazbita ?? 0) === 0) ? '✓' : 'X'

  return {
    containerFlag1: g.SbornikContainerFlag1Report || "",

    accentedText: textArea ? textArea.value : text,

    stats: {
      total: g.CountSlog || 0,
      blue: g.CountSlogBlue || 0,
      gray: g.CountSlogSer || 0,
      black: g.CountSlogBlack || 0,
    },

    structure: {
      size: (g.StrofaPatternMas && g.StrofaPatternMas[1]) ? g.StrofaPatternMas[1].trim() : "",
      rhythmString: g.RitmReport || g._TempRitmstring || "",
      rhythm: cleanArray(g.Ritm || []).map(Number),
      vowelTemplates: cleanArray(g.TemplateGlasnMas || []),
      accentTemplates: (g.TemplateAccent || '')
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0),
      numGlasTemplates: cleanArray(g.TemplateNumGlasMas || []),
      rhythmContrast: {
        plus: g.ritmkontrastplus || "",
        minus: g.ritmkontrastminus || "",
      },
      triCode: g._TempTriCodeRitm,
    },

    rhymes: {
      words: trimArray(g.SlovaRifmMas || []),
      // sounds: cleanArray(g.FullRifmMas || []),
      sounds: cleanArray(g.FullRifmMas || g._TempFullRifmMas || []),
      type: g.rifmovkatext || "",
      typeCode: g.rifmovkatype || "",
      scheme: g.rifmovkalong || "",
    },

    scoring: {
      classicBall: g.ClassicBall || 0,
      tonicBall: g.tonicBall || 0,
      rhythmBall: g._TempFlagRitmBall || 0,
      rhymeBall: g.flagRifmBall || 0,
      accentBall: g.flagAccentBall || 0,
      groupStrofaBall: g.flagGroupStrofaBall || 0,
      rhythmErrors: g.flagCountRitmError || 0,
      rhymeErrors: g.flagCountErrorRifma || 0,
      isStrofaBroken: g.window?.flagStrofaRazbita ?? g.flagStrofaRazbita ?? 0,
      uniqueStrof: g.UnicStrof || 0,
      percentSecondarySyllables: g.ProcentCountSlogSer || 0,
    },

    comments: {
      resume: g.ResumeComment || "",
      resumeMini: resumeFlag.text,
      lentaModeResume: g.ResumeLentaMode || "",
      rhythm: g.RitmComment || "",
      rhyme: g.RifmComment || "",
      stopa: g.CommentStopa || g._TempCommentStopa || "",
    },

    legend: {
      blue: { code: 0, label: 'БЕЗУДАРНЫЕ ГЛАСНЫЕ', count: g.CountSlogBlue || 0 },
      gray: { code: 1, label: 'СЛАБОУДАРНЫЕ ГЛАСНЫЕ', count: g.CountSlogSer || 0 },
      black: { code: 2, label: 'УДАРНЫЕ ГЛАСНЫЕ', count: g.CountSlogBlack || 0 },
    },

    flags: {
      passed: flagPassed, // resumeFlag.passed,
      flag: flagValue, // resumeFlag.flag,
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