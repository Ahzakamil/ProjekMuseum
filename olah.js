/* ==========================================================
   EPOCH – olah.js (Note Section disamakan persis dengan Section Modern)
   ========================================================== */

const root = document.documentElement;

/* ---------- BAGIAN 1 – FITUR DASAR ---------- */
(function navbarScroll() {
  const nav = document.querySelector(".aeterna-navbar");
  if (!nav) return;
  let ticking = false;
  const update = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

(function chapterIndicator() {
  const pill = document.querySelector(".chapter-indicator");
  const sections = [...document.querySelectorAll("[data-chapter]")];
  if (!pill || !sections.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) pill.textContent = e.target.dataset.chapter;
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => io.observe(s));
})();

(function mobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  const links = [...menu.querySelectorAll("a")];
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    root.classList.toggle("is-locked", open);
    if (open) setTimeout(() => links[0] && links[0].focus(), 50);
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  links.forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => {
    if (!menu.classList.contains("is-open")) return;
    if (e.key === "Escape") { setMenu(false); toggle.focus(); return; }
    if (e.key === "Tab") {
      const items = [toggle, ...links];
      const i = items.indexOf(document.activeElement);
      e.preventDefault();
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      items[next].focus();
    }
  });
  window.matchMedia("(min-width: 769px)").addEventListener("change", e => { if (e.matches) setMenu(false); });
})();

(function lightbox() {
  const dlg = document.getElementById("lightbox");
  const frames = [...document.querySelectorAll(".rome-img-frame[data-title]")];
  if (!dlg || !frames.length) return;
  const el = id => document.getElementById(id);
  let index = 0;
  function render(i) {
    index = (i + frames.length) % frames.length;
    const f = frames[index];
    const img = f.querySelector("img");
    el("lb-img").src = img.currentSrc || img.src;
    el("lb-alt").alt = img.alt;
    el("lb-title").textContent = f.dataset.title;
    el("lb-meta").textContent = f.dataset.meta;
    el("lb-story").textContent = f.dataset.story;
    el("lb-count").textContent = `${index + 1} / ${frames.length}`;
  }
  frames.forEach((f, i) => {
    const btn = f.querySelector(".art-open");
    if (!btn) return;
    btn.addEventListener("click", () => { render(i); dlg.showModal(); root.classList.add("is-locked"); });
  });
  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  el("lb-prev").addEventListener("click", () => render(index - 1));
  el("lb-next").addEventListener("click", () => render(index + 1));
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => root.classList.remove("is-locked"));
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") render(index - 1);
    if (e.key === "ArrowRight") render(index + 1);
  });
})();

(function romeClock() {
  const el = document.querySelector("[data-rome-time]");
  if (!el) return;
  function update() {
    try {
      const now = new Date();
      const opts = { timeZone: "Europe/Rome" };
      const time = now.toLocaleTimeString("en-GB", { ...opts, hour: "2-digit", minute: "2-digit" });
      const zone = new Intl.DateTimeFormat("en-GB", { ...opts, timeZoneName: "short" }).formatToParts(now).find(p => p.type === "timeZoneName");
      el.textContent = zone ? `${time} (${zone.value})` : time;
    } catch (e) {}
  }
  update();
  setInterval(update, 30000);
})();

