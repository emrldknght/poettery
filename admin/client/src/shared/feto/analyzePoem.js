/** @param poem
 @param commentsDiv
 @param repeat {number}
 @param state {FetoState} */
function splitLines(poem, commentsDiv, repeat, state) {
  const lines = poem.split('\n');
  if (repeat === 1) {
    commentsDiv.innerHTML += '<b>Анализ подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295) <br><br></b>';
    state.ContainerAnaliz1 += '<b>Анализ подготовлен интеллектуальной системой Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295) <br><br></b>';
  }
  console.log('Исходные строки:\n' + lines.join('\n') + '\n\n');
  if (repeat === 1) {
    commentsDiv.innerHTML += '<b>Исходные строки:</b><br><br>' + lines.join('<br>') + '<br><br>';
    state.ContainerAnaliz1 += '<b>Исходные строки:</b><br><br>' + lines.join('<br>') + '<br><br>';
  }
  return lines;
}

function countStresses(lines) {
  const stressCounts = [];
  for (let i = 0; i < lines.length; i++) {
    const uppercaseVowels = lines[i].match(/[АЕЁИОУЫЭЮЯ]/g) || [];
    stressCounts.push(uppercaseVowels.length);
  }
  console.log('Количество ударных гласных в каждой строке: ' + stressCounts.join(', ') + '\n\n');
  return stressCounts;
}

/** @param stressCounts
 @param commentsDiv
 @param repeat {number}
 @param state {FetoState} */
function findMostFrequentCount(stressCounts, commentsDiv, repeat, state) {
  const countMap = {};
  for (let i = 0; i < stressCounts.length; i++) {
    const count = stressCounts[i];
    if (countMap[count]) {
      countMap[count]++;
    } else {
      countMap[count] = 1;
    }
  }
  let mostFrequentCount = 0;
  let maxFrequency = 0;
  for (const key in countMap) {
    if (countMap[key] > maxFrequency) {
      mostFrequentCount = parseInt(key);
      maxFrequency = countMap[key];
    }
  }
  if (repeat === 1) {
    commentsDiv.innerHTML += '<b>Наиболее часто встречающееся количество ударных гласных: ' + mostFrequentCount + '<br><br></b>';
    state.ContainerAnaliz1 += '<b>Наиболее часто встречающееся количество ударных гласных: ' + mostFrequentCount + '<br><br></b>';
  }
  return mostFrequentCount;
}

/** @param poem
 @param commentsDiv
 @param repeat {number}
 @param state {FetoState} */
export function analyzePoem(poem, commentsDiv, repeat, state) {
  // 1. Разбиваем стихотворение на строки
  const lines = splitLines(poem, commentsDiv, repeat, state);

  // 2. Подсчитываем количество ударных гласных
  const stressCounts = countStresses(lines);

  // 3. Находим наиболее часто встречающееся количество ударных гласных
  const mostFrequentCount = findMostFrequentCount(stressCounts, commentsDiv, repeat, state);

  // 4. Исключаем строки с несоответствующим количеством ударных
  const {
    filteredLines,
    excludedLines,
    excludedIndices
  } = filterLines(lines, stressCounts, mostFrequentCount, commentsDiv, state);

  // 5. Определяем ширину матрицы
  const matrixWidth = determineMatrixWidth(mostFrequentCount);

  // 6. Создаём и заполняем матрицу
  let matrix = createAndFillMatrix(filteredLines, matrixWidth);

  // 7. Удаляем пустые столбцы
  matrix = removeEmptyColumns(matrix);

  // 8. Выводим матрицу с применением стилей
  const styledMatrix = styleMatrix(matrix);
  if (repeat === 1) {
    commentsDiv.innerHTML += '<b>Схема ударных и безударных гласных:</b><br><br>' + styledMatrix + '<br><br>';
    state.ContainerAnaliz1 += '<b>Схема ударных и безударных гласных:</b><br><br>' + styledMatrix + '<br><br>';
  } else {
    commentsDiv.innerHTML += '<b>Схема ударных и безударных гласных, включая исправленные строки:</b><br><br>' + styledMatrix + '<br><br>';
    state.ContainerAnaliz1 += '<b>Схема ударных и безударных гласных, включая исправленные строки:</b><br><br>' + styledMatrix + '<br><br>';
  }

  // 9. Выводим итоговую матрицу в ContainerTemplate1
  state.ContainerTemplate1 = '<b>Итоговая матрица:</b><br><br>' + styledMatrix;

  // 10. Вычисляем ритмический рисунок
  const rhythmMatrix = calculateRhythm(matrix);

  // 11. Анализируем столбцы ритмического рисунка
  const columnAverages = analyzeRhythmColumns(rhythmMatrix);

  // 12. Обрабатываем исключённые строки
  const finalLines = processExcludedLines(lines, excludedLines, excludedIndices, mostFrequentCount, columnAverages);

  // Возвращаем результат
  return {
    lines: finalLines,
    excludedLines: excludedLines,
    columnAverages: columnAverages
  };
}

