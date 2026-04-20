import { revalidatePath } from 'next/cache';
import { getContentRepository } from './blob-repo';
import type { Content } from './types';
import { SEED_CONTENT } from './seed';

export const CONTENT_TAG = 'ailav-content';

/**
 * Read current content.
 * No in-memory cache — blob reads are ~100ms and the write path produces a
 * brand-new blob URL (immutable pattern), so the CDN never returns stale.
 */
export async function getContent(): Promise<Content> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return SEED_CONTENT;
  try {
    return await getContentRepository().read();
  } catch {
    return SEED_CONTENT;
  }
}

export async function saveContent(next: Content): Promise<void> {
  await getContentRepository().write(next);
  revalidatePath('/', 'layout');
}

export { SEED_CONTENT };
export type { Content } from './types';
