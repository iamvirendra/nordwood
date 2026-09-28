# Cart WhatsApp enquiries

`Cart.jsx` uses `createCartEnquiry` and `CartOrderEnquiry` to prepare the current bag for the same confirmed WhatsApp destination as Contact: **+91 94513 08440**. The previous email-only CTA is replaced.

**Enquire to order** gathers the selection locally. A finite 1.2-second animation collects illustrated product slips into a folded paper plane and moves toward the circular header logo. The button shows progress and becomes **Open WhatsApp**. That explicit link opens the prepared message in a new tab with `noopener noreferrer`; the visitor reviews it and taps Send in WhatsApp. The page never claims delivery or places an order automatically. Opening the conversation preserves the bag.

The message includes every selected variant's ID, full name, category, wood/material, recorded dimensions or size, configuration/rebate, wood volume where supplied, quantity, unit price and line total. Double-door quantities are sets, not leaves. Kits without recorded dimensions say their size needs confirmation. Totals exclude GST and delivery; the team confirms availability and final arrangements. Prices are summed in integer paise.

Preparation disables repeated clicks, exposes a Skip animation control, and uses both animation completion and a cleaned-up 1.4-second timer fallback. Reduced-motion preferences bypass the preparation animation, including when the preference changes during preparation. Readiness focuses the next action. The component is keyed by the complete draft: changing quantity, removing a line, or otherwise changing order details resets the handoff to use the updated selection.

Visitors can expand **Review your full enquiry** or copy the message. If clipboard access is unavailable, a selectable textarea retains the complete draft. No message is silently truncated. As a conservative compatibility policy, links longer than 8,000 encoded characters use a bare chat URL and show **1. Copy full selection**, then **2. Open WhatsApp**. Keyboard focus goes to the copy action first.

The order summary scrolls with the page so its CTA remains reachable when the summary is taller than the viewport. No new runtime dependencies or sending backend were added.

## Verification

Run `node --test scripts/cart-enquiry.test.mjs scripts/contact-enquiry.test.mjs`, lint the changed sources, and run the project build. Browser checks cover standard and large selections, quantity-change reset, responsive layout, keyboard focus, and switching to reduced motion during preparation. Verify the WhatsApp link and message without sending a real enquiry.

## Thank-you confirmation

After opening WhatsApp, the visitor can choose **I’ve sent my message**. This opens an accessible, animated thank-you dialog with “Our team will connect with you on WhatsApp within 6 hours.” A deep link cannot verify sending or delivery; the dialog acknowledges the visitor’s confirmation, not a server receipt. Opening WhatsApp alone does not show a success message. The dialog supports Escape, focus containment/restoration and reduced motion. Closing it preserves the enquiry and cart. Editing a prepared contact enquiry or changing the cart resets this confirmation.

## Cart layout

The products sit beside a compact totals card. A separate, full-width enquiry panel below them pairs the introduction and 3D animation with the WhatsApp controls. This avoids stacking the whole conversation into a tall sidebar beside a short bag. The panel stacks on mobile and retains one keyed enquiry instance across breakpoints, preserving preparation, copy and confirmation state. All content stays in normal document flow so expanded messages remain reachable.
