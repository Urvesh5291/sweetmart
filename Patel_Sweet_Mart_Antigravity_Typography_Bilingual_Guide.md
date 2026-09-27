# Patel Sweet Mart --- Typography & Bilingual Website Specification

## Implementation Brief for Antigravity

**Brand:** પટેલ સ્વીટ માર્ટ / Patel Sweet Mart\
**Established:** 1995\
**Document:** Typography, font installation, localization, and bilingual
UI specification\
**Default language:** Gujarati (`gu-IN`)\
**Secondary language:** English (`en-IN`)\
**Priority:** Gujarati-first, premium, highly readable,
production-ready.

------------------------------------------------------------------------

# 1. Objective

Build Patel Sweet Mart as a genuinely bilingual website, not an English
website with Gujarati added later.

The website MUST:

-   Open in **Gujarati by default** for a new visitor unless a
    previously saved language preference exists.
-   Provide a clearly visible **ગુજરાતી / English** language switcher.
-   Preserve the selected language across pages and future visits.
-   Use proper Unicode Gujarati text.
-   Keep product data, navigation, SEO metadata, accessibility labels,
    forms, cart, checkout, validation, and transactional UI
    localization-ready.
-   Never use Gujarati text embedded inside images when live HTML text
    can be used.
-   Never transliterate Gujarati into Latin characters as a substitute
    for Gujarati script.

------------------------------------------------------------------------

# 2. Approved Typeface System

## Gujarati Display / Editorial

**Typeface:** Noto Serif Gujarati\
**Primary weights:** 500, 600, 700

Use for:

-   Hero headlines
-   H1/H2 editorial headings
-   Heritage storytelling
-   Festival campaign headlines
-   Major Gujarati statements
-   About/1995 story
-   Premium gifting storytelling

Do NOT use it for dense checkout interfaces, filters, form controls, or
long utility text.

## Gujarati UI / Body

**Typeface:** Noto Sans Gujarati\
**Primary weights:** 400, 500, 600, 700

Use for:

-   Navigation
-   Body copy
-   Product titles
-   Product descriptions
-   Buttons
-   Filters
-   Forms
-   Cart
-   Checkout
-   Account pages
-   Delivery information
-   Labels
-   Captions
-   Error messages

## English Display

**Typeface:** DM Serif Display\
**Weight:** 400

Use for:

-   English editorial headings
-   Heritage/story sections
-   Selected campaign headlines

Do not use for functional UI.

## English UI / Body

**Typeface:** Inter\
**Weights:** 400, 500, 600, 700

Use for:

-   Navigation
-   Body copy
-   Product UI
-   Buttons
-   Forms
-   Checkout
-   Utility interfaces

------------------------------------------------------------------------

# 3. Font Acquisition / Installation Instructions

Antigravity should obtain the fonts from their **official Google Fonts
distributions** or install the corresponding packages through the
project's approved font workflow.

Required families:

``` text
Noto Serif Gujarati
Noto Sans Gujarati
DM Serif Display
Inter
```

Preferred production strategy:

1.  Download/self-host the required font files when the deployment
    architecture permits it.
2.  Prefer **WOFF2** for web delivery.
3.  Include only the weights actually used.
4.  Do not download unofficial repackaged font files.
5.  Do not commit desktop-only font formats when unnecessary.
6.  Configure `font-display: swap`.
7.  Preload only critical above-the-fold fonts.
8.  Subset carefully; Gujarati glyph coverage MUST remain complete for
    all content used by the site.
9.  Retain the applicable font licenses/notices in the repository.

If the framework provides a first-party optimized Google Fonts
integration, it may be used instead of manual downloads provided the
resulting production build preserves these exact families and required
Gujarati coverage.

------------------------------------------------------------------------

# 4. Font Tokens

``` css
:root {
  --font-gujarati-display: "Noto Serif Gujarati", serif;
  --font-gujarati-ui: "Noto Sans Gujarati", sans-serif;

  --font-english-display: "DM Serif Display", Georgia, serif;
  --font-english-ui: "Inter", Arial, sans-serif;
}
```

Language-aware application:

``` css
html[lang="gu"] body {
  font-family: var(--font-gujarati-ui);
}

html[lang="en"] body {
  font-family: var(--font-english-ui);
}

html[lang="gu"] .display-type {
  font-family: var(--font-gujarati-display);
}

html[lang="en"] .display-type {
  font-family: var(--font-english-display);
}
```

Do not rely on a single Latin font and browser fallback for Gujarati.

------------------------------------------------------------------------

# 5. Typography Scale

