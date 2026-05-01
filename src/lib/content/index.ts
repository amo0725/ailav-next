import { cacheLife, cacheTag } from 'next/cache';
import { getContentRepository } from './blob-repo';
import type { Content } from './types';
import { SEED_CONTENT } from './seed';

export const CONTENT_TAG = 'ailav-content';

/**
 * Read current content (Cache Components).
 *
 * The result is memoised in the per-instance LRU and the static shell.
 * Invalidated via `updateTag(CONTENT_TAG)` from the Server Action layer
 * (see /src/app/actions/content.ts), so admin saves are visible on the
 * next render without paying the Vercel Blob op cost on every public hit.
 */
export async function getContent(): Promise<Content> {
  'use cache';
  cacheLife('max');
  cacheTag(CONTENT_TAG);

  if (
    !process.env.BLOB_READ_WRITE_TOKEN &&
    process.env.USE_LOCAL_BLOB !== 'true'
  ) {
    return SEED_CONTENT;
  }
  try {
    return await getContentRepository().read();
  } catch {
    return SEED_CONTENT;
  }
}

export async function saveContent(next: Content): Promise<void> {
  // Bumping the version on every write lets admin pages remount editors
  // with `key={content.version}` after a save — the new server data is
  // picked up even when the route is held in a hidden Activity boundary.
  const versioned: Content = { ...next, version: crypto.randomUUID() };
  await getContentRepository().write(versioned);
  // updateTag() lives in actions/content.ts (it is only callable inside
  // a Server Action; this lib function is also reachable from non-action
  // contexts in principle, so we keep the responsibility there).
}

export { SEED_CONTENT };
export type { Content } from './types';
