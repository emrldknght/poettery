import {RitmAnaliz} from "./RitmAnaliz.js";
import {CreateBlockRitm} from "./CreateBlockRitm.js";
import {Ritmkontrast} from "./Ritmkontrast.js";

/** @param state {FetoState} */
export function SecondTemplateAnaliz(state)
// На основе вычисленного базового ритмического рисунка заменяем в шаблоне слабоударные ударными или безударными. Заодно корректируем TemplateGlasn - двусложные слова в безударных столбцах делаем безударными
{

  state.TemplateAccent = state.TemplateAccent.replace(/\n+$/g, ''); // удаляем пустые строки в конце
  state.TemplateGlasn = state.TemplateGlasn.replace(/\n+$/g, '');
  state.TemplateNumGlas = state.TemplateNumGlas.replace(/\n+$/g, '');


  state.TemplateMas = state.TemplateAccent.split("\n"); //массив содержит ударения в формате О:.
  state.TemplateGlasnMas = state.TemplateGlasn.split("\n"); //массив содержит гласные
  state.TemplateNumGlasMas = state.TemplateNumGlas.split("\n"); //массив содержит позиции гласных в словах

  console.log("SecondTemplateAnaliz()");

  console.log("TemplateMas");
  console.log(state.TemplateMas);

  console.log("TemplateGlasnMas");
  console.log(state.TemplateGlasnMas);

  console.log("TemplateNumGlasMas");
  console.log(state.TemplateNumGlasMas);

  let resStrAccent = "";
  let resStrGlasn = "";
  let resStrNumGlas = "";

  const Ritm = state.Ritm;


  let KolStrok = state.TemplateMas.length;
  console.log("nextStrGlasn2");
// сравниваем каждую строку с шаблоном Ritm - базовый ритмический рисунок (цифра означает силу ударения)
  for (let s = 0; s < KolStrok; s++) {
    let nextStr = state.TemplateMas[s]; // строка содержит ударения в формате О:.
    let nextStrGlasn = state.TemplateGlasnMas[s];  //строка содержит гласные
    let nextStrNumGlas = state.TemplateNumGlasMas[s];  //строка содержит позиции гласных в словах


    let nextStr2 = "";
    let nextStrGlasn2 = "";
    let nextStrNumGlas2 = "";


    for (let k = 0; k < nextStr.length; k++) {
      let sim = nextStr.substr(k, 1);
      let simGlasn = nextStrGlasn.substr(k, 1);
      let simNumGlas = nextStrNumGlas.substr(k, 1);

      let sb = Ritm[k + 1];

      if (sb === 3 && sim === ":") {
        sim = "О";
      }

      if (sb === 1 && sim === ":") {
        sim = ".";
      }

// корректируем шаблон ударений в формате О:. и заодно шаблон гласных


// console.log (nextStr);

// двусложные слова делаем безударными, если попадают на два безударных слога подряд (дактиль или анапест).
      if (k < nextStr.length && Ritm[k + 1] === 1 && Ritm[k + 2] === 1 && nextStrNumGlas.substr(k, 1) === "1" && nextStrNumGlas.substr(k + 1, 1) === "2" && nextStrNumGlas.substr(k + 2, 1) === "1") {
        sim = ".";
        simGlasn = simGlasn.toLowerCase();
      } // начало двусложного слова (ритм этот и следующий - безударный, а гласная эта первая, потом вторая, потом новое слово)

      if (k < nextStr.length && Ritm[k + 1] === 1 && Ritm[k] === 1 && nextStrNumGlas.substr(k, 1) === "2" && nextStrNumGlas.substr(k + 1, 1) === "1") {
        sim = ".";
        simGlasn = simGlasn.toLowerCase();
      } // конец  двусложного слова (ритм этот и предыдущий - безударный, а гласная эта вторая, потом новое слово)


      nextStr2 = nextStr2 + sim; // строка содержит ударения в формате О:.

//nextStr2=nextStr2+sim; // строка содержит ударения в формате 321 - silaritma


      nextStrGlasn2 = nextStrGlasn2 + simGlasn; //строка содержит гласные


      nextStrNumGlas2 = nextStrNumGlas2 + simNumGlas; //строка содержит позиции гласных в словах
    }

    console.log(nextStrGlasn2);

    resStrAccent = resStrAccent + nextStr2 + "\n"; // результирующая строка содержит ударения в формате О:.
    resStrGlasn = resStrGlasn + nextStrGlasn2 + "\n"; // результирующая строка содержит гласные
    resStrNumGlas = resStrNumGlas + nextStrNumGlas2 + "\n"; // результирующая строка содержит позиции гласных в словах

  }

// возвращаем изменения в исходные массивы
  state.TemplateAccent = resStrAccent;
  state.TemplateGlasn = resStrGlasn;
  state.TemplateNumGlas = resStrNumGlas;

  console.log("_TemplateAccent");
  console.log(state.TemplateAccent);

  console.log("_TemplateGlasn");
  console.log(state.TemplateGlasn);

  console.log("_TemplateNumGlas");
  console.log(state.TemplateNumGlas);
  RitmAnaliz(state);
  CreateBlockRitm(state);
  state.CrossRitm = Ritm;
  Ritmkontrast(state);

}
