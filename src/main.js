import './styles/main.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import logoSvg from './assets/logo-survival-mode.svg?raw';
import images from './data/images.json';
import {
  CONTACT, KOOK, STATS, LABELS, SHARED_BOOTH, RELEASES, SETS, VIDEOS,
  VENUES, HOME, CITIES, GALLERY, RIDER,
} from './data/content.js';
import { initI18n, t, onLangChange } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const MOBILE = matchMedia('(max-width: 900px)');

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  soundcloud: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 8.2v9.3h8.3a3.2 3.2 0 0 0 .3-6.4A5.5 5.5 0 0 0 11 8.2zM9.4 9.3h1v8.2h-1zm-2 1.2h1v7h-1zm-2 .9h1v6.1h-1zm-2 1.4h1v4.7h-1zm-1.7 1.3h.8v3.2h-.8z"/></svg>',
  beatport: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v9.5"/><circle cx="12.5" cy="15.5" r="5"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M7.5 9.5c3-1 6.5-.7 9 .8M8 12.6c2.5-.7 5.2-.4 7.3.8M8.6 15.4c2-.5 3.9-.3 5.6.6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>',
  muted: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 4 6m0-6-4 6"/></svg>',
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
};

const img = (id, w) => `/media/img/${id}-${w}.webp`;
const srcset = (id) => [640, 1280, 2000].map((w) => `${img(id, w)} ${w}w`).join(', ');

/* ════════ bootstrap ════════ */
$$('[data-logo]').forEach((el) => { el.innerHTML = logoSvg; });
initI18n();
renderAll();
initLinks();
initGrain();
initClock();
initCursor();
initNav();
const lenis = initScroll();
initBoot().then(() => {
  initHero();
  initReveals();
  initStatement();
  initStats();
  initBooth();
  initReleases();
  initReels();
  initRadar();
  initVenues();
  initTicker();
  initGallery();
  initRider();
  initBooking();
  initMagnetic();
  initSideHud();
  ScrollTrigger.refresh();
});

