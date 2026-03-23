import { NAV_LINKS, SOCIAL, SITE_TAGLINE } from '@/lib/constants';

const LINK_CLASS = 'relative text-[.7rem] tracking-[.22em] uppercase text-[var(--fg3)] transition-colors duration-300 hover:text-[var(--fg)]';
const SOCIAL_BTN = 'w-9 h-9 flex items-center justify-center border border-[rgba(0,0,0,.08)] rounded-full text-[var(--fg3)] transition-all duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:border-[var(--fg)]';

export default function Footer() {
  return (
    <footer className="relative z-[6] bg-[var(--bg)] px-[var(--gutter)] pt-[clamp(60px,8vw,100px)] pb-[clamp(32px,4vw,48px)]">
      <div className="mx-auto max-w-[var(--max)] flex flex-col items-center text-center gap-8">
        <img
          className="foot-logo w-[clamp(110px,16vw,160px)] h-auto opacity-70 transition-[opacity,filter] duration-400 hover:opacity-100"
          src="/images/logo.svg"
          alt="AILAV"
        />
        <p className="[font-family:var(--serif)] text-[.88rem] font-normal tracking-[.32em] uppercase text-[var(--fg2)] -mt-2">
          {SITE_TAGLINE}
        </p>
        <div className="foot-divider w-10 h-px bg-[var(--fg3)] opacity-15"></div>
        <ul className="foot-links flex gap-[clamp(20px,3vw,36px)] list-none flex-wrap justify-center">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={LINK_CLASS}>{link.en}</a>
            </li>
          ))}
        </ul>
        <div className="foot-social flex gap-3.5">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={SOCIAL_BTN}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={SOCIAL_BTN}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>
        <div className="foot-copy text-[.68rem] text-[var(--fg3)] tracking-[.1em] opacity-50 flex gap-4 flex-wrap justify-center">
          <span>&copy; {new Date().getFullYear()} AILAV</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
