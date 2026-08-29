// загружаем файл

const filePicker$ = document.querySelector('.file-picker');

filePicker$.addEventListener('click', async () => {

  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const fileContent = await file.text();

  console.log(fileContent);
  SbornikMasText = fileContent.split("=");
  console.log("SbornikMasText.length = " + SbornikMasText.length);
  console.log(SbornikMasText[1]);
  LoadSbornik();
})