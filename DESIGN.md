# DESIGN.md — HaloAfid Visual & Motion System

## 1. Creative Direction

### Design statement

**HaloAfid — Digital work that moves business forward.**

The visual direction is a fusion of:
- editorial digital studio
- modern software portfolio
- experimental motion design
- technical precision

The website should feel expensive because of **typography, spacing, composition, and motion**, not because it is filled with effects.

Reference inspiration: https://www.newnop.com/

The reference communicates through oversized typography, strong project presentation, service/domain storytelling, process sections, and scroll animation. HaloAfid should use the same *design principles* while creating its own visual identity.

## 2. Color System

Use blue as the signature accent instead of the reference green.

```text
Ink / Background      #070A10
Surface               #0D111A
Surface Elevated      #121824
Text Primary          #F5F7FB
Text Secondary        #A7B0C0
Text Muted            #6F7888
Line                  #202838
Electric Blue         #2563FF
Bright Blue           #4D7CFF
Blue Glow             #3B82F6
White                 #FFFFFF
```

Primary usage:
- 70–80% dark neutral surfaces/text
- 10–20% white/off-white
- 5–10% blue accent

Blue should be used as a signal, not wallpaper.

Avoid:
- neon cyan overload
- purple-blue gradients as the default
- glossy chrome UI
- green accents unless part of a project thumbnail

## 3. Typography

Recommended family:
- **Inter Tight** or **Manrope** for general UI/body
- optional **DM Mono** or **IBM Plex Mono** for labels/technical metadata

Typography hierarchy:

### Hero display
- font weight: 600–700
- tracking: slightly negative
- desktop: `clamp(3.8rem, 8vw, 8.5rem)`
- line-height: 0.88–0.98

### Section heading
- desktop: `clamp(2.8rem, 5vw, 6rem)`
- line-height around 0.95

### Body
- 16–19px default
- line-height 1.55–1.7
- readable measure, roughly 55–75 characters

### Kicker / eyebrow
- 11–13px
- uppercase
- letter spacing 0.12em
- mono optional

Use typography as layout, not decoration.

## 4. Layout Grid

Desktop:
- max width: 1440–1600px
- side padding: 32–72px depending on viewport
- 12-column conceptual grid
- generous vertical rhythm

Tablet:
- 24–40px side padding

Mobile:
- 18–22px side padding
- avoid tiny type
- allow large type to wrap naturally

Do not center every section. Editorial asymmetry is encouraged.

## 5. Hero Composition

The hero should immediately state what HaloAfid does.

Suggested copy hierarchy:

Eyebrow:
`HALOAFID / DIGITAL STUDIO`

Headline:
`WE BUILD DIGITAL EXPERIENCES THAT WORK.`

Highlighted words may be blue, but keep the majority white.

Body:
`Website, sistem informasi, SEO & GEO, dan AI untuk bisnis yang ingin tumbuh lebih cepat dan bekerja lebih rapi.`

Actions:
- `Lihat karya`
- `Diskusi via WhatsApp`

Supporting microcopy:
`Based in Indonesia · Available for selected projects`

Hero visual idea:
- oversized typographic composition
- abstract blue orbital/grid shape
- subtle animated noise or grid
- project/UI fragments drifting behind text

The hero must still communicate clearly without the decorative visual.

## 6. Navigation

Desktop:
- transparent/floating at top
- small logo wordmark `haloafid.`
- restrained nav
- one solid blue CTA

On scroll:
- nav can shrink slightly
- background can increase opacity
- preserve minimal appearance

Mobile:
- compact top bar
- animated full-screen menu
- large links

## 7. Section Patterns

### Pattern A — Editorial split
Left: eyebrow/title.
Right: explanation or CTA.

### Pattern B — Large type statement
One sentence occupies most of the viewport.
Use scroll/parallax to create movement.

### Pattern C — Featured project
Large image/UI canvas + project title + category + short outcome.

### Pattern D — Sticky project story
Desktop can pin a project visual while text/list changes on scroll.
Mobile should become a normal vertical stack.

### Pattern E — Service matrix
Four main capabilities displayed as large rows/cards:
1. Website
2. Sistem Informasi
3. SEO & GEO
4. AI

Each service gets:
- index
- title
- one-sentence explanation
- small arrow/interaction

## 8. Featured Work

Lead with 3–4 major projects.

Each project card should have:
- category
- title
- one-sentence description
- visual
- services used
- `View case` or `Explore project`

