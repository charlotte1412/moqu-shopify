// ── SCROLL REVEAL ──
var revealObserver = (function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything immediately
    Array.from(document.querySelectorAll('.reveal')).forEach(function(el) { el.classList.add('visible'); });
    return function() {};
  }
  var _pending   = [];   // in-viewport elements waiting for page reveal
  var _revealed  = false;

  // IntersectionObserver for off-viewport elements (scroll-triggered)
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      if (_revealed) {
        e.target.classList.add('visible');
      } else {
        // Still loading — queue it
        _pending.push(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  // Fire pending in-viewport elements with a top-to-bottom stagger
  function flushPending() {
    _revealed = true;
    _pending.sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
    _pending.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, i * 55);
    });
    _pending = [];
  }

  function observe(els) {
    var vp = window.innerHeight;
    els.forEach(function (el) {
      if (el.classList.contains('visible')) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < vp && rect.bottom > 0) {
        // In viewport — queue for staggered entrance after page reveal
        if (_revealed) {
          el.classList.add('visible');
        } else {
          _pending.push(el);
        }
      } else {
        observer.observe(el);
      }
    });
  }

  observe(Array.from(document.querySelectorAll('.reveal')));

  // Watch for cms-loading removal (= body becomes visible)
  var _html = document.documentElement;
  if (!_html.classList.contains('cms-loading')) {
    requestAnimationFrame(flushPending);
  } else {
    var _mo = new MutationObserver(function () {
      if (!_html.classList.contains('cms-loading')) {
        _mo.disconnect();
        requestAnimationFrame(flushPending);
      }
    });
    _mo.observe(_html, { attributes: true, attributeFilter: ['class'] });
  }
  // Safety: never block animations longer than 1.6s
  setTimeout(flushPending, 1600);

  // Called after dynamic re-renders (e.g. CMS sync)
  return function (container) {
    var els = container
      ? Array.from(container.querySelectorAll('.reveal:not(.visible)'))
      : Array.from(document.querySelectorAll('.reveal:not(.visible)'));
    observe(els);
  };
})();

// ── MOBILE NAV HAMBURGER ──
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var navLinks = nav.querySelector('.nav-links');
  if (!navLinks) return;

  // Inject hamburger button into nav
  var btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.setAttribute('aria-label', 'Menü öffnen');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);

  function closeMenu() {
    navLinks.classList.remove('mobile-open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
    btn.setAttribute('aria-label', 'Menü öffnen');
  }

  btn.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('mobile-open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    btn.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Close on resize back to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });

  // Fix bfcache: browser can restore page with overflow:hidden stuck
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) closeMenu();
  });
})();

// ── AUTO TWO-COLUMN LEAD TEXT ──
(function () {
  var lead = document.querySelector('.page-lead');
  if (lead && lead.textContent.length > 600) {
    lead.classList.add('lead-two-col');
  }
  // Re-check after CMS applies content (MutationObserver)
  if (lead) {
    new MutationObserver(function () {
      if (lead.textContent.length > 600) {
        lead.classList.add('lead-two-col');
      } else {
        lead.classList.remove('lead-two-col');
      }
    }).observe(lead, { childList: true, characterData: true, subtree: true });
  }
})();

// ── DECORATIVE WAVE ──
(function () {
  var wave = document.createElement('div');
  wave.className = 'site-wave';
  wave.setAttribute('aria-hidden', 'true');
  wave.innerHTML = '<svg viewBox="0 0 100 400" preserveAspectRatio="none">'
    + '<path pathLength="1" d="M5,0 C5,55 90,85 90,125 C96,165 74,198 90,238 '
    + 'C104,272 74,308 90,342 C104,370 80,390 90,400"/>'
    + '</svg>';
  document.body.insertBefore(wave, document.body.firstChild);
})();

// ── ACTIVE NAV LINK ──
(function () {
  var page = document.body && document.body.dataset.page;
  if (!page) return;
  var map = {
    home: '/index.html',
    projekte: '/projekte.html',
    moebelbau: '/moebelbau.html',
    innenausbau: '/innenausbau.html',
    kuechenbau: '/kuechenbau.html',
    'ueber-uns': '/ueber-uns.html',
    kontakt: '/kontakt.html',
    datenschutz: '/datenschutz.html',
    agb: '/agb.html',
    impressum: '/impressum.html'
  };
  var href = map[page];
  if (href) {
    document.querySelectorAll('.nav-links a[href="' + href + '"]').forEach(function (a) {
      a.classList.add('active');
    });
  }
  // Mark services button active on service pages
  if (page === 'moebelbau' || page === 'innenausbau' || page === 'kuechenbau') {
    var btn = document.querySelector('.nav-services-btn');
    if (btn) btn.classList.add('active');
    document.querySelectorAll('.nav-dropdown-menu a').forEach(function (a) {
      if (a.getAttribute('href') === map[page]) a.classList.add('active');
    });
  }
})();
