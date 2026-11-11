/* Просодия русского стиха. Без зависимостей.
   Ударения: ручная разметка (U+0301) → ё → словарь → эвристика. */

const VOWELS = 'аеёиоуыэюя';
const ACUTE = '\u0301';

const isVowel = (ch) => VOWELS.includes(ch.toLowerCase());

const CLITICS = new Set([
  'в', 'во', 'на', 'над', 'под', 'из', 'изо', 'за', 'к', 'ко', 'по', 'о', 'об',
  'обо', 'от', 'ото', 'до', 'у', 'с', 'со', 'без', 'для', 'при', 'про', 'через',
  'сквозь', 'меж', 'между', 'и', 'а', 'но', 'или', 'ли', 'ль', 'же', 'бы', 'б',
  'не', 'ни', 'то', 'уж', 'пусть', 'пускай', 'чтоб', 'чтобы',
]);

/* Словарь: ударная гласная заглавной. Пополняется freely. */
const DICT_RAW = `
любОвь крОвь нОчь душА тоскА окнО лунА звездА водА огОнь сЕрдце сОлнце
вЕтер нЕбо мОре пОле дорОга пАмять слезА мечтА тишинА веснА зимА Осень
лЕто Утро вЕчер дЕнь свЕт тЕнь сОн бОль рАдость гОре счАстье судьбА разлУка
встрЕча слОво гОлос пЕсня мУзыка гитАра струнА аккОрд рИтм строкА рИфма
поЭт стихИ молчАнье дыхАнье свидАнье прощАнье желАнье страдАнье надежда
одИн остАться вернУться проснУться забЫть запомнить уснУть молчАть кричАть
дышАть летЕть идтИ бежАть стоЯть смотрЕть видЕть слышать знАть помнить
холОдный тЁплый свЕтлый тёмный дАльний бОльшой малЕнький нОвый стАрый
дорОгой роднОй чужОй живОй мертвЫй пустОй полнЫй тИхий грОмкий
сегОдня вчерА завтрА тепЕрь никогдА всегдА опЯть снОва вновЬ
город дОм сад лес снег дождь грОза тумАн рассвЕт закАт горизОнт
берёза осИна дуб клён травА цветОк листОк корЕнь ветвь
рукА ногА глазА губЫ плечО спинА грудь ладОнь пАлец
мать отЕц сын дочь брат сестрА друг враг челОвек людИ
бОг ангел дЕмон рай ад вечность миг век год час минутА
`;

const DICT = (() => {
  const map = new Map();
  DICT_RAW.split(/\s+/).filter(Boolean).forEach((raw) => {
    const lower = raw.toLowerCase();
    let vi = 0;
    let stress = -1;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (!isVowel(ch)) continue;
      if (ch !== ch.toLowerCase() && VOWELS.includes(ch.toLowerCase())) stress = vi;
      vi++;
    }
    if (stress >= 0) map.set(lower.replace(/\u0301/g, ''), stress);
  });
  return map;
})();

export const METERS = [
  { id: 'iamb', name: 'ямб', period: 2, offset: 2, wMiss: 0.40, wExtra: 0.85 },
  { id: 'trochee', name: 'хорей', period: 2, offset: 1, wMiss: 0.40, wExtra: 0.85 },
  { id: 'dactyl', name: 'дактиль', period: 3, offset: 1, wMiss: 0.90, wExtra: 1.00 },
  { id: 'amphibrach', name: 'амфибрахий', period: 3, offset: 2, wMiss: 0.90, wExtra: 1.00 },
  { id: 'anapest', name: 'анапест', period: 3, offset: 3, wMiss: 0.90, wExtra: 1.00 },
];

const FEET_NAMES = {
  1: '1-стопный', 2: '2-стопный', 3: '3-стопный', 4: '4-стопный',
  5: '5-стопный', 6: '6-стопный', 7: '7-стопный', 8: '8-стопный',
};

const STANZA_NAMES = {
  2: 'дистих', 3: 'терцет', 4: 'катрен', 5: 'квинтет',
  6: 'секстина', 7: 'септима', 8: 'октава', 10: 'декастих', 14: 'сонет',
};

const CLAUSES = ['мужская', 'женская', 'дактилическая', 'гипердактилическая'];

function stripMarks(s) {
  return s.replace(/\u0301/g, '');
}

function vowelPositions(word) {
  const out = [];
  for (let i = 0; i < word.length; i++) {
    if (isVowel(word[i]) && word[i + 1] !== ACUTE) out.push(i);
    else if (isVowel(word[i])) out.push(i);
  }
  return out.filter((i) => isVowel(word[i]));
}

