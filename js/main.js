/* =========================================================
   CIS-MIC IT Consultancy — main script
   ========================================================= */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelectorAll(".nav__link");
  const backToTop = document.getElementById("backToTop");

  /* ---------- Mobile navigation ---------- */
  function closeMenu() {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) closeMenu();
  });

  /* ---------- Header shadow + back-to-top ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 10);
    backToTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = Array.from(navLinks)
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    // Stagger siblings inside the same grid for a smoother cascade
    revealEls.forEach(function (el) {
      const siblings = Array.from(el.parentElement.children).filter(function (c) {
        return c.classList.contains("reveal");
      });
      const index = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(index * 80, 480) + "ms";
      revealObserver.observe(el);
    });

    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
    counters.forEach(function (c) { c.textContent = c.dataset.target; });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
