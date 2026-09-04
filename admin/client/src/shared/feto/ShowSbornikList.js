/** @param state {FetoState} */
export function ShowSbornikList(state) {
  /*
  let key;
  const SbornikMasRubrika = [];
  let SbornikHTML = '';

  console.log("SbornikMas");
  console.log(SbornikMas);
  console.log("typeSbornik = " + typeSbornik);
  console.log("idSbornik = " + idSbornik);
  console.log("nameSbornik = " + nameSbornik);
  console.log("email = " + email);
  let countshow = 0;

  // SbornikMasRubrika = [];

  if (window.project == 'zadanie') {
    SbornikHTML = '<br><b><a href="https://fet.vpoezii.online/class/"  ' +
      'target="_blank">ОТКРЫТЬ УЧЕБНИК ПО ТЕХНИКЕ СТИХОСЛОЖЕНИЯ</a><br><br>УПРАЖНЕНИЯ ПО СТИХОСЛОЖЕНИЮ:</b><br><br>' +
      '<ul type="square" style="padding-left: 20;">';
  } else {
    SbornikHTML = '<br><b>ВЫБОР ПРОИЗВЕДЕНИЯ ДЛЯ РЕДАКТИРОВАНИЯ:</b><br>' +
      '<br><ul type="square" style="padding-left: 20px;">';
  }


// создаем список рубрик (и убираем дубли)
  for (key in SbornikMas) {
    const konkurs_rubrika = SbornikMas[key].rubrika;
    if (!SbornikMasRubrika.includes(konkurs_rubrika)) {
      SbornikMasRubrika.push(konkurs_rubrika);
    }
  }
  console.log("SbornikMasRubrika");
  console.log(SbornikMasRubrika);
// _список рубрик ----------------

// выводим список стихов с разбивкой на рубрики ----------------

  for (var rub in SbornikMasRubrika) {
    SbornikHTML = SbornikHTML + '<br><b><u>' + SbornikMasRubrika[rub] + '</b></u><br><br>';
    for (key in SbornikMas) {
      if (SbornikMasRubrika[rub] == SbornikMas[key].rubrika) {
        countshow = countshow + 1;
        SbornikHTML = SbornikHTML + '<li><a href="#" onclick="ClickSbornikList(' + key + '); return false;" id="ReadUserStihi' + key + '" class="ReadUserStihi' + key + '" style="text-decoration: none; color:#0d6f9c;" target="_blank">' + countshow + " " + SbornikMas[key].title + '</a></li>';
      }
      ;
    }
  }
// _вывели список стихов с разбивкой на рубрики ----------------

  console.log("SbornikMas.length = " + SbornikMas.length);
  SbornikHTML = SbornikHTML + '</ul>';
  if (SbornikMas.length == 0) {
    SbornikHTML = '<br><b>ВЫБОР ПРОИЗВЕДЕНИЯ ДЛЯ РЕДАКТИРОВАНИЯ:</b><br><br>▪ Ничего не загрузилось. В сборнике нет ни одной записи.';
    document.getElementById('ContainerAnaliz1f').innerHTML = SbornikHTML;
    return
  }
  ;

  state.flagSetAccent = 0;
  SbornikCount = 0;
  document.getElementById("SbornikCount").value = SbornikCount;
  LentaClearFormStihLogin();
  document.formStih1.TextStih.value = SbornikMas[SbornikCount].stih;
  TextStihResize();
  document.getElementById('ContainerAnaliz1f').innerHTML = SbornikHTML;
   */
}