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

// Use the original PNG assets directly. The former SVG wrappers referenced
// external PNG files and can render blank when the SVG itself is loaded via <img>.
let app = readFileSync('src/App.tsx', 'utf8');
app = app
  .replaceAll('/images/Meisterverbund_Logo.svg', '/images/Meisterverbund_Logo.png')
  .replaceAll('/images/Meisterverbund_Siegel.svg', '/images/Meisterverbund_Siegel.png');
writeFileSync('src/App.tsx', app);

// The original logo PNG is square and contains large white margins. Crop it
// visually to the actual horizontal wordmark without changing the source file.
appendFileSync('src/index.css', `

/* Meisterverbund original brand assets */
.brand img,
.auth-logo img {
  display: block;
  width: 100%;
  aspect-ratio: 880 / 272;
  height: auto;
  object-fit: cover;
  object-position: center;
}

.footer-brand img {
  display: block;
  width: 190px;
  aspect-ratio: 880 / 272;
  height: auto;
  object-fit: cover;
  object-position: center;
  filter: none !important;
  opacity: 1 !important;
  background: #fff;
  padding: 4px 6px;
}

@media (max-width: 760px) {
  .footer-brand img { width: 175px; }
}
`);
