/* Структурный анализ русского стиха: столбцовые профили (силлабо-тоника) + тоника.
   Соглашение об ударениях: ЗАГЛАВНАЯ гласная или U+0301. Без зависимостей, без DOM. */

export const PROSODY_BUILD = 'build 4 · whole-poem profile';

const VOWELS = 'аеёиоуыэюя';
const UPPER = 'АЕЁИОУЫЭЮЯ';
const ACUTE = '\u0301';

const isVowel = (c) => !!c && VOWELS.includes(c.toLowerCase());
const isUpperVowel = (c) => !!c && UPPER.includes(c);
const stripAcute = (s) => String(s || '').replace(/\u0301/g, '');

const WORD_RE = /[а-яёА-ЯЁ\u0301]+/g;

const FOLD = { Я: 'А', Ю: 'У', Ё: 'О', Е: 'Э', Ы: 'И' };

const IDEALS = [
  { id: 'iamb', name: 'ямб', period: 2, unit: '13' },
  { id: 'trochee', name: 'хорей', period: 2, unit: '31' },
  { id: 'anapest', name: 'анапест', period: 3, unit: '113' },
  { id: 'amphibrach', name: 'амфибрахий', period: 3, unit: '131' },
  { id: 'dactyl', name: 'дактиль', period: 3, unit: '311' },
];

const SCHEME_TEXT = {
  1: 'полная',
  2: 'смежная',
  3: 'перекрёстная',
  4: 'кольцевая',
  6: 'полуперекрёстная',
};

const BALL_TEXT = [
  'Не соответствует канонам классического стихосложения',
  'Не совсем классическая структура',
  'Практически классическая структура',
  'Соответствует канонам классического стихосложения',
];

const STARTER = `
любОвь крОвь нОчь душА тоскА окнО лунА звездА водА огОнь сЕрдце сОлнце
вЕтер нЕбо мОре пОле дорОга пАмять слезА мечтА тишинА веснА зимА Осень
лЕто Утро вЕчер дЕнь свЕт тЕнь сОн бОль рАдость гОре счАстье судьбА разлУка
встрЕча слОво гОлос пЕсня мУзыка гитАра струнА аккОрд рИтм строкА рИфма
поЭт стихИ молчАнье дыхАнье свидАнье прощАнье желАнье страдАнье надЕжда
одИн остАться вернУться проснУться забЫть запомнить уснУть молчАть кричАть
дышАть летЕть идтИ бежАть стоЯть смотрЕть видЕть слышать знАть помнить
холОдный тЁплый свЕтлый тёмный дАльний бОльшой малЕнький нОвый стАрый
дорОгой роднОй чужОй живОй мертвЫй пустОй полнЫй тИхий грОмкий
сегОдня вчерА завтрА тепЕрь никогдА всегдА опЯть снОва вновЬ
гОрод дОм сад лес снег дождь грОза тумАн рассвЕт закАт горизОнт
берёза осИна дуб клён травА цветОк листОк корЕнь ветвь
рукА ногА глазА губЫ плечО спинА грудь ладОнь пАлец
мать отЕц сын дочь брат сестрА друг враг челОвек людИ
бОг Ангел дЕмон рай ад вЕчность миг век год час минутА
`;

export function createDictionary(csv) {
  const map = new Map();
  String(csv || '')
    .split(/[,\n]/)
    .forEach((raw) => {
      const word = raw.trim();
      if (!word) return;
      map.set(stripAcute(word).toLowerCase(), word);
    });
  return map;
}

const STARTER_DICT = createDictionary(STARTER);

/* ---------- разбор строки ---------- */

