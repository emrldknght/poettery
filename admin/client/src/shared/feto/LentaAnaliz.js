/** @param state {FetoState} */
export function LentaAnaliz(state) {
// проводим ленточный анализ - каждая строфа отдельно
  console.log('проводим ленточный анализ');
  state.CrossOverMode = 0;
  state.LentaMode.checked = true; // ленточный режим
  state.SaveRecord.checked = false; // запись не нужна
// удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
  ClearForm2();  // закрываем запись
// если количество букв SimvolCount после расстановки ударений изменилось более чем на на 7 букв, то заново автоматом ставим ударения и проводим полный анализ, если нет- ударения расставляем руками и проводим анализ.
  state.SimvolCount = CountSimvol(state);
  if (Math.abs(state.SimvolCount - state.AccentCountSimvol) > 7) {
    FileAccent.checked = false;
    Accent(state);
  } else {
    FileAccent.checked = true;
    FullAnaliz(state);
  }
  /*
  if (isMobile != null) {
    window.scroll({top: 110, left: 0, behavior: 'smooth'})
  }
   */

  TriCodCount(state);
}