Hover idea:
- image shifts 2–4%
- arrow moves
- title gets a subtle blue accent
- cursor interaction optional

No giant glowing shadows.

## 9. Work Archive

Use a grid or editorial list with varying card sizes.

Example categories:
- Website
- Information System
- SEO + GEO
- AI
- Experiment

Include filter pills only if there are enough projects. Do not create an unnecessary filter UI for six static placeholders.

## 10. Services

Headline concept:
`From first idea to useful digital product.`

Service copy should be outcome-oriented.

### Website
`Website yang cepat, jelas, responsif, dan dibuat untuk benar-benar mendukung bisnis.`

### Sistem Informasi
`Sistem web untuk merapikan proses, data, dan pekerjaan operasional.`

### SEO & GEO
`Membangun fondasi agar brand lebih mudah ditemukan di search engine dan mesin jawaban berbasis AI.`

### AI
`Mengintegrasikan AI ke alur kerja, layanan, dan produk digital tanpa sekadar ikut tren.`

## 11. Process

Four-step process inspired by the clarity of the reference:

01 — Discover
Memahami bisnis, kebutuhan, masalah, dan target.

02 — Design
Menyusun struktur, experience, visual, dan prioritas.

03 — Build
Mengembangkan website/sistem dengan teknologi yang sesuai.

04 — Launch & Improve
Testing, deployment, handover, lalu iterasi ketika dibutuhkan.

Motion idea:
- numbered step stays large
- active step uses blue accent
- progress line moves on scroll

## 12. About Section

Do not create a long biography.

Suggested narrative:

`HaloAfid adalah brand digital studio yang menggabungkan desain, development, search visibility, dan AI untuk membuat solusi digital yang benar-benar dipakai.`

Follow with a compact set of principles:
- Simple before complex
- Useful over ornamental
- Fast by default
- Built for real workflows

## 13. Final CTA

This section should be visually decisive.

Headline:
`Punya ide? Mari bikin jadi digital.`

Supporting line:
`Ceritakan kebutuhanmu. Website, sistem, SEO & GEO, atau AI — kita mulai dari masalahnya, bukan dari teknologinya.`

CTA:
`Chat via WhatsApp →`

Contact:
`082136006831`
`haloafid@gmail.com`

## 14. Motion System

### Motion principles
1. Entering elements should reveal rather than bounce.
2. Movement should be slow enough to feel premium.
3. Large typography should have the strongest motion.
4. Images can use clip-path and scale reveals.
5. Use stagger sparingly.
6. Avoid excessive spring physics.

Recommended timing:
- micro interaction: 180–300ms
- normal reveal: 500–900ms
- large hero reveal: 900–1400ms
- section transitions: 700–1200ms

Easing:
- prefer smooth cubic-bezier curves
- use GSAP easing consistently

Scroll-linked:
- subtle y movement: 20–120px
- image scale: 1 → 1.04–1.10
- horizontal movement: moderate only
- pin durations should not make mobile unusable

## 15. Cursor / Hover

Optional desktop-only custom cursor:
- tiny blue dot
- expands over interactive elements
- label appears over project cards, e.g. `OPEN`

Never make the custom cursor the only way to understand interaction.
Disable custom cursor below a sensible mobile breakpoint.

## 16. Image Direction

Prefer:
- UI mockups
- browser/device frames
- project screenshots
- abstract geometry
- gradients inside project artwork only
- monochrome/editorial photography only when needed

Project thumbnails can use synthetic abstract scenes until final screenshots are inserted.

## 17. Mobile Adaptation

Do not simply shrink desktop.

On mobile:
- reduce motion complexity
- remove pinning if it creates friction
- use vertical project cards
- keep headline large but safe from overflow
- maintain 18–22px horizontal padding
- keep CTA thumb-friendly
- mobile nav becomes full-screen or drawer

## 18. Accessibility Motion Fallback

Under `prefers-reduced-motion: reduce`:
- disable smooth scroll
- disable scrubbed parallax
- disable decorative cursor animation
- use short opacity/transform reveals only or no animation
- preserve document flow

## 19. Anti-Patterns

Do not build:
- generic blue SaaS dashboard aesthetic
- hero full of random floating pills
- huge gradient blob behind every section
- rounded-card-everything layout
- template marketplace look
- excessive glassmorphism
- fake testimonials
- fake client logos
- fake statistics
