# Website finish — September 2026

The storefront remains a static HTML/CSS/JavaScript site. Open `website/index.html`, or run `node preview.cjs` from this directory and visit http://127.0.0.1:4173.

## Changes
- Added `website/polish.css` and `website/polish.js` for the editorial design and interaction refinements.
- Reworked the hero, collection layout, product presentation, heritage, gifting, contact, and footer while retaining the Gujarati-first identity.
- Fixed script initialization: language setup no longer accesses cart state before initialization.
- Added document language updates, skip navigation, active section links, reduced-motion handling, cart/menu keyboard controls, focus restoration, and bilingual cart field labels.
- Enquiry handoff opens WhatsApp synchronously and preserves entered details. A visitor still reviews and sends the message in WhatsApp.
- Generated WebP copies of 16 food photographs, reduced from 11,070,091 to 1,506,476 bytes total (86.4% smaller). Original JPEG assets remain available.

## Verification
Headless Microsoft Edge via Playwright:
- Gujarati and English at 320, 390, 768, 1024, and 1440 pixels; no horizontal page overflow.
- Menu opening, Escape dismissal, preset/custom weight calculations, cart persistence, cart focus and restoration.
- Reduced-motion mode, enquiry validation, and a stubbed WhatsApp handoff (no external message sent).
- No page JavaScript errors or broken images in the checked storefront.
- Additional 390 x 740 check confirms checkout is reachable within the scrolling cart drawer.

`verify.cjs` contains the repeatable regression checks and requires Playwright plus Microsoft Edge. The dependency bundle used here is outside the project. The preview server serves only the `website` directory.

The changes are local; no live deployment was performed.
