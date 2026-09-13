import { readFileSync, readdirSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

function restore(prefix, output) {
  const dir = '.source';
  const files = readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.b64'))
    .sort();

  if (!files.length) throw new Error(`No source chunks found for ${prefix}`);

  const base64 = files.map((name) => readFileSync(join(dir, name), 'utf8').trim()).join('');
  mkdirSync('src', { recursive: true });
  writeFileSync(output, Buffer.from(base64, 'base64'));
}

restore('app.', 'src/App.tsx');
restore('css.', 'src/index.css');

// Use the exact original Meisterverbund PNG for reliability in header/footer.
let app = readFileSync('src/App.tsx', 'utf8');
app = app
  .replaceAll('/images/Meisterverbund_Logo.svg', '/images/Meisterverbund_Logo.png')
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');
writeFileSync('src/App.tsx', app);

// Force the square source PNG to be visually cropped to the actual horizontal
// logo artwork. This removes the large white canvas that was visible on mobile.
appendFileSync('src/index.css', `

/* Meisterverbund logo – exact original artwork, clean crop */
.brand,
.auth-logo,
.footer-brand {
  overflow: hidden !important;
}

.brand img,
.auth-logo img,
.footer-brand img {
  display: block !important;
  object-fit: cover !important;
  object-position: 50% 50% !important;
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  filter: none !important;
  opacity: 1 !important;
}

.brand img,
.auth-logo img {
  width: 286px !important;
  max-width: 68vw !important;
  height: 89px !important;
}

.footer-brand img {
  width: 220px !important;
  height: 68px !important;
  max-width: 100% !important;
}

@media (max-width: 760px) {
  .brand img,
  .auth-logo img {
    width: 255px !important;
    max-width: 72vw !important;
    height: 79px !important;
  }

  .footer-brand img {
    width: 205px !important;
    height: 64px !important;
  }
}
`);
