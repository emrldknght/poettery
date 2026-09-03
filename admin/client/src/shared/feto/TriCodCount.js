export function TriCodCount()
{
  // console.log

  var TriCodLegend = document.getElementById("TriCodRitm");

  var s="";
  var n="";

  var slog='<span class="border1">';
  var mySlog = document.getElementById("slog");
// создаём строку нумерации слогов - с учётом интервалов между символами -------------------
  for (var i = 1; i < TriCodRitm.length+1; i++)
  {
    s=i+" ";
    console.log ('s');
    console.log (s);
    if (i<10) {n=i;} else {n=s.substr(1,1);}
    slog = slog+'<span class="slog">'+n+'</span>';
  }
  slog = slog+'</span>';

  mySlog.innerHTML = '<span class="strofa">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+slog;

// создаём строку троичного кода - с учётом интервалов между символами ---------------------

  var slog='<span class="border1">';
  var s=0;

  for (var i = 0; i < TriCodRitm.length; i++)
  {
    s=TriCodRitm[i];
    slog = slog+'<span class="slog">'+s+'</span>';
  }
  slog = slog+'</span>';

  TriCodLegend.innerHTML = '<span class="strofa">&nbsp;&nbsp;&nbsp;&nbsp;</span>'+slog;
}
