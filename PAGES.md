# Inner pages build plan

Source mockups: `../Assets/Design from Anne/JJM website {ABOUT US_vf, BACKFLOW vf, PLUMBING vf, PM vf}.pdf` and `JJM Website CONTACT vf.pdf`. Each is one 1500 pt wide artboard. Photos are in `../Assets/website-assets/photos/<PAGE> images/`. Measurements below are in artboard points (1 pt = 1 px at a 1500 px wide viewport).

## The finding

Property Management, Plumbing, Backflow and About Us are **one template with different content**. Contact shares the top of that template and adds a form and a map. So the build is: one `ServicePage` template plus a content entry per page, then Contact on its own.

## Service page template (top to bottom)

1. **Header.** The existing `Header`, with the current page underlined (`aria-current="page"` on the matching nav link).
2. **Hero.** The home `Hero`, full viewport height (`100svh`, Sean 2026-11-08) although the mockups draw it 1500 × 806. Tinted photo, white 46 pt uppercase headline starting at x≈886 (col 8 of 12), emergency phone bottom-left and Instagram bottom-right as on home. Only About has a CTA button (Contact us).
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
| Plumbing | We provide comprehensive plumbing, heating, HVAC, and gas services. | Plumbing, Heating & Gas Fitting / flame | We also offer customized preventative maintenance program | Plumbing banner; Plumbing 01, 02, 03 | We provide same-day service for urgent issues. |
| Backflow | Proud member of the BCWWA since 2007 | Backflow Certification / bookmark | No project is too small or too big for us | PIC-BG-Backflow-3; PIC-01 backflow, PIC-02 backflow (portrait, cropped) | We provide prompt, same-day service for urgent issues |
| About Us | We deliver high-quality service & precision installations (+ Contact us) | About Us / about | JJM has over 20 years of experience | About PIC-01 (process piping); vehicles, team crane | 20 years of experience & a qualified team. |

Copy for each page lives in `src/content/pages.ts`, taken verbatim from the PDFs. Each page is its own static route (`src/app/<slug>/page.tsx`) rendering `ServicePage`.

## Contact page (built 2026-11-08, `src/app/contact/page.tsx`)

Same hero (`news-van.jpg`, the mockup's van photo, "Providing services across the Lower Mainland") and title band ("Let's talk", person icon). Then:
- Intro: `PageIntro` (shared with `ServicePage`) with "Contact us for more information" and a label/value list (Office, General inquiries, Accounting, Address), each a link. Watermark: `bg-pin.svg`, a map pin with the flame in a white disc, left 510, 112 below the hero, 470 wide. It runs down past the "Send us a message" band into the top of the form photo, so the pin, intro, band and form share one container and the pin sits above the photo but under the fields.
- "Send us a message" band (pen icon), 58 gap, then the form on `contact-form-ductwork.jpg` (greyscale, washed 80% with #dfe2ea): fields max 1228 wide, 92 top / 116 bottom padding. Name, Email address, Subject, then a white card holding the message box, a hairline and the Send button. `ContactForm` posts to the `sendMessage` server action (`src/app/contact/actions.ts`): Name, Email and Message are required, a honeypot catches bots, typed values survive an error.
- "Find us" band (flame icon), 50 gap, a 10px navy bar with a downward notch, then a keyless Google Maps embed (486 tall, slightly desaturated), lazy-loaded.
- Tagline: "We are located in Burnaby, BC." (the mockup ends in "Lorem ipsum").

Icons `section-person.svg`, `section-pen.svg` and `bg-pin.svg` are the designer's (`../Assets/website-assets/icons/`); the pin was supplied pre-tinted (#e8eef6) and is recoloured to blue at 12% opacity like the other watermarks, so its tip stays translucent over the form photo. The person icon also replaces the drawn placeholder in the header menu.

Still open for Contact:
- **Form delivery.** `deliver()` in `actions.ts` logs in development and reports failure in production (with the office email and phone), so nothing is dropped silently. Wire it to an email service or Payload before launch.
- The rest of the tagline sentence.
- The Google embed can't be styled to the mockup's pale blue; a styled map needs a Maps API key (or Mapbox).

## Copy decisions

- About and Plumbing follow the home page, not the mockups (Sean, 2026-11-08): "over 20 years" instead of "over 25 years", and "gas" / "Gas Fitting" instead of "A-gas" / "A-Gas Fitting".
- The mockup's footer and contact labels spell "Adress"; the site uses "Address".
