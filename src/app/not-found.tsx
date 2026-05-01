import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — 頁面不存在',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--fg)] px-[var(--gutter)]">
      <h1 className="[font-family:var(--serif)] text-[clamp(4rem,10vw,8rem)] font-light tracking-[.15em] leading-none">
        404
      </h1>
      <p className="[font-family:var(--serif)] text-[clamp(.85rem,1.2vw,1rem)] tracking-[.3em] uppercase text-[var(--fg2)] mt-4">
        Page Not Found
      </p>
      <Link
        href="/"
        className="mt-10 [font-family:var(--serif)] text-[.75rem] tracking-[.2em] uppercase px-8 py-3 border-[1.5px] border-[var(--fg)] transition-all duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
      >
        Back to Home
      </Link>
    </main>
  );
}
