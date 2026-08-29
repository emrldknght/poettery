export function AnalizSbornika() {

  document.getElementById("BallClassicManual").value = ""; //Оценка классики вручную - сброс
  document.getElementById("BallContentManual").value = ""; // Оценка эксперта за содержание  - сброс
  document.getElementById("SaveRecord").checked = false; // режим записи в файл - сброс
  document.getElementById("FileAccent").checked = false; // ударения расставлены - сброс;

  SbornikCount = Number(document.getElementById("SbornikCount").value);
  LentaClearFormStih();
  flagSetAccent = 0;
  document.formStih1.TextStih.value = SbornikMas[SbornikCount];
  SbornikCount = SbornikCount + 1;
  document.getElementById("SbornikCount").value = SbornikCount;
}