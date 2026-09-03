/** @param state {FetoState} */
export function CountSimvol(state) {
  let stih = state.OriginalTextInput;
  state.SimvolCount = stih.length;
  return state.SimvolCount;
}