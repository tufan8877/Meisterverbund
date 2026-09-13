import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
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
