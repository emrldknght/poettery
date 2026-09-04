/** @param state {FetoState} */
export function TonicAnaliz(state) {
  console.log('[DEBUG] TonicAnaliz');
// проводим тонический анализ - с группировкой строф
  state.CrossOverMode = 0;
  console.log('проводим тонический анализ - с группировкой строф');
  state.LentaMode.checked = false; // не ленточный (стандартный) режим
  state.SaveRecord.checked = false; // запись не нужна
// удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
  ClearForm2();// закрываем запись
  console.log('закрываем запись');
// если количество букв SimvolCount после расстановки ударений изменилось более чем на 7 букв, то заново автоматом ставим ударения и проводим полный анализ, если нет- ударения расставляем руками и проводим анализ.
  state.SimvolCount = CountSimvol(state);
  console.log('SimvolCount=' + state.SimvolCount);
  if (Math.abs(state.SimvolCount - state.AccentCountSimvol) > 7) {
    FileAccent.checked = false;
    AccentTonic();
  } else {
    FileAccent.checked = true;
    startAnalyzePoem(state);
  }
  /*
  if (isMobile != null) {
    window.scroll({top: 110, left: 0, behavior: 'smooth'})
  }
   */
}