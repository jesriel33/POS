import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import { useI18n } from '../i18n.js';
import { peso, pesoShort } from '../utils.js';

export default function PayModal({ total, onConfirm, onClose }) {
  const { t } = useI18n();
  const [method, setMethod] = useState('Cash');
  const [cash, setCash] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (method === 'Cash' && inputRef.current) inputRef.current.focus();
  }, [method]);

  const tendered = method === 'Cash' ? parseFloat(cash) || 0 : total;
  const ok = total > 0 && tendered >= total - 0.0001;
  const change = Math.max(0, tendered - total);
  const quick = [50, 100, 200, 500, 1000].filter((v) => v >= total).slice(0, 4);

  const submit = (e) => {
    e.preventDefault();
    if (ok) onConfirm(method, tendered);
  };

  return (
    <Modal onClose={onClose} label={t('pay')}>
      <form onSubmit={submit}>
        <h2 className="h2">{t('pay')}</h2>
        <div className="row" style={{ alignItems: 'baseline', marginBottom: 12 }}>
          <span className="line-sub">{t('amountDue')}</span>
          <span className="total num">{peso(total)}</span>
        </div>

        <div className="chips" style={{ marginBottom: 12 }}>
          {['Cash', 'GCash'].map((m) => (
            <button
              type="button"
              key={m}
              className="chip"
              aria-pressed={method === m}
              onClick={() => setMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {method === 'Cash' ? (
          <>
            <div className="field">
              <label htmlFor="cash">{t('cashReceived')}</label>
              <input
                id="cash"
                ref={inputRef}
                className="big-input num"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="quick">
              <button type="button" className="chip" onClick={() => setCash(String(total))}>
                {t('exact')}
              </button>
              {quick.map((v) => (
                <button
                  type="button"
                  key={v}
                  className="chip num"
                  onClick={() => setCash(String(v))}
                >
                  {pesoShort(v)}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="line-sub" style={{ marginTop: 0 }}>
            {t('gcashNote')}
          </p>
        )}

        <div className="change">
          <span>{t('change')}</span>
          <strong className="num">{peso(change)}</strong>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            {t('cancel')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={!ok}>
            {t('completeSale')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