function scanLine(raw, start) {
  const vowels = [];
  const unmarked = [];
  let template = '';
  let numGlas = '';
  let match;

  WORD_RE.lastIndex = 0;
  while ((match = WORD_RE.exec(raw)) !== null) {
    const word = match[0];
    const clean = stripAcute(word);
    const positions = [];

    for (let i = 0; i < word.length; i += 1) {
      if (isVowel(word[i])) positions.push(i);
    }
    if (!positions.length) continue;

    let marked = -1;
    for (let v = 0; v < positions.length; v += 1) {
      if (word[positions[v] + 1] === ACUTE) { marked = v; break; }
    }
    if (marked < 0) {
      for (let v = 0; v < positions.length; v += 1) {
        if (isUpperVowel(word[positions[v]])) { marked = v; break; }
      }
    }

    positions.forEach((vi, v) => {
      const local = match.index + vi;
      vowels.push({
        pos: start + local,
        local,
        char: raw[local],
        ordinal: v + 1,
        vowelCount: positions.length,
        word: clean,
        marked: v === marked,
      });
      if (marked >= 0) template += v === marked ? 'О' : '.';
      else template += positions.length === 1 ? ':' : '.';
      numGlas += String(v + 1);
    });

    if (marked < 0 && positions.length > 1) unmarked.push(clean.toLowerCase());
  }

  return {
    raw,
    start,
    vowels,
    template,
    numGlas,
    syllables: vowels.length,
    unmarked,
  };
}

/* ---------- столбцовый профиль (TemplateAnaliz) ---------- */

function columnProfile(templates) {
  const width = templates.reduce((max, t) => Math.max(max, t.length), 0);
  const ritm = [];
  const errorColumns = [];
  const columns = [];

  for (let k = 0; k < width; k += 1) {
    let strong = 0;
    let weak = 0;
    let light = 0;
    let real = 0;

    for (const t of templates) {
      const ch = t[k];
      if (ch === undefined) continue;
      real += 1;
      if (ch === 'О') strong += 1;
      else if (ch === ':') weak += 1;
      else light += 1;
    }

    const col = k + 1;
    const strongWeak = weak + strong;
    const lightWeak = light + weak;

    let type;
    let reason;
    let error = false;

    if (real === 0) {
      type = 1; reason = 'пустой столбец';
    } else if (strong > real * 0.8 && strongWeak !== real) {
      type = 3; reason = 'больше 80% ударных';
    } else if (light > real * 0.8 && strong > 0) {
      type = 1; reason = 'сбой ритма'; error = true; errorColumns.push(k);
    } else if (strong === 0) {
      type = 1; reason = 'ударных нет';
    } else if (strongWeak === real) {
      type = 3; reason = 'все ударные или односложные';
    } else if (lightWeak === real) {
      type = 1; reason = 'ударных нет';
    } else if (strong > real * 0.3 && strongWeak > real * 0.4) {
      type = 2; reason = 'частично ударный';
    } else {
      type = 2; reason = 'смешанный';
    }

    ritm[col] = type;
    columns.push({ index: col, strong, weak, light, real, type, reason, error });
  }

  return { ritm, errorColumns, width, columns };
}

/* ---------- SecondTemplateAnaliz ---------- */

function secondPass(templates, numGlasList, glasnList, ritm) {
  const nextTemplates = [];
  const nextGlasn = [];

  for (let s = 0; s < templates.length; s += 1) {
    const tpl = templates[s];
    const ng = numGlasList[s] || '';
    const gl = glasnList[s] || '';

    let outTpl = '';
    let outGl = '';

    for (let k = 0; k < tpl.length; k += 1) {
      let mark = tpl[k];
      let letter = gl[k] || '';
      const col = k + 1;

      if (mark === ':' && ritm[col] === 3) mark = 'О';
      if (mark === ':' && ritm[col] === 1) mark = '.';

      if (
        ritm[col] === 1 &&
        ritm[col + 1] === 1 &&
        ng[k] === '1' &&
        ng[k + 1] === '2' &&
        ng[k + 2] === '1'
      ) {
        mark = '.';
        letter = letter.toLowerCase();
      }

      if (
        ritm[col] === 1 &&
        ritm[col - 1] === 1 &&
        ng[k] === '2' &&
        ng[k + 1] === '1'
      ) {
        mark = '.';
        letter = letter.toLowerCase();
      }

      outTpl += mark;
      outGl += letter;
    }

    nextTemplates.push(outTpl);
    nextGlasn.push(outGl);
  }

  return { templates: nextTemplates, glasn: nextGlasn };
}

