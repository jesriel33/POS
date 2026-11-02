import { useMemo, useState } from 'react';
import PayModal from '../components/PayModal.jsx';
import Receipt from '../components/Receipt.jsx';
import { useI18n } from '../i18n.js';
import { CATS, DISCOUNTS, isLow, peso, pesoShort } from '../utils.js';

export default function SaleView({ products, cart, setCart, disc, setDisc, nextNo, onComplete }) {
  const { t, catLabel, pname } = useI18n();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const lines = cart.map((c) => (byId[c.id] ? { ...byId[c.id], qty: c.qty } : null)).filter(Boolean);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discAmt = Math.round(subtotal * disc) / 100;
  const total = subtotal - discAmt;
  const inCart = (id) => (cart.find((c) => c.id === id) || {}).qty || 0;

  const add = (p) =>
    setCart((c) => {
      const x = c.find((i) => i.id === p.id);
      if (x) return x.qty >= p.stock ? c : c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return p.stock > 0 ? [...c, { id: p.id, qty: 1 }] : c;
    });

  const setQty = (id, q) =>
    setCart((c) =>
      q <= 0
        ? c.filter((i) => i.id !== id)
        : c.map((i) => (i.id === id ? { ...i, qty: Math.min(q, byId[id].stock) } : i))
    );

  const complete = (method, tendered) => {
    const sale = {
      no: nextNo,
      date: new Date().toISOString(),
      items: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })),
      subtotal,
      disc,
      discAmt,
      total,
      method,
      tendered,
      change: Math.max(0, tendered - total),
    };
    onComplete(sale, lines);
    setCart([]);
    setDisc(0);
    setPaying(false);
    setReceipt(sale);
  };

  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (cat === 'all' || p.cat === cat) &&
      (p.name.toLowerCase().includes(q) || pname(p).toLowerCase().includes(q))
  );

  const goCart = () => {
    const el = document.getElementById('cart');
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (el) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="sale">
        <section aria-label={t('products')}>
          <div className="tools">
            <input
              className="search"
              type="search"
              aria-label={t('searchProducts')}
              placeholder={t('searchProducts')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="chips">
              {['all', ...CATS].map((c) => (
                <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
                  {c === 'all' ? t('all') : catLabel(c)}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="empty">{t('noProductsFound')}</p>
          ) : (
            <div className="grid">
              {visible.map((p) => {
                const inC = inCart(p.id);
                return (
                  <button
                    key={p.id}
                    className="prod"
                    disabled={p.stock <= 0 || inC >= p.stock}
                    onClick={() => add(p)}
                    aria-label={pname(p) + ', ' + pesoShort(p.price)}
                  >
                    {inC > 0 && <span className="badge num">{inC}</span>}
                    <span className="prod-name">{pname(p)}</span>
                    <span>
                      <span className="prod-price num">{pesoShort(p.price)}</span>
                      <br />
                      <span className={'prod-meta' + (isLow(p) ? ' low' : '')}>
                        {p.stock <= 0 ? t('outOfStock') : t('nLeft', { n: p.stock })}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className="cart panel" id="cart" aria-label="Cart">
          <h2>{t('currentSale')}</h2>
          {lines.length === 0 ? (
            <p className="empty">{t('cartEmpty')}</p>
          ) : (
            <>
              <div className="lines">
                {lines.map((l) => (
                  <div className="line" key={l.id}>
                    <div>
                      <div className="line-name">{pname(l)}</div>
                      <div className="line-sub num">{t('each', { price: peso(l.price) })}</div>
                    </div>
                    <div className="line-total num">{peso(l.price * l.qty)}</div>
                    <button className="link" onClick={() => setQty(l.id, 0)}>
                      {t('remove')}
                    </button>
                    <div className="stepper">
                      <button
                        aria-label={t('decrease', { name: pname(l) })}
                        onClick={() => setQty(l.id, l.qty - 1)}
                      >
                        −
                      </button>
                      <span className="num">{l.qty}</span>
                      <button
                        aria-label={t('increase', { name: pname(l) })}
                        disabled={l.qty >= l.stock}
                        onClick={() => setQty(l.id, l.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="disc" role="group" aria-label={t('discount')}>
                {DISCOUNTS.map(([v, key]) => (
                  <button key={v} className="chip" aria-pressed={disc === v} onClick={() => setDisc(v)}>
                    {t(key)}
                  </button>
                ))}
              </div>

              <div className="sum">
                <div className="row muted">
                  <span>{t('subtotalN', { n: itemCount })}</span>
                  <span className="num">{peso(subtotal)}</span>
                </div>
                {disc > 0 && (
                  <div className="row muted">
                    <span>{t('discountN', { n: disc })}</span>
                    <span className="num">-{peso(discAmt)}</span>
                  </div>
                )}
                <div className="row total-row">
                  <span>{t('total')}</span>
                  <span className="total num">{peso(total)}</span>
                </div>
              </div>

              <button className="btn btn-primary btn-block" onClick={() => setPaying(true)}>
                {t('pay')}
              </button>
              <div style={{ textAlign: 'center', marginTop: 6 }}>
                <button
                  className="link"
                  onClick={() => {
                    setCart([]);
                    setDisc(0);
                  }}
                >
                  {t('clearCart')}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {lines.length > 0 && (
        <div className="mbar">
          <div>
            <div className="line-sub">{t('nItems', { n: itemCount })}</div>
            <div className="total num" style={{ fontSize: 24 }}>
              {peso(total)}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={goCart}>
              {t('viewCart')}
            </button>
            <button className="btn btn-primary" onClick={() => setPaying(true)}>
              {t('pay')}
            </button>
          </div>
        </div>
      )}

      {paying && <PayModal total={total} onConfirm={complete} onClose={() => setPaying(false)} />}
      {receipt && <Receipt sale={receipt} onClose={() => setReceipt(null)} />}
    </>
  );
}
