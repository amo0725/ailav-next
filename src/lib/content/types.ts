export type ChefAward = {
  stat: string;
  label: string;
};

export type Chef = {
  id: string;
  name: string;
  images: string[];
  bio: string[];
  awards: ChefAward[];
  flip: boolean;
};

export type MenuItem = {
  id: string;
  title: string;
  price: string;
  description: string;
  note: string;
};

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
};

export type HeroScatterImage = {
  src: string;
  alt: string;
  className: string;
};

export type Hero = {
  mainImage: string;
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
  posterImage: string;
};

export type Concept = {
  heading: string;
  paragraphs: string[];
  image: string;
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
  restaurant: Restaurant;
};
