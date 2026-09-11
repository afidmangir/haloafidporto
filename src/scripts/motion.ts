import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
 * HaloAfid motion v5 — Neo-brutalism
 * Overlap stack, horizontal scroll,
 * scrub headings, bigtext parallax, split-text, cursor.
 * NOTE: 3D tilt + glare dimatikan sesuai permintaan.
 * ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

let lenis: Lenis | null = null;

/* ======== LENIS ======== */
function initLenis() {
  if (prefersReduced) return;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => { lenis!.raf(time * 1000); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target as HTMLElement, { offset: -100, duration: 1.2 });
    });
  });
}

/* ======== SPLIT TEXT (CSS keyframes) ======== */
function initSplitText() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const words = el.textContent?.trim().split(/\s+/) ?? [];
    el.textContent = "";
    words.forEach((w, i) => {
      const mask = document.createElement("span");
      mask.className = "scrub-mask inline-block align-top";
      const word = document.createElement("span");
      word.className = "split-word";
      word.textContent = w;
      mask.appendChild(word);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    applySplitWords(el);
  });
  document.querySelectorAll<HTMLElement>("[data-split-hero]").forEach((el) => {
    applySplitWords(el);
  });
}

function applySplitWords(container: HTMLElement) {
  const words = container.querySelectorAll<HTMLElement>(".split-word");
  if (!words.length) return;
  if (prefersReduced) {
    words.forEach((w) => { w.style.transform = "none"; w.style.opacity = "1"; });
    return;
  }
  words.forEach((w, i) => {
    w.style.animation = `split-word-in 0.9s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.06}s forwards`;
  });
}

/* ======== CUSTOM CURSOR ======== */
function initCursor() {
  if (!finePointer || prefersReduced) return;
  const dot = document.querySelector<HTMLElement>("[data-cursor-dot]");
  const ring = document.querySelector<HTMLElement>("[data-cursor-ring]");
  if (!dot || !ring) return;
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pos };
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
  // Munculkan cursor hanya setelah mousemove asli (aman utk touchscreen yg lapor fine)
  const live = () => document.body.classList.add("cursor-live");
  window.addEventListener("mousemove", live, { once: true });
  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, overwrite: "auto" });
  });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    gsap.set(ring, { x: ringPos.x, y: ringPos.y });
  });
  const activate = () => document.body.classList.add("cursor-active");
  const deactivate = () => document.body.classList.remove("cursor-active");
  document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
    el.addEventListener("mouseenter", activate);
    el.addEventListener("mouseleave", deactivate);
  });
}

/* ======== MAGNETIC ======== */
function initMagnetic() {
  if (!finePointer || prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.25,
        y: (e.clientY - (r.top + r.height / 2)) * 0.25,
        duration: 0.4, ease: "power3.out",
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
    });
  });
}

/* ======== REPEL: garis card menjauh dari cursor ========
   Hover di tepi/border → kartu bergeser menjauhi cursor (kebalikan magnet).
   Makin dekat ke garis tepi, makin kuat dorongannya. */
function initRepel() {
  if (!finePointer || prefersReduced) return;
  const clampNum = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  document.querySelectorAll<HTMLElement>("[data-repel]").forEach((el) => {
    const strength = Number(el.dataset.repel || "14");
    const edgeRange = 90; // jarak dari tepi di mana efek mulai menguat

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      // Vektor dari cursor ke tengah kartu → arah menjauh
      const dx = r.left + r.width / 2 - e.clientX;
      const dy = r.top + r.height / 2 - e.clientY;
      const nx = clampNum(dx / (r.width / 2), -1, 1);
      const ny = clampNum(dy / (r.height / 2), -1, 1);
      // Faktor tepi: dekat garis border = 1, di tengah = 0.3
      const edgeDist = Math.min(
        e.clientX - r.left,
        r.right - e.clientX,
        e.clientY - r.top,
        r.bottom - e.clientY
      );
      const edgeFactor = clampNum(1 - edgeDist / edgeRange, 0.3, 1);

      gsap.to(el, {
        x: nx * strength * edgeFactor,
        y: ny * strength * edgeFactor,
        rotation: nx * 1.2 * edgeFactor,
        transformPerspective: 800,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-repel");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-repel");
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      });
    });
  });
}

/* ======== COUNTERS (rAF, no GSAP) ======== */
function initCounters() {
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const target = Number(el.dataset.counter || "0");
    if (prefersReduced) { el.textContent = String(target); return; }
    const start = () => {
      const t0 = performance.now(), dur = 1500;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: start });
  });
}

