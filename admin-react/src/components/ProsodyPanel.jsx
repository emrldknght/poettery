import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyze,
  placeAccents as fallbackAccents,
  toggleStress,
  clearAccents,
  hasAccents,
  PROSODY_BUILD,
} from '../lib/fet-method';
import { useAccentDictionary, formatCount, formatMb } from '../lib/useAccentDictionary';
import ProsodyDebug from './ProsodyDebug';
import './ProsodyPanel.css';
import './ProsodyDebug.css';
import './ProsodyAccent.css';

function Icon({ path }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{path}</svg>;
}

const ICON_CLOSE = <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>;
const ICON_WAND = <><path d="M9.9 2.6 11.4 6.6 15.4 8.1 11.4 9.6 9.9 13.6 8.4 9.6 4.4 8.1 8.4 6.6Z" /><path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z" /></>;
const ICON_ERASER = <><path d="m7 21-4.3-4.3a2 2 0 0 1 0-2.8l9.6-9.6a2 2 0 0 1 2.8 0l5.6 5.6a2 2 0 0 1 0 2.8L13 21" /><path d="M22 21H7" /></>;
const ICON_BOOK = <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>;
const ICON_COPY = <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>;

const RITM_LABEL = ['нет', 'слабый', 'явный', 'чёткий'];

/* Порог как в оригинале: если длина текста изменилась больше чем на 7 символов,
   ударения расставляются заново, иначе ручная разметка сохраняется. */
const ACCENT_LENGTH_TOLERANCE = 7;

const EXAMPLE = `бумАжным Аистом он стАл
и с тЕх угрЮмых пОр
над бЕлой бАшней он кричИт
ночАми: мутабОр

устАло дрЕмлет муэдзИн
шахерезАда врЁт
и снОва тЫсяча одИн
и нОль - двоИчный счЁт`;

function cellLetter(vowel, mode) {
  if (mode === 'words') {
    return vowel.stressed ? vowel.char.toUpperCase() : vowel.char.toLowerCase();
  }
  if (vowel.error) return vowel.char.toUpperCase();
  if (vowel.column === 3) return vowel.char.toUpperCase();
  if (vowel.column === 1) return vowel.char.toLowerCase();
  return vowel.stressed ? vowel.char.toUpperCase() : vowel.char.toLowerCase();
}

function cellTone(vowel) {
  if (vowel.error) return 'err';
  if (vowel.column === 3) return 'strong';
  if (vowel.column === 2) return 'weak';
  return 'light';
}

export default function ProsodyPanel({ open, onClose, content, onChangeContent }) {
  const [mode, setMode] = useState('syllabic');
  const [caseMode, setCaseMode] = useState('columns');
  const [scope, setScope] = useState('poem');
  const [accentBusy, setAccentBusy] = useState(false);
  const [accentInfo, setAccentInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  const {
    status: dictStatus,
    phase: dictPhase,
    loaded: dictLoaded,
    total: dictTotal,
    stats: dictStats,
    error: dictError,
    load: loadDictionary,
    placeAccents: workerAccents,
  } = useAccentDictionary();

  const changeRef = useRef(onChangeContent);
  changeRef.current = onChangeContent;

  const accentRunRef = useRef({ key: '', length: 0 });
  const accentSeqRef = useRef(0);

  const result = useMemo(() => analyze(content || '', { scope }), [content, scope]);

  const textHasAccents = hasAccents(content || '');
  const preparing = accentBusy && !textHasAccents;

  /* ---------- ШАГ 1: ударения из словаря прямо в поле ввода ---------- */
  useEffect(() => {
    if (!open) return;
    const text = content || '';
    if (!text.trim()) return;
    if (accentBusy) return;

    const key = `${mode}::${text}`;
    if (accentRunRef.current.key === key) return;

    // ручные правки бережём: ударения уже есть, длина почти не изменилась
    if (
      textHasAccents
      && accentRunRef.current.length > 0
      && Math.abs(text.length - accentRunRef.current.length) <= ACCENT_LENGTH_TOLERANCE
    ) {
      accentRunRef.current = { key, length: text.length };
      return;
    }

    const seq = ++accentSeqRef.current;
    setAccentBusy(true);

    workerAccents(text, { tonic: mode === 'tonic' })
      .then((res) => {
        if (seq !== accentSeqRef.current) return;
        accentRunRef.current = { key: `${mode}::${res.text}`, length: res.text.length };
        setAccentInfo({ ...res.stats, source: 'dictionary', auto: true });
        if (res.text !== text) changeRef.current?.(res.text);
      })
      .catch((error) => {
        if (seq !== accentSeqRef.current) return;
        const local = fallbackAccents(text, undefined, { tonic: mode === 'tonic' });
        accentRunRef.current = { key: `${mode}::${local.text}`, length: local.text.length };
        setAccentInfo({
          source: 'starter',
          missed: local.unmarked.length,
          error: error.message,
          auto: true,
        });
        if (local.text !== text) changeRef.current?.(local.text);
      })
      .finally(() => {
        if (seq === accentSeqRef.current) setAccentBusy(false);
      });
  }, [open, content, mode, accentBusy, textHasAccents, workerAccents]);

  useEffect(() => {
    if (!open) setAccentBusy(false);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const shown = useMemo(() => {
    const acc = { light: 0, weak: 0, strong: 0, err: 0 };
    result.lines.forEach((line) => {
      line.vowels.forEach((vowel) => { acc[cellTone(vowel)] += 1; });
    });
    return acc;
  }, [result]);

  const debugColumns = useMemo(() => {
    if (Array.isArray(result.columns) && result.columns.length) return result.columns;
    return (result.ritm || []).map((type, i) => ({
      index: i + 1,
      strong: 0,
      weak: 0,
      light: 0,
      real: 0,
      type,
      reason: 'Подробная статистика недоступна — обновите src/lib/fet-method.js.',
      error: false,
    }));
  }, [result]);

  if (!open) return null;

  const s = result;
  const tonic = s.tonic || { ok: false, stresses: 0, pattern: [], errors: [] };
  const rifmovka = s.rifmovka || { text: '—', type: '', long: '' };
  const counts = s.counts || { syllables: 0 };
  const unmarkedWords = s.unmarkedWords || [];
  const width = s.width || 0;
  const buildShort = String(PROSODY_BUILD || '').split(' · ')[0];

  const ruler = Array.from({ length: width }, (_, i) => (
    i + 1 < 10 ? i + 1 : String(i + 1).slice(-1)
  ));

  const change = (next) => changeRef.current?.(next);

  /* принудительная перестановка ударений по кнопке */
  const handleForceAccents = () => {
    if (accentBusy) return;
    const text = content || '';
    if (!text.trim()) return;

    const seq = ++accentSeqRef.current;
    setAccentBusy(true);
    setAccentInfo(null);

    workerAccents(text, { tonic: mode === 'tonic' })
      .then((res) => {
        if (seq !== accentSeqRef.current) return;
        accentRunRef.current = { key: `${mode}::${res.text}`, length: res.text.length };
        setAccentInfo({ ...res.stats, source: 'dictionary', auto: false });
        if (res.text !== text) change(res.text);
      })
      .catch((error) => {
        if (seq !== accentSeqRef.current) return;
        const local = fallbackAccents(text, undefined, { tonic: mode === 'tonic' });
        accentRunRef.current = { key: `${mode}::${local.text}`, length: local.text.length };
        setAccentInfo({
          source: 'starter',
          missed: local.unmarked.length,
          error: error.message,
          auto: false,
        });
        if (local.text !== text) change(local.text);
      })
      .finally(() => {
        if (seq === accentSeqRef.current) setAccentBusy(false);
      });
  };

  const handleExample = () => {
    if ((content || '').trim() && !window.confirm('Заменить текущий текст примером?')) return;
    accentRunRef.current = { key: '', length: 0 };
    change(EXAMPLE);
    setAccentInfo(null);
  };

  const handleClear = () => {
    const next = clearAccents(content || '');
    // помечаем очищенный текст как обработанный, чтобы авторасстановка не вернула ударения
    accentRunRef.current = { key: `${mode}::${next}`, length: next.length };
    change(next);
    setAccentInfo(null);
  };

  const handleVowel = (pos) => {
    const next = toggleStress(content || '', pos);
    accentRunRef.current = { key: `${mode}::${next}`, length: next.length };
    change(next);
  };

  const handleCopyScheme = async () => {
    const pad = (v) => String(v).padStart(2, ' ');
    const head = `    ${ruler.map((n) => ` ${n}`).join('')}`;
    const body = s.stanzas.map((stanza) => stanza.map((line) => (
      `${pad(line.syllables)}  ${line.vowels.map((v) => cellLetter(v, caseMode)).join(' ')}   ${line.rhymeLetter || ''}`
    )).join('\n')).join('\n\n');
    const code = `    ${(s.triCod || '').split('').join(' ')}`;
    const legend = `0-безударные: ${shown.light} · 1-слабоударные: ${shown.weak} · 2-ударные: ${shown.strong}${shown.err ? ` · сбои: ${shown.err}` : ''}`;
    try {
      await navigator.clipboard.writeText(`${head}\n${body}\n${code}\n\n${legend}\n`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const percent = dictTotal
    ? Math.min(100, Math.round((dictLoaded / dictTotal) * 100))
    : 0;

  const statusClass = accentBusy
    ? 'is-working'
    : (textHasAccents ? 'is-done' : 'is-warn');

  const statusText = accentBusy
    ? '① Расставляю ударения…'
    : (textHasAccents ? '① Ударения → ② Разбор' : '① Ударения не расставлены');

  return (
    <div
      className="prosody-layer"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="prosody-scrim" onClick={onClose} title="Закрыть разбор" />

      <aside className="prosody" role="dialog" aria-modal="true" aria-label="Разбор стихотворения">
        <div className="prosody__head">
          <div className="prosody__head-text">
            <div className="prosody__title">Разбор</div>
            <div className="prosody__sub">
              ударения из словаря пишутся в текст · клик по гласной — правка · Esc — закрыть
            </div>
          </div>

          <span className="build-stamp" title={PROSODY_BUILD}>{buildShort}</span>

          <div className={`ball ball--${s.classicBall}`} title={s.ballText}>
            {s.classicBall}<span>/3</span>
          </div>

          <button
            type="button"
            className="p-icon p-icon--wide"
            onClick={handleForceAccents}
            disabled={accentBusy}
            title="Переставить ударения по словарю заново"
          >
            <Icon path={ICON_WAND} />
            <span>{accentBusy ? 'Работаю…' : 'Ударения'}</span>
          </button>

          <button type="button" className="p-icon" onClick={handleExample} title="Вставить пример">
            <Icon path={ICON_BOOK} />
          </button>
          <button type="button" className="p-icon" onClick={handleClear} title="Снять все ударения">
            <Icon path={ICON_ERASER} />
          </button>
          <button type="button" className="p-icon" onClick={onClose} title="Закрыть">
            <Icon path={ICON_CLOSE} />
          </button>
        </div>

        <div className="prosody__dict">
          <span className={`acc-status ${statusClass}`}>{statusText}</span>

          {dictStatus === 'ready' && (
            <span className="dict-ok">
              Словарь: {formatCount(dictStats?.words)} слов
              {' · '}Ё: {formatCount(dictStats?.yoWords)}
              {' · '}{((dictStats?.ms || 0) / 1000).toFixed(1)} с
            </span>
          )}

          {dictStatus === 'loading' && (
            <div className="dict-progress">
              <div className="dict-progress__track">
                <div
                  className="dict-progress__bar"
                  style={{ width: dictPhase === 'index' ? '100%' : `${percent}%` }}
                />
              </div>
              <span className="dict-progress__label">
                {dictPhase === 'index'
                  ? 'Индексация словаря…'
                  : dictPhase === 'yo'
                    ? `Словарь Ё: ${formatMb(dictLoaded)}`
                    : `${formatMb(dictLoaded)}${dictTotal ? ` / ${formatMb(dictTotal)} · ${percent}%` : ''}`}
              </span>
            </div>
          )}

          {dictStatus === 'idle' && (
            <button type="button" className="dict-load" onClick={() => loadDictionary().catch(() => {})}>
              Загрузить словарь ударений (~69 МБ, один раз)
            </button>
          )}

          {dictStatus === 'error' && (
            <span className="dict-error">
              {dictError}
              <button type="button" className="dict-retry" onClick={() => loadDictionary().catch(() => {})}>
                повторить
              </button>
            </span>
          )}

          {accentInfo && (
            <span className="dict-result">
              {accentInfo.source === 'starter'
                ? `Встроенный мини-словарь · не найдено: ${formatCount(accentInfo.missed)}`
                : `Размечено ${formatCount(accentInfo.marked)} из ${formatCount(accentInfo.words)} · словарь ${formatCount(accentInfo.fromDict)} · ё ${formatCount(accentInfo.yoApplied)} · вручную ${formatCount(accentInfo.manual)} · не найдено ${formatCount(accentInfo.missed)}`}
            </span>
          )}
        </div>

        <div className="prosody__layout">
          <div className="prosody__side">
            <div className="prosody__verdict">{s.ballText}</div>

            <div className="prosody__cards">
              <div className="pcard pcard--main">
                <div className="pcard__label">Размер</div>
                <div className="pcard__value pcard__value--mono">{s.razmer || '—'}</div>
                <div className="pcard__note">слогов по строкам</div>
              </div>

              <div className="pcard">
                <div className="pcard__label">Ритм</div>
                <div className={`pcard__value${s.ritmBall < 2 ? ' is-warn' : ''}`}>
                  {RITM_LABEL[s.ritmBall] || 'нет'}
                </div>
                <div className="pcard__note">стоп: {s.countStop}</div>
              </div>

              <div className="pcard">
                <div className="pcard__label">Строфы</div>
                <div className="pcard__value">{s.countStrof}</div>
                <div className="pcard__note">
                  типов {s.countStrofType} · одиночных {s.uniqueStanzas}
                </div>
              </div>

              <div className="pcard pcard--wide">
                <div className="pcard__label">Рифмовка</div>
                <div className="pcard__value pcard__value--sm">{rifmovka.text}</div>
                <div className="pcard__note">код {rifmovka.type || '—'}</div>
              </div>
            </div>

            <div className="prosody__metrics">
              <span>смешанных <b className={s.procentMix > 40 ? 'is-bad' : ''}>{s.procentMix}%</b></span>
              <span>сбоев ритма <b className={s.countRitmError ? 'is-bad' : ''}>{s.countRitmError}</b></span>
              <span>без рифмы <b className={s.countErrorRifma ? 'is-bad' : ''}>{s.countErrorRifma}</b></span>
              <span>слогов <b>{counts.syllables}</b></span>
              {s.splitApplied && <span className="is-note">строфы нарезаны по 4</span>}
              {!s.accentsSet && (
                <span className="is-bad">не размечено слов: {unmarkedWords.length}</span>
              )}
            </div>

            <div className="prosody__modes">
              <button
                type="button"
                className={mode === 'syllabic' ? 'is-active' : ''}
                onClick={() => setMode('syllabic')}
              >
                Силлабо-тоника
              </button>
              <button
                type="button"
                className={mode === 'tonic' ? 'is-active' : ''}
                onClick={() => setMode('tonic')}
              >
                Тоника
              </button>
            </div>

            <div className="prosody__codes">
              <div className="code-line">
                <span className="code-line__label">Троичный код</span>
                <span className="code-line__value">{s.triCod || '—'}</span>
              </div>
              <div className="code-line">
                <span className="code-line__label">Контраст +</span>
                <span className="code-line__value">{s.contrastPlus || '—'}</span>
              </div>
              <div className="code-line">
                <span className="code-line__label">Контраст −</span>
                <span className="code-line__value">{s.contrastMinus || '—'}</span>
              </div>
              <div className="code-line">
                <span className="code-line__label">Код рифмы</span>
                <span className="code-line__value">{rifmovka.long || '—'}</span>
              </div>
              {s.greek && (
                <div className="code-line">
                  <span className="code-line__label">По-гречески</span>
                  <span className="code-line__value">{s.greek.label}</span>
                </div>
              )}
            </div>

            {!s.accentsSet && unmarkedWords.length > 0 && (
              <div className="unmarked">
                <div className="unmarked__head">
                  Этих слов нет в словаре — кликните нужную гласную в схеме:
                </div>
                <div className="unmarked__list">
                  {unmarkedWords.slice(0, 40).map((word) => (
                    <span key={word} className="unmarked__word">{word}</span>
                  ))}
                  {unmarkedWords.length > 40 && (
                    <span className="unmarked__word">…ещё {unmarkedWords.length - 40}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="prosody__main">
            {preparing && (
              <div className="acc-preparing">
                <span className="acc-preparing__spinner" />
                Сначала расставляю ударения по словарю — разбор посчитается по размеченному тексту.
              </div>
            )}

            {s.lineCount === 0 && (
              <div className="prosody__empty">
                Текст пуст — напишите строку или нажмите значок книги, чтобы вставить пример.
              </div>
            )}

            {mode === 'syllabic' && s.lineCount > 0 && (
              <>
                <div className="scheme-head">
                  <span className="scheme-head__title">Схема ударений</span>
                  <div className="scheme-head__tools">
                    <div className="mini-toggle">
                      <button
                        type="button"
                        className={caseMode === 'columns' ? 'is-active' : ''}
                        onClick={() => setCaseMode('columns')}
                        title="Регистр буквы задаётся столбцом — как в оригинале"
                      >
                        Столбцы
                      </button>
                      <button
                        type="button"
                        className={caseMode === 'words' ? 'is-active' : ''}
                        onClick={() => setCaseMode('words')}
                        title="Регистр буквы задаётся реальным ударением в слове"
                      >
                        Слова
                      </button>
                    </div>
                    <button type="button" className="mini-btn" onClick={handleCopyScheme}>
                      <Icon path={ICON_COPY} />
                      {copied ? 'Скопировано' : 'Копировать'}
                    </button>
                  </div>
                </div>

                <div className={`scheme${preparing ? ' is-preparing' : ''}`}>
                  <div className="scheme__row scheme__row--ruler">
                    <span className="scheme__count" />
                    <span className="scheme__cells">
                      {ruler.map((n, i) => (
                        <span key={i} className="cell cell--ruler">{n}</span>
                      ))}
                    </span>
                  </div>

                  {s.stanzas.map((stanza, si) => (
                    <div className="scheme__stanza" key={si}>
                      {stanza.map((line, li) => (
                        <div
                          className={`scheme__row${line.hasError ? ' is-error' : ''}${!stanza.inDominant ? ' is-outside' : ''}`}
                          key={`${si}-${li}`}
                          title={line.raw}
                        >
                          <span className="scheme__count">{line.syllables}</span>
                          <span className="scheme__cells">
                            {line.vowels.map((vowel, vi) => (
                              <button
                                type="button"
                                key={vi}
                                className={`cell cell--${cellTone(vowel)}${vowel.stressed ? ' is-actual' : ''}`}
                                onClick={() => handleVowel(vowel.pos)}
                                title={`${vowel.word} · ${vi + 1}-й слог · столбец ${vowel.column}`}
                              >
                                {cellLetter(vowel, caseMode)}
                              </button>
                            ))}
                          </span>
                          <span className="scheme__rhyme">{line.rhymeLetter || '–'}</span>
                        </div>
                      ))}

                      <div className="scheme__meta">
                        строфа {si + 1} · {stanza.plain} · {stanza.rhyme.scheme} · {stanza.rhyme.text}
                        {!stanza.inDominant && ' · вне основной группы'}
                      </div>
                    </div>
                  ))}

                  <div className="scheme__row scheme__row--code">
                    <span className="scheme__count" />
                    <span className="scheme__cells">
                      {(s.triCod || '').split('').map((ch, i) => (
                        <span key={i} className="cell cell--code">{ch}</span>
                      ))}
                    </span>
                  </div>

                  <div className="scheme__legend">
                    <span className="legend-bar legend-bar--light">
                      0-безударные гласные: {shown.light} шт.
                    </span>
                    <span className="legend-bar legend-bar--weak">
                      1-слабоударные гласные: {shown.weak} шт.
                    </span>
                    <span className="legend-bar legend-bar--strong">
                      2-ударные гласные: {shown.strong} шт.
                    </span>
                    {shown.err > 0 && (
                      <span className="legend-bar legend-bar--err">
                        сбой ритма: {shown.err} шт.
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {mode === 'tonic' && (
              <div className="tonic">
                <div className={`tonic__verdict${tonic.ok ? ' is-ok' : ' is-bad'}`}>
                  {tonic.ok
                    ? `Соответствует тонической системе: ${tonic.stressPositions}-ударный ритм`
                    : 'Ритм не соответствует тонической системе'}
                </div>

                <div className="tonic__info">
                  <b>Опорное число ударений в строке:</b> {tonic.stresses}
                  {tonic.excluded > 0 && ` · исключено строк: ${tonic.excluded}`}
                </div>

                {tonic.pattern.length > 0 && (
                  <div className="tonic__pattern">
                    {tonic.pattern.map((v, i) => (
                      <span key={i} className={`cell cell--code ${v === 2 ? 'c-2' : 'c-0'}`}>{v}</span>
                    ))}
                  </div>
                )}

                {tonic.errors.length > 0 && (
                  <ul className="tonic__errors">
                    {tonic.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                )}
              </div>
            )}

            <ProsodyDebug
              columns={debugColumns}
              lineCount={s.profileLineCount || s.lineCount || 0}
              scope={scope}
              onScopeChange={setScope}
              build={buildShort}
            />
          </div>
        </div>

        <div className="prosody__foot">
          <span><i className="dot d-light" /> безударный столбец</span>
          <span><i className="dot d-weak" /> смешанный</span>
          <span><i className="dot d-strong" /> ударный</span>
          <span><i className="dot d-err" /> сбой ритма</span>
          <span><i className="dot d-actual" /> фактическое ударение в строке</span>
          <span className="prosody__foot-tail">
            {textHasAccents ? 'ударения размечены' : 'ударения не размечены'}
          </span>
        </div>
      </aside>
    </div>
  );
}