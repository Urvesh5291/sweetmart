# Patel Sweet Mart --- Mobile-First Website Experience Guide

## Antigravity Implementation Specification

**Brand:** પટેલ સ્વીટ માર્ટ / Patel Sweet Mart\
**Established:** 1995\
**Website:** Standalone Digital Flagship\
**Primary language:** Gujarati (`gu-IN`)\
**Secondary language:** English (`en-IN`)\
**Planning assumption:** Approximately 70% of website usage is expected
to be mobile\
**Version:** 1.0

> **Important:** The 70% figure is a planning assumption, not measured
> analytics. After launch, validate it with real traffic data and adjust
> priorities accordingly.

------------------------------------------------------------------------

# 1. Core Directive

Patel Sweet Mart must be designed **mobile-first**.

Do not create a desktop experience first and later compress it into a
phone layout.

The required workflow is:

``` text
Mobile Gujarati
      ↓
Mobile English
      ↓
Tablet
      ↓
Desktop
      ↓
Large Desktop
```

Every important feature must work beautifully on touch devices before
desktop enhancement is considered complete.

------------------------------------------------------------------------

# 2. Experience Priority

Planning priority:

``` text
MOBILE
~70% expected usage
PRIMARY EXPERIENCE

DESKTOP + TABLET
~30% expected usage
EXPANDED EXPERIENCE
```

This does **not** mean desktop receives poor quality.

It means that when design decisions conflict, optimize first for the
experience most visitors are expected to use.

------------------------------------------------------------------------

# 3. Mobile Experience Formula

``` text
Gujarati-first
+
Fast first experience
+
Large appetizing food photography
+
Readable Gujarati typography
+
Thumb-friendly navigation
+
Touch-first interaction
+
Short cinematic motion
+
Clear store/contact actions
+
Minimal friction
+
Excellent accessibility
=
PRIMARY PATEL SWEET MART EXPERIENCE
```

Desktop expands this foundation with:

``` text
More whitespace
Larger editorial compositions
Richer storytelling
Hover enhancements
Wider image compositions
More sophisticated motion
```

Desktop must never contain essential functionality that mobile cannot
access.

------------------------------------------------------------------------

# 4. Mobile-First Design Order

For every new page or component, Antigravity should work in this order:

1.  Define the content hierarchy.
2.  Design at a small mobile viewport.
3.  Test real Gujarati copy.
4.  Test touch interactions.
5.  Validate image crop and focal point.
6.  Validate performance.
7.  Test English.
8.  Expand to tablet.
9.  Expand to desktop.
10. Add desktop-only enhancement only if it adds value.

Never approve a component based only on a desktop screenshot.

------------------------------------------------------------------------

# 5. Mobile Breakpoint Strategy

Use content-driven breakpoints rather than blindly targeting device
models.

Suggested starting points:

``` css
/* Mobile-first base */
.component {}

/* Larger phones / small tablets */
@media (min-width: 640px) {}

/* Tablet */
@media (min-width: 768px) {}

/* Laptop */
@media (min-width: 1024px) {}

/* Desktop */
@media (min-width: 1280px) {}

/* Large desktop */
@media (min-width: 1536px) {}
```

Adjust breakpoints only when the content/layout actually requires it.

------------------------------------------------------------------------

# 6. Mobile Grid

Recommended mobile foundation:

``` text
4-column grid
16–20px side margins
12–16px gutters where appropriate
64–96px major section spacing
```

Do not make mobile layouts unnecessarily dense.

Premium mobile design still requires whitespace.

------------------------------------------------------------------------

# 7. Mobile Header

The header should remain extremely simple.

Recommended structure:

``` text
┌────────────────────────────┐
│ LOGO               GU/EN ☰ │
└────────────────────────────┘
```

Potential menu:

``` text
મીઠાઈ
નમકીન
ગિફ્ટિંગ
અમારી કહાની
સ્ટોર્સ
સંપર્ક
────────────
ગુજરાતી | English
```

