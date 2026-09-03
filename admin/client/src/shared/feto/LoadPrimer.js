/** @param state {FetoState} */
export function LoadPrimer(state) {
  LentaClearFormStih(state);
  state.flagSetAccent = 0;
  state.AccentCountSimvol = 0;
  let CountPrimer = primer.length;
  if (rn === 999) {
    rn = Math.round(-0.5 + Math.random() * CountPrimer)
  }

  if (rn < CountPrimer) {
    ++rn
  }

  if (rn > CountPrimer - 1) {
    rn = 0
  }

  state.OriginalTextInput = primer[rn];
  TextStihResize();
}