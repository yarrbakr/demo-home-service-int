/* ============================================
   PROFIX HOME SERVICES — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ----- Navbar Scroll Effect ----- */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Mobile Menu ----- */
  function initMobileMenu() {
    var checkbox = document.getElementById('nav-toggle');
    var overlay = document.querySelector('.navbar__overlay');
    var links = document.querySelectorAll('.navbar__link');

    if (!checkbox) return;

    function closeMenu() {
      checkbox.checked = false;
      document.body.style.overflow = '';
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  /* ----- Active Nav Link ----- */
  function initActiveNavLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.navbar__link');

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('navbar__link--active');
      }
    });
  }

  /* ----- Scroll Animations (IntersectionObserver) ----- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) {
        el.classList.add('fade-in--visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----- Mobile Call Button ----- */
  function initCallButton() {
    var btn = document.querySelector('.call-fab');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 300) {
        btn.classList.add('call-fab--visible');
      } else {
        btn.classList.remove('call-fab--visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Stats Count-Up Animation ----- */
  function initStatsCounter() {
    var statNumbers = document.querySelectorAll('.stat-item__number');
    if (!statNumbers.length) return;

    var animated = false;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateNumber(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var duration = 2000;
      var startTime = null;

      function formatValue(val) {
        if (decimals > 0) return val.toFixed(decimals);
        return Math.floor(val).toLocaleString();
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = formatValue(target) + suffix;
        return;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutExpo(progress);
        var current = easedProgress * target;

        el.textContent = formatValue(current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatValue(target) + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !animated) {
            animated = true;
            statNumbers.forEach(animateNumber);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----- Smooth Scroll for Anchor Links ----- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      var navHeight = document.querySelector('.navbar')
        ? document.querySelector('.navbar').offsetHeight
        : 0;
      var targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  }

  /* ----- Initialize All ----- */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLink();
    initScrollAnimations();
    initCallButton();
    initSmoothScroll();

    if (document.querySelector('.stats')) {
      initStatsCounter();
    }
  });

})();
