export function CreateBlockRitm() {
// создаём блок гласных с цветовой маркировкой ударений
  document.getElementById('ContainerTemplate1').innerHTML = indikator;
  let NextStrofa = 0;
  CountSlogSer = 0;
  CountSlog = 0;
  CountSlogBlack = 0;
  CountSlogBlue = 0;
  let FlagNextStrofaErr = 0;
  CountStrofaRitmEr = 0;
  let glasnyCaps = "АОИЕЁЭЫУЮЯ";
  let sim = "";
  let sim1 = "";
  let st = "";
  let RitmCommentErr = "";
  let RitmColor = "";
  let html = '<span class="text-main">';
  BlockRitmTemplate = "";
  BlockRitmTemplateColor = "";


  window.flagRitmError = "";
  window.flagCountRitmError = 0;
  let nexttext = document.formStih1.TextStih.value;
  if (nexttext.length === 0) {
    return;
  }
  ;


  stih = document.formStih1.TextStih.value + "\n";
  stihMas = stih.split("\n");

  TemplateGlasn = TemplateGlasn.replace(/\n+$/g, '');    // подготовить массив-удалить пустые строки в конце
  TemplateMas = TemplateGlasn.split("\n");

  let KolStrok = TemplateMas.length;
// строки стихотворения перебираем в цикле
  for (let s = 0; s < KolStrok; s++) {
    let nextStr = TemplateMas[s];
// выводим длину строки (размер)
    let str = stihMas[s];

//считаем строфы (и разброс ошибок по стофам)
    if (nextStr.length === 0) {
      ++NextStrofa;
      FlagNextStrofaErr = 0;
    }
    ;

    if (nextStr.length > 0) {

      if (nextStr.length < 10) {
        html += '<span class="strofa">' + nextStr.length + '</span>&nbsp;&nbsp;&nbsp;<span class="border1">'
      }
      ;
      if (nextStr.length > 9) {
        html += '<span class="strofa">' + nextStr.length + '</span>&nbsp;&nbsp;<span class="border1">'
      }
      ;


    }
    for (let k = 0; k < nextStr.length; k++) {
      let sim = nextStr.substr(k, 1);
      let kk = k + 1; // отсчёт в массиве идёт с нуля
// в зависимости от ударения раскрашиваем буквы (гласные)
// если RitmErr[kk]=9 то красный

      if (RitmErr[kk] === 9) {

        if (glasnyCaps.includes(sim)) {
          st = '<span class="red-symbol">';
          RitmCommentErr = RitmCommentErr + 'Возможно есть ритмический сбой в строке «' + str + '...», в которой ударение падает на ' + kk + ' слог, хотя в других строках ' + kk + ' слог безударный. ';
          RitmColor = '9';
          window.flagCountRitmError = window.flagCountRitmError + 1;
          window.flagRitmError = krest + "Есть сбои ритма! ";
          if (FlagNextStrofaErr === 0) {
            ++CountStrofaRitmEr;
            FlagNextStrofaErr = 1
          }
          ; //количество сбойных строф
        } else if (Ritm[kk] === 1) {
          st = '<span class="blue-symbol">';
          sim = sim.toLowerCase();
          RitmColor = "1";
        } else if (Ritm[kk] === 2) {
          st = '<span  class="gray-symbol">';
          RitmColor = "2";
        }

      }

      if (Ritm[kk] === 1) {
        ++CountSlogBlue;
        if (RitmErr[kk] !== 9) {
          st = '<span  class="blue-symbol">';
          sim = sim.toLowerCase();
          RitmColor = "1";
        }
      }


      if (Ritm[kk] === 3) {
        if (RitmErr[kk] !== 9) {
          st = '<span  class="black-symbol">';
          sim = sim.toUpperCase();
          RitmColor = "3";
          ++CountSlogBlack;
        }
      }


      if (Ritm[kk] === 2) {
        ++CountSlogSer;
        if (RitmErr[kk] !== 9) {
          st = '<span  class="gray-symbol">';
          RitmColor = "2";
        }
      }


      BlockRitmTemplate = BlockRitmTemplate + sim;
      BlockRitmTemplateColor = BlockRitmTemplateColor + RitmColor;
      html += st + sim + "</span>";
      ++CountSlog; // все слоги
    }


    html += "</span><br></span>";
    BlockRitmTemplate = BlockRitmTemplate + "\n";
  }


  CountSlogBluetext = ' 0-БЕЗУДАРНЫЕ ГЛАСНЫЕ:' + CountSlogBlue + ' шт.              ';
  CountSlogSertext = ' 1-СЛАБОУДАРНЫЕ ГЛАСНЫЕ:' + CountSlogSer + ' шт.              ';
  CountSlogBlacktext = ' 2-УДАРНЫЕ ГЛАСНЫЕ:' + CountSlogBlack + ' шт.              ';

  document.getElementById('ContainerTemplate1').innerHTML = '<div id="shema" class="text-main lh">' + slog + html + '<div id="TriCodRitm"></div></div><div class="legenda1" style="margin: 10px 0px 0px 10px; line-height: 1.3;"><br><span class="blue-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">' + CountSlogBluetext.substr(0, 32) + '</span><br><span class="gray-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">' + CountSlogSertext.substr(0, 32) + '</span><br><span class="black-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">' + CountSlogBlacktext.substr(0, 32) + '</span></div>';

//document.getElementById('ContainerTemplate1').innerHTML = '<div id="shema" class="text-main lh">'+slog+html + '<div class="slog" id="TriCodRitm"></div></div><div class="legenda1"><br><span class="blue..-symbol" style="letter-spacing: 1px;">&nbsp;0-СИНИЙ - БЕЗУДАРНЫЕ ГЛАСНЫЕ:'+CountSlogBlue+' шт.&nbsp;</span><br><span class="gray-symbol"  style="letter-spacing: 1px;">&nbsp;1-СЕРЫЙ - СЛАБОУДАРНЫЕ ГЛАСНЫЕ:'+CountSlogSer+' шт.&nbsp;&nbsp;</span><br><span class="black-symbol"  style="letter-spacing: 1px;">&nbsp;2-ЧЕРНЫЙ - УДАРНЫЕ ГЛАСНЫЕ:'+CountSlogBlack+' шт.&nbsp;&nbsp;&nbsp;</span></div></div>';


  RitmComment = RitmCommentMin + CommentRitmika + RitmCommentErr;

  window.flagProcentCountSlogSer = Math.round(CountSlogSer / CountSlog * 100);

  LentaCountSlogSer = CountSlogSer;
  LentaCountSlog = CountSlog;
}