/** @param state {FetoState} */
export function LentaClear1(state) {
  LentaClearFormStih();
  state.flagSetAccent = 0;
  state.AccentCountSimvol = 0;
  TextStihResize();
}