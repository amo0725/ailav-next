'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--fg)] px-[var(--gutter)]">
      <h1 className="[font-family:var(--serif)] text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[.1em] leading-tight text-center">
        Something went wrong
      </h1>
      <p className="text-[var(--fg2)] text-[clamp(.85rem,1.1vw,1rem)] mt-4 text-center">
        We apologize for the inconvenience.
      </p>
      <button
        onClick={reset}
        className="mt-10 [font-family:var(--serif)] text-[.75rem] tracking-[.2em] uppercase px-8 py-3 border-[1.5px] border-[var(--fg)] transition-all duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] cursor-pointer"
      >
        Try Again
      </button>
    </main>
  );
}
