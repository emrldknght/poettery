export function TonicAnaliz() {
// проводим тонический анализ - с группировкой строф
  CrossOverMode = 0;
  console.log('проводим тонический анализ - с группировкой строф');
  LentaMode.checked = false; // не ленточный (стандартный) режим
  SaveRecord.checked = false; // запись не нужна
// удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
  ClearForm2();// закрываем запись
  console.log('закрываем запись');
// если количество букв SimvolCount после расстановки ударений изменилось более чем на 7 букв, то заново автоматом ставим ударения и проводим полный анализ, если нет- ударения расставляем руками и проводим анализ.
  SimvolCount = CountSimvol();
  console.log('SimvolCount=' + SimvolCount);
  if (Math.abs(SimvolCount - AccentCountSimvol) > 7) {
    FileAccent.checked = false;
    AccentTonic();
  } else {
    FileAccent.checked = true;
    startAnalyzePoem();
  }
  if (isMobile != null) {
    window.scroll({top: 110, left: 0, behavior: 'smooth'})
  }
  ;
}