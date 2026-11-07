---
name: JJM Mechanical Group
description: A mechanical contractor's portfolio that earns trust by showing the work at full bleed, navy on photographs, white between them.
colors:
  navy: "#17355d"
  blue: "#3f74b7"
  cobalt: "#204185"
  sky: "#129cd8"
  ink: "#3e4d5d"
  mist: "#c3c8d5"
  frost: "#e9ecf2"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.6vw, 3.05rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3.3vw, 3.05rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.1vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.005em"
  statement:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.7vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0em"
  body:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
  button:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.12em"
  fine:
    fontFamily: "Work Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: "0em"
rounded:
  none: "0px"
  focus: "2px"
  pill-tab: "6px"
  full: "9999px"
spacing:
  xs: "12px"
  sm: "20px"
  md: "28px"
  lg: "32px"
  xl: "48px"
  header: "84px"
  section: "clamp(56px, 7vw, 110px)"
  panel: "clamp(36px, 5vw, 72px)"
  gutter: "clamp(20px, 5vw, 80px)"
  column-gap: "clamp(24px, 3.5vw, 52px)"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline-light-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
  button-solid:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-solid-hover:
    backgroundColor: "{colors.navy}"
  play-tag:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  play-tag-hover:
    backgroundColor: "{colors.navy}"
  contact-chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  contact-chip-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
  header-pill:
    backgroundColor: "rgba(23, 53, 93, 0.8)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill-tab}"
    padding: "10px 24px"
  menu-panel-links:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    padding: "32px clamp(20px, 4vw, 44px)"
  menu-panel-tagline:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    padding: "40px clamp(20px, 4vw, 44px)"
  news-title-plate:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
  placeholder-tag:
    backgroundColor: "#fcd34d"
    textColor: "#451a03"
    rounded: "{rounded.focus}"
    padding: "2px 6px"
---

# Design System: JJM Mechanical Group

## Overview

**Creative North Star: "The Plant Room at Full Bleed"**

The system reproduces the client designer's desktop mockup and extends it down to mobile. Its whole argument is made by alternation: photographs of JJM's own installations run edge to edge under a navy multiply tint with a white uppercase headline sitting right of centre, and between them the page returns to plain white sections where a navy heading, a brand-blue section icon, a paragraph of ink-grey body and one outlined pill button sit left of a framed photo. Nothing on the page is a tile, a card with a shadow, a stat, a testimonial or a sticky call to action. Trust is carried by the photography and by the restraint around it.

Density is low and the rhythm is long. Sections breathe with clamp()-driven padding, hairlines rather than boxes separate things, and the only ornament is the brand's own icon set, repeated oversized at 12% opacity behind each service section. Work Sans does every job: bold caps for display, regular for body, semibold tracked caps for labels and navigation, light for the copyright line.

Motion is the second material. Lenis smooths the scroll; headline lines rise from clipped boxes; photos wipe open from the bottom and settle from a slight zoom; heading hairlines draw in from the left; the services marquee reads scroll velocity and reverses with the visitor. Every one of these has a reduced-motion state in which the page is simply still and complete.

**Key Characteristics:**
- Alternating full-bleed navy photo banners and white editorial sections
- One typeface, Work Sans, in five weights; headings in uppercase bold
- Hairline and dotted rules in translucent brand blue instead of boxes or shadows
- Outlined pill buttons whose label slides up on hover
- Oversized brand icons at 12% opacity as section backdrops
- Scroll choreography (rise, wipe, parallax, drawn rules, velocity marquee) with full reduced-motion fallbacks

## Colors

Two blues on white, with a grey ink for reading and two cool greys reserved for the footer panels.

### Primary
- **JJM Navy** (`{colors.navy}`): the ground under every photograph (as a multiply tint), the colour of every heading and headline on white, the compact header pill at 80% opacity, the right-hand menu panel, the scrollbar thumb, and the hover fill of the dark outlined button and the contact chips.
- **Brand Blue** (`{colors.blue}`): the accent. Section icons, the oversized 12% background icons, the hairline and dotted rules (at 40–45% opacity), the news source name, the solid Play tag, the small phone roundel, the left-hand menu panel, text selection and the focus ring.

