export function LongAnaliz() {
// проводим длинный анализ - каждая строфа вытянута в строку

  StihText = document.formStih1.TextStih.value + "\n";
  console.log(StihText);
  StihText = StihText.replace(/\n\n/g, '%'); // заменить два перевода на процент
  StihText = StihText.replace(/\n/g, ' '); // удалить любой перевод строки
  StihText = StihText.replace(/%/g, '\n\n'); // заменить обратно процент на два  перевода строки
  console.log(StihText);
// удвоить строфы

  document.formStih1.TextStih.value = StihText + "\n\n" + StihText + "\n\n";
  TextStihResize();
  TriCodCount();

}