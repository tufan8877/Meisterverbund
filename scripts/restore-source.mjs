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

// Render the exact original Meisterverbund logo through inline SVG.
// The original PNG remains untouched and is cropped only by the SVG viewBox.
// This avoids the browser restriction that can make an SVG loaded through <img>
// fail when that SVG references another external image file.
let app = readFileSync('src/App.tsx', 'utf8');

const logoImg = '<img src="/images/Meisterverbund_Logo.svg" alt="Meisterverbund Österreich" />';
const inlineLogo = '<svg className="meisterverbund-logo-svg" viewBox="69 375 882 274" role="img" aria-label="Meisterverbund Österreich" preserveAspectRatio="xMidYMid meet"><image href="/images/Meisterverbund_Logo.png" x="0" y="0" width="1024" height="1024" preserveAspectRatio="none" /></svg>';

app = app
  .replaceAll('<img src="/images/Meisterverbund_Logo.png" alt="Meisterverbund Österreich" />', inlineLogo)
  .replaceAll(logoImg, inlineLogo)
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund exact 1:1 logo rendered as inline SVG */
.meisterverbund-logo-svg {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 882 / 274;
  overflow: visible;
}

.brand .meisterverbund-logo-svg,
.auth-logo .meisterverbund-logo-svg {
  width: 100%;
}

.footer-brand .meisterverbund-logo-svg {
  width: 190px;
  max-width: 100%;
  background: #fff;
  filter: none !important;
  opacity: 1 !important;
}

@media (max-width: 760px) {
  .footer-brand .meisterverbund-logo-svg { width: 175px; }
}
`);
