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

let app = readFileSync('src/App.tsx', 'utf8');
app = app.replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');

// Render the exact Meisterverbund artwork inside an inline SVG. The SVG viewBox
// crops the white 1024x1024 source canvas to the actual horizontal logo artwork.
// Because the SVG is inline in the document, the PNG artwork loads reliably in
// Safari/iOS while the element used by the website itself is SVG.
const logoSvg = `<svg className="meisterverbund-logo-svg" viewBox="69 375 882 274" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Meisterverbund Österreich" preserveAspectRatio="xMidYMid meet"><image href="/images/Meisterverbund_Logo.png" x="0" y="0" width="1024" height="1024" preserveAspectRatio="none" /></svg>`;

app = app
  .replace(/<img([^>]*?)src=["']\/images\/Meisterverbund_Logo\.(?:png|svg)["']([^>]*?)\/>/g, logoSvg)
  .replace(/<object([^>]*?)(?:data|src)=["']\/images\/Meisterverbund_Logo\.svg["']([^>]*?)\/>/g, logoSvg);

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund Österreich – inline SVG logo */
.brand,
.auth-logo,
.footer-brand {
  overflow: visible !important;
}

.meisterverbund-logo-svg {
  display: block !important;
  width: 286px !important;
  max-width: 68vw !important;
  height: auto !important;
  aspect-ratio: 882 / 274 !important;
  overflow: visible !important;
  background: transparent !important;
  flex: 0 0 auto;
}

.footer-brand .meisterverbund-logo-svg {
  width: 220px !important;
  max-width: 100% !important;
}

@media (max-width: 760px) {
  .meisterverbund-logo-svg {
    width: 255px !important;
    max-width: 72vw !important;
  }

  .footer-brand .meisterverbund-logo-svg {
    width: 205px !important;
    max-width: 100% !important;
  }
}
`);
