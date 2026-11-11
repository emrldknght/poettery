/* Ядро расстановки ударений. Чистые функции, без DOM.
   Индекс хранит Map<слово, номер ударной гласной> — вдвое экономнее строк. */

const VOWELS = 'аеёиоуыэюя';
const UPPER = 'АЕЁИОУЫЭЮЯ';
const ACUTE = '\u0301';

const WORD_RE = /[а-яёА-ЯЁ\u0301]+/g;

export const isVowel = (ch) => !!ch && VOWELS.includes(ch.toLowerCase());
export const isUpperVowel = (ch) => !!ch && UPPER.includes(ch);
export const stripAcute = (s) => String(s || '').replace(/\u0301/g, '');

/* Номер ударной гласной в словарной записи (заглавная или с акутом). */
function stressOrdinal(word) {
  let n = 0;
  for (let i = 0; i < word.length; i += 1) {
    const ch = word[i];
    if (ch === ACUTE || !isVowel(ch)) continue;
    if (isUpperVowel(ch) || word[i + 1] === ACUTE) return n;
    n += 1;
  }
  return -1;
}

function vowelTotal(word) {
  let n = 0;
  for (const ch of word) {
    if (ch !== ACUTE && isVowel(ch)) n += 1;
  }
  return n;
}

function yoOrdinal(word) {
  let n = 0;
  for (const ch of word) {
    if (ch === ACUTE || !isVowel(ch)) continue;
    if (ch === 'ё') return n;
    n += 1;
  }
  return -1;
}

/* Переписываем только гласные: согласные и их регистр не трогаем. */
function rewriteVowels(word, ordinal, yo = false) {
  let out = '';
  let n = 0;
  for (const ch of word) {
    if (ch === ACUTE) continue;
    if (!isVowel(ch)) { out += ch; continue; }
    if (n === ordinal) out += yo ? 'Ё' : ch.toUpperCase();
    else out += ch.toLowerCase();
    n += 1;
  }
  return out;
}

export function buildStressIndex(csv) {
  const map = new Map();
  const parts = String(csv || '').split(',');

  for (let i = 0; i < parts.length; i += 1) {
    const raw = parts[i].trim();
    if (!raw) continue;

    const ordinal = stressOrdinal(raw);
    if (ordinal < 0) continue;

    const key = stripAcute(raw).toLowerCase();
    if (map.has(key)) continue; // первое вхождение — как линейный поиск в оригинале
    map.set(key, ordinal);
  }

  parts.length = 0;
  return map;
}

/* slovar_Yo.txt: ударная Е в записи означает, что там Ё. */
export function buildYoIndex(csv) {
  const map = new Map();
  const parts = String(csv || '').split(',');

  for (let i = 0; i < parts.length; i += 1) {
    const raw = parts[i].trim();
    if (!raw) continue;

    let n = 0;
    let ordinal = -1;
    for (const ch of raw) {
      if (ch === ACUTE || !isVowel(ch)) continue;
      if (ch === 'Е') { ordinal = n; break; }
      n += 1;
    }
    if (ordinal < 0) continue;

    const key = stripAcute(raw).toLowerCase();
    if (map.has(key)) continue;
    map.set(key, ordinal);
  }

  parts.length = 0;
  return map;
}

export function applyAccents(text, { index, yoIndex, tonic = false } = {}) {
  const unmarked = [];
  let words = 0;
  let marked = 0;
  let manual = 0;
  let yoApplied = 0;
  let fromDict = 0;

  const result = String(text || '').replace(WORD_RE, (raw) => {
    const total = vowelTotal(raw);
    if (!total) return stripAcute(raw);
    words += 1;

    // 1. ручная разметка — сохраняем
    const manualOrdinal = stressOrdinal(raw);
    if (manualOrdinal >= 0) {
      marked += 1;
      manual += 1;
      return rewriteVowels(raw, manualOrdinal);
    }

    const clean = stripAcute(raw);
    const lower = clean.toLowerCase();

    // 2. ё в самом тексте
    const yo = yoOrdinal(lower);
    if (yo >= 0) {
      marked += 1;
      return rewriteVowels(clean, yo);
    }

    // 3. основной словарь
    const hit = index ? index.get(lower) : undefined;
    if (hit !== undefined && hit < total) {
      marked += 1;
      fromDict += 1;
      return rewriteVowels(clean, hit);
    }

    // 4. словарь Ё
    const yoHit = yoIndex ? yoIndex.get(lower) : undefined;
    if (yoHit !== undefined && yoHit < total) {
      marked += 1;
      yoApplied += 1;
      return rewriteVowels(clean, yoHit, true);
    }

    // 5. односложные
    if (total === 1) {
      if (tonic) return rewriteVowels(clean, -1);
      marked += 1;
      return rewriteVowels(clean, 0);
    }

    unmarked.push(lower);
    return rewriteVowels(clean, -1);
  });

  return {
    text: result,
    unmarked: [...new Set(unmarked)],
    stats: { words, marked, manual, fromDict, yoApplied, missed: unmarked.length },
  };
}