/** @param columnAverages
 @param resultDiv
 @param state {FetoState} */
export function checkTonicSystem(columnAverages, resultDiv, state) {
  let i;
  let isValidTonic = true;
  const errors = [];
  state.tonicBall = 0;

  // Условие 1: Не менее двух ударных позиций
  const stressCount = columnAverages.filter(x => x === 2).length;
  if (stressCount < 2) {
    isValidTonic = false;
    errors.push('Менее двух ударных позиций.');
  }

  // Условие 2: Слева и справа от ударной позиции должны быть безударные
  for (i = 0; i < columnAverages.length; i++) {
    if (columnAverages[i] === 2) {
      if (i > 0 && columnAverages[i - 1] !== 0) {
        isValidTonic = false;
        errors.push(`Ударная позиция ${i} не имеет безударной позиции слева.`);
      }
      if (i < columnAverages.length - 1 && columnAverages[i + 1] !== 0) {
        isValidTonic = false;
        errors.push(`Ударная позиция ${i} не имеет безударной позиции справа.`);
      }
    }
  }

  // Условие 3: Нет более трёх значений "0" подряд
  let zeroStreak = 0;
  for (i = 0; i < columnAverages.length; i++) {
    if (columnAverages[i] === 0) {
      zeroStreak++;
      if (zeroStreak > 3) {
        isValidTonic = false;
        errors.push('Найдено более трёх безударных позиций подряд.');
        break;
      }
    } else {
      zeroStreak = 0;
    }
  }

  // Вывод результата проверки
  if (isValidTonic) {
    resultDiv.innerHTML += '<b>Стихи соответствуют тонической системе. Обнаружен ' + stressCount + '-х ударный тонический ритм.<br></b>';
    // state.tonicBall = 1;
    state.ContainerAnaliz1f += '<b>Стихи соответствуют тонической системе. Обнаружен ' + stressCount + '-х ударный тонический ритм.<br></b>';
    state.tonicBall = 1;
  } else {
    resultDiv.innerHTML += '<b>Ритм НЕ соответствует тонической системе. Ошибки:<br></b>';
    // state.tonicBall = 0;
    state.ContainerAnaliz1f += '<b>Ритм НЕ соответствует тонической системе. Ошибки:<br></b>';
    state.tonicBall = 0;
    resultDiv.innerHTML += errors.join('<br>') + '<br>';
    state.ContainerAnaliz1f += errors.join('<br>') + '<br>';
  }
}

/** @param lines
 @param stressCounts
 @param mostFrequentCount
 @param commentsDiv
 @param state {FetoState} */
