import { revalidatePath } from 'next/cache';
import { getContentRepository } from './blob-repo';
import type { Content } from './types';
import { SEED_CONTENT } from './seed';

export const CONTENT_TAG = 'ailav-content';

/**
 * Read current content.
 * No in-memory cache — blob reads are ~100 ms and the write path already
 * cache-busts the Blob CDN (see `BlobContentRepository.read`).
 * Page-level caching is handled by Next.js route segments,
 * which `saveContent` invalidates via `revalidatePath`.
 */
export async function getContent(): Promise<Content> {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (isDev) console.log('[content] BLOB_READ_WRITE_TOKEN missing → using seed data');
    return SEED_CONTENT;
  }
  try {
    const data = await getContentRepository().read();
    if (isDev) {
      console.log(
        `[content] read ok: site=${data.site?.name ?? '?'} chefs=${data.chefs?.length ?? 0}`
      );
    }
    return data;
  } catch (e) {
    if (isDev) console.error('[content] read failed → seed fallback:', e);
    return SEED_CONTENT;
  }
}

export async function saveContent(next: Content): Promise<void> {
  const isDev = process.env.NODE_ENV !== 'production';
  await getContentRepository().write(next);
  if (isDev) {
    try {
      const verify = await getContentRepository().read();
      console.log(
        `[content] write verified: site=${verify.site.name} desc="${verify.site.description.slice(0, 40)}..."`
      );
    } catch (e) {
      console.error('[content] write verification failed:', e);
    }
  }
  revalidatePath('/', 'layout');
}

export { SEED_CONTENT };
export type { Content } from './types';
