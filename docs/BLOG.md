# NordWood blog

The `/blog` route lists six wood guides followed by ten journal stories. Each preview links to a dedicated `/blog/:id` page containing the complete article and its three-photo carousel. The main navigation links to the listing and stays active on article pages.

## Editing stories and photos

- Edit article copy, categories, reading times and photo order in `src/data/blogPosts.js`.
- Edit the six material guides in `src/data/woodGuides.js`. Their `summary`, `woodType`, `id` and first `imageKeys` entry also drive the homepage's second section, **Type of Wood**, at `/#wood-types`.
- Wood guides support titled `sections` with paragraphs and optional bullets, primary-source `sources`, and a `shopCategory` used with the exact catalogue `woodType` for the matching product link. Keep trade labels distinct from verified species, grades and origin.
- Keep article `id` values stable: they form shareable addresses such as `/blog/single-or-double-door`. Previously shared `/blog#single-or-double-door` links redirect to the matching article page.
- Each article's `imageKeys` selects three entries from `src/data/blogImages.js`.
- Replace the registry's `src`, `alt` and `caption` values with your original photographs when ready. Put local files in `public/images/`; their browser paths start with `/images/`.
- Landscape photos use a 4:3 area. `fit: 'contain'` preserves the whole portrait product image. Omit that property for landscape editorial photos that should fill the area.
- The current images are illustrative, shared where relevant across articles. The listing uses each article's first photo as its cover. They do not represent verified customer installations, actual timber inventory or the NordWood factory. Six generated timber studies live at `public/images/wood-*.jpg`; their exact prompts and provenance are in [wood-image-prompts.md](wood-image-prompts.md).

## Interaction and layout

`src/pages/Blog.jsx` and `Blog.css` provide the cream, charcoal and champagne article listing: one featured preview followed by a responsive card grid. Each card is one link containing a cover, category, title, reading time and excerpt.

`src/pages/BlogDetail.jsx` and `BlogDetail.css` render an individual article with its full text, takeaway and photo carousel. Material guides additionally include titled sections, further reading, matching products, and a link back to the homepage wood section. A back link returns to the journal; a next-story link continues to the following article. Unrecognised article IDs show a story-not-found message and a link to the listing.

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

- Wood-guide addition: all six direct routes, homepage card links, loaded images, gallery navigation, matching-product navigation, the return-to-wood-types anchor and the 16-article listing were checked in the browser. Desktop and 390px mobile layouts have no horizontal overflow. Data checks cover unique guide/section IDs, three existing images per guide, source links and valid catalogue destinations.
- Production build and lint pass.
- Ten unique article IDs, each with three full paragraphs and three valid photo references.
- Browser checks cover listing links, all ten direct article URLs, article text, three-photo galleries, navigation between articles, gallery reset, back navigation, legacy links, unknown article URLs, mobile layout and reduced motion.
- Layout checked at 320, 390, 768, 901, 1100 and 1440 pixels wide with no horizontal overflow or header collisions.
