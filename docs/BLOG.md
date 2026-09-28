# NordWood blog

The `/blog` route lists six wood guides followed by ten journal stories. Each preview links to a dedicated `/blog/:id` page containing the complete article and its photo carousel. The main navigation links to the listing and stays active on article pages.

## Editing stories and photos

- Edit the seven source-updated articles in `src/data/seoBlogContent.json`. It contains the supplied article prose, structured sections, SEO titles and descriptions, source links, reading times and provenance. See [BLOG_SEO_SOURCES.md](BLOG_SEO_SOURCES.md) for the document-to-route mapping. Publishing notes and image/internal-link plans are excluded from visible article text.
- Edit the remaining journal copy, categories and photo order in `src/data/blogPosts.js`. The six material selections in `src/data/woodGuides.js` preserve their catalogue names, public IDs and image mappings while taking copy from `seoBlogContent.json`. Their `summary`, `woodType`, `id` and first `imageKeys` entry also drive the homepage's second section, **Type of Wood**, at `/#wood-types`.
- Articles support titled `sections`, including paragraphs, H3 headings, ordered/unordered lists and native comparison tables through `ArticleBlocks`. Primary-source `sources` become external reading links. A wood guide's `shopCategory` pairs with the exact catalogue `woodType` for its product link. Keep trade labels distinct from verified species, grades and origin.
- Keep article `id` values stable: they form shareable addresses such as `/blog/single-or-double-door`. Previously shared `/blog#single-or-double-door` links redirect to the matching article page.
- Each article's `imageKeys` selects entries from `src/data/blogImages.js`. Journal stories retain three images. The Plantation Teak, Forest Teak, Kapoor Sal and Desi Sal guides use all five, four, five and six images respectively from their matching supplied material sets.
- `src/data/suppliedImages.json` is the central registry for supplied assets. `blogImages.js` exports `suppliedWoodImageKeys`, keyed by the exact material name. The first image keeps its existing `wood-*` cover key; additional keys combine that cover key with the source filename without its extension. Registry order controls gallery order.
- Update supplied image paths, dimensions, labels and alt text in the central registry; edit editorial images and captions in `blogImages.js`. Local files live under `public/images/`, with supplied assets under `public/images/catalog/`; browser paths start with `/images/`.
- Photos use a 4:3 area. `fit: 'contain'` preserves the full supplied material or design reference, including portrait product images. Omit that property for landscape editorial photos that should fill the area.
- The listing uses each article's first photo as its cover. Supplied material images are mapped only to the matching folder category; the supplied single-door and window images are design references without a species claim. Provenance is recorded in [image-sources.json](image-sources.json). The remaining editorial scenes and the Imported Teak and Malaysian Saal material covers remain illustrative. Their prompts and provenance are in [wood-image-prompts.md](wood-image-prompts.md) and below; none of these illustrations verifies an actual installation, current inventory or factory.

## Interaction and layout

`src/pages/Blog.jsx` and `Blog.css` provide the cream, charcoal and champagne article listing: one featured preview followed by a responsive card grid. Each card is one link containing a cover, category, title, reading time and excerpt.

`src/pages/BlogDetail.jsx` and `BlogDetail.css` render an individual article with its full text, takeaway and photo carousel. Material guides additionally include titled sections, further reading, matching products, and a link back to the homepage wood section. A back link returns to the journal; a next-story link continues to the following article. Unrecognised article IDs show a story-not-found message and a link to the listing.

The source-updated articles identify NordWood as the publisher and include collapsible contents navigation, visible FAQs, comparison tables where supplied, related timber guides and product/contact links. Wide tables scroll inside their own labelled, keyboard-focusable regions on narrow screens. Existing image order and material/design-reference labels remain intact.

## SEO and deployment

`BlogSeo` applies unique page titles, descriptions, canonical URLs, Open Graph/Twitter cards and matching `BlogPosting`/`BreadcrumbList` JSON-LD. It clears article metadata when leaving the journal. No publication dates, review ratings or FAQ rich-result claims are fabricated. Missing articles receive `noindex, follow`; the production host must also return an actual HTTP 404 for unknown article paths.

`npm run build` first regenerates `public/sitemap.xml` and `public/robots.txt`, creates the Vite bundle, and then pre-renders `/blog` and all 16 article pages into `dist/blog/**/index.html`. Each generated page contains readable article HTML and its metadata before JavaScript executes. The browser mounts the interactive app with `createRoot`; these build snapshots are intentionally not hydrated because cart and motion settings depend on the visitor. Vite copies the sitemap and robots file into `dist`. The sitemap covers all articles, the main public pages and the catalogue's preferred product-family URLs; it is no longer generated separately by the blog pre-renderer. Run `npm run sitemap` to refresh it independently.

