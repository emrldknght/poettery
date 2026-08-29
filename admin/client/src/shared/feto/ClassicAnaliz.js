export function ClassicAnaliz() {
// проводим классический анализ - с группировкой строф
  CrossOverMode = 0;
  console.log('проводим классический анализ - с группировкой строф');
  LentaMode.checked = false; // не ленточный (стандартный) режим
  SaveRecord.checked = false; // запись не нужна
// удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
  ClearForm2();// закрываем запись
// если количество букв SimvolCount после расстановки ударений изменилось более чем на 7 букв, то заново автоматом ставим ударения и проводим полный анализ, если нет- ударения расставляем руками и проводим анализ.
  SimvolCount = CountSimvol();
  if (Math.abs(SimvolCount - AccentCountSimvol) > 7) {
    FileAccent.checked = false;
    Accent();
  } else {
    FileAccent.checked = true;
    FullAnaliz();
  }
  ReturnGroupStrof(); // возвращаем шаблоны ударений (с группировкой строф) из ленты в первый блок (если группы были)
  if (isMobile != null) {
    window.scroll({top: 110, left: 0, behavior: 'smooth'})
  }
  ;
  TriCodCount();
}