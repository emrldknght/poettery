/**
 * Без-DOM версия processTable.
 * Собирает данные для кросс-анализа и запоминает параметры каждой ленты.
 *
 * В оригинале функция клонировала DOM-строки таблицы и переименовывала ID.
 * В без-DOM версии мы делаем только работу с данными.
 * Рендеринг HTML для лент — задача отдельного рендерера.
 *
 * @param {FetoState} state
 * @returns {{
 *   lenta: number,
 *   lentacount: number,
 *   fullContainerTemplate: string,
 *   crossLentaRitmEntry: string,
 *   crossTemplateGlasnEntry: string,
 *   crossRitmStrofa: string[],
 *   newTextFragment: string
 * }}
 */
export function processTableNoDom(state) {
  // 1. Инкрементируем счётчик ленты
  state.lenta = state.lenta + 1;

  state.lentaContainerTemplates = state.lentaContainerTemplates || [];
  state.lentaContainerTemplates[state.lenta] = state.ContainerTemplate1;

  // 2. Запоминаем ритм блока (одна строфа = одна строка ритма)
  const crossLentaRitmEntry = state.CrossRitm.join(',');
  state.CrossLentaRitm[state.lenta] = crossLentaRitmEntry;

  // 3. Считаем количество строк в шаблоне гласных
  const templateGlasnLines = state.TemplateGlasn.split('\n');
  const kolStrokTemplateGlasn = templateGlasnLines.length;

  // 4. Перезаписываем CrossRitmStrofa для текущей ленты
  // (в оригинале локальный счётчик countStrokTemplateGlasn сбрасывался на 0)
  state.CrossRitmStrofa = [];
  for (let q = 0; q < kolStrokTemplateGlasn; q++) {
    state.CrossRitmStrofa.push(crossLentaRitmEntry);
  }

  // 5. Запоминаем шаблон гласных для этой ленты
  state.CrossTemplateGlasn[state.lenta] = state.TemplateGlasn;

  // 6. Накапливаем текст с расставленными ударениями
  state.NewAccentLentaText = state.NewAccentLentaText + state.OriginalTextInput;

  // 7. Обновляем счётчик
  state.lentacount = state.lenta;

  // 8. Если режим ленты — собираем FullContainerTemplate
  // В оригинале это HTML из ContainerTemplate{lenta}, но этот блок сейчас выключен (&& false)
  let fullContainerTemplate = '';
  if (state.LentaMode.checked) {
    fullContainerTemplate = state.ContainerTemplate1 + '<br>';
  }

  return {
    lenta: state.lenta,
    lentacount: state.lentacount,
    fullContainerTemplate,
    crossLentaRitmEntry,
    crossTemplateGlasnEntry: state.TemplateGlasn,
    crossRitmStrofa: [...state.CrossRitmStrofa],
    newTextFragment: state.OriginalTextInput,
  };
}