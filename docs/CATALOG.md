# Catalog and product photographs

Door pricing comes from [PRICING DOORS.xlsx](https://docs.google.com/spreadsheets/d/1s205VFInUnm38tZSQNwDoIo49cCkTv8L/edit), downloaded on 14 September 2026. This is a local snapshot; changing the workbook does not automatically update the website.

`src/data/doorPricing.js` contains all three workbook tabs: Plantation Teak, Forest Teak and Imported Teak. Each wood has 10 single-door and 10 double-door sizes. Every row is `[height in feet, width in feet, wood in CFT, SELLING PRICE in INR]`. Use the SELLING PRICE column, excluding GST. Wood cost, labour cost, total cost and GST-inclusive values are not retail prices. All 60 rows were checked against the downloaded workbook.

`src/data/products.js` builds the six door families and their exact size variants. Existing door URLs 1–6 are retained. `src/data/other-products.json` preserves the earlier frame and window catalog; these products are not covered by the supplied door workbook. Size choices come from actual product variants.

## Replace the dummy photographs

1. Put the original image files in `public/images/`. Prefer compressed JPG or WebP files, with a portrait image for the first product photo.
2. Edit that family's entry in `src/data/productImages.js`. Each `images` array accepts three or more `{ src, alt, label }` entries. Paths start with `/images/`, e.g. `{ src: '/images/plantation-single-front.jpg', alt: 'Plantation teak single door, front view', label: 'Front view' }`.
3. Use distinct front, detail and installation views. Every size variant inherits the family's gallery. For a frame/window product, add its name as another key in `productGalleries` to override the shared placeholders.
4. After replacing the illustrative photos, adjust `illustrativeImages` in `products.js` and the footer's illustrative-photo note to reflect the actual images.

The current dummy galleries share a design view by door type or product category, a timber detail, and an architectural inspiration photo. They do not claim to be photographs of the exact product. Gallery thumbnails, previous/next controls and keyboard arrows display all supplied images.

## Customer pricing and bag

Product cards show the lowest selling price for a family with “From” and “GST extra”. Customers choose a standard size before adding a multi-size product to the bag. The detail page shows the exact size, CFT and selling price for the chosen variant. Quantities are included when adding items. Saved bags reload current catalog prices and images.

The bag shows the merchandise subtotal, with GST and delivery extra. “Enquire to order” opens the customer's email app with the selected products; it does not take a payment or submit an order automatically. A payment gateway and backend checkout are not connected.
