/** @param state {FetoState} */
export function CreateCrossOverStrof(state)
// интегральный анализ на основе группированных строф CrossOverStihMas -  CrossOverProbelStrofMas
// берем исходный текст и TemplateGlasn, сортируем строки по размеру, группируем, добавляем пробел между строфами

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// для строф больше 7 строк добавлять разрывы
// сортировать внутри строф шаблоны гласных по длине, а потом по номеру строки в строфе
// НУЖНО сделать анализ кросс строф с поиском идентичного ритма, вывести процент совпадений

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


{
  state.CrossOverMode = 1;
  state.CrossOverStihMas = []; //массив содержит исходный стих до сортировки (для перекрёсных строф)
  state.CrossOverProbelStrofMas = []; // исходный стих отсортирован и разбит на кросс-строфы (добавлены пробелы)
  state.CrossOverProbelStrofMas2 = []; // исходный стих отсортирован и разбит на кросс-строфы (добавлены пробелы ещё раз)
  state.CrossTemplateGlasnMas = []; //массив содержит гласные - сортируем его

  state.OldCrossTemplateGlasnMas = []; //массив содержит гласные - сохраняем его до сортировки
  state.OldCrossOverStihMas = []; //массив содержит исходный стих - сохраняем его до сортировки
  let CrossNumvStrofe = []; //массив содержит позицию строки в строфе

  state.NewPosCrossOverStihMas = []; //массив содержит новые позиции строк стиха после сортировки и разбивки на строфы (индекс - исходная позиция строки, значение - новая позиция строки)
  DelSpace(state);
  let stih = state.OriginalTextInput; // запоминаем исходный стих
  const NaturalStih = stih; // запоминаем исходный стих

  state.OldCrossOverStihMas = stih.split("\n"); //массив содержит исходный стих - сохраняем его до сортировки (с пробелами)

  let numst = 0; // номер строки в строфе
  let nn = 0; // номер строки
// создаём массив CrossNumvStrofe, определяющий номер строки в строфе ==========================================
  for (let k = 0; k < state.OldCrossOverStihMas.length; k++) {
    numst = numst + 1;

    if (state.OldCrossOverStihMas[k] === "") {
      numst = 0;
    } else {
      nn = nn + 1;
      CrossNumvStrofe[nn] = numst;
    }
  }
  console.log("CrossNumvStrofe");
  console.log(CrossNumvStrofe);
// создали массив CrossNumvStrofe, определяющий номер строки в строфе ==========================================


  stih = stih.replace(/\n{2,}/gm, '\n'); // заменить две пустые строки одной
  stih = '\n' + stih; // добавим пробел в нулевую позицию

  state.CrossOverStihMas = stih.split("\n"); //массив содержит исходный стих до сортировки (для перекрёсных строф)


  state.TemplateGlasn = state.TemplateGlasn.replace(/\n{2,}/gm, '\n'); // заменить две пустые строки одной
  state.TemplateGlasn = '\n' + state.TemplateGlasn; // добавим пробел в нулевую позицию
  state.CrossTemplateGlasnMas = state.TemplateGlasn.split("\n"); //массив содержит гласные (без пустых строк)

  state.OldCrossTemplateGlasnMas = state.CrossTemplateGlasnMas.slice(); //массив содержит гласные - сохраняем его до сортировки

// заполняем NewPosCrossOverStihMas индексами от 1 до количества строк (потом будем сортировать) ======================================================
  for (let k = 1; k < state.CrossTemplateGlasnMas.length + 1; k++) {
    state.NewPosCrossOverStihMas[k] = k;
  }

  // заполнили NewPosCrossOverStihMas индексами от 1 до количества строк (потом будем сортировать) ==========================================

  console.log("NewPosCrossOverStihMas");
  console.log(state.NewPosCrossOverStihMas);

  console.log("до сортировки строк по длине");

  console.log("CrossOverStihMas");
  console.log(state.CrossOverStihMas);


  console.log("CrossTemplateGlasnMas");
  console.log(state.CrossTemplateGlasnMas);

  console.log("CrossRitmStrofa");
  console.log(state.CrossRitmStrofa);

  console.log('OldCrossTemplateGlasnMas222');
  console.log(state.OldCrossTemplateGlasnMas);


  let cur = 0;
  let PosCur = 0;
  let NumCrossStrofa = 0;
  let dl1 = 0;
  let dl2 = 0;
// сортируем строки по длине
// попарная перестановка m-максимум
  for (let k = 1; k < state.CrossTemplateGlasnMas.length; k++) {
    for (let m = 1; m < state.CrossTemplateGlasnMas.length; m++) {

      // сравниваем по длине и номеру строки (склеиваем два числа через запятую)
      dl1 = state.CrossTemplateGlasnMas[k].length + "." + CrossNumvStrofe[k];
      dl2 = state.CrossTemplateGlasnMas[m].length + "." + CrossNumvStrofe[m];
      console.log(dl1, dl2);

      if (dl1 > dl2) {
        // меняем местами максимум М и текущий cur в шаблоне гласных CrossTemplateGlasnMas
        cur = state.CrossTemplateGlasnMas[k];
        state.CrossTemplateGlasnMas[k] = state.CrossTemplateGlasnMas[m];
        state.CrossTemplateGlasnMas[m] = cur;
        // одновременно меняем местами максимум М и текущий cur в исходном стихе CrossOverStihMas
        cur = state.CrossOverStihMas[k];
        state.CrossOverStihMas[k] = state.CrossOverStihMas[m];
        state.CrossOverStihMas[m] = cur;
        // одновременно меняем местами максимум М и текущий cur в массиве ритмов CrossRitmStrofa
        cur = state.CrossRitmStrofa[k];
        state.CrossRitmStrofa[k] = state.CrossRitmStrofa[m];
        state.CrossRitmStrofa[m] = cur;
        // массив NewPosCrossOverStihMas содержит новые позиции строк стиха после сортировки и разбивки на строфы (индекс - исходная позиция строки, значение - новая позиция строки)
        PosCur = state.NewPosCrossOverStihMas[k];
        state.NewPosCrossOverStihMas[k] = state.NewPosCrossOverStihMas[m];
        state.NewPosCrossOverStihMas[m] = PosCur;
        // одновременно меняем местами максимум М и текущий cur в массиве CrossNumvStrofe, содержащем номер строки в строфе
        PosCur = CrossNumvStrofe[k];
        CrossNumvStrofe[k] = CrossNumvStrofe[m];
        CrossNumvStrofe[m] = PosCur;
      }
    }
  }

  console.log("отсортировали строки по длине");

  console.log("CrossOverStihMas");
  console.log(state.CrossOverStihMas);

  console.log("CrossRitmStrofa");
  console.log(state.CrossRitmStrofa);

  console.log("CrossNumvStrofe");
  console.log(CrossNumvStrofe);

  console.log("добавляем пробелы между строфами");

  let kprobel = 0;
  state.CrossTemplateGlasnMas[0] = "";
  state.CrossOverStihMas[0] = "";
  state.CrossTemplateGlasnMas[state.CrossTemplateGlasnMas.length] = "";
  state.CrossOverStihMas[state.CrossOverStihMas.length] = "";

  let kk = 1; // новый массив CrossOverProbelStrofMas длиннее - индекс растёт при добавлении пустой строки.
// перебираем получившийся CrossOverStihMas (отсортированный массив строк стиха) и добавляем пробелы между строфами в CrossOverProbelStrofMas, когда попадаются строки разной длины

  for (let k = 1; k < state.CrossTemplateGlasnMas.length - 1; k++) {

    if (state.CrossTemplateGlasnMas[k].length + "." + CrossNumvStrofe[k] === state.CrossTemplateGlasnMas[k + 1].length + "." + CrossNumvStrofe[k + 1]) {
      kk = kk + 1;
      state.CrossOverProbelStrofMas[kk] = state.CrossOverStihMas[k];
    } else {
      kk = kk + 1;
      kprobel = kprobel + 1;
      state.CrossOverProbelStrofMas[kk] = state.CrossOverStihMas[k];
      kk = kk + 1;
      state.CrossOverProbelStrofMas[kk] = ""; // добавляем пустую строку
      NumCrossStrofa = NumCrossStrofa + 1;
    }
  }

//	==================================================================
// для строф больше 7 строк добавим разрывы
  kk = 1;
  let colst = 0; // количество строк в строфе
  for (let k = 0; k < state.CrossOverProbelStrofMas.length - 3; k++) {

//если строфа больше 3 и впереди четыре не пустые строки, то добавляем пустую строку
    if (colst > 3 && state.CrossOverProbelStrofMas[k] !== "" && state.CrossOverProbelStrofMas[k + 1] !== "" && state.CrossOverProbelStrofMas[k + 2] !== "" && state.CrossOverProbelStrofMas[k + 3] !== "") {
      kk = kk + 1;
      state.CrossOverProbelStrofMas2[kk] = "";
      kk = kk + 1;
      state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[k];
      colst = 0;
    } else {
      kk = kk + 1;
      state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[k];
      colst = colst + 1;
    }
  }
  kk = kk + 1;
  state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[state.CrossOverProbelStrofMas.length - 3];
  kk = kk + 1;
  state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[state.CrossOverProbelStrofMas.length - 2];
  kk = kk + 1;
  state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[state.CrossOverProbelStrofMas.length - 1];
  kk = kk + 1;
  state.CrossOverProbelStrofMas2[kk] = state.CrossOverProbelStrofMas[state.CrossOverProbelStrofMas.length];

  state.CrossOverProbelStrofMas = state.CrossOverProbelStrofMas2.slice();

  console.log('NewPosCrossOverStihMas');
  console.log(state.NewPosCrossOverStihMas);

  console.log("CrossTemplateGlasnMas");
  console.log(state.CrossTemplateGlasnMas);

  console.log("CrossOverProbelStrofMas");
  console.log(state.CrossOverProbelStrofMas);

// возвращаем стих в текстовое поле
  state.OriginalTextInput = state.CrossOverProbelStrofMas.join("\n");

  stih = state.OriginalTextInput;
  DelSpace(state);

}