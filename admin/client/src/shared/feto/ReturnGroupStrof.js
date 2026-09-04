/** @param state {FetoState} */
export function ReturnGroupStrof(state) {
  // возвращаем сгруппированные строфы после анализа из ленты в основной блок. Длина ленты = GroupStrof.length
  // запомнили ReturnStrofaPositionMas [s]=kk; в какую группу kk какая строфа s переместилась.
  // берем из второй группы шаблона containertemplate2 весь второй блок и сплитим в массив GroupTemplateMas по <br><br>
  let GroupTemplateMas = [];
  let elem = "";
  let CountStrofa = 0;
  let CountReturnStrofa = 0;
  let numgr = 0;
  let n = 0;
  let idt = "";
  let ReturnContainerTemplate = [];
  let ReturnContainerTemplateReverse = [];
  if (state.GroupStrof.length === 1) {
    return;
  }
  // перебираем группы строф (шаблоны) со второго ContainerTemplate2 ContainerTemplate3 ContainerTemplate4 и тд
  for (let s = 2; s < state.GroupStrof.length + 1; s++) {

    idt = 'ContainerTemplate' + (s);
    elem = document.getElementById(idt).innerHTML; // находим шаблон в следующей группе
    // получаем массив из очередной группы строф (шаблонов) GroupTemplateMas
    GroupTemplateMas = elem.split("<br><br>");

//===============================================
    // перебираем массив ReturnStrofaPositionMas, который содержит принадлежность очередной строфы к группе 1,2,3
    n = 0;
    for (let CountStrofa = 1; CountStrofa < state.ReturnStrofaPositionMas.length; CountStrofa++) {
      // перебираем массив из очередной группы строф (шаблонов) GroupTemplateMas (перебираем строфы в группе)
      numgr = state.ReturnStrofaPositionMas[CountStrofa]; // если номер группы текущей строфы совпадает с массивом ReturnStrofaPositionMas
      if (numgr === s) {
        ReturnContainerTemplate[CountStrofa] = GroupTemplateMas[n];
        n = n + 1;
      }
      ;

    }

//===============================================

  }

// объединяем шаблоны и переносим в первый блок шаблонов
  ReturnContainerTemplate.shift(); // удаляем нулевой
  state.ContainerTemplate1 = ReturnContainerTemplate.join("<br><br>");
// убирем легенду
  /*
  elem = document.getElementById('ContainerTemplate1');
  elem.querySelectorAll('.legenda1').forEach(function (a) {
    a.remove()
  })
   */
// заменяем три "<br><br>" на два "<br><br>"
  elem = state.ContainerTemplate1;
  elem = elem.replace(/<br><br><br>/g, '<br><br>');
  elem = elem.replace(/<br><\/div><br><br>/g, '</div><br>'); // если остались
  state.ContainerTemplate1 = elem;
}