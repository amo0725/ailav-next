import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth/session';
import { sniffImage } from '@/lib/storage/sniff-image';

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Blob storage not configured (missing BLOB_READ_WRITE_TOKEN)' },
      { status: 500 }
    );
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 });
  }

  const buffer = await file.arrayBuffer();
  const sniffed = sniffImage(buffer);
  if (!sniffed) {
    return NextResponse.json(
      { error: '不支援的檔案格式，僅接受 JPEG / PNG / WebP / AVIF / GIF' },
      { status: 415 }
    );
  }

  // Pathname is built exclusively from sniffed type + random token.
  // The client-provided filename is never reflected into the stored path.
  const token = crypto.randomUUID();
  const pathname = `uploads/${Date.now()}-${token}.${sniffed.extension}`;

  try {
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType: sniffed.mime,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
