// Single source for everything editable on the press kit: links, releases, venues, rider.

export const CONTACT = {
  email: 'survivalmodemusic@outlook.com',
  // Leave a value empty ('') to hide that link everywhere on the site.
  instagram: 'https://www.instagram.com/survivalmode.music/',
  soundcloud: 'https://soundcloud.com/user-875672829',
  beatport: 'https://www.beatport.com/artist/survival-mode/925988',
  spotify: '',
  whatsapp: '',
  pressPack: '/media/press/survival-mode-presskit.zip',
};

export const KOOK = {
  instagram: 'https://www.instagram.com/kook.label/',
  soundcloud: 'https://soundcloud.com/kooklabel',
  beatport: 'https://www.beatport.com/label/kook-label/100223',
};

export const STATS = [
  { value: 60, suffix: '+', key: 'stat.releases' },
  { value: 20, suffix: '+', key: 'stat.labels' },
  { value: 9, suffix: '', key: 'stat.cities' },
  { value: 2020, suffix: '', key: 'stat.since', plain: true },
];

export const LABELS = [
  'Be One Records', 'Happy Techno', 'Gritty', 'Short Circuit', 'New Violence',
  'Omeric Riddms', 'Ohana Music', 'Not For Me', 'NO.RUL3S', 'Ole White',
  'Space Invaders', 'Kappa Recordings', 'Innocent Music', 'KOOK Label',
];

export const SHARED_BOOTH = [
  { name: 'Green Velvet', from: 'US' },
  { name: 'Carlita', from: 'IT' },
  { name: 'Steve Lawler', from: 'UK' },
  { name: 'Stefano Noferini', from: 'IT' },
  { name: 'Hector Couto', from: 'ES' },
  { name: 'Miguel Bastida', from: 'ES' },
  { name: 'Cuartero', from: 'ES' },
  { name: 'Latmun', from: 'UK' },
  { name: 'Lexlay', from: 'AR' },
];

const cover = (uuid) => `https://geo-media.beatport.com/image_size/500x500/${uuid}.jpg`;
const bp = (slug, id) => `https://www.beatport.com/release/${slug}/${id}`;

export const RELEASES = [
  { title: 'Check My Sound EP', artists: 'Survival Mode', label: 'NO.RUL3S Music', year: 2026, bpm: '129–130', cover: cover('da634faa-2ffa-4b1e-9fe8-fbeaf616e281'), url: bp('check-my-sound-ep', 7542893) },
  { title: "Who's Watching Me?", artists: 'Survival Mode, Black Rabbit (AR)', label: 'KOOK Label', year: 2026, bpm: '129', cover: cover('b4eeae44-5a5e-4962-9a73-6162f6970c10'), url: bp('whos-watching-me-extended-mix', 7494770) },
  { title: 'Real Groove', artists: 'Survival Mode', label: 'KOOK Label', year: 2026, bpm: '128–129', cover: cover('3bd90f64-44df-45ba-9c45-cde1a1a27ecd'), url: bp('real-groove', 6850729) },
  { title: 'Voices in My Head', artists: 'Survival Mode', label: 'Be One Records', year: 2024, bpm: '129–130', cover: cover('cd684d72-13bf-4f32-8bf2-9cb3d9ae52cf'), url: bp('voices-in-my-head', 4585683) },
  { title: 'Ma Tempo', artists: 'Survival Mode', label: 'Not For Me', year: 2024, bpm: '129', cover: cover('8c23c081-9205-47a7-b0e8-0d2ee6bbc657'), url: bp('ma-tempo', 4563353) },
  { title: 'President', artists: 'Survival Mode', label: 'Kappa Recordings', year: 2023, bpm: '128–130', cover: cover('5d6d5551-4932-4ca8-a1a8-04f54888509e'), url: bp('president', 4207814) },
  { title: 'Make U', artists: 'Survival Mode, Black Rabbit (AR)', label: 'KOOK Label', year: 2023, bpm: '129–130', cover: cover('fe2825c3-bc37-4ca2-b093-64f10a5ed310'), url: bp('make-u', 4183169) },
  { title: 'Beautiful Tango', artists: 'Survival Mode, Black Rabbit (AR)', label: 'NVDRZ', year: 2023, bpm: '127–130', cover: cover('c1ccb1f2-c81e-4994-a3b7-8934c3c8cbd8'), url: bp('beautiful-tango', 4156926) },
  { title: 'Crazy Fla', artists: 'Survival Mode', label: 'Be One Records', year: 2023, bpm: '130', cover: cover('193b87c5-0e57-448e-904d-89d0543aa897'), url: bp('crazy-fla', 4140852) },
  { title: 'Bring It EP', artists: 'HIGHTECH (ARG), Survival Mode', label: 'New Violence', year: 2022, bpm: '127–128', cover: cover('1e5e5c2a-4c3b-4e4c-bd50-cdc329040dda'), url: bp('bring-it-ep', 3898115) },
  { title: '2morrow EP', artists: 'Survival Mode', label: 'Ole White', year: 2022, bpm: '130', cover: cover('bbce2092-4944-4dd5-8c28-c2974b285b30'), url: bp('2morrow-ep', 3712674) },
  { title: 'Go Jamie', artists: 'Survival Mode', label: 'Be One Records', year: 2022, bpm: '129–130', cover: cover('a8a5b9b3-3a90-487d-8a83-64f1fc17ba71'), url: bp('go-jamie', 3648990) },
  { title: 'Dmolly EP', artists: 'Survival Mode', label: 'Innocent Music', year: 2021, bpm: '126', cover: cover('bfb0a423-723a-45f3-8061-214424f7a82c'), url: bp('dmolly-ep', 3476488) },
];

