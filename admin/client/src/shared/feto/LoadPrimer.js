export function LoadPrimer() {
  LentaClearFormStih();
  flagSetAccent = 0;
  AccentCountSimvol = 0;
  let CountPrimer = primer.length;
  if (rn === 999) {
    rn = Math.round(-0.5 + Math.random() * CountPrimer)
  }
  ;
  if (rn < CountPrimer) {
    ++rn
  }
  ;
  if (rn > CountPrimer - 1) {
    rn = 0
  }
  ;
  document.formStih1.TextStih.value = primer[rn];
  TextStihResize();
}