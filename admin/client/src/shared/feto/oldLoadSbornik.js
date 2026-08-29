export function oldLoadSbornik() {
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
        SbornikMas = Sbornik.split("=");
      });
  }
  SbornikMas = Sbornik.split("=");
  console.log("SbornikMas.length = " + SbornikMas.length);
}