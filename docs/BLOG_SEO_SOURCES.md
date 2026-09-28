# Source mapping for the September 2026 blog revision

The owner supplied eight revised Google Docs. Seven update existing articles; the eighth customer-experiences document updates the existing homepage testimonials section, as explicitly selected by the owner.

| Document | Existing website route | Source |
| --- | --- | --- |
| Imported Teak | `/blog/imported-teak-guide` | [Supplied revision](https://docs.google.com/document/d/1harfwHX3iPOzUGKUbDzw1WjF-uIS0zPs597JoLaz1os) |
| Plantation Teak | `/blog/plantation-teak-guide` | [Supplied revision](https://docs.google.com/document/d/1oKev2WxgX3mRUk201pjGY-C_mznJ4jqD7kdFWrjNaIY) |
| Malaysian Sal | `/blog/malaysian-saal-guide` | [Supplied revision](https://docs.google.com/document/d/1PRbYjWoNoumoZsYXQwZgPtTD6VPirh8oIfLnrM7jKhU) |
| Sal / Sakhu | `/blog/desi-sal-guide` | [Supplied revision](https://docs.google.com/document/d/1q6hTu7ZiS-vYXeRvN5N6tmnhGuauc9fvCoteoURhAcE) |
| Forest / Nigam Teak | `/blog/forest-teak-guide` | [Supplied revision](https://docs.google.com/document/d/1sPaka1w_8VUEKL-3Laq2u4-uW_OYx47bLMpAgO_oG4o) |
| Choosing wood for doors and windows | `/blog/choosing-wood-with-the-whole-room-in-mind` | [Supplied revision](https://docs.google.com/document/d/1DK6m-vMbqYyfQ4us_DxAscAg6Sh5FsVgMWAND_VLURI) |
| Kapur / Kapoor Sal | `/blog/kapoor-sal-guide` | [Supplied revision](https://docs.google.com/document/d/10U6WwO_lNW3j1ziLzDh2uWgLeKZKbUFBkysQp4MF1gs) |
| Customer experiences | `/#testimonials` | [Supplied revision](https://docs.google.com/document/d/1HLlRe9GBT5cMaFtn2kKv9RT8KRhGyyaVFPAY36NQkdI) |

`src/data/seoBlogContent.json` retains the seven source article titles, introductory paragraphs, section order, FAQs, ten native tables and 28 list items. Source-reading links are extracted from the documents' actual text-run URLs; explanatory text remains in their labels. Metadata uses the supplied SEO titles and descriptions, and reading time is recomputed at 200 words per minute. The source URL/title and suggested slug are recorded as provenance; suggested slugs do not replace the site's existing URLs.

Publishing notes, image suggestions, search-term lists and internal-link plans are editorial context, not visible article prose. Internal links point to existing material guides, catalogue filters and the contact page. No page is created for a destination that does not exist. The original six wood-guide IDs, catalogue filters and all article image-key arrays are preserved. Homepage material cards automatically receive the revised summaries.

The customer-experiences revision changes the ten displayed titles and quotations and uses its supplied anonymous attributions. In particular, the chaukhat delivery story is attributed to Homeowner, Lucknow in the revision. IDs, illustrative photos and carousel behaviour remain unchanged. No standalone customer-experiences blog, aggregate rating or fabricated review evidence is added.

The source copy remains the owner's article content. It does not silently change product prices, species mappings, dimensions, cart logic or order specifications. Illustrative photos retain their existing accurate descriptions instead of adopting image-plan alt text for scenes they do not show.

See [BLOG.md](BLOG.md) for the renderer, SEO implementation, build checks and deployment requirements.
