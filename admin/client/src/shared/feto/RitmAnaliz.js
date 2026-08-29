export function RitmAnaliz()
// анализ базового ритмического рисунка и комментарии к нему
{
  LastAccent = 0;
  let bb = 0;
  let uu = 0;
  let ub = 0;
  let stopa = 0;
  let SuperStopa = 0;
  let CountStop = 0;
  let k = 0;
  let risunok1 = "";
  let risunok2 = "";
  let risunok3 = "";
  let Textkk = "";
  let Textk = "";
  let CommentAccent = "";
  let CommentStopa = "";
  let CommentSpondey = "";
  TriCodRitm = "";

  let nexttext = document.formStih1.TextStih.value;
  if (nexttext.length === 0) {
    return;
  }
  ;


  CommentRitmika = "";
  for (let kk = 1; kk < Ritm.length; kk++) {
    k = kk - 1;
// выводим список безударных через запятую
// для двузначных чисел лишний пробел перед запятой убираем
    if (kk < 10) {
      Textkk = " " + kk + ",";
    } else {
      Textkk = kk + ",";
    }
    ;
    if (k < 10) {
      Textk = " " + k + ",";
    } else {
      Textk = k + ",";
    }
    ;

    if (Ritm[kk] === 1) {
      ++bb;
      risunok1 = risunok1 + Textkk;
    }
    ;
    if (Ritm[kk] === 2) {
      risunok2 = risunok2 + Textkk;
    }
    ;

// для двух ударных подряд
    if (Ritm[kk] === 3) {
      ++uu;
      risunok3 = risunok3 + Textkk;
      LastAccent = kk;
      if (Ritm[k] === 3) {
        CommentSpondey = "В " + k + " и " + kk + " слогах идут два ударения подряд, что приводит к жёсткому  разделению строки на две части и придаёт произведению некоторый драматизм. ";
      }
    }
    ;
// если перед безударным стоит ударный или слабоударный, то это ритмическая стопа.
    if (Ritm[kk] === 1) {
      if (Ritm[k] === 2) {
        ++stopa;
      }
      ;
      if (Ritm[k] === 3) {
        ++SuperStopa;
      }
      ;
    }

    CountStop = Number(stopa) + Number(SuperStopa);

    if (Ritm[kk] === 2) {
      ++ub;
    }
    ;


    if (bb > (Ritm.length - 2)) {
      CommentRitmika = CommentRitmika + "Ударения в словах не расставлены.  ";
      window.flagAccentBall = 0;
    }
    ;


// создаём строку троичной записи ритма
    if (Ritm[kk] == 1) {
      TriCodRitm = TriCodRitm + "0";
    }
    ;
    if (Ritm[kk] == 2) {
      TriCodRitm = TriCodRitm + "1";
    }
    ;
    if (Ritm[kk] == 3) {
      TriCodRitm = TriCodRitm + "2";
    }
    ;


  }


  if (CountStop > 1) {
    CommentStopa = "Текст имеет слабые признаки ритма. ";
    flagRitm = galka + "Ритм слабый!  ";
    window.flagRitmBall = 1;
  } else {
    CommentRitmika = CommentRitmika + "В тексте не обнаружен ритм. " + "\n" + "Расставьте ударения в словах. " + "\n" + "УдарЕния обозначАются заглАвной бУквой. " + "\n" + "Для автоматической расстановки ударений нажмите кнопку [Анализ стихотворения]. " + "\n" + "\n";
    flagRitm = "";
  }

  if (CountStop > Ritm.length * 0.3) {
    CommentStopa = "Строфы имеют явный ритмический рисунок, повторяющийся в каждой строке. ";
    flagRitm = galka + "Ритм явный!  ";
    window.flagRitmBall = 2;
  }

  if (SuperStopa > 1 || uu > 1) {
    CommentStopa = "Строфы имеют очень чёткий ритмический рисунок, повторяющийся в каждой строке. ";
    flagRitm = galka + "Ритм чёткий!  ";
    window.flagRitmBall = 3;
  }

  CommentRitmika = CommentRitmika + CommentStopa;


  if (stopa > 1) {
    CommentRitmika = CommentRitmika + "Ясно выраженных стоп: " + CountStop + ". ";
  }
  ;
  if (risunok1.length > 3) {
    CommentRitmika = CommentRitmika + "Полностью безударные слоги " + risunok1.substr(0, risunok1.length - 4) + " и " + risunok1.substr(risunok1.length - 3, 2) + ". ";
  }
  ;
  if (risunok3.length > 3) {
    CommentRitmika = CommentRitmika + "Ударение падает на " + risunok3.substr(0, risunok3.length - 4) + " и " + risunok3.substr(risunok3.length - 3, 2) + " слоги. " + CommentSpondey;
  }
  ;
  if (risunok2.length > 3) {
    CommentRitmika = CommentRitmika + "Однако " + risunok2.substr(0, risunok2.length - 4) + " и " + risunok2.substr(risunok2.length - 3, 2) + "  слоги не имеют регулярных ударений. " + CommentAccent;
  }
  if (risunok2.length > 3) {
    CommentRitmika = CommentRitmika + "Ритм можно записать в виде: " + TriCodRitm + ", где 0-безударный, 1-слабоударный, 2-ударный слог. ";
  }

}