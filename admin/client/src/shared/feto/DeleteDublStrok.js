export function DeleteDublStrok() {
  DelSpace();
// ---- удаление повторяющихся строк
  let stihDublDelete = "";
  let str = "";
  let DublStr = 0;
  let StihDubl = document.formStih1.TextStih.value + "\n";
  StihDubl = StihDubl.split("\n");

// перебираем строки==================================================
  for (let i = 0; i < StihDubl.length - 1; i++) {
    DublStr = 0;
    str = StihDubl[i];

// в цикле сравниваем строку с остальными ==== если нет дублей - добавляем к блоку ==============================================
    for (let k = i + 1; k < StihDubl.length - 1; k++) {

      if (str == StihDubl[k] && (str.length > 0)) {
        ++DublStr;
        console.log("str.length=", str.length)
      }
    }

    if (DublStr == 0) {
      stihDublDelete = stihDublDelete + str + "\n";
    }

  }
// закончили перебор строк =====================================================================
  document.formStih1.TextStih.value = stihDublDelete;
}