# TryTim Website — Setup Notes

## What's here
A trilingual (ES/EN/DE) one-page static site, built in the "Clean & Premium" brand direction. Language auto-detects from the visitor's browser, defaulting to Spanish, with a manual switcher in the header that remembers the visitor's choice.

## Logo
`assets/logo.svg` is the simplified brand mark (plaque, ladder emblem, wordmark) — used as the site favicon and available as a scalable source file for business cards, van signage, or print. It's vector, so it can be resized to any size without quality loss.

## Contact
Contact is WhatsApp + email only (no form): `+34 616 666 924` and `boltontim@hotmail.com`, both already live in `index.html`.

## Before going live, replace these remaining placeholders:

1. **Gallery photos** — two real photos are in (`Cas Català — Curved Roof`, `Hotel Feliz — Glass-Sided Pool`). The remaining four `.gallery-item.placeholder` divs in `index.html` need replacing with real `<img>` tags as more project photos come in. Recommend 4:3 crops to match the grid.

2. **Testimonials** — replace the three placeholder quotes in `index.html` (and matching text in `js/i18n.js` for all three languages) with real client feedback once available.

## Deployment
This is a plain static site — no build step. To deploy on GitHub Pages under Tim's own GitHub account:

1. Create a new repo (e.g. `trytim` or `trytim-mallorca`)
2. Upload these files, keeping the folder structure (`index.html`, `css/`, `js/`)
3. In repo Settings → Pages, set source to the main branch, root folder
4. Optionally connect a custom domain (e.g. `trytim.com` or `.es`) once purchased

## Structure
```
index.html      — all page content, tagged with data-i18n keys
css/style.css   — Concept 3 "Clean & Premium" styling
js/i18n.js      — translation dictionary (es/en/de)
js/main.js      — language detection, switching, persistence
```

## Adding a new translation string
1. Add the key to all three language blocks in `js/i18n.js`
2. Add `data-i18n="your_key"` (or `data-i18n-placeholder` for form fields) to the relevant HTML element
