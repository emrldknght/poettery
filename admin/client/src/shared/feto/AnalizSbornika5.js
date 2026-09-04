/** @param state {FetoState} */
export function AnalizSbornika5(state) {
  // SbornikCount = Number(document.getElementById("SbornikCount").value);
  LentaClearFormStih();
  state.flagSetAccent = 0;
  state.OriginalTextInput = state.SbornikMas[state.SbornikCount];

  let FIOAuthorReport = state.SbornikMas[state.SbornikCount + 1];
  let GodAuthorReport = state.SbornikMas[state.SbornikCount + 2];
  let AdresAuthorReport = state.SbornikMas[state.SbornikCount + 3];
  let EmailAuthorReport = state.SbornikMas[state.SbornikCount + 4];

  FIOAuthorReport = FIOAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  GodAuthorReport = GodAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  AdresAuthorReport = AdresAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n
  EmailAuthorReport = EmailAuthorReport.replace(/[\n\v\f\r]/g, ''); // удалить \n


  let AuthorReport = FIOAuthorReport + "<br>" + GodAuthorReport + "<br>" + AdresAuthorReport + "<br>" + EmailAuthorReport;
  if (AuthorReport.length < 200) {
    document.getElementById('postscriptum').innerHTML = AuthorReport;
  }

  state.SbornikCount = state.SbornikCount + 5;
  // document.getElementById("SbornikCount").value = state.SbornikCount;
}