/* ════════ rendering ════════ */
function renderAll() {
  // ticker
  $('[data-ticker]').innerHTML = [...LABELS, ...LABELS, ...LABELS].map((l) => `<span class="ticker__item">${l}</span>`).join('');

  // stats
  $('[data-stats]').innerHTML = STATS.map((s) => `
    <div class="stat"><dd data-count="${s.value}" data-plain="${s.plain ? 1 : 0}">${s.plain ? s.value : 0}${s.suffix ? `<sup>${s.suffix}</sup>` : ''}</dd><dt data-i18n="${s.key}">${t(s.key)}</dt></div>`).join('');

  // shared booth
  $('[data-booth]').innerHTML = SHARED_BOOTH.map((a, i) => `
    <li class="booth__item" data-scramble-host><span class="booth__idx">${String(i + 1).padStart(2, '0')}</span><span class="booth__name" data-scramble>${a.name}</span><span class="booth__from">${a.from}</span></li>`).join('');

  // releases
  $('[data-releases]').innerHTML = RELEASES.map((r, i) => `
    <a class="release" href="${r.url}" target="_blank" rel="noopener" data-cursor="open">
      <div class="release__sleeve"><div class="release__vinyl"></div><img class="release__cover" src="${r.cover}" alt="${r.title} — ${r.label}" loading="lazy" width="500" height="500" /></div>
      <div class="release__meta"><span><b>${String(i + 1).padStart(2, '0')}</b> · ${r.label}</span><span>${r.year} · ${r.bpm} BPM</span></div>
      <h3 class="release__title">${r.title}</h3>
      <p class="release__artists">${r.artists}</p>
    </a>`).join('') + `
    <a class="release release--cta" data-link="beatport" target="_blank" rel="noopener"><span><span data-i18n="release.all">${t('release.all')}</span><small data-i18n="release.on">${t('release.on')}</small><small>↗</small></span></a>`;

  // sets (iframe injected on demand to keep the page light)
  const bars = Array.from({ length: 48 }, (_, i) => `<span style="height:${18 + Math.abs(Math.sin(i * 1.7) * 60 + Math.cos(i * .6) * 22)}%"></span>`).join('');
  $('[data-sets]').innerHTML = SETS.map((s, i) => `
    <article class="set">
      <div class="set__top"><span><b>REC ${String(i + 1).padStart(2, '0')}</b> · SOUNDCLOUD</span><span>LIVE SET</span></div>
      <h3 class="set__title" data-i18n="${s.key}">${t(s.key)}</h3>
      <div class="set__player"><button class="set__load" type="button" data-set-url="${s.url}" data-cursor="play"><i>▶</i><span class="set__bars">${bars}</span></button></div>
    </article>`).join('');
  $$('[data-set-url]').forEach((btn) => btn.addEventListener('click', () => {
    const u = encodeURIComponent(btn.dataset.setUrl);
    btn.parentElement.innerHTML = `<iframe title="SoundCloud" allow="autoplay" src="https://w.soundcloud.com/player/?url=${u}&color=%23ff4a1c&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"></iframe>`;
  }));

  // reels
  $('[data-reels]').innerHTML = VIDEOS.map((v, i) => `
    <figure class="reel" data-reel data-cursor="play">
      <video muted loop playsinline preload="none" poster="/media/video/${v.id}.jpg" data-src="/media/video/${v.id}.mp4"></video>
      <div class="reel__top"><span class="reel__rec">REC</span><span>CAM_${String(i + 1).padStart(2, '0')}</span></div>
      <figcaption class="reel__bottom"><span class="reel__title" data-i18n="${v.key}">${t(v.key)}</span><button class="reel__sound" type="button" aria-label="Sonido">${ICONS.muted}</button></figcaption>
      <div class="reel__bar"><i></i></div>
    </figure>`).join('');

  // cities
  const rows = [{ ...HOME, home: true }, ...CITIES.map((c) => ({ ...c, km: distanceKm(HOME, c) })).sort((a, b) => a.km - b.km)];
  $('[data-cities]').innerHTML = rows.map((c, i) => `
    <li class="city ${c.home ? 'city--home' : ''}" data-city="${i - 1}"><span class="city__name">${c.name}</span><span class="city__km">${c.home ? `<span data-i18n="map.home">${t('map.home')}</span>` : `${Math.round(c.km)} KM`}</span></li>`).join('');

  // venues
  const half = Math.ceil(VENUES.length / 2);
  const v1 = VENUES.slice(0, half); const v2 = VENUES.slice(half);
  $('[data-venues="1"]').innerHTML = [...v1, ...v1, ...v1].map((v) => `<span class="venue">${v}</span>`).join('');
  $('[data-venues="2"]').innerHTML = [...v2, ...v2, ...v2].map((v) => `<span class="venue">${v}</span>`).join('');

  // kook
  $('[data-kook-links]').innerHTML = [['Instagram', KOOK.instagram], ['Beatport', KOOK.beatport], ['SoundCloud', KOOK.soundcloud]]
    .filter(([, u]) => u).map(([n, u]) => `<a class="btn" href="${u}" target="_blank" rel="noopener" data-magnetic>${n} <i>↗</i></a>`).join('');

  // rider
  $('[data-rider]').innerHTML = RIDER.map((r) => `
    <li class="rider__item"><span class="rider__qty">${r.qty}</span><span class="rider__what" data-i18n="${r.key}">${t(r.key)}</span><span class="rider__model">${r.model}</span><span class="rider__alt" data-i18n="${r.alt}">${t(r.alt)}</span></li>`).join('');

  // socials
  $('[data-socials]').innerHTML = ['instagram', 'soundcloud', 'beatport', 'spotify', 'whatsapp']
    .filter((k) => CONTACT[k]).map((k) => `<a class="social" href="${CONTACT[k]}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`).join('');

  // allow the address to wrap only after the @ on narrow screens
  const [user, domain] = CONTACT.email.split('@');
  $('[data-email-text]').innerHTML = `${user}@<wbr>${domain}`;
  $('[data-year]').textContent = new Date().getFullYear();
}

function initLinks() {
  $$('[data-link]').forEach((a) => {
    const k = a.dataset.link;
    if (k === 'email') a.href = `mailto:${CONTACT.email}`;
    else if (CONTACT[k]) a.href = CONTACT[k];
    else a.remove();
  });
}

