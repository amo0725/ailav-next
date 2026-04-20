import { z } from 'zod';

export const ChefAwardSchema = z.object({
  stat: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
});

export const ChefSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  images: z.array(z.string().min(1)).min(1).max(10),
  bio: z.array(z.string().min(1).max(800)).min(1).max(6),
  awards: z.array(ChefAwardSchema).max(6),
  flip: z.boolean(),
});

export const MenuItemSchema = z.object({
  id: z.string().min(1).max(40),
  title: z.string().min(1).max(80),
  price: z.string().min(1).max(40),
  description: z.string().min(1).max(400),
  note: z.string().max(200),
});

export const HoursBlockSchema = z.object({
  days: z.string().min(1).max(40),
  time: z.string().min(1).max(40),
  label: z.string().min(1).max(40),
});

export const HoursSchema = z.object({
  mainCourse: HoursBlockSchema,
  tasting: HoursBlockSchema,
  wineBar: HoursBlockSchema,
  closed: z.string().min(1).max(40),
});

export const RestaurantSchema = z.object({
  address: z.string().min(1).max(200),
  lat: z.number(),
  lng: z.number(),
  hours: HoursSchema,
  mapEmbedUrl: z.string().url(),
});

export const HeroScatterImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1).max(120),
  className: z.string().min(1).max(40),
});

export const HeroSchema = z.object({
  mainImage: z.string().min(1),
  scatterImages: z.array(HeroScatterImageSchema).max(10),
});

export const ManifestoWordSchema = z.object({
  fr: z.string().min(1).max(40),
  en: z.string().min(1).max(40),
  zh: z.string().min(1).max(80),
});

export const ManifestoSchema = z.object({
  words: z.array(ManifestoWordSchema).length(3),
  videoUrl: z.string().url(),
  posterImage: z.string().min(1),
});

export const ConceptSchema = z.object({
  heading: z.string().min(1).max(80),
  paragraphs: z.array(z.string().min(1).max(600)).min(1).max(6),
  image: z.string().min(1),
});

export const SiteSchema = z.object({
  name: z.string().min(1).max(40),
  tagline: z.string().min(1).max(80),
  subtitle: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
});

export const ContentSchema = z.object({
  site: SiteSchema,
  hero: HeroSchema,
  concept: ConceptSchema,
  manifesto: ManifestoSchema,
  chefs: z.array(ChefSchema).min(1).max(12),
  menu: z.array(MenuItemSchema).min(1).max(12),
  restaurant: RestaurantSchema,
});