/* Ударение внутри слова. Возвращает индекс гласной (0-based) и источник. */
function resolveWordStress(word) {
  const clean = stripMarks(word);
  const vowels = [];
  for (let i = 0; i < word.length; i++) if (isVowel(word[i])) vowels.push(i);
  if (vowels.length === 0) return { index: -1, source: 'none', vowels };

  // 1. ручная метка
  for (let v = 0; v < vowels.length; v++) {
    if (word[vowels[v] + 1] === ACUTE) return { index: v, source: 'manual', vowels };
  }
  // 2. ё всегда ударная
  for (let v = 0; v < vowels.length; v++) {
    if (clean[vowels[v]].toLowerCase() === 'ё') return { index: v, source: 'fixed', vowels };
  }
  // 3. словарь
  const dictHit = DICT.get(clean.toLowerCase());
  if (dictHit !== undefined && dictHit < vowels.length) {
    return { index: dictHit, source: 'dict', vowels };
  }
  // 4. односложные
  if (vowels.length === 1) {
    if (CLITICS.has(clean.toLowerCase())) return { index: -1, source: 'clitic', vowels };
    return { index: 0, source: 'mono', vowels };
  }
  // 5. эвристика: пометить как неуверенное
  const lower = clean.toLowerCase();
  let guess = 0;
  if (/(ая|яя|ое|ее|ый|ий|ой|ые|ие)$/.test(lower)) guess = 0;
  else if (/(ать|ять|еть|ить|ыть|уть|чь|ти)$/.test(lower)) guess = vowels.length - 1;
  else if (/(ка|ко|но|ло|мо|ро|та|то|ва|во)$/.test(lower)) guess = 0;
  return { index: guess, source: 'guess', vowels };
}

/* Фонетическая нормализация рифменного хвоста. */
function phonetic(tail) {
  if (!tail) return '';
  const chars = stripMarks(tail.toLowerCase()).split('');
  const voiced = { б: 'п', в: 'ф', г: 'к', д: 'т', ж: 'ш', з: 'с' };
  const reduce = { о: 'а', ё: 'о', э: 'е', я: 'а', ю: 'у', ы: 'и' };
  return chars.map((ch, i) => {
    if (isVowel(ch)) {
      if (i === 0) return ch === 'ё' ? 'о' : (ch === 'э' ? 'е' : ch);
      return reduce[ch] || ch;
    }
    if (i === chars.length - 1 && voiced[ch]) return voiced[ch];
    return ch;
  }).join('');
}

function vowelSkeleton(s) {
  return s.split('').filter(isVowel).join('');
}

function rhymeQuality(a, b) {
  if (!a || !b) return 'none';
  const pa = phonetic(a);
  const pb = phonetic(b);
  if (pa === pb) return pa.length >= 2 ? 'exact' : 'weak';
  const va = vowelSkeleton(pa);
  const vb = vowelSkeleton(pb);
  if (va === vb && va.length) return 'assonance';
  const ca = pa.split('').filter((c) => !isVowel(c)).join('');
  const cb = pb.split('').filter((c) => !isVowel(c)).join('');
  if (ca && ca === cb) return 'dissonance';
  return 'none';
}

const RHYMES = (q) => q === 'exact' || q === 'weak' || q === 'assonance';

function scoreMeter(syllables, meter) {
  const n = syllables.length;
  if (n === 0) return { score: 0, missing: 0, extra: 0, icts: [] };
  const icts = [];
  for (let p = meter.offset; p <= n; p += meter.period) icts.push(p);
  if (!icts.length) return { score: 0, missing: 0, extra: 0, icts };
  const stressed = new Set();
  syllables.forEach((s, i) => { if (s.stressed) stressed.add(i + 1); });
  const ictSet = new Set(icts);
  let missing = 0;
  let extra = 0;
  icts.forEach((p) => { if (!stressed.has(p)) missing++; });
  stressed.forEach((p) => { if (!ictSet.has(p)) extra++; });
  const penalty = missing * meter.wMiss + extra * meter.wExtra;
  return {
    score: Math.max(0, 1 - penalty / icts.length),
    missing,
    extra,
    icts,
  };
}

function feetCount(n, meter) {
  if (n < meter.offset) return 0;
  return Math.floor((n - meter.offset) / meter.period) + 1;
}

function mode(arr) {
  const f = new Map();
  let best = null;
  let bestN = 0;
  arr.forEach((v) => {
    if (v === null || v === undefined) return;
    const c = (f.get(v) || 0) + 1;
    f.set(v, c);
    if (c > bestN) { bestN = c; best = v; }
  });
  return best;
}

