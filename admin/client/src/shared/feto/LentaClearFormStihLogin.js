export function LentaClearFormStihLogin() {
  document.formStih1.TextStih.value = "";
  document.getElementById('ContainerTemplate1').innerHTML = "";
  document.getElementById('ContainerFlag1').innerHTML = "";
  document.getElementById('ContainerComment1').innerHTML = "";
  document.getElementById('openrecordstih1').style.display = 'none';
  document.getElementById('openrecordstih2').style.display = 'none';
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
}