### Secondary
- **Cobalt** (`{colors.cobalt}`) and **Sky** (`{colors.sky}`): secondary icon-set colours. They appear only inside the About section icon SVG and are declared as tokens so future icons can match. Do not use them for UI chrome or text.

### Neutral
- **Ink** (`{colors.ink}`): body text, the subtitle and date on news cards, contact-chip labels, partner names and the copyright line. Body copy is ink, never navy.
- **Mist** (`{colors.mist}`): the contact panel background in the footer, carrying white contact chips.
- **Frost** (`{colors.frost}`): the footer navigation strip, and the placeholder ground behind a photo while it loads.
- **White** (`{colors.white}`): page background, all text on photographs, the chip faces on mist, the news-title plate on photos.

### Named Rules
**The Tint Rule.** Every photograph that carries text is tinted: a navy ground plus a left-to-right navy gradient (35% to 70%) in multiply blend at 85% opacity. Text on photos is white only.
**The Translucent Blue Line Rule.** Rules are never a solid colour. Hairlines are brand blue at 45% (or white at 35% on photos); dotted rules are brand blue at 40%. Full-strength blue is reserved for icons, fills and the accent text.
**The Ink Body Rule.** Headings are navy, body is ink. The one deliberate exception is the bold lead-in phrase of a service paragraph, which is black.

## Typography

