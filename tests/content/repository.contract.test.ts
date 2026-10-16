import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContentRepository } from '@/lib/content/repository';
import type { Content } from '@/lib/content/types';
import { ContentSchema } from '@/lib/content/schema';
import { SEED_CONTENT } from '@/lib/content/seed';
import { LocalFsContentRepository } from '@/lib/content/fs-repo';
import { BlobContentRepository } from '@/lib/content/blob-repo';

/* ── In-memory Vercel Blob ──────────────────────────────────────
 * Just enough of @vercel/blob (put / list / head / del) plus a
 * matching global fetch() so BlobContentRepository runs its real
 * read/write/migrate/cleanup logic without the network.
 * ──────────────────────────────────────────────────────────── */
const blob = vi.hoisted(() => {
  type Entry = { pathname: string; url: string; body: string; uploadedAt: Date };
  const entries = new Map<string, Entry>();
  let clock = Date.UTC(2026, 0, 1);
  let seq = 0;

  function add(pathname: string, body: string): Entry {
    seq += 1;
    clock += 1_000; // strictly increasing so "newest" is unambiguous
    const url = `https://store.public.blob.vercel-storage.com/${pathname}?v=${seq}`;
    const entry = { pathname, url, body, uploadedAt: new Date(clock) };
    entries.set(url, entry);
    return entry;
  }

  return {
    entries,
    add,
    reset() {
      entries.clear();
      seq = 0;
    },
    api: {
      put: async (
        pathname: string,
        body: string,
        opts: { addRandomSuffix?: boolean } = {}
      ) => {
        // Like the real API, addRandomSuffix inserts a suffix before the extension.
        const finalPath = opts.addRandomSuffix
          ? pathname.replace(/(\.[^./]+)?$/, `-rnd${seq + 1}$1`)
          : pathname;
        const e = add(finalPath, body);
        return { url: e.url, pathname: e.pathname };
      },
      list: async ({ prefix }: { prefix: string }) => ({
        blobs: [...entries.values()]
          .filter((e) => e.pathname.startsWith(prefix))
          .map(({ url, pathname, uploadedAt }) => ({ url, pathname, uploadedAt })),
      }),
      head: async (pathname: string) => {
        const e = [...entries.values()].find((x) => x.pathname === pathname);
        if (!e) throw new Error('BlobNotFoundError');
        return { url: e.url, pathname: e.pathname, uploadedAt: e.uploadedAt };
      },
      del: async (urls: string[]) => {
        for (const u of urls) entries.delete(u);
      },
    },
    fetch: async (url: string) => {
      const e = entries.get(url);
      return e
        ? new Response(e.body, { status: 200 })
        : new Response('not found', { status: 404 });
    },
  };
});

vi.mock('@vercel/blob', () => blob.api);

/* ── Reference in-memory implementation ─────────────────────── */
class InMemoryContentRepository implements ContentRepository {
  private stored: Content | null = null;

  async read(): Promise<Content> {
    return this.stored ? structuredClone(this.stored) : SEED_CONTENT;
  }

  async write(content: Content): Promise<void> {
    this.stored = structuredClone(ContentSchema.parse(content));
  }
}

function edited(version: string, tagline: string): Content {
  const next = structuredClone(SEED_CONTENT);
  next.version = version;
  next.site.tagline = tagline;
  return next;
}

/* ── Shared contract ────────────────────────────────────────── */
type Harness = {
  name: string;
  setup: () => Promise<ContentRepository>;
  teardown?: () => Promise<void>;
};

let tmpDir: string | null = null;

const harnesses: Harness[] = [
  {
    name: 'InMemoryContentRepository (reference fake)',
    setup: async () => new InMemoryContentRepository(),
  },
  {
    name: 'LocalFsContentRepository',
    setup: async () => {
      tmpDir = await mkdtemp(path.join(os.tmpdir(), 'ailav-content-'));
      vi.spyOn(process, 'cwd').mockReturnValue(tmpDir);
      return new LocalFsContentRepository();
    },
    teardown: async () => {
      if (tmpDir) await rm(tmpDir, { recursive: true, force: true });
      tmpDir = null;
    },
  },
  {
    name: 'BlobContentRepository (in-memory @vercel/blob)',
    setup: async () => {
      blob.reset();
      vi.stubGlobal('fetch', vi.fn(blob.fetch));
      return new BlobContentRepository();
    },
  },
];

describe('seed content', () => {
  it('satisfies the content schema (the fallback must always be renderable)', () => {
    expect(ContentSchema.safeParse(SEED_CONTENT).success).toBe(true);
  });
});

