import {analyzePoem, checkTonicSystem} from "./analyzePoem.js";

/** @param state {FetoState} */
export function startAnalyzePoem(state) {
  // todo - switch divs to text
  // const resultDiv = document.getElementById('ContainerAnaliz1f'); // temp no remove
  // const commentsDiv = document.getElementById('ContainerAnaliz1'); // temp no remove
  // const templateDiv = document.getElementById('ContainerTemplate1'); // temp no remove
  // resultDiv.innerHTML = '';
  // commentsDiv.innerHTML = '';
  // templateDiv.innerHTML = '';

  state.ContainerAnaliz1f = '';
  state.ContainerAnaliz1 = '';
  state.ContainerTemplate1 = '';

  // Получаем стихотворение из текстового поля
  const poem = state.OriginalTextInput; // document.getElementById('TextStih1').value.trim();
  if (!poem) {
    console.warn('[start.js] - no poem')
    // resultDiv.textContent = 'Введите стихотворение для анализа.';
    state.ContainerAnaliz1f = 'Введите стихотворение для анализа.';
    return;
  }
  console.warn('[start.js] - poem with text', poem)

  // Первый вызов analyzePoem
  const firstResult = analyzePoem(poem, 1, state);

  // Если есть исключённые строки, вызываем analyzePoem ещё раз
  if (firstResult.excludedLines.length > 0) {
    const fixedPoem = firstResult.lines.join('\n');
    const secondResult = analyzePoem(fixedPoem, 2, state);

    // Выводим итоговый результат
    // resultDiv.innerHTML = '<b>Итоговый ритм: ' + secondResult.columnAverages.join(' ') + '<br><br></b>';
    state.ContainerAnaliz1f = '<b>Итоговый ритм: ' + secondResult.columnAverages.join(' ') + '<br><br></b>';
    checkTonicSystem(secondResult.columnAverages, state);
  } else {
    // Выводим итоговый результат
    // resultDiv.innerHTML = '<b>Итоговый ритм: ' + firstResult.columnAverages.join(' ') + '<br><br></b>';
    state.ContainerAnaliz1f = '<b>Итоговый ритм: ' + firstResult.columnAverages.join(' ') + '<br><br></b>';
    checkTonicSystem(firstResult.columnAverages, state);
  }
}