function analyzeLine(raw, lineStart) {
  const syllables = [];
  const wordRe = /[а-яёА-ЯЁ]+(?:\u0301)?(?:[а-яёА-ЯЁ]+\u0301?)*/g;
  let m;
  let lastStressedWord = null;

  while ((m = wordRe.exec(raw)) !== null) {
    let word = m[0];
    // подхватить комбинируемые ударения, идущие после буквы
    let end = m.index + word.length;
    while (raw[end] === ACUTE) { word += ACUTE; end++; }
    word = raw.slice(m.index, end).replace(/[^\u0301а-яёА-ЯЁ]/g, '');

    const info = resolveWordStress(word);
    if (info.index < 0) {
      info.vowels.forEach((vi) => {
        syllables.push({
          pos: lineStart + m.index + vi,
          char: raw[m.index + vi],
          stressed: false,
          source: info.source,
        });
      });
      continue;
    }
    info.vowels.forEach((vi, v) => {
      const stressed = v === info.index;
      syllables.push({
        pos: lineStart + m.index + vi,
        char: raw[m.index + vi],
        stressed,
        source: stressed ? info.source : 'none',
      });
      if (stressed) {
        lastStressedWord = {
          tail: stripMarks(raw.slice(m.index + vi, end)).replace(/[^а-яёА-ЯЁ]/g, ''),
        };
      }
    });
  }

  const n = syllables.length;
  const stressCount = syllables.filter((s) => s.stressed).length;
  let lastStress = -1;
  syllables.forEach((s, i) => { if (s.stressed) lastStress = i; });
  const clauseIdx = lastStress < 0 ? -1 : Math.min(3, n - 1 - lastStress);

  let best = null;
  METERS.forEach((meter) => {
    const r = scoreMeter(syllables, meter);
    if (!best || r.score > best.score) best = { meter, ...r };
  });

  return {
    raw,
    lineStart,
    blank: raw.trim().length === 0,
    syllables,
    syllableCount: n,
    stressCount,
    clause: clauseIdx < 0 ? null : CLAUSES[clauseIdx],
    clauseIdx,
    rhymeTail: lastStressedWord ? lastStressedWord.tail : '',
    best,
    uncertain: syllables.filter((s) => s.stressed && s.source === 'guess').length,
  };
}

function schemeForStanza(lines) {
  const letters = [];
  const used = [];
  let next = 0;
  const ALPHA = 'ABCDEFGH';

  lines.forEach((line, i) => {
    if (line.blank || !line.rhymeTail) { letters.push('–'); return; }
    let found = -1;
    for (let j = 0; j < i; j++) {
      if (!lines[j].rhymeTail) continue;
      if (RHYMES(rhymeQuality(line.rhymeTail, lines[j].rhymeTail))) { found = j; break; }
    }
    let letter;
    if (found >= 0) letter = used[found];
    else { letter = ALPHA[next % ALPHA.length]; next++; }
    used[i] = letter;
    letters.push(line.clauseIdx === 0 ? letter.toUpperCase() : letter.toLowerCase());
  });
  return letters;
}

function schemeType(scheme) {
  const s = scheme.join('').toUpperCase().replace(/–/g, '');
  if (!s) return 'без рифмы';
  if (/^(.)\1+$/.test(s)) return 'монорим';
  if (s.startsWith('ABAB') || s.startsWith('ABBA') || s.startsWith('AABB')) {
    if (s.startsWith('ABAB')) return 'перекрёстная';
    if (s.startsWith('ABBA')) return 'кольцевая';
    return 'смежная';
  }
  if (s.length >= 4 && s[1] === s[3] && s[0] !== s[1]) return 'балладная';
  return 'нерегулярная';
}

