/* MOQU custom theme JS — Mobile nav + Scroll reveal */
(function () {
  'use strict';

  /* Mobile hamburger */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.moqu-hamburger');
    if (!btn) return;
    var links = document.querySelector('.moqu-nav-links');
    if (links) links.classList.toggle('moqu-open');
  });

  /* Scroll reveal via IntersectionObserver */
  function initReveal() {
    var els = document.querySelectorAll('.moqu-reveal');
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('moqu-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('moqu-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();
