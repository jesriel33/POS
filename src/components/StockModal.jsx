import { useState } from 'react';
import Modal from './Modal.jsx';
import { useI18n } from '../i18n.js';

// mode: 'receive' (dugang gikan sa delivery) o 'count' (ayo sa tinuod nga ihap)
export default function StockModal({ p, mode, onSave, onClose }) {
  const { t, pname } = useI18n();
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');

  const receive = mode === 'receive';
  const n = parseInt(value, 10);
  const after = isNaN(n) ? p.stock : receive ? p.stock + n : n;

  const submit = (e) => {
    e.preventDefault();
    if (receive) {
      if (!(n > 0)) return setErr(t('errReceive'));
      onSave(p, 'receive', n, note.trim());
    } else {
      if (!(n >= 0)) return setErr(t('errCount'));
      onSave(p, 'count', n, note.trim());
    }
  };

  return (
    <Modal onClose={onClose} label={receive ? t('receiveStock') : t('adjustCount')}>
      <form onSubmit={submit}>
        <h2 className="h2">{receive ? t('receiveStock') : t('adjustTitle')}</h2>
        <p className="hint">
          <strong>{pname(p)}</strong>
        </p>

        <div className="field">
          <label htmlFor="sqty">{receive ? t('qtyAdded') : t('qtyActual')}</label>
          <input
            id="sqty"
            className="big-input num"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="0"
            autoFocus
          />
        </div>

        <div className="field">
          <label htmlFor="snote">{t('note')}</label>
          <input
            id="snote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={receive ? t('notePhReceive') : t('notePhCount')}
          />
        </div>

        <div className="preview">
          <span>{t('nowAfter', { n: p.stock })}</span>
          <strong className="num">{after}</strong>
        </div>

        {err && (
          <p className="err" role="alert">
            {err}
          </p>
        )}
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            {t('cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
