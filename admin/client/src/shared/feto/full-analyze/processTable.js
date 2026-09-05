export const processTable = (state) => {
  // todo - ! REFACTOR
  let tableRef = ''; // находим таблицу
  let row1 = ''; // строка таблицы
  let nextrow = ''; // строка таблицы (клон)
  let nextrow1 = ''; // строка таблицы (клон)
  let row2 = '';
  let nextrow2 = '';
  let row3 = '';
  let nextrow3 = '';
  let elem = "";
  let elem2 = "";
  let NextID = "";
  let FullContainerTemplate = ""; // external

  let textfragment = "";
  let TemplateGlasn2 = [];
  let kolStrokTemplateGlasn = 0;
  let countStrokTemplateGlasn = 0;

  state.lenta = state.lenta + 1;

  tableRef = document.getElementById('global-table1'); // находим таблицу

  console.log('tableRef', tableRef);

  row1 = tableRef.rows[0]; //0 строка - это флаг

  console.log('tableRef row1', row1);

  row2 = tableRef.rows[1]; //1 строка - это комментарий
  row3 = tableRef.rows[2]; //2 строка - это стих

  nextrow1 = row1.cloneNode(true); // клонируем
  nextrow = tableRef.appendChild(nextrow1); // добавляем в конец таблицы
  nextrow.classList.add("lenta");

  elem = nextrow.innerHTML;
  elem = elem.replace(/ContainerFlag1/g, 'ContainerFlag' + state.lenta); // id-метку надо переименовать (извлекаем html, делаем текстовую замену и возвращаем)
  nextrow.innerHTML = elem;
  nextrow1.innerHTML = elem;
  nextrow1.id = 'lenta1-' + state.lenta;  // новое имя всему блоку

  nextrow2 = row2.cloneNode(true); // клонируем
  nextrow = tableRef.appendChild(nextrow2); // добавляем в конец таблицы
  nextrow.classList.add("lenta");

  elem = nextrow.innerHTML;
  elem = elem.replace(/ContainerComment1/g, 'ContainerComment' + state.lenta); // id-метку надо переименовать
  nextrow.innerHTML = elem;
  nextrow2.innerHTML = elem;
  nextrow2.id = 'lenta2-' + state.lenta;

  nextrow3 = row3.cloneNode(true); // клонируем, в этом блоке три id-метки, их надо переименовать
  nextrow = tableRef.appendChild(nextrow3); // добавляем в конец таблицы
  nextrow.classList.add("lenta");

  elem = nextrow.innerHTML;
  elem = elem.replace(/ContainerTemplate1/g, 'ContainerTemplate' + state.lenta);// id-метку надо переименовать
  nextrow.innerHTML = elem;
  nextrow3.innerHTML = elem;
  nextrow3.id = 'lenta3-' + state.lenta;


  elem = nextrow.innerHTML;
  elem = elem.replace(/ContainerAnaliz1/g, 'ContainerAnaliz' + state.lenta);// id-метку надо переименовать
  nextrow.innerHTML = elem;
  nextrow3.innerHTML = elem;

  elem = nextrow.innerHTML;
  elem = elem.replace(/ContainerAnaliz1f/g, 'ContainerAnaliz' + state.lenta + 'f');// id-метку надо переименовать
  nextrow.innerHTML = elem;
  nextrow3.innerHTML = elem;

// тест переносим последним =============

  elem = nextrow.innerHTML;
  elem = elem.replace(/formStih1/g, 'formStih' + state.lenta);// name-метку  надо переименовать
  nextrow.innerHTML = elem;
  nextrow3.innerHTML = elem;

  elem = nextrow.innerHTML;
  elem = elem.replace(/TextStih1/g, 'TextStih' + state.lenta);// name-метку  надо переименовать
  nextrow.innerHTML = elem;
  nextrow3.innerHTML = elem;

  elem = document.getElementsByName('formStih' + state.lenta)[0];// ищем name-метку
  console.log('!elem', 'formStih' + state.lenta, elem);
  if (elem) {
    textfragment = state.OriginalTextInput; // переносим текст из первого блока
    const target = elem.TextStih;
    console.log('fragment', textfragment, 'to target', target);
    // elem.TextStih.value = textfragment;
  }

  state.lentacount = state.lenta;
// потом искать будем по номерам строк tableRef.rows[1] с шагом 3 или по новым id (второй способ пригодился для очистки форм)


// заодно перенесём очередной ContainerTemplate из текущей позиции ленты в первый блок вместе с легендой  (если режим ленты)
  if (state.LentaMode.checked) {
    NextID = 'ContainerTemplate' + state.lenta;
    elem = document.getElementById(NextID).innerHTML;
    elem2 = elem.replace(/NextID/g, '');// id-метку надо убрать
    FullContainerTemplate = FullContainerTemplate + elem2 + '<br>';
  }

//--------------------- блоку шаблона присваиваем класс (даже не в режиме ленты)
  NextID = 'ContainerTemplate' + state.lenta;
  elem = document.getElementById(NextID);
  elem.classList.add("ContainerTemplate" + state.lenta);

//--------------------- заодно запомним ритм блока ??? это для кросс-анализа
  console.log("Ritm ================================================================================");
  console.log(state.lenta);
  console.log(state.Ritm);
  console.log(state.CrossRitm);
//--------------------- сформировать массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строФА стиха - одна строка ритма.

  state.CrossLentaRitm[state.lenta] = state.CrossRitm.join(',');
  console.log(state.CrossLentaRitm[state.lenta]);

//формируем массив числового ритма в виде текстовых значений чисел, разделённых запятыми. Одна строка стиха - одна строка ритма.
//считаем количество строк в строфе

  TemplateGlasn2 = state.TemplateGlasn.split("\n");
  kolStrokTemplateGlasn = TemplateGlasn2.length;

//создаём в цикле массив строф-ритмов (по аналогии с шаблоном гласных) одна строка стиха - одна строка ритма. CrossRitmStrofa

  for (let q = 0; q < kolStrokTemplateGlasn; q++) {
    countStrokTemplateGlasn = countStrokTemplateGlasn + 1;
    state.CrossRitmStrofa[countStrokTemplateGlasn] = state.CrossLentaRitm[state.lenta];
  }


//--------------------- заодно запомним шаблон гласных  ??? TemplateGlasn -- CrossTemplateGlasn
  state.CrossTemplateGlasn[state.lenta] = state.TemplateGlasn;
  console.log(state.CrossTemplateGlasn[state.lenta]);
//--------------------- заодно запомним в NewAccentLentaText сам текст стихотворения с расставленными построфно ударениями textfragment
  state.NewAccentLentaText = state.NewAccentLentaText + textfragment;

  return FullContainerTemplate

}