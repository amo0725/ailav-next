export type SniffedImage = {
  mime: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif';
  extension: 'jpg' | 'png' | 'webp' | 'avif' | 'gif';
};

/**
 * Inspect the leading bytes of a buffer to identify the actual image type.
 * The client-provided `file.type` and filename cannot be trusted — this
 * reads magic bytes directly so a `.html` disguised as `image/png` is rejected.
 */
export function sniffImage(buffer: ArrayBuffer): SniffedImage | null {
  const b = new Uint8Array(buffer);
  if (b.length < 12) return null;

  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { mime: 'image/jpeg', extension: 'jpg' };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a
  ) {
    return { mime: 'image/png', extension: 'png' };
  }
  // GIF87a / GIF89a: 47 49 46 38 [37|39] 61
  if (
    b[0] === 0x47 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x38 &&
    (b[4] === 0x37 || b[4] === 0x39) &&
    b[5] === 0x61
  ) {
    return { mime: 'image/gif', extension: 'gif' };
  }
  // WebP: "RIFF" ???? "WEBP"
  if (
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  ) {
    return { mime: 'image/webp', extension: 'webp' };
  }
  // AVIF (ISOBMFF): bytes 4..7 = "ftyp", bytes 8..11 = brand ∈ {avif, avis, mif1, miaf}
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = String.fromCharCode(b[8], b[9], b[10], b[11]);
    if (brand === 'avif' || brand === 'avis' || brand === 'mif1' || brand === 'miaf') {
      return { mime: 'image/avif', extension: 'avif' };
    }
  }
  return null;
}
