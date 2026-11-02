import { useState } from 'react';
import { useI18n } from '../i18n.js';
import { INV_FILTERS, fmtDate, isLow, peso } from '../utils.js';

// Ang tipo sa lihok sa stock. Ang daan nga datos naggamit og Bisaya nga ngalan.
const LEGACY_TYPE = { Baligya: 'sale', Dawat: 'receive', 'Ayo ihap': 'count' };

export default function InventoryView({ products, moves, onStock }) {
  const { t, catLabel, pname } = useI18n();
  const [filter, setFilter] = useState('all');

  const list = products.filter(
    (p) => filter === 'all' || (filter === 'low' && isLow(p)) || (filter === 'out' && p.stock <= 0)
  );
  const units = products.reduce((s, p) => s + p.stock, 0);
  const stockValue = products.reduce((s, p) => s + (p.cost || 0) * p.stock, 0);
  const lowCount = products.filter(isLow).length;
  const outCount = products.filter((p) => p.stock <= 0).length;

  const typeLabel = (type) => {
    const id = LEGACY_TYPE[type] || type;
    return ['sale', 'receive', 'count'].includes(id) ? t('mv.' + id) : type;
  };

  return (
    <section aria-label="Inventory" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="stats">
        <div className="panel">
          <div className="stat-label">{t('invUnits')}</div>
          <div className="stat-val num">{units}</div>
        </div>
        <div className="panel">
          <div className="stat-label">{t('invValue')}</div>
          <div className="stat-val num">{peso(stockValue)}</div>
        </div>
        <div className="panel">
          <div className="stat-label">{t('invLow')}</div>
          <div className="stat-val num">{lowCount}</div>
        </div>
        <div className="panel">
          <div className="stat-label">{t('invOut')}</div>
          <div className="stat-val num">{outCount}</div>
        </div>
      </div>

      <div className="panel">
        <div className="bar">
          <h2 className="h2" style={{ margin: 0 }}>
            {t('invByProduct')}
          </h2>
          <div className="chips">
            {INV_FILTERS.map((f) => (
              <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {t('filter.' + f)}
              </button>
            ))}
          </div>
        </div>
        <p className="hint">{t('invHint')}</p>

        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>{t('colName')}</th>
                <th className="r">{t('colStock')}</th>
                <th className="r">{t('colReorder')}</th>
                <th className="r">{t('colCost')}</th>
                <th className="r">{t('colValue')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{pname(p)}</span>
                    <br />
                    <span className="line-sub">{catLabel(p.cat)}</span>
                  </td>
                  <td className="r num">
                    {p.stock}{' '}
                    {p.stock <= 0 ? (
                      <span className="pill out">{t('pillInvOut')}</span>
                    ) : isLow(p) ? (
                      <span className="pill low">{t('pillInvLow')}</span>
                    ) : (
                      <span className="pill ok">{t('pillOk')}</span>
                    )}
                  </td>
                  <td className="r num">{p.reorder ?? 5}</td>
                  <td className="r num">{p.cost != null ? peso(p.cost) : '—'}</td>
                  <td className="r num">{p.cost != null ? peso(p.cost * p.stock) : '—'}</td>
                  <td>
                    <div className="actions">
                      <button className="btn" onClick={() => onStock(p, 'receive')}>
                        {t('receiveStock')}
                      </button>
                      <button className="btn" onClick={() => onStock(p, 'count')}>
                        {t('adjustCount')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && (
          <p className="empty">{filter === 'all' ? t('invEmptyAll') : t('invEmptyFilter')}</p>
        )}
      </div>

      <div className="panel">
        <h2 className="h2">{t('movesTitle')}</h2>
        {moves.length === 0 ? (
          <p className="empty">{t('movesEmpty')}</p>
        ) : (
          <div>
            {moves.slice(0, 20).map((m) => (
              <div className="mv" key={m.id + '-' + m.pid}>
                <span>
                  <strong>{pname({ id: m.pid, name: m.name })}</strong>{' '}
                  <span className="line-sub">
                    {typeLabel(m.type)}
                    {m.sale ? ' • ' + t('receiptNo', { n: String(m.sale).padStart(4, '0') }) : ''}
                    {m.note ? ' • ' + m.note : ''}
                  </span>
                </span>
                <span className={'num ' + (m.qty >= 0 ? 'in' : 'out')}>
                  {m.qty > 0 ? '+' : ''}
                  {m.qty}
                </span>
                <span className="line-sub">{fmtDate(m.date)}</span>
                <span className="line-sub num" style={{ textAlign: 'right' }}>
                  {t('onHand', { n: m.after })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
