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

// Use the dedicated SVG asset everywhere the logo is rendered.
app = app
  .replaceAll('/images/Meisterverbund_Logo.png', '/images/Meisterverbund_Logo.svg')
  .replace(/<object([^>]*?)(?:data|src)=["']\/images\/Meisterverbund_Logo\.svg["']([^>]*?)\/>/g, '<img src="/images/Meisterverbund_Logo.svg" alt="Meisterverbund Österreich" className="meisterverbund-logo-image" />');

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund Österreich logo: compact header/footer, no oversized white block */
.brand,
.auth-logo,
.footer-brand {
  width: auto !important;
  height: auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  overflow: visible !important;
  display: inline-flex !important;
  align-items: center !important;
  flex: 0 0 auto !important;
}

.brand img,
.auth-logo img,
.footer-brand img,
.meisterverbund-logo-image {
  display: block !important;
  width: 286px !important;
  max-width: 42vw !important;
  height: auto !important;
  aspect-ratio: 882 / 274 !important;
  object-fit: contain !important;
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.footer-brand img,
.footer-brand .meisterverbund-logo-image {
  width: 220px !important;
  max-width: 100% !important;
}

@media (max-width: 760px) {
  .brand,
  .auth-logo {
    max-width: calc(100vw - 100px) !important;
  }

  .brand img,
  .auth-logo img,
  .meisterverbund-logo-image {
    width: 245px !important;
    max-width: calc(100vw - 115px) !important;
    height: auto !important;
  }

  .footer-brand img,
  .footer-brand .meisterverbund-logo-image {
    width: 205px !important;
    max-width: 72vw !important;
  }
}
`);
