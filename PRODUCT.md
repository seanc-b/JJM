# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: Next.js (App Router) with Payload CMS 3. The client requires Payload, and Payload 3 runs inside a Next.js app, so this gives one codebase for the site, the admin panel and the content API. Hosting and deployment are not decided yet. A staging environment for client review is required either way.

## Users

Primary visitors are B2B: property management companies, commercial property owners, building managers, existing clients and potential business partners. Residential clients are a secondary audience.

Typical situations:
- An existing client is looking up a service, a phone number or an email.
- A property manager is checking whether JJM can handle their buildings' mechanical systems.
- A potential commercial partner is researching the company.
- A visitor wants to understand JJM's services, qualifications and experience.

## Product Purpose

The marketing site for JJM Mechanical Group, a plumbing and mechanical contractor in Burnaby, BC, serving residential and commercial clients across Metro Vancouver and the Lower Mainland. Jay Mallan founded the company in 2012. Site copy states "over 20 years of experience in the mechanical trade" (confirmed 2026-11-07; do not use 25).

The site is a polished digital business card and company portfolio, not an aggressive lead-generation funnel. It succeeds when a visitor can:
1. Explore JJM's services and expertise.
2. See professional photography, video and completed work.
3. Learn about the company and its experience.
4. Contact JJM easily by phone, email or the contact form.

## Positioning

JJM is an experienced, dependable, detail-oriented mechanical contractor with an established team and professional standards. Its documented strengths are:
- Over 20 years of experience in the mechanical trade, including time with established Vancouver mechanical contractors.
- Operating since 2012.
- Property management specialization: tailored maintenance programs and mechanical system assessments.
- Same-day service for urgent issues, including for commercial contract clients.
- Credentials: licensed BC gas contractor, certified Navien Service Specialists, and BCWWA membership since 2007.
- Coverage of plumbing, heating, gas fitting, HVAC, backflow prevention and preventative maintenance.

These are documented company strengths, not exclusive advantages. Copy must never claim JJM is the only provider, or that competitors cannot match it, without evidence.

## Operating Context

Service lines, each with its own page:
- **Property Management Services:** preventative maintenance, emergency repairs, scheduled servicing, mechanical equipment assessments and long-term maintenance planning.
- **Plumbing, Heating & Gas Fitting:** installation, repair and maintenance of plumbing and mechanical systems, including boilers, furnaces, water heaters, HVAC and gas-fired appliances.
- **Backflow Certification:** installation, testing, repairs, recertification, hazard assessments and water management planning.

Business details:
- Address: #107–8331 Eastlake Drive, Burnaby, BC V5A 4W2
- Phone: 604-422-0204
- General email: jjm@jjmmechanicalgroup.ca
- Accounting email: accounts@jjmmechanicalgroup.ca
- Instagram: @jjmmech
- Domain: jjmmechanicalgroup.ca is inferred from the email addresses; the website domain is still to be confirmed.

## Capabilities and Constraints

Confirmed pages: Home, Property Management, Plumbing, Heating & Gas Fitting, Backflow Certification, About Us and Contact. A case-study or portfolio section may be added later.

