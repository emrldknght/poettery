/** @param state {FetoState} */
export function LongAnaliz(state) {
// проводим длинный анализ - каждая строфа вытянута в строку

  StihText = state.OriginalTextInput + "\n";
  console.log(StihText);
  StihText = StihText.replace(/\n\n/g, '%'); // заменить два перевода на процент
  StihText = StihText.replace(/\n/g, ' '); // удалить любой перевод строки
  StihText = StihText.replace(/%/g, '\n\n'); // заменить обратно процент на два  перевода строки
  console.log(StihText);
// удвоить строфы

  state.OriginalTextInput = StihText + "\n\n" + StihText + "\n\n";
  TextStihResize();
  TriCodCount();

}