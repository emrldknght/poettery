/** @param state {FetoState} */
export function AnalizSbornika(state) {

  document.getElementById("BallClassicManual").value = ""; //Оценка классики вручную - сброс
  document.getElementById("BallContentManual").value = ""; // Оценка эксперта за содержание  - сброс
  // document.getElementById("SaveRecord").checked = false; // режим записи в файл - сброс
  state.SaveRecord.checked = false;
  document.getElementById("FileAccent").checked = false; // ударения расставлены - сброс;

  // SbornikCount = Number(document.getElementById("SbornikCount").value);
  LentaClearFormStih();
  state.flagSetAccent = 0;
  state.OriginalTextInput = state.SbornikMas[state.SbornikCount];
  state.SbornikCount = state.SbornikCount + 1;
  // document.getElementById("SbornikCount").value = state.SbornikCount;
}