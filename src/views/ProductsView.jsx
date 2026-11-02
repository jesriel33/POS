import { useState } from 'react';
import Editor from '../components/Editor.jsx';
import { useI18n } from '../i18n.js';
import { isLow, peso } from '../utils.js';

export default function ProductsView({ products, onSave, onRemove, onStock }) {
  const { t, catLabel, pname } = useI18n();
  const [pq, setPq] = useState('');
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const q = pq.trim().toLowerCase();
  const listed = products.filter(
    (p) => p.name.toLowerCase().includes(q) || pname(p).toLowerCase().includes(q)
  );

  return (
    <section className="panel" aria-label={t('products')}>
      <div className="bar">
        <h2 className="h2" style={{ margin: 0 }}>
          {t('productsN', { n: products.length })}
        </h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            className="search"
            type="search"
            aria-label={t('searchProducts')}
            placeholder={t('searchProducts')}
            value={pq}
            onChange={(e) => setPq(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            {t('addProduct')}
          </button>
        </div>
      </div>
      <p className="line-sub" style={{ marginTop: 0 }}>
        {t('sampleNote')}
      </p>

      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>{t('colName')}</th>
              <th>{t('colCategory')}</th>
              <th className="r">{t('colPrice')}</th>
              <th className="r">{t('colStock')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listed.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{pname(p)}</td>
                <td>{catLabel(p.cat)}</td>
                <td className="r num">{peso(p.price)}</td>
                <td className="r num">
                  {p.stock}{' '}
                  {p.stock <= 0 ? (
                    <span className="pill out">{t('pillOut')}</span>
                  ) : isLow(p) ? (
                    <span className="pill low">{t('pillLow')}</span>
                  ) : null}
                </td>
                <td>
                  <div className="actions">
                    {confirmDel === p.id ? (
                      <>
                        <span className="line-sub" style={{ alignSelf: 'center' }}>
                          {t('confirmDelete')}
                        </span>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            onRemove(p.id);
                            setConfirmDel(null);
                          }}
                        >
                          {t('yesDelete')}
                        </button>
                        <button className="btn" onClick={() => setConfirmDel(null)}>
                          {t('no')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => onStock(p, 'receive')}>
                          {t('addStock')}
                        </button>
                        <button className="btn" onClick={() => setEditing(p)}>
                          {t('edit')}
                        </button>
                        <button className="btn btn-danger" onClick={() => setConfirmDel(p.id)}>
                          {t('delete')}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {listed.length === 0 && <p className="empty">{t('noProductsShort')}</p>}

      {editing && (
        <Editor
          item={editing}
          onSave={(p) => {
            onSave(p);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
