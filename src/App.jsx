import { useEffect, useMemo, useState } from 'react';
import StockModal from './components/StockModal.jsx';
import SaleView from './views/SaleView.jsx';
import ProductsView from './views/ProductsView.jsx';
import InventoryView from './views/InventoryView.jsx';
import HistoryView from './views/HistoryView.jsx';
import { LangContext, makeI18n } from './i18n.js';
import { SEED, load, save } from './utils.js';

const TABS = ['sale', 'products', 'inventory', 'history'];
const LANGS = [
  ['ceb', 'Bisaya'],
  ['en', 'English'],
];

export default function App() {
  // Tanang datos gitipigan sa localStorage sa browser.
  const [products, setProducts] = useState(() => load('pos.products', SEED));
  const [sales, setSales] = useState(() => load('pos.sales', []));
  const [moves, setMoves] = useState(() => load('pos.moves', []));
  const [lang, setLang] = useState(() => load('pos.lang', 'ceb'));

  // Ang cart magpabilin bisan mo-lahi og tab.
  const [tab, setTab] = useState('sale');
  const [cart, setCart] = useState([]);
  const [disc, setDisc] = useState(0);
  const [stockEdit, setStockEdit] = useState(null);

  useEffect(() => save('pos.products', products), [products]);
  useEffect(() => save('pos.sales', sales), [sales]);
  useEffect(() => save('pos.moves', moves), [moves]);
  useEffect(() => {
    save('pos.lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'ceb';
  }, [lang]);

  const i18n = useMemo(() => makeI18n(lang, setLang), [lang]);
  const { t } = i18n;

  const nextNo = (sales.length ? Math.max(...sales.map((s) => s.no)) : 0) + 1;

  // Human sa bayad: i-save ang sale, ibawas ang stock, ug i-log ang lihok.
  const completeSale = (sale, lines) => {
    setSales((s) => [sale, ...s]);
    setProducts((ps) =>
      ps.map((p) => {
        const l = lines.find((x) => x.id === p.id);
        return l ? { ...p, stock: p.stock - l.qty } : p;
      })
    );
    setMoves((m) =>
      [
        ...lines.map((l) => ({
          id: Date.now() + l.id,
          date: sale.date,
          pid: l.id,
          name: l.name,
          type: 'sale',
          qty: -l.qty,
          after: l.stock - l.qty,
          sale: sale.no,
        })),
        ...m,
      ].slice(0, 200)
    );
  };

  const applyStock = (p, mode, value, note) => {
    const after = mode === 'receive' ? p.stock + value : value;
    setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, stock: after } : x)));
    setMoves((m) =>
      [
        {
          id: Date.now(),
          date: new Date().toISOString(),
          pid: p.id,
          name: p.name,
          type: mode,
          qty: after - p.stock,
          after,
          note,
        },
        ...m,
      ].slice(0, 200)
    );
    setStockEdit(null);
  };

  const saveProduct = (p) =>
    setProducts((ps) =>
      p.id ? ps.map((x) => (x.id === p.id ? p : x)) : [...ps, { ...p, id: Date.now() }]
    );

  const removeProduct = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setCart((c) => c.filter((i) => i.id !== id));
  };

  const openStock = (p, mode) => setStockEdit({ p, mode });

  return (
    <LangContext.Provider value={i18n}>
      <div className="app">
        <header className="top">
          <h1 className="brand">{t('brand')}</h1>
          <div className="top-right">
            <nav className="tabs" aria-label={t('navLabel')}>
              {TABS.map((key) => (
                <button
                  key={key}
                  className="tab"
                  aria-current={tab === key ? 'page' : undefined}
                  onClick={() => setTab(key)}
                >
                  {t('tab.' + key)}
                </button>
              ))}
            </nav>
            <div className="lang" role="group" aria-label={t('language')}>
              {LANGS.map(([code, label]) => (
                <button
                  key={code}
                  className="chip"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {tab === 'sale' && (
          <SaleView
            products={products}
            cart={cart}
            setCart={setCart}
            disc={disc}
            setDisc={setDisc}
            nextNo={nextNo}
            onComplete={completeSale}
          />
        )}
        {tab === 'products' && (
          <ProductsView
            products={products}
            onSave={saveProduct}
            onRemove={removeProduct}
            onStock={openStock}
          />
        )}
        {tab === 'inventory' && (
          <InventoryView products={products} moves={moves} onStock={openStock} />
        )}
        {tab === 'history' && <HistoryView sales={sales} onClear={() => setSales([])} />}

        {stockEdit && (
          <StockModal
            p={stockEdit.p}
            mode={stockEdit.mode}
            onSave={applyStock}
            onClose={() => setStockEdit(null)}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}
