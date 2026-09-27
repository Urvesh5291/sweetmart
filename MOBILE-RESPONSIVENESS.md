# Mobile responsiveness

Implemented in `website/mobile.css`, with viewport sizing in `website/polish.js` and matching improvements to the owner dashboard.

- One readable product column below 540px, two columns on small tablets, three on desktop.
- Larger Gujarati and English body copy, 44–50px shopping controls, and 16px form inputs.
- Menus use the actual remaining viewport height, including announcement-bar changes.
- The cart follows visual viewport changes and remains scrollable on short screens.
- Full-width mobile cart bar, safe-area padding, and no floating chat control obscuring product actions. WhatsApp remains available in navigation, contact, and checkout.
- Responsive gifting, footer, owner forms, dashboard navigation, and inventory controls.

Validation: `verify-mobile.cjs` passes at 320x568, 360x640, 375x667, 390x844, 430x932, 540x720, 600x800, 768x1024, 844x390, 1024x768, and 1440x1000 in Gujarati and English. Tests inspect actual content bounds (not just the document scrollbar), menu scrolling before and after announcement dismissal, custom pricing, cart focus, viewport resizing during checkout, and owner login. Zero storefront page errors were recorded.

Owner dashboard orders, kitchen, analytics, inventory, and settings were also checked at 320x568, 390x844, and 844x390 using the existing local demo entry, without changing business data.

Tests ran in Microsoft Edge / Chromium with emulated touch viewports. Physical-device Safari and Android keyboard behavior still need device testing. Changes remain local and have not been deployed.
