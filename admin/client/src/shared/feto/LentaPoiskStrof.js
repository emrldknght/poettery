export function LentaPoiskStrof() {
  DelSpace();
// разбивка стиха на простые строфы без группировки (анализировать будем каждую)
  LentaStihText = document.formStih1.TextStih.value;
  LentaStihMas = LentaStihText.split("\n\n");
  GroupStrof = LentaStihMas.reverse(); // переворачиваем массив, так как fullanaliz начинается с последнего

}