function filterLines(lines, stressCounts, mostFrequentCount, commentsDiv, state) {
  const filteredLines = [];
  const excludedLines = [];
  const excludedIndices = [];
  for (let i = 0; i < lines.length; i++) {
    if (stressCounts[i] === mostFrequentCount) {
      filteredLines.push(lines[i]);
    } else {
      excludedLines.push(lines[i]);
      excludedIndices.push(i);
    }
  }
  console.log('Отфильтрованные строки:\n' + filteredLines.join('\n') + '\n\n');
  if (excludedLines.length > 0) {
    commentsDiv.innerHTML += '<b>Исключённые строки:</b><br><br>' + excludedLines.join('<br>') + '<br><br>';
    state.ContainerAnaliz1 += '<b>Исключённые строки:</b><br><br>' + excludedLines.join('<br>') + '<br><br>';
  }
  return { filteredLines, excludedLines, excludedIndices };
}

function determineMatrixWidth(mostFrequentCount) {
  const matrixWidth = mostFrequentCount * 12;
  console.log('Ширина матрицы: ' + matrixWidth + '\n\n');
  return matrixWidth;
}

function createAndFillMatrix(lines, matrixWidth) {
  let i;
  const matrix = [];
  for (i = 0; i < lines.length; i++) {
    matrix.push(new Array(matrixWidth).fill('_'));
  }
  console.log('Инициализированная матрица:\n' + matrix.map(row => row.join(' ')).join('\n'));

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const vowels = line.match(/[АЕЁИОУЫЭЮЯаеёиоуыэюя]/g) || [];
    const stresses = (line.match(/[АЕЁИОУЫЭЮЯ]/g) || []).length;

    const step = matrixWidth / (stresses + 1);
    const stressPositions = [];
    for (i = 0; i < stresses; i++) {
      stressPositions.push(Math.round((i + 1) * step) - 1);
    }

    let vowelIndex = 0;
    let stressIndex = 0;
    for (let pos = 0; pos < matrixWidth; pos++) {
      if (stressIndex < stressPositions.length && pos === stressPositions[stressIndex]) {
        while (vowelIndex < vowels.length && vowels[vowelIndex] === vowels[vowelIndex].toLowerCase()) {
          vowelIndex++;
        }
        if (vowelIndex < vowels.length) {
          matrix[lineIndex][pos] = vowels[vowelIndex];
          vowelIndex++;
          stressIndex++;
        }
      } else if (vowelIndex < vowels.length && vowels[vowelIndex] === vowels[vowelIndex].toLowerCase()) {
        matrix[lineIndex][pos] = vowels[vowelIndex];
        vowelIndex++;
      }
    }
  }
  console.log('Заполненная матрица:\n' + matrix.map(row => row.join(' ')).join('\n'));
  return matrix;
}

function removeEmptyColumns(matrix) {
  let row;
  let col;
  const columnsToRemove = [];
  for (col = 0; col < matrix[0].length; col++) {
    let isEmptyColumn = true;
    for (row = 0; row < matrix.length; row++) {
      if (matrix[row][col] !== '_') {
        isEmptyColumn = false;
        break;
      }
    }
    if (isEmptyColumn) {
      columnsToRemove.push(col);
    }
  }
  for (let i = columnsToRemove.length - 1; i >= 0; i--) {
    col = columnsToRemove[i];
    for (row = 0; row < matrix.length; row++) {
      matrix[row].splice(col, 1);
    }
  }
  console.log('Матрица после удаления пустых столбцов:\n' + matrix.map(row => row.join(' ')).join('\n'));
  return matrix;
}

function styleMatrix(matrix) {
  return matrix.map(row => {
    return row.map(cell => {
      if (cell === cell.toUpperCase() && cell !== '_') {
        return `<span class="black-symbol">${cell}</span>`;
      } else {
        return `<span class="white-symbol">${cell}</span>`;
      }
    }).join(' ');
  }).join('<br>');
}