The canonical origin defaults to `https://www.nordwood.in`, as supplied in the brand artwork. To use another origin, set `VITE_SITE_URL` consistently when building and checking, for example `VITE_SITE_URL=https://example.com npm run build`. Deploy the entire `dist` folder and configure the host to serve existing article directory indexes before applying the SPA fallback. Domain redirects, live crawlability, sitemap submission and indexing need verification on the deployed host; these are not established by a local build.

Run `npm run check:seo` after building to verify initial HTML, metadata, schema, sitemap/robots output and metadata cleanup. Run `npm run check:images` for the existing image-provenance and article/catalogue mapping checks. The implementation follows Google's [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) and [Article structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/article).

`src/components/BlogCarousel.jsx` and `BlogCarousel.css` provide previous/next controls, direct photo selectors, a live photo counter, keyboard arrows/Home/End and horizontal touch swipes. The gallery resets to its first photo when the article changes. Only the active image is rendered; the article gallery loads eagerly, while listing covers after the featured article are lazy-loaded. Transitions and scroll reveals respect both the site motion switch and system reduced-motion preferences. There is no automatic slide rotation.

## New editorial assets

Generated with the built-in imagegen tool. Both images were visually reviewed and exported as 1200 × 900 JPEGs at quality 80.

| Asset | Size | Full-quality source |
| --- | --- | --- |
| `public/images/blog-workshop.jpg` | 263,126 bytes | `/tmp/nordwood-assets/blog-workshop-source.png` |
| `public/images/blog-window-light.jpg` | 212,283 bytes | `/tmp/nordwood-assets/blog-window-light-source.png` |

The JPEGs are the permanent project assets. The full-quality sources are temporary working files.

### Workshop prompt

```text
Use case: photorealistic-natural. Asset type: architectural woodwork blog editorial placeholder photograph. Generate one landscape photograph in 4:3 aspect ratio, at least 1200 pixels wide. Subject: Premium woodworking atelier still-life: carefully arranged solid teak boards, a substantial carpenter's bench, a beautiful precise corner joinery sample and a few authentic understated hand tools. Natural warm light from a nearby workshop window, warm cream walls, charcoal accents, small champagne metal accents, realistic fine timber grain and tactile bench surface. No people, text, logos, signage or branding. A quiet aspirational craftsmanship editorial photograph. Clearly plausible real working architecture and materials, not a graphic, CGI infographic or staged abstract sculpture. Shared color direction: warm cream #F4F0E6, charcoal #2C302E, soft champagne #E8D8B6, natural warm wood. Photoreal editorial quality, soft warm natural light, tasteful restrained contrast and fine material detail. This is an illustrative stock-style inspirational image and must not imply it depicts an actual NordWood factory or project. No watermark.
```

### Window prompt

```text
Use case: photorealistic-natural. Asset type: architectural woodwork blog editorial placeholder photograph. Generate one landscape photograph in 4:3 aspect ratio, at least 1200 pixels wide. Subject: Premium quiet interior with a beautiful solid wood framed window, soft natural daylight passing through the glazing, warm cream plaster walls, natural pale champagne metal window hardware, gentle shadow, tactile material surfaces and uncluttered visual negative space. Restrained architectural photography, plausible real window construction and room proportions. Natural warm honey teak grain. No people, text, logos, signage or branding. Shared color direction: warm cream #F4F0E6, charcoal #2C302E, soft champagne #E8D8B6, natural warm wood. Photoreal editorial quality, soft warm natural light, tasteful restrained contrast and fine material detail. This is an illustrative stock-style inspirational image and must not imply it depicts an actual NordWood factory or project. No watermark.
```

## Validation

- Wood-guide addition: all six direct routes, homepage card links, loaded images, gallery navigation, matching-product navigation, the return-to-wood-types anchor and the 16-article listing were checked in the browser. Desktop and 390px mobile layouts have no horizontal overflow. Data checks cover unique guide/section IDs, existing image references, source links and valid catalogue destinations. Supplied material galleries now contain the full matching source sets; Imported Teak and Malaysian Saal retain three-image galleries.
- Production build, lint, image-mapping regression checks and `check:seo` pass. All 820 pre-note source text blocks are present across the seven rendered revisions; all sixteen original article IDs, order and image mappings are retained.
- Sixteen stable article IDs, including seven source-updated articles and nine shorter journal stories. Updated articles retain every supplied article paragraph, ten comparison tables and 28 list items; FAQs remain visible content. All photo references retain their existing mappings.
- Earlier browser checks covered listing links, the original ten direct article URLs, gallery/navigation interactions, legacy links, unknown article URLs, mobile layout and reduced motion. The September 2026 content update is checked by source-to-render comparisons and the generated-HTML SEO checks.
- Earlier layout checks covered 320, 390, 768, 901, 1100 and 1440 pixel widths. The new comparison tables use bounded horizontal scrolling; a fresh browser visual check was not available for this content update.
