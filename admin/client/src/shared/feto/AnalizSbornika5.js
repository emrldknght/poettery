export function AnalizSbornika5() {
  SbornikCount = Number(document.getElementById("SbornikCount").value);
  LentaClearFormStih();
  flagSetAccent = 0;
  document.formStih1.TextStih.value = SbornikMas[SbornikCount];

  FIOAuthorReport = SbornikMas[SbornikCount + 1];
  GodAuthorReport = SbornikMas[SbornikCount + 2];
  AdresAuthorReport = SbornikMas[SbornikCount + 3];
  EmailAuthorReport = SbornikMas[SbornikCount + 4];

  FIOAuthorReport = FIOAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  GodAuthorReport = GodAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  AdresAuthorReport = AdresAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  EmailAuthorReport = EmailAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n


  let AuthorReport = FIOAuthorReport + "<br>" + GodAuthorReport + "<br>" + AdresAuthorReport + "<br>" + EmailAuthorReport;
  if (AuthorReport.length < 200) {
    document.getElementById('postscriptum').innerHTML = AuthorReport;
  }
  ;
  SbornikCount = SbornikCount + 5;
  document.getElementById("SbornikCount").value = SbornikCount;
}