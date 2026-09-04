/** @param state {FetoState} */
export function grekinsert(state) {
  if (state.CountStrofaPatternType > 1) {
    return;
  }
  let grektextinsert = grek(state);
  console.log(grektextinsert);
  grektextinsert = grektextinsert.replace(/\n/ig, '<br>');
  state.ContainerAnaliz1f = grektextinsert + '<br>';
}