describe.each(harnesses)('ContentRepository contract: $name', (h) => {
  let repo: ContentRepository;

  beforeEach(async () => {
    repo = await h.setup();
  });

  afterEach(async () => {
    await h.teardown?.();
  });

  it('returns the seed content when nothing has been saved yet', async () => {
    await expect(repo.read()).resolves.toEqual(SEED_CONTENT);
  });

  it('round-trips a written document', async () => {
    const doc = edited('v1', 'Round trip');
    await repo.write(doc);
    await expect(repo.read()).resolves.toEqual(doc);
  });

  it('returns the most recent write', async () => {
    await repo.write(edited('v1', 'First'));
    await repo.write(edited('v2', 'Second'));
    await repo.write(edited('v3', 'Third'));

    const current = await repo.read();
    expect(current.version).toBe('v3');
    expect(current.site.tagline).toBe('Third');
  });

  it('rejects content that violates the schema and keeps the previous version', async () => {
    await repo.write(edited('good', 'Good'));

    const bad = edited('bad', 'Bad');
    bad.chefs = []; // schema requires at least one chef
    await expect(repo.write(bad)).rejects.toThrow();

    await expect(repo.read()).resolves.toMatchObject({ version: 'good' });
  });

  it('rejects unsafe admin-supplied URLs (javascript: in social links)', async () => {
    const bad = edited('xss', 'XSS');
    bad.site.social.instagram = 'javascript:alert(1)';
    await expect(repo.write(bad)).rejects.toThrow();
  });
});

/* ── Implementation-specific behaviour ──────────────────────── */
describe('LocalFsContentRepository fallbacks', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), 'ailav-content-'));
    vi.spyOn(process, 'cwd').mockReturnValue(dir);
    await mkdir(path.join(dir, '.data'), { recursive: true });
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('falls back to seed content when the file is not valid JSON', async () => {
    await writeFile(path.join(dir, '.data', 'content.json'), '{ nope', 'utf8');
    await expect(new LocalFsContentRepository().read()).resolves.toEqual(SEED_CONTENT);
  });

  it('falls back to seed content when the file fails schema validation', async () => {
    await writeFile(
      path.join(dir, '.data', 'content.json'),
      JSON.stringify({ site: { name: '' } }),
      'utf8'
    );
    await expect(new LocalFsContentRepository().read()).resolves.toEqual(SEED_CONTENT);
  });
});

describe('BlobContentRepository specifics', () => {
  beforeEach(() => {
    blob.reset();
    vi.stubGlobal('fetch', vi.fn(blob.fetch));
  });

  it('writes each save to a new immutable pathname under content/', async () => {
    const repo = new BlobContentRepository();
    await repo.write(edited('v1', 'One'));
    await repo.write(edited('v2', 'Two'));

    const paths = [...blob.entries.values()].map((e) => e.pathname);
    expect(paths).toHaveLength(2);
    expect(new Set(paths).size).toBe(2);
    for (const p of paths) expect(p).toMatch(/^content\/\d+-rnd\d+\.json$/);
  });

  it('prunes history to the 5 newest versions after a save', async () => {
    const repo = new BlobContentRepository();
    for (let i = 1; i <= 8; i++) await repo.write(edited(`v${i}`, `T${i}`));

    // Cleanup is fire-and-forget; wait for it to settle.
    await vi.waitFor(() => expect(blob.entries.size).toBe(5));
    await expect(repo.read()).resolves.toMatchObject({ version: 'v8' });
  });

  it('reads the legacy fixed content.json when no versioned blobs exist', async () => {
    blob.add('content.json', JSON.stringify(edited('legacy', 'Legacy')));
    await expect(new BlobContentRepository().read()).resolves.toMatchObject({
      version: 'legacy',
      site: { tagline: 'Legacy' },
    });
  });

  it('migrates a legacy blob that predates menuCards', async () => {
    const legacy: Record<string, unknown> = { ...edited('old', 'Old') };
    delete legacy.menuCards;
    blob.add('content/1.json', JSON.stringify(legacy));

    const read = await new BlobContentRepository().read();
    expect(read.version).toBe('old');
    expect(read.menuCards).toEqual([]);
  });

  it('falls back to seed content when the blob fetch fails', async () => {
    blob.add('content/1.json', JSON.stringify(edited('v1', 'One')));
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    await expect(new BlobContentRepository().read()).resolves.toEqual(SEED_CONTENT);
  });
});
