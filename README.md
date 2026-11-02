# Tindahan POS

Simple nga POS system para sa tindahan, gihimo gamit ang React + Vite.

## Features

- **Pagbaligya:** pilia ang produkto, cart, discount (naa ang Senior/PWD 20%), Cash o GCash, sukli, ug resibo
- **Mga produkto:** dugang, edit, papasa, ug presyo/puhunan/alerto sa stock
- **Inventory:** stock count, hapit mahurot nga alerto, dawat og stock, ayo ihap, ug log sa lihok sa stock
- **Kasaysayan:** baligya karong adlawa ug detalye sa matag transaksyon
- **Pinulongan:** Bisaya ug English, usbon sa buton sa ibabaw sa tuo (gitipigan ang pilian)

## Unsaon pagdagan

Kinahanglan ang [Node.js](https://nodejs.org) (version 18 o mas bag-o).

```bash
npm install
npm run dev
```

Ablihi ang link nga mogawas sa terminal (kasagaran `http://localhost:5173`).

## Unsaon pag-deploy

```bash
npm run build
```

Ang `dist` folder mao ang i-upload sa Netlify, Vercel, o Cloudflare Pages.

## Estruktura

```
src/
  main.jsx            entry point
  App.jsx             state (products, sales, moves, cart) ug tabs
  utils.js            constants, peso format, localStorage helpers
  i18n.js             tanang text sa Bisaya ug English (idugang diri ang bag-ong pinulongan)
  styles.css          tanang styles (light ug dark)
  views/
    SaleView.jsx      produkto + cart + bayad
    ProductsView.jsx  lista ug edit sa produkto
    InventoryView.jsx stock, alerto, ug log
    HistoryView.jsx   kasaysayan sa baligya
  components/
    Modal.jsx  PayModal.jsx  Receipt.jsx  Editor.jsx  StockModal.jsx
```

## Importante nga hibaw-an

Ang datos (produkto, baligya, stock) gitipigan sa `localStorage`, busa sa browser sa
usa ka device lamang. Kung mapas-an ang browser data, mawala kini. Para sa daghang
cashier o backup, kinahanglan og backend/database (pananglitan Supabase o Firebase).
