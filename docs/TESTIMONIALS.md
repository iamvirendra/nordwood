# Testimonial content

The seven entries in `src/data/testimonials.js` are editorial samples for reviewing the layout and tone. They are not genuine customer reviews, verified purchases, or statements from actual homeowners. Their architectural images are illustrative and do not document customer projects.

Every current entry has `isSample: true`. The interface uses one visible **Illustrative testimonials** disclosure, connected to the carousel for assistive technology, instead of repeated sample labels. Fictional entries have no displayed customer attribution. Keep the disclosure while any illustrative entries remain, including when authentic and illustrative entries are shown together.

Replace an entry only when authentic customer material has been supplied and approved for publication:

1. Replace the quotation with the customer's approved words. Obtain approval for edits that change wording or meaning.
2. Replace the name and project context with the customer's approved public attribution. Respect a request for anonymous attribution.
3. Use a supplied, approved project photograph and accurate alternative text. If an architectural illustration is retained, continue to identify it as illustrative and do not present it as the customer's project.
4. Check that the quote, attribution, context and image belong together, then set `isSample: false` for that entry.

Do not turn sample copy into an apparent genuine review by changing only its name or status. Do not invent identities, locations, dates, ratings, purchase verification, certifications, or claims about delivery and price. Add ratings or verified badges only when their underlying evidence and publication permission are available.

The interface derives the illustrative-content disclosure from the entries' `isSample` values. It can stop showing this notice when all displayed entries have been replaced with approved authentic material; any remaining illustrative images still need accurate labels.

## Layout and interaction

`src/components/Testimonials.jsx` and `Testimonials.css` render the section directly above the homepage's final project invitation. The `/#testimonials` anchor opens it below the sticky header.

Visitors can select any of the seven stories, use Previous/Next (with wraparound), use Left/Right/Home/End keys, or swipe horizontally on the story. Slides do not advance automatically. The content reserves the natural height of the longest quote to keep controls steady without clipping text; inactive quotes are hidden visually and from assistive technology. A short live status announces the active story.

The photograph and quote animate only when both the site motion setting and the system preference permit it. The compact section uses shorter conversational quotes and a low image banner on phones. Small screens show seven numbered selectors in one row, wrapping to four columns below 375px to retain touch-sized buttons. Desktop selectors also show project labels.

Browser checks cover all seven stories, wrapping controls, keyboard navigation, one accessible quote at a time, motion-off behavior, loaded images, section placement and layouts at 1440, 390 and 320 pixels wide.