Requirements:
- A custom, responsive build with reusable, maintainable components. The client supplied desktop designs only, so tablet and mobile layouts will be designed during development.
- All content editable in Payload CMS.
- A homepage news area: two cards, each a YouTube video with thumbnail, source name, title and date. Placeholder copy is acceptable until real items exist.
- A horizontal marquee of the service names below the hero. It scrolls continuously, slowly and smoothly, follows the scroll direction (reverses when the visitor scrolls up), and stops under reduced motion.
- Scroll-driven transitions between the homepage service sections, where the text stays put while the imagery alternates (designer's green notes; reference albedo.com, "How we get there" section). Deferred from the initial build; sections are built so it can be added later.
- Award-level ("Awwwards type") craft: smooth scroll-based animation and considered hover effects throughout, feeling modern, high-end, technical and professional, without compromising accessibility, performance or usability.
- Compact header on scroll: "JJM" wordmark plus a hamburger that opens a two-panel menu (nav links with icons on the left, tagline on the right), per design pages 2–3.
- Video embedded from YouTube, plus self-hosted original video files where available.
- A contact form.
- Basic technical SEO and Google Analytics.
- A staging environment for client review and approval.

Copy decisions (confirmed 2026-11-07):
- The mockup's "A-Gas fitting" is a typo: use "Gas fitting" / "gas services".
- Header nav label is "Plumbing" (not "Plumbing & Heating") to save space; footer nav matches.
- Fix "ADRESS" → "Address" and "JJMmechanical Group" → "JJM Mechanical Group".

Placeholders are acceptable for now for: partner logos (Safety Authority, BCWWA, Canada badge, FortisBC, TECA, Navien, WorkSafeBC appear in the footer mockup, files not supplied), news thumbnails and videos, and the small menu icons. Mark them clearly so they are replaced before launch.

Undecided:
- Hosting provider and deployment setup.
- Whether the site is English-only or needs other languages.
- Whether case studies are in the initial launch, and their content.
- Whether more original video files are coming.
- Approved testimonials or partner logos.
- What the initials JJM stand for. Do not expand them in copy.

## Brand Commitments

- An established JJM Mechanical Group logo and visual identity. Do not invent replacement branding.
- The client's designer, Anne, created desktop mockups in Adobe Illustrator. They are the primary and binding visual reference for layout, typography, colour, imagery and art direction.
- Palette, taken from the home page PDF (2026-11-07): navy `#17355d`, brand blue `#3f74b7`, body text `#3e4d5d`, white; the icon set also uses `#204185` and `#129cd8`. Large background icons are brand blue at 12% opacity. The green `#0fa24a` in the PDF is annotation only.
- Typeface: Work Sans (Google Fonts) throughout: Regular for body, Bold/SemiBold for headings and nav, Light for the copyright line. The mockup sets the news card titles in Myriad Pro, which is not licensed for web; substitute Work Sans unless the designer objects. Desktop sizes at 1500 px: hero headline 46, section headings 30, body 22–25, nav 16, buttons 17, marquee 56, same-day line 49.
- Logo: only the all-white logo exists as SVG; the design uses it on photo backgrounds and a white "JJM" wordmark in the compact header, so no colour version is needed yet.
- Approved brand lines: "Built on trust, driven by customer satisfaction." and "High-quality service and precision installations."
- Voice: professional, credible and understated. No hard-sell conversion tactics.

## Evidence on Hand

The client has supplied these, kept outside the repo at `../Assets/` (copy only what the site uses into the project):
- Desktop home page mockup: `../Assets/Design from Anne/JJM Website LANDING vf.pdf` (page 1 full page, pages 2–3 compact header and open menu). Green text in it is the designer's animation notes, not site copy. Other pages' mockups are still to come.
- Photography in `../Assets/website-assets/photos/`, grouped by page (landing, about, backflow, contact, plumbing, property management). Some files are duplicated across folders; "copy" variants need the final one confirmed.
- Eight icon SVGs (four section icons, four large background icons) and the white logo SVG in `../Assets/website-assets/`.
- Home page copy, as set in the mockup.

Not available, so do not fabricate:
- Testimonials, client or partner logos, case studies, project counts, response-time statistics and awards beyond the credentials listed under Positioning.

## Product Principles

1. **Credibility over conversion.** Present experience, credentials and workmanship plainly, and keep contact details easy to find without pressure tactics.
2. **Show the work.** Real photography and video of real installations carry the story. Never use stock or invented proof.
3. **Faithful to the approved design.** The Illustrator mockups are the source of truth; extend them to other breakpoints rather than reinterpreting them.
4. **Built for B2B evaluators.** Property managers and commercial owners should quickly find what JJM does, what it is certified for, and how to reach the company.
5. **Client-editable.** Content lives in Payload so JJM can update services, news and video without a developer.

## Accessibility & Inclusion

Scroll-driven and animated transitions must have reduced-motion alternatives and must not block content or navigation. Aim for WCAG 2.2 AA as the baseline, since the client has not set a stricter standard.
