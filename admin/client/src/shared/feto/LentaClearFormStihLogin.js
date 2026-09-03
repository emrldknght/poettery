/** @param state {FetoState} */
export function LentaClearFormStihLogin(state) {
  state.OriginalTextInput = "";
  state.ContainerTemplate1 = "";
  state.ContainerFlag1 = "";
  state.ContainerComment1 = "";
  document.getElementById('openrecordstih1').style.display = 'none';
  document.getElementById('openrecordstih2').style.display = 'none';
  document.querySelectorAll('.lenta').forEach(function (a) {
    a.remove()
  });
}