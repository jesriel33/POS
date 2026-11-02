import { useState } from 'react';
import { useI18n } from '../i18n.js';
import { fmtDate, pad, peso } from '../utils.js';

export default function HistoryView({ sales, onClear }) {
  const { t, pname } = useI18n();
  const [openSale, setOpenSale] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const today = new Date().toDateString();
  const todays = sales.filter((s) => new Date(s.date).toDateString() === today);
  const todayTotal = todays.reduce((s, x) => s + x.total, 0);
  const todayItems = todays.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <section aria-label={t('histAria')} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="stats">
        <div className="panel">
          <div className="stat-label">{t('todaySales')}</div>
          <div className="stat-val num">{peso(todayTotal)}</div>
        </div>
        <div className="panel">
          <div className="stat-label">{t('todayTx')}</div>
          <div className="stat-val num">{todays.length}</div>
        </div>
        <div className="panel">
          <div className="stat-label">{t('todayItems')}</div>
          <div className="stat-val num">{todayItems}</div>
        </div>
      </div>

      <div className="panel">
        <div className="bar">
          <h2 className="h2" style={{ margin: 0 }}>
            {t('allTx', { n: sales.length })}
          </h2>
          {sales.length > 0 &&
            (confirmClear ? (
              <div className="actions">
                <span className="line-sub" style={{ alignSelf: 'center' }}>
                  {t('confirmClearHist')}
                </span>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                    setOpenSale(null);
                  }}
                >
                  {t('yesDelete')}
                </button>
                <button className="btn" onClick={() => setConfirmClear(false)}>
                  {t('no')}
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setConfirmClear(true)}>
                {t('clearHist')}
              </button>
            ))}
        </div>

        {sales.length === 0 ? (
          <p className="empty">{t('histEmpty')}</p>
        ) : (
          <div>
            {sales.map((s) => (
              <div key={s.no}>
                <button
                  className="sale-row"
                  aria-expanded={openSale === s.no}
                  onClick={() => setOpenSale(openSale === s.no ? null : s.no)}
                >
                  <span>
                    <strong>#{pad(s.no)}</strong> <span className="line-sub">{s.method}</span>
                  </span>
                  <strong className="num">{peso(s.total)}</strong>
                  <span className="line-sub">{fmtDate(s.date)}</span>
                  <span className="line-sub" style={{ textAlign: 'right' }}>
                    {t('nItems', { n: s.items.reduce((a, i) => a + i.qty, 0) })}
                  </span>
                </button>
                {openSale === s.no && (
                  <div className="sale-items num">
                    {s.items.map((it, i) => (
                      <div key={i}>
                        <span>
                          {it.qty} x {pname(it)}
                        </span>
                        <span>{peso(it.price * it.qty)}</span>
                      </div>
                    ))}
                    {s.disc > 0 && (
                      <div>
                        <span>{t('discountN', { n: s.disc })}</span>
                        <span>-{peso(s.discAmt)}</span>
                      </div>
                    )}
                    <div>
                      <span>{t('change')}</span>
                      <span>{peso(s.change)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="line-sub">{t('storageNote')}</p>
    </section>
  );
}
