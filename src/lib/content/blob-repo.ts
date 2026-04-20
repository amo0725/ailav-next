import { del, head, list, put } from '@vercel/blob';
import type { ContentRepository } from './repository';
import type { Content } from './types';
import { ContentSchema } from './schema';
import { SEED_CONTENT } from './seed';

// Immutable content pattern (Vercel-recommended):
// - Each save writes to a NEW pathname so CDN + browsers never serve stale.
// - Reads discover the most recent blob via `list()` + `uploadedAt` sort.
// - Older versions are pruned to keep a rolling history.
const CONTENT_PREFIX = 'content/';
const LEGACY_PATHNAME = 'content.json';
const HISTORY_KEEP = 5;

export class BlobContentRepository implements ContentRepository {
  async read(): Promise<Content> {
    const latestUrl = await this.resolveLatestUrl();
    if (!latestUrl) return SEED_CONTENT;

    const res = await fetch(latestUrl, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return SEED_CONTENT;

    const raw = await res.json();
    const parsed = ContentSchema.safeParse(raw);
    return parsed.success ? parsed.data : SEED_CONTENT;
  }

  async write(content: Content): Promise<void> {
    const validated = ContentSchema.parse(content);
    const pathname = `${CONTENT_PREFIX}${Date.now()}.json`;

    await put(pathname, JSON.stringify(validated, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
      cacheControlMaxAge: 0,
    });

    // Fire-and-forget cleanup; never block the save UI on it.
    this.cleanup(HISTORY_KEEP).catch(() => void 0);
  }

  private async resolveLatestUrl(): Promise<string | null> {
    try {
      const { blobs } = await list({ prefix: CONTENT_PREFIX, limit: 100 });
      if (blobs.length > 0) {
        const newest = [...blobs].sort(
          (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
        )[0];
        return newest.url;
      }
    } catch {
      /* fall through to legacy */
    }

    // Backward compat: older deployments wrote to the fixed "content.json".
    try {
      const meta = await head(LEGACY_PATHNAME);
      return meta.url;
    } catch {
      return null;
    }
  }

  async cleanup(keep: number = HISTORY_KEEP): Promise<void> {
    const { blobs } = await list({ prefix: CONTENT_PREFIX, limit: 100 });
    const sorted = [...blobs].sort(
      (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
    const stale = sorted.slice(keep);
    if (stale.length === 0) return;
    await del(stale.map((b) => b.url));
  }
}

let instance: BlobContentRepository | null = null;

export function getContentRepository(): BlobContentRepository {
  if (!instance) instance = new BlobContentRepository();
  return instance;
}
