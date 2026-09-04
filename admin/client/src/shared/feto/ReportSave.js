/** @param state {FetoState} */
export function ReportSave(state) {
  state.explorerPanel =
    state.explorerPanel +
    '<div id="ReportPanel" style="background-color: #ffffff;"><br><a href="data:text/plain;charset=utf-8,%EF%BB%BF'
    + encodeURIComponent(state.ReportMas) + '" download="Reports-analiz-all.txt">Сохранить весь сборник с отчётами в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportMasBall0)
    + '" download="Reports-analiz-ball0.txt">Сохранить отчёты c баллом=0 по сборнику в файл</a><br><a href="data:text/plain;charset=utf-8,%EF%BB%BF'
    + encodeURIComponent(state.ReportMasBall1) +
    '" download="Reports-analiz-ball1.txt">Сохранить отчёты  c баллом=1 по сборнику в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportMasBall2) + '" download="Reports-analiz-ball2.txt">' +
    'Сохранить отчёты c баллом=2 по сборнику в файл</a><br><a href="data:text/plain;charset=utf-8,%EF%BB%BF'
    + encodeURIComponent(state.ReportMasBall3)
    + '" download="Reports-analiz-ball3.txt">Сохранить отчёты c баллом=3 по сборнику в файл</a><br><a href="data:text/plain;charset=utf-8,%EF%BB%BF'
    + encodeURIComponent(state.ReportAccent) + '" download="Reports-Accent-all.txt">Сохранить весь сборник с расставленными ударениями в файл</a>' +
    '<br><a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportAccentBall0)
    + '" download="Reports-Accent-ball0.txt">Сохранить сборник стихов с баллом=0 с расставленными ударениями в файл</a>' +
    '<br><a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportAccentBall1) + '" download="Reports-Accent-ball1.txt">' +
    'Сохранить сборник стихов с баллом=1 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportAccentBall2) + '" download="Reports-Accent-ball2.txt">' +
    'Сохранить сборник стихов с баллом=2 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportAccentBall3) + '" download="Reports-Accent-ball3.txt">' +
    'Сохранить сборник стихов с баллом=3 с расставленными ударениями в файл</a><br>' +
    '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' + encodeURIComponent(state.ReportTab) + '" download="Reports-csv.txt">Сохранить csv для загрузки в базу данных</a>' +
    '<br><a href="#" onClick="document.getElementById(&#39;ReportPanel&#39;).remove(); return false;">Убрать панель отчётов</a><br><br></div>';

}