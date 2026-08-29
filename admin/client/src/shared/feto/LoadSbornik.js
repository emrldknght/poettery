export function LoadSbornik() {
  SbornikMas = [];
  let textstih = "";
  let GlobalClassicBall = "";
  let ContainerTemplate = "";
  let ContainerAnaliz = "";
  let ContainerFlag1Report = "";
  let ResumeCommentMiniReport = "";


// перебираем массив SbornikMasText и строим список
  typeSbornik = 1;
  email = document.login.email.value;
  nameSbornik = document.getElementById("polenameSbornik").value;
  idSbornik = Number(document.getElementById("poleidSbornik").value);
  SbornikCount = Number(document.getElementById("SbornikCount").value);
  console.log("LoadSbornik()");
  console.log("typeSbornik = " + typeSbornik);
  console.log("idSbornik = " + idSbornik);
  console.log("nameSbornik = " + nameSbornik);
  console.log("email = " + email);
  console.log("SbornikMasText.length = " + SbornikMasText.length);


  for (var key in SbornikMasText) {
    // получаем стих
    textstih = SbornikMasText[key];
    // форматируем и удаляем лишние пробелы
    document.formStih1.TextStih.value = textstih;
    DelSpace;
    textstih = document.formStih1.TextStih.value;
    textstih = textstih.replace(/^\n+/g, '');
    // получаем заголовок стиха
    stihMas = textstih.split("\n");
    TitulStih = stihMas[0];
    TitulStih = TitulStih.toUpperCase();
    TitulStih = TitulStih.replace(/[.,:!?()-;]+$/gm, '') + "...";
    stihMas = [];
    // запоминаем шаблон
    // создаём массив объектов
    SbornikMas.push({
      id: key,
      stih: textstih,
      title: TitulStih,
      GlobalClassicBall: GlobalClassicBall,
      ContainerTemplate: ContainerTemplate,
      ContainerAnaliz: ContainerAnaliz,
      ContainerFlag1Report: ContainerFlag1Report,
      ResumeCommentMiniReport: ResumeCommentMiniReport
    });
  }

  ShowSbornikList();


// если стихи загружены, и опция "Обновить" не добавлена, то добавляем "обновить" ==========
  if (!flagupdaterecord == 1) {
    var objTarget = document.recordstih.targetpole;
    var lenTarget = objTarget.options.length;
    objTarget.options[lenTarget] = new Option('Обновить существующую запись', 'Обновить');
    flagupdaterecord = 1;
  }
}