(function thenNowGuard() {
  const section = document.getElementById("then-now");
  if (!section) return;
  const probe = new Image();
  probe.onerror = () => {
    section.hidden = true;
    document.querySelectorAll('a[href="#then-now"]').forEach(a => { a.hidden = true; });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  probe.src = "image/paestum_ruins.jpg";
})();

(function compareSlider() {
  const box = document.querySelector(".compare");
  if (!box) return;
  const range = box.querySelector(".compare-range");
  let dragging = false;
  function setPos(v) {
    const n = Math.max(0, Math.min(100, v));
    box.style.setProperty("--pos", n);
    range.value = n;
  }
  function fromX(x) {
    const r = box.getBoundingClientRect();
    setPos(((x - r.left) / r.width) * 100);
  }
  box.setPos = setPos;
  box.addEventListener("pointerdown", e => {
    dragging = true;
    box.setPointerCapture(e.pointerId);
    fromX(e.clientX);
  });
  box.addEventListener("pointermove", e => { if (dragging) fromX(e.clientX); });
  ["pointerup", "pointercancel"].forEach(t => box.addEventListener(t, () => { dragging = false; }));
  range.addEventListener("input", () => setPos(Number(range.value)));
})();

/* ---------- UTILITAS ANIMASI ---------- */
const HAS_GSAP = !!(window.gsap && window.ScrollTrigger);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOTION = HAS_GSAP && !REDUCED;

function splitWords(el) {
  if (!el || el.dataset.split) return [];
  const text = el.textContent.trim().replace(/\s+/g, " ");
  if (!text) return [];
  el.dataset.split = "1";
  el.textContent = "";

  const sr = document.createElement("span");
  sr.textContent = text;
  sr.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;";
  el.appendChild(sr);

  const inners = [];
  const words = text.split(" ");
  words.forEach((word, i) => {
    const outer = document.createElement("span");
    outer.setAttribute("aria-hidden", "true");
    outer.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em;";

    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;will-change:transform;";
    inner.textContent = word;

    outer.appendChild(inner);
    el.appendChild(outer);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    inners.push(inner);
  });
  return inners;
}

const SPLIT = { hero: [], items: [] };
(function prepareText() {
  if (!MOTION) return;
  SPLIT.hero = splitWords(document.querySelector(".aeterna-title"));
  
  // Termasuk .manifesto-line dari Section Note agar mendapatkan efek Mask Word Reveal persis seperti Modern Section
  const HEADINGS = [
    ".section-title", ".main-heading", ".editorial-statement", ".hero-title",
    ".then-title", ".era-title", ".rome-heading-main:not(.rome-word)", ".hero-tagline",
    ".manifesto-line"
  ].join(",");

  document.querySelectorAll(HEADINGS).forEach(el => {
    const words = splitWords(el);
    if (words.length) SPLIT.items.push({ el, words });
  });
})();

/* ---------- BAGIAN 2 – PAGE TRANSITION ---------- */
const Curtain = (function () {
  let el = null, label = null;
  function make() {
    if (el) return el;
    el = document.createElement("div");
    el.className = "page-curtain";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:#0b0908;color:#fff;pointer-events:none;clip-path:inset(0% 0% 0% 0%);";
    label = document.createElement("span");
    label.style.cssText = "font-family:inherit;font-size:.8rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;opacity:0;";
    el.appendChild(label);
    document.body.appendChild(el);
    return el;
  }
  return { make, get label() { make(); return label; }, get el() { return make(); } };
})();

function openingCurtain(done) {
  let seen = false;
  try {
    seen = sessionStorage.getItem("epoch-curtain") === "1";
    sessionStorage.setItem("epoch-curtain", "1");
  } catch (e) {}

  root.classList.remove("has-curtain");
  if (seen) { done(); return; }

  const c = Curtain.el, label = Curtain.label;
  label.textContent = "Epoch";
  c.style.display = "flex";
  c.style.pointerEvents = "auto";

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    c.style.display = "none";
    c.style.pointerEvents = "none";
    done();
  };

  gsap.timeline({ onComplete: finish })
    .fromTo(label, { autoAlpha: 0, y: 14, letterSpacing: "0.5em" }, { autoAlpha: 1, y: 0, letterSpacing: "0.24em", duration: 0.7, ease: "power3.out" })
    .to(label, { autoAlpha: 0, duration: 0.25 }, "+=0.25")
    .to(c, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power4.inOut" }, "-=0.05");

  setTimeout(finish, 3500);
}

(function pageTransitions() {
  if (!MOTION) return;
  let busy = false;
  function labelFor(target) {
    if (target.dataset && target.dataset.chapter) return target.dataset.chapter;
    const h = target.querySelector("h1, h2");
    return h ? (h.textContent || "").trim().slice(0, 40) : "";
  }
  function jump(target, hash) {
    const top = target.getBoundingClientRect().top + window.scrollY;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    root.style.scrollBehavior = "";
    try { history.replaceState(null, "", hash); } catch (e) {}
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  function go(hash, target) {
    if (busy) return;
    busy = true;
    const c = Curtain.el, label = Curtain.label;
    label.textContent = labelFor(target);
    c.style.display = "flex";
    c.style.pointerEvents = "auto";
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      c.style.display = "none";
      c.style.pointerEvents = "none";
      busy = false;
    };
    gsap.timeline({ onComplete: finish })
      .set(c, { clipPath: "inset(100% 0% 0% 0%)" })
      .set(label, { autoAlpha: 0 })
      .to(c, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" })
      .to(label, { autoAlpha: 1, duration: 0.3 }, "-=0.2")
      .add(() => jump(target, hash))
      .to(label, { autoAlpha: 0, duration: 0.2 }, "+=0.2")
      .to(c, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power3.inOut" }, "-=0.05");
    setTimeout(finish, 3000);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a && a.classList.contains("skip-link")) return;
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const hash = a.getAttribute("href");
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target || target.hidden) return;
    e.preventDefault();
    go(hash, target);
  });
})();

