import { readFileSync, readdirSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';

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

function makeTransparentCroppedLogo() {
  const sourcePath = 'public/images/Meisterverbund_Logo.png';
  const source = PNG.sync.read(readFileSync(sourcePath));
  const { width, height, data } = source;

  const seen = new Uint8Array(width * height);
  const queueX = new Int32Array(width * height);
  const queueY = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i]) return;
    seen[i] = 1;
    queueX[tail] = x;
    queueY[tail] = y;
    tail++;
  };

  const isBackground = (x, y) => {
    const i = (y * width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    return a > 0 && r >= 242 && g >= 242 && b >= 242 && Math.max(r, g, b) - Math.min(r, g, b) <= 12;
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;
    if (!isBackground(x, y)) continue;

    const p = (y * width + x) * 4;
    data[p + 3] = 0;

    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) throw new Error('Could not detect Meisterverbund logo artwork');

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const cropped = new PNG({ width: cropWidth, height: cropHeight });

  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      const src = ((minY + y) * width + (minX + x)) * 4;
      const dst = (y * cropWidth + x) * 4;
      cropped.data[dst] = data[src];
      cropped.data[dst + 1] = data[src + 1];
      cropped.data[dst + 2] = data[src + 2];
      cropped.data[dst + 3] = data[src + 3];
    }
  }

  return cropped;
}

function writeEmbeddedSvg(path, png) {
  const embedded = PNG.sync.write(png).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${png.width}" height="${png.height}" viewBox="0 0 ${png.width} ${png.height}" role="img" aria-label="Meisterverbund Österreich"><image width="${png.width}" height="${png.height}" href="data:image/png;base64,${embedded}" preserveAspectRatio="xMidYMid meet"/></svg>`;
  writeFileSync(path, svg);
}

function buildLogoSvgs() {
  const headerLogo = makeTransparentCroppedLogo();
  writeEmbeddedSvg('public/images/Meisterverbund_Logo.svg', headerLogo);

  // Footer variant: keep the gold shield exactly as-is, but change only the
  // dark navy-blue wordmark pixels to white so it is readable on the navy footer.
  const footerLogo = PNG.sync.read(PNG.sync.write(headerLogo));
  const d = footerLogo.data;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    // Meisterverbund navy is blue-dominant. Gold pixels are red/yellow-dominant,
    // so this keeps the shield and its metallic details untouched.
    const isNavy = b >= 45 && b > r * 1.18 && b > g * 1.05 && r < 130 && g < 145;
    if (isNavy) {
      d[i] = 248;
      d[i + 1] = 248;
      d[i + 2] = 248;
    }
  }

  writeEmbeddedSvg('public/images/Meisterverbund_Logo_Footer.svg', footerLogo);
}

restore('app.', 'src/App.tsx');
restore('css.', 'src/index.css');
buildLogoSvgs();

let app = readFileSync('src/App.tsx', 'utf8');
app = app
  .replaceAll('/images/Meisterverbund_Logo.png', '/images/Meisterverbund_Logo.svg')
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');

// Only the footer gets the special white-wordmark logo. Header stays unchanged.
app = app.replace(
  /(<[^>]+className=["'][^"']*footer-brand[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["'])\/images\/Meisterverbund_Logo\.svg(["'])/,
  '$1/images/Meisterverbund_Logo_Footer.svg$2'
);

writeFileSync('src/App.tsx', app);

appendFileSync('src/index.css', `

/* Meisterverbund logo – transparent header + dedicated footer variant */
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
  max-width: 230px !important;
  height: 72px !important;
  max-height: 72px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  overflow: hidden !important;
  flex: 0 0 230px !important;
}

.brand img,
.auth-logo img,
.footer-brand img {
  display: block !important;
  object-fit: contain !important;
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  filter: none !important;
  opacity: 1 !important;
}

.brand img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
}

.auth-logo {
  width: 220px !important;
  height: 68px !important;
  margin: 0 auto 30px !important;
  background: transparent !important;
  overflow: hidden !important;
}

.auth-logo img {
  width: 100% !important;
  height: 100% !important;
}

.footer-brand {
  background: transparent !important;
}

.footer-brand img {
  width: 240px !important;
  height: auto !important;
  max-width: 100% !important;
  margin-bottom: 18px !important;
}

@media (max-width: 760px) {
  .site-header,
  .header-inner {
    height: 70px !important;
    min-height: 70px !important;
    max-height: 70px !important;
  }

  .header-inner {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .brand {
    width: 220px !important;
    max-width: calc(100vw - 105px) !important;
    height: 64px !important;
    max-height: 64px !important;
    flex: 0 1 220px !important;
  }

  .menu-button {
    flex: 0 0 auto !important;
    margin-left: auto !important;
  }

  .footer-brand img {
    width: 230px !important;
    max-width: 78vw !important;
  }
}
`);
