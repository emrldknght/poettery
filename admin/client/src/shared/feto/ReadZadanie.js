/** @param state {FetoState} */
export function ReadZadanie(state){
  ReadUserStihi(0,1000,0,0, state); // задания привязаны к конкурсу номер 1000
  document.getElementById('ShowList').style.display='';
  document.getElementById('up').style.display='';
  document.getElementById('down').style.display='';
  document.getElementById('primer').style.display='none';
  state.ContainerAnaliz1f = "";
  state.ContainerTemplate1 = "";
  state.ContainerAnaliz1 = "";
  state.ContainerFlag1 = "";
  state.ContainerComment1 = "";

  // window.project='zadanie';
  state.inWindow.project = "zadanie";
}

/** @param typeSbornik
 @param idSbornik
 @param nameSbornik
 @param email
 @param state {FetoState} */
export function ReadUserStihi(typeSbornik,idSbornik,nameSbornik,email, state){

  state.SbornikMas = [];
  const url='https://fet.vpoezii.online/read-user-stihi.php';

  $.ajax({
    url: url,
    method: 'post',
    cache: false,
    dataType: 'json',
    data: {typeSbornik: typeSbornik, idSbornik: idSbornik, email: email},
    success: function(data){
      for (var key in data) {
        console.log(key + ' : ' + data[key].title+ ' : ' + data[key].email);
        state.SbornikMas[key]=data[key];
      }

      console.log("SbornikMas.length = "+state.SbornikMas.length);
      ShowSbornikList(state);

      // если стихи загружены, и опция "Обновить" не добавлена, то добавляем "обновить" ==========
      if (state.flagUpdateRecord !== 1) {
        var objTarget = document.recordstih.targetpole;
        var lenTarget=objTarget.options.length;
        objTarget.options[lenTarget] = new Option('Обновить существующую запись', 'Обновить');
        state.flagUpdateRecord = 1;
      }

    }
  });
  event.preventDefault();
}