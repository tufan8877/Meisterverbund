# Meisterverbund Österreich

Statisches React/Vite/TypeScript-Frontend ohne Datenbank, Backend oder Adminbereich.

## Lokal starten

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

Der Build wird im Ordner `dist` erstellt.

## Render

Als **Static Site** deployen:

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Node.js: 22 oder 24

Für SPA-Unterseiten ist `render.yaml` bereits mit einer Rewrite-Regel `/* -> /index.html` vorbereitet.
Falls die Site manuell statt über Blueprint erstellt wird, im Render-Dashboard unter **Redirects/Rewrites** dieselbe Rewrite-Regel anlegen.