Requirements:

-   Large tap areas
-   Clear close action
-   Keyboard accessible
-   Screen-reader accessible
-   No tiny text
-   No hover dependency
-   No overly complicated mega menu on mobile
-   Language switching always discoverable

------------------------------------------------------------------------

# 8. Mobile Hero

The hero should be designed independently for mobile.

Recommended flow:

``` text
પટેલ સ્વીટ માર્ટ

પરંપરાનો સ્વાદ.
નવી પેઢી માટે.

[ મીઠાઈ જુઓ ]

     ↓

PREMIUM
FOOD IMAGE
```

or an art-directed composition where typography and food coexist without
reducing readability.

## Requirements

-   Gujarati headline should be immediately readable.
-   Use dedicated mobile photography where necessary.
-   Avoid desktop image crops that cut off the food.
-   Keep CTA visible without excessive scrolling.
-   Do not use long intro animations.
-   Do not autoplay heavy background video by default without strong
    justification.
-   Preserve the visual impact even on slower mobile connections.

Preferred mobile hero image ratio:

``` text
4:5
```

A separate desktop `16:9` asset may be used.

------------------------------------------------------------------------

# 9. Mobile Typography

Gujarati remains the primary language.

Recommended mobile starting points:

  Role              Mobile Size Typeface
  --------------- ------------- ----------------------------
  Hero                 42--52px Noto Serif Gujarati 700
  H1                   36--44px Noto Serif Gujarati 700
  H2                   30--36px Noto Serif Gujarati 600
  H3                   24--28px Noto Serif Gujarati 600
  Product title        18--22px Noto Sans Gujarati 600
  Body                 16--18px Noto Sans Gujarati 400
  Button               15--17px Noto Sans Gujarati 600
  Caption              12--14px Noto Sans Gujarati 400/500

Do not shrink Gujarati merely to force it into the same line count as
English.

Use responsive `clamp()` values.

Example:

``` css
.hero-title {
  font-size: clamp(2.625rem, 11vw, 4rem);
  line-height: 1.18;
}
```

Always test with real Gujarati strings.

------------------------------------------------------------------------

# 10. Touch Target Rules

Interactive elements must be comfortable for thumbs.

Recommended minimum practical target:

``` text
44 × 44 CSS pixels or larger
```

For primary mobile actions, often use approximately:

``` text
48–56px control height
```

Provide sufficient space between adjacent controls.

Never create tiny icon-only controls without accessible labels.

------------------------------------------------------------------------

# 11. Thumb-Friendly Interaction

High-frequency actions should be easy to reach.

Potential high-value actions:

``` text
Menu
Language
WhatsApp
Call
Directions
Enquiry
Explore Collection
```

Avoid placing every important action exclusively in the top corners.

For selected business pages, a restrained bottom action area may be
considered:

``` text
[ WhatsApp ]   [ Call ]
```

Do not allow sticky UI to obscure meaningful page content.

------------------------------------------------------------------------

# 12. No Hover Dependency

Every experience must function without hover.

Desktop hover may enhance:

``` text
Product cards
Navigation
Image previews
Cursor states
```

But mobile must receive an equivalent tap/swipe/static experience.

Never hide essential information exclusively behind `:hover`.

------------------------------------------------------------------------

# 13. Mobile Motion Strategy

Mobile motion should be lighter than desktop.

Use:

``` text
MICRO
120–220ms
Buttons / controls

STANDARD
200–350ms
Menus / cards / drawers

EDITORIAL
350–600ms
Section reveals

SELECTED CINEMATIC
500–800ms
Only high-value storytelling
```

Avoid long chained sequences.

------------------------------------------------------------------------

# 14. Mobile Animation Rules

Use motion for:

-   hierarchy
-   orientation
-   feedback
-   storytelling
-   brand character

Avoid:

-   scroll hijacking
-   excessive parallax
-   constant floating elements
-   huge blur effects
-   cursor effects
-   unnecessary 3D
-   long pinned scroll scenes
-   effects that make touch scrolling feel delayed
-   animations that delay CTA access

