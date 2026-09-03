export function hiderecordstih() {
  // document.getElementById('TextStih1').readOnly = '';
  // document.getElementById('openrecordstih2').style.display='none';
  // document.getElementById('openrecordstih1').style.display='none';
}

/** @param state {FetoState} */
export function openrecordstih(state) {
  /*

  document.recordstih.title.value=TitulStih;
  document.recordstih.rezume.value=window.BallContentManual;
  document.recordstih.ritm.value=state.RitmReportInt;

  document.recordstih.ritmkontrastminus.value=ritmkontrastminus;
  document.recordstih.ritmkontrastplus.value=ritmkontrastplus;

  document.recordstih.rifmovkatext.value=rifmovkatext;
  document.recordstih.rifmovkalong.value=rifmovkalong;
  document.recordstih.rifmovkatype.value=rifmovkatype;

  document.recordstih.razmer.value=StrofaPatternReport;
  document.recordstih.CountRitmError.value=state.flagCountRitmError;
  document.recordstih.ballritm.value=state.flagRitmBall;
  document.recordstih.ballrifma.value=state.flagRifmBall;
  document.recordstih.procentmix.value=window.ProcentCountSlogSer;
  document.recordstih.countstrof.value=Strof;
  document.recordstih.countstroftype.value=state.flagCountStrofaPatternType;

  document.recordstih.stih.value=document.formStih1.TextStih.value+"\n";
  TextStihResize2();

  document.getElementById('global-table1').style.display='none';
  document.getElementById('global-table2').style.display='';
  document.getElementById('openrecordstih2').style.display='none';
  document.getElementById('openrecordstih1').style.display='none';
  document.getElementById('ContainerAnaliz1f').innerHTML="";


  if (window.video==1) {document.getElementById('url').style.display=''};
  if (window.audio==1) {document.getElementById('audio').style.display=''};
  if (window.project=='zadanie') {document.getElementById('zadanie').style.display=''};

  if (window.image==1) {document.getElementById('image').style.display=''};
  if (window.picfile==1) {document.getElementById('picfile').style.display=''};
  if (window.project=='epigramma' || window.project=='zadanie') {document.getElementById('pic').style.display='none'};

  if (window.writer==1) {document.getElementById('writer').style.display=''};
  if (window.composer==1) {document.getElementById('composer').style.display=''};
  if (window.musician==1) {document.getElementById('musician').style.display=''};
  if (window.vocalist==1) {document.getElementById('vocalist').style.display=''};
  if (window.soavtor==1) {document.getElementById('soavtor').style.display=''};

  if (user!='') {
    document.recordstih.lastname.value=userjson.lastname;
    document.recordstih.firstname.value=userjson.firstname;
    document.recordstih.middlename.value=userjson.middlename;
    document.recordstih.region.value=userjson.region;
    document.recordstih.sity.value=userjson.sity;
    document.recordstih.phone.value=userjson.phone;
    document.recordstih.email.value=userjson.email;
    //document.recordstih.target.value=SbornikMas[SbornikCount].target;
    document.recordstih.rubrika.value=SbornikMas[SbornikCount].rubrika;
    document.recordstih.title.value=SbornikMas[SbornikCount].title;
    document.recordstih.Record_id.value=SbornikMas[SbornikCount].id;
    console.log("record_id="+SbornikMas[SbornikCount].id);
    console.log("title="+SbornikMas[SbornikCount].title);
    console.log("SbornikCount="+SbornikCount);
    console.log("SbornikMas.length="+SbornikMas.length);

    // отображаем картинку, если она была загружена ранее flagrealimg=1
    flagrealimg=1;
    picsize=0;

    let srcimage="https://fet.vpoezii.online/pic/pic"+SbornikMas[SbornikCount].id+".jpg?"+Math.random();

    console.log("srcimage="+srcimage);

    document.getElementById('demoimage').src=srcimage;
    document.getElementById('picfile').value = ''; // очищаем поле ввода

    console.log("flagrealimg="+flagrealimg);

  }

  if (SbornikMas.length>0) {

    document.recordstih.lastname.value=SbornikMas[SbornikCount].lastname;
    document.recordstih.firstname.value=SbornikMas[SbornikCount].firstname;
    document.recordstih.middlename.value=SbornikMas[SbornikCount].middlename;
    document.recordstih.region.value=SbornikMas[SbornikCount].region;
    document.recordstih.sity.value=SbornikMas[SbornikCount].sity;
    document.recordstih.phone.value=SbornikMas[SbornikCount].phone;
    document.recordstih.email.value=SbornikMas[SbornikCount].email;
    //document.recordstih.target.value=SbornikMas[SbornikCount].target;
    document.recordstih.rubrika.value=SbornikMas[SbornikCount].rubrika;
    document.recordstih.title.value=SbornikMas[SbornikCount].title;
    document.recordstih.Record_id.value=SbornikMas[SbornikCount].id;
    console.log("record_id="+SbornikMas[SbornikCount].id);
    console.log("title="+SbornikMas[SbornikCount].title);
    console.log("SbornikCount="+SbornikCount);
    console.log("SbornikMas.length="+SbornikMas.length);

  }


  window.scrollTo(0,0);
   */
}


export function loginprofile(user) {
  if (user=="") {openlogin();} else  {openprofile(0);}
}
function openlogin() {
  // document.getElementById('flogin').style.display='';
  // document.getElementById('fprofile').style.display='none';
  // document.getElementById('content').style.display='none';
  // document.getElementById('footer').style.display='none';
  // document.getElementById("message").innerHTML="";
  // document.getElementById("message2").innerHTML="";
}
function openprofile(clear) {

}