/* ======== OVERLAP STACK (FULL-SCREEN + LEGACY) ======== */
function initOverlapStack() {
  // Varian baru: full-screen, warna memenuhi layar
  document.querySelectorAll<HTMLElement>("[data-overlap-full]").forEach((stack) => {
    const cards = Array.from(stack.querySelectorAll<HTMLElement>("[data-overlap-card]"));
    if (cards.length < 2) return;
    cards.forEach((card, i) => {
      if (i === 0) return;
      // Kartu masuk dari bawah menutupi kartu sebelumnya
      gsap.fromTo(
        card,
        { yPercent: 8 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
        }
      );
      // Kartu sebelumnya mengecil + meredup saat tertutup
      const prev = cards[i - 1];
      gsap.to(prev, {
        scale: 0.92,
        filter: "brightness(0.8)",
        transformOrigin: "center top",
        ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "top top+=120", scrub: true },
      });
    });
  });

  // Legacy: .overlap-stack .overlap-card (jaga-jaga kalau masih dipakai)
  document.querySelectorAll<HTMLElement>(".overlap-stack").forEach((stack) => {
    const cards = stack.querySelectorAll<HTMLElement>(".overlap-card");
    if (cards.length < 2) return;

    cards.forEach((card, i) => {
      if (i === 0) return; // first card stays normal
      const scale = 1 - (cards.length - 1 - i) * 0.03;
      // Pin + scale up as user scrolls past previous card
      ScrollTrigger.create({
        trigger: card,
        start: "top 55%", // card mulai scale saat di tengah layar (bukan mepet atas)
        end: "top top",
        pin: false,
        onEnter: () => {
          gsap.to(card, { scale: scale, duration: 0.5, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.inOut" });
        },
      });
    });
  });
}

/* ======== BIGTEXT PARALLAX ======== */
function initBigText() {
  if (prefersReduced) return;
  const section = document.querySelector("[data-bigtext-section]");
  const lines = document.querySelectorAll<HTMLElement>("[data-big-line]");
  if (!section || !lines.length) return;
  lines.forEach((line, i) => {
    gsap.fromTo(line, { yPercent: -10 + i * 15 }, {
      yPercent: 10 + i * 15,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

/* ======== SCRUB HEADING ======== */
function initScrubHeading() {
  if (prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-scrub]").forEach((el) => {
    const words = el.querySelectorAll<HTMLElement>(".scrub-word");
    if (!words.length) return;
    gsap.to(words, {
      yPercent: 0,
      ease: "none",
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%", scrub: 0.5 },
    });
  });
}

/* ======== HORIZONTAL SCROLL (PIN RAPI, ANTI-SUSUL) ======== */
function initHorizontalScroll() {
  const mm = gsap.matchMedia();

  // Desktop: pin section, track jalan penuh sebelum pin dilepas
  mm.add("(min-width: 768px)", () => {
    document.querySelectorAll<HTMLElement>("[data-h-wrap]").forEach((wrap) => {
      const viewport = wrap.querySelector<HTMLElement>("[data-h-viewport]") ?? wrap;
      const track = wrap.querySelector<HTMLElement>("[data-h-track]");
      if (!track) return;
      const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-h-panel]"));

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          // Jarak scroll = lebar sisa track + sedikit buffer agar tuntas, lalu pin dilepas.
          // Ini yang mencegah section berikutnya menyusul sebelum horizontal selesai.
          end: () => "+=" + (getDistance() + window.innerHeight * 0.2),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Panel pop-in ringan saat track bergerak (tanpa containerAnimation agar stabil)
      panels.forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { y: 36, rotation: i % 2 === 0 ? -1.2 : 1.2 },
          {
            y: 0,
            rotation: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
          }
        );
      });
    });
  });

  // Mobile: kembalikan ke swipe native, pastikan tidak ada sisa transform
  mm.add("(max-width: 767px)", () => {
    gsap.set("[data-h-track]", { x: 0, clearProps: "transform" });
  });
}

/* ======== HERO SCROLL OUT (RAPI, TIDAK HILANG TIBA-TIBA) ======== */
function initHeroScroll() {
  const hero = document.querySelector<HTMLElement>("#top");
  if (!hero || prefersReduced) return;
  const items = [
    hero.querySelector<HTMLElement>(".flex-wrap.items-center.gap-3.mb-7"),
    hero.querySelector<HTMLElement>("h1"),
    hero.querySelector<HTMLElement>('p[data-reveal]'),
    hero.querySelector<HTMLElement>('.mt-9.flex'),
    hero.querySelector<HTMLElement>('.grid-cols-3'),
    hero.querySelector<HTMLElement>('.border-y-2'),
  ].filter(Boolean) as HTMLElement[];
  if (!items.length) return;

  // Konten parallax keluar ke atas + fade, selesai tepat saat hero habis (bukan "max")
  gsap.to(items, {
    y: -70,
    opacity: 0,
    ease: "none",
    stagger: 0.08,
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom 30%",
      scrub: true,
    },
  });

  // Pattern bg gerak berlawanan (parallax)
  const pattern = hero.querySelector<HTMLElement>("[data-parallax]");
  if (pattern) {
    gsap.fromTo(pattern, { yPercent: 0 }, {
      yPercent: 18,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

/* ======== 3D TILT + GLARE — DISABLED ========
   Dihapus sesuai permintaan: tidak ada efek hover 3D
   dan tidak ada efek cahaya saat hover. */

/* ======== PARALLAX ======== */
function initParallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax || "0.15");
    gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

/* ======== IMAGE REVEAL (clip + scale, scrub) ======== */
function initImgReveal() {
  if (prefersReduced) {
    document.querySelectorAll<HTMLElement>("[data-img-reveal] img").forEach((img) => {
      img.style.transform = "none";
      img.style.clipPath = "none";
    });
    return;
  }
  document.querySelectorAll<HTMLElement>("[data-img-reveal]").forEach((wrap) => {
    const img = wrap.querySelector<HTMLElement>("img");
    if (!img) return;
    gsap.fromTo(
      img,
      { scale: 1.14, clipPath: "inset(10% 7% 10% 7% round 16px)" },
      {
        scale: 1,
        clipPath: "inset(0% 0% 0% 0% round 12px)",
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top 88%", end: "top 38%", scrub: 1 },
      }
    );
  });
}

/* ======== PARALLAX KHUSUS GAMBAR ======== */
function initParallaxImg() {
  if (prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-parallax-img]").forEach((wrap) => {
    const img = wrap.querySelector<HTMLElement>("img") ?? wrap;
    gsap.fromTo(
      img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}

/* ======== GARIS SECTION TUMBUH ======== */
function initLineGrow() {
  if (prefersReduced) {
    document.querySelectorAll<HTMLElement>("[data-line-grow]").forEach((el) => {
      el.style.transform = "scaleX(1)";
    });
    return;
  }
  document.querySelectorAll<HTMLElement>("[data-line-grow]").forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 1 },
      }
    );
  });
}

