# AILAV

**Pronounced as "I Love"** — A migratory chef's journey of flavor and love.

AILAV is a fine-dining restaurant website based in Kaohsiung, Taiwan. Built with Next.js, Tailwind CSS, and GSAP following 2026 frontend best practices.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, SSG, SEO optimization |
| **Tailwind CSS v4** | Utility-first styling with `@theme` tokens |
| **GSAP + ScrollTrigger** | Scroll-driven animations, hero shrink, parallax |
| **Framer Motion** | Component-level animations (installed) |
| **TypeScript** | Type safety across all components and hooks |

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout, SEO metadata, JSON-LD schema
    page.tsx            # Page composition (all sections + UI)
    globals.css         # Tailwind + CSS variables + state-based effects
  components/
    layout/
      Header.tsx        # Liquid glass header, nav overlay, scroll states
      Footer.tsx        # Footer with logo, NAV_LINKS, social
    sections/
      HeroSection.tsx   # GSAP scroll-driven image shrink + 5 editorial images
      ConceptSection.tsx
      MarqueeSection.tsx # Dual-direction parallax marquee
      ChefSection.tsx   # Two chefs, alternating layout, depth-of-field
      ManifestoSection.tsx # Brand triptych (Aile / Il a / Voyage)
      MenuSection.tsx   # Liquid glass cards with shimmer CTA
      ReservationSection.tsx
    ui/
      Loader.tsx        # SVG stroke-draw logo animation
      ScrollProgress.tsx
      CustomCursor.tsx  # GPU-accelerated custom cursor with idle detection
      ThumbBar.tsx      # Mobile floating pill bar
      AccessibilityPanel.tsx # Theme / font-size / contrast toggles
      WelcomeBanner.tsx # Adaptive UI (first visit vs returning)
      SoundToggle.tsx   # Ambient video sound control
    common/
      GlobalEffects.tsx # Parallax, DOF, liquid distortion, shimmer, tilt, magnetic hover
      ScrollRevealInit.tsx # Global IntersectionObserver for .rv elements
      LiquidDistortionFilter.tsx # SVG feTurbulence filter
  hooks/
    useTheme.ts         # Dark/light mode with localStorage
    useFontSize.ts      # Font size cycling (normal/large/xlarge)
    useContrast.ts      # High contrast toggle
    useVisitCount.ts    # Visit tracking for adaptive UI
    useScrollListener.ts # Shared scroll manager (single rAF for all consumers)
  lib/
    constants.ts        # Single source of truth (restaurant info, menu, chefs, etc.)
    gsap.ts             # GSAP + ScrollTrigger registration
```

## Features

### Design
- Cinematic hero with scroll-driven image shrink + 5 scattered editorial images
- Liquid glass (CSS backdrop-filter) on header, nav overlay, menu cards, welcome banner
- Dual-direction parallax marquee with brand words
- Two-chef alternating layout with depth-of-field effect
- Brand manifesto triptych (Aile / Il a / Voyage)
- Custom cursor with hover enlargement and idle detection

### Performance
- LCP preload for hero image
- AVIF image format via Unsplash `&fm=avif`
- Single shared scroll listener (1 rAF per frame for all scroll consumers)
- GPU-accelerated cursor (`transform` instead of `left/top`)
- Cached DOM queries outside scroll handlers
- No-op guards to skip redundant DOM writes

### SEO
- JSON-LD Restaurant schema (name, address, hours, menu prices, geo coordinates)
- Open Graph + Twitter Card meta tags
- Canonical URL
- `robots.txt` + `sitemap.xml`
- Semantic HTML with ARIA labels

### Accessibility
- `prefers-reduced-motion` progressive support (CSS kills animations, JS skips GSAP)
- Theme toggle (light/dark)
- Font size cycling (normal/large/xlarge)
- High contrast mode
- Skip-to-content link
- Full keyboard navigation (Escape closes nav)

### Responsive
- Mobile: 180vh hero, hidden editorial images, floating thumb bar
- Tablet: single-column grid, responsive chef images
- Desktop: full editorial layout, custom cursor, depth-of-field

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Environment

- Node.js 18+
- npm 9+

## Restaurant Info

- **Name**: AILAV
- **Address**: 807 Kaohsiung, Sanmin District, Minzhuang Rd. No. 43
- **Instagram**: [@ailav_kaohsiung](https://www.instagram.com/ailav_kaohsiung/)