Mobile should feel **silky**, not heavy.

------------------------------------------------------------------------

# 15. Reduced Motion

Respect:

``` css
@media (prefers-reduced-motion: reduce) {
  /* Remove or simplify non-essential motion */
}
```

The entire website must remain usable and understandable without
cinematic effects.

------------------------------------------------------------------------

# 16. Mobile Image Strategy

Never use one desktop asset everywhere.

For major imagery create:

``` text
Mobile Hero       4:5
Desktop Hero      16:9
Square            1:1
Category          4:5
Product           1:1 / 4:5
Wide Editorial    3:2 or 16:9
```

Use `<picture>` and responsive sources where appropriate.

Example concept:

``` html
<picture>
  <source
    media="(max-width: 767px)"
    srcset="/images/hero-mobile.avif"
  />
  <img
    src="/images/hero-desktop.avif"
    alt="..."
  />
</picture>
```

Use framework image optimization in the actual implementation.

------------------------------------------------------------------------

# 17. Mobile Image Performance

Requirements:

-   AVIF/WebP where appropriate
-   Correct intrinsic dimensions
-   Responsive source sizes
-   No enormous desktop source on small phones
-   Lazy-load below-fold media
-   Prioritize only critical above-fold imagery
-   Avoid layout shift
-   Preserve high-quality food texture
-   Use CDN/image optimization

Premium does not mean oversized files.

------------------------------------------------------------------------

# 18. Mobile Product Discovery

Do not show tiny four-column product grids.

Preferred:

``` text
1-column editorial feature
or
2-column product grid
or
horizontal swipe collection where justified
```

Example:

``` text
અમારી લોકપ્રિય મીઠાઈ

┌──────────┐  ┌──────────┐
│  IMAGE   │  │  IMAGE   │
│          │  │          │
├──────────┤  ├──────────┤
│ કાજુ...  │  │ લાડુ...  │
└──────────┘  └──────────┘
```

Food photography must remain large enough to create appetite.

------------------------------------------------------------------------

# 19. Mobile Category Discovery

A strong option:

``` text
મીઠાઈ
[ FULL-WIDTH IMAGE ]
Explore →

નમકીન
[ FULL-WIDTH IMAGE ]
Explore →

ગિફ્ટિંગ
[ FULL-WIDTH IMAGE ]
Explore →
```

Another option is a touch-friendly horizontal carousel.

Do not create interaction solely for novelty.

------------------------------------------------------------------------

# 20. Mobile Heritage Story

The "Since 1995" experience should be simplified for vertical scrolling.

Example:

``` text
1995
 │
 ● Origin
 │
 │
 ● Growth
 │
 │
 ● New generation
 │
 │
 ● Today
```

Use real, verified milestones.

Do not force the user through a long pinned horizontal timeline.

Desktop can use a more cinematic version.

------------------------------------------------------------------------

# 21. Mobile Gifting Experience

Gifting should prioritize:

``` text
Strong image
Short Gujarati headline
Occasion/category
Simple description
Clear enquiry action
```

Potential actions:

``` text
ગિફ્ટિંગ વિશે પૂછો
WhatsApp
Call
```

Do not bury contact behind multiple screens.

------------------------------------------------------------------------

# 22. Mobile Contact Experience

Contact is a key conversion path.

Make these extremely easy:

``` text
WhatsApp
Phone
Directions
Enquiry
Store hours
Address
```

Use native capabilities where appropriate:

``` text
tel:
maps/directions links
messaging/contact links
```

Verify all real business details before launch.

------------------------------------------------------------------------

# 23. Mobile Forms

Forms should:

-   use one column
-   use appropriate input types
-   support autofill
-   use clear Gujarati labels
-   avoid unnecessary fields
-   show errors beside relevant fields
-   use comfortable control heights
-   avoid resetting data after errors
-   work with mobile keyboards
-   use server-side validation