function buildRhythm(lines) {
  let templates = lines.map((l) => l.template);
  let glasn = lines.map((l) => l.vowels.map((v) => v.char).join(''));
  const numGlasList = lines.map((l) => l.numGlas);

  let profile = columnProfile(templates);
  let pass = secondPass(templates, numGlasList, glasn, profile.ritm);
  templates = pass.templates;
  glasn = pass.glasn;

  profile = columnProfile(templates);
  pass = secondPass(templates, numGlasList, glasn, profile.ritm);
  templates = pass.templates;
  glasn = pass.glasn;

  return {
    ritm: profile.ritm,
    errorColumns: profile.errorColumns,
    width: profile.width,
    columns: profile.columns,
    templates,
    glasn,
  };
}

/* ---------- ритм: стопы, балл, троичный код, свёртка ---------- */

function rhythmStats(ritm, width) {
  let strong = 0;
  let weak = 0;
  let light = 0;
  let foot = 0;
  let strongFoot = 0;
  let triCod = '';

  for (let col = 1; col <= width; col += 1) {
    const value = ritm[col];
    const prev = ritm[col - 1];

    if (value === 3) strong += 1;
    if (value === 2) weak += 1;
    if (value === 1) {
      light += 1;
      if (prev === 2) foot += 1;
      if (prev === 3) strongFoot += 1;
    }

    triCod += value === 1 ? '0' : value === 2 ? '1' : '2';
  }

  const countStop = foot + strongFoot;
  let ball = 0;
  if (countStop > 1) ball = 1;
  if (countStop > width * 0.3) ball = 2;
  if (strongFoot > 1 || strong > 1) ball = 3;

  return { ball, countStop, foot, strongFoot, strong, weak, light, triCod };
}

function contrastLayers(ritm, width, ball) {
  if (!width) return { plus: '', minus: '' };

  const source = [];
  for (let col = 1; col <= width; col += 1) source.push(ritm[col]);

  let plus = source.slice();

  if (ball > 1) {
    const padded = [2, ...source, 2];
    for (let k = 1; k < padded.length - 1; k += 1) {
      if (padded[k] !== 2) continue;
      if (padded[k + 1] === 3) { padded[k] = 1; continue; }
      if (padded[k - 1] === 3) { padded[k] = 1; continue; }
      if (padded[k - 1] === 1 && padded[k + 1] === 1) padded[k] = 3;
    }
    plus = padded.slice(1, -1);
  }

  return {
    plus: plus.join(''),
    minus: source.map((v) => (v === 2 ? 1 : v)).join(''),
  };
}

/* ---------- греческие названия ---------- */

function greekName(ritm, width) {
  if (!width) return null;

  let actual = '';
  for (let col = 1; col <= width; col += 1) actual += String(ritm[col]);

  let best = null;
  for (const ideal of IDEALS) {
    let expected = '';
    while (expected.length < actual.length) expected += ideal.unit;
    expected = expected.slice(0, actual.length);

    if (actual === expected) {
      const feet = Math.floor(actual.length / ideal.period);
      return {
        id: ideal.id,
        name: ideal.name,
        feet,
        exact: true,
        label: `Классический ${feet}-стопный ${ideal.name}`,
      };
    }

    let hit = 0;
    let checked = 0;
    for (let k = 0; k < actual.length; k += 1) {
      if (actual[k] === '2') continue;
      checked += 1;
      if (actual[k] === expected[k]) hit += 1;
    }
    const ratio = checked ? hit / checked : 0;
    if (!best || ratio > best.ratio) {
      best = {
        id: ideal.id,
        name: ideal.name,
        feet: Math.floor(actual.length / ideal.period),
        exact: false,
        ratio,
      };
    }
  }

  if (!best) return null;
  return {
    ...best,
    label: `Не классический ${best.name} (совпадение ${Math.round(best.ratio * 100)}%)`,
  };
}

