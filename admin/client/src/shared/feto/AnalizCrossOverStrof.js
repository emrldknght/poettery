/** @param state {FetoState} */
export function AnalizCrossOverStrof(state) {
  let CountUniCrossRitm = 0;
  let FlagUniCrossRitm = 0;
  let UniCrossRitmResume = "";
  let zn9 = " ";
// анализ перекрестных строф CrossRitmResult на уникальность ритма
  for (let k = 1; k < state.CrossRitmResult.length; k++) {
    FlagUniCrossRitm = 0;
    for (let n = 1; n < state.CrossRitmResult.length; n++) {
      if (state.CrossRitmResult[k] === state.CrossRitmResult[n] && n !== k) {
        FlagUniCrossRitm = 1;
      }
    }
    if (FlagUniCrossRitm === 0) {
      UniCrossRitmResume = UniCrossRitmResume + zn9 + k;
      zn9 = ",";
      CountUniCrossRitm = CountUniCrossRitm + 1;
    }
  }


  if (CountUniCrossRitm === 1) {
    UniCrossRitmResume = "Ритм в " + UniCrossRitmResume + " строфе отличается от всех остальных."
  }

  if (CountUniCrossRitm > 1) {
    UniCrossRitmResume = "Ритм в " + UniCrossRitmResume + " строфах отличается от всех остальных."
  }

  if (CountUniCrossRitm === state.CrossRitmResult.length) {
    state.ClassicBall = 0;
  }

  if (CountUniCrossRitm > 0 && CountUniCrossRitm < state.CrossRitmResult.length) {
    state.ClassicBall = 1;
  }


  state.ContainerAnaliz1 = state.ContainerAnaliz1 + UniCrossRitmResume;
  console.log(UniCrossRitmResume);
}