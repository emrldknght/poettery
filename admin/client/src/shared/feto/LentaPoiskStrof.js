/** @param state {FetoState} */
export function LentaPoiskStrof(state) {
  DelSpace(state);
// разбивка стиха на простые строфы без группировки (анализировать будем каждую)
  LentaStihText = state.OriginalTextInput;
  LentaStihMas = LentaStihText.split("\n\n");
  state.GroupStrof = LentaStihMas.reverse(); // переворачиваем массив, так как fullanaliz начинается с последнего

}