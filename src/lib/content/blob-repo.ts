import { del, head, list, put } from '@vercel/blob';
import type { ContentRepository } from './repository';
import type { Content } from './types';
import { ContentSchema } from './schema';
import { SEED_CONTENT } from './seed';
import { LocalFsContentRepository } from './fs-repo';

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

    // Tag the fetch with CONTENT_TAG (kept as a literal here to avoid the
    // index.ts ↔ blob-repo.ts circular import). Cache freshness is now
    // owned by the `'use cache'` boundary in getContent() — no-store /
    // Cache-Control: no-cache are obsolete under Cache Components.
    const res = await fetch(latestUrl, {
      next: { tags: ['ailav-content'] },
    });
    if (!res.ok) return SEED_CONTENT;

    const raw = await res.json();
    const parsed = ContentSchema.safeParse(raw);
    if (parsed.success) return parsed.data;

    // Older blobs predate the menuCards field (and one short-lived shape
    // had `menus` instead of `menu`). Lift them in-place so admins can
    // open the editor on the new build without first re-saving everything.
    const migrated = migrateLegacyContent(raw);
    if (migrated) {
      const reparsed = ContentSchema.safeParse(migrated);
      if (reparsed.success) return reparsed.data;
    }
    return SEED_CONTENT;
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

function migrateLegacyContent(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  let touched = false;

  // Short-lived intermediate shape (now reverted) wrote `menus` instead of
  // `menu`; surface those entries as the new `menuCards` so we don't lose them.
  if (!('menuCards' in obj) && Array.isArray(obj.menus)) {
    obj.menuCards = obj.menus;
    delete obj.menus;
    touched = true;
  }
  if (!('menuCards' in obj)) {
    obj.menuCards = [];
    touched = true;
  }
  // Restore the homepage session list if a previous broken save dropped it.
  if (!Array.isArray(obj.menu) || obj.menu.length === 0) {
    obj.menu = SEED_CONTENT.menu;
    touched = true;
  }

  return touched ? obj : null;
}

let instance: ContentRepository | null = null;

export function getContentRepository(): ContentRepository {
  if (instance) return instance;
  instance =
    process.env.USE_LOCAL_BLOB === 'true'
      ? new LocalFsContentRepository()
      : new BlobContentRepository();
  return instance;
}
