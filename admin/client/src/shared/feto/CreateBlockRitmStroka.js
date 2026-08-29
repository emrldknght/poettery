export function CreateBlockRitmStroka(ColorStroka, RitmStrokaMas) {
// создаём однострочный блок гласных с цветовой маркировкой ударений ============================================================================================ ???

  let html = '<span class="text-main">';
  let uspan = '<span class="blue-symbol">';
  let gspan = '<span class="gray-symbol">';
  let bspan = '<span class="black-symbol">';
  let rspan = '<span class="red-symbol">';
  let nospan = '</span>';
  let spcol = "";
  let pr = "";
  let dlinaspan = '<span style="background-color: #ffffff ; font-family:monospace ; color:#0d6f9c; ">';

  for (let k = 0; k < ColorStroka.length; k++) {
    let sim = ColorStroka.substr(k, 1);
// в зависимости от ударения раскрашиваем гласные

    if (RitmStrokaMas[k] == '1') {
      spcol = uspan;
      sim = sim.toLowerCase();
    }
    if (RitmStrokaMas[k] == '2') {
      spcol = gspan;
      sim = sim.toLowerCase();
    }
    if (RitmStrokaMas[k] == '3') {
      spcol = bspan;
      sim = sim.toUpperCase();
    }
    if (RitmStrokaMas[k] == '9') {
      spcol = rspan;
    }

    html = html + spcol + sim + nospan;
  }
  html = html + nospan;

  if (ColorStroka.length < 10) {
    pr = '&nbsp;'
  }
  ;

  html = dlinaspan + ColorStroka.length + '&nbsp;&nbsp;' + pr + nospan + html;

  return html;
}