Use responsive `clamp()` values in implementation.

  ------------------------------------------------------------------------
  Token          Desktop target    Mobile target Gujarati     English
  ------------ ---------------- ---------------- ------------ ------------
  Display XL           64--80px         42--52px Noto Serif   DM Serif
                                                 Gujarati 700 Display 400

  H1                   52--64px         36--44px Noto Serif   DM Serif
                                                 Gujarati 700 Display 400

  H2                   40--48px         30--36px Noto Serif   DM Serif
                                                 Gujarati 600 Display 400

  H3                   28--34px         24--28px Noto Serif   Inter 600
                                                 Gujarati 600 

  H4                   22--26px         20--24px Noto Sans    Inter 600
                                                 Gujarati 600 

  Body Large           18--20px         17--18px Noto Sans    Inter 400
                                                 Gujarati 400 

  Body                 16--18px             16px Noto Sans    Inter 400
                                                 Gujarati 400 

  UI / Button          15--17px         15--16px Noto Sans    Inter 600
                                                 Gujarati 600 

  Small                    14px             14px Noto Sans    Inter
                                                 Gujarati     400/500
                                                 400/500      

  Caption              12--13px         12--13px Noto Sans    Inter
                                                 Gujarati     400/500
                                                 400/500      
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# 6. Gujarati Typesetting Rules

Gujarati requires its own spacing and rhythm.

## Line Height

Recommended starting points:

``` text
Gujarati Display: 1.15–1.30
Gujarati H1/H2:   1.20–1.35
Gujarati Body:    1.55–1.70
Gujarati UI:      1.35–1.50
```

Always visually test real Gujarati strings.

## Letter Spacing

Do not apply aggressive negative tracking to Gujarati.

Recommended:

``` css
:lang(gu) {
  letter-spacing: normal;
}
```

Small positive tracking may be tested for isolated uppercase-style
English metadata, but must not be copied blindly to Gujarati.

## Alignment

-   Prefer left/start alignment for paragraphs and commerce UI.
-   Centering is acceptable for short hero statements.
-   Never center long Gujarati paragraphs.
-   Keep line lengths comfortable.

## Weight

Use scale and whitespace before adding excessive boldness.

------------------------------------------------------------------------

# 7. Logo Typography Is Separate

The Gujarati brand wordmark:

**પટેલ સ્વીટ માર્ટ**

is a **custom brand asset**.

Do NOT reconstruct the official logo by typing the words in Noto Serif
Gujarati.

Use the supplied vector logo asset (SVG) once finalized.

Typography architecture:

``` text
Custom Gujarati Wordmark → Brand recognition
Noto Serif Gujarati      → Heritage/editorial voice
Noto Sans Gujarati       → Functional digital voice
DM Serif Display         → English editorial voice
Inter                    → English functional voice
```

------------------------------------------------------------------------

# 8. Brand Color + Typography

Approved core palette:

``` text
Royal Cobalt   #173F8A
Kesari Orange  #F47B20
Rose           #CE496B
Almond         #F5E6CB
Charcoal       #242424
Heritage Gold  #D4AF37
```

Typography usage:

-   Major Gujarati headings on Almond: Royal Cobalt
-   Standard body copy: Charcoal
-   Links/actions: Cobalt
-   Kesari: controlled action/highlight use
-   Rose: festival/gifting accents
-   Gold: decorative/premium detail only

Do NOT use Gold for small body text unless contrast has been explicitly
verified.

All combinations must pass the project's WCAG 2.2 AA contrast
requirements where applicable.

------------------------------------------------------------------------

# 9. Language Architecture

Supported locales:

``` text
gu-IN  → Gujarati — DEFAULT
en-IN  → English
```

Recommended route architecture:

``` text
/gu/...
/en/...
```

The root `/` should resolve to Gujarati for first-time visitors unless
the product architecture deliberately handles locale negotiation
elsewhere.

Preferred examples:

``` text
/gu/
/gu/mithai
/gu/namkeen
/gu/gifting
/gu/our-story

/en/
/en/mithai
/en/namkeen
/en/gifting
/en/our-story
```

Use stable localized URLs and proper SEO alternates.

------------------------------------------------------------------------

# 10. Language Preference Logic

Required behavior:

``` text
IF a valid saved user preference exists:
    use saved preference
ELSE:
    use Gujarati (gu-IN)
```

Do not automatically replace Gujarati with English solely because the
browser language is English.

The business requirement is:

**Gujarati is the default brand experience.**

Persist the explicit user choice using the framework's appropriate
cookie/local-storage/server preference strategy.

Do not unexpectedly reset the language during:

-   Navigation
-   Search
-   Login
-   Cart
-   Checkout
-   Payment return
-   Account navigation

------------------------------------------------------------------------

