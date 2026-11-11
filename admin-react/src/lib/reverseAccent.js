/* ReversAccent — приведение текста к вычисленному базовому ритму.
   1. Односложные слова: столбец 1 → строчная гласная, столбцы 2–3 → заглавная.
   2. Неразмеченные многосложные: ударение ставится на гласную, попавшую
      на ударный/смешанный столбец с безударным соседом.
   Блокирующих confirm() нет — спорные слова остаются неразмеченными
   и попадают в список для ручной правки кликом. */

const VOWELS = 'аеёиоуыэюя';
const UPPER = 'АЕЁИОУЫЭЮЯ';
const ACUTE = '\u0301';
const WORD_RE = /[а-яёА-ЯЁ]+/g;

const isVowel = (ch) => !!ch && VOWELS.includes(ch.toLowerCase());
const isUpperVowel = (ch) => !!ch && UPPER.includes(ch);

function normalizeAcutes(text) {
  return String(text || '').replace(/([а-яёА-ЯЁ])\u0301/g, (_, ch) => ch.toUpperCase());
}

function vowelPositions(word) {
  const out = [];
  for (let i = 0; i < word.length; i += 1) {
    if (isVowel(word[i])) out.push(i);
  }
  return out;
}

function hasMark(word) {
  for (let i = 0; i < word.length; i += 1) {
    if (isUpperVowel(word[i]) || word[i] === ACUTE) return true;
  }
  return false;
}

function setCase(word, pos, upper) {
  const ch = word[pos];
  if (!ch) return word;
  return word.slice(0, pos)
    + (upper ? ch.toUpperCase() : ch.toLowerCase())
    + word.slice(pos + 1);
}

export function reverseAccent(text, ritm, options = {}) {
  const { adjustMono = true, promoteUnmarked = true } = options;
  const source = normalizeAcutes(text);
  const columns = Array.isArray(ritm) ? ritm : [];

  const colType = (n) => {
    if (n < 1 || n > columns.length) return 1;
    return columns[n - 1] || 1;
  };

  let monoUp = 0;
  let monoDown = 0;
  let promoted = 0;
  let stillUnmarked = 0;
  const unmarked = [];

  const outLines = source.split('\n').map((line) => {
    let column = 0;

    return line.replace(WORD_RE, (raw) => {
      const positions = vowelPositions(raw);
      if (!positions.length) return raw;

      const total = positions.length;
      let marked = hasMark(raw);
      let result = raw;

      positions.forEach((pos) => {
        column += 1;
        const type = colType(column);

        if (total === 1) {
          if (!adjustMono) return;
          const shouldUpper = type === 2 || type === 3;
          const isUpper = isUpperVowel(result[pos]);

          if (shouldUpper && !isUpper) {
            result = setCase(result, pos, true);
            monoUp += 1;
          } else if (!shouldUpper && isUpper) {
            result = setCase(result, pos, false);
            monoDown += 1;
          }
          marked = shouldUpper;
          return;
        }

        if (!marked && promoteUnmarked) {
          const prev = colType(column - 1);
          const next = colType(column + 1);
          if ((type === 2 || type === 3) && (prev === 1 || next === 1)) {
            result = setCase(result, pos, true);
            marked = true;
            promoted += 1;
          }
        }
      });

      if (!marked && total > 1) {
        stillUnmarked += 1;
        unmarked.push(result.toLowerCase());
      }

      return result;
    });
  });

  return {
    text: outLines.join('\n'),
    unmarked: [...new Set(unmarked)],
    stats: { monoUp, monoDown, promoted, stillUnmarked },
  };
}