# Organic launch kit

Public URL: **https://theblackhatter.com**  
Never list `*.web.app` or `.ca` in bios once the redirects work. Blackhatter is a meeting agenda builder, not a security product.

## After deploy

1. Confirm `https://theblackhatter.com` serves the marketing site over HTTPS.
2. Confirm `https://theblackhatter.ca/pricing` **301s** to `https://theblackhatter.com/pricing`.
3. Confirm `https://www.theblackhatter.com` **301s** to the apex `.com`.
4. In [Google Search Console](https://search.google.com/search-console), add a **Domain** property for `theblackhatter.com` (DNS TXT). Optionally add `theblackhatter.ca` only to watch the redirects.
5. Submit `https://theblackhatter.com/sitemap.xml`. Request indexing for `/` and `/faq`.
6. Optional: create a GA4 stream for `https://theblackhatter.com`, put `VITE_GA_MEASUREMENT_ID` in `marketing/.env`, rebuild, and redeploy marketing.

Check `site:theblackhatter.com` after Google has crawled. Fix anything marked “Crawled – currently not indexed.”

## Product Hunt

**Name:** Blackhatter  
**Tagline:** Meeting quality, by design.  
**Link:** https://theblackhatter.com

**First comment (founder):**  
Most calendar holds are a title and a hope. The agenda arrives after people already accepted, objectives stay implicit, and nobody gets a pre-read. Blackhatter pressure-tests the meeting before anyone sits down: pick real objectives (Decide, Align, Inform, and the rest), build the agenda, check coverage and duration, then export a PDF pre-read and a calendar .ics. It is free in early access. It is not a security tool — just meeting design.

**Assets:** `marketing/public/og.png` plus 3–5 in-app screenshots (agenda, coverage, PDF export).

## LinkedIn (four to six posts)

1. Problem: the hold went out with no plan. What the room is actually missing is objectives, coverage, and a pre-read.
2. Screenshot: coverage vs the booked hold.
3. How-to: start with Decide / Align / Inform, then write blocks that serve those aims. Link `/guides/meeting-agenda-from-objectives`.
4. Disambiguation: Blackhatter is a meeting agenda builder, not a hacking product. Link `/faq`.
5. Pre-read: send the plan before the hour. Link `/guides/meeting-pre-read`.
6. Duration: the invite is a budget. Link `/guides/meeting-length`.

## Indie Hackers / Show HN

Only if signup → agenda → PDF is under two minutes. Lead with the coverage check, not “another meeting tool.” Link https://theblackhatter.com.

## Communities (help first, link second)

Keep a running list of ten. One useful answer per week.

- Facilitator / workshop groups (IAF-adjacent, Liberating Structures, team-coach Slacks)
- r/managers, r/productmanagement, r/scrum — only when someone asks how to run the meeting
- EM / engineering-management forums, when the complaint is “the invite had no plan”
- Indie Hackers product feedback threads
- Local facilitator meetups (Canada especially, given `.ca`)

Do not drive-by link. Do not target security or “black hat” keywords.

## Directories (once OG titles are live)

Product Hunt, AlternativeTo, SaaSHub, BetaList if still in early access. Skip “AI” directories. Skip G2/Capterra until you have reviews. Do not list `.ca` as a second live site.