# 11. Language Switcher

Desktop:

``` text
ગુજરાતી | English
```

or a compact selector:

``` text
ગુજરાતી  ▾
```

Options:

``` text
✓ ગુજરાતી
  English
```

Mobile: include the same control in the main menu/header.

Requirements:

-   Never use country flags to represent language.
-   Show language names in their native form.
-   Current state must be obvious.
-   Switch the user to the equivalent page in the other language where
    possible.
-   Preserve cart/session state.
-   Make the control keyboard accessible.
-   Give it an accessible name.

------------------------------------------------------------------------

# 12. HTML Language Attribute

Gujarati:

``` html
<html lang="gu-IN">
```

English:

``` html
<html lang="en-IN">
```

Update this correctly when locale changes.

------------------------------------------------------------------------

# 13. Translation Data Model

Do not hard-code visible strings throughout components.

Example:

``` json
{
  "nav": {
    "mithai": {
      "gu": "મીઠાઈ",
      "en": "Mithai"
    },
    "namkeen": {
      "gu": "નમકીન",
      "en": "Namkeen"
    },
    "gifting": {
      "gu": "ગિફ્ટિંગ",
      "en": "Gifting"
    },
    "story": {
      "gu": "અમારી કહાની",
      "en": "Our Story"
    }
  }
}
```

A mature implementation may use locale files instead:

``` text
/locales
  /gu
    common.json
    navigation.json
    products.json
    checkout.json
  /en
    common.json
    navigation.json
    products.json
    checkout.json
```

Choose the architecture that best matches the framework.

------------------------------------------------------------------------

# 14. Sample Core UI Copy

  Purpose        Gujarati        English
  -------------- --------------- --------------
  Shop now       હમણાં ખરીદો      Shop Now
  Explore        વધુ જુઓ           Explore
  Add to cart    કાર્ટમાં ઉમેરો     Add to Cart
  Cart           કાર્ટ            Cart
  Search         શોધો            Search
  Best sellers   લોકપ્રિય પસંદગી   Best Sellers
  Mithai         મીઠાઈ           Mithai
  Namkeen        નમકીન           Namkeen
  Gifting        ગિફ્ટિંગ          Gifting
  Our story      અમારી કહાની     Our Story
  Stores         સ્ટોર્સ           Stores

Gujarati copy must receive native/editorial review before production.
These strings are implementation starters, not a substitute for final
language QA.

------------------------------------------------------------------------

# 15. Hero Typography Example

Gujarati default:

``` text
પરંપરાનો સ્વાદ.
નવી પેઢી માટે.

1995થી સ્વાદ અને વિશ્વાસની પરંપરા.

[ હમણાં ખરીદો ]   [ અમારી કહાની ]
```

Typography:

``` text
Hero → Noto Serif Gujarati / 700
Supporting copy → Noto Sans Gujarati / 400
CTA → Noto Sans Gujarati / 600
```

English version:

``` text
Tradition,
made for a new generation.

A tradition of taste and trust since 1995.

[ Shop Now ]   [ Our Story ]
```

Typography:

``` text
Hero → DM Serif Display / 400
Supporting copy → Inter / 400
CTA → Inter / 600
```

------------------------------------------------------------------------

# 16. Product Typography

Gujarati:

``` text
કાજુ કતરી
શુદ્ધ કાજુથી તૈયાર કરેલી પરંપરાગત મીઠાઈ
₹620 / કિ.ગ્રા.
[ કાર્ટમાં ઉમેરો ]
```

English:

``` text
Kaju Katli
Traditional mithai crafted with cashews
₹620 / kg
[ Add to Cart ]
```

Recommended:

``` text
Product Name → UI family / 600
Description  → UI family / 400
Price        → UI family / 600–700
CTA          → UI family / 600
```

Prices must remain easy to scan in either language.

------------------------------------------------------------------------

# 17. Gujarati-First Component Rule

Every component must be tested with Gujarati FIRST.

This includes:

-   Header
-   Mega menu
-   Mobile menu
-   Search
-   Product cards
-   Product detail page
-   Filters
-   Sort
-   Cart drawer
-   Cart page
-   Checkout
-   Login
-   Account
-   Store locator
-   Forms
-   Toasts
-   Validation
-   Empty states
-   Error pages
-   Cookie/privacy UI
-   Footer

Do not approve a component only because the English layout fits.

Gujarati strings can occupy different widths and heights.

------------------------------------------------------------------------

# 18. Responsive Typography

Suggested implementation pattern:

