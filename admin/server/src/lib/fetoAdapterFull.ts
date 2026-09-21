import fs from 'fs';
import path from 'path';
import {createLegacyState} from "./createFetoState";
// @ts-ignore
import { LayerAnaliz } from '../../../client/src/shared/feto/layerAnaliz.js';

let currentRawState: any = null;
export function getRawState() {
  return currentRawState;
}

// ИСПРАВЛЕНИЕ ПУТИ: __dirname указывает на папку lib, поднимаемся на 2 уровня вверх и идём в client
const FETO_DIR = path.resolve(__dirname, '../../../client/src/shared/feto');

// 3. Загрузка словарей
console.log('[FETO] Загрузка словарей...');
const accentContent = fs.readFileSync(path.join(FETO_DIR, 'slovar_full_accent.txt'), 'utf-8');
const yoContent = fs.readFileSync(path.join(FETO_DIR, 'slovar_Yo.txt'), 'utf-8');

// 5. Функция анализа
export function analyzePoemWithFetoFull(text: string) {

  console.log('[DEBUG] Перед вызовом LayerAnaliz');

  // integrate new state -
  const state = createLegacyState();
  currentRawState = state;

  state.OriginalTextInput = text;

  state.slovar_accent_Mas = accentContent.split(',');
  state.slovar_noaccent_Mas = accentContent.toLowerCase().split(',');
  state.slovar_E_Mas = yoContent.split(',');
  state.slovar_noaccent_E_Mas = yoContent.toLowerCase().split(',');



  try {
    LayerAnaliz(state);
    console.log('[DEBUG] LayerAnaliz завершился успешно');

    // console.log('[DEBUG] FullAnaliz завершился успешно');
  } catch (error) {
    console.error('[DEBUG] Ошибка в LayerAnaliz:', error);
  }

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

  const flagPassed = (state.ClassicBall || 0) >= 2 && (state.flagStrofaRazbita ?? 0) === 0;
  const flagValue = ((state.ClassicBall || 0) >= 2 && (state.flagStrofaRazbita ?? 0) === 0) ? '✓' : 'X'

  console.log('[DEBUG] state.RitmReport:', state.RitmReport);

  return {
    containerFlag1: state.SbornikContainerFlag1Report || "",
    AccentedFragments: state.AccentedFragments,

    accentedText: state.OriginalTextInput, // textArea ? textArea.value : text,

    stats: {
      total: state.CountSlog || 0,
      blue: state.CountSlogBlue || 0,
      gray: state.CountSlogSer || 0,
      black: state.CountSlogBlack || 0,
    },

    structure: {
      size: (state.StrofaPatternMas && state.StrofaPatternMas[1]) ? state.StrofaPatternMas[1].trim() : "",
      rhythmString: state.RitmReport || "",
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