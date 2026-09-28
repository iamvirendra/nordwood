# Catalog and product photographs

Door pricing comes from [PRICING DOORS.xlsx](https://docs.google.com/spreadsheets/d/1s205VFInUnm38tZSQNwDoIo49cCkTv8L/edit), downloaded on 14 September 2026. This is a local snapshot; changing the workbook does not automatically update the website.

`src/data/doorPricing.js` contains all three workbook tabs: Plantation Teak, Forest Teak and Imported Teak. Each wood has 10 single-door and 10 double-door sizes. Every row is `[height in feet, width in feet, wood in CFT, SELLING PRICE in INR]`. Use the SELLING PRICE column, excluding GST. Wood cost, labour cost, total cost and GST-inclusive values are not retail prices. All 60 rows were checked against the downloaded workbook.

`src/data/products.js` builds the six door families and their exact size variants. Existing door URLs 1–6 are retained. `src/data/other-products.json` preserves the earlier frame and window catalog; these products are not covered by the supplied door workbook. Size choices come from actual product variants.

## Product and material images

`src/data/suppliedImages.json` holds the 32 visually checked images imported from the supplied Drive folders on 28 September 2026. Files live under `public/images/catalog/`; [image-sources.json](image-sources.json) records each original filename, Drive file/folder ID, dimensions and SHA-256 checksum. [IMAGE_MAPPING.md](IMAGE_MAPPING.md) documents the category mapping and missing replacements.

`src/data/productImages.js` assigns single-door designs only to single-door families, window designs only to Windows, and material photographs only to products with the exact matching wood name. Generic design photos do not establish wood species or an exact priced specification. Double-door and frame illustrations remain where no matching supplied finished-product photo exists. Each gallery image has its own reference label; material stock is never presented as a finished frame.

All size variants inherit their family's gallery. Home category tiles, product cards, detail pages, related products and saved bags use the same source registry. Product images use `object-fit: contain` to preserve the full design. Galleries support any positive number of images, with scrolling thumbnails, previous/next controls and keyboard arrows.

To add replacements, put the original WebP/JPG/PNG in `public/images/catalog/`, record its provenance, and update the appropriate registry. Use `kind: 'design'` for general designs, `kind: 'material'` with an exact `material` name for timber photos, and `kind: 'illustration'` for retained placeholders. Run `npm run check:images` after changing mappings.

## Customer pricing and bag

Product cards show the lowest selling price for a family with “From” and “GST extra”. Customers choose a standard size before adding a multi-size product to the bag. The detail page shows the exact size, CFT and selling price for the chosen variant. Quantities are included when adding items. Saved bags reload current catalog prices and images.

The bag shows the merchandise subtotal, with GST and delivery extra. “Enquire to order” opens the customer's email app with the selected products; it does not take a payment or submit an order automatically. A payment gateway and backend checkout are not connected.
