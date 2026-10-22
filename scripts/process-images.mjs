// Builds web-ready images, blur placeholders and the downloadable press pack from _source/.
import sharp from 'sharp';
import { mkdir, writeFile, rm, copyFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, '_source');
const OUT = path.join(ROOT, 'public/media/img');
const PRESS = path.join(ROOT, 'public/media/press');
const WIDTHS = [640, 1280, 2000];

// id -> source file. Order here is the order of the gallery.
const PHOTOS = {
  // Street session (2025)
  'street-graffiti': 'FOTOS PRESSKIT/IMG_0082_Original.JPG',
  'street-closeup': 'FOTOS PRESSKIT/IMG_0041_Original.JPG',
  'street-wall': 'FOTOS PRESSKIT/IMG_0090_Original.JPG',
  'street-plaza': 'FOTOS PRESSKIT/IMG_0101_Original.JPG',
  'street-court': 'FOTOS PRESSKIT/IMG_0127_Original.JPG',
  // Studio — black tee
  'studio-white': 'FOTOS PRESSKIT/IMG_5602.JPG',
  'studio-bw': 'FOTOS PRESSKIT/IMG_5604.JPG',
  'studio-profile': 'FOTOS PRESSKIT/IMG_5606.JPG',
  'studio-dark': 'FOTOS PRESSKIT/IMG_5610.JPG',
  'studio-dark-2': 'FOTOS PRESSKIT/IMG_5611.JPG',
  // Studio — pink hair
  'pink-beige': 'FOTOS PRESSKIT/IMG_7009.JPG',
  'pink-closeup': 'FOTOS PRESSKIT/IMG_7014.JPG',
  'pink-eyes': 'FOTOS PRESSKIT/IMG_7015.JPG',
  'pink-jacket': 'FOTOS PRESSKIT/IMG_7017.JPG',
  'pink-glasses': 'FOTOS PRESSKIT/IMG_7020.JPG',
  'pink-portrait': 'FOTOS PRESSKIT/IMG_7026.JPG',
  // Live
  'live-purple': 'FOTOS PINCHANDO 2024/IMG_1722.JPG',
  'live-techno': 'FOTOS PINCHANDO 2024/IMG_3323.JPG',
  'live-red': 'FOTOS PINCHANDO 2024/IMG_3445.JPG',
  'live-kook-crowd': 'FOTOS PINCHANDO 2024/IMG_3855.JPG',
  'live-kook-purple': 'FOTOS PINCHANDO 2024/IMG_3858.JPG',
  'live-bouncing': 'FOTOS PINCHANDO 2024/IMG_4453.JPG',
  'live-bouncing-wide': 'FOTOS PINCHANDO 2024/IMG_4457.JPG',
  'live-snr-lasers': 'FOTOS PINCHANDO 2024/IMG_5190.JPG',
  'live-crowd-bw': 'FOTOS PINCHANDO 2024/IMG_5198.JPG',
  'live-crowd-lasers': 'FOTOS PINCHANDO 2024/IMG_5201.JPG',
  'live-snr-red': 'FOTOS PINCHANDO 2024/IMG_5202.JPG',
  'live-snr-stage': 'FOTOS PINCHANDO 2024/IMG_5203.JPG',
  'live-bouncing-fisheye': 'FOTOS PINCHANDO 2024/209F5272-1A52-4373-B5CB-287FCA0E8D42.jpg',
};

const LOGOS = {
  'kook-white': 'KOOK LOGOS/png/KOOK-BLANCO.png',
  'kook-gold': 'KOOK LOGOS/png/KOOK-NEGRO Y DORADO.png',
};

