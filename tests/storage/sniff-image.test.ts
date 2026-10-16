import { describe, expect, it } from 'vitest';
import { sniffImage } from '@/lib/storage/sniff-image';

function bytes(...head: Array<number | string>): ArrayBuffer {
  const out: number[] = [];
  for (const part of head) {
    if (typeof part === 'string') {
      for (const ch of part) out.push(ch.charCodeAt(0));
    } else {
      out.push(part);
    }
  }
  while (out.length < 16) out.push(0);
  return new Uint8Array(out).buffer;
}

describe('sniffImage (magic-byte upload check)', () => {
  it.each([
    ['JPEG', bytes(0xff, 0xd8, 0xff, 0xe0), 'image/jpeg', 'jpg'],
    ['PNG', bytes(0x89, 'PNG', 0x0d, 0x0a, 0x1a, 0x0a), 'image/png', 'png'],
    ['GIF87a', bytes('GIF87a'), 'image/gif', 'gif'],
    ['GIF89a', bytes('GIF89a'), 'image/gif', 'gif'],
    ['WebP', bytes('RIFF', 0, 0, 0, 0, 'WEBP'), 'image/webp', 'webp'],
    ['AVIF', bytes(0, 0, 0, 0x1c, 'ftyp', 'avif'), 'image/avif', 'avif'],
    ['AVIF sequence', bytes(0, 0, 0, 0x1c, 'ftyp', 'avis'), 'image/avif', 'avif'],
    ['HEIF-family mif1', bytes(0, 0, 0, 0x1c, 'ftyp', 'mif1'), 'image/avif', 'avif'],
  ])('identifies %s', (_label, buf, mime, extension) => {
    expect(sniffImage(buf)).toEqual({ mime, extension });
  });

  it.each([
    ['HTML disguised as an image', bytes('<!DOCTYPE html>')],
    ['SVG (scriptable, deliberately not allowed)', bytes('<svg xmlns="')],
    ['RIFF that is not WebP (WAV audio)', bytes('RIFF', 0, 0, 0, 0, 'WAVE')],
    ['MP4 video (ftyp with non-image brand)', bytes(0, 0, 0, 0x1c, 'ftyp', 'isom')],
    ['PDF', bytes('%PDF-1.7')],
  ])('rejects %s', (_label, buf) => {
    expect(sniffImage(buf)).toBeNull();
  });

  it('rejects buffers shorter than 12 bytes even with a valid prefix', () => {
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff]).buffer)).toBeNull();
  });
});
