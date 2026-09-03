/** @param state {FetoState} */
export function ReadZadanie(state){
  ReadUserStihi(0,1000,0,0); // задания привязаны к конкурсу номер 1000
  document.getElementById('ShowList').style.display='';
  document.getElementById('up').style.display='';
  document.getElementById('down').style.display='';
  document.getElementById('primer').style.display='none';
  state.ContainerAnaliz1f = "";
  state.ContainerTemplate1 = "";
  state.ContainerAnaliz1 = "";
  state.ContainerFlag1 = "";
  state.ContainerComment1 = "";
  window.project='zadanie';
}

export function ReadUserStihi(typeSbornik,idSbornik,nameSbornik,email){

  SbornikMas = [];
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
        SbornikMas[key]=data[key];
      }

      console.log("SbornikMas.length = "+SbornikMas.length);
      ShowSbornikList();

// если стихи загружены, и опция "Обновить" не добавлена, то добавляем "обновить" ==========
      if (!flagupdaterecord==1) {
        var objTarget = document.recordstih.targetpole;
        var lenTarget=objTarget.options.length;
        objTarget.options[lenTarget] = new Option('Обновить существующую запись', 'Обновить');
        flagupdaterecord=1;
      }

    }
  });
  event.preventDefault();
}