'use client';

/**
 * Lightweight shimmer placeholder shown inside <Suspense> while an admin
 * editor's server data is loading.
 *
 * Shape: a card-ish container with four stacked rows of varying widths,
 * roughly mirroring the typical editor (heading + 2–3 fields).
 */
export default function EditorSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="載入中"
      className="adm-card animate-pulse"
    >
      <div className="h-5 w-1/3 rounded bg-black/10 mb-5" />
      <div className="h-3 w-2/3 rounded bg-black/[.06] mb-3" />
      <div className="h-3 w-1/2 rounded bg-black/[.06] mb-6" />
      <div className="h-9 w-full rounded bg-black/[.04] mb-3" />
      <div className="h-9 w-full rounded bg-black/[.04] mb-3" />
      <div className="h-24 w-full rounded bg-black/[.04]" />
    </div>
  );
}
