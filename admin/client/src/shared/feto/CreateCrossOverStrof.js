export function CreateCrossOverStrof()
// интегральный анализ на основе группированных строф CrossOverStihMas -  CrossOverProbelStrofMas
// берем исходный текст и TemplateGlasn, сортируем строки по размеру, группируем, добавляем пробел между строфами

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// для строф больше 7 строк добавлять разрывы
// сортировать внутри строф шаблоны гласных по длине, а потом по номеру строки в строфе
// НУЖНО сделать анализ кросс строф с поиском идентичного ритма, вывести процент совпадений

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


{
  CrossOverMode = 1;
  CrossOverStihMas = []; //массив содержит исходный стих до сортировки (для перекрёсных строф)
  CrossOverProbelStrofMas = []; // исходный стих отсортирован и разбит на кросс-строфы (добавлены пробелы)
  CrossOverProbelStrofMas2 = []; // исходный стих отсортирован и разбит на кросс-строфы (добавлены пробелы ещё раз)
  CrossTemplateGlasnMas = []; //массив содержит гласные - сортируем его

  OldCrossTemplateGlasnMas = []; //массив содержит гласные - сохраняем его до сортировки
  OldCrossOverStihMas = []; //массив содержит исходный стих - сохраняем его до сортировки
  let CrossNumvStrofe = []; //массив содержит позицию строки в строфе

  NewPosCrossOverStihMas = []; //массив содержит новые позиции строк стиха после сортировки и разбивки на строфы (индекс - исходная позиция строки, значение - новая позиция строки)
  DelSpace();
  let stih = document.formStih1.TextStih.value; // запоминаем исходный стих
  NaturalStih = stih; // запоминаем исходный стих

  OldCrossOverStihMas = stih.split("\n"); //массив содержит исходный стих - сохраняем его до сортировки (с пробелами)

  let numst = 0; // номер строки в строфе
  let nn = 0; // номер строки
// создаём массив CrossNumvStrofe, определяющий номер строки в строфе ==========================================
  for (let k = 0; k < OldCrossOverStihMas.length; k++) {
    numst = numst + 1;

    if (OldCrossOverStihMas[k] == "") {
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

  CrossOverStihMas = stih.split("\n"); //массив содержит исходный стих до сортировки (для перекрёсных строф)


  TemplateGlasn = TemplateGlasn.replace(/\n{2,}/gm, '\n'); // заменить две пустые строки одной
  TemplateGlasn = '\n' + TemplateGlasn; // добавим пробел в нулевую позицию
  CrossTemplateGlasnMas = TemplateGlasn.split("\n"); //массив содержит гласные (без пустых строк)

  OldCrossTemplateGlasnMas = CrossTemplateGlasnMas.slice(); //массив содержит гласные - сохраняем его до сортировки

// заполняем NewPosCrossOverStihMas индексами от 1 до количества строк (потом будем сортировать) ======================================================
  for (let k = 1; k < CrossTemplateGlasnMas.length + 1; k++) {
    NewPosCrossOverStihMas[k] = k;
  }

  // заполнили NewPosCrossOverStihMas индексами от 1 до количества строк (потом будем сортировать) ==========================================

  console.log("NewPosCrossOverStihMas");
  console.log(NewPosCrossOverStihMas);

  console.log("до сортировки строк по длине");

  console.log("CrossOverStihMas");
  console.log(CrossOverStihMas);


  console.log("CrossTemplateGlasnMas");
  console.log(CrossTemplateGlasnMas);

  console.log("CrossRitmStrofa");
  console.log(CrossRitmStrofa);

  console.log('OldCrossTemplateGlasnMas222');
  console.log(OldCrossTemplateGlasnMas);


  let cur = 0;
  let PosCur = 0;
  let NumCrossStrofa = 0;
  let dl1 = 0;
  let dl2 = 0;
// сортируем строки по длине
// попарная перестановка m-максимум
  for (let k = 1; k < CrossTemplateGlasnMas.length; k++) {
    for (let m = 1; m < CrossTemplateGlasnMas.length; m++) {

      // сравниваем по длине и номеру строки (склеиваем два числа через запятую)
      dl1 = CrossTemplateGlasnMas[k].length + "." + CrossNumvStrofe[k];
      dl2 = CrossTemplateGlasnMas[m].length + "." + CrossNumvStrofe[m];
      console.log(dl1, dl2);

      if (dl1 > dl2) {
        // меняем местами максимум М и текущий cur в шаблоне гласных CrossTemplateGlasnMas
        cur = CrossTemplateGlasnMas[k];
        CrossTemplateGlasnMas[k] = CrossTemplateGlasnMas[m];
        CrossTemplateGlasnMas[m] = cur;
        // одновременно меняем местами максимум М и текущий cur в исходном стихе CrossOverStihMas
        cur = CrossOverStihMas[k];
        CrossOverStihMas[k] = CrossOverStihMas[m];
        CrossOverStihMas[m] = cur;
        // одновременно меняем местами максимум М и текущий cur в массиве ритмов CrossRitmStrofa
        cur = CrossRitmStrofa[k];
        CrossRitmStrofa[k] = CrossRitmStrofa[m];
        CrossRitmStrofa[m] = cur;
        // массив NewPosCrossOverStihMas содержит новые позиции строк стиха после сортировки и разбивки на строфы (индекс - исходная позиция строки, значение - новая позиция строки)
        PosCur = NewPosCrossOverStihMas[k];
        NewPosCrossOverStihMas[k] = NewPosCrossOverStihMas[m];
        NewPosCrossOverStihMas[m] = PosCur;
        // одновременно меняем местами максимум М и текущий cur в массиве CrossNumvStrofe, содержащем номер строки в строфе
        PosCur = CrossNumvStrofe[k];
        CrossNumvStrofe[k] = CrossNumvStrofe[m];
        CrossNumvStrofe[m] = PosCur;
      }
    }
  }

  console.log("отсортировали строки по длине");

  console.log("CrossOverStihMas");
  console.log(CrossOverStihMas);

  console.log("CrossRitmStrofa");
  console.log(CrossRitmStrofa);

  console.log("CrossNumvStrofe");
  console.log(CrossNumvStrofe);

  console.log("добавляем пробелы между строфами");

  let kprobel = 0;
  CrossTemplateGlasnMas[0] = "";
  CrossOverStihMas[0] = "";
  CrossTemplateGlasnMas[CrossTemplateGlasnMas.length] = "";
  CrossOverStihMas[CrossOverStihMas.length] = "";

  let kk = 1; // новый массив CrossOverProbelStrofMas длиннее - индекс растёт при добавлении пустой строки.
// перебираем получившийся CrossOverStihMas (отсортированный массив строк стиха) и добавляем пробелы между строфами в CrossOverProbelStrofMas, когда попадаются строки разной длины

  for (let k = 1; k < CrossTemplateGlasnMas.length - 1; k++) {

    if (CrossTemplateGlasnMas[k].length + "." + CrossNumvStrofe[k] == CrossTemplateGlasnMas[k + 1].length + "." + CrossNumvStrofe[k + 1]) {
      kk = kk + 1;
      CrossOverProbelStrofMas[kk] = CrossOverStihMas[k];
    } else {
      kk = kk + 1;
      kprobel = kprobel + 1;
      CrossOverProbelStrofMas[kk] = CrossOverStihMas[k];
      kk = kk + 1;
      CrossOverProbelStrofMas[kk] = ""; // добавляем пустую строку
      NumCrossStrofa = NumCrossStrofa + 1;
    }
  }

//	==================================================================
// для строф больше 7 строк добавим разрывы
  kk = 1;
  let colst = 0; // количество строк в строфе
  for (let k = 0; k < CrossOverProbelStrofMas.length - 3; k++) {

//если строфа больше 3 и впереди четыре не пустые строки, то добавляем пустую строку
    if (colst > 3 && CrossOverProbelStrofMas[k] != "" && CrossOverProbelStrofMas[k + 1] != "" && CrossOverProbelStrofMas[k + 2] != "" && CrossOverProbelStrofMas[k + 3] != "") {
      kk = kk + 1;
      CrossOverProbelStrofMas2[kk] = "";
      kk = kk + 1;
      CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[k];
      colst = 0;
    } else {
      kk = kk + 1;
      CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[k];
      colst = colst + 1;
    }
  }
  kk = kk + 1;
  CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[CrossOverProbelStrofMas.length - 3];
  kk = kk + 1;
  CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[CrossOverProbelStrofMas.length - 2];
  kk = kk + 1;
  CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[CrossOverProbelStrofMas.length - 1];
  kk = kk + 1;
  CrossOverProbelStrofMas2[kk] = CrossOverProbelStrofMas[CrossOverProbelStrofMas.length];

  CrossOverProbelStrofMas = CrossOverProbelStrofMas2.slice();

  console.log('NewPosCrossOverStihMas');
  console.log(NewPosCrossOverStihMas);

  console.log("CrossTemplateGlasnMas");
  console.log(CrossTemplateGlasnMas);

  console.log("CrossOverProbelStrofMas");
  console.log(CrossOverProbelStrofMas);

// возвращаем стих в текстовое поле
  document.formStih1.TextStih.value = CrossOverProbelStrofMas.join("\n");

  stih = document.formStih1.TextStih.value;
  DelSpace();

}