Never use placeholder text as the only label.

------------------------------------------------------------------------

# 24. Mobile Language Switching

The switcher must be accessible from the header/menu.

``` text
ગુજરાતી | English
```

Changing language should:

-   preserve the equivalent page
-   preserve user context
-   update `lang`
-   update content
-   update metadata where applicable
-   save the preference

Gujarati remains default for first-time visitors under the agreed brand
strategy.

------------------------------------------------------------------------

# 25. Mobile Navigation Depth

Avoid deeply nested mobile menus.

Target:

``` text
Home
Mithai
Namkeen
Gifting
Our Story
Stores
Contact
```

Subcategories can appear after entering a category or through a concise
expandable group.

The customer should not navigate through four menu layers.

------------------------------------------------------------------------

# 26. Mobile Scroll Rhythm

Use alternating visual intensity:

``` text
Cinematic
    ↓
Calm
    ↓
Product
    ↓
Whitespace
    ↓
Story
    ↓
Image
    ↓
CTA
```

Do not create 12 consecutive full-screen animated sections.

The page needs breathing room.

------------------------------------------------------------------------

# 27. Mobile Performance Budget Philosophy

Performance must be treated as a design requirement.

Prioritize:

``` text
Low initial JavaScript
Fast server response
Optimized critical fonts
One prioritized hero asset
Responsive images
Deferred animation code
Minimal third-party scripts
Efficient CMS queries
Static generation/caching where appropriate
```

Measure performance on realistic mobile conditions, not only a
developer's desktop.

------------------------------------------------------------------------

# 28. JavaScript Strategy

Do not hydrate every section unnecessarily.

Prefer:

``` text
Server-rendered content
Static HTML
CSS interaction
Progressive enhancement
```

Use client-side JavaScript for:

``` text
Menu
Language interaction where required
Forms
Carousels
Complex motion
Interactive storytelling
```

Load heavy animation logic only where it is actually used.

------------------------------------------------------------------------

# 29. Font Loading on Mobile

Required families:

``` text
Noto Serif Gujarati
Noto Sans Gujarati
DM Serif Display
Inter
```

But do not blindly load every family/weight on initial render.

Use only required weights.

Prefer WOFF2.

Use:

``` css
font-display: swap;
```

Preload only genuinely critical font resources.

Gujarati glyph coverage must remain complete.

------------------------------------------------------------------------

# 30. Mobile Accessibility

Target WCAG 2.2 AA.

Test:

-   keyboard where applicable
-   screen readers
-   text scaling
-   200% zoom
-   orientation
-   focus
-   contrast
-   touch targets
-   reduced motion
-   form labels
-   language metadata
-   alt text

Do not rely on gestures without visible alternatives.

------------------------------------------------------------------------

# 31. Device Testing Matrix

Do not test only inside browser responsive mode.

Use real devices where possible.

Test categories:

``` text
Budget Android
Mid-range Android
Flagship Android
Recent iPhone
Older supported iPhone
Tablet
```

Pay special attention to the devices actually used by the business
audience once analytics are available.

Test both:

``` text
Wi-Fi
Slower mobile connection
```

------------------------------------------------------------------------

# 32. Browser Testing

Prioritize current mobile browsers relevant to the audience, including:

``` text
Chrome Android
Safari iOS
Other materially used browsers revealed by analytics
```

Desktop browser testing remains required.

------------------------------------------------------------------------

# 33. Mobile SEO

Gujarati content must remain real HTML.

Do not put primary headings inside images.

Ensure:

``` text
Correct H1
Correct lang
Localized title
Localized description
Canonical
hreflang
Structured data where applicable
Crawlable navigation
Descriptive alt text
```

------------------------------------------------------------------------

# 34. Mobile Analytics

After launch, validate the 70% assumption.

Segment analytics by:

``` text
Device category
Viewport
Language
Browser
Connection/performance where available
Page type
Traffic source
```

Measure:

