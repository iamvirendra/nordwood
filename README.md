# NordWood

Premium made-to-size woodwork for doors, frames, and windows.

## Run locally

```bash
npm install
npm run setup:local
npm run db:up
npm run dev
```

Requires Node.js 22.12+ and Docker Desktop. Open `http://localhost:5173/` in a browser. `npm run dev` starts both Vite and the API. MariaDB runs on localhost:3310 with a persistent Docker volume; `setup:local` generates random credentials in the ignored `.env` file and never overwrites an existing configuration. The API applies schema migrations at startup.

## Accounts and administration

- `/signup` creates a customer account and signs them in. `/login` supports remembered sessions.
- `/account` shows the customer's orders and password settings.
- The bag leads to `/checkout`, which saves an order request, delivery details and catalogue-priced items in MariaDB. Product subtotals exclude GST/delivery; no online payment is collected. The existing WhatsApp enquiry flow remains available.
- `/admin` is accessible only to administrators. It includes customer/contact details, delivery addresses, product details, search, status filters, pagination and status management.
- Orders progress through pending → confirmed → in production → ready → completed, or may be cancelled before completion. Changes are recorded in an audit table.

Create your administrator with the interactive prompt (password input is hidden):

```bash
npm run admin:create
```

Alternatively, promote an existing registered account:

```bash
npm run admin:create -- --promote your-email@example.com
```

Then sign in again. There is no public role selector or default administrator password. For unattended creation, inject `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` through your secret manager.

Password recovery at `/forgot-password` requires `SMTP_HOST`, `SMTP_FROM` and your provider's SMTP settings in `.env`. Reset links expire after 30 minutes, work once and revoke existing sessions. Without SMTP, the form clearly reports that recovery is unavailable. See [.env.example](.env.example) for configuration.

## Database and deployment

Users, password hashes, sessions, recovery tokens, rate limits, orders, immutable item/price snapshots and status history are stored in MariaDB. Passwords use salted scrypt hashes; session/reset secrets are stored as hashes. HttpOnly cookies, CSRF tokens, origin checks, parameterized queries, transactional checkout and server-side role/ownership checks protect the API. Account tokens are not saved to browser storage.

`npm run db:down` stops the database without deleting its volume. Existing MariaDB servers can be used by changing the `DB_*` variables and creating the configured database/user with schema permissions. `npm run db:migrate` applies the schema explicitly.

For deployment, run `npm run build`, configure `NODE_ENV=production`, `APP_ORIGIN=https://your-domain`, your database and SMTP credentials, then run `npm start` behind an HTTPS reverse proxy. The API serves `dist/` and `/api` from the same origin. Set `TRUST_PROXY_HOPS` only to the exact number of trusted proxy hops (default 0). Production cookies require HTTPS. Keep `.env` private and back up the MariaDB volume. The Vite proxy uses `PORT` (default 3001); `APP_ORIGIN` must match the browser origin.

### Vercel storefront

Deploy the repository root with the Vite preset. [vercel.json](vercel.json) sets the build command to `npm run build`, the output directory to `dist`, and rewrites the client routes (including `/login` and `/signup`) to `/index.html`. This lets React Router handle direct visits and page refreshes. Push this configuration to the deployed branch and deploy that new revision for the fix to take effect. This follows [Vercel's Vite SPA routing guidance](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

The generated `/blog` and article pages retain their own HTML and SEO metadata; static assets and `/api/*` are not rewritten to the app shell. When adding a new client route, add its rewrite unless the build generates HTML for it.

This configuration deploys the storefront only. Account and order features also require the Express API and MariaDB to be hosted, with same-origin `/api/*` requests forwarded to that API. The Vite development proxy does not run on Vercel. Set the API's `APP_ORIGIN` to the deployed storefront origin.

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
npm test
```

Run database-backed integration and real browser checks in dedicated test databases:

```bash
npm run db:test:setup
TEST_DB_NAME=nordwood_test npm run test:server
npx playwright install chromium
npm run test:e2e
```

Integration tests clear only the explicitly named database ending in `_test`; never point them at real customer data. Browser tests start isolated API/Vite servers on ports 3002/5180 and use `nordwood_e2e_test`. `npm test` runs unit/regression tests and skips the database integration suite unless `TEST_DB_NAME` is set.

## Sitemap

The generated [public/sitemap.xml](public/sitemap.xml) contains the homepage, shop, contact page, journal, all article URLs and the 14 product-family destinations linked from the catalogue. It currently has 34 URLs. Size variants remain available on those product pages; the cart, duplicate `/about` homepage alias, query filters and anchors are omitted.

`npm run sitemap` refreshes this file and [public/robots.txt](public/robots.txt). It also runs automatically before `npm run dev` and `npm run build`; Vite copies the files into `dist` for deployment. Use `http://localhost:5173/sitemap.xml` to inspect it locally. The production destination is `https://www.nordwood.in/sitemap.xml` after deployment.

URLs share the site's `VITE_SITE_URL` configuration (default `https://www.nordwood.in`). Set it consistently for builds and SEO checks if the live domain changes. Sitemap generation uses real catalogue and article data and does not invent modification dates. See [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The storefront uses React, React Router, Vite, and CSS, with an Express API and MariaDB. Cart selections persist in `localStorage`; submitted order requests and account data persist in MariaDB.
