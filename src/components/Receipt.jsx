import Modal from './Modal.jsx';
import { useI18n } from '../i18n.js';
import { fmtDate, pad, peso } from '../utils.js';

export default function Receipt({ sale, onClose }) {
  const { t, pname } = useI18n();
  return (
    <Modal onClose={onClose} label={t('receipt')}>
      <div className="receipt">
        <h3>{t('brand')}</h3>
        <p className="c">{t('receiptNo', { n: pad(sale.no) })}</p>
        <p className="c">{fmtDate(sale.date)}</p>
        <hr />

        {sale.items.map((it, i) => (
          <div key={i}>
            <div className="row">
              <span>{pname(it)}</span>
              <span>{peso(it.price * it.qty)}</span>
            </div>
            <div className="row muted" style={{ fontSize: 13 }}>
              <span>
                {it.qty} x {peso(it.price)}
              </span>
              <span></span>
            </div>
          </div>
        ))}
        <hr />

        <div className="row">
          <span>{t('subtotal')}</span>
          <span>{peso(sale.subtotal)}</span>
        </div>
        {sale.disc > 0 && (
          <div className="row">
            <span>{t('discountN', { n: sale.disc })}</span>
            <span>-{peso(sale.discAmt)}</span>
          </div>
        )}
        <div className="row grand">
          <span>{t('total')}</span>
          <span>{peso(sale.total)}</span>
        </div>
        <div className="row">
          <span>{sale.method}</span>
          <span>{peso(sale.tendered)}</span>
        </div>
        <div className="row">
          <span>{t('change')}</span>
          <span>{peso(sale.change)}</span>
        </div>
        <hr />
        <p className="c">{t('thanks')}</p>
      </div>

      <div className="modal-actions" style={{ marginTop: 14 }}>
        <button className="btn btn-primary" onClick={onClose}>
          {t('close')}
        </button>
      </div>
    </Modal>
  );
}
