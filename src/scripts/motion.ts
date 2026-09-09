import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
 * HaloAfid motion v2 — clean light theme
 * Split-text, magnetic buttons, custom cursor, counters,
 * tilt cards, parallax, scroll progress, marquee, reveals.
 * Respects prefers-reduced-motion.
 * ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

let lenis: Lenis | null = null;

/* ---------------- Lenis ---------------- */
function initLenis() {
  if (prefersReduced) return;
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);

  // Use Lenis's own raf loop — do NOT hijack gsap.ticker.
  // (gsap.ticker stays free for split/counter/magnetic tweens.)
  const raf = (time: number) => {
    lenis!.raf(time * 1000);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Anchor links via lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
    });
  });
}

/* ---------------- Split text ---------------- */
function initSplitText() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const words = el.textContent?.trim().split(/\s+/) ?? [];
    el.textContent = "";
    words.forEach((w, i) => {
      const mask = document.createElement("span");
      mask.className = "split-mask inline-block align-top";
      const word = document.createElement("span");
      word.className = "split-word";
      word.textContent = w;
      mask.appendChild(word);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });

    animateSplitWords(el);
  });

  // Hero markup already has split-mask/split-word spans — animate them too
  document.querySelectorAll<HTMLElement>("[data-split-hero]").forEach((el) => {
    animateSplitWords(el);
  });
}

function animateSplitWords(container: HTMLElement) {
  const words = container.querySelectorAll<HTMLElement>(".split-word");
  if (!words.length) return;
  if (prefersReduced) {
    words.forEach((w) => {
      w.style.transform = "none";
      w.style.opacity = "1";
    });
    return;
  }
  // CSS-keyframed reveal (no GSAP dependency) — robust in any environment
  words.forEach((w, i) => {
    w.style.animation = `split-word-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.06}s forwards`;
  });
}

/* ---------------- Custom cursor ---------------- */
function initCursor() {
  if (!finePointer || prefersReduced) return;
  const dot = document.querySelector<HTMLElement>("[data-cursor-dot]");
  const ring = document.querySelector<HTMLElement>("[data-cursor-ring]");
  if (!dot || !ring) return;

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...pos };
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
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

/* ---------------- Magnetic buttons ---------------- */
function initMagnetic() {
  if (!finePointer || prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = 0.25;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ---------------- Counters ---------------- */
function initCounters() {
  document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
    const target = Number(el.dataset.counter || "0");
    if (prefersReduced) {
      el.textContent = String(target);
      return;
    }
    const start = () => {
      const t0 = performance.now();
      const dur = 1500;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    // Trigger when scrolled into view
    ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: start });
  });
}

/* ---------------- Big statement parallax ---------------- */
function initBigText() {
  if (prefersReduced) return;
  const section = document.querySelector("[data-bigtext-section]");
  const lines = document.querySelectorAll<HTMLElement>("[data-big-line]");
  if (!section || !lines.length) return;
  lines.forEach((line) => {
    gsap.to(line, {
      yPercent: 40,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/* ---------------- Scrub heading reveal ---------------- */
function initScrubHeading() {
  if (prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-scrub]").forEach((el) => {
    const words = el.querySelectorAll<HTMLElement>(".scrub-word");
    if (!words.length) return;
    gsap.to(words, {
      yPercent: 0,
      ease: "none",
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        end: "top 30%",
        scrub: 0.5,
      },
    });
  });
}

/* ---------------- Horizontal scroll (pinned) ---------------- */
function initHorizontalScroll() {
  document.querySelectorAll<HTMLElement>("[data-h-scroll]").forEach((section) => {
    const track = section.querySelector<HTMLElement>("[data-h-track]");
    if (!track) return;
    const distance = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // Quick cleanup if reduced motion kicks in later
    if (prefersReduced) tween.scrollTrigger?.kill();
  });
}

/* ---------------- Tilt cards (3D + glare) ---------------- */
function initTilt() {
  if (!finePointer || prefersReduced) return;
  document.querySelectorAll<HTMLElement>("[data-tilt3d]").forEach((card) => {
    const max = 10;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -2;
      const ry = (px - 0.5) * 2;
      gsap.to(card, {
        rotateX: rx * max,
        rotateY: ry * max,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    });
  });
}

/* ---------------- Parallax orbs / images ---------------- */
function initParallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = Number(el.dataset.parallax || "0.15");
    gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest("section") || el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/* ---------------- Scroll progress ---------------- */
function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return;
  if (prefersReduced) {
    bar.style.display = "none";
    return;
  }
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
}

/* ---------------- Header ---------------- */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  ScrollTrigger.create({
    start: 60,
    end: "max",
    onUpdate: (self) => header.classList.toggle("is-scrolled", self.progress > 0),
  });

  // Active nav link highlight based on scroll position
  const links = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-link]"));
  if (!links.length) return;
  links.forEach((link) => {
    ScrollTrigger.create({
      trigger: document.querySelector(link.getAttribute("href") || "") as HTMLElement,
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

/* ---------------- Reveals ---------------- */
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

/* ---------------- Project card hover (img scale via JS not needed, CSS handles) ---------------- */

/* ---------------- Mobile menu ---------------- */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const lines = document.querySelectorAll("[data-menu-line-1], [data-menu-line-2]");
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.remove("hidden");
    menu.classList.add("flex");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Tutup menu navigasi");
    lines[0]?.classList.add("rotate-45", "translate-y-[3px]");
    lines[1]?.classList.add("-rotate-45", "-translate-y-[3px]");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  };

  const close = () => {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu navigasi");
    lines[0]?.classList.remove("rotate-45", "translate-y-[3px]");
    lines[1]?.classList.remove("-rotate-45", "-translate-y-[3px]");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  };

  toggle.addEventListener("click", () => {
    (toggle.getAttribute("aria-expanded") === "true") ? close() : open();
  });
  menu.querySelectorAll("[data-menu-link]").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close();
  });
}

/* ---------------- Boot ---------------- */
function boot() {
  initHeader();
  initReveals();
  initMobileMenu();
  initSplitText();
  initScrollProgress();

  if (prefersReduced) {
    ScrollTrigger.refresh();
    return;
  }

  initLenis();
  initCursor();
  initMagnetic();
  initCounters();
  initTilt();
  initParallax();
  initScrubHeading();
  initHorizontalScroll();
  initBigText();

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

/* Cleanup */
document.addEventListener("astro:before-swap", () => {
  lenis?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});