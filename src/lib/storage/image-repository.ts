import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Storage-agnostic image upload interface.
 *
 * Implementations must produce a publicly addressable URL for the uploaded
 * bytes. Path generation is implementation-specific but should never reflect
 * the user-supplied filename (security: see /src/app/api/admin/upload/route.ts).
 */
export interface ImageRepository {
  upload(
    buffer: ArrayBuffer,
    mime: string,
    ext: string
  ): Promise<{ url: string }>;
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function buildFilename(ext: string): string {
  return `${Date.now()}-${crypto.randomUUID()}.${ext}`;
}

/**
 * Vercel Blob-backed image repository (production default).
 * Dynamically imports @vercel/blob so dev environments without the
 * dependency at runtime don't pay the cost.
 */
export class BlobImageRepository implements ImageRepository {
  async upload(
    buffer: ArrayBuffer,
    mime: string,
    ext: string
  ): Promise<{ url: string }> {
    const { put } = await import('@vercel/blob');
    const pathname = `uploads/${buildFilename(ext)}`;
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: mime,
      cacheControlMaxAge: ONE_YEAR_SECONDS,
    });
    return { url: blob.url };
  }
}

/**
 * Local filesystem-backed image repository for development.
 * Writes to <cwd>/public/uploads/ and returns the public-relative URL.
 * The `public/uploads/` dir is gitignored — see /.gitignore.
 */
export class LocalFsImageRepository implements ImageRepository {
  async upload(
    buffer: ArrayBuffer,
    _mime: string,
    ext: string
  ): Promise<{ url: string }> {
    const filename = buildFilename(ext);
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(buffer));
    return { url: `/uploads/${filename}` };
  }
}

function createImageRepository(): ImageRepository {
  return process.env.USE_LOCAL_BLOB === 'true'
    ? new LocalFsImageRepository()
    : new BlobImageRepository();
}

export const imageRepository: ImageRepository = createImageRepository();