async function main() {
  await mkdir(OUT, { recursive: true });
  const manifest = {};

  for (const [id, rel] of Object.entries(PHOTOS)) {
    const input = sharp(path.join(SRC, rel)).rotate();
    const meta = await input.clone().metadata();
    const swap = (meta.orientation || 1) >= 5;
    const width = swap ? meta.height : meta.width;
    const height = swap ? meta.width : meta.height;
    for (const w of WIDTHS) {
      const target = Math.min(w, width);
      await input.clone().resize({ width: target, withoutEnlargement: true })
        .webp({ quality: w <= 640 ? 72 : 78, effort: 5 })
        .toFile(path.join(OUT, `${id}-${w}.webp`));
    }
    const blur = await input.clone().resize({ width: 24 }).blur(1.2).jpeg({ quality: 50 }).toBuffer();
    manifest[id] = { w: width, h: height, blur: `data:image/jpeg;base64,${blur.toString('base64')}` };
    console.log('img', id, width, 'x', height);
  }

  for (const [id, rel] of Object.entries(LOGOS)) {
    await sharp(path.join(SRC, rel)).trim().resize({ width: 1200 }).png({ compressionLevel: 9 })
      .toFile(path.join(OUT, `${id}.png`));
  }

  // Open Graph card: wordmark over the graffiti portrait.
  const logoSvg = await readFile(path.join(ROOT, 'src/assets/logo-survival-mode.svg'), 'utf8');
  const ogLogo = await sharp(Buffer.from(logoSvg.replace('fill="currentColor"', 'fill="#ECE7DE"')), { density: 400 })
    .resize({ width: 900 }).png().toBuffer();
  await sharp(path.join(SRC, PHOTOS['street-graffiti'])).rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 0.55, saturation: 0.9 })
    .composite([{ input: ogLogo, top: 500, left: 150 }])
    .jpeg({ quality: 84 }).toFile(path.join(ROOT, 'public/og.jpg'));

  await writeFile(path.join(ROOT, 'src/data/images.json'), JSON.stringify(manifest, null, 0));

  await buildPressPack();
}

async function buildPressPack() {
  const stage = path.join(ROOT, '_press-stage', 'SURVIVAL-MODE-PRESSKIT');
  await rm(path.join(ROOT, '_press-stage'), { recursive: true, force: true });
  await mkdir(path.join(stage, 'FOTOS'), { recursive: true });
  await mkdir(path.join(stage, 'LOGOS'), { recursive: true });
  await mkdir(PRESS, { recursive: true });

  let n = 1;
  for (const [id, rel] of Object.entries(PHOTOS)) {
    await sharp(path.join(SRC, rel)).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(path.join(stage, 'FOTOS', `SURVIVAL-MODE_${String(n++).padStart(2, '0')}_${id}.jpg`));
  }
  const logoFiles = [
    'LOGOS ARTIST/Survival Mode - 2022 - BLANCO.png',
    'LOGOS ARTIST/Survival Mode - 2022 - NEGRO.png',
    'LOGOS ARTIST/Survival Mode - LOGO 2022.pdf',
    'KOOK LOGOS/png/KOOK-BLANCO.png',
    'KOOK LOGOS/png/KOOK-NEGRO.png',
    'KOOK LOGOS/png/KOOK-NEGRO Y DORADO.png',
  ];
  for (const rel of logoFiles) {
    if (existsSync(path.join(SRC, rel))) await copyFile(path.join(SRC, rel), path.join(stage, 'LOGOS', path.basename(rel)));
  }
  await copyFile(path.join(ROOT, 'src/assets/logo-survival-mode.svg'), path.join(stage, 'LOGOS', 'Survival Mode - LOGO.svg'));
  await copyFile(path.join(ROOT, 'scripts/BIO.txt'), path.join(stage, 'BIO.txt'));

  const zip = path.join(PRESS, 'survival-mode-presskit.zip');
  await rm(zip, { force: true });
  execFileSync('zip', ['-r', '-q', '-X', zip, 'SURVIVAL-MODE-PRESSKIT'], { cwd: path.join(ROOT, '_press-stage') });
  await rm(path.join(ROOT, '_press-stage'), { recursive: true, force: true });
  console.log('press pack ready');
}

main().catch((e) => { console.error(e); process.exit(1); });