export const SETS = [
  { key: 'set.vanguard', url: 'https://soundcloud.com/user-875672829/survival-mode-mdq-sunset' },
  { key: 'set.vorterix', url: 'https://soundcloud.com/user-875672829/set-vorterix' },
  { key: 'set.calamar', url: 'https://soundcloud.com/user-875672829/set-calamar-loco-150124' },
];

export const VIDEOS = [
  { id: 'drop-1', key: 'vid.drop1' },
  { id: 'booth-red', key: 'vid.boothRed' },
  { id: 'sonora-park', key: 'vid.sonora' },
  { id: 'vanguard', key: 'vid.vanguard' },
  { id: 'drop-2', key: 'vid.drop2' },
  { id: 'festival-blue', key: 'vid.festival' },
  { id: 'booth-hands', key: 'vid.boothHands' },
  { id: 'led-stage', key: 'vid.led' },
  { id: 'bouncing', key: 'vid.bouncing' },
];

export const VENUES = [
  'Sonora Park', 'Vanguard Normandina', 'Bruto', 'Only Normandina', 'Mr. Jones',
  'GAP', 'Quba', 'La Caseta', 'Bouncing Fest', 'Calamar Loco', 'This Is Techno', 'Vorterix',
];

// lat/lon used to plot the radar relative to Mar del Plata; `label` sets which side the name sits.
export const HOME = { name: 'Mar del Plata', lat: -38.0055, lon: -57.5426 };
export const CITIES = [
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, label: 'right' },
  { name: 'La Plata', lat: -34.9214, lon: -57.9545, label: 'below' },
  { name: 'Córdoba', lat: -31.4201, lon: -64.1888, label: 'left' },
  { name: 'Rosario', lat: -32.9442, lon: -60.6505, label: 'left' },
  { name: 'Entre Ríos', lat: -31.7413, lon: -60.5115, label: 'right' },
  { name: 'Neuquén', lat: -38.9516, lon: -68.0591, label: 'below' },
  { name: 'Bahía Blanca', lat: -38.7196, lon: -62.2724, label: 'below' },
  { name: 'Junín', lat: -34.5939, lon: -60.9465, label: 'left' },
];

export const GALLERY = {
  press: ['street-graffiti', 'pink-portrait', 'studio-bw', 'street-closeup', 'pink-eyes', 'street-plaza', 'studio-dark', 'pink-jacket', 'street-wall', 'studio-white', 'pink-beige', 'street-court', 'studio-profile', 'pink-glasses', 'pink-closeup', 'studio-dark-2'],
  live: ['live-snr-stage', 'live-kook-purple', 'live-bouncing', 'live-red', 'live-snr-lasers', 'live-techno', 'live-crowd-bw', 'live-purple', 'live-bouncing-wide', 'live-kook-crowd', 'live-snr-red', 'live-crowd-lasers', 'live-bouncing-fisheye'],
};

// Technical rider — confirm with the artist before sending to promoters.
export const RIDER = [
  { qty: '3×', key: 'rider.cdj', model: 'Pioneer DJ CDJ-3000', alt: 'rider.cdjAlt' },
  { qty: '1×', key: 'rider.mixer', model: 'Pioneer DJ DJM-V10 / DJM-A9', alt: 'rider.mixerAlt' },
  { qty: '2×', key: 'rider.monitor', model: 'Booth monitors', alt: 'rider.monitorAlt' },
  { qty: '1×', key: 'rider.link', model: 'Pro DJ Link · LAN hub', alt: 'rider.linkAlt' },
];
