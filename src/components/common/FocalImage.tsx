import Image from 'next/image';
import type { CSSProperties } from 'react';
import { focalCss, srcOf, altOf, focalOf } from '@/lib/content/image';
import type { ImageInput } from '@/lib/content/image';

type Props = Omit<
  React.ComponentProps<typeof Image>,
  'src' | 'alt' | 'style'
> & {
  asset: ImageInput | null | undefined;
  // Override the alt baked into the asset (e.g. for hero scatter images that
  // carry their own alt outside of the asset for legacy reasons).
  alt?: string;
  // Fallback alt when neither override nor asset has one. Defaults to ''.
  fallbackAlt?: string;
  style?: CSSProperties;
};

/* Single image renderer. Reads focal point from the asset and emits
 * `object-position` so the focal stays visible no matter what aspect
 * ratio the parent container uses (desktop vs mobile vs print).
 *
 * Drop-in for next/image — pass `fill`, `width/height`, `sizes`,
 * `priority`, etc. exactly like vanilla.
 */
export default function FocalImage({
  asset,
  alt,
  fallbackAlt = '',
  style,
  className,
  ...rest
}: Props) {
  const src = srcOf(asset);
  if (!src) return null;
  const finalAlt = alt ?? altOf(asset, fallbackAlt);
  const focal = focalOf(asset);

  return (
    <Image
      {...rest}
      src={src}
      alt={finalAlt}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: focalCss(focal),
        ...style,
      }}
    />
  );
}
