import { useState } from 'react';
import Modal from './Modal.jsx';
import { useI18n } from '../i18n.js';
import { CATS } from '../utils.js';

// Pang-add ug pang-edit sa produkto. Kung walay item.id, bag-o nga produkto.
export default function Editor({ item, onSave, onClose }) {
  const { t, catLabel, pname } = useI18n();
  const [f, setF] = useState({
    name: item.id ? pname(item) : '',
    cat: item.cat || CATS[0],
    price: item.price ?? '',
    stock: item.stock ?? '',
    cost: item.cost ?? '',
    reorder: item.reorder ?? 5,
  });
  const [err, setErr] = useState('');
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const price = parseFloat(f.price);
    const stock = parseInt(f.stock, 10);
    if (!f.name.trim()) return setErr(t('errName'));
    if (!(price >= 0)) return setErr(t('errPrice'));
    if (!(stock >= 0)) return setErr(t('errStock'));
    const cost = f.cost === '' ? null : parseFloat(f.cost);
    const reorder = parseInt(f.reorder, 10);
    if (cost !== null && !(cost >= 0)) return setErr(t('errCost'));
    if (!(reorder >= 0)) return setErr(t('errReorder'));
    // Kung wala giusab ang ngalan nga gipakita, ibilin ang orihinal (aron ma-translate gihapon).
    const name = f.name.trim() === pname(item) ? item.name : f.name.trim();
    onSave({ ...item, name, cat: f.cat, price, stock, cost, reorder });
  };

  return (
    <Modal onClose={onClose} label={t('products')}>
      <form onSubmit={submit}>
        <h2 className="h2">{item.id ? t('editProduct') : t('addProduct')}</h2>

        <div className="field">
          <label htmlFor="pname">{t('fName')}</label>
          <input id="pname" value={f.name} onChange={set('name')} autoFocus />
        </div>

        <div className="field">
          <label htmlFor="pcat">{t('fCategory')}</label>
          <select id="pcat" value={f.cat} onChange={set('cat')}>
            {CATS.map((c) => (
              <option key={c} value={c}>
                {catLabel(c)}
              </option>
            ))}
          </select>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="pprice">{t('fPrice')}</label>
            <input
              id="pprice"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={f.price}
              onChange={set('price')}
            />
          </div>
          <div className="field">
            <label htmlFor="pstock">{t('fStock')}</label>
            <input
              id="pstock"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={f.stock}
              onChange={set('stock')}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="pcost">{t('fCost')}</label>
            <input
              id="pcost"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={f.cost}
              onChange={set('cost')}
              placeholder={t('optional')}
            />
          </div>
          <div className="field">
            <label htmlFor="preorder">{t('fReorder')}</label>
            <input
              id="preorder"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={f.reorder}
              onChange={set('reorder')}
            />
          </div>
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
