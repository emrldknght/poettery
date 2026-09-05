import {ClearForm2} from "./ClearForm2.js";
import {CountSimvol} from "./CountSimvol.js";
import {Accent} from "./Accent.js";
import {FullAnaliz} from "./FullAnaliz.js";
import {CreateCrossOverStrof} from "./CreateCrossOverStrof.js";
import {ReturnCrossOverStrof} from "./ReturnCrossOverStrof.js";
import {TriCodCount} from "./TriCodCount.js";

export function CrossAnaliz(state) {
// проводим ленточный анализ - каждая строфа отдельно
  console.log('проводим перекрестный анализ');
  state.CrossOverMode = 1;
  state.LentaMode.checked = true; // ленточный режим
  state.SaveRecord.checked = false; // запись не нужна
  /*
  // удаляем ленту-элементы с классом lenta
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
   */

  ClearForm2();  // закрываем запись
// если количество букв SimvolCount после расстановки ударений изменилось более чем на на 7 букв, то заново автоматом ставим ударения и проводим полный анализ, если нет- ударения расставляем руками и проводим анализ.
  state.SimvolCount = CountSimvol(state);
  if (Math.abs(state.SimvolCount - state.AccentCountSimvol) > 7) {
    state.FileAccent.checked = false;
    Accent(state);
  } else {
    state.FileAccent.checked = true;
  }
  FullAnaliz(state);
  CreateCrossOverStrof(state);
  state.LentaMode.checked = true;
  FullAnaliz(state);
  ReturnCrossOverStrof(state);
  /*
  if (isMobile != null) {
    window.scroll({top: 110, left: 0, behavior: 'smooth'})
  }
  */
  TriCodCount(state);
}