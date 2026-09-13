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

// The external SVG file was not reliable in Safari/iOS. Render the logo as a
// real inline SVG in the document instead. The viewBox crops the large white
// 1024x1024 source canvas to the actual Meisterverbund artwork.
const logoSvg = `<svg className="meisterverbund-logo-svg" viewBox="69 375 882 274" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Meisterverbund Österreich" preserveAspectRatio="xMidYMid meet"><image href="/images/Meisterverbund_Logo.png" x="0" y="0" width="1024" height="1024" preserveAspectRatio="none" /></svg>`;

app = app
  .replace(/<img([^>]*?)src=["']\/images\/Meisterverbund_Logo\.(?:png|svg)["']([^>]*?)\/>/g, logoSvg)
  .replace(/<object([^>]*?)(?:data|src)=["']\/images\/Meisterverbund_Logo\.svg["']([^>]*?)\/>/g, logoSvg);

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund logo – fixed compact SVG dimensions */
.brand,
.auth-logo,
.footer-brand {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: auto !important;
  height: auto !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  overflow: visible !important;
  flex: 0 0 auto !important;
}

.meisterverbund-logo-svg {
  display: block !important;
  width: 286px !important;
  height: 89px !important;
  max-width: min(68vw, 286px) !important;
  min-width: 0 !important;
  max-height: 89px !important;
  flex: 0 0 auto !important;
  background: transparent !important;
  overflow: visible !important;
}

.footer-brand .meisterverbund-logo-svg {
  width: 220px !important;
  height: 68px !important;
  max-width: 100% !important;
  max-height: 68px !important;
}

@media (max-width: 760px) {
  .brand,
  .auth-logo {
    max-width: calc(100vw - 105px) !important;
  }

  .meisterverbund-logo-svg {
    width: 238px !important;
    height: 74px !important;
    max-width: calc(100vw - 120px) !important;
    max-height: 74px !important;
  }

  .footer-brand .meisterverbund-logo-svg {
    width: 200px !important;
    height: 62px !important;
    max-width: 72vw !important;
    max-height: 62px !important;
  }
}
`);