/* ---------- рифма ---------- */

function foldVowel(char) {
  const upper = String(char || '').toUpperCase();
  return FOLD[upper] || upper;
}

function rhymeOfStanza(lines) {
  const folded = lines.map((line) => line.rhymeVowel || '');
  const counts = new Map();
  folded.forEach((v) => { if (v) counts.set(v, (counts.get(v) || 0) + 1); });

  const letters = [];
  const assigned = new Map();
  const alphabet = 'ABCDEFGH';
  let next = 0;
  let unrhymed = 0;

  lines.forEach((line, i) => {
    const v = folded[i];
    if (!v) { letters.push('–'); unrhymed += 1; return; }
    if ((counts.get(v) || 0) < 2) unrhymed += 1;
    if (!assigned.has(v)) {
      assigned.set(v, alphabet[next % alphabet.length]);
      next += 1;
    }
    const letter = assigned.get(v);
    letters.push(line.clauseMale ? letter : letter.toLowerCase());
  });

  let code = 0;
  if (lines.length === 4 && folded.every(Boolean)) {
    const [a, b, c, d] = folded;
    if (a === b && a === c && a === d) code = 1;
    else if (a === b && c === d) code = 2;
    else if (a === c && b === d) code = 3;
    else if (a === d && b === c) code = 4;
    else if (a !== c && b === d) code = 6;
  }

  return {
    letters,
    scheme: letters.join(''),
    code,
    text: SCHEME_TEXT[code] || (lines.length !== 4 ? 'по строфам' : 'нерегулярная'),
    unrhymed,
  };
}

/* ---------- тоника ---------- */

function tonicAnalysis(lines) {
  const voiced = lines.filter((l) => l.syllables > 0);
  if (!voiced.length) {
    return { ok: false, stresses: 0, stressPositions: 0, excluded: 0, pattern: [], errors: ['Нет строк'] };
  }

  const stressCounts = voiced.map((l) => l.vowels.filter((v) => v.stressed).length);
  const freq = new Map();
  stressCounts.forEach((n) => freq.set(n, (freq.get(n) || 0) + 1));

  let modal = 0;
  let bestFreq = 0;
  for (const [n, f] of freq) {
    if (f > bestFreq) { bestFreq = f; modal = n; }
  }

  const filtered = voiced.filter((l, i) => stressCounts[i] === modal);
  if (!filtered.length || modal < 1) {
    return {
      ok: false,
      stresses: modal,
      stressPositions: 0,
      excluded: voiced.length,
      pattern: [],
      errors: ['Не удалось найти опорное число ударений'],
    };
  }

  const width = modal * 12;
  const matrix = filtered.map(() => new Array(width).fill(null));

  filtered.forEach((line, row) => {
    const stresses = line.vowels.filter((v) => v.stressed).length;
    if (!stresses) return;
    const step = width / (stresses + 1);
    const positions = [];
    for (let i = 0; i < stresses; i += 1) {
      positions.push(Math.round((i + 1) * step) - 1);
    }

    let vi = 0;
    let si = 0;
    for (let pos = 0; pos < width; pos += 1) {
      if (si < positions.length && pos === positions[si]) {
        while (vi < line.vowels.length && !line.vowels[vi].stressed) vi += 1;
        if (vi < line.vowels.length) {
          matrix[row][pos] = 2;
          vi += 1;
          si += 1;
        }
      } else if (vi < line.vowels.length && !line.vowels[vi].stressed) {
        matrix[row][pos] = 0;
        vi += 1;
      }
    }
  });

  const keep = [];
  for (let col = 0; col < width; col += 1) {
    if (matrix.some((row) => row[col] !== null)) keep.push(col);
  }

  const pattern = keep.map((col) => {
    let sum = 0;
    for (let row = 0; row < matrix.length; row += 1) sum += matrix[row][col] || 0;
    return Math.ceil(sum / matrix.length);
  });

  const errors = [];
  const stressPositions = pattern.filter((v) => v === 2).length;
  if (stressPositions < 2) errors.push('Менее двух ударных позиций');

  pattern.forEach((v, i) => {
    if (v !== 2) return;
    if (i > 0 && pattern[i - 1] !== 0) errors.push(`Позиция ${i + 1}: нет безударной слева`);
    if (i < pattern.length - 1 && pattern[i + 1] !== 0) errors.push(`Позиция ${i + 1}: нет безударной справа`);
  });

  let zeros = 0;
  for (const v of pattern) {
    if (v === 0) {
      zeros += 1;
      if (zeros > 3) { errors.push('Более трёх безударных подряд'); break; }
    } else zeros = 0;
  }

  return {
    ok: errors.length === 0,
    stresses: modal,
    stressPositions,
    pattern,
    excluded: voiced.length - filtered.length,
    errors,
  };
}

/* ---------- главный анализ ---------- */

export function analyze(text, options = {}) {
  const { autoSplit = true, scope = 'poem' } = options;
  const src = String(text || '');
  const rawLines = src.split('\n');

  let offset = 0;
  const lines = rawLines.map((raw) => {
    const line = scanLine(raw, offset);
    offset += raw.length + 1;
    return line;
  });

  let stanzas = [];
  let current = [];
  for (const line of lines) {
    if (line.syllables === 0) {
      if (current.length) { stanzas.push(current); current = []; }
    } else current.push(line);
  }
  if (current.length) stanzas.push(current);

  const voiced = lines.filter((l) => l.syllables > 0);
  const splitApplied = autoSplit && stanzas.length < 2 && voiced.length >= 8;
  if (splitApplied) {
    stanzas = [];
    for (let i = 0; i < voiced.length; i += 4) stanzas.push(voiced.slice(i, i + 4));
  }

  const pad = (n) => (n < 10 ? ` ${n}` : String(n));
  stanzas.forEach((stanza) => {
    stanza.pattern = stanza.map((l) => pad(l.syllables)).join(',');
    stanza.plain = stanza.map((l) => l.syllables).join(',');
  });

  const patternFreq = new Map();
  stanzas.forEach((s) => patternFreq.set(s.pattern, (patternFreq.get(s.pattern) || 0) + 1));

  const patternTypes = [...patternFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([pattern, repeat]) => ({ pattern, repeat }));

  const dominantPattern = patternTypes[0]?.pattern || '';
  const maxRepeat = patternTypes[0]?.repeat || 0;
  const uniqueStanzas = patternTypes.filter((p) => p.repeat === 1).length;

  stanzas.forEach((s) => {
    s.repeat = patternFreq.get(s.pattern) || 0;
    s.inDominant = s.pattern === dominantPattern;
  });

  /* ВАЖНО: итоговая схема в оригинале строится по всему стиху
     (FragmentNumber = 0 — это GroupStrof.unshift(stih)). */
  const groupLines = stanzas.filter((s) => s.inDominant).flat();
  const baseLines = scope === 'group' && groupLines.length ? groupLines : voiced;

  const base = buildRhythm(baseLines);
  const ritm = base.ritm;
  const width = base.width;
  const errorSet = new Set(base.errorColumns);

  const allPass = secondPass(
    lines.map((l) => l.template),
    lines.map((l) => l.numGlas),
    lines.map((l) => l.vowels.map((v) => v.char).join('')),
    ritm
  );

  lines.forEach((line, s) => {
    const resolved = allPass.templates[s] || '';
    const letters = allPass.glasn[s] || '';

    line.vowels.forEach((vowel, k) => {
      const state = resolved[k] || '.';
      vowel.state = state;
      vowel.stressed = state === 'О';
      vowel.column = ritm[k + 1] || 1;
      vowel.error = errorSet.has(k) && vowel.stressed;
      vowel.display = vowel.stressed
        ? (letters[k] || vowel.char).toUpperCase()
        : (letters[k] || vowel.char).toLowerCase();
    });

    line.resolved = resolved;
    line.hasError = line.vowels.some((v) => v.error);

    let lastStressed = -1;
    line.vowels.forEach((v, k) => { if (v.stressed) lastStressed = k; });

    line.rhymeVowel = lastStressed >= 0 ? foldVowel(line.vowels[lastStressed].char) : '';
    line.rhymeWord = lastStressed >= 0 ? line.vowels[lastStressed].word : '';
    line.clauseMale = lastStressed >= 0 && lastStressed === line.syllables - 1;
    line.clause = lastStressed < 0
      ? null
      : ['мужская', 'женская', 'дактилическая', 'гипердактилическая'][
        Math.min(3, line.syllables - 1 - lastStressed)
      ];
  });

  let unrhymed = 0;
  const schemeCodes = [];
  stanzas.forEach((stanza) => {
    const rhyme = rhymeOfStanza(stanza);
    stanza.rhyme = rhyme;
    stanza.forEach((line, i) => { line.rhymeLetter = rhyme.letters[i]; });
    unrhymed += rhyme.unrhymed;
    if (rhyme.code) schemeCodes.push(rhyme.code);
  });

  const codeFreq = new Map();
  schemeCodes.forEach((c) => codeFreq.set(c, (codeFreq.get(c) || 0) + 1));
  let mainCode = 0;
  let mainFreq = 0;
  for (const [c, f] of codeFreq) {
    if (f > mainFreq) { mainFreq = f; mainCode = c; }
  }

  const vowelOrder = 'ОАЭИУ';
  const longCode = lines
    .map((l) => {
      if (l.syllables === 0) return '#';
      const idx = vowelOrder.indexOf(l.rhymeVowel);
      return idx >= 0 ? String(idx + 1) : '0';
    })
    .join('');

  let countSlog = 0;
  let countStrong = 0;
  let countWeak = 0;
  let countLight = 0;
  let countRitmError = 0;
  let errorStanzas = 0;

  voiced.forEach((line) => {
    line.vowels.forEach((v) => {
      countSlog += 1;
      if (v.error) { countRitmError += 1; return; }
      if (v.column === 3) countStrong += 1;
      else if (v.column === 2) countWeak += 1;
      else countLight += 1;
    });
  });

  stanzas.forEach((stanza) => {
    if (stanza.some((l) => l.hasError)) errorStanzas += 1;
  });

  const procentMix = countSlog ? Math.round((countWeak / countSlog) * 100) : 0;
  const stats = rhythmStats(ritm, width);
  const contrast = contrastLayers(ritm, width, stats.ball);
  const greek = greekName(ritm, width);

  const unmarkedWords = [...new Set(lines.flatMap((l) => l.unmarked))];
  const accentsSet = unmarkedWords.length === 0 && voiced.length > 0;
  const splitOk = stanzas.length >= 2;
  const groupOk = maxRepeat > 1;
  const types = patternTypes.length;
  const ballRifma = unrhymed === 0 && voiced.length > 0 ? 1 : 0;

  let classicBall = 0;
  if (procentMix < 50 && uniqueStanzas < 3 && splitOk && accentsSet && groupOk
    && types < 4 && stats.ball > 0 && countRitmError < 5 && unrhymed < 5) classicBall = 1;
  if (procentMix < 40 && uniqueStanzas < 2 && splitOk && accentsSet && groupOk
    && types < 4 && stats.ball > 1 && countRitmError < 2 && unrhymed < 2) classicBall = 2;
  if (procentMix < 30 && uniqueStanzas === 0 && splitOk && accentsSet && groupOk
    && types < 3 && stats.ball === 3 && countRitmError === 0 && unrhymed === 0) classicBall = 3;

  const tonic = tonicAnalysis(lines);

  return {
    build: PROSODY_BUILD,
    scope,
    columns: base.columns,
    profileLineCount: baseLines.length,
    lines,
    stanzas,
    width,
    ritm: Array.from({ length: width }, (_, i) => ritm[i + 1]),
    errorColumns: base.errorColumns,
    triCod: stats.triCod,
    contrastPlus: contrast.plus,
    contrastMinus: contrast.minus,
    razmer: dominantPattern,
    patternTypes,
    uniqueStanzas,
    maxRepeat,
    splitApplied,
    greek,
    tonic,
    counts: {
      syllables: countSlog,
      strong: countStrong,
      weak: countWeak,
      light: countLight,
      error: countRitmError,
    },
    procentMix,
    ritmBall: stats.ball,
    countStop: stats.countStop,
    countRitmError,
    errorStanzas,
    ballRifma,
    countErrorRifma: unrhymed,
    countStrof: stanzas.length,
    countStrofType: types,
    classicBall,
    ballText: BALL_TEXT[classicBall],
    rifmovka: {
      text: SCHEME_TEXT[mainCode] || 'нерегулярная',
      type: schemeCodes.join(''),
      long: longCode,
    },
    unmarkedWords,
    accentsSet,
    lineCount: voiced.length,
  };
}

