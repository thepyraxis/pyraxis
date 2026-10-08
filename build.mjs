/* PYRAXIS build — minify src/js + src/css into js/ + css/ (the paths the site serves),
   then stamp every html/js reference with a content hash (?v=xxxx) so the files can be cached
   for a year (see vercel.json) and still update instantly on deploy.
   Per-file minify only (NO bundling/renaming of top-level names): the scripts share globals
   ($, makeWA, tickers...) and run isolated from each other's errors, exactly like before.
   Usage: npm install && npm run build   — then commit the generated js/ css/ and html. */
import { transform } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 8);
const out = { js: {}, css: {} };

for (const dir of ['js', 'css']) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(`src/${dir}`)) {
    const src = readFileSync(`src/${dir}/${f}`, 'utf8');
    const r = await transform(src, {
      loader: dir, minify: true, legalComments: 'none', target: 'es2018',
      ...(dir === 'js' ? { keepNames: false } : {}),
    });
    writeFileSync(`${dir}/${f}`, r.code);
    out[dir][f] = hash(r.code);
  }
}

/* the boot script lazy-loads the engine by path: stamp the engine hash INTO it first, then re-hash it,
   so a changed engine also changes boot's own ?v (otherwise a cached boot would load a stale engine). */
{
  const boot = readFileSync('js/25-boot.js', 'utf8');
  const sb = boot.replace(/js\/ember-field-engine\.js(\?v=[0-9a-f]+)?/g, `js/ember-field-engine.js?v=${out.js['ember-field-engine.js']}`);
  writeFileSync('js/25-boot.js', sb);
  out.js['25-boot.js'] = hash(sb);
}

/* stamp ?v=hash on references to our own js/ + css/ files */
const stamp = (text) => text.replace(/((?:\/|\b)(?:js|css)\/([\w.-]+\.(?:js|css)))(\?v=[0-9a-f]+)?(?=["'\s)])/g,
  (m, path, name) => {
    const kind = name.endsWith('.js') ? 'js' : 'css';
    return out[kind][name] ? `${path}?v=${out[kind][name]}` : m;
  });

for (const f of ['index.html', '404.html', 'privacy.html', 'terms.html']) {
  const t = readFileSync(f, 'utf8'), s = stamp(t);
  if (s !== t) writeFileSync(f, s);
}
const total = (d) => Object.keys(out[d]).reduce((n, f) => n + readFileSync(`${d}/${f}`).length, 0);
console.log(`js:  ${Object.keys(out.js).length} files, ${(total('js') / 1024).toFixed(1)} KB`);
console.log(`css: ${Object.keys(out.css).length} files, ${(total('css') / 1024).toFixed(1)} KB`);
