# PYRAXIS — static site

Static website: `index.html` + `css/` + `js/` + `public/` assets. `js/` and `css/` are **generated** (minified + content-hashed) from `src/` — edit `src/`, never `js/`/`css/`.

## Run

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
```

## Build (after editing anything in src/)

```sh
npm install
npm run build   # minifies src/js + src/css -> js/ css/, stamps ?v=hash in html, commit the result
```

Hashed files are cached for a year (see `vercel.json`); the hash changes whenever the file does, so deploys still show up instantly.

## Files

- `index.html` — page markup
- `src/css/main.css`, `src/js/` — readable sources (edit these); `css/`, `js/` — minified output served to visitors
- `src/js/` — numbered section scripts plus WebGL/canvas engines (Three.js self-hosted in `public/vendor/`; fonts self-hosted in `public/fonts/`)
- `privacy.html`, `terms.html` — legal pages
- `public/` — wordmark, favicon, images, founder frames
- `404.html`, `site.webmanifest` — error page and install metadata
- `sitemap.xml`, `robots.txt` — SEO

## Leads

Every "Get a demo" button (nav, hero, final CTA, sticky bar) opens a short modal form. Submit shows a confirmation panel and opens WhatsApp (`919837104413`) with the details prefilled; the panel keeps a tap-to-open link plus email and phone fallback. Case-study links go straight to WhatsApp. Email and phone are in the footer.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## GPU morph

The ember formation flights, the galaxy's turn and the intro / glide / texture-melt overlays run in the vertex shader (`GPU_MORPH` in `src/js/ember-field-engine.js`). Add `?cpumorph` to the URL to force the old CPU path for A/B comparison or if a driver misbehaves.