/* ---------- BAGIAN 3 – ANIMASI HERO, PARALLAX, MASK, MUNCUL-SAAT-SCROLL ---------- */
(function premiumAnimations() {
  if (!MOTION) { root.classList.remove("has-curtain"); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Intro Hero Premium ---------- */
  const intro = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
  intro
    .from(".grid-line-v", { scaleY: 0, transformOrigin: "top center", duration: 1.4, ease: "power3.inOut" }, 0)
    .from(".grid-line-h", { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "power3.inOut" }, 0)
    .from(".grid-circle", { scale: 0.4, autoAlpha: 0, duration: 1.5, ease: "back.out(1.2)" }, 0.2)
    .from(".grid-dot", { scale: 0, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: "back.out(2)" }, 0.6)
    .from(".aeterna-navbar > *", { y: -25, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.3)
    .fromTo(SPLIT.hero, 
      { yPercent: 130, rotateX: -45, opacity: 0 }, 
      { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.4, ease: "expo.out", stagger: 0.08 }, 
      0.4
    )
    .from(".aeterna-subtitle", { y: 35, autoAlpha: 0, filter: "blur(8px)", duration: 1 }, "-=0.8")
    .from(".aeterna-btn-primary", { y: 25, scale: 0.9, autoAlpha: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

  gsap.to(".aeterna-hero-content", {
    yPercent: -25,
    autoAlpha: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".aeterna-hero",
      start: "top top",
      end: "bottom 30%",
      scrub: true
    }
  });

  try {
    openingCurtain(() => intro.play());
  } catch (err) {
    root.classList.remove("has-curtain");
    intro.play();
  }

  /* ---------- PARALLAX GAMBAR ---------- */
  function parallax(img, trigger, amp = 8, scale = 1.18) {
    if (!img || !trigger) return;
    img.style.transition = "none";
    img.style.willChange = "transform";
    gsap.fromTo(img,
      { yPercent: -amp, scale },
      {
        yPercent: amp, scale, ease: "none",
        scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true }
      });
  }

  document.querySelectorAll(".artist-image-wrapper").forEach(w => parallax(w.querySelector("img"), w));
  document.querySelectorAll(".heritage-left").forEach(w => parallax(w.querySelector(".heritage-bg"), w));
  document.querySelectorAll(".banner-image").forEach(w => parallax(w.querySelector("img"), w, 6));
  document.querySelectorAll(".image-container").forEach(w => parallax(w.querySelector("img"), w, 6));
  document.querySelectorAll(".rome-img-frame").forEach(w => parallax(w.querySelector("img"), w, 6));
  parallax(document.querySelector(".modern-bg"), document.querySelector(".modern-section"), 8, 1.2);

  // Parallax untuk gambar di Note Section (.art-card)
  document.querySelectorAll(".art-card").forEach(c => parallax(c.querySelector("img"), c, 6));

  /* ---------- MASK TEKS (Kata naik dari balik garis / Reveal per kata) ---------- */
  SPLIT.items.forEach(({ el, words }) => {
    gsap.fromTo(words, { yPercent: 115 }, {
      yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  /* ---------- MASK GAMBAR (WIPE CLIP-PATH) ---------- */
  function wipe(el, from, radius) {
    const r = radius ? ` round ${radius}` : "";
    gsap.fromTo(el,
      { clipPath: `inset(${from})${r}` },
      {
        clipPath: `inset(0% 0% 0% 0%)${r}`,
        duration: 1.3, ease: "power4.inOut", clearProps: "clipPath",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
  }

  // Efek menyapu (Wipe Clip-Path) pada gambar di Modern & Note Section
  const IMAGE_FRAMES = ".artist-image-wrapper, .card-image-wrapper, .banner-image, .image-container, .rome-img-frame, .compare, .art-card";
  document.querySelectorAll(IMAGE_FRAMES).forEach((el, i) => {
    const radius = getComputedStyle(el).borderRadius;
    wipe(el, i % 2 === 0 ? "100% 0% 0% 0%" : "0% 100% 0% 0%", radius === "0px" ? "" : radius);
  });

  document.querySelectorAll(".heritage-left").forEach(el => {
    const reversed = !!el.closest(".heritage-section--reverse");
    wipe(el, reversed ? "0% 0% 0% 100%" : "0% 100% 0% 0%", "");
  });

  /* ---------- MUNCUL-SAAT-SCROLL (FADE & SLIDE UP) ---------- */
  const groups = [
    ".artist-details",
    ".aeterna-artists-footer",
    ".chapter-tag, .tagline, .script-accent, .bottom-description, .top-subtitle",
    ".heritage-right .bridge-link, .then-container .bridge-link",
    ".hero-right-action > *",
    ".then-tag, .then-subtitle, .then-caption",
    ".era-meta-grid, .era-periods, .era-footer-grid",
    ".rome-caption-small, .rome-word",
    ".epilogue-lead, .epilogue-link",
    ".footer-contact-text, .footer-col, .footer-about",
    ".manifesto-link",
    ".manifesto-aside"
  ];

  groups.forEach(selector => {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;

    gsap.set(items, { autoAlpha: 0, y: 28 });
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      onEnter: batch => gsap.to(batch, {
        autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", overwrite: true
      })
    });
  });

  // Strip waktu
  const bridge = document.querySelector(".time-bridge span");
  if (bridge) {
    gsap.fromTo(bridge, { letterSpacing: "0.6em", autoAlpha: 0 }, {
      letterSpacing: "0.14em", autoAlpha: 1, duration: 1.6, ease: "power3.out",
      scrollTrigger: { trigger: ".time-bridge", start: "top 90%", once: true }
    });
  }

  // Slider Then & Now
  const box = document.querySelector(".compare");
  if (box && box.setPos) {
    const p = { v: 50 };
    const move = v => ({ v, duration: 0.7, ease: "power2.inOut", onUpdate: () => box.setPos(p.v) });
    gsap.timeline({ scrollTrigger: { trigger: box, start: "top 65%", once: true } })
      .to(p, move(28)).to(p, move(72)).to(p, move(50));
  }

  // Lingkaran sketsa di Modern Section
  const circle = document.querySelector(".hand-drawn-circle path");
  if (circle) {
    gsap.fromTo(circle, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut",
      scrollTrigger: { trigger: ".modern-section", start: "top 60%", once: true }
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();