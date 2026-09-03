/** @param state {FetoState} */
export function AnalizSbornika5(state) {
  SbornikCount = Number(document.getElementById("SbornikCount").value);
  LentaClearFormStih();
  state.flagSetAccent = 0;
  state.OriginalTextInput = SbornikMas[SbornikCount];

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