``` css
.hero-title {
  font-size: clamp(2.625rem, 5vw, 5rem);
  line-height: 1.18;
}

.section-title {
  font-size: clamp(1.875rem, 3.2vw, 3rem);
  line-height: 1.25;
}

.body-lg {
  font-size: clamp(1.0625rem, 1.3vw, 1.25rem);
}
```

Adjust Gujarati line-height separately when needed.

Avoid arbitrary shrinking merely to force Gujarati into the same number
of lines as English.

------------------------------------------------------------------------

# 19. Font Loading Performance

Antigravity must:

-   Prefer WOFF2
-   Load only required weights
-   Avoid duplicate font requests
-   Use `font-display: swap`
-   Preload only genuinely critical font files
-   Cache font assets aggressively when self-hosted
-   Verify no layout-breaking font swap
-   Verify Gujarati glyphs do not fall back to an unintended system font

Performance must be checked on mobile connections.

------------------------------------------------------------------------

# 20. Accessibility Requirements

Typography must satisfy:

-   Minimum practical body size around 16px
-   Clear focus states
-   Sufficient text/background contrast
-   Zoom to 200% without loss of content
-   No information communicated solely by color
-   Proper semantic heading order
-   Real text rather than text rendered into images
-   Correct `lang` attributes
-   Screen-reader-friendly language switcher
-   Form errors in the currently selected language

Target WCAG 2.2 AA.

------------------------------------------------------------------------

# 21. SEO / Bilingual Requirements

Each locale should have localized:

-   Page title
-   Meta description
-   Heading structure
-   Product copy
-   Category copy
-   Structured data where appropriate
-   Alt text
-   Open Graph copy where appropriate

Use canonical URLs correctly.

Provide `hreflang` alternates for Gujarati and English versions.

Example concept:

``` html
<link rel="alternate" hreflang="gu-IN" href=".../gu/..." />
<link rel="alternate" hreflang="en-IN" href=".../en/..." />
```

Final production URLs must replace placeholders.

------------------------------------------------------------------------

# 22. Content Rules

Gujarati should feel natural and culturally fluent.

Do:

-   Write native Gujarati
-   Keep commerce labels concise
-   Maintain consistent terminology
-   Preserve product names customers actually recognize
-   Have final Gujarati reviewed by a fluent editor

Do not:

-   Machine-translate blindly
-   Mix Gujarati and English unnecessarily
-   Transliterate entire Gujarati sentences into Latin script
-   Force literal translations that sound unnatural
-   Put critical text inside promotional artwork

------------------------------------------------------------------------

# 23. Implementation Checklist for Antigravity

Before declaring typography/localization complete:

-   [ ] Noto Serif Gujarati installed/configured
-   [ ] Noto Sans Gujarati installed/configured
-   [ ] DM Serif Display installed/configured
-   [ ] Inter installed/configured
-   [ ] Only necessary weights loaded
-   [ ] Gujarati is default
-   [ ] English switcher works
-   [ ] Preference persists
-   [ ] Correct `html lang` value per locale
-   [ ] Gujarati tested on mobile
-   [ ] Gujarati tested on desktop
-   [ ] Navigation fits naturally
-   [ ] Product cards support both languages
-   [ ] Cart supports both languages
-   [ ] Checkout supports both languages
-   [ ] Forms/errors support both languages
-   [ ] SEO metadata localized
-   [ ] `hreflang` configured
-   [ ] Font loading optimized
-   [ ] No accidental Gujarati font fallback
-   [ ] Contrast tested
-   [ ] Keyboard navigation tested
-   [ ] 200% zoom tested
-   [ ] Real Gujarati copy reviewed before launch

------------------------------------------------------------------------

# 24. Final Typography Architecture

``` text
PATEL SWEET MART DIGITAL TYPE SYSTEM

CUSTOM GUJARATI WORDMARK
        ↓
Brand Recognition

NOTO SERIF GUJARATI
        ↓
Gujarati Heritage + Editorial Emotion

NOTO SANS GUJARATI
        ↓
Gujarati UI + Commerce + Readability

DM SERIF DISPLAY
        ↓
English Editorial Voice

INTER
        ↓
English UI + Commerce + Functional Clarity
```

------------------------------------------------------------------------

# 25. Non-Negotiable Direction

**Default experience = Gujarati.**

English is a complete secondary experience, not an afterthought.

The site should never feel like Gujarati text was pasted onto an English
template. Components, typography, spacing, content architecture, SEO,
and QA must all be designed bilingually from the beginning.

The desired result:

> **A Gujarati-first digital brand that feels culturally rooted,
> contemporary, premium, and internationally credible.**

------------------------------------------------------------------------

**Patel Sweet Mart --- Typography & Bilingual Website Specification
v1.0**\
**For Antigravity implementation**
