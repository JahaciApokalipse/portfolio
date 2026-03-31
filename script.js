(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  if (nav && hero) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('is-scrolled', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );
    navObserver.observe(hero);
  }

  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  const track = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (track && prevBtn && nextBtn) {
    let autoplayTimer = null;
    let isPaused = false;

    function getScrollAmount() {
      const item = track.querySelector('.gallery__item');
      if (!item) return 300;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      return item.offsetWidth + gap;
    }

    function scrollNext() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      if (track.scrollLeft <= 10) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isPaused) scrollNext();
      }, 4000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    prevBtn.addEventListener('click', () => {
      scrollPrev();
      startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      scrollNext();
      startAutoplay();
    });

    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { isPaused = false; });

    let scrollTimeout;
    track.addEventListener('scroll', () => {
      isPaused = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { isPaused = false; }, 2000);
    }, { passive: true });

    startAutoplay();
  }

  document.querySelectorAll('.team-card__photo img').forEach((img) => {
    img.addEventListener('error', () => {
      img.classList.add('is-broken');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
