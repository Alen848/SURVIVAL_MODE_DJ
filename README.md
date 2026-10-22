# SURVIVAL MODE — Press Kit

Press kit web de SURVIVAL MODE (DJ / productor · Minimal Deep Tech · Mar del Plata · KOOK Label).
Vite + GSAP (ScrollTrigger) + Lenis. Bilingüe ES / EN.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/
```

## Deploy (Vercel)

Framework preset **Vite**, build `npm run build`, output `dist`. O desde la terminal: `npx vercel`.

## Editar contenido

Casi todo vive en `src/data/content.js`:

- `CONTACT` — email de booking, redes (un valor vacío `''` oculta ese link), pack de prensa.
- `RELEASES` — discografía destacada (portadas y links de Beatport).
- `SETS`, `VIDEOS`, `VENUES`, `CITIES`, `SHARED_BOOTH`, `LABELS`, `STATS`.
- `RIDER` — rider técnico.

Textos de la página: castellano en `index.html`, inglés en `src/i18n.js`.

## Media

Los originales de Drive van en `_source/` (ignorado por git). Para regenerar imágenes, videos y el ZIP de prensa:

```bash
npm run media
```

- `scripts/process-images.mjs` — fotos WebP (640/1280/2000), placeholders, `public/og.jpg`, `public/media/press/survival-mode-presskit.zip`. La selección de fotos está en el objeto `PHOTOS`.
- `scripts/process-video.sh` — clips verticales 720×1280, montaje del hero y posters. Los recortes (inicio/duración) están en `CLIPS`.
