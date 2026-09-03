/** @param state {FetoState} */
export function DelSpace(state) {
// форматируем текст
// удалить одиночные строки
  StihText = state.OriginalTextInput + "\n";
  stihMas = StihText.split("\n");
  stihMas.unshift("");
  let TextProbel = "";
  if (CrossOverMode != 1) {
    for (let i = 1; i < stihMas.length - 1; i++) {
      let pr = stihMas[i - 1] + stihMas[i + 1];
      if (pr.length > 0) {
        TextProbel = TextProbel + stihMas[i] + "\n"
      }
      ;
    }
    state.OriginalTextInput = TextProbel;
  }
//=====================================================================
  StihText = state.OriginalTextInput + "\n";
  StihText = StihText.replace(/^\n+/g, '');    // удалить пустые строки в начале
  StihText = StihText.replace(/\:/g, '\: '); // добавить пробел после :
  StihText = StihText.replace(/\;/g, '\; '); // добавить пробел после ;
  StihText = StihText.replace(/\?/g, '\? '); // добавить пробел после ?
  StihText = StihText.replace(/\!/g, '\! '); // добавить пробел после !
  StihText = StihText.replace(/\,/g, '\, '); // добавить пробел после запятой
  StihText = StihText.replace(/\./g, '\. '); // добавить пробел после точки
  StihText = StihText.replace(/ \,/g, '\,'); // убрать пробел перед запятой
  StihText = StihText.replace(/ \./g, '\.'); // убрать пробел перед точкой
  StihText = StihText.replace(/^ +/gm, '');    // удалить пробелы в начале строки
  StihText = StihText.replace(/ +$/gm, ' ');    // удалить лишние пробелы в конце строки
  StihText = StihText.replace(/–/gm, ' – ');    // заменить тире на тире с пробелами
  StihText = StihText.replace(/-$/gm, ' – ');    // заменить дефис в конце на тире
  StihText = StihText.replace(/[\t\v\f\r]/g, ' '); // заменить спецпробел пробелом
  StihText = StihText.replace(/\n{2,}/gm, '\n\n'); // заменить две пустые строки одной
  StihText = StihText.replace(/\n+$/g, '');    // удалить пустые строки в конце
  StihText = StihText.replace(/[ ][\"]/g, ' «'); // заменить левые кавычки треугольными (пробел с кавычкой)
  StihText = StihText.replace(/[,][\"]/g, ', «'); // заменить левые кавычки треугольными (запятая с кавычкой)
  StihText = StihText.replace(/[:][\"]/g, ': «'); // заменить левые кавычки треугольными (двоеточие с кавычкой)
  StihText = StihText.replace(/^\"+/gm, '«'); // заменить левые кавычки треугольными (начало строки с кавычкой)
  StihText = StihText.replace(/\"+$/gm, '»'); // заменить правые кавычки треугольными (конец строки с кавычкой)
  StihText = StihText.replace(/[\"][ ,]/g, '»,'); // заменить правые кавычки треугольными (кавычка с небуквой)
  StihText = StihText.replace(/[\"][ .]/g, '».'); // заменить правые кавычки треугольными (кавычка с небуквой)
  StihText = StihText.replace(/[\"][ ?]/g, '»?'); // заменить правые кавычки треугольными (кавычка с небуквой)
  StihText = StihText.replace(/[\"][ !]/g, '»!'); // заменить правые кавычки треугольными (кавычка с небуквой)
  StihText = StihText.replace(/[\"][ :]/g, '»:'); // заменить правые кавычки треугольными (кавычка с небуквой)
  StihText = StihText.replace(/ +/g, ' '); // заменить длинные пробелы одним

  state.OriginalTextInput = StihText + "\n";
  TextStihResize();

}