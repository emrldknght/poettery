export function grekinsert() {
  if (CountStrofaPatternType > 1) {
    return;
  }
  let grektextinsert = grek();
  console.log(grektextinsert);
  grektextinsert = grektextinsert.replace(/\n/ig, '<br>');
  document.getElementById("ContainerAnaliz1f").innerHTML = grektextinsert + '<br>';
}