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

---

## Admin Console

站上所有文字與圖片都可在 `/admin` 後台編輯。採用密碼 + TOTP 雙重驗證，單一管理員帳號。

### 第一次設定

```bash
# 1. 產生密碼 hash、TOTP 密鑰、Session 密鑰（會輸出要貼到 env 的字串 + QR Code）
npm run admin:init

# 2. 在 Vercel Dashboard → Storage
#    - 建立 Blob store（存內容 JSON + 圖片上傳）
#    - 建立 Upstash Redis（可選，僅用於登入速率限制）
#    把兩個服務的 env vars 也加到 Vercel 專案設定
```

把 `admin:init` 輸出的三個變數與 Storage 的 token 填到 `.env.local`（開發）或 Vercel → Settings → Environment Variables（正式）：

| 變數 | 來源 |
|---|---|
| `ADMIN_PASSWORD_HASH` | `npm run admin:init` |
| `ADMIN_TOTP_SECRET` | `npm run admin:init` |
| `ADMIN_SESSION_SECRET` | `npm run admin:init` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 建立後的連線字串 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis（可選）|
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis（可選）|

### 使用流程

1. 造訪 `/admin/login`
2. 第一步輸入密碼 → 第二步輸入 Google Authenticator / 1Password 內 6 位數驗證碼
3. 登入後可編輯：網站資訊 / Hero / Concept / 主廚 / 品牌宣言 / 菜單 / 預約資訊
4. 儲存後網站會立即套用新內容（`revalidateTag`）

### 架構

```
src/
  lib/
    content/
      types.ts         # Content / Chef / MenuItem 型別
      schema.ts        # zod 驗證
      repository.ts    # ContentRepository 介面（DIP）
      blob-repo.ts     # Vercel Blob 實作
      seed.ts          # Blob 為空時的預設內容
      index.ts         # getContent / saveContent（含 cache + revalidateTag）
    auth/
      session.ts       # iron-session（加密 cookie，8h TTL）
      password.ts      # bcryptjs
      totp.ts          # otpauth，30s 窗口 ±1
      rate-limit.ts    # Upstash Ratelimit（登入端點 5 次/15m）
  app/
    admin/
      layout.tsx       # .adm-root wrapper
      login/           # 密碼 → TOTP 兩階段表單
      (authed)/        # 經過 auth 檢查的 route group
        layout.tsx     # redirect 未登入者 + AdminShell
        page.tsx       # Dashboard
        site/ hero/ concept/ chefs/ manifesto/ menu/ reservation/
    api/admin/upload/  # 圖片上傳（登入後才允許；寫入 Vercel Blob）
    actions/
      auth.ts          # loginPassword / loginTotp / logout
      content.ts       # updateSite / updateHero / updateChefs / ...
  components/admin/
    AdminShell.tsx     # 側邊導覽 + 主內容
    Field / SaveBar    # 通用欄位元件
    ImageUpload        # 單張上傳
    ImageGallery       # 多張上傳（排序、刪除）
    useEditorForm.ts   # 狀態管理：idle / dirty / saving / saved / error
  proxy.ts             # CSP + /admin/* 前置檢查
```

### 安全防護

- **雙重認證**：密碼 + TOTP，密碼通過後 5 分鐘內才能進入 TOTP 階段
- **Session**：iron-session 簽章加密 cookie；`httpOnly` / `sameSite=lax` / `secure`；TTL 8 小時
- **速率限制**：登入端點 IP 維度 5 次 / 15 分（需 Upstash；未配置時跳過但會在 log 提示）
- **Session 輪替**：登入成功後重置 `issuedAt`
- **Proxy 前置檢查**：`/admin/*`（除 `/admin/login`）若無 session cookie 一律 redirect 到 login
- **Server Action 內再驗證**：內容端點每次 `requireAuthenticated()` 才執行寫入
- **圖片上傳**：白名單 MIME type（JPEG/PNG/WebP/AVIF/GIF），10MB 上限，檔名雜湊化
