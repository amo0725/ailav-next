import { z } from 'zod';
import { isAllowedMapUrl } from './map-url';
import { isAllowedReservationUrl } from './reservation-url';

/* ── Image asset schema ────────────────────────────────────────
 * Accepts both legacy plain string URLs and the new {src, focal,
 * alt} object — fully backward compatible. Helpers in image.ts
 * normalise on read.
 * ───────────────────────────────────────────────────────────── */

export const FocalPointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const ImageAssetObjectSchema = z.object({
  src: z.string().min(1).max(500),
  focal: FocalPointSchema.optional(),
  alt: z.string().max(200).optional(),
});

// Use union of string OR object so we never invalidate older blobs.
export const ImageAssetSchema = z.union([
  z.string().min(1).max(500),
  ImageAssetObjectSchema,
]);

export const ChefAwardSchema = z.object({
  stat: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
});

export const ChefSchema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  images: z.array(ImageAssetSchema).min(1).max(10),
  bio: z.array(z.string().min(1).max(800)).min(1).max(6),
  awards: z.array(ChefAwardSchema).max(6),
  flip: z.boolean(),
});

/* ── Homepage menu (session overview cards) ──────────────────── */

export const MenuItemSchema = z.object({
  id: z.string().min(1).max(40),
  title: z.string().min(1).max(80),
  price: z.string().min(1).max(40),
  description: z.string().min(1).max(400),
  note: z.string().max(200),
});

/* ── Printed-card menus (photo aesthetic, /menu route) ───────── */

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const SLUG = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const MenuThemeSchema = z.object({
  bg: z.string().regex(HEX_COLOR, '需為 hex 色碼，如 #b45a3c'),
  fg: z.string().regex(HEX_COLOR, '需為 hex 色碼'),
  accent: z.string().regex(HEX_COLOR, '需為 hex 色碼'),
});

export const MenuDishSchema = z.object({
  id: z.string().min(1).max(40),
  titleZh: z.string().min(1).max(200),
  titleEn: z.string().max(200),
  price: z.string().max(40),
  // image is optional; a string '' or empty asset both render as no-image.
  image: z.union([z.literal(''), ImageAssetSchema]),
  note: z.string().max(200),
});

export const MenuCardCourseSchema = z.object({
  id: z.string().min(1).max(40),
  heading: z.string().min(1).max(80),
  items: z.array(MenuDishSchema).min(1).max(20),
});

const MenuCardBaseShape = {
  id: z.string().min(1).max(40),
  slug: z.string().min(1).max(40).regex(SLUG, 'slug 只允許英數與連字號'),
  name: z.string().min(1).max(80),
  subtitle: z.string().max(120),
  theme: MenuThemeSchema,
  footnote: z.string().max(200),
};

export const TastingMenuCardSchema = z.object({
  ...MenuCardBaseShape,
  kind: z.literal('tasting'),
  courses: z.array(MenuCardCourseSchema).min(1).max(10),
});

export const ALaCarteMenuCardSchema = z.object({
  ...MenuCardBaseShape,
  kind: z.literal('a-la-carte'),
  items: z.array(MenuDishSchema).min(1).max(40),
});

export const MenuCardSchema = z.discriminatedUnion('kind', [
  TastingMenuCardSchema,
  ALaCarteMenuCardSchema,
]);

export const MenuCardsSchema = z.array(MenuCardSchema).max(8);

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
  mapEmbedUrl: z
    .string()
    .url()
    .refine(isAllowedMapUrl, {
      message: '只接受 Google Maps 嵌入網址（https://www.google.com/maps/embed…）',
    }),
  // Online reservation CTA target. Empty string OR a valid http(s) URL.
  // Scheme is restricted (no `javascript:` / `data:`) since this is rendered
  // verbatim into <a href={…}> on the public site.
  reservationUrl: z
    .union([
      z.literal(''),
      z
        .string()
        .url()
        .max(500)
        .refine(isAllowedReservationUrl, {
          message: '只接受 http:// 或 https:// 網址',
        }),
    ])
    .optional(),
});

export const HeroScatterImageSchema = z.object({
  // src can be either a plain URL string (legacy) or an ImageAsset object.
  // When src is an ImageAsset object, asset.alt is the source of truth.
  // The outer `alt` is kept optional for backward compat with older blobs
  // that stored alt as a sibling of src.
  src: ImageAssetSchema,
  alt: z.string().max(120).optional(),
  className: z.string().min(1).max(40),
});

export const HeroSchema = z.object({
  mainImage: ImageAssetSchema,
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
  posterImage: ImageAssetSchema,
});

export const ConceptSchema = z.object({
  heading: z.string().min(1).max(80),
  paragraphs: z.array(z.string().min(1).max(600)).min(1).max(6),
  image: ImageAssetSchema,
});

export const SiteSchema = z.object({
  name: z.string().min(1).max(40),
  tagline: z.string().min(1).max(80),
  subtitle: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
});

export const ContentSchema = z.object({
  // Tolerate legacy blobs that predate the version field. .default() runs
  // when the input is undefined and produces a non-optional output type so
  // callers always see a string. Saves explicitly bump version anyway.
  version: z.string().default(() => crypto.randomUUID()),
  site: SiteSchema,
  hero: HeroSchema,
  concept: ConceptSchema,
  manifesto: ManifestoSchema,
  chefs: z.array(ChefSchema).min(1).max(12),
  menu: z.array(MenuItemSchema).min(1).max(12),
  menuCards: MenuCardsSchema,
  restaurant: RestaurantSchema,
});
