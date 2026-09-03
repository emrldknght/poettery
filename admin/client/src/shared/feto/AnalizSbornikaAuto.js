/** @param state {FetoState} */
export function AnalizSbornikaAuto(state) {

  state.ReportMas = "";// строка массив отчёты анализ
  ReportMasBall0 = "";// строка массив отчёта балл=0
  ReportMasBall1 = "";// строка массив отчёта
  ReportMasBall2 = "";// строка массив отчёта
  ReportMasBall3 = "";// строка массив отчёта

  ReportAccent = ""; // строка массив стихи с ударениями
  ReportAccentBall0 = ""; // строка массив стихи с ударениями балл=0
  ReportAccentBall1 = "";
  ReportAccentBall2 = "";
  ReportAccentBall3 = "";

  let countanaliz = 0;


  for (var SbornikCount = 0; SbornikCount < SbornikMas.length; SbornikCount++) {
    countanaliz = countanaliz + 1;

    state.OriginalTextInput = SbornikMas[SbornikCount].stih;

    LayerAnaliz(state);

    SbornikMas[SbornikCount].GlobalClassicBall = state.ClassicBall;
    SbornikMas[SbornikCount].ContainerTemplate = state.SbornikContainerTemplate.substring(0, 1024);
    SbornikMas[SbornikCount].ContainerAnaliz = state.SbornikContainerAnaliz.substring(0, 1024);
    SbornikMas[SbornikCount].ContainerFlag1Report = state.SbornikContainerFlag1Report;
    SbornikMas[SbornikCount].ResumeCommentMiniReport = state.SbornikResumeCommentMiniReport;

    if (countanaliz == 10) {
      countanaliz = 0;
      state.ContainerComment0 = "Проведён анализ " + SbornikCount + " стихотворений. ";
    }
  }

  state.ContainerComment0 = "";
  state.ContainerComment1 = "";
  state.ContainerFlag1 = "";
  state.ContainerAnaliz1 = "";
  state.ContainerAnaliz1f = "";
  document.title = "Проведён анализ " + SbornikCount + " стихотворений.";
  // document.getElementById('ContainerTemplate1').innerHTML
  state.ContainerTemplate1 = 'Проведён анализ ' + SbornikCount + ' стихотворений. <br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF'
    + encodeURIComponent(state.ReportMas) + '" download="Reports-analiz-all.txt">Сохранить весь сборник с отчётами в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportMasBall0)
    + '" download="Reports-analiz-ball0.txt">Сохранить отчёты c баллом=0 по сборнику в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportMasBall1)
    + '" download="Reports-analiz-ball1.txt">Сохранить отчёты  c баллом=1 по сборнику в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportMasBall2)
    + '" download="Reports-analiz-ball2.txt">Сохранить отчёты c баллом=2 по сборнику в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportMasBall3)
    + '" download="Reports-analiz-ball3.txt">Сохранить отчёты c баллом=3 по сборнику в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportAccent)
    + '" download="Reports-Accent-all.txt">Сохранить весь сборник с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportAccentBall0)
    + '" download="Reports-Accent-ball0.txt">Сохранить сборник стихов с баллом=0 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportAccentBall1)
    + '" download="Reports-Accent-ball1.txt">Сохранить сборник стихов с баллом=1 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportAccentBall2)
    + '" download="Reports-Accent-ball2.txt">Сохранить сборник стихов с баллом=2 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportAccentBall3)
    + '" download="Reports-Accent-ball3.txt">Сохранить сборник стихов с баллом=3 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(ReportTab)
    + '" download="Reports-csv.txt">Сохранить csv для загрузки в базу данных</a><br>';

}