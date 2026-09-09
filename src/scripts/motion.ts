import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
 * HaloAfid motion entrypoint (AGENTS.md §8, §13, DESIGN.md §14)
 * One place for all scroll motion. Respects prefers-reduced-motion.
 * ============================================================ */

const prefersReduced =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

function initLenis() {
  if (prefersReduced) return;
  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis!.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  ScrollTrigger.create({
    start: 80,
    end: "max",
    onUpdate: (self) => {
      const progress = self.progress;
      header.classList.toggle("is-scrolled", progress > 0);
    },
  });
}

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

function heroReveal() {
  const lines = document.querySelectorAll("[data-hero-lines] span, [data-hero-lines]");
  if (!lines.length) return;
  if (prefersReduced) return;

  gsap.fromTo(
    lines,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.09,
      delay: 0.15,
    }
  );
}

function initProjectCards() {
  const cards = document.querySelectorAll("[data-project-card]");
  if (!cards.length) return;

  cards.forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;
    if (prefersReduced) return;
    gsap.fromTo(
      img,
      { scale: 1.08 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: card as HTMLElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

function initServiceRows() {
  document.querySelectorAll("[data-service-row]").forEach((row) => {
    if (prefersReduced) return;
    gsap.fromTo(
      row,
      { opacity: 0.25, x: -16 },
      {
        opacity: 1,
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: row as HTMLElement,
          start: "top 85%",
          end: "top 45%",
          scrub: true,
        },
      }
    );
  });
}

function initProcessSteps() {
  const steps = document.querySelectorAll("[data-process-step]");
  if (!steps.length) return;
  steps.forEach((step, i) => {
    const num = step.querySelector(".display-section");
    if (!num) return;
    ScrollTrigger.create({
      trigger: step as HTMLElement,
      start: "top 75%",
      end: "top 30%",
      onEnter: () => {
        if (i > 0) {
          steps[i - 1].querySelector(".display-section")?.classList.remove("text-electric");
        }
        num.classList.add("text-electric");
      },
      onEnterBack: () => {
        num.classList.add("text-electric");
        if (i > 0) {
          steps[i - 1].querySelector(".display-section")?.classList.remove("text-electric");
        }
      },
    });
  });
}

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
    lines[0]?.classList.add("rotate-45", "translate-y-[6px]");
    lines[1]?.classList.add("-rotate-45", "-translate-y-[6px]");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  };

  const close = () => {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu navigasi");
    lines[0]?.classList.remove("rotate-45", "translate-y-[6px]");
    lines[1]?.classList.remove("-rotate-45", "-translate-y-[6px]");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  menu.querySelectorAll("[data-menu-link]").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close();
    }
  });
}

/* ===== Boot ===== */
function boot() {
  initHeader();
  initReveals();
  initMobileMenu();
  heroReveal();

  if (prefersReduced) {
    // Simplified path: everything visible, no scroll-linked motion
    ScrollTrigger.refresh();
    return;
  }

  initLenis();
  initProjectCards();
  initServiceRows();
  initProcessSteps();

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

/* Cleanup on view transitions (if any) — Astro static, mostly no-op but safe */
document.addEventListener("astro:before-swap", () => {
  lenis?.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});