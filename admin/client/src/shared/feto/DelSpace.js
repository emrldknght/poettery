/** @param state {FetoState} */
export function DelSpace(state) {
// форматируем текст
// удалить одиночные строки
  state.StihText = state.OriginalTextInput + "\n";
  state.stihMas = state.StihText.split("\n");
  state.stihMas.unshift("");
  let TextProbel = "";
  if (state.CrossOverMode !== 1) {
    for (let i = 1; i < state.stihMas.length - 1; i++) {
      let pr = state.stihMas[i - 1] + state.stihMas[i + 1];
      if (pr.length > 0) {
        TextProbel = TextProbel + state.stihMas[i] + "\n"
      }
      ;
    }
    state.OriginalTextInput = TextProbel;
  }
//=====================================================================
  state.StihText = state.OriginalTextInput + "\n";
  state.StihText = state.StihText.replace(/^\n+/g, '');    // удалить пустые строки в начале
  state.StihText = state.StihText.replace(/\:/g, '\: '); // добавить пробел после :
  state.StihText = state.StihText.replace(/\;/g, '\; '); // добавить пробел после ;
  state.StihText = state.StihText.replace(/\?/g, '\? '); // добавить пробел после ?
  state.StihText = state.StihText.replace(/\!/g, '\! '); // добавить пробел после !
  state.StihText = state.StihText.replace(/\,/g, '\, '); // добавить пробел после запятой
  state.StihText = state.StihText.replace(/\./g, '\. '); // добавить пробел после точки
  state.StihText = state.StihText.replace(/ \,/g, '\,'); // убрать пробел перед запятой
  state.StihText = state.StihText.replace(/ \./g, '\.'); // убрать пробел перед точкой
  state.StihText = state.StihText.replace(/^ +/gm, '');    // удалить пробелы в начале строки
  state.StihText = state.StihText.replace(/ +$/gm, ' ');    // удалить лишние пробелы в конце строки
  state.StihText = state.StihText.replace(/–/gm, ' – ');    // заменить тире на тире с пробелами
  state.StihText = state.StihText.replace(/-$/gm, ' – ');    // заменить дефис в конце на тире
  state.StihText = state.StihText.replace(/[\t\v\f\r]/g, ' '); // заменить спецпробел пробелом
  state.StihText = state.StihText.replace(/\n{2,}/gm, '\n\n'); // заменить две пустые строки одной
  state.StihText = state.StihText.replace(/\n+$/g, '');    // удалить пустые строки в конце
  state.StihText = state.StihText.replace(/[ ][\"]/g, ' «'); // заменить левые кавычки треугольными (пробел с кавычкой)
  state.StihText = state.StihText.replace(/[,][\"]/g, ', «'); // заменить левые кавычки треугольными (запятая с кавычкой)
  state.StihText = state.StihText.replace(/[:][\"]/g, ': «'); // заменить левые кавычки треугольными (двоеточие с кавычкой)
  state.StihText = state.StihText.replace(/^\"+/gm, '«'); // заменить левые кавычки треугольными (начало строки с кавычкой)
  state.StihText = state.StihText.replace(/\"+$/gm, '»'); // заменить правые кавычки треугольными (конец строки с кавычкой)
  state.StihText = state.StihText.replace(/[\"][ ,]/g, '»,'); // заменить правые кавычки треугольными (кавычка с небуквой)
  state.StihText = state.StihText.replace(/[\"][ .]/g, '».'); // заменить правые кавычки треугольными (кавычка с небуквой)
  state.StihText = state.StihText.replace(/[\"][ ?]/g, '»?'); // заменить правые кавычки треугольными (кавычка с небуквой)
  state.StihText = state.StihText.replace(/[\"][ !]/g, '»!'); // заменить правые кавычки треугольными (кавычка с небуквой)
  state.StihText = state.StihText.replace(/[\"][ :]/g, '»:'); // заменить правые кавычки треугольными (кавычка с небуквой)
  state.StihText = state.StihText.replace(/ +/g, ' '); // заменить длинные пробелы одним

  state.OriginalTextInput = state.StihText + "\n";
  TextStihResize();

}