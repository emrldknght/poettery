// загрузка словаря Ё ---------------------------------------------------------------------------------------------------------------

/** @param state {FetoState} */
export async function LoadSlovarE(state) {
  console.log("START -- LoadSlovarE");

  let url = "https://fet.vpoezii.online/slovar/slovar_Yo.txt";

  let response = await fetch(url);
  if (response.ok) {
    let slovarE = await response.text();
    state.slovar_E_Mas = slovarE.split(",");

    let slovar_noaccent_E = slovarE.toLowerCase();
    state.slovar_noaccent_E_Mas = slovar_noaccent_E.split(",");
    /*
    if (isMobile == null) {
      document.getElementById('ContainerComment0').innerHTML = "Для начала нажмите «Анализ стихотворения».";
    }

    if (isMobile != null) {
      document.getElementById('ContainerComment0').innerHTML = "Для анализа стихотворения нажмите «Анализ».";
    }
    */

    // return;
  } else {
    alert("slovar_Yo.txt Ошибка HTTP: " + response.status);
  }
}