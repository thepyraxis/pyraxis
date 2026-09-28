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
- `js/` — numbered section scripts plus WebGL/canvas engines (Three.js self-hosted in `public/vendor/`; fonts via Google Fonts CDN)
- `privacy.html`, `terms.html` — legal pages
- `public/` — wordmark, favicon, images, founder frames
- `sitemap.xml`, `robots.txt` — SEO

## Leads

The contact form sends leads by email through [Web3Forms](https://web3forms.com). Set `WEB3FORMS_KEY` in `js/21-modal-and-lead-form.js`. If it is not set, or sending fails, the form offers a pre-filled WhatsApp (`919837104413`) or email message instead.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
