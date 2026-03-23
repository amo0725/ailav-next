/* ── Site Constants (Single Source of Truth) ── */

export const SITE_NAME = 'AILAV';
export const SITE_URL = 'https://ailav.com';
export const SITE_TAGLINE = 'Aile · Il a · Voyage';
export const SITE_SUBTITLE = 'A Migratory Chef\'s Journey of Flavor & Love';
export const SITE_DESCRIPTION =
  "AILAV — Pronounced as 'I Love'. A migratory chef's journey of flavor and love. 高雄精緻餐飲。";

/* ── Restaurant Info ── */
export const RESTAURANT = {
  address: '807 高雄市三民區民壯路 43 號',
  lat: 22.639763,
  lng: 120.340723,
  hours: {
    lunch: { days: '週五至週日', time: '12:00 – 15:00' },
    dinner: { days: '週三至週日', time: '18:30 – 22:30' },
    closed: '週一、週二公休',
  },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500!2d120.340723!3d22.639763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM4JzIzLjEiTiAxMjDCsDIwJzI2LjYiRQ!5e0!3m2!1szh-TW!2stw!4v1',
} as const;

/* ── Social Links ── */
export const SOCIAL = {
  instagram: 'https://www.instagram.com/ailav_kaohsiung/',
  facebook: '#',
} as const;

/* ── Menu ── */
export const MENU_ITEMS = [
  {
    id: 'lunch',
    title: '午間套餐',
    price: 'NT$ 980 +10%',
    description: '六道式午間料理，以輕盈筆觸描繪當季風景。',
    note: '週五至週日供應',
  },
  {
    id: 'dinner',
    title: '晚間套餐',
    price: 'NT$ 1,280 +10%',
    description: '十道式完整體驗，從前菜到甜點的味覺敘事。',
    note: '週三至週日供應',
  },
  {
    id: 'drinks',
    title: '酒飲搭配',
    price: 'NT$ 680 +10%',
    description: '侍酒師精選，為每道菜品找到最完美的液態伴侶。',
    note: '',
  },
] as const;

/* ── Chefs ── */
export const CHEFS = [
  {
    id: 'liao',
    name: '廖冠宇 — Kuan-Yu Liao',
    image: '/images/chef-liao.jpg',
    bio: [
      '以細膩的味覺直覺與紮實的法式技藝為底蘊，廖冠宇主廚相信料理的本質在於「對話」——與食材對話、與風土對話、與每一位坐在餐桌前的人對話。',
      '在歐洲歷經多年修業後回到台灣，將亞洲的豐富食材以當代語彙重新詮釋，每一道菜都是一封寫給這片土地的情書。',
    ],
    awards: [
      { stat: '★★', label: 'MICHELIN Guide\nTaiwan 2024' },
      { stat: '#26', label: "Asia's 50 Best\nRestaurants" },
    ],
    flip: false,
  },
  {
    id: 'huang',
    name: '黃恆毅 — Heng-Yi Huang',
    image: '/images/chef-huang.jpg',
    bio: [
      '黃恆毅主廚擅長以大膽的風味組合打破傳統框架。深厚的調酒背景賦予他獨特的味覺視角——在液態與固態之間探索味覺的邊界，為 AILAV 帶來無法被定義的創作能量。',
      '每一次的創作都是一場實驗，將經典技法與當代思維交織，在餐桌上構築出超越期待的感官體驗。',
    ],
    awards: [
      { stat: '創新', label: '年度最佳\n新銳主廚' },
      { stat: '跨界', label: '料理與調酒\n融合先驅' },
    ],
    flip: true,
  },
] as const;

/* ── Hero Images ── */
export const HERO_MAIN_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85&auto=format&fm=avif';

export const HERO_SCATTER_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fm=avif', alt: '精緻擺盤', className: 'gi-1' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80&auto=format&fm=avif', alt: '餐廳空間', className: 'gi-2' },
  { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80&auto=format&fm=avif', alt: '色彩料理', className: 'gi-3' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80&auto=format&fm=avif', alt: '窯烤料理', className: 'gi-4' },
  { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80&auto=format&fm=avif', alt: '甜點', className: 'gi-5' },
] as const;

/* ── Manifesto ── */
export const MANIFESTO_WORDS = [
  { fr: 'Aile', en: 'Wing', zh: '翅膀 — 飛往未知的勇氣' },
  { fr: 'Il a', en: 'He has', zh: '他擁有 — 對風味的執著' },
  { fr: 'Voyage', en: 'Journey', zh: '旅程 — 永不結束的探索' },
] as const;

export const MANIFESTO_VIDEO_URL =
  'https://assets.mixkit.co/videos/4043/4043-720.mp4';

/* ── Timing ── */
export const LOADER_DURATION_MS = 3200;
export const LOADER_FALLBACK_MS = 6000;
export const WELCOME_SHOW_DELAY_MS = 3500;
export const WELCOME_HIDE_DELAY_MS = 12000;

/* ── Navigation ── */
export const NAV_LINKS = [
  { href: '#concept', zh: '理念', en: 'CONCEPT' },
  { href: '#chef', zh: '主廚', en: 'CHEF' },
  { href: '#menu', zh: '菜單', en: 'MENU' },
  { href: '#reserve', zh: '預約', en: 'RESERVATION' },
] as const;
