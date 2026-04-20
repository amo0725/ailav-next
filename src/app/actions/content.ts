'use server';

import { z } from 'zod';
import {
  ChefSchema,
  ConceptSchema,
  HeroSchema,
  ManifestoSchema,
  MenuItemSchema,
  RestaurantSchema,
  SiteSchema,
} from '@/lib/content/schema';
import { getContent, saveContent } from '@/lib/content';
import { requireAuthenticated } from '@/lib/auth/session';
import type { Content } from '@/lib/content/types';

type Result = { ok: true } | { error: string };

function formatZodError(err: z.ZodError): string {
  return err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('；');
}

async function patch<K extends keyof Content>(
  key: K,
  schema: z.ZodType<Content[K]>,
  value: unknown
): Promise<Result> {
  try {
    await requireAuthenticated();
  } catch {
    return { error: '未登入' };
  }
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }
  try {
    const current = await getContent();
    const next: Content = { ...current, [key]: parsed.data };
    await saveContent(next);
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : '儲存失敗' };
  }
}

export async function updateSite(value: unknown): Promise<Result> {
  return patch('site', SiteSchema, value);
}

export async function updateHero(value: unknown): Promise<Result> {
  return patch('hero', HeroSchema, value);
}

export async function updateConcept(value: unknown): Promise<Result> {
  return patch('concept', ConceptSchema, value);
}

export async function updateManifesto(value: unknown): Promise<Result> {
  return patch('manifesto', ManifestoSchema, value);
}

export async function updateChefs(value: unknown): Promise<Result> {
  return patch('chefs', z.array(ChefSchema).min(1).max(12), value);
}

export async function updateMenu(value: unknown): Promise<Result> {
  return patch('menu', z.array(MenuItemSchema).min(1).max(12), value);
}

export async function updateRestaurant(value: unknown): Promise<Result> {
  return patch('restaurant', RestaurantSchema, value);
}
