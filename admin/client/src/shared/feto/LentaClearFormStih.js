/** @param state {FetoState} */
export function LentaClearFormStih(state) {
  // todo - refactor!
  state.OriginalTextInput = "";

  state.ContainerTemplate1 = "";
  state.ContainerAnaliz1 = 'В <a href="https://vpoezii.online/editorial-policy/" target="_blank" style="text-decoration: none; color: #0d6f9c!important;  alink: #aaaaaa!important; vlink: #aaaaaa!important; link: #aaaaaa!important;"> альманахе «Венец поэзии» публикуются только классические стихотворения</a>, то есть имеющие регулярно выдержанный размер, чётко выраженный ритм и точные рифмы. Для отбора стихотворений редакция организовала ряд литературных конкурсов и марафонов.&nbsp;<div id="konkurs_title_note" style="display:inline;"></div><br><br>Для предварительной проверки стихотворений создана интеллектуальная система Fet.Online (свидетельство Роспатента от 22.03.2021 №2021614295), с помощью которой вы можете получить автоматизированный анализ своего стихотворения. При положительном результате анализа появится кнопка «Отправить стихотворение в редакцию». Далее нужно будет заполнить анкету с целью сохранения ваших авторских прав. <br><br>Для получения анализа вставьте стихотворение в первое поле и нажмите кнопку «Анализ стихотворения». Желаем удачи!';

  state.ContainerAnaliz1f = "";
  state.ContainerFlag1 = "";
  state.ContainerComment1 = "";
  document.getElementById('postscriptum').innerHTML = "";
  document.getElementById('vopros').style.display = 'none';
  document.getElementById('otvet').style.display = 'none';
  document.getElementById('openrecordstih1').style.display = 'none';
  document.getElementById('openrecordstih2').style.display = 'none';

// удаляем элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });

  if (window.konkurs_title != "" && window.konkurs_title != null) {
    document.getElementById('konkurs_title_note').innerHTML = "<br><br>Прямо сейчас вы можете отправить стихи на " + window.konkurs_title + ". ";
  }

}