/** @param state {FetoState} */
export function TriCodCount(state)
{
  let i;
  // console.log

  // const TriCodLegend = state.TriCodLegend;

  let s = "";
  let n = "";

  let slog = '<span class="border1">';
  // var mySlog = state.mySlog; // document.getElementById("slog");
  // создаём строку нумерации слогов - с учётом интервалов между символами -------------------
  for (i = 1; i < state.TriCodRitm.length+1; i++) {
    s=i+" ";
    console.log ('s');
    console.log (s);
    if (i<10) {n=i;} else {n=s.substr(1,1);}
    slog = slog+'<span class="slog">'+n+'</span>';
  }
  slog = slog+'</span>';

  state.mySlog = '<span class="strofa">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+slog;

// создаём строку троичного кода - с учётом интервалов между символами ---------------------

  slog = '<span class="border1">';
  s = 0;

  for (i = 0; i < state.TriCodRitm.length; i++) {
    s = state.TriCodRitm[i];
    slog = slog+'<span class="slog">'+s+'</span>';
  }
  slog = slog+'</span>';

  state.TriCodLegend = '<span class="strofa">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+slog;
}
