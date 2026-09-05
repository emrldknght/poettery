// todo - extract to files

// загрузка полного словаря ударений ----------------------------------------------------------------------------------


/** @param state {FetoState} */
export async function Load_slovar_full_accent(state) {
  console.log("START -- Load_slovar_full_accent");
  state.ContainerComment0 = "Загружается словарь " + '<img src="https://fet.vpoezii.online/idikator.gif" width="15" style="vertical-align: middle;" alt="i">';
  let url = "https://fet.vpoezii.online/slovar/slovar_full_accent.txt";
  let response = await fetch(url);
  if (response.ok) {
    let slovar_accent = await response.text();
    state.slovar_accent_Mas = slovar_accent.split(",");

    let slovar_noaccent = slovar_accent.toLowerCase();
    state.slovar_noaccent_Mas = slovar_noaccent.split(",");
//if (slovar_accent_Mas.length<2870000) {document.getElementById('ContainerComment1').innerHTML="Количество слов в словаре: " + slovar_accent_Mas.length+"."};
//if (slovar_accent_Mas.length>2870000) {document.getElementById('ContainerComment1').innerHTML="Словарь полностью загружен."} ;

    // return;
  } else {
    alert("slovar_full_accent.txt Ошибка HTTP: " + response.status);
  }
}


// загрузка народного словаря ударений ----------------------------------------------------------------------------------

/** @param state {FetoState} */
export async function Load_slovar_narod_accent(state) {
  let url = "https://fet.vpoezii.online/slovar/slovar_narod_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_narod = await response.text();
    state.slovar_narod_Mas = slovar_narod.split(",");

    let slovar_noaccent_narod = slovar_narod.toLowerCase();
    state.slovar_noaccent_narod_Mas = slovar_noaccent_narod.split(",");
    // return;
  } else {
    alert("slovar_narod_accent.txt Ошибка HTTP: " + response.status);
  }
}


// загрузка классического словаря ударений ----------------------------------------------------------------------------------

/** @param state {FetoState} */
export async function Load_slovar_classic_accent(state) {
  let url = "https://fet.vpoezii.online/slovar/slovar_classic_mini_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_classic = await response.text();
    state.slovar_classic_Mas = slovar_classic.split(",");

    let slovar_noaccent_classic = slovar_classic.toLowerCase();
    state.slovar_noaccent_classic_Mas = slovar_noaccent_classic.split(",");
    // return;
  } else {
    alert("slovar_classic_mini_accent.tx Ошибка HTTP: " + response.status);
  }
}


// загрузка неоклассического словаря ударений ----------------------------------------------------------------------------------

/** @param state {FetoState} */
export async function Load_slovar_neoclassic_accent(state) {
  let url = "https://fet.vpoezii.online/slovar/slovar_neoclassic_mini_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_neoclassic = await response.text();
    state.slovar_neoclassic_Mas = slovar_neoclassic.split(",");

    let slovar_noaccent_neoclassic = slovar_neoclassic.toLowerCase();
    state.slovar_noaccent_neoclassic_Mas = slovar_noaccent_neoclassic.split(",");
    // return;
  } else {
    alert("slovar_neoclassic_accent.txt Ошибка HTTP: " + response.status);
  }
}