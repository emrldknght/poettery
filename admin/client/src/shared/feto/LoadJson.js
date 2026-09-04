export function LoadJson() {
  let JsonBase = "";
  let RecordMas = "";

  let files1 = document.getElementById("your-files").files;
  // Перебираем все файлы
  for (var i = 0; i < files1.length; i++) {
    // file1- объект типа File
    let file1 = files1.item(i);
    file1
      .text()
      .then(text => {
        JsonBase = text;
      });
  }

  RecordMas = JSON.parse(JsonBase);
// например, тридцатая запись из массива

  for (var NumRecord = 0; NumRecord < RecordMas.length; NumRecord++) {
    let Record = RecordMas[NumRecord];
    // номер записи - нулевое поле в записи
    let RecordID = Record[0];
    let RecordTimeCreate = Record[1];
    let RecordTimeEdit = Record[2];
    let RecordLastName = Record[3];
    let RecordFirstName = Record[4];
    let RecordMiddleName = Record[5];
    let RecordYeahr = Record[6];
    let RecordRegion = Record[7];
    let RecordPhone = Record[8];
    let RecordEmail = Record[9];
    let RecordNomination = Record[10];
    let RecordTitulText = Record[11];
    let RecordText = Record[12];
    // значения записи
    let RecordIDValue = RecordID[1];
    let RecordTimeCreateValue = RecordTimeCreate[1];
    let RecordTimeEditValue = RecordTimeEdit[1];
    let RecordLastNameValue = RecordLastName[1];
    let RecordFirstNameValue = RecordFirstName[1];
    let RecordMiddleNameValue = RecordMiddleName[1];
    let RecordYeahrValue = RecordYeahr[1];
    let RecordRegionValue = RecordRegion[1];
    let RecordPhoneValue = RecordPhone[1];
    let RecordEmailValue = RecordEmail[1];
    let RecordNominationValue = RecordNomination[1];
    let RecordTitulTextValue = RecordTitulText[1];
    let RecordTextValue = RecordText[1];

  }
// Значение имени - первое поле в записи (название - нулевое поле)

  console.log(RecordLastNameValue);

  /*
  [["ID","92666296"],["Время создания","2020-07-27 22:14:06"],["Время изменения","2020-07-27 22:14:06"],["Фамилия","Ромашов"],["Имя","Олег"],["Отчество","Владимирович"],["Год рождения","1988"],["Город","Балаково, Саратовская область, Россия"],["Телефон","+7 987 328-23-58"],["Электронная почта","romashov-ov@yandex.ru"],["Номинация","Энергия жизни"],["Наименование стихотворения","Говорите"],["Текст стихотворения","Говорите другом с другом чаще,\r\nГоворите слова простые.\r\nДаже если совсем остыли,\r\nНе несите вы камни дальше.\r\n\r\nГоворите, забыв обиду\r\nНавсегда, и себя не жалея.\r\nДелать верный шаг тяжелее,\r\nЧем стоять, повернув спину.\r\n\r\nНе ищи никогда виновных,\r\nНе найти в темноте тени.\r\nТо, что было мы не изменим,\r\nТо, что будет дает шанс новый.\r\n\r\nГоворите, не стоит рвать нити,\r\nМы и так далеки друг от друга.\r\nИногда жизнь спасает минута,\r\nБлиже будьте, прошу...\r\n\r\nГоворите."],["Требуется пояснить понятие \"классического\" стихосложения.","Да"]],
*/

}