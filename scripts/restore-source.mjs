import { readFileSync, readdirSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

function restore(prefix, output) {
  const dir = '.source';
  const files = readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.b64'))
    .sort();

  if (!files.length) {
    throw new Error(`No source chunks found for ${prefix}`);
  }

  const base64 = files
    .map((name) => readFileSync(join(dir, name), 'utf8').trim())
    .join('');

  mkdirSync('src', { recursive: true });
  writeFileSync(output, Buffer.from(base64, 'base64'));
}

restore('app.', 'src/App.tsx');
restore('css.', 'src/index.css');

// Use the SVG logo in the website. It preserves the exact supplied logo artwork.
// The seal remains the original PNG because only the logo was requested here.
let app = readFileSync('src/App.tsx', 'utf8');
app = app
  .replaceAll('/images/Meisterverbund_Logo.png', '/images/Meisterverbund_Logo.svg')
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');
writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund exact brand logo */
.brand img,
.auth-logo img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.footer-brand img {
  display: block;
  width: 190px;
  height: auto;
  object-fit: contain;
  filter: none !important;
  opacity: 1 !important;
  background: #fff;
  padding: 4px 6px;
}

@media (max-width: 760px) {
  .footer-brand img { width: 175px; }
}
`);
