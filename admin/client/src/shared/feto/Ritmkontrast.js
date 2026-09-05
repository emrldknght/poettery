/** @param state {FetoState} */
export function Ritmkontrast(state) {
// alex если ритм явный, то формируем контрастный ритм (без смешанных) ritmkontrast - сверточный слой ==========================================

  state.RitmkontrastMas = [];
  let kontrast0 = "";
  let kontrast1 = "";
  let kontrast2 = "";
  // let kontrast3 = "";
  // let Ritmstring;

  console.log('Ritm');
  console.log(state.Ritm);

  // создаём копию массива Ritm массив RitmkontrastMas


  let Ritmstring = state.Ritm.join(',');

  // === ВРЕМЕННЫЙ КОСТЫЛЬ ДЛЯ АДАПТЕРА (TODO: refactor) ===
  state._TempRitmstring = Ritmstring;

  state.RitmkontrastMas = Ritmstring.split(',');
  state.RitmkontrastMas = Ritmstring.split(',');

  console.log('Ritmstring');
  console.log(Ritmstring);

  state.RitmkontrastMas[0] = '2'; // добавляем признак смешанной гласной в начало
  state.RitmkontrastMas.push('2'); // добавляем признак смешанной гласной в конец

  console.log('RitmkontrastMas1');
  console.log(state.RitmkontrastMas);

  if (state.flagRitmBall > 1) {

    for (let kk = 1; kk < state.RitmkontrastMas.length; kk++) {
      kontrast0 = Number(state.RitmkontrastMas[kk - 1]);
      kontrast1 = Number(state.RitmkontrastMas[kk]);
      kontrast2 = Number(state.RitmkontrastMas[kk + 1]);

      if (kontrast1 === 2 && kontrast2 === 3) {
        state.RitmkontrastMas[kk] = 1;
      } else {
        state.RitmkontrastMas[kk] = kontrast1;
      } // если справа ударный, то текущий безударный

      kontrast0 = Number(state.RitmkontrastMas[kk - 1]);
      kontrast1 = Number(state.RitmkontrastMas[kk]);
      kontrast2 = Number(state.RitmkontrastMas[kk + 1]);

      if (kontrast1 === 2 && kontrast0 === 3) {
        state.RitmkontrastMas[kk] = 1;
      } else {
        state.RitmkontrastMas[kk] = kontrast1;
      } // если слева ударный, то текущий безударный

      kontrast0 = Number(state.RitmkontrastMas[kk - 1]);
      kontrast1 = Number(state.RitmkontrastMas[kk]);
      kontrast2 = Number(state.RitmkontrastMas[kk + 1]);

      if (kontrast1 === 2 && kontrast0 === 1 && kontrast2 === 1) {
        state.RitmkontrastMas[kk] = 3;
      } // если слева и справа безударные, то текущий ударный (контраст+)

    }
    console.log('RitmkontrastMas2');
    console.log(state.RitmkontrastMas);

    state.RitmkontrastMas[0] = 0; // удаляем признак смешанной гласной в начале
    state.RitmkontrastMas.pop(); // удаляем признак смешанной гласной в конце

    console.log('RitmkontrastMas3');
    console.log(state.RitmkontrastMas);

  }

// нашли ritmkontrastplus - сверточный слой с усиленными ударными =================
  state.ritmkontrastplus = state.RitmkontrastMas.join('');
  state.ritmkontrastplus = state.ritmkontrastplus.slice(1); // нулевой лишний
  console.log('ritmkontrastplus');
  console.log(state.ritmkontrastplus);

// ищем ritmkontrastminus - сверточный слой с усиленными безударными - заменяем в переменной Ritmstring смешанные на безударные =====================================
  Ritmstring = state.Ritm.join('');
  state.ritmkontrastminus = Ritmstring.replace(/2/g, '1'); // меняем везде 2 на 1

  console.log('ritmkontrastminus');
  console.log(state.ritmkontrastminus);

}