/* ======== SERVICE CARDS STAGGER ======== */
function initServiceCards() {
  if (prefersReduced) return;
  const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
  if (!cards.length) return;
  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      { y: 56, opacity: 0, rotation: i % 2 === 0 ? -1.5 : 1.5 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      }
    );
  });
}

/* ======== CTA ZOOM + FLOAT ======== */
function initCta() {
  if (prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-cta-card]").forEach((card) => {
    gsap.fromTo(
      card,
      { scale: 0.93, rotation: -1.2, y: 40 },
      {
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      }
    );
  });
  document.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 === 0 ? -12 : 12,
      rotation: i % 2 === 0 ? 6 : -6,
      duration: 2.4 + i * 0.3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });
}

/* ======== MARQUEE Miring mengikuti kecepatan scroll ======== */
function initMarqueeVelocity() {
  if (prefersReduced) return;
  const tracks = document.querySelectorAll<HTMLElement>(".marquee-track");
  if (!tracks.length) return;
  let proxy = { skew: 0 };
  const clampSkew = gsap.utils.clamp(-6, 6);
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      const target = clampSkew(v / -400);
      if (Math.abs(target) > Math.abs(proxy.skew)) {
        proxy.skew = target;
        gsap.to(tracks, { skewX: target, duration: 0.4, ease: "power2.out", overwrite: true });
        gsap.to(proxy, {
          skew: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => gsap.set(tracks, { skewX: proxy.skew }),
        });
      }
    },
  });
}
/* ======== HEADER (floating + active nav) ======== */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  ScrollTrigger.create({
    start: 60,
    end: "max",
    onUpdate: (self) => header.classList.toggle("is-scrolled", self.progress > 0),
  });
  const links = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-link]"));
  if (!links.length) return;
  links.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href") || "");
    if (!target) return;
    ScrollTrigger.create({
      trigger: target as HTMLElement,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      },
    });
  });
}

/* ======== REVEALS ======== */
function initReveals() {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    ScrollTrigger.create({
      trigger: el as HTMLElement,
      start: "top 88%",
      once: true,
      onEnter: () => el.classList.add("is-visible"),
    });
  });
}

/* ======== MOBILE MENU ======== */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const lines = document.querySelectorAll("[data-menu-line-1], [data-menu-line-2]");
  if (!toggle || !menu) return;
  const open = () => {
    menu.classList.remove("hidden"); menu.classList.add("flex");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Tutup menu");
    lines[0]?.classList.add("rotate-45", "translate-y-[3px]");
    lines[1]?.classList.add("-rotate-45", "-translate-y-[3px]");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  };
  const close = () => {
    menu.classList.add("hidden"); menu.classList.remove("flex");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu");
    lines[0]?.classList.remove("rotate-45", "translate-y-[3px]");
    lines[1]?.classList.remove("-rotate-45", "-translate-y-[3px]");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  };
  toggle.addEventListener("click", () => (toggle.getAttribute("aria-expanded") === "true") ? close() : open());
  menu.querySelectorAll("[data-menu-link]").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close(); });
}

/* ======== BOOT ======== */
function boot() {
  initHeader();
  initReveals();
  initMobileMenu();
  initSplitText();
  initLineGrow();

  if (prefersReduced) {
    ScrollTrigger.refresh();
    return;
  }

  initLenis();
  initCursor();
  initMagnetic();
  initRepel();
  initCounters();
  initParallax();
  initParallaxImg();
  initImgReveal();
  initServiceCards();
  initCta();
  initMarqueeVelocity();
  initScrubHeading();
  initHorizontalScroll();
  initHeroScroll();
  initBigText();
  initOverlapStack();

  requestAnimationFrame(() => ScrollTrigger.refresh());
  // Refresh ulang setelah gambar/font selesai agar pin & sticky presisi
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

document.addEventListener("astro:before-swap", () => {
  lenis?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});