function calculateRhythm(matrix) {
  const rhythmMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    const rhythm = [];
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === matrix[i][j].toUpperCase() && matrix[i][j] !== '_') {
        rhythm.push(2); // Ударная гласная
      } else {
        rhythm.push(0); // Безударная гласная или пусто
      }
    }
    rhythmMatrix.push(rhythm);
  }
  console.log('Ритмический рисунок для каждой строки:\n' + rhythmMatrix.map(row => row.join(' ')).join('\n'));
  return rhythmMatrix;
}

function analyzeRhythmColumns(rhythmMatrix) {
  const columnAverages = [];
  for (let col = 0; col < rhythmMatrix[0].length; col++) {
    let sum = 0;
    for (let row = 0; row < rhythmMatrix.length; row++) {
      sum += rhythmMatrix[row][col];
    }
    const average = sum / rhythmMatrix.length;
    columnAverages.push(Math.ceil(average)); // Округляем до наибольшего целого
  }
  return columnAverages;
}

function fixExcludedLine(line, averageStresses, rhythm) {
  let vowelIndex;
  let word;
  // const vowels = line.match(/[АЕЁИОУЫЭЮЯаеёиоуыэюя]/g) || [];
  const stresses = (line.match(/[АЕЁИОУЫЭЮЯ]/g) || []).length;

  // Если количество ударных гласных отличается от среднего на 1
  if (Math.abs(stresses - averageStresses) === 1) {
    let i;
    const words = line.split(/[\s,.!?;:]+/).filter(word => word.length > 0);

    // Ищем односложное слово
    for (i = 0; i < words.length; i++) {
      word = words[i];
      const wordVowels = word.match(/[АЕЁИОУЫЭЮЯаеёиоуыэюя]/g) || [];

      // Обрабатываем только односложные слова
      if (wordVowels.length === 1) {
        vowelIndex = word.search(/[АЕЁИОУЫЭЮЯаеёиоуыэюя]/);
        const isStressed = word[vowelIndex] === word[vowelIndex].toUpperCase();

        // Проверяем позицию гласной в ритме
        const rhythmIndex = rhythm.indexOf(2); // Ищем ближайшую ударную позицию
        if (rhythmIndex !== -1) {
          // Если гласная находится на ударной позиции или рядом
          if (Math.abs(vowelIndex - rhythmIndex) <= 1) {
            if (stresses > averageStresses && isStressed) {
              // Делаем односложное слово безударным
              words[i] = word.substring(0, vowelIndex) +
                word[vowelIndex].toLowerCase() +
                word.substring(vowelIndex + 1);
              return words.join(' ');
            } else if (stresses < averageStresses && !isStressed) {
              // Делаем односложное слово ударным
              words[i] = word.substring(0, vowelIndex) +
                word[vowelIndex].toUpperCase() +
                word.substring(vowelIndex + 1);
              return words.join(' ');
            }
          }
        }
      }
    }

    // Если односложных слов нет, ищем любое слово без ударения
    for (i = 0; i < words.length; i++) {
      word = words[i];
      if (!word.match(/[АЕЁИОУЫЭЮЯ]/)) {
        vowelIndex = word.search(/[АЕЁИОУЫЭЮЯаеёиоуыэюя]/);
        if (vowelIndex !== -1) {
          // Ставим ударение на любую гласную (например, на вторую)
          words[i] = word.substring(0, vowelIndex) +
            word[vowelIndex].toUpperCase() +
            word.substring(vowelIndex + 1);
          return words.join(' ');
        }
      }
    }
  }

  // Если исправление невозможно, возвращаем null
  return null;
}

function processExcludedLines(lines, excludedLines, excludedIndices, mostFrequentCount, columnAverages) {
  for (let i = 0; i < excludedLines.length; i++) {
    const fixedLine = fixExcludedLine(excludedLines[i], mostFrequentCount, columnAverages);
    if (fixedLine !== null) {
      lines.splice(excludedIndices[i], 0, fixedLine); // Возвращаем на исходную позицию
    }
  }
  return lines;
}

