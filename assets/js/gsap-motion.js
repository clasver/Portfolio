/*!
 * gsap-motion.js
 * Progressive-enhancement motion layer for the portfolio site.
 *
 * Design rules:
 *  - Loads AFTER script.js. script.js owns the IntersectionObserver reveal for
 *    mid-page sections; GSAP only takes over the hero, the animated widgets
 *    (stat counters + skill rings), the portfolio-card stagger, hero-glow
 *    parallax, and case-study content reveals. Every element GSAP owns gets its
 *    [data-reveal] attribute stripped
 *    so the CSS reveal rule can't fight the timeline.
 *  - If GSAP is missing (CDN blocked / offline), this file does nothing and the
 *    page falls back to the plain CSS + IntersectionObserver behaviour.
 *  - If the visitor prefers reduced motion, this file does nothing at all.
 *  - Only transform / opacity are animated (GPU-friendly, no layout thrash).
 */
(function () {
  'use strict';

  /* Reveal the hero containers that CSS pre-hides for the entrance animation.
     Called on every bail-out path so the hero can never stay invisible. */
  function revealHero() {
    var nodes = document.querySelectorAll('.hero-banner, .hero-content');
    Array.prototype.forEach.call(nodes, function (el) {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  var gsap = window.gsap;
  if (!gsap) { revealHero(); return; } // no GSAP -> fallback path stays intact

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { revealHero(); return; }

  var ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  var hasST = !!ScrollTrigger;

  var EASE = 'power3.out';

  /* Pull the first number out of a string like "95%". */
  function parsePct(value) {
    var match = String(value == null ? '' : value).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  /* Take ownership of an element: drop the CSS-reveal attribute so the
     [data-reveal]{opacity:0} rule no longer applies while GSAP drives it. */
  function takeOver(el) {
    if (el) el.removeAttribute('data-reveal');
  }

  /* ---------------------------------------------------------------- *
   * 1. HERO ENTRANCE
   * ---------------------------------------------------------------- */
  function heroIntro() {
    var hero = document.querySelector('.hero');
    if (!hero) { revealHero(); return; }

    var banner = hero.querySelector('.hero-banner');
    var content = hero.querySelector('.hero-content');
    var eyebrow = hero.querySelector('.hero-eyebrow');
    var name = hero.querySelector('.hero-name');
    var role = hero.querySelector('.hero-role');
    var text = hero.querySelector('.hero-text');
    var btns = hero.querySelector('.btn-group');
    var elems = hero.querySelectorAll('.elem');

    takeOver(banner);
    takeOver(content);

    /* fromTo (not from): the containers start at opacity 0 via CSS, so the
       destination has to be stated explicitly or GSAP would animate to 0. */
    var tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.85 } });

    if (banner) {
      tl.fromTo(banner,
        { autoAlpha: 0, y: 40, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.05, clearProps: 'transform' },
        0);
    }
    if (content) {
      tl.fromTo(content,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.55, clearProps: 'transform' },
        0.08);
    }
    if (eyebrow) tl.fromTo(eyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, clearProps: 'transform' }, 0.20);
    if (name) tl.fromTo(name, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, clearProps: 'transform' }, 0.28);
    if (role) tl.fromTo(role, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, clearProps: 'transform' }, 0.36);
    if (text) tl.fromTo(text, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, clearProps: 'transform' }, 0.44);
    if (btns) tl.fromTo(btns, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, clearProps: 'transform' }, 0.52);
    if (elems.length) {
      tl.fromTo(elems,
        { autoAlpha: 0, y: 14, scale: 0.88 },
        { autoAlpha: 1, y: 0, scale: 1, stagger: 0.12, clearProps: 'transform' },
        0.50);
    }
  }

  /* ---------------------------------------------------------------- *
   * 2. HERO-GLOW PARALLAX (scroll scrub)
   * ---------------------------------------------------------------- */
  function heroParallax() {
    if (!hasST) return;
    var glow = document.querySelector('.hero-glow');
    var hero = document.querySelector('.hero');
    if (!glow || !hero) return;

    gsap.to(glow, {
      yPercent: 24,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  }

  /* ---------------------------------------------------------------- *
   * 3. STAT COUNTERS
   * ---------------------------------------------------------------- */
  function statCounters() {
    var numbers = document.querySelectorAll('.stat-number');
    if (!numbers.length) return;

    Array.prototype.forEach.call(numbers, function (el) { takeOver(el.closest('[data-reveal]')); });

    function run(el) {
      var raw = el.textContent;
      var target = parsePct(raw);
      var suffix = /%/.test(raw) ? '%' : '';
      var proxy = { v: 0 };
      gsap.to(proxy, {
        v: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(proxy.v) + suffix; }
      });
    }

    var container = document.querySelector('.stats-counter');
    if (hasST && container) {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 82%',
        once: true,
        onEnter: function () { Array.prototype.forEach.call(numbers, run); }
      });
    } else {
      Array.prototype.forEach.call(numbers, run);
    }
  }

  /* ---------------------------------------------------------------- *
   * 4. SKILL RINGS + PERCENT TEXT
   * ---------------------------------------------------------------- */
  function skillRings() {
    var circles = document.querySelectorAll('.skill-progress-circle');
    if (!circles.length) return;

    Array.prototype.forEach.call(circles, function (c) { takeOver(c.closest('[data-reveal]')); });

    function run(circle) {
      var text = circle.querySelector('.skill-percent-text');
      var target = text ? parsePct(text.textContent) : 0;
      var proxy = { v: 0 };
      gsap.to(proxy, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function () {
          circle.style.setProperty('--skill-percent', proxy.v.toFixed(1) + '%');
          if (text) text.textContent = Math.round(proxy.v) + '%';
        }
      });
    }

    var chart = document.querySelector('.skills-chart');
    if (hasST && chart) {
      ScrollTrigger.create({
        trigger: chart,
        start: 'top 82%',
        once: true,
        onEnter: function () { Array.prototype.forEach.call(circles, run); }
      });
    } else {
      Array.prototype.forEach.call(circles, run);
    }
  }

  /* ---------------------------------------------------------------- *
   * 5. PORTFOLIO-CARD STAGGER (and re-stagger on filter)
   * ---------------------------------------------------------------- */
  function portfolioStagger() {
    var items = document.querySelectorAll('.portfolio-item');
    if (!items.length) return;

    Array.prototype.forEach.call(items, takeOver);

    function visibleItems() {
      return Array.prototype.filter.call(items, function (el) {
        return !el.classList.contains('hidden');
      });
    }

    function stagger(list) {
      if (!list.length) return;
      gsap.fromTo(list,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: EASE,
          stagger: 0.07,
          overwrite: true,
          clearProps: 'opacity,visibility,transform'
        }
      );
    }

    if (hasST) {
      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: function (batch) { stagger(batch); }
      });
    } else {
      stagger(visibleItems());
    }

    /* Re-stagger after the category filter hides/shows cards.
       script.js registers its filter listener first, so by the time this runs
       the .hidden classes are already applied. */
    Array.prototype.forEach.call(document.querySelectorAll('.filter-btn'), function (btn) {
      btn.addEventListener('click', function () {
        requestAnimationFrame(function () { stagger(visibleItems()); });
      });
    });
  }

  /* ---------------------------------------------------------------- *
   * 6. CASE-STUDY CONTENT REVEALS
   * ---------------------------------------------------------------- */
  function caseStudyReveal() {
    var section = document.querySelector('#case-study');
    if (!section || !hasST) return;

    var container = section.querySelector('.container');
    if (!container) return;

    var intro = Array.prototype.filter.call(container.children, function (el) {
      return el.matches('.section-subtitle, .section-title, .section-text');
    });

    if (intro.length) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: function () {
          gsap.fromTo(intro,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              ease: EASE,
              stagger: 0.09,
              clearProps: 'opacity,visibility,transform'
            }
          );
        }
      });
    }

    var cards = Array.prototype.filter.call(container.children, function (el) {
      return el.classList.contains('project-card');
    });
    if (!cards.length) return;

    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            ease: EASE,
            stagger: 0.08,
            overwrite: 'auto',
            clearProps: 'opacity,visibility,transform'
          }
        );
      }
    });
  }

  /* ---------------------------------------------------------------- *
   * BOOT
   * ---------------------------------------------------------------- */
  function init() {
    try {
      heroIntro();
      heroParallax();
      statCounters();
      skillRings();
      portfolioStagger();
      caseStudyReveal();
    } catch (err) {
      revealHero(); // never leave the hero hidden if something throws
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
