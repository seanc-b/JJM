# Inner pages build plan

Source mockups: `../Assets/Design from Anne/JJM website {ABOUT US_vf, BACKFLOW vf, PLUMBING vf, PM vf}.pdf` and `JJM Website CONTACT vf.pdf`. Each is one 1500 pt wide artboard. Photos are in `../Assets/website-assets/photos/<PAGE> images/`. Measurements below are in artboard points (1 pt = 1 px at a 1500 px wide viewport).

## The finding

Property Management, Plumbing, Backflow and About Us are **one template with different content**. Contact shares the top of that template and adds a form and a map. So the build is: one `ServicePage` template plus a content entry per page, then Contact on its own.

## Service page template (top to bottom)

1. **Header.** The existing `Header`, with the current page underlined (`aria-current="page"` on the matching nav link).
2. **Hero.** The home `Hero` at page height: 1500 × 806 (`clamp(560px, 53.73vw, 100svh)`) instead of `100svh`. Tinted photo, white 46 pt uppercase headline starting at x≈886 (col 8 of 12), emergency phone bottom-left and Instagram bottom-right as on home. Only About has a CTA button (Contact us).
3. **Section title band.** Full-bleed 2 px dotted rules above and below (top rule 58 below the hero, band ~76 tall), with the 44 px section icon and the page title centred between them: navy 700 uppercase, 40 pt.
4. **Intro.** A centred two-column block (left x 274–724, right x 774–1240, about 104 below the band). Left: the heading in a `.ruled` block (hairlines top and bottom), navy 700 uppercase 30 pt. Right: body paragraphs at 20 pt with a bold lead-in.
5. **Watermark.** The page's oversized 12% blue icon behind the band and intro, at 100% of its SVG size on the artboard:
   - Backflow: `bg-backflow.svg`, left 563, flush under the hero.
   - Plumbing: `bg-flame.svg`, left 513, flush under the hero, ~455 wide (114%).
   - Property Management: `bg-gear.svg`, left 521, top 178 below the hero, 449 wide.
   - About Us: the About section icon (four people around a gear) without its ring, ~1170 square, centred about 60 from the left edge and 674 below the hero, cropped by the viewport edge and the section bottom. New asset: `bg-about-team.svg`.
6. **Photo stack.** Full-width photos, each 1500 × 806 (cropped with object-cover), separated by ~24 white gaps.
7. **Tagline.** The footer's statement line (49 pt regular navy, centred), with per-page text.
8. **Footer.** The existing contact panel, nav strip and partner logos, with the current page bold in the nav strip.

## Per page content

| Page | Hero headline | Section title / icon | Intro heading | Photos (hero, then stack) | Tagline |
|---|---|---|---|---|---|
| Property Management | We specialize in property management services | Property Management Services / gear | Contact us today. | PM banner; PM 01, 02, 03 (Vancouver skyline) | Provide prompt, same-day emergency service. |
| Plumbing | We provide comprehensive plumbing, heating, HVAC, and A-gas services. | Plumbing, Heating & A-Gas Fitting / flame | We also offer customized preventative maintenance program | Plumbing banner; Plumbing 01, 02, 03 | We provide same-day service for urgent issues. |
| Backflow | Proud member of the BCWWA since 2007 | Backflow Certification / bookmark | No project is too small or too big for us | PIC-BG-Backflow-3; PIC-01 backflow, PIC-02 backflow (portrait, cropped) | We provide prompt, same-day service for urgent issues |
| About Us | We deliver high-quality service & precision installations (+ Contact us) | About Us / about | JJM has over 25 years of experience | About PIC-01 (process piping); vehicles, team crane | 25 years of experience & a qualified team. |

Copy for each page lives in `src/content/pages.ts`, taken verbatim from the PDFs. Each page is its own static route (`src/app/<slug>/page.tsx`) rendering `ServicePage`.

## Contact page (its own session)

Same hero (van photo, "Providing services across the Lower Mainland") and title band ("Let's talk", person icon). Then:
- Intro: heading "Contact us for more information"; right column is a label/value list (Office, General inquiries, Accounting, Address) instead of paragraphs. Watermark is a map pin with a flame inside (x 513, ~467 wide), which isn't in the icon folder.
- "Send us a message" title band (pen icon), then a form on a mist-tinted photo (`PIC-02-CONTACT-JJM-bg.jpg`): Name, Email address, Subject, Message (placeholder "We will get back to you as soon as possible."), Send button.
- "Find us" title band (flame icon), then a full-width map with a navy top bar and notch.
- Tagline: "We are located in Burnaby, BC. Lorem ipsum" (placeholder copy, needs real text).

Open items for Contact: the pin, person and pen icons must be exported from `JJM website CONTACT_vf.ai` (or drawn); the form needs a destination (deferred decision: email service or Payload); the map needs a provider (a Google Maps embed is simplest).

## Copy conflicts to confirm with Sean

- About says "over 25 years of experience" (Jay's career); the home About section says "over 20 years". Both can be true, but they read as a contradiction side by side.
- Plumbing says "A-gas" throughout; home was changed to "Gas fitting".
- The mockup's footer and contact labels spell "Adress"; the site uses "Address".