**Display Font:** Work Sans (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Work Sans (same)
**Label Font:** Work Sans (same)

**Character:** One grotesque in five weights (300, 400, 500, 600, 700) loaded through next/font. Headings are bold uppercase with a tight 1.04 line height and a hair of negative tracking; everything small is semibold uppercase and tracked out. Body is regular and roomy. The contrast comes from case, weight and tracking, never from a second family.

### Hierarchy
- **Display** (700, `clamp(2.1rem, 4.6vw, 3.05rem)`, 1.04, uppercase, balanced wrap): the hero headline only. Lines are authored as explicit spans and rise one by one on load.
- **Headline** (700, `clamp(1.7rem, 3.3vw, 3.05rem)`, 1.04, uppercase): banner headlines on tinted photos. Same `.display` style, slightly smaller floor.
- **Title** (700, `clamp(1.5rem, 2.1vw, 1.9rem)`, 1.04, uppercase, navy): service section headings inside a ruled block, with the section icon at the right. The News heading uses the same style at `clamp(1.5rem, 2.6vw, 2.5rem)`; the menu tagline uses it at 1.25–1.375rem with 1.15 line height.
- **Statement** (400, `clamp(1.6rem, 3.7vw, 3.5rem)`, 1, navy, sentence case): the services marquee, and the footer's same-day line at `clamp(1.5rem, 3.2vw, 3rem)` with line-height 1.25. Large, regular weight, not uppercase.
- **Body** (400, `clamp(1.1rem, 1.6vw, 1.5rem)`, 1.45, ink, max 42ch): service paragraphs. The lead-in phrase is bold black.
- **Label** (600, 0.8125rem, 0.08em, uppercase): hero bottom strip, contact-chip labels, partner names, news dates (tabular-nums). Navigation uses the same weight at 0.8125–0.875rem with 0.06em tracking; the menu links are 700 at 0.9375rem.
- **Button** (500, 0.8125rem, 0.12em, uppercase): pill button labels. The Play tag uses 600 at 0.14em.
- **Fine** (300, 0.75rem, ink): the copyright line only.

### Named Rules
**The One Family Rule.** Work Sans is the only typeface. No display face, no mono, no system fallback showing by design.
**The Caps Hierarchy Rule.** Anything that is a heading, a nav item, a label or a button is uppercase. Body copy, the marquee, the same-day statement, email addresses, phone numbers and the Instagram handle are not.

## Layout

The page is one column of full-width bands. Each band is either full-bleed (hero, banners, marquee, footer panels, the edge-to-edge dotted rules around News) or a `.site` container: `width: min(100% - 2 * clamp(20px, 5vw, 80px), 1500px)`, centred. Inside a container the grid is 12 columns. Text sits in columns 1–4 (lg) or 1–5 (md); the framed photo in columns 8–12 (lg) or 7–12 (md); the hero and banner headlines start at column 7 (hero, lg), 8 (right-aligned banner) or 7 (centred banner) and span 5–6 columns. Below md everything stacks in a single column with a 48px row gap.

Vertical rhythm is fluid: service sections pad `clamp(56px, 7vw, 110px)`; the News section pads `clamp(40px, 5vw, 72px)` below only (its top rule follows the marquee's own padding) and the same-day statement pads `clamp(36px, 5vw, 72px)`; the contact panel `clamp(36px, 4vw, 56px)`; the marquee `clamp(28px, 3.4vw, 52px)`. Within a text column the steps are 16px (ruled block padding), 28px (heading to paragraph), 32px (paragraph to button). The header bar is 84px tall and the hero reserves it with top padding. The hero is `100svh` with a 640px floor; banners are `clamp(440px, 46vw, 720px)` tall.

Breakpoints are Tailwind defaults: sm 640 (hero icon links and "Stay connected" text appear), md 768 (two-column grids, two-panel menu), lg 1024 (primary nav replaces the hamburger), xl 1280 (nav type steps to 0.875rem). Photo aspect ratios are per section (5:6, 1:1, 3:2, 5:7) so the right column varies in height while the text column stays put.

## Elevation & Depth

The system is flat. Depth is tonal and photographic: navy photographs against white sections, white chips on mist, the frost strip under mist. Hairlines and dotted rules separate; nothing is boxed or lifted. Photos gain depth only through motion (the `.frame` hover scale to 1.035 over 1.1s, the wipe-and-settle on entry, slow parallax of 9–14%).

### Shadow Vocabulary
- **Pill float** (`box-shadow: 0 12px 40px -12px rgba(23,53,93,0.6)` with `backdrop-filter: blur(12px)`): the compact header pill only, so it reads as sitting over the page it floats on. No other element carries a shadow.

### Named Rules
**The No-Box Rule.** Content is never placed in a bordered or shadowed card. Separate with a hairline, a dotted rule, a change of ground (white, mist, frost, navy photo) or whitespace.

## Shapes

Square by default: photographs, news cards, contact chips, the Play tag, the news-title plate and the menu panels all have 0 radius. Two round forms carry the brand: the fully rounded pill button (`{rounded.full}`) and the small round roundels (phone icon on blue, menu-link icon on white, marquee bullet). The compact header pill hangs from the top edge with only its bottom corners rounded (`{rounded.pill-tab}`, 6px). The focus ring and the placeholder tag use a 2px radius. Photos are clipped rectangles (`overflow: hidden`) whose image scales inside the frame; the wipe is a `clip-path: inset()` on the same rectangle.

Lines are the signature geometry: 1px solid hairlines (blue 45% on white, white 35% on the hero header) and 2px dotted rules (blue 40%; white 40% dividing the menu links). The service heading sits between two hairlines that draw in from the left (`.ruled`, `--rule` 0 to 1, transform-origin left).

## Components

### Buttons
Quiet, outlined, pill-shaped; the only "button" on a white section is one of these, and there is one per section.
- **Shape:** fully rounded pill (9999px), 1px border, padding 12px 24px, label 0.8125rem / 500 / 0.12em uppercase.
- **Outline (dark, default):** transparent, navy text, border navy at 45%. Hover: navy fill, white text, full navy border. Optional trailing 16px stroke icon (plus) with 8px gap.
- **Outline (light):** on photos. Transparent, white text, border white at 80%. Hover: white fill, navy text.
- **Solid:** blue fill, white text; hover navy. Defined in the component but not used on the home page.
- **Hover / Focus:** colours transition 500ms; the label slides up out of a clipped box while an identical twin slides in from below (500ms, expo-out). Focus is the global 2px blue outline offset 3px.

### Play tag
A square blue tag (`play-tag`), 8px 16px, 0.8125rem / 600 / 0.14em uppercase white, with a 14px filled play glyph that nudges 2px right on hover; hover fill navy. Sits right-aligned under each news card.

### News card
- **Corner Style:** square.
- **Header:** a 1px blue-40% hairline on top, then the source in blue uppercase medium at `clamp(1.25rem, 1.9vw, 1.8rem)`, the subtitle in ink 0.9375rem, the date in ink semibold tabular 0.8125rem right-aligned (wraps under on mobile).
- **Media:** 16:9 `.frame` on navy, photo object-cover, a bottom-half navy-60% gradient, and the title set bold navy on white plates (`box-decoration-clone`, 4px 10px, line-height 1.55) at bottom-left. The whole media block is one link to the video.
- **Internal spacing:** 12px between header, media and the Play row; cards sit in a two-column grid with `clamp(24px, 3.5vw, 52px)` column gap and 48px row gap.

### Banner
A full-bleed navy section `clamp(440px, 46vw, 720px)` tall: `.tint`ed photo scaled 1.14 with 9% parallax, and a `.display` headline in white at `clamp(1.7rem, 3.3vw, 3.05rem)` whose lines rise on entry. Headline column starts at 8 (right) or 7 (centre) on lg.

### Services (pinned scroller, md and up with motion)
One `100svh` white band pinned for 0.85vh of scroll per photo (12 photos plus a 0.35-step hold), scrubbed at 0.8. Left column (cols 1–4/5), vertically centred: the four text blocks stacked in one grid cell, each a `.ruled` block with the uppercase navy title and 44px section icon, a 42ch paragraph with a bold black lead-in, and a dark outline button with a plus icon; only the active one is visible. At each service boundary the outgoing text fades up 20px over 0.2 steps, the incoming fades in from 24px below over 0.3 steps, its hairlines draw in over 0.35, and the oversized background icon (left of the column, 30vw max 460px) crossfades with a 0.9→1 scale. Right: a full-height stage from 43% of the viewport to its right edge, with no frame. Each photo keeps its real proportions (66% of the stage wide if portrait, 80% if landscape, 92% if panoramic, capped at 92svh tall) and is anchored to a corner, cycling bottom-right, top-left, bottom-left, top-right, with `transform-origin` at that corner. Each step rests for 0.25, then hands over: the current photo scales 1→0.3 into its corner over 0.6 (`power2.inOut`), fading only in the last fifth, while the next scales 0.3→1 out of its own corner, starting 0.15 later and opaque within its first fifth, so the two cross on screen. Bottom-left of the column, a progress rail of the four service names in 0.75rem caps with a leading hairline that grows from 12px to 28px on the active one; each is a button that scrolls to that service.

### Services (accordion, below md or reduced motion)
Full-width list inside `.site` with blue hairlines between items. Each header is a button: 40px section icon, uppercase navy title at `clamp(1.1rem, 3.5vw, 1.5rem)`, blue chevron that rotates 180°. The first item opens by default and only one is open at a time. Panels animate `grid-template-rows: 0fr → 1fr` over 600ms expo-out, with the body fading in 150ms later: the paragraph, the outline button, then the three photos stacked at 4:3 (three across at md). Closed panels are `inert`.

### Contact chip
White rectangle, 10px 20px, on the mist panel: a `label` in ink then the value in bold navy at `clamp(1rem, 1.3vw, 1.3rem)`, baseline-aligned with 12px gap, wrapping on narrow screens. Linked chips invert to navy with white text on hover (400ms). The Instagram line and the Emergency line beside them are unchipped navy text that dims to 70% on hover.

### Marquee
A full-width band between two edges of the page with a 2px dotted blue-40% bottom rule. Three service names in navy regular at `clamp(1.6rem, 3.7vw, 3.5rem)`, each followed by a 0.22em navy dot, duplicated once for the loop. Drifts left at a 60s period; scroll velocity boosts it up to 4.5x and scrolling up reverses it; it pauses off-screen. Reduced motion: a single centred, wrapping copy with the dots inline.

### Navigation
- **Hero header:** absolute over the hero, 84px tall, white, bottom hairline white at 35%. White logo left (42–46px tall), five uppercase semibold links centre-right (lg+) with a 1.5px underline that grows from the left on hover and on the current page, mail and phone stroke icons right (sm+), hamburger below lg.
- **Compact header pill:** fixed top-centre, slides down after 55% of the viewport is scrolled (700ms, expo-out). Navy at 80% with 12px backdrop blur, bottom corners 6px, 10px 24px padding, white "JJM" wordmark 22px tall and a menu / close toggle.
- **Two-panel menu:** a modal dialog over a navy-30% blurred scrim; `min(92vw, 820px)` wide, two columns from md. Left panel blue: the five links in white bold 0.9375rem uppercase, divided by white-40% dotted rules, each with a 32px white roundel holding the section icon; links turn navy on hover and the roundel scales 1.1. Right panel navy: the tagline in `.display` at 1.25–1.375rem over a brightened background flame. Panels wipe open from the bottom (900ms, 60ms stagger) and items rise 18px (50ms stagger). Escape closes, focus moves to the first link and returns to the opener, everything else is inert and Lenis stops.

### Placeholder tag
A development-only marker, not a brand element: amber ground, dark amber uppercase 0.625rem / 600 / 0.12em text, 2px radius, title attribute "Placeholder content: replace before launch". Currently on both news cards, all seven partner names and the Contact menu link (which uses a drawn person icon because no icon was supplied). Remove, do not restyle, when the real asset lands.

### Icons
Two families. Brand icons are supplied SVG files (four 40–44px section icons in brand blue, with cobalt and sky inside the About mark; four oversized background icons in blue at 12%; the circular JJM mark in white at 25%, `/icons/bg-jjm-mark.svg`, as the contact panel's watermark: 165% of the panel height, bleeding off the right edge, with an 8% parallax, 110% tall below md). UI icons are inline 24-grid strokes at 1.6 (2 for menu/close) in currentColor: mail, phone, Instagram, menu, close, play (filled), plus, arrow, person.

### Imagery treatment
Photographs are JJM's own jobs, object-cover, never stock. On navy bands they are `.tint`ed (navy multiply) and over-scaled 1.12–1.14 to leave room for parallax. On white they sit in a `.frame`: square, clipped, frost ground while loading, 1.035 scale on hover over 1.1s expo-out (hover-capable devices only).

### Motion grammar
Easing is expo-out everywhere (`cubic-bezier(0.16, 1, 0.3, 1)` in CSS, `expo.out` in GSAP); quart-out is declared but unused. Lenis runs the scroll (lerp 0.09, touch 1.4x) and drives ScrollTrigger from GSAP's ticker. Elements opt in by attribute: `data-reveal` fades and rises 28px once (1.1s; "load" variant after 0.7s on mount, otherwise at 92% of the viewport, 90ms stagger); `data-rise` lifts each headline line from 115% inside a clipped span (1.3s, 90ms stagger; "load" after 0.25s, otherwise at 85%); `data-rules` draws the `.ruled` hairlines (1.4s at 88%); `data-wipe` clears `clip-path: inset(0 0 100% 0)` while the image settles from 1.18 (1.4s / 1.6s at 82%); `data-parallax="n"` scrubs the child from -n% to +n% of its height across its parent's scroll. Initial hidden states are applied only under `html.motion`, which an inline head script adds before paint when the visitor allows motion. Under `prefers-reduced-motion: reduce` Lenis is not created, GSAP's matchMedia block does not run, all transitions and animations collapse to 0.001ms, and the marquee becomes a static wrapped line.

## Do's and Don'ts

### Do:
- **Do** alternate full-bleed navy-tinted photo bands with white editorial sections; the alternation is the page structure.
- **Do** set every heading in Work Sans 700 uppercase at 1.04 line height, navy on white and white on photos.
- **Do** separate content with 1px blue-45% hairlines or 2px dotted blue-40% rules, never with boxes.
- **Do** use the outlined pill button, one per section, with its sliding label and expo-out timing.
- **Do** give every motion a reduced-motion state in which the content is fully visible and still.
- **Do** keep body copy in ink at 42ch or less, with any bold lead-in in black.
- **Do** place a brand icon at full strength beside a heading and its oversized 12% twin behind the section.

### Don't:
- **Don't** add a second typeface, a monospace or a system display face.
- **Don't** put shadows on anything other than the compact header pill, or use bordered cards, stat tiles, testimonial cards or sticky calls to action.
- **Don't** use cobalt or sky outside the icon artwork.
- **Don't** set text on an untinted photograph.
- **Don't** round the corners of photographs, chips, tags or panels; only pills, roundels and the header pill's bottom edge are round.
- **Don't** canonise the amber placeholder tag as a brand colour; it exists to be removed.
