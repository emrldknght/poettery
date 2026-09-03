// загрузка словаря локально вручную =============================================
export function LoadSlovar2() {
  let files1 = document.getElementById("your-files").files;
  // Перебираем все файлы
  for (var i = 0; i < files1.length; i++) {
    // file1- объект типа File
    let file1 = files1.item(i);
    file1
      .text()
      .then(text => {
        // slovarGlobal = text;

      });
  }
}