# PYRAXIS — static site

Static website: `index.html` + `css/` + `js/` + `public/` assets. No build step, no dependencies to install.

## Run

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Files

- `index.html` — page markup
- `css/main.css` — all styles
- `js/` — numbered section scripts plus WebGL/canvas engines (Three.js self-hosted in `public/vendor/`; fonts self-hosted in `public/fonts/`)
- `privacy.html`, `terms.html` — legal pages
- `public/` — wordmark, favicon, images, founder frames
- `404.html`, `site.webmanifest` — error page and install metadata
- `sitemap.xml`, `robots.txt` — SEO

## Leads

Every "Get a demo" button (nav, hero, final CTA, sticky bar) opens a short modal form. Submit shows a confirmation panel and opens WhatsApp (`919837104413`) with the details prefilled; the panel keeps a tap-to-open link plus email and phone fallback. Case-study links go straight to WhatsApp. Email and phone are in the footer.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
