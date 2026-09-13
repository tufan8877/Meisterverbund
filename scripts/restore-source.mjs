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

// Keep the logo visible on Safari/iOS by rendering it inline, but strictly
// constrain the header/footer boxes so the logo can never stretch the layout.
const logoSvg = `<svg className="meisterverbund-logo-svg" viewBox="69 375 882 274" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Meisterverbund Österreich" preserveAspectRatio="xMidYMid meet"><image href="/images/Meisterverbund_Logo.png" x="0" y="0" width="1024" height="1024" preserveAspectRatio="none" /></svg>`;

app = app
  .replace(/<img([^>]*?)src=["']\/images\/Meisterverbund_Logo\.(?:png|svg)["']([^>]*?)\/>/g, logoSvg)
  .replace(/<object([^>]*?)(?:data|src)=["']\/images\/Meisterverbund_Logo\.svg["']([^>]*?)\/>/g, logoSvg);

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* FINAL Meisterverbund logo/header sizing fix */
.site-header {
  overflow: hidden !important;
}

.header-inner {
  height: 86px !important;
  min-height: 86px !important;
  max-height: 86px !important;
  overflow: hidden !important;
}

.brand {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  width: 230px !important;
  min-width: 230px !important;
  max-width: 230px !important;
  height: 72px !important;
  min-height: 72px !important;
  max-height: 72px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  background: transparent !important;
  overflow: hidden !important;
  flex: 0 0 230px !important;
}

.brand .meisterverbund-logo-svg {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  flex: none !important;
  overflow: hidden !important;
}

.auth-logo {
  width: 220px !important;
  height: 68px !important;
  margin: 0 auto 30px !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  overflow: hidden !important;
  display: block !important;
}

.auth-logo .meisterverbund-logo-svg {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.footer-brand {
  overflow: visible !important;
}

.footer-brand .meisterverbund-logo-svg {
  display: block !important;
  width: 220px !important;
  height: 68px !important;
  max-width: 100% !important;
  max-height: 68px !important;
  margin: 0 0 18px 0 !important;
}

@media (max-width: 760px) {
  .site-header {
    height: 70px !important;
    min-height: 70px !important;
    max-height: 70px !important;
    overflow: hidden !important;
  }

  .header-inner {
    height: 70px !important;
    min-height: 70px !important;
    max-height: 70px !important;
    overflow: hidden !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .brand {
    width: 220px !important;
    min-width: 0 !important;
    max-width: calc(100vw - 105px) !important;
    height: 64px !important;
    min-height: 64px !important;
    max-height: 64px !important;
    flex: 0 1 220px !important;
    overflow: hidden !important;
  }

  .brand .meisterverbund-logo-svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 64px !important;
  }

  .menu-button {
    flex: 0 0 auto !important;
    margin-left: auto !important;
  }

  .footer-brand .meisterverbund-logo-svg {
    width: 200px !important;
    height: 62px !important;
    max-width: 72vw !important;
    max-height: 62px !important;
  }
}
`);
