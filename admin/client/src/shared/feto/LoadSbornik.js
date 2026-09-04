/** @param state {FetoState} */
export function LoadSbornik(state) {
  state.SbornikMas = [];
  const SbornikMasText = []; // from $picker

  let textstih = "";
  let GlobalClassicBall = "";
  let ContainerTemplate = "";
  let ContainerAnaliz = "";
  let ContainerFlag1Report = "";
  let ResumeCommentMiniReport = "";


// перебираем массив SbornikMasText и строим список
  const typeSbornik = 1;
  // email = document.login.email.value;
  const nameSbornik = document.getElementById("polenameSbornik").value;
  const idSbornik = Number(document.getElementById("poleidSbornik").value);
  // SbornikCount = Number(document.getElementById("SbornikCount").value);
  console.log("LoadSbornik()");
  console.log("typeSbornik = " + typeSbornik);
  console.log("idSbornik = " + idSbornik);
  console.log("nameSbornik = " + nameSbornik);
  // console.log("email = " + email);
  console.log("SbornikMasText.length = " + SbornikMasText.length);


  for (var key in SbornikMasText) {
    // получаем стих
    textstih = SbornikMasText[key];
    // форматируем и удаляем лишние пробелы
    state.OriginalTextInput = textstih;
    DelSpace(state);
    textstih = state.OriginalTextInput;
    textstih = textstih.replace(/^\n+/g, '');
    // получаем заголовок стиха
    state.stihMas = textstih.split("\n");
    state.TitulStih = state.stihMas[0];
    state.TitulStih = state.TitulStih.toUpperCase();
    state.TitulStih = state.TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";
    state.stihMas = [];
    // запоминаем шаблон
    // создаём массив объектов
    state.SbornikMas.push({
      id: key,
      stih: textstih,
      title: state.TitulStih,
      GlobalClassicBall: GlobalClassicBall,
      ContainerTemplate: ContainerTemplate,
      ContainerAnaliz: ContainerAnaliz,
      ContainerFlag1Report: ContainerFlag1Report,
      ResumeCommentMiniReport: ResumeCommentMiniReport
    });
  }

  ShowSbornikList(state);


// если стихи загружены, и опция "Обновить" не добавлена, то добавляем "обновить" ==========
  if (state.flagUpdateRecord !== 1) {
    var objTarget = document.recordstih.targetpole;
    var lenTarget = objTarget.options.length;
    objTarget.options[lenTarget] = new Option('Обновить существующую запись', 'Обновить');
    state.flagUpdateRecord = 1;
  }
}