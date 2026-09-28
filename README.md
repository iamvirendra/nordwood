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
- `src/data/suppliedImages.json` contains the imported category/material image registry; `docs/IMAGE_MAPPING.md` records the mapping and source coverage.
- `public/images/nordwood-logo.png` is the supplied wood-disc logo. `public/images/nordwood-wordmark-hd.png` replaces typed standalone wordmarks in the shared header and footer. Shared metadata lives in `src/data/brand.js`; `BrandWordmark` preserves the original PNG and sizes its visible lettering responsively. The wood-disc also remains in the homepage brand slide, favicon, touch icon and contact-team avatars.

## Catalog flow

Customers first choose an application, then a wood type, then a product family. Product detail pages expose the standard size options and show the matching price when it is available.

## Checks

```bash
npm run lint
npm run check:images
npm run build
npm run check:seo
```

## Sitemap

The generated [public/sitemap.xml](public/sitemap.xml) contains the homepage, shop, contact page, journal, all article URLs and the 14 product-family destinations linked from the catalogue. It currently has 34 URLs. Size variants remain available on those product pages; the cart, duplicate `/about` homepage alias, query filters and anchors are omitted.

`npm run sitemap` refreshes this file and [public/robots.txt](public/robots.txt). It also runs automatically before `npm run dev` and `npm run build`; Vite copies the files into `dist` for deployment. Use `http://localhost:5173/sitemap.xml` to inspect it locally. The production destination is `https://www.nordwood.in/sitemap.xml` after deployment.

URLs share the site's `VITE_SITE_URL` configuration (default `https://www.nordwood.in`). Set it consistently for builds and SEO checks if the live domain changes. Sitemap generation uses real catalogue and article data and does not invent modification dates. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The storefront uses React, React Router, Vite, and CSS. Cart contents persist in `localStorage`; checkout and form submission still require a backend integration.
