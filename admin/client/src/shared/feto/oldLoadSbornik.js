/** @param state {FetoState} */
export function oldLoadSbornik(state) {
  let Sbornik = "";

  console.log("LoadSbornik");
  let files1 = document.getElementById("your-files11").files;
  // Перебираем все файлы
  for (var i = 0; i < files1.length; i++) {
    // file1- объект типа File
    console.log("i = " + i);
    let file1 = files1.item(i);
    file1
      .text()
      .then(text => {
        Sbornik = text;
        state.SbornikMas = Sbornik.split("=");
      });
  }
  state.SbornikMas = Sbornik.split("=");
  console.log("SbornikMas.length = " + state.SbornikMas.length);
}