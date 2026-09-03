/** @typedef
 * {{
 * level?: 'auto'|'tonic'|'full'|'strof'|'strok',
 * project?: string,
 * epigramma?: number,
 }} LAOptions */

/**
 * @param state {FetoState}
 * @param options {LAOptions}
  */
export function LayerAnaliz(state, options = {}) {
  const { level = 'auto', project = '', epigramma = 0 } = options;

  if (state.slovar_accent_Mas.length === 0 || state.slovar_accent_Mas.length < 2876000) {
    console.log("Дождитесь полной загрузки словаря...");
    console.error('NO DICTIONARY!', state.slovar_accent_Mas.length);
    return;
  }

  if (level === 'tonic') {
    TonicAnaliz(state);
    return;
  }

  console.time('test');
  console.log('Идёт анализ...');

  AnalizRazmera(state);

  if (project === 'epigramma' && epigramma !== 1) {
    console.log("В режиме поэтических миниатюр принимаются только четверостишия определённого формата...");
    return;
  }

  if (epigramma === 1 || project === 'zadanie') {
    ClassicAnaliz(state);
  }

  if (level === 'full') {
    ClassicAnaliz(state);
    return;
  }
  if (level === 'strof') {
    LentaAnaliz(state);
    return;
  }
  if (level === 'strok') {
    CrossAnaliz(state);
    return;
  }

  // HandAccent = 0;
  state.HandAccent = 0;

  CrossAnaliz(state);
  ClassicAnaliz(state);

  if (state.ClassicBall < 1 && project !== 'zadanie') {
    TonicAnaliz(state);
  }

  if (state.ClassicBall < 2 && tonicBall < 1 && project !== 'zadanie') {
    CrossAnaliz(state);
  }

  // HandAccent = 1;
  state.HandAccent = 1;

  if (state.ClassicBall < 2 && tonicBall < 1 && project !== 'zadanie') {
    LentaAnaliz(state);
  }

  console.log('ResumeLentaMode:', ResumeLentaMode);
  console.log('flagStrofaRazbita:', state.flagStrofaRazbita);
  console.log('ProcentCountSlogSer:', ProcentCountSlogSer);
  console.log('UnicStrof:', state.UnicStrof);
  console.log('ClassicBall:', state.ClassicBall);
  console.log('tonicBall:', tonicBall);
  console.log('ResumeComment:', state.ResumeComment);
  console.log('ResumeCommentMini:', state.ResumeCommentMini);
  console.timeEnd('test');

  // Забираем результат из контейнеров (это НЕ UI, это данные)
  state.SbornikContainerTemplate = state.ContainerTemplate1;
  state.SbornikContainerAnaliz = state.ContainerAnaliz1;
  state.SbornikContainerFlag1Report = state.ContainerFlag1;
  state.SbornikResumeCommentMiniReport = state.ContainerComment1;

  if (tonicBall < 1) {
    TriCodCount();
  }
}