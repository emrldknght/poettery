/** @param state {FetoState} */
export function CreateBlockRitm(state) {
// создаём блок гласных с цветовой маркировкой ударений
  state.ContainerTemplate1 = state.indikator;
  let NextStrofa = 0;
  state.CountSlogSer = 0;
  state.CountSlog = 0;
  state.CountSlogBlack = 0;
  state.CountSlogBlue = 0;
  let FlagNextStrofaErr = 0;
  state.CountStrofaRitmEr = 0;
  let glasnyCaps = "АОИЕЁЭЫУЮЯ";
  let sim = "";
  let sim1 = "";
  let st = "";
  let RitmCommentErr = "";
  let RitmColor = "";
  let html = '<span class="text-main">';
  state.BlockRitmTemplate = "";
  let BlockRitmTemplateColor = "";


  state.flagRitmError = "";
  state.flagCountRitmError = 0;
  let nexttext = state.OriginalTextInput;
  if (nexttext.length === 0) {
    return;
  }



  state.stih = state.OriginalTextInput + "\n";
  state.stihMas = state.stih.split("\n");

  state.TemplateGlasn = state.TemplateGlasn.replace(/\n+$/g, '');    // подготовить массив-удалить пустые строки в конце
  state.TemplateMas = state.TemplateGlasn.split("\n");

  let KolStrok = state.TemplateMas.length;
// строки стихотворения перебираем в цикле
  for (let s = 0; s < KolStrok; s++) {
    let nextStr = state.TemplateMas[s];
// выводим длину строки (размер)
    let str = state.stihMas[s];

//считаем строфы (и разброс ошибок по стофам)
    if (nextStr.length === 0) {
      ++NextStrofa;
      FlagNextStrofaErr = 0;
    }


    if (nextStr.length > 0) {

      if (nextStr.length < 10) {
        html += '<span class="strofa">' + nextStr.length + '</span>&nbsp;&nbsp;&nbsp;<span class="border1">';
      }

      if (nextStr.length > 9) {
        html += '<span class="strofa">' + nextStr.length + '</span>&nbsp;&nbsp;<span class="border1">';
      }



    }
    for (let k = 0; k < nextStr.length; k++) {
      let sim = nextStr.substr(k, 1);
      let kk = k + 1; // отсчёт в массиве идёт с нуля
// в зависимости от ударения раскрашиваем буквы (гласные)
// если RitmErr[kk]=9 то красный

      const RitmErr = state.RitmErr;

      if (RitmErr[kk] === 9) {

        if (glasnyCaps.includes(sim)) {
          st = '<span class="red-symbol">';
          RitmCommentErr = RitmCommentErr + 'Возможно есть ритмический сбой в строке «' + str + '...», в которой ударение падает на ' + kk + ' слог, хотя в других строках ' + kk + ' слог безударный. ';
          RitmColor = '9';
          state.flagCountRitmError = state.flagCountRitmError + 1;
          state.flagRitmError = state.krest + "Есть сбои ритма! ";
          if (FlagNextStrofaErr === 0) {
            ++state.CountStrofaRitmEr;
            FlagNextStrofaErr = 1
          }
          ; //количество сбойных строф
        } else if (state.Ritm[kk] === 1) {
          st = '<span class="blue-symbol">';
          sim = sim.toLowerCase();
          RitmColor = "1";
        } else if (state.Ritm[kk] === 2) {
          st = '<span  class="gray-symbol">';
          RitmColor = "2";
        }

      }

      if (state.Ritm[kk] === 1) {
        ++state.CountSlogBlue;
        if (RitmErr[kk] !== 9) {
          st = '<span  class="blue-symbol">';
          sim = sim.toLowerCase();
          RitmColor = "1";
        }
      }


      if (state.Ritm[kk] === 3) {
        if (RitmErr[kk] !== 9) {
          st = '<span  class="black-symbol">';
          sim = sim.toUpperCase();
          RitmColor = "3";
          ++state.CountSlogBlack;
        }
      }


      if (state.Ritm[kk] === 2) {
        ++state.CountSlogSer;
        if (RitmErr[kk] !== 9) {
          st = '<span  class="gray-symbol">';
          RitmColor = "2";
        }
      }


      state.BlockRitmTemplate = state.BlockRitmTemplate + sim;
      BlockRitmTemplateColor = BlockRitmTemplateColor + RitmColor;
      html += st + sim + "</span>";
      ++state.CountSlog; // все слоги
    }


    html += "</span><br></span>";
    state.BlockRitmTemplate = state.BlockRitmTemplate + "\n";
  }


  state.CountSlogBluetext = ' 0-БЕЗУДАРНЫЕ ГЛАСНЫЕ:' + state.CountSlogBlue + ' шт.              ';
  state.CountSlogSertext = ' 1-СЛАБОУДАРНЫЕ ГЛАСНЫЕ:' + state.CountSlogSer + ' шт.              ';
  state.CountSlogBlacktext = ' 2-УДАРНЫЕ ГЛАСНЫЕ:' + state.CountSlogBlack + ' шт.              ';

  state.ContainerTemplate1 = '<div id="shema" class="text-main lh">' + state.slog + html + '<div id="TriCodRitm"></div></div><div class="legenda1" style="margin: 10px 0px 0px 10px; line-height: 1.3;"><br><span class="blue-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">'
    + state.CountSlogBluetext.substring(0, 32)
    + '</span><br><span class="gray-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">'
    + state.CountSlogSertext.substring(0, 32)
    + '</span><br><span class="black-symbol" style="letter-spacing: 1px; white-space:pre-wrap;">'
    + state.CountSlogBlacktext.substring(0, 32)
    + '</span></div>';

//document.getElementById('ContainerTemplate1').innerHTML = '<div id="shema" class="text-main lh">'+slog+html + '<div class="slog" id="TriCodRitm"></div></div><div class="legenda1"><br><span class="blue..-symbol" style="letter-spacing: 1px;">&nbsp;0-СИНИЙ - БЕЗУДАРНЫЕ ГЛАСНЫЕ:'+CountSlogBlue+' шт.&nbsp;</span><br><span class="gray-symbol"  style="letter-spacing: 1px;">&nbsp;1-СЕРЫЙ - СЛАБОУДАРНЫЕ ГЛАСНЫЕ:'+CountSlogSer+' шт.&nbsp;&nbsp;</span><br><span class="black-symbol"  style="letter-spacing: 1px;">&nbsp;2-ЧЕРНЫЙ - УДАРНЫЕ ГЛАСНЫЕ:'+CountSlogBlack+' шт.&nbsp;&nbsp;&nbsp;</span></div></div>';


  state.RitmComment = state.RitmCommentMin + state.CommentRitmika + RitmCommentErr;

  window.flagProcentCountSlogSer = Math.round(state.CountSlogSer / state.CountSlog * 100);

  state.LentaCountSlogSer = state.CountSlogSer;
  state.LentaCountSlog = state.CountSlog;
}