# NordWood

Premium made-to-size woodwork for doors, frames, and windows.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` in a browser.

## Project shape

- `src/pages/` contains the Home, Shop, Product Detail, Cart, and Contact routes.
- `src/components/` contains the shared header, footer, and product card.
- `src/data/products.js` contains the active product catalogue and pricing.
- `src/data/specifications.js` contains wood metadata and standard sizes.
- `src/data/catalog.js` contains the category → wood → product grouping helpers.
- `public/1000687991.svg` is the NordWood logo used in the header and favicon.

## Catalog flow

Customers first choose an application, then a wood type, then a product family. Product detail pages expose the standard size options and show the matching price when it is available.

## Checks

```bash
npm run lint
npm run build
```

The storefront uses React, React Router, Vite, and CSS. Cart contents persist in `localStorage`; checkout and form submission still require a backend integration.
