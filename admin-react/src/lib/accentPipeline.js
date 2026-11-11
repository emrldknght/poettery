/* Полный конвейер ударений как в оригинале:
   словарь → анализ ритма → ReversAccent → повторный анализ (2 прохода).
   В тонике ReversAccent не применяется — как в AccentTonic. */

import { applyAccents } from './accentCore.js';
import { analyze } from './fet-method.js';
import { reverseAccent } from './reverseAccent.js';

export function runAccentPipeline(text, options = {}) {
  const {
    index,
    yoIndex,
    tonic = false,
    passes = 2,
    adjustMono = true,
    promoteUnmarked = true,
  } = options;

  const base = applyAccents(text, { index, yoIndex, tonic });

  let currentText = base.text;
  let unmarked = base.unmarked;
  const steps = [{ stage: 'dictionary', ...base.stats }];

  const reverse = { monoUp: 0, monoDown: 0, promoted: 0, stillUnmarked: 0, passes: 0 };

  if (!tonic && currentText.trim()) {
    for (let pass = 1; pass <= passes; pass += 1) {
      const analysis = analyze(currentText);
      if (!Array.isArray(analysis.ritm) || analysis.ritm.length === 0) break;

      const rev = reverseAccent(currentText, analysis.ritm, { adjustMono, promoteUnmarked });
      if (rev.text === currentText) break;

      currentText = rev.text;
      unmarked = rev.unmarked;

      reverse.monoUp += rev.stats.monoUp;
      reverse.monoDown += rev.stats.monoDown;
      reverse.promoted += rev.stats.promoted;
      reverse.stillUnmarked = rev.stats.stillUnmarked;
      reverse.passes = pass;

      steps.push({ stage: `reverse-${pass}`, ...rev.stats });
    }
  }

  const finalAnalysis = analyze(currentText);

  return {
    text: currentText,
    unmarked,
    stats: {
      ...base.stats,
      missed: unmarked.length,
      reverse,
    },
    triCod: finalAnalysis.triCod,
    razmer: finalAnalysis.razmer,
    steps,
  };
}