``` text
Mobile share
Mobile engagement
WhatsApp clicks
Call clicks
Directions
Enquiries
Product views
Gifting engagement
Language selection
Core Web Vitals
```

If actual traffic differs from the planning assumption, update
priorities based on evidence.

------------------------------------------------------------------------

# 35. Core Web Vitals

Treat mobile Core Web Vitals as a release criterion.

Focus on:

``` text
LCP
INP
CLS
```

Typical causes to prevent:

``` text
Oversized hero images
Font delays
Heavy animation JS
Layout shifts
Third-party scripts
Long main-thread tasks
Poorly sized media
```

Do not hide poor loading behind a preloader.

------------------------------------------------------------------------

# 36. Mobile QA Checklist

Before approving any page:

-   [ ] Designed in Gujarati first
-   [ ] English version tested
-   [ ] Works around 320px width where support is required
-   [ ] Works on common modern phone widths
-   [ ] No horizontal overflow
-   [ ] Gujarati does not clip
-   [ ] Tap targets are comfortable
-   [ ] No hover-only functionality
-   [ ] Menu works
-   [ ] Language switch works
-   [ ] Images crop correctly
-   [ ] Hero loads efficiently
-   [ ] No excessive animation
-   [ ] Reduced-motion works
-   [ ] Forms work with mobile keyboard
-   [ ] WhatsApp/contact works
-   [ ] Phone action works
-   [ ] Directions work
-   [ ] Text is readable
-   [ ] Focus states exist
-   [ ] Screen-reader semantics reviewed
-   [ ] Core Web Vitals tested
-   [ ] Real-device QA performed

------------------------------------------------------------------------

# 37. Desktop Enhancement Rules

After mobile is excellent, desktop may add:

``` text
Wider editorial grids
Large negative space
Advanced image compositions
Hover previews
Subtle custom cursor states
More complex storytelling
Expanded navigation
Richer GSAP sequences
Larger typography
```

But:

> **Desktop enhancements must never become mobile requirements.**

------------------------------------------------------------------------

# 38. Antigravity Non-Negotiable Rules

Antigravity MUST:

1.  Start every important page in mobile Gujarati.
2.  Treat the expected \~70% mobile usage as the primary planning
    assumption.
3.  Validate that assumption after launch.
4.  Never build desktop first and simply shrink it.
5.  Never depend on hover.
6.  Use dedicated mobile image crops.
7.  Keep Gujarati readable.
8.  Keep touch targets generous.
9.  Minimize mobile JavaScript.
10. Lazy-load non-critical media.
11. Respect reduced-motion.
12. Avoid scroll-jacking.
13. Keep contact actions obvious.
14. Test real devices.
15. Measure mobile performance.
16. Keep desktop equally polished but progressively enhanced.
17. Never trade usability for award-style animation.
18. Treat mobile performance as part of the brand experience.

------------------------------------------------------------------------

# 39. Final Priority Model

``` text
                PATEL SWEET MART
                       │
              MOBILE-FIRST CORE
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   GUJARATI        PERFORMANCE       TOUCH UX
   DEFAULT             FIRST           FIRST
       │               │               │
       └───────────────┼───────────────┘
                       │
                BRAND EXPERIENCE
                       │
              CINEMATIC MOTION
                 WHEN USEFUL
                       │
               DESKTOP EXPANSION
```

------------------------------------------------------------------------

# 40. Final Directive

Patel Sweet Mart's mobile website must not feel like a smaller version
of the desktop website.

It should feel like the **primary Patel Sweet Mart digital experience**.

A visitor opening the website on a phone should immediately experience:

``` text
The Brand
The Food
The Gujarati Identity
The Heritage
The Quality
The Gifting
The Store
The Next Action
```

with minimal friction.

The desired result is:

> **A fast, beautiful, Gujarati-first, touch-first digital flagship that
> feels premium on the device most customers are expected to use.**

------------------------------------------------------------------------

**Patel Sweet Mart --- Mobile-First Website Experience Guide v1.0**
