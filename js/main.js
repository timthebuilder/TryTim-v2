(function () {
  const SUPPORTED = ['es', 'en', 'de'];
  const STORAGE_KEY = 'trytim-lang';

  function detectLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;

    const browserLangs = navigator.languages || [navigator.language || 'es'];
    for (const lang of browserLangs) {
      const short = lang.slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(short)) return short;
    }
    return 'es'; // default: Mallorca-based business
  }

  function applyLanguage(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'es';
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  document.querySelectorAll('.lang-switch button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang'));
    });
  });

  applyLanguage(detectLanguage());

  // Scroll-reveal: fade/slide elements in as they enter the viewport.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // Draw-on-scroll: the hero sketch "draws itself" the first time it's seen.
  const skylineSvg = document.getElementById('skylineSvg');
  if (skylineSvg) {
    const drawEls = skylineSvg.querySelectorAll('.draw');
    drawEls.forEach(function (el) {
      try {
        const len = el.getTotalLength();
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = prefersReducedMotion ? 0 : len;
      } catch (e) { /* some browsers can't measure certain shapes; skip gracefully */ }
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const skylineObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            drawEls.forEach(function (el, i) {
              setTimeout(function () { el.style.strokeDashoffset = 0; }, i * 12);
            });
            skylineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      skylineObserver.observe(skylineSvg);
    }
  }

  // Parallax: the sketch drifts slightly slower than the page scrolls.
  const heroSkyline = document.querySelector('.hero-skyline');
  if (heroSkyline && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const offset = Math.min(window.scrollY, 600) * 0.12;
          heroSkyline.style.transform = 'translateY(' + offset + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Count-up: animate the leading digits of any credential number (language-agnostic).
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const match = el.textContent.match(/^(\d+)(.*)$/);
        if (!match) return;
        const target = parseInt(match[1], 10);
        const suffix = match[2];
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.round(progress * target);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    countEls.forEach(function (el) { countObserver.observe(el); });
  }
})();
