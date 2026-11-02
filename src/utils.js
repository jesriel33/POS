export const CATS = ['Mga Gamit sa Pagsulat', 'Mga Papel', 'Mga Sudlanan ug Tig-organisar sa Dokumento', 'Mga Gamit sa Arte ug Paghimo og mga Art', 'Mga Gamit sa Pagsukod ug Matematika', 'Mga Bag ug Kagamitan sa Eskwelahan', 'Mga Gamit sa Klase ug Opisina', 'Mga Gamit sa Teknolohiya', 'Mga Gamit sa Panglimpyo ug Panglawas'];

// Mga pananglitan nga produkto. Usba sa Mga produkto nga tab.
export const SEED = [
  { id: 1, name: 'Pandesal (5 ka piraso)', cat: 'Pagkaon', price: 15, stock: 40 },
  { id: 2, name: 'Kape 3-in-1', cat: 'Ilimnon', price: 8, stock: 60 },
  { id: 3, name: 'Pancit Canton', cat: 'Pagkaon', price: 18, stock: 36 },
  { id: 4, name: 'Itlog', cat: 'Pagkaon', price: 11, stock: 48 },
  { id: 5, name: 'Sardinas 155g', cat: 'Pagkaon', price: 28, stock: 24 },
  { id: 6, name: 'Bugas 1kg', cat: 'Pagkaon', price: 58, stock: 30 },
  { id: 7, name: 'Coke Mismo', cat: 'Ilimnon', price: 20, stock: 30 },
  { id: 8, name: 'Tubig 500ml', cat: 'Ilimnon', price: 15, stock: 50 },
  { id: 9, name: 'Zesto Juice', cat: 'Ilimnon', price: 12, stock: 4 },
  { id: 10, name: 'Sabon sa Panaba', cat: 'Panimalay', price: 22, stock: 20 },
  { id: 11, name: 'Mantika (sachet)', cat: 'Panimalay', price: 14, stock: 25 },
  { id: 12, name: 'Asukar 1/4kg', cat: 'Pagkaon', price: 24, stock: 0 },
];

// [percent, translation key]
export const DISCOUNTS = [
  [0, 'disc.0'],
  [5, 'disc.5'],
  [10, 'disc.10'],
  [20, 'disc.20'],
];

// Mga filter sa Inventory (ang label naa sa i18n: 'filter.<id>')
export const INV_FILTERS = ['all', 'low', 'out'];

// localStorage helpers (dili mo-crash kung gi-block ang storage)
export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
};

export const peso = (n) =>
  '₱' +
  Number(n || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const pesoShort = (n) =>
  Number.isInteger(n) ? '₱' + n.toLocaleString('en-PH') : peso(n);

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });

export const pad = (n) => String(n).padStart(4, '0');

// Hapit mahurot: naa pa'y stock pero naa na sa alerto nga numero (default 5)
export const isLow = (p) => p.stock > 0 && p.stock <= (p.reorder ?? 5);