/* ════════ boot sequence ════════ */
function initBoot() {
  return new Promise((resolve) => {
    const boot = $('.boot');
    const done = () => { document.body.classList.remove('is-loading'); boot.remove(); resolve(); };
    if (REDUCED) { done(); return; }

    const video = $('[data-hero-video]');
    const ready = new Promise((r) => {
      if (video.readyState >= 3) r();
      video.addEventListener('canplay', r, { once: true });
      setTimeout(r, 3500);
    });
    const counter = { v: 0 };
    const tl = gsap.timeline();
    tl.to('[data-boot]', { opacity: 1, duration: 0.01, stagger: 0.28 })
      .to(counter, {
        v: 100, duration: 2.1, ease: 'power2.inOut',
        onUpdate: () => { $('[data-boot-count]').textContent = String(Math.round(counter.v)).padStart(3, '0'); },
      }, 0)
      .to('[data-boot-bar]', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
      .to('.boot__logo', { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.inOut' }, 0.5)
      .add(() => ready)
      .to(['.boot__term', '.boot__count', '.boot__bar', '.boot__grid'], { opacity: 0, duration: 0.4 })
      .to('.boot__logo', { scale: 1.06, opacity: 0, filter: 'blur(10px)', duration: 0.6, ease: 'power3.in' }, '<')
      .add(() => { boot.style.background = 'transparent'; $$('.boot__shutter').forEach((s) => { s.style.zIndex = 1; }); })
      .to('.boot__shutter--top', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
      .to('.boot__shutter--bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
      .add(done, '-=0.45');
  });
}

/* ════════ scroll ════════ */
function initScroll() {
  if (REDUCED) return null;
  const l = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
  l.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => l.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const target = a.getAttribute('href') === '#top' ? 0 : $(a.getAttribute('href'));
    if (target === null) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    l.start();
    l.scrollTo(target, { offset: 0, duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
  }));
  return l;
}

/* ════════ hero ════════ */
function initHero() {
  const video = $('[data-hero-video]');
  const want = MOBILE.matches ? '/media/video/hero-mobile.mp4' : '/media/video/hero.mp4';
  if (!video.currentSrc.endsWith(want)) { video.src = want; }
  video.play().catch(() => {});

  const logo = $('[data-hero-logo]');
  if (REDUCED) return;

  gsap.from(logo, { clipPath: 'inset(0 0 100% 0)', yPercent: 30, duration: 1.4, ease: 'expo.out' });
  gsap.from('.hero__kicker .tag', { y: 20, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
  gsap.from('.hud, .corner, .crosshair', { opacity: 0, duration: 1.2, stagger: 0.06, delay: 0.4 });
  gsap.from('.hero__wave', { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', delay: 0.2 });

  // scroll-out
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__content', { yPercent: -35, opacity: 0, ease: 'none' }, 0)
    .to('.hero__video', { scale: 1.25, ease: 'none' }, 0)
    .to('.hero__hud', { opacity: 0, ease: 'none' }, 0);

  // pointer parallax + glitch slice on the logo
  if (FINE) {
    const qx = gsap.quickTo(logo, 'x', { duration: 1.2, ease: 'power3' });
    const qy = gsap.quickTo(logo, 'y', { duration: 1.2, ease: 'power3' });
    const vx = gsap.quickTo('.hero__video', 'xPercent', { duration: 1.6, ease: 'power3' });
    $('.hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5; const ny = e.clientY / innerHeight - 0.5;
      qx(nx * 26); qy(ny * 14); vx(nx * -2);
    });
  }
  const glitch = () => {
    if (window.scrollY < innerHeight) {
      gsap.timeline()
        .set(logo, { clipPath: 'inset(32% 0 46% 0)', x: '+=10', color: '#ff4a1c' })
        .set(logo, { clipPath: 'inset(0 0 0 0)', x: '-=10', color: '#ece7de' }, 0.07)
        .set(logo, { skewX: 8 }, 0.1).set(logo, { skewX: 0 }, 0.14);
    }
    gsap.delayedCall(gsap.utils.random(3.5, 7), glitch);
  };
  gsap.delayedCall(4, glitch);

  initWave();
}

function initWave() {
  const canvas = $('[data-wave]');
  const ctx = canvas.getContext('2d');
  const bpm = 129;
  let w = 0; let h = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener('resize', resize);
  const bars = 160;
  const seed = Array.from({ length: bars }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)));
  gsap.ticker.add((time) => {
    if (window.scrollY > innerHeight) return;
    ctx.clearRect(0, 0, w, h);
    const beat = (time * bpm / 60) % 1;
    const kick = Math.pow(1 - beat, 4);
    const bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const travel = Math.sin(i * 0.18 - time * 3.2) * 0.5 + 0.5;
      const amp = seed[i] * (0.35 + 0.65 * travel) * (0.55 + 0.45 * kick);
      const bh = Math.max(1, amp * h);
      const playhead = (time * 0.04) % 1;
      ctx.fillStyle = i / bars < playhead ? '#ff4a1c' : 'rgba(236,231,222,.55)';
      ctx.fillRect(i * bw, (h - bh) / 2, Math.max(1, bw - 2), bh);
    }
    $('[data-bpm]').style.color = kick > 0.6 ? '#ff4a1c' : '';
  });
}

/* ════════ generic reveals ════════ */
function initReveals() {
  $$('[data-split]').forEach((h) => {
    const inner = h.innerHTML;
    h.innerHTML = `<span class="line"><span>${inner}</span></span>`;
    if (REDUCED) return;
    gsap.from(h.querySelector('.line > span'), {
      yPercent: 110, rotate: 3, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: h, start: 'top 88%' },
    });
  });
  if (REDUCED) return;
  $$('.eyebrow, .section__lede').forEach((el) => gsap.from(el, { opacity: 0, y: 16, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  // portrait: shutter + scanline + inner parallax
  const frame = $('.frame');
  gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 80%' } })
    .to(frame, { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.inOut' })
    .fromTo('.frame__scan', { top: '0%', opacity: 1 }, { top: '100%', duration: 1.6, ease: 'expo.inOut' }, 0)
    .to('.frame__scan', { opacity: 0, duration: 0.3 });
  gsap.fromTo('.frame img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: frame, scrub: true } });

  $$('.bio__body p').forEach((p, i) => gsap.from(p, { opacity: 0, y: 30, duration: 1, delay: i * 0.08, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 92%' } }));

  // kook
  gsap.from('[data-kook-logo]', { clipPath: 'inset(0 100% 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.kook', start: 'top 70%' } });
  gsap.to('.kook__bg', { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.kook', scrub: true } });

  // sets
  gsap.from('.set', { y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.sets__list', start: 'top 85%' } });

  // booking
  gsap.from('.booking__mail', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.booking__mail', start: 'top 92%' } });
  gsap.from('.form', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.form', start: 'top 92%' } });

  // footer logo assembles as you hit bottom
  gsap.fromTo('.footer__logo .logo-svg', { yPercent: 60, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

function initStatement() {
  const els = $$('[data-statement]');
  const split = () => els.forEach((el) => {
    el.innerHTML = el.textContent.split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    if (REDUCED) return;
    ScrollTrigger.getById(`st-${el.dataset.i18n}`)?.kill();
    gsap.to(el.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { id: `st-${el.dataset.i18n}`, trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });
  split();
  onLangChange(() => { split(); ScrollTrigger.refresh(); });
}

function initStats() {
  $$('[data-count]').forEach((dd) => {
    if (dd.dataset.plain === '1' || REDUCED) { return; }
    const sup = dd.querySelector('sup')?.outerHTML || '';
    const o = { v: 0 }; const end = +dd.dataset.count;
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: dd, start: 'top 90%' },
      onUpdate: () => { dd.innerHTML = Math.round(o.v) + sup; },
    });
  });
  if (!REDUCED) gsap.from('.stat', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stats', start: 'top 90%' } });
}

/* ════════ shared booth: text scramble ════════ */
function scramble(el, finalText) {
  const chars = '▚▞▙▟█#/\\<>01_';
  const o = { p: 0 };
  gsap.killTweensOf(o);
  gsap.to(o, {
    p: 1, duration: 0.6, ease: 'power2.out',
    onUpdate: () => {
      const n = Math.floor(o.p * finalText.length);
      el.textContent = finalText.slice(0, n) + finalText.slice(n).replace(/[^\s]/g, () => chars[(Math.random() * chars.length) | 0]);
    },
    onComplete: () => { el.textContent = finalText; },
  });
}
function initBooth() {
  $$('[data-scramble-host]').forEach((row) => {
    const el = row.querySelector('[data-scramble]');
    const text = el.textContent;
    row.addEventListener('pointerenter', () => scramble(el, text));
  });
  if (REDUCED) return;
  gsap.from('.booth__item', { yPercent: 60, opacity: 0, stagger: 0.07, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.booth__list', start: 'top 85%' } });
  ScrollTrigger.create({ trigger: '.booth__list', start: 'top 70%', once: true, onEnter: () => $$('[data-scramble]').forEach((el, i) => gsap.delayedCall(i * 0.08, () => scramble(el, el.textContent))) });
}

/* ════════ releases: pinned horizontal run ════════ */
function initReleases() {
  const track = $('[data-releases]');
  const pin = $('[data-releases-pin]');
  const bar = $('[data-releases-progress]');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'center center', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; },
      },
    });
    $$('.release', track).forEach((card) => {
      gsap.from(card.querySelector('.release__sleeve'), {
        rotateY: -25, scale: 0.86, opacity: 0.3, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 60%', scrub: true },
      });
    });
    return () => { bar.style.transform = ''; };
  });
  mm.add('(max-width: 900px)', () => {
    pin.style.overflowX = 'auto';
    pin.style.scrollSnapType = 'x mandatory';
    $$('.release', track).forEach((c) => { c.style.scrollSnapAlign = 'center'; });
    const onScroll = () => { bar.style.transform = `scaleX(${pin.scrollLeft / (pin.scrollWidth - pin.clientWidth || 1)})`; };
    pin.addEventListener('scroll', onScroll, { passive: true });
    return () => pin.removeEventListener('scroll', onScroll);
  });
}

/* ════════ reels ════════ */
function initReels() {
  const reels = $$('[data-reel]');
  const load = (v) => { if (!v.src) { v.src = v.dataset.src; } };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target.querySelector('video');
    if (e.isIntersecting) { load(v); v.play().catch(() => {}); } else { v.pause(); }
  }), { threshold: 0.35 });
  reels.forEach((r) => {
    io.observe(r);
    const v = r.querySelector('video');
    const bar = r.querySelector('.reel__bar i');
    v.addEventListener('timeupdate', () => { bar.style.transform = `scaleX(${v.currentTime / (v.duration || 1)})`; });
    r.addEventListener('click', () => {
      const turnOn = v.muted;
      reels.forEach((o) => { const ov = o.querySelector('video'); ov.muted = true; o.classList.remove('is-unmuted'); o.querySelector('.reel__sound').innerHTML = ICONS.muted; });
      if (turnOn) { load(v); v.muted = false; v.play().catch(() => {}); r.classList.add('is-unmuted'); r.querySelector('.reel__sound').innerHTML = ICONS.sound; }
    });
  });
  if (REDUCED) return;
  gsap.from(reels, { y: 120, opacity: 0, stagger: 0.08, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '[data-reels]', start: 'top 85%' } });
  // drag-to-scroll on desktop
  const strip = $('[data-reels]');
  let down = false; let sx = 0; let sl = 0; let moved = false;
  strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft; });
  addEventListener('pointerup', () => { down = false; });
  strip.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; strip.scrollLeft = sl - dx; });
  strip.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
}

/* ════════ radar ════════ */
function distanceKm(a, b) {
  const R = 6371; const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad; const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function initRadar() {
  const svg = $('[data-radar] svg');
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); parent.appendChild(n); return n; };
  const rings = svg.querySelector('.radar__rings');
  const axes = svg.querySelector('.radar__axes');
  const blipsG = svg.querySelector('.radar__blips');
  // square-root radial scale spreads out the cluster of cities near Buenos Aires
  const MAXKM = 1100; const RMAX = 440;
  const rOf = (km) => Math.sqrt(km / MAXKM) * RMAX;
  [100, 300, 600, 1000].forEach((km) => {
    mk('circle', { r: rOf(km) }, rings);
    const tx = mk('text', { x: rOf(km) * 0.71 + 6, y: rOf(km) * 0.71 + 16 }, axes); tx.textContent = `${km}KM`;
  });
  mk('line', { x1: -RMAX, y1: 0, x2: RMAX, y2: 0 }, axes);
  mk('line', { x1: 0, y1: -RMAX, x2: 0, y2: RMAX }, axes);
  [['N', 0, -RMAX - 22], ['S', 0, RMAX + 34], ['E', RMAX + 18, 5], ['O', -RMAX - 34, 5]].forEach(([l, x, y]) => { const tx = mk('text', { x, y, 'text-anchor': 'middle' }, axes); tx.textContent = l; });

  const sorted = CITIES.map((c) => ({ ...c, km: distanceKm(HOME, c) })).sort((a, b) => a.km - b.km);
  const blips = sorted.map((c, i) => {
    // equirectangular projection around MDQ, scaled to km
    const kx = (c.lon - HOME.lon) * 111.32 * Math.cos(HOME.lat * Math.PI / 180);
    const ky = -(c.lat - HOME.lat) * 110.57;
    const k = rOf(Math.hypot(kx, ky)) / Math.hypot(kx, ky);
    const x = kx * k; const y = ky * k;
    const g = mk('g', { class: 'blip', transform: `translate(${x} ${y})` }, blipsG);
    mk('line', { class: 'blip__line', x1: 0, y1: 0, x2: -x, y2: -y }, g);
    const pulse = mk('circle', { class: 'blip__pulse', r: 6 }, g);
    mk('circle', { class: 'blip__dot', r: 6 }, g);
    const place = {
      left: { x: -14, y: 5, 'text-anchor': 'end' },
      right: { x: 14, y: 5, 'text-anchor': 'start' },
      below: { x: 0, y: 26, 'text-anchor': 'middle' },
    }[c.label || (x > 0 ? 'right' : 'left')];
    const lbl = mk('text', { class: 'blip__label', ...place }, g);
    lbl.textContent = c.name;
    // compass angle measured clockwise from north to match the CSS conic sweep
    const ang = (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360;
    return { g, pulse, ang, i, hit: -1 };
  });

  // city list <-> blip hover link
  $$('[data-city]').forEach((li) => {
    const idx = +li.dataset.city; if (idx < 0) return;
    li.addEventListener('pointerenter', () => blips[idx].g.classList.add('is-hover'));
    li.addEventListener('pointerleave', () => blips[idx].g.classList.remove('is-hover'));
  });

  const sweep = $('[data-sweep]');
  const countEl = $('[data-radar-count]');
  const seen = new Set();
  let started = false;
  ScrollTrigger.create({ trigger: '[data-radar]', start: 'top 75%', once: true, onEnter: () => { started = true; } });
  if (REDUCED) { countEl.textContent = blips.length; blips.forEach((b) => b.g.classList.add('is-hit')); return; }
  gsap.from('.radar__rings circle', { attr: { r: 0 }, duration: 1.6, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-radar]', start: 'top 75%' } });
  gsap.from('.city', { x: 40, opacity: 0, stagger: 0.06, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '[data-cities]', start: 'top 80%' } });

  let angle = 0; let last = 0;
  gsap.ticker.add((time) => {
    if (!started) return;
    const dt = time - last; last = time;
    if (dt > 0.5) return;
    const prev = angle;
    angle = (angle + dt * 72) % 360;
    sweep.style.transform = `rotate(${angle}deg)`;
    blips.forEach((b) => {
      const crossed = prev <= angle ? b.ang > prev && b.ang <= angle : b.ang > prev || b.ang <= angle;
      if (crossed) {
        b.g.classList.add('is-hit');
        gsap.fromTo(b.pulse, { attr: { r: 6 }, opacity: 0.9 }, { attr: { r: 34 }, opacity: 0, duration: 1.4, ease: 'expo.out' });
        gsap.delayedCall(2.2, () => b.g.classList.remove('is-hit'));
        if (!seen.has(b.i)) { seen.add(b.i); countEl.textContent = seen.size; }
      }
    });
  });
}

/* ════════ marquees ════════ */
function velocityMarquee(el, speed, dir = 1) {
  if (REDUCED) return;
  let x = 0; let boost = 0;
  const width = () => el.scrollWidth / 3;
  ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: (s) => { boost = gsap.utils.clamp(-12, 12, s.getVelocity() / 220); } });
  gsap.ticker.add((_, dt) => {
    const w = width(); if (!w) return;
    boost *= 0.93;
    x -= (speed + Math.abs(boost)) * dir * (dt / 16.6);
    if (dir > 0 && x <= -w) x += w;
    if (dir < 0 && x >= 0) x -= w;
    el.style.transform = `translate3d(${x}px,0,0) skewX(${-boost * 0.6 * dir}deg)`;
  });
  if (dir < 0) x = -width();
}
function initTicker() {
  velocityMarquee($('[data-ticker]'), 0.7, 1);
}
function initVenues() {
  velocityMarquee($('[data-venues="1"]'), 0.9, 1);
  velocityMarquee($('[data-venues="2"]'), 0.9, -1);
}

/* ════════ gallery + lightbox ════════ */
function initGallery() {
  const host = $('[data-gallery]');
  let current = 'press';
  let list = [];
  const render = (set) => {
    list = GALLERY[set];
    host.innerHTML = list.map((id, i) => {
      const m = images[id];
      return `<button class="shot" type="button" data-shot="${i}" data-cursor="view" style="aspect-ratio:${m.w}/${m.h}">
        <img class="shot__blur" src="${m.blur}" alt="" aria-hidden="true" />
        <img src="${img(id, 640)}" srcset="${srcset(id)}" sizes="(max-width: 600px) 50vw, 25vw" alt="Survival Mode — ${id.replace(/-/g, ' ')}" loading="lazy" style="opacity:0" />
        <span class="shot__meta"><span>${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</span><span>HI-RES ↗</span></span>
      </button>`;
    }).join('');
    $$('.shot img:not(.shot__blur)', host).forEach((im) => {
      const show = () => { im.style.opacity = 1; im.previousElementSibling.style.opacity = 0; };
      if (im.complete && im.naturalWidth) show(); else im.addEventListener('load', show, { once: true });
    });
    $$('.shot', host).forEach((s) => s.addEventListener('click', () => open(+s.dataset.shot)));
    if (!REDUCED) {
      gsap.from($$('.shot', host), { y: 80, opacity: 0, duration: 1.1, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: host, start: 'top 85%' } });
    }
    ScrollTrigger.refresh();
    bindCursorTargets(host);
  };
  $$('[data-gallery-tab]').forEach((tab) => tab.addEventListener('click', () => {
    if (tab.dataset.galleryTab === current) return;
    current = tab.dataset.galleryTab;
    $$('[data-gallery-tab]').forEach((x) => { x.classList.toggle('is-active', x === tab); x.setAttribute('aria-selected', x === tab); });
    gsap.to(host, { opacity: 0, duration: 0.3, onComplete: () => { render(current); gsap.to(host, { opacity: 1, duration: 0.4 }); } });
  }));
  render(current);

  const lb = $('[data-lightbox]'); const lbImg = $('[data-lb-img]');
  let idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const id = list[idx];
    lbImg.src = img(id, 2000); lbImg.alt = `Survival Mode — ${id}`;
    $('[data-lb-count]').textContent = `${String(idx + 1).padStart(2, '0')} ${t('gallery.of')} ${String(list.length).padStart(2, '0')}`;
    const dl = $('[data-lb-download]'); dl.href = img(id, 2000); dl.setAttribute('download', `survival-mode-${id}.webp`);
    gsap.fromTo(lbImg, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
  };
  const open = (i) => { show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lenis?.stop(); $('[data-lb-close]').focus(); };
  const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lenis?.start(); };
  $('[data-lb-close]').addEventListener('click', close);
  $('[data-lb-prev]').addEventListener('click', () => show(idx - 1));
  $('[data-lb-next]').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox__fig')) close(); });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); });
}

/* ════════ rider ════════ */
function initRider() {
  const parts = $$('.rider__svg .draw > *');
  parts.forEach((p) => { const len = p.getTotalLength?.() || 400; p.style.strokeDasharray = len; p.style.strokeDashoffset = REDUCED ? 0 : len; });
  if (REDUCED) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-rider-stage]', start: 'top 75%' } });
  tl.to(parts, { strokeDashoffset: 0, duration: 1.8, stagger: 0.015, ease: 'power2.inOut' })
    .from('.rider__faders rect', { opacity: 0, y: 20, stagger: 0.06, duration: 0.6, ease: 'back.out(2)' }, '-=0.6')
    .from('.rider__item', { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, '-=0.6');
  // platters spin at 33⅓ and faders ride the groove
  $$('.rider__platters line').forEach((l, i) => {
    const cx = [155, 415, 945][i];
    gsap.to(l, { rotation: 360, svgOrigin: `${cx} 250`, duration: 1.8, repeat: -1, ease: 'none' });
  });
  $$('.rider__faders rect:not(.xfader)').forEach((r) => gsap.to(r, { y: () => gsap.utils.random(-50, 20), duration: () => gsap.utils.random(0.9, 1.8), repeat: -1, yoyo: true, ease: 'sine.inOut', repeatRefresh: true }));
  gsap.to('.xfader', { x: 40, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

/* ════════ booking ════════ */
function toast(msg) {
  const el = $('[data-toast]'); el.textContent = msg; el.classList.add('is-on');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('is-on'), 2200);
}
function initBooking() {
  const copy = async () => {
    try { await navigator.clipboard.writeText(CONTACT.email); toast(t('toast.copied')); } catch { location.href = `mailto:${CONTACT.email}`; }
  };
  $('[data-copy-email]').addEventListener('click', copy);
  $('.booking__mail').addEventListener('click', (e) => { if (FINE) { e.preventDefault(); copy(); } });

  const form = $('[data-booking-form]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    let ok = true;
    ['name', 'email'].forEach((k) => {
      const input = form.elements[k];
      const bad = !input.value.trim() || (k === 'email' && !input.checkValidity());
      input.classList.toggle('is-invalid', bad); if (bad) ok = false;
    });
    if (!ok) { toast(t('toast.invalid')); return; }
    const body = [
      `${t('mail.name')}: ${d.get('name')}`, `Email: ${d.get('email')}`, `${t('mail.date')}: ${d.get('date') || '-'}`,
      `${t('mail.city')}: ${d.get('city') || '-'}`, `${t('mail.type')}: ${d.get('type')}`, '', `${t('mail.msg')}:`, d.get('msg') || '-',
    ].join('\n');
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`${t('mail.subject')} — ${d.get('city') || d.get('name')}`)}&body=${encodeURIComponent(body)}`;
  });
}

/* ════════ chrome: nav, cursor, grain, clock, magnetic, side hud ════════ */
function initNav() {
  const nav = $('.nav');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > innerHeight * 0.8 && !document.body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });
  $('[data-menu-toggle]').addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    if (open) lenis?.stop(); else lenis?.start();
  });
  $$('.menu a').forEach((a) => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); lenis?.start(); }));
}

function bindCursorTargets(root = document) {
  const cursor = $('.cursor'); const label = $('.cursor__label');
  $$('a, button, [data-cursor], label', root).forEach((el) => {
    if (el.dataset.cursorBound) return; el.dataset.cursorBound = 1;
    el.addEventListener('pointerenter', () => {
      const key = el.dataset.cursor;
      if (key) { label.textContent = t(`cursor.${key.toLowerCase()}`); cursor.classList.add('has-label'); } else cursor.classList.add('is-hover');
    });
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover', 'has-label'));
  });
}
function initCursor() {
  if (!FINE) return;
  const dot = $('.cursor__dot'); const ring = $('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }); const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }); const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const cursor = $('.cursor');
  addEventListener('pointermove', (e) => { cursor.classList.add('is-live'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('is-live'));
  bindCursorTargets();
  // the strip is draggable
  $('[data-reels]').addEventListener('pointerenter', () => { $('.cursor__label').textContent = t('cursor.drag'); $('.cursor').classList.add('has-label'); });
}

function initMagnetic() {
  if (!FINE || REDUCED) return;
  $$('[data-magnetic]').forEach((el) => {
    const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * 0.25); qy((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { qx(0); qy(0); });
  });
}

function initGrain() {
  const c = $('.grain'); const ctx = c.getContext('2d');
  const W = 220; const H = 220; c.width = W; c.height = H;
  const frames = Array.from({ length: 6 }, () => {
    const d = ctx.createImageData(W, H);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    return d;
  });
  let f = 0; let acc = 0;
  if (REDUCED) { ctx.putImageData(frames[0], 0, 0); return; }
  gsap.ticker.add((_, dt) => { acc += dt; if (acc > 70) { acc = 0; ctx.putImageData(frames[f++ % frames.length], 0, 0); } });
}

function initClock() {
  const el = $('[data-clock]');
  const fmt = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Argentina/Buenos_Aires' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 1000);
}

function initSideHud() {
  const num = $('[data-hud-num]'); const name = $('[data-hud-name]'); const prog = $('[data-hud-progress]');
  const sections = $$('[data-section]');
  const links = $$('.nav__links a');
  sections.forEach((s, i) => ScrollTrigger.create({
    trigger: s, start: 'top 50%', end: 'bottom 50%',
    onToggle: (self) => {
      if (!self.isActive) return;
      num.textContent = String(i).padStart(2, '0');
      name.textContent = s.dataset.section;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${s.id}`));
    },
  }));
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { prog.style.transform = `scaleY(${s.progress})`; } });
}
