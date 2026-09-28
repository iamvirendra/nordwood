# Contact enquiries

The contact page uses `ContactEnquiry` for an accessible four-step project studio. Product selection is controlled by the surrounding page through `selectedCategory` and `onCategoryChange`. Supported values are `Door`, `Window`, `DoorFrame`, `WindowFrame` and `''` (help choosing).

## WhatsApp handoff

The final step introduces the NordWood team. The confirmed destination is **WhatsApp +91 94513 08440**. **Bring my message together** validates the enquiry and replaces the editable fields with an inline `ContactHandoff` panel. A 900 ms paper-plane animation connects **You** and **NordWood team** while the page prepares the message locally. It does not claim to send or deliver anything. The ready panel retains a snapshot of the visitor's project details, selected product type, name, and any optional city, timeline, email or phone they supply.

**Open WhatsApp** is an explicit link to `https://wa.me/919451308440` with the prepared message. It is available after preparation; no delayed popup or automatic external navigation occurs. The visitor reviews the message in WhatsApp and taps **Send** to reach the team. The link opens in a new tab with `noopener noreferrer`; **Open WhatsApp again** remains available if opening the app fails. The page says **Review your message in WhatsApp and tap Send. Your details are still here.** and never claims delivery.

**Edit my details** restores the fields with all values intact. Editing the project or selecting another product from the page clears the prepared snapshot so a new message can be composed. The snapshot itself has an expandable **Review your message** preview. Copy and email alternatives remain available in both the editing and ready states.

During preparation, duplicate submits and step navigation are disabled. The animation's completion event reveals the ready controls, with a 1.1-second timeout fallback that is cleaned up on interruption or unmount. **Skip animation** also makes the controls available immediately. The form honors `useMotion().enabled`, covering both the site's motion switch and `prefers-reduced-motion`. Reduced motion skips preparation, and changing the preference during preparation reveals the controls immediately. Focus moves to the inline panel's heading and its scroll offset keeps the animation below the sticky header. A separate polite live region announces preparation and readiness.

The form has no direct sending backend or environment-variable setup. WhatsApp must be available on the visitor's device or through WhatsApp Web. NordWood's number must have an active WhatsApp account. No actual messages are sent during automated tests.

## Alternatives

**Use my email app** opens a draft addressed to `info.nordwood2026@gmail.com` with the same enquiry and a relevant subject. The visitor must review and send that draft in their email app.

**Copy enquiry** copies the composed message body for pasting into WhatsApp or an email. If browser clipboard access is unavailable or denied, the page shows selectable text for manual copying. Long messages may exceed an app or browser's link limits; the copy fallback retains the full message.

Form values stay in component state while the visitor moves between steps or encounters validation errors. They are not stored in cookies or localStorage. Navigating away or refreshing clears them. Opening WhatsApp passes the message to WhatsApp through its prefilled message URL; the form explains the handoff before the visitor continues.

## Validation and checks

- Project message: at least 15 characters and 3 words, up to 2,500 characters.
- Name: required, at least 2 characters.
- Email, phone, city and timeline: optional. An email is validated only when provided.
- Optional phone: 7–15 digits, allowing common international formatting.
- Invalid fields keep their values and receive keyboard focus; form headings and controls allow space for the sticky site header.
- Motion respects `prefers-reduced-motion` and the site's motion preference.

Run `node --test scripts/contact-enquiry.test.mjs` to check validation, the confirmed WhatsApp destination, message encoding, optional-field handling and copy/email fallbacks. Run the project's normal build and lint commands after integration. Browser testing should cover all four steps, keyboard focus, validation, category synchronisation, preparation/ready/edit states, duplicate submission, reduced motion (including a change during preparation), clipboard denial and mobile layout. Assert the exact WhatsApp URL without sending a real message. Do not press Send in WhatsApp or email while testing.

## 3D presentation

The hero's `ContactWoodScene` presents the existing door, window and timber references with CSS perspective, layered wood edges, an entrance turn and cursor-responsive lighting/tilt. **Turn the view** is also available by touch or keyboard, so the interaction does not depend on hover. The perspective is a visual presentation of the references, not a dimensional product model.

Pointer updates are limited to one animation frame at a time and cleared on leave/unmount. Reduced motion disables entrance motion and pointer tilt; the turn control still switches to a static alternate angle. The message handoff uses a folded CSS paper plane with depth and banking, retaining its existing 900 ms completion and fallback timing. No 3D runtime or additional asset downloads are required.

## Guided project studio

The form is a four-step conversation: **Your piece**, **Your idea**, **Place & pace**, and **Meet the team**. Illustrated native radio cards select the product. The user explicitly continues after choosing; arrow-key radio selection does not advance the step. The right-hand `ContactProjectNote` updates its decorative architectural drawing and project note as values change, without announcing every keystroke. On phones, the large drawing is hidden and the note appears below the current step.

Optional idea prompts append a sentence without replacing existing text. They cannot duplicate a sentence or exceed the message limit. City and timing may be skipped; timing can be cleared. Name is required, while optional email and phone fields expand on request. Their errors reopen the fields and move focus to the first invalid input. The final message can be expanded in full before preparation.

Completed steps can be revisited. Forward step navigation validates the message when necessary; final preparation validates every field. The helper's validation stages remain `1` (message) and `2` (all details), independent of the studio's UI step indices `0`–`3`. The active step button is a no-op to avoid moving focus while typing. Back navigation, editing and category changes retain the visitor's input and invalidate any previously prepared snapshot.

The original circular header logo appears in the guide, project note and 3D message handoff. Motion uses finite transitions and drawing animations and observes `useMotion` and reduced-motion preferences. No new dependencies, backend service or automatic sending were introduced.

## Thank-you confirmation

After opening WhatsApp, the visitor can choose **I’ve sent my message**. This opens an accessible, animated thank-you dialog with “Our team will connect with you on WhatsApp within 6 hours.” A deep link cannot verify sending or delivery; the dialog acknowledges the visitor’s confirmation, not a server receipt. Opening WhatsApp alone does not show a success message. The dialog supports Escape, focus containment/restoration and reduced motion. Closing it preserves the enquiry and cart. Editing a prepared contact enquiry or changing the cart resets this confirmation.