export function analyze(text) {
  const src = text || '';
  const rawLines = src.split('\n');
  const lines = [];
  let offset = 0;
  rawLines.forEach((raw) => {
    lines.push(analyzeLine(raw, offset));
    offset += raw.length + 1;
  });

  const stanzas = [];
  let cur = [];
  lines.forEach((line) => {
    if (line.blank) {
      if (cur.length) { stanzas.push(cur); cur = []; }
    } else cur.push(line);
  });
  if (cur.length) stanzas.push(cur);

  stanzas.forEach((stanza) => {
    const scheme = schemeForStanza(stanza);
    stanza.forEach((line, i) => { line.rhymeLetter = scheme[i]; });
  });

  const voiced = lines.filter((l) => !l.blank && l.syllableCount > 0);

  // доминирующий метр — по сумме взвешенных оценок
  const totals = METERS.map((meter) => {
    let sum = 0;
    voiced.forEach((l) => { sum += scoreMeter(l.syllables, meter).score; });
    return { meter, sum };
  }).sort((a, b) => b.sum - a.sum);

  const dominant = totals[0]?.meter || METERS[0];
  const rhythmScore = voiced.length ? totals[0].sum / voiced.length : 0;

  const feetArr = [];
  let rhythmErrors = 0;
  let missTotal = 0;
  let extraTotal = 0;

  voiced.forEach((l) => {
    const r = scoreMeter(l.syllables, dominant);
    l.meter = { id: dominant.id, name: dominant.name, ...r };
    l.feet = feetCount(l.syllableCount, dominant);
    feetArr.push(l.feet);
    if (r.extra > 0) rhythmErrors++;
    missTotal += r.missing;
    extraTotal += r.extra;
    l.offMeter = r.extra > 0 || r.score < 0.5;
  });

  const feet = mode(feetArr) || 0;
  const mixed = voiced.filter((l) => l.best.meter.id !== dominant.id || l.offMeter).length;
  const mixPercent = voiced.length ? Math.round((mixed / voiced.length) * 100) : 0;

  const stressCounts = voiced.map((l) => l.stressCount);
  const spread = stressCounts.length ? Math.max(...stressCounts) - Math.min(...stressCounts) : 0;
  const syllSpread = voiced.length
    ? Math.max(...voiced.map((l) => l.syllableCount)) - Math.min(...voiced.map((l) => l.syllableCount))
    : 0;

  let tonic = null;
  if (rhythmScore < 0.55 && voiced.length) {
    if (spread <= 1 && syllSpread > 2) tonic = `тактовик (${mode(stressCounts)} ударения в строке)`;
    else if (spread <= 2 && syllSpread > 3) tonic = `дольник (${Math.min(...stressCounts)}–${Math.max(...stressCounts)} ударения)`;
    else tonic = 'акцентный стих / верлибр';
  }

  const scheme = stanzas[0] ? stanzas[0].map((l) => l.rhymeLetter).join('') : '';
  const stanzaSize = mode(stanzas.map((s) => s.length)) || 0;

  const rhymePairs = [];
  stanzas.forEach((stanza) => {
    for (let i = 0; i < stanza.length; i++) {
      for (let j = i + 1; j < stanza.length; j++) {
        if (stanza[i].rhymeLetter.replace(/–/g, '').toUpperCase()
          === stanza[j].rhymeLetter.replace(/–/g, '').toUpperCase()
          && stanza[i].rhymeLetter !== '–') {
          rhymePairs.push(rhymeQuality(stanza[i].rhymeTail, stanza[j].rhymeTail));
        }
      }
    }
  });
  const exactPairs = rhymePairs.filter((q) => q === 'exact').length;
  const rhymeScore = rhymePairs.length ? exactPairs / rhymePairs.length : 0;

  return {
    lines,
    stanzas,
    summary: {
      meterId: dominant.id,
      meterName: dominant.name,
      feet,
      feetLabel: FEET_NAMES[feet] || `${feet}-стопный`,
      label: rhythmScore >= 0.55
        ? `${FEET_NAMES[feet] || `${feet}-стопный`} ${dominant.name}`
        : (tonic || 'свободный стих'),
      rhythmScore,
      rhythmPercent: Math.round(rhythmScore * 100),
      rhythmErrors,
      pyrrhichius: missTotal,
      spondeus: extraTotal,
      mixPercent,
      tonic,
      scheme,
      schemeType: schemeType(scheme.split('')),
      rhymePercent: Math.round(rhymeScore * 100),
      stanzaCount: stanzas.length,
      stanzaSize,
      stanzaType: STANZA_NAMES[stanzaSize] || `${stanzaSize}-строчные`,
      uncertain: voiced.reduce((a, l) => a + l.uncertain, 0),
      lineCount: voiced.length,
    },
  };
}

/* Клик по слогу: поставить/снять ударение в исходном тексте. */
export function toggleStress(text, pos) {
  if (pos < 0 || pos >= text.length) return text;
  if (text[pos + 1] === ACUTE) return text.slice(0, pos + 1) + text.slice(pos + 2);
  // снять другие ударения в этом же слове
  let start = pos;
  let end = pos;
  const isLetter = (c) => c && /[а-яёА-ЯЁ\u0301]/.test(c);
  while (start > 0 && isLetter(text[start - 1])) start--;
  while (end < text.length - 1 && isLetter(text[end + 1])) end++;
  const word = text.slice(start, end + 1).replace(/\u0301/g, '');
  const rel = stripMarks(text.slice(start, pos)).length;
  const marked = word.slice(0, rel + 1) + ACUTE + word.slice(rel + 1);
  return text.slice(0, start) + marked + text.slice(end + 1);
}

export function clearStresses(text) {
  return (text || '').replace(/\u0301/g, '');
}

export const CLAUSE_LIST = CLAUSES;