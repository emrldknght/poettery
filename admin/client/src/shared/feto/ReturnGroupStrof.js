/** @param state {FetoState} */
export function ReturnGroupStrofDom(state) {
  console.log('[DEBUG] ReturnGroupStrof - start', state.GroupStrof, state.GroupStrof.length);

  // Возвращаем сгруппированные строфы после анализа из ленты в основной блок. Длина ленты = GroupStrof.length
  // запомнили ReturnStrofaPositionMas [s]=kk; в какую группу kk какая строфа s переместилась.
  // Берем из второй группы шаблона containertemplate2 весь второй блок и сплитим в массив GroupTemplateMas по <br><br>
  let GroupTemplateMas = [];
  let elem = "";
  // let CountStrofa = 0;
  // let CountReturnStrofa = 0;
  let numgr = 0;
  let n = 0;
  let idt = "";
  let ReturnContainerTemplate = [];
  // let ReturnContainerTemplateReverse = [];
  if (state.GroupStrof.length === 1) {
    return;
  }
  // перебираем группы строф (шаблоны) со второго ContainerTemplate2 ContainerTemplate3 ContainerTemplate4 и тд
  for (let s = 2; s < state.GroupStrof.length + 1; s++) {

    idt = 'ContainerTemplate' + (s);
    elem = document.getElementById(idt).innerHTML; // находим шаблон в следующей группе
    console.log('[DEBUG] ReturnGroupStrof - g1', idt, elem)
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

/** @param state {FetoState} */
export function ReturnGroupStrof(state) {
  console.log('[DEBUG] ReturnGroupStrof - start, length:', state.GroupStrof.length);

  if (state.GroupStrof.length === 1) {
    return;
  }

  let ReturnContainerTemplate = [];
  let n = 0;

  // Перебираем группы строф (теперь берем из state, а не из DOM)
  for (let s = 2; s < state.GroupStrof.length + 1; s++) {
    // БЫЛО: elem = document.getElementById('ContainerTemplate' + s).innerHTML;
    // СТАЛО: читаем из сохраненного массива
    const elem = state.lentaContainerTemplates?.[s] || "";

    console.log('[DEBUG] ReturnGroupStrof - g1, s=', s, 'elem length=', elem.length);

    // Получаем массив из очередной группы строф (шаблонов)
    const GroupTemplateMas = elem.split("<br><br>");

    n = 0;
    for (let CountStrofa = 1; CountStrofa < state.ReturnStrofaPositionMas.length; CountStrofa++) {
      const numgr = state.ReturnStrofaPositionMas[CountStrofa];

      // Если номер группы текущей строфы совпадает с текущей итерацией цикла
      if (numgr === s) {
        ReturnContainerTemplate[CountStrofa] = GroupTemplateMas[n];
        n = n + 1;
        break; // переходим к следующей строфе, элемент из группы найден
      }
    }
  }

  // Объединяем шаблоны и переносим в первый блок
  ReturnContainerTemplate.shift(); // удаляем нулевой (пустой) элемент

  state.ContainerTemplate1 = ReturnContainerTemplate.join("<br><br>");

  // Заменяем тройные переносы на двойные (как в оригинале)
  state.ContainerTemplate1 = state.ContainerTemplate1
    .replace(/<br><br><br>/g, '<br><br>')
    .replace(/<br><\/div><br><br>/g, '</div><br>');

  console.log('[DEBUG] ReturnGroupStrof - finished, ContainerTemplate1 length:', state.ContainerTemplate1.length);
}