/* ---------- расстановка ударений ---------- */

export function placeAccents(text, dictionary, options = {}) {
  const { tonic = false, dict = STARTER_DICT } = options;
  const map = dictionary || dict;
  const unmarked = [];

  const result = String(text || '')
    .toLowerCase()
    .replace(WORD_RE, (raw) => {
      const clean = stripAcute(raw);
      const positions = [];
      for (let i = 0; i < clean.length; i += 1) {
        if (isVowel(clean[i])) positions.push(i);
      }
      if (!positions.length) return clean;

      let marked = -1;
      for (let i = 0; i < raw.length; i += 1) {
        if (raw[i] === ACUTE) {
          const before = stripAcute(raw.slice(0, i)).length - 1;
          const ordinal = positions.indexOf(before);
          if (ordinal >= 0) { marked = ordinal; break; }
        }
      }

      if (marked < 0) {
        const yo = positions.findIndex((p) => clean[p] === 'ё');
        if (yo >= 0) marked = yo;
      }

      if (marked < 0 && positions.length === 1) {
        if (tonic) return clean;
        marked = 0;
      }

      if (marked < 0) {
        const hit = map.get(clean);
        if (hit) return stripAcute(hit);
        unmarked.push(clean);
        return clean;
      }

      const at = positions[marked];
      return clean.slice(0, at) + clean[at].toUpperCase() + clean.slice(at + 1);
    });

  return { text: result, unmarked: [...new Set(unmarked)] };
}

export function toggleStress(text, pos) {
  const src = String(text || '');
  if (pos < 0 || pos >= src.length || !isVowel(src[pos])) return src;

  const isLetter = (c) => !!c && /[а-яёА-ЯЁ\u0301]/.test(c);
  let start = pos;
  let end = pos;
  while (start > 0 && isLetter(src[start - 1])) start -= 1;
  while (end < src.length - 1 && isLetter(src[end + 1])) end += 1;

  const word = stripAcute(src.slice(start, end + 1));
  const relative = stripAcute(src.slice(start, pos)).length;
  const wasStressed = isUpperVowel(src[pos]);

  const lowered = word.toLowerCase();
  const next = wasStressed
    ? lowered
    : lowered.slice(0, relative) + lowered[relative].toUpperCase() + lowered.slice(relative + 1);

  return src.slice(0, start) + next + src.slice(end + 1);
}

export function clearAccents(text) {
  return stripAcute(String(text || '')).toLowerCase();
}

export function hasAccents(text) {
  const src = String(text || '');
  if (src.includes(ACUTE)) return true;
  for (const ch of src) if (isUpperVowel(ch)) return true;
  return false;
}

export { STARTER_DICT, SCHEME_TEXT, BALL_TEXT };