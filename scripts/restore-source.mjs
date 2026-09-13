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

// Use the SVG logo throughout the site. Render it as an <object> rather than
// an <img>, so the SVG may safely load the exact original artwork it contains.
// pointer-events are disabled below so the surrounding home links still work.
let app = readFileSync('src/App.tsx', 'utf8');
app = app
  .replaceAll('/images/Meisterverbund_Logo.png', '/images/Meisterverbund_Logo.svg')
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png')
  .replace(/<img([^>]*?)src="\/images\/Meisterverbund_Logo\.svg"([^>]*?)\/>/g, '<object$1data="/images/Meisterverbund_Logo.svg" type="image/svg+xml"$2/>');
writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund exact SVG brand logo */
.brand img,
.brand object,
.auth-logo img,
.auth-logo object {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 882 / 274;
  object-fit: contain;
  pointer-events: none;
}

.footer-brand img,
.footer-brand object {
  display: block;
  width: 190px;
  height: auto;
  aspect-ratio: 882 / 274;
  object-fit: contain;
  pointer-events: none;
  filter: none !important;
  opacity: 1 !important;
  background: #fff;
  padding: 4px 6px;
}

@media (max-width: 760px) {
  .footer-brand img,
  .footer-brand object { width: 175px; }
}
`);
