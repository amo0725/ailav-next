'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { DEFAULT_FOCAL, focalCss, type FocalPoint } from '@/lib/content/image';

export type AspectPreview = {
  label: string;
  ratio: number; // width / height
};

const DEFAULT_PREVIEWS: AspectPreview[] = [
  { label: '1:1', ratio: 1 },
  { label: '4:5', ratio: 4 / 5 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '9:16', ratio: 9 / 16 },
];

const ARROW_STEP = 0.01; // 1% per arrow press
const ARROW_STEP_LARGE = 0.05; // 5% with shift

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

type Props = {
  src: string;
  focal: FocalPoint | undefined;
  onChange: (next: FocalPoint) => void;
  // Aspect ratios shown in the live-preview row. Defaults cover the common
  // page containers; pass a custom list to match a specific section.
  previewAspects?: AspectPreview[];
};

export default function FocalPointPicker({
  src,
  focal,
  onChange,
  previewAspects = DEFAULT_PREVIEWS,
}: Props) {
  const targetRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);

  const current = focal ?? DEFAULT_FOCAL;

  const setFocalFromEvent = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const target = targetRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);
      onChange({ x, y });
    },
    [onChange]
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      draggingRef.current = true;
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      setFocalFromEvent(event);
    },
    [setFocalFromEvent]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      setFocalFromEvent(event);
    },
    [setFocalFromEvent]
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    },
    []
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? ARROW_STEP_LARGE : ARROW_STEP;
      let nextX = current.x;
      let nextY = current.y;
      switch (event.key) {
        case 'ArrowLeft':
          nextX -= step;
          break;
        case 'ArrowRight':
          nextX += step;
          break;
        case 'ArrowUp':
          nextY -= step;
          break;
        case 'ArrowDown':
          nextY += step;
          break;
        case 'Home':
          nextX = 0.5;
          nextY = 0.5;
          break;
        default:
          return;
      }
      event.preventDefault();
      onChange({ x: clamp01(nextX), y: clamp01(nextY) });
    },
    [current.x, current.y, onChange]
  );

  // Keep the picker frame at the image's natural aspect for accurate preview.
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (cancelled) return;
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setNaturalAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const objectPosition = focalCss(current);

  const xPct = useMemo(() => `${(current.x * 100).toFixed(1)}%`, [current.x]);
  const yPct = useMemo(() => `${(current.y * 100).toFixed(1)}%`, [current.y]);

  if (!src) return null;

  return (
    <div className="adm-focal">
      <div
        ref={targetRef}
        className="adm-focal-target"
        role="application"
        aria-label="拖曳或點擊圖片以設定焦點"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        style={
          naturalAspect
            ? { aspectRatio: String(naturalAspect) }
            : { aspectRatio: '4 / 3' }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" draggable={false} />
        <span
          className="adm-focal-marker"
          style={{ left: `${current.x * 100}%`, top: `${current.y * 100}%` }}
          aria-hidden
        />
      </div>

      <div className="adm-focal-info">
        <span>
          焦點 X <strong>{xPct}</strong>　Y <strong>{yPct}</strong>
        </span>
        <button
          type="button"
          className="adm-btn subtle small"
          onClick={() => onChange(DEFAULT_FOCAL)}
        >
          重設置中
        </button>
      </div>

      <div className="adm-focal-previews">
        <span className="adm-focal-previews-label">即時預覽</span>
        <div className="adm-focal-previews-row">
          {previewAspects.map((p) => (
            <figure key={p.label} className="adm-focal-preview">
              <div
                className="adm-focal-preview-frame"
                style={{ aspectRatio: String(p.ratio) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  style={{ objectPosition }}
                />
              </div>
              <figcaption>{p.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
