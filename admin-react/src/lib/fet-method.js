/* Структурный анализ русского стиха: столбцовые профили (силлабо-тоника) + тоника.
   Соглашение об ударениях: ЗАГЛАВНАЯ гласная или U+0301. Без зависимостей, без DOM. */

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

/* Встроенный стартовый словарь. Формат: ударная гласная заглавной. */
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

/* ---------- разбор строки на гласные с привязкой к словам ---------- */

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

/* ---------- столбцовый профиль ---------- */

function columnProfile(templates) {
  const width = templates.reduce((max, t) => Math.max(max, t.length), 0);
  const ritm = [];
  const errorColumns = [];

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

    if (real === 0) { ritm[k] = 1; continue; }

    if (strong > real * 0.8 && weak + strong !== real) ritm[k] = 3;
    else if (light > real * 0.8 && strong > 0) { ritm[k] = 1; errorColumns.push(k); }
    else if (strong === 0) ritm[k] = 1;
    else if (weak + strong === real) ritm[k] = 3;
    else if (light + weak === real) ritm[k] = 1;
    else if (strong > real * 0.3 && weak + strong > real * 0.4) ritm[k] = 2;
    else ritm[k] = 2;
  }

  return { ritm, errorColumns };
}

function resolveTemplates(templates, numGlasList, ritm) {
  return templates.map((template, s) => {
    const arr = template.split('');
    const ng = numGlasList[s] || '';

    for (let k = 0; k < arr.length; k += 1) {
      if (arr[k] === ':') {
        if (ritm[k] === 3) arr[k] = 'О';
        else if (ritm[k] === 1) arr[k] = '.';
      }
      const cur = ritm[k];
      const next = ritm[k + 1];
      const prev = ritm[k - 1];

      if (cur === 1 && next === 1 && ng[k] === '1' && ng[k + 1] === '2' && ng[k + 2] === '1') {
        arr[k] = '.';
      }
      if (cur === 1 && prev === 1 && ng[k] === '2' && ng[k + 1] === '1') {
        arr[k] = '.';
      }
    }
    return arr.join('');
  });
}

/* ---------- ритм: стопы, балл, троичный код, свёртка ---------- */

function rhythmStats(ritm) {
  let strong = 0;
  let weak = 0;
  let light = 0;
  let foot = 0;
  let strongFoot = 0;

  for (let k = 0; k < ritm.length; k += 1) {
    if (ritm[k] === 3) strong += 1;
    if (ritm[k] === 2) weak += 1;
    if (ritm[k] === 1) {
      light += 1;
      if (ritm[k - 1] === 2) foot += 1;
      if (ritm[k - 1] === 3) strongFoot += 1;
    }
  }

  const countStop = foot + strongFoot;
  let ball = 0;
  if (countStop > 1) ball = 1;
  if (countStop > ritm.length * 0.3) ball = 2;
  if (strongFoot > 1 || strong > 1) ball = 3;

  const triCod = ritm.map((v) => (v === 1 ? '0' : v === 2 ? '1' : '2')).join('');

  return { ball, countStop, foot, strongFoot, strong, weak, light, triCod };
}

function contrastLayers(ritm) {
  if (!ritm.length) return { plus: '', minus: '' };
  const padded = [2, ...ritm, 2];

  for (let k = 1; k < padded.length - 1; k += 1) {
    if (padded[k] !== 2) continue;
    if (padded[k + 1] === 3) { padded[k] = 1; continue; }
    if (padded[k - 1] === 3) { padded[k] = 1; continue; }
    if (padded[k - 1] === 1 && padded[k + 1] === 1) padded[k] = 3;
  }

  const plus = padded.slice(1, -1).join('');
  const minus = ritm.map((v) => (v === 2 ? 1 : v)).join('');
  return { plus, minus };
}

/* ---------- греческие названия ---------- */

function greekName(ritm) {
  if (!ritm.length) return null;
  const actual = ritm.join('');

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
    text: SCHEME_TEXT[code] || (code === 0 && lines.length !== 4 ? 'по строфам' : 'нерегулярная'),
    unrhymed,
  };
}

/* ---------- тоника ---------- */

function tonicAnalysis(lines) {
  const voiced = lines.filter((l) => l.syllables > 0);
  if (!voiced.length) return { ok: false, stresses: 0, pattern: [], errors: ['Нет строк'] };

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
    return { ok: false, stresses: modal, pattern: [], errors: ['Не удалось найти опорное число ударений'] };
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
  const { autoSplit = true } = options;
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

  /* размер = числа слогов по строкам */
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

  const profileLines = stanzas.filter((s) => s.inDominant).flat();
  const baseLines = profileLines.length ? profileLines : voiced;

  /* профиль + разрешение слабых, два прохода */
  let templates = baseLines.map((l) => l.template);
  const baseNumGlas = baseLines.map((l) => l.numGlas);
  let profile = columnProfile(templates);
  templates = resolveTemplates(templates, baseNumGlas, profile.ritm);
  profile = columnProfile(templates);
  templates = resolveTemplates(templates, baseNumGlas, profile.ritm);

  const ritm = profile.ritm;
  const errorSet = new Set(profile.errorColumns);

  /* применяем разрешённый профиль ко всем строкам для отображения */
  const allResolved = resolveTemplates(
    lines.map((l) => l.template),
    lines.map((l) => l.numGlas),
    ritm
  );

  lines.forEach((line, s) => {
    const resolved = allResolved[s] || '';
    line.vowels.forEach((vowel, k) => {
      const state = resolved[k] || '.';
      vowel.state = state;
      vowel.stressed = state === 'О';
      vowel.column = ritm[k] || 1;
      vowel.error = errorSet.has(k) && vowel.stressed;
      vowel.display = vowel.stressed ? vowel.char.toUpperCase() : vowel.char.toLowerCase();
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

  /* рифма по строфам */
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

  /* доля гласных по типам столбцов */
  let countSlog = 0;
  let countStrong = 0;
  let countWeak = 0;
  let countLight = 0;
  let countRitmError = 0;
  let errorStanzas = 0;

  baseLines.forEach((line) => {
    line.vowels.forEach((v) => {
      countSlog += 1;
      if (v.column === 3) countStrong += 1;
      else if (v.column === 2) countWeak += 1;
      else countLight += 1;
      if (v.error) countRitmError += 1;
    });
  });

  stanzas.forEach((stanza) => {
    if (stanza.some((l) => l.hasError)) errorStanzas += 1;
  });

  const procentMix = countSlog ? Math.round((countWeak / countSlog) * 100) : 0;
  const stats = rhythmStats(ritm);
  const contrast = contrastLayers(ritm);
  const greek = greekName(ritm);

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
    lines,
    stanzas,
    width: ritm.length,
    ritm,
    errorColumns: profile.errorColumns,
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