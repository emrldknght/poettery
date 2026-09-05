import {DelSpace} from "./DelSpace.js";

/** @param state {FetoState} */
export function LentaPoiskStrof(state) {
  DelSpace(state);
// разбивка стиха на простые строфы без группировки (анализировать будем каждую)
  state.LentaStihText = state.OriginalTextInput;
  state.LentaStihMas = state.LentaStihText.split("\n\n");
  state.GroupStrof = state.LentaStihMas.reverse(); // переворачиваем массив, так как fullanaliz начинается с последнего

}