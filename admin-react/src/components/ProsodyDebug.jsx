import { useMemo, useState } from 'react';
import './ProsodyDebug.css';

const TYPE_CODE = { 1: 0, 2: 1, 3: 2 };
const TYPE_LABEL = { 1: 'безударный', 2: 'смешанный', 3: 'ударный' };

export default function ProsodyDebug({
  columns = [],
  lineCount = 0,
  scope = 'poem',
  onScopeChange,
  build = '',
}) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(null);

  const list = Array.isArray(columns) ? columns : [];

  const tally = useMemo(() => {
    const acc = { strong: 0, weak: 0, light: 0, err: 0 };
    list.forEach((c) => {
      if (c.error) acc.err += 1;
      if (c.type === 3) acc.strong += 1;
      else if (c.type === 2) acc.weak += 1;
      else acc.light += 1;
    });
    return acc;
  }, [list]);

  const activeCol = active !== null ? list.find((c) => c.index === active) : null;

  return (
    <section className="pdebug">
      <div className="pdebug__bar">
        <button
          type="button"
          className="pdebug__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="pdebug__chev">{open ? '▾' : '▸'}</span>
          <span className="pdebug__name">Диагностика столбцов</span>
        </button>

        <span className="pdebug__meta">
          {list.length} столбцов · {lineCount} строк
        </span>

        {build && <span className="pdebug__build">{build}</span>}

        <div className="pdebug__scope">
          <button
            type="button"
            className={scope === 'poem' ? 'is-active' : ''}
            onClick={() => onScopeChange?.('poem')}
            title="Профиль по всем строкам — как итоговый фрагмент в оригинале"
          >
            Весь стих
          </button>
          <button
            type="button"
            className={scope === 'group' ? 'is-active' : ''}
            onClick={() => onScopeChange?.('group')}
            title="Профиль только по строфам самого частого размера"
          >
            Группа
          </button>
        </div>
      </div>

      {open && (
        <div className="pdebug__body">
          <div className="pdebug__tally">
            <span className="tally tally--strong"><i />ударных {tally.strong}</span>
            <span className="tally tally--weak"><i />смешанных {tally.weak}</span>
            <span className="tally tally--light"><i />безударных {tally.light}</span>
            {tally.err > 0 && (
              <span className="tally tally--err"><i />сбоев {tally.err}</span>
            )}
          </div>

          {list.length === 0 ? (
            <div className="pdebug__empty">
              Нет данных для разбора. Расставьте ударения кнопкой «Ударения»
              или кликните гласную в схеме выше.
            </div>
          ) : (
            <div className="pdebug__strip">
              {list.map((col) => {
                const total = col.strong + col.weak + col.light;
                return (
                  <button
                    type="button"
                    key={col.index}
                    className={[
                      'dcol',
                      `t-${col.type}`,
                      col.error ? 'is-err' : '',
                      active === col.index ? 'is-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setActive(active === col.index ? null : col.index)}
                    title={col.reason}
                  >
                    <span className="dcol__head">
                      <span className="dcol__num">{col.index}</span>
                      <span className="dcol__code">{TYPE_CODE[col.type]}</span>
                    </span>

                    <span className={`dcol__bar${total === 0 ? ' is-empty' : ''}`}>
                      <i className="seg seg--strong" style={{ flexGrow: col.strong }} />
                      <i className="seg seg--weak" style={{ flexGrow: col.weak }} />
                      <i className="seg seg--light" style={{ flexGrow: col.light }} />
                    </span>

                    <span className="dcol__rows">
                      <span className="dcol__row"><b>О</b>{col.strong}</span>
                      <span className="dcol__row"><b>:</b>{col.weak}</span>
                      <span className="dcol__row"><b>.</b>{col.light}</span>
                    </span>

                    <span className="dcol__real">{col.real} стр</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className={`pdebug__detail${activeCol ? ' is-shown' : ''}`}>
            {activeCol ? (
              <>
                <span className="pdebug__detail-head">
                  слог {activeCol.index} · {TYPE_LABEL[activeCol.type]}
                  {activeCol.error && ' · сбой ритма'}
                </span>
                <span className="pdebug__detail-text">{activeCol.reason}</span>
                <span className="pdebug__detail-math">
                  О {activeCol.strong} · : {activeCol.weak} · . {activeCol.light}
                  {' '}из {activeCol.real} строк
                  {activeCol.real > 0 && (
                    <> · ударных {Math.round((activeCol.strong / activeCol.real) * 100)}%</>
                  )}
                </span>
              </>
            ) : (
              <span className="pdebug__detail-hint">
                Нажмите карточку столбца — покажу, почему он получил этот тип.
              </span>
            )}
          </div>

          <div className="pdebug__rule">
            <b>О</b> — ударные, <b>:</b> — односложные, <b>.</b> — безударные.
            Столбец становится ударным (код <b>2</b>), если ударных больше 80%
            либо если ударны или односложны все строки. Смешанный — код <b>1</b>,
            безударный — код <b>0</b>.
          </div>
        </div>
      )}
    </section>
  );
}