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
  // requestAnimationFrame memberi timestamp dalam MILIDETIK — teruskan apa adanya.
  const raf = (time: number) => { lenis!.raf(time); requestAnimationFrame(raf); };
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

/* ======== WATER LINE: garis tepi melengkung menjauhi cursor ========
   Seperti menekan permukaan air — border menekuk menjauhi cursor
   (lengkungan + riak echo), lalu memantul balik saat cursor pergi. */
function initWaterLine() {
  if (!finePointer || prefersReduced) return;

  const NS = "http://www.w3.org/2000/svg";
  const STEP = 12; // jarak sampling titik (px)
  const SIGMA = 80; // radius pengaruh cursor (px) — lebih kecil = lebih lokal & responsif
  const STRENGTH = 30; // dorongan maksimum sebelum clamp
  const MAX_DENT = 16; // batas lengkung maksimum (px)
  const R = 13; // radius sudut (selaras border .card 14px, inset 1px)
  const O = 1; // inset path dari tepi (tengah stroke 2px)

  interface Pt { x: number; y: number; }
  interface WaterState {
    svg: SVGSVGElement;
    main: SVGPathElement;
    echo: SVGPathElement;
    cx: number;
    cy: number;
    rest: Pt[];
    cur: Pt[];
    trail: Pt[];
    cursor: Pt | null;
    raf: number;
  }
  const states = new Map<HTMLElement, WaterState>();

  // Sampling rounded-rect searah jarum jam mulai dari sisi atas
  function roundedRectPoints(w: number, h: number): Pt[] {
    const pts: Pt[] = [];
    const x0 = O, y0 = O, x1 = w - O, y1 = h - O;
    for (let x = x0 + R; x <= x1 - R; x += STEP) pts.push({ x, y: y0 });
    for (let a = -90; a <= 0; a += 10) {
      const t = (a * Math.PI) / 180;
      pts.push({ x: x1 - R + R * Math.cos(t), y: y0 + R + R * Math.sin(t) });
    }
    for (let y = y0 + R; y <= y1 - R; y += STEP) pts.push({ x: x1, y });
    for (let a = 0; a <= 90; a += 10) {
      const t = (a * Math.PI) / 180;
      pts.push({ x: x1 - R + R * Math.cos(t), y: y1 - R + R * Math.sin(t) });
    }
    for (let x = x1 - R; x >= x0 + R; x -= STEP) pts.push({ x, y: y1 });
    for (let a = 90; a <= 180; a += 10) {
      const t = (a * Math.PI) / 180;
      pts.push({ x: x0 + R + R * Math.cos(t), y: y1 - R + R * Math.sin(t) });
    }
    for (let y = y1 - R; y >= y0 + R; y -= STEP) pts.push({ x: x0, y });
    for (let a = 180; a <= 270; a += 10) {
      const t = (a * Math.PI) / 180;
      pts.push({ x: x0 + R + R * Math.cos(t), y: y0 + R + R * Math.sin(t) });
    }
    return pts;
  }

  // Path halus tertutup (Catmull-Rom → bezier)
  function smoothPath(pts: Pt[]): string {
    const n = pts.length;
    if (!n) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i];
      const p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d + " Z";
  }

  function ensureState(el: HTMLElement): WaterState | null {
    const w = el.clientWidth, h = el.clientHeight;
    if (w < 10 || h < 10) return null;
    // Pakai ulang SVG bila sudah ada (tahan HMR reboot)
    const oldSvg = el.querySelector("svg.water-line") as SVGSVGElement | null;
    let st = states.get(el);
    const rest = roundedRectPoints(w, h);
    if (!st) {
      const svg =
        oldSvg ??
        (() => {
          const s = document.createElementNS(NS, "svg");
          s.setAttribute("class", "water-line");
          s.setAttribute("aria-hidden", "true");
          const echo = document.createElementNS(NS, "path");
          echo.setAttribute("class", "echo");
          const main = document.createElementNS(NS, "path");
          main.setAttribute("class", "main");
          s.appendChild(echo);
          s.appendChild(main);
          el.appendChild(s);
          return s;
        })();
      svg.setAttribute("width", String(w));
      svg.setAttribute("height", String(h));
      const echo = svg.querySelector("path.echo") as SVGPathElement;
      const main = svg.querySelector("path.main") as SVGPathElement;
      st = { svg, main, echo, cx: w / 2, cy: h / 2, rest, cur: rest.map((p) => ({ ...p })), trail: rest.map((p) => ({ ...p })), cursor: null, raf: 0 };
      states.set(el, st);
    } else {
      st.svg.setAttribute("width", String(w));
      st.svg.setAttribute("height", String(h));
      st.cx = w / 2;
      st.cy = h / 2;
      st.rest = rest;
      st.cur = rest.map((p) => ({ ...p }));
      st.trail = rest.map((p) => ({ ...p }));
      st.main.setAttribute("d", smoothPath(rest));
      st.echo.setAttribute("d", smoothPath(rest));
    }
    return st;
  }

  function frame(el: HTMLElement, st: WaterState) {
    const n = st.rest.length;
    let maxDelta = 0;
    for (let i = 0; i < n; i++) {
      let tx = st.rest[i].x, ty = st.rest[i].y;
      if (st.cursor) {
        // Arah SELALU ke dalam card (titik tengah) — seperti menekan air.
        // Cursor hanya menentukan seberapa dalam tekanannya (falloff).
        const dx = st.rest[i].x - st.cursor.x;
        const dy = st.rest[i].y - st.cursor.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const fall = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
        const mag = Math.min(MAX_DENT, STRENGTH * fall);
        let ix = st.cx - st.rest[i].x, iy = st.cy - st.rest[i].y;
        const il = Math.hypot(ix, iy) || 0.001;
        tx = st.rest[i].x + (ix / il) * mag;
        ty = st.rest[i].y + (iy / il) * mag;
      }
      // Lerp cepat = garis nempel cursor (responsif), trail lambat = riak
      st.cur[i].x += (tx - st.cur[i].x) * 0.55;
      st.cur[i].y += (ty - st.cur[i].y) * 0.55;
      st.trail[i].x += (st.cur[i].x - st.trail[i].x) * 0.22;
      st.trail[i].y += (st.cur[i].y - st.trail[i].y) * 0.22;
      maxDelta = Math.max(
        maxDelta,
        Math.abs(tx - st.cur[i].x),
        Math.abs(st.cur[i].x - st.trail[i].x),
        Math.abs(st.cur[i].y - st.trail[i].y)
      );
    }
    st.main.setAttribute("d", smoothPath(st.cur));
    st.echo.setAttribute("d", smoothPath(st.trail));
    if (!st.cursor && maxDelta < 0.08) {
      st.main.setAttribute("d", smoothPath(st.rest));
      st.echo.setAttribute("d", smoothPath(st.rest));
      el.classList.remove("water-live");
      // Hanya lepas cursor jika tak ada card air lain yang di-hover
      if (!document.querySelector("[data-water]:hover")) {
        document.body.classList.remove("cursor-water");
      }
      st.raf = 0;
      return;
    }
    st.raf = requestAnimationFrame(() => frame(el, st));
  }

  const rel = (el: HTMLElement, e: MouseEvent): Pt => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  document.querySelectorAll<HTMLElement>("[data-water]").forEach((el) => {
    if (el.dataset.wInit) return; // tahan HMR reboot
    el.dataset.wInit = "1";
    el.addEventListener("mouseenter", (e) => {
      const st = ensureState(el);
      if (!st) return;
      st.cursor = rel(el, e);
      document.body.classList.add("cursor-water");
      el.classList.add("water-live");
      if (!st.raf) st.raf = requestAnimationFrame(() => frame(el, st));
    });
    el.addEventListener("mousemove", (e) => {
      const st = states.get(el);
      if (!st) return;
      st.cursor = rel(el, e);
    });
    el.addEventListener("mouseleave", () => {
      const st = states.get(el);
      if (!st) return;
      st.cursor = null; // loop meluruhkan kembali ke bentuk semula
    });
  });

  // Geometri disegarkan bila viewport berubah
  window.addEventListener("resize", () => {
    states.forEach((st, el) => {
      if (!el.classList.contains("water-live")) states.delete(el);
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

/* ======== HORIZONTAL SCROLL (STICKY + VANILLA, TANPA PIN) ========
   Strip kartu sticky fullscreen; posisi track mengikuti progres vertikal
   via scroll listener biasa. Tanpa ScrollTrigger-pin sehingga kebal
   duplikasi/HMR dan tetap jalan berdampingan dengan Lenis. */
function initHorizontalScroll() {
  document.querySelectorAll<HTMLElement>("[data-h-tall]").forEach((outer) => {
    const sticky = outer.querySelector<HTMLElement>("[data-h-viewport]");
    const track = outer.querySelector<HTMLElement>("[data-h-track]");
    if (!sticky || !track) return;

    const mq = window.matchMedia("(max-width: 767px)");

    const layout = () => {
      const native = mq.matches || prefersReduced;
      outer.classList.toggle("h-native", native);
      if (native) {
        outer.style.height = "";
        track.style.transform = "";
        return 0;
      }
      const dist = Math.max(0, track.scrollWidth - sticky.clientWidth);
      outer.style.height = `${Math.round(window.innerHeight + dist)}px`;
      return dist;
    };

    let dist = layout();

    const update = () => {
      if (outer.classList.contains("h-native")) return;
      const total = outer.offsetHeight - window.innerHeight;
      if (total <= 0 || dist <= 0) return;
      const top = outer.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / total));
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    // Listener window dipasang sekali (tahan HMR reboot); Lenis dibuat ulang tiap boot.
    if (!outer.dataset.hInit) {
      outer.dataset.hInit = "1";
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", () => {
        dist = layout();
        requestUpdate();
      });
      window.addEventListener("load", () => {
        dist = layout();
        update();
      });
      if (mq.addEventListener) {
        mq.addEventListener("change", () => {
          dist = layout();
          requestUpdate();
        });
      }
    } else {
      dist = layout();
    }
    if (lenis) lenis.on("scroll", requestUpdate);
    update();
  });
}

/* ======== HERO SCROLL OUT (GRUP KOMPAK, ANTI-TUMPUK) ========
   Semua item bergerak BERSAMAAN (tanpa stagger) dan pendek saja,
   sehingga tombol tak akan terselip di bawah teks saat scroll. */
function initHeroScroll() {
  const hero = document.querySelector<HTMLElement>("#top");
  if (!hero || prefersReduced) return;
  const items = [
    hero.querySelector<HTMLElement>(".flex-wrap.items-center.gap-3.mb-7"),
    hero.querySelector<HTMLElement>("h1"),
    hero.querySelector<HTMLElement>('p[data-reveal]'),
    hero.querySelector<HTMLElement>(".mt-7.flex"),
    hero.querySelector<HTMLElement>("aside"),
    hero.querySelector<HTMLElement>(".grid-cols-3"),
    hero.querySelector<HTMLElement>(".border-y-2"),
  ].filter(Boolean) as HTMLElement[];
  if (!items.length) return;

  // Grup kompak: geser dikit + fade, selesai tepat saat hero habis
  gsap.to(items, {
    y: -32,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom 25%",
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
  // Cegah dobel-listener saat HMR reboot (dobel toggle = menu tak bisa dibuka)
  if (toggle.hasAttribute("data-mm-init")) return;
  toggle.setAttribute("data-mm-init", "1");
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
  // Idempoten: bersihkan sisa boot sebelumnya (penting untuk HMR dev-server
  // agar ScrollTrigger/Lenis tidak menumpuk dan saling melawan).
  ScrollTrigger.getAll().forEach((t) => t.kill());
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  initHeader();
  initReveals();
  initMobileMenu();
  initSplitText();
  initLineGrow();
  initHorizontalScroll(); // atur sendiri mode reduced/mobile → selalu dipanggil

  if (prefersReduced) {
    ScrollTrigger.refresh();
    return;
  }

  initLenis();
  initCursor();
  initMagnetic();
  initWaterLine();
  initCounters();
  initParallax();
  initParallaxImg();
  initImgReveal();
  initServiceCards();
  initCta();
  initMarqueeVelocity();
  initScrubHeading();
  initHeroScroll();
  initBigText();
  initOverlapStack();

  requestAnimationFrame(() => ScrollTrigger.refresh());
  // Refresh ulang setelah gambar/font selesai agar sticky presisi
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