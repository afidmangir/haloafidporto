# ARCHITECTURE.md — Suggested Astro Architecture

## 1. Recommended Stack

- Astro
- TypeScript
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Lenis
- Lucide (optional)

Astro should remain the primary rendering layer. Use client-side JavaScript selectively.

## 2. Suggested Directory

```text
haloafid-site/
├─ AGENTS.md
├─ DESIGN.md
├─ CONTENT.md
├─ ARCHITECTURE.md
├─ SEO.md
├─ README.md
├─ package.json
├─ astro.config.mjs
├─ tsconfig.json
├─ public/
│  ├─ favicon.svg
│  ├─ og-image.jpg
│  └─ images/
├─ src/
│  ├─ components/
│  │  ├─ Header.astro
│  │  ├─ Hero.astro
│  │  ├─ FeaturedWork.astro
│  │  ├─ Services.astro
│  │  ├─ About.astro
│  │  ├─ Process.astro
│  │  ├─ WorkGrid.astro
│  │  ├─ CTA.astro
│  │  └─ Footer.astro
│  ├─ data/
│  │  ├─ site.ts
│  │  ├─ projects.ts
│  │  └─ services.ts
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ pages/
│  │  └─ index.astro
│  ├─ scripts/
│  │  ├─ motion.ts
│  │  └─ navigation.ts
│  └─ styles/
│     └─ global.css
└─ package-lock.json
```

## 3. Routing

Version 1:
- `/`

Future:
- `/work/`
- `/work/[slug]/`
- `/services/`
- `/about/`
- `/contact/`

Do not create empty routes solely to look complete.

## 4. Data-Driven Portfolio

Use a typed object so all placeholder work can be replaced without rewriting components.

Example shape:

```ts
export type Project = {
  slug: string
  title: string
  category: string
  description: string
  services: string[]
  image: string
  status: 'placeholder' | 'real'
}
```

Render all project cards from this source.

## 5. Motion Architecture

Create one client-side entrypoint for page motion.

Responsibilities:
- initialize Lenis
- connect Lenis to ScrollTrigger
- register ScrollTrigger
- hero reveal
- reveal-on-scroll
- project parallax
- horizontal/pinned project sequence
- navigation state
- reduced motion detection

Pseudo-flow:

```text
page load
  ↓
check prefers-reduced-motion
  ↓
initialize base interactions
  ↓
if motion allowed:
  initialize Lenis
  register ScrollTrigger
  create hero timeline
  create section reveals
  create project interactions
  refresh ScrollTrigger
```

## 6. Motion Safety

Every GSAP context/animation should have cleanup when relevant.

Do not create duplicate ScrollTriggers after hot reload/navigation.

Use `gsap.context()` or a clean destroy/revert pattern for component-scoped motion where appropriate.

## 7. Static Contact Actions

WhatsApp:
`https://wa.me/6282136006831`

Email:
`mailto:haloafid@gmail.com`

No POST request or backend action.

## 8. Image Strategy

Use local assets under `public/images/` for final project screenshots.

Until real screenshots exist, use generated abstract UI art or carefully designed placeholders.

Do not use remote image hosts as the permanent production strategy.

## 9. Deployment

Suitable static deployment targets include:
- Cloudflare Pages
- Netlify
- Vercel static deployment
- GitHub Pages
- any standard static web host

The build must produce static output.

## 10. Developer Experience

Required scripts:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

Optional quality scripts:
- `check`
- `lint`
- `format`

## 11. Performance Checklist

Before completion:
- compress images
- use correct dimensions
- defer non-critical JS
- inspect bundle size
- check CLS caused by images/fonts
- verify mobile navigation
- test reduced motion
- test page with JS disabled where reasonable

## 12. Avoid Overengineering

This site is a static portfolio. Do not introduce:
- Redux
- database ORM
- API client layer
- authentication framework
- server actions
- GraphQL
- unnecessary state-management libraries

The complexity should be in the **design quality**, not infrastructure.
