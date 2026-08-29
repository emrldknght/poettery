// todo - extract to files

// загрузка полного словаря ударений ----------------------------------------------------------------------------------


export async function Load_slovar_full_accent() {
  document.getElementById('ContainerComment0').innerHTML = "Загружается словарь " + '<img src="https://fet.vpoezii.online/idikator.gif" width="15" style="vertical-align: middle;">';
  let url = "https://fet.vpoezii.online/slovar/slovar_full_accent.txt";
  let response = await fetch(url);
  if (response.ok) {
    let slovar_accent = await response.text();
    slovar_accent_Mas = slovar_accent.split(",");

    let slovar_noaccent = slovar_accent.toLowerCase();
    slovar_noaccent_Mas = slovar_noaccent.split(",");
//if (slovar_accent_Mas.length<2870000) {document.getElementById('ContainerComment1').innerHTML="Количество слов в словаре: " + slovar_accent_Mas.length+"."};
//if (slovar_accent_Mas.length>2870000) {document.getElementById('ContainerComment1').innerHTML="Словарь полностью загружен."} ;

    return;
  } else {
    alert("slovar_full_accent.txt Ошибка HTTP: " + response.status);
  }
}


// загрузка народного словаря ударений  ----------------------------------------------------------------------------------

export async function Load_slovar_narod_accent() {
  let url = "https://fet.vpoezii.online/slovar/slovar_narod_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_narod = await response.text();
    slovar_narod_Mas = slovar_narod.split(",");

    let slovar_noaccent_narod = slovar_narod.toLowerCase();
    slovar_noaccent_narod_Mas = slovar_noaccent_narod.split(",");
    return;
  } else {
    alert("slovar_narod_accent.txt Ошибка HTTP: " + response.status);
  }
}


// загрузка классического словаря ударений ----------------------------------------------------------------------------------

export async function Load_slovar_classic_accent() {
  let url = "https://fet.vpoezii.online/slovar/slovar_classic_mini_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_classic = await response.text();
    slovar_classic_Mas = slovar_classic.split(",");

    let slovar_noaccent_classic = slovar_classic.toLowerCase();
    slovar_noaccent_classic_Mas = slovar_noaccent_classic.split(",");
    return;
  } else {
    alert("slovar_classic_mini_accent.tx Ошибка HTTP: " + response.status);
  }
}


// загрузка неоклассического словаря ударений ----------------------------------------------------------------------------------

export async function Load_slovar_neoclassic_accent() {
  let url = "https://fet.vpoezii.online/slovar/slovar_neoclassic_mini_accent.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovar_neoclassic = await response.text();
    slovar_neoclassic_Mas = slovar_neoclassic.split(",");

    let slovar_noaccent_neoclassic = slovar_neoclassic.toLowerCase();
    slovar_noaccent_neoclassic_Mas = slovar_noaccent_neoclassic.split(",");
    return;
  } else {
    alert("slovar_neoclassic_accent.txt Ошибка HTTP: " + response.status);
  }
}