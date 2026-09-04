/** @param state {FetoState} */
export function LongAnaliz(state) {
// проводим длинный анализ - каждая строфа вытянута в строку

  state.StihText = state.OriginalTextInput + "\n";
  console.log(state.StihText);
  state.StihText = state.StihText.replace(/\n\n/g, '%'); // заменить два перевода на процент
  state.StihText = state.StihText.replace(/\n/g, ' '); // удалить любой перевод строки
  state.StihText = state.StihText.replace(/%/g, '\n\n'); // заменить обратно процент на два  перевода строки
  console.log(state.StihText);
// удвоить строфы

  state.OriginalTextInput = state.StihText + "\n\n" + state.StihText + "\n\n";
  TextStihResize();
  TriCodCount(state);

}