// полный многослойный анализ =======================================================================================================
// полный многослойный анализ =======================================================================================================
// полный многослойный анализ =======================================================================================================
export function LayerAnaliz() {

  if (slovar_accent_Mas.length < 2876000) {
    document.getElementById('ContainerComment1').innerHTML = "Дождитесь полной загрузки словаря...";
    return;
  }
  if (slovar_accent_Mas.length >= 2876000) {
    document.getElementById('ContainerComment1').innerHTML = "Словарь полностью загружен...";
  }

  if (document.getElementById('level-tonic').checked) {
    TonicAnaliz();
    return
  }
  ;

//const performance0 = performance.now();
  console.time('test');
  document.getElementById('ContainerComment0').innerHTML = "";
  document.getElementById('ContainerAnaliz1').innerHTML = "Идёт анализ... " + '<img src="https://fet.vpoezii.online/idikator.gif" width="15" style="vertical-align: middle;">';

  AnalizRazmera();

  if (window.project == 'epigramma' && epigramma != 1) {
    document.getElementById('ContainerAnaliz1').innerText = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата...";
    document.getElementById('ContainerComment1').innerText = "В режиме поэтических миниатюр принимаются только четверостишия определённого формата...";
    document.getElementById('ContainerAnaliz1f').innerText = "";
    return;
  }


  if (epigramma == 1 || window.project == 'zadanie') {
    document.getElementById('level-full').checked = true;
    ClassicAnaliz();
  }
  ;


  if (document.getElementById('level-full').checked) {
    ClassicAnaliz();
    return
  }
  ;
  if (document.getElementById('level-strof').checked) {
    LentaAnaliz();
    return
  }
  ;
  if (document.getElementById('level-strok').checked) {
    CrossAnaliz();
    return
  }
  ;


  HandAccent = 0;
// ====================================== АНАЛИЗ ГРУППИРОВАННЫХ СТРОФ ==============================================================
  CrossAnaliz(); // кросс-анализ даёт более точные ударения
  ClassicAnaliz();
// ======================================= АНАЛИЗ тонических стихов ===============================================================
  if (window.ClassicBall < 1 && window.project != 'zadanie') {
    TonicAnaliz();
  }
// ======================================= АНАЛИЗ ПЕРЕКРЕСТНЫХ СТРОФ ===============================================================
  if (window.ClassicBall < 2 && tonicBall < 1 && window.project != 'zadanie') {
    CrossAnaliz();
  }
// ======================================= АНАЛИЗ КАЖДОЙ СТРОФЫ - ЛЕНТА ===========================================================
  HandAccent = 1;
  if (window.ClassicBall < 2 && tonicBall < 1 && window.project != 'zadanie') {
    LentaAnaliz();
  }

  console.log(ResumeLentaMode);
  console.log(window.flagStrofaRazbita);
  console.log(ProcentCountSlogSer);
  console.log(GlobalflagProcentCountSlogSer);
  console.log(UnicStrof);
  console.log(GlobalflagStrofaRazbitaMas);
  console.log(GlobalflagAccentBallMas);
  console.log(GlobalflagCountStrofaPatternTypeMas);
  console.log(GlobalflagRitmBallMas);
  console.log(GlobalflagCountRitmErrorMas);
  console.log(GlobalflagCountErrorRifmaMas);
  console.log(LentaMode.checked);
  console.log(GlobalflagCountStrofaPatternTypeMas);
  console.log(GlobalResumeCommentCountStrofaPatternTypeMas0);
  console.log(GlobalflagRitmBallMas);
  console.log(GlobalflagCountErrorRifmaMas);
  console.log(GlobalClassicBall);
  console.log(window.ClassicBall);
  console.log(ResumeComment);
  console.log(TitleComment);
  console.log(razmerComment);
  console.log(CommentGroupStrof);
  console.log(RitmComment);
  console.log(ResumeComment);
  console.log(ResumeCommentMini);
  console.log(disclamer);
//const performance1 = performance.now();
//console.log(performance1 - performance0, 'milliseconds');
  console.timeEnd('test');

  SbornikContainerTemplate = document.getElementById('ContainerTemplate1').innerHTML;
  SbornikContainerAnaliz = document.getElementById('ContainerAnaliz1').innerHTML;
  SbornikContainerFlag1Report = document.getElementById('ContainerFlag1').innerHTML;
  SbornikResumeCommentMiniReport = document.getElementById('ContainerComment1').innerHTML;


  console.log("SbornikContainerAnaliz");
  console.log(SbornikContainerAnaliz);

  if (tonicBall < 1) {
    TriCodCount();
  }
  ;

}