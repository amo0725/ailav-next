/* ── Image asset model ─────────────────────────────────────────
 * One canonical type for every CMS image, so a single focal point
 * (and optional alt) drives correct cropping across every aspect
 * ratio container — desktop, tablet, mobile, print.
 *
 * Liskov: every field that historically held `string` accepts
 * `ImageInput` (string OR ImageAsset). Helpers normalise on read,
 * so existing blob data works without migration.
 * ───────────────────────────────────────────────────────────── */

export type FocalPoint = {
  x: number; // 0–1 from left
  y: number; // 0–1 from top
};

export type ImageAsset = {
  src: string;
  focal?: FocalPoint;
  alt?: string;
};

export type ImageInput = string | ImageAsset;

export const DEFAULT_FOCAL: FocalPoint = { x: 0.5, y: 0.5 };

export function isImageAsset(input: unknown): input is ImageAsset {
  return (
    !!input &&
    typeof input === 'object' &&
    'src' in (input as Record<string, unknown>) &&
    typeof (input as Record<string, unknown>).src === 'string'
  );
}

export function toAsset(input: ImageInput | undefined | null): ImageAsset {
  if (!input) return { src: '' };
  if (typeof input === 'string') return { src: input };
  return input;
}

export function srcOf(input: ImageInput | undefined | null): string {
  return toAsset(input).src;
}

export function altOf(
  input: ImageInput | undefined | null,
  fallback = ''
): string {
  return toAsset(input).alt || fallback;
}

export function focalOf(input: ImageInput | undefined | null): FocalPoint {
  return toAsset(input).focal ?? DEFAULT_FOCAL;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function focalCss(focal: FocalPoint | undefined): string {
  const { x, y } = focal ?? DEFAULT_FOCAL;
  return `${(clamp01(x) * 100).toFixed(2)}% ${(clamp01(y) * 100).toFixed(2)}%`;
}

export function isCenter(focal?: FocalPoint): boolean {
  if (!focal) return true;
  return Math.abs(focal.x - 0.5) < 0.001 && Math.abs(focal.y - 0.5) < 0.001;
}
