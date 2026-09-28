# Testimonial content

The ten entries in `src/data/testimonials.js` use the titles, quotations and anonymous attributions supplied by the site owner, in the supplied order. Each entry has `isSample: false`. Display the supplied role (`Homeowner` or `Customer`) and location (`Lucknow`) without adding personal names or verification claims.

The September 2026 revision uses [NORDWOOD — Customer Experiences — Revised](https://docs.google.com/document/d/1HLlRe9GBT5cMaFtn2kKv9RT8KRhGyyaVFPAY36NQkdI/edit). The user explicitly chose to apply this document to the existing testimonials section. All ten titles, quotes and anonymous attributions match that revision, in its order. The third attribution is now **Homeowner, Lucknow**, as supplied. Existing entry IDs and illustrative image mappings are retained. Publishing notes, the suggested standalone slug and metadata are not shown as customer content; no standalone testimonial article, rating or review schema is added.

The architectural images remain illustrative and do not document the customers' projects. Their alternative text and the visible **Illustrative setting** caption preserve that distinction. The `detail` field describes the image context; `location` supplies the customer attribution.

Replace an entry only when authentic customer material has been supplied and approved for publication:

1. Replace the quotation with the customer's approved words. Obtain approval for edits that change wording or meaning.
2. Replace the name and project context with the customer's approved public attribution. Respect a request for anonymous attribution.
3. Use a supplied, approved project photograph and accurate alternative text. If an architectural illustration is retained, continue to identify it as illustrative and do not present it as the customer's project.
4. Check that the quote, attribution, context and image belong together, then set `isSample: false` for that entry.

Do not turn sample copy into an apparent genuine review by changing only its name or status. Do not invent identities, locations, dates, ratings, purchase verification, certifications, or claims about delivery and price. Add ratings or verified badges only when their underlying evidence and publication permission are available.

The interface derives the illustrative-content disclosure from the entries' `isSample` values. It can stop showing this notice when all displayed entries have been replaced with approved authentic material; any remaining illustrative images still need accurate labels.

## Layout and interaction

`src/components/Testimonials.jsx` and `Testimonials.css` render the section directly above the homepage's final project invitation. The `/#testimonials` anchor opens it below the sticky header.

The ten stories advance automatically every ten seconds while the section is visible. Rotation pauses on mouse hover, during touch gestures, when the browser tab is hidden, or when site/system motion is disabled. Keyboard focus within the carousel pauses rotation until focus leaves; rotation then resumes if no other pause condition applies.

Visitors can also use Previous/Next (with wraparound), Left/Right/Home/End keys, or swipe horizontally on the story. Manual navigation restarts the reading interval when autoplay is active. The content reserves the natural height of the longest quote to keep controls steady without clipping text; inactive quotes are hidden visually and from assistive technology. A short live status announces only manual navigation.

The photograph and quote slide into view only when both the site motion setting and the system preference permit it. Numbered selectors and visible slide counters have been removed. Phones retain a low image banner and compact Previous/Next arrows.

When checking the carousel in a browser, cover automatic rotation, hover/touch pauses, focus entry and exit, offscreen and hidden-tab behavior, all ten stories, wrapping controls, keyboard and swipe navigation, one accessible quote at a time, motion-off behavior, loaded images, section placement and layouts at 1440, 390 and 320 pixels wide.
