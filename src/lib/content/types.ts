import type { ImageInput } from './image';

export type ChefAward = {
  stat: string;
  label: string;
};

export type Chef = {
  id: string;
  name: string;
  images: ImageInput[];
  bio: string[];
  awards: ChefAward[];
  flip: boolean;
};

/* ── Homepage menu (session overview cards) ──────────────────── */
export type MenuItem = {
  id: string;
  title: string;
  price: string;
  description: string;
  note: string;
};

/* ── Printed-card menus ───────────────────────────────────────── */

export type MenuTheme = {
  bg: string;
  fg: string;
  accent: string;
};

export type MenuDish = {
  id: string;
  titleZh: string;
  titleEn: string;
  price: string;
  image: ImageInput | '';
  note: string;
};

export type MenuCardCourse = {
  id: string;
  heading: string;
  items: MenuDish[];
};

type MenuCardBase = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  theme: MenuTheme;
  footnote: string;
};

export type TastingMenuCard = MenuCardBase & {
  kind: 'tasting';
  courses: MenuCardCourse[];
};

export type ALaCarteMenuCard = MenuCardBase & {
  kind: 'a-la-carte';
  items: MenuDish[];
};

export type MenuCard = TastingMenuCard | ALaCarteMenuCard;

export type HoursBlock = {
  days: string;
  time: string;
  label: string;
};

export type Hours = {
  mainCourse: HoursBlock;
  tasting: HoursBlock;
  wineBar: HoursBlock;
  closed: string;
};

export type Restaurant = {
  address: string;
  lat: number;
  lng: number;
  hours: Hours;
  mapEmbedUrl: string;
  /** Online reservation CTA target. Empty / missing → CTA is hidden.
   * Validated as http(s) only at the schema layer. */
  reservationUrl?: string;
};

export type HeroScatterImage = {
  src: ImageInput;
  /** Legacy outer alt — kept for backward compat with older blobs.
   * New saves store alt inside the ImageAsset (src.alt).
   * Renderer prefers inner alt, falls back to this field. */
  alt?: string;
  className: string;
};

export type Hero = {
  mainImage: ImageInput;
  scatterImages: HeroScatterImage[];
};

export type ManifestoWord = {
  fr: string;
  en: string;
  zh: string;
};

export type Manifesto = {
  words: ManifestoWord[];
  videoUrl: string;
  posterImage: ImageInput;
};

export type Concept = {
  heading: string;
  paragraphs: string[];
  image: ImageInput;
};

export type Site = {
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
};

export type Content = {
  site: Site;
  hero: Hero;
  concept: Concept;
  manifesto: Manifesto;
  chefs: Chef[];
  menu: MenuItem[];
  menuCards: MenuCard[];
  restaurant: Restaurant;
};

export type { ImageAsset, ImageInput, FocalPoint } from './image';
