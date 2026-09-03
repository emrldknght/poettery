/** @param state {FetoState} */
export function ReturnCrossOverStrof(state)
// возвращаем перекрёстные строфы (развернув обратно) в первое текстовое поле, а шаблоны в поле шаблонов ==========================================================================================
// ритм блока CrossLentaRitm[lenta] - возвращаем (рисуем) в блок шаблона, заодно формируем новый массив ритмов строф CrossRitmResult, чтобы потом искать ритмично идентичные строфы
// шаблон гласных  CrossTemplateGlasn[lenta] возвращаем (рисуем) в блок шаблона (подпрограмма цветного рисования CreateBlockRitmStroka)
// позиции строк стихотворения в массиве NewPosCrossOverStihMas[m]
// создаём антимассив AntiPosCrossOverStihMas для NewPosCrossOverStihMas[k] (индекс становится значением, а значение индексом);
// возвращаем стих с ударениями, расставленными в ленте после кроссанализа. Собираем стих построчно (построфно) в цикле ленты NewAccentLentaTextMas
// на выходе CrossRitmResult - массив ритмов строф (их можно сравнить или сгруппировать)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

{
  let m = 0;
  let FullBlockRitm = "";
  let BlockRitmStroka = "";


  let RitmStroka = "";
  let RitmStrokaMas = []; // ритм одной строки в виде одномерного массива
  CrossRitmResult = []; // массив ритмов строф
  let ColorStroka = "";
  let NewAccentLentaTextMas = [];  //массив содержит исходный стих с ударениями, расставленными в кросс-строфах

  //массив содержит исходный стих с ударениями, расставленными в кросс-строфах
  NewAccentLentaText = '\n' + NewAccentLentaText; // добавим пробел в нулевую позицию
  NewAccentLentaTextMas = NewAccentLentaText.split("\n"); //массив содержит исходный стих с ударениями, расставленными в кросс-строфах
  NewAccentLentaText = "";
  let NewAccentLentaStroka = "";


// создаём антимассив NewPosCrossOverStihMas[k] (индекс становится значением, а значение индексом);

  let AntiPosCrossOverStihMas = [];
  let gg = 0;

  for (let g = 1; g < NewPosCrossOverStihMas.length; g++) {
    gg = NewPosCrossOverStihMas[g];
    AntiPosCrossOverStihMas[gg] = g;
  }

  let pStrofa = 0; // позиции пробелов (начало строфы)
  let nStrofa = 0; // номер строфы
  let CrossRitmResultStroka = "";  // ритм кросс-строфы в текстовом виде с запятыми

// берём массив гласных OldCrossTemplateGlasnMas, применяем к нему цветной шаблон с вызовом функции CreateBlockRitmStroka(ColorStroka,RitmStroka)

  for (let k = 1; k < OldCrossTemplateGlasnMas.length; k++) {
    m = AntiPosCrossOverStihMas[k];
    console.log("k=" + k + "  m=" + m);
    RitmStroka = CrossRitmStrofa[m];

    NewAccentLentaStroka = NewAccentLentaTextMas[m];
    NewAccentLentaText = NewAccentLentaText + NewAccentLentaStroka + "\n";

    ColorStroka = OldCrossTemplateGlasnMas[k];

    CrossRitmResultStroka = CrossRitmResultStroka + RitmStroka;
    RitmStrokaMas = RitmStroka.split(",");
    RitmStrokaMas.shift(); // нулевой пустой убираем
    BlockRitmStroka = CreateBlockRitmStroka(ColorStroka, RitmStrokaMas);
    FullBlockRitm = FullBlockRitm + BlockRitmStroka + "<br>";

// отлавливаем пробелы в исходном стихе OldCrossOverStihMas и добавляем в цветной шаблон и в стих
    pStrofa = pStrofa + 1;
    if (OldCrossOverStihMas[pStrofa] == "") {
      FullBlockRitm = FullBlockRitm + "<br>";
      pStrofa = pStrofa + 1;
      nStrofa = nStrofa + 1;
      CrossRitmResult[nStrofa] = CrossRitmResultStroka;
      CrossRitmResultStroka = "";
      NewAccentLentaText = NewAccentLentaText + "\n";
    }

  }

  state.ContainerTemplate1 = slog + FullBlockRitm;
  state.OriginalTextInput = NewAccentLentaText;

  console.log('CrossRitmResult');
  console.log(CrossRitmResult);
  AnalizCrossOverStrof(state);

}