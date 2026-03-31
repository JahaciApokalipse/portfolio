(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero');

  if (nav && hero) {
    new IntersectionObserver(
      function (entries) {
        nav.classList.toggle('is-scrolled', !entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    ).observe(hero);
  }

  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  var track = document.getElementById('gallery-track');
  var prevBtn = document.getElementById('gallery-prev');
  var nextBtn = document.getElementById('gallery-next');

  if (track && prevBtn && nextBtn) {
    var items = [].slice.call(track.querySelectorAll('.gallery__item'));
    var itemCount = items.length;
    var autoplayTimer = null;
    var isPaused = false;

    items.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });

    function getItemSize() {
      var item = track.querySelector('.gallery__item');
      if (!item) return 300;
      return item.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 16);
    }

    function getOriginalWidth() {
      return itemCount * getItemSize();
    }

    function resetPosition() {
      var ow = getOriginalWidth();
      if (track.scrollLeft >= ow) {
        track.style.scrollBehavior = 'auto';
        track.style.scrollSnapType = 'none';
        track.scrollLeft -= ow;
        track.offsetHeight;
        track.style.scrollBehavior = '';
        track.style.scrollSnapType = '';
      }
    }

    function scrollNext() {
      track.scrollBy({ left: getItemSize(), behavior: 'smooth' });
      setTimeout(resetPosition, 600);
    }

    function scrollPrev() {
      if (track.scrollLeft <= 0) {
        track.style.scrollBehavior = 'auto';
        track.style.scrollSnapType = 'none';
        track.scrollLeft = getOriginalWidth();
        track.offsetHeight;
        track.style.scrollBehavior = '';
        track.style.scrollSnapType = '';
      }
      track.scrollBy({ left: -getItemSize(), behavior: 'smooth' });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(function () {
        if (!isPaused) scrollNext();
      }, 4000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    prevBtn.addEventListener('click', function () {
      scrollPrev();
      startAutoplay();
    });

    nextBtn.addEventListener('click', function () {
      scrollNext();
      startAutoplay();
    });

    track.addEventListener('mouseenter', function () { isPaused = true; });
    track.addEventListener('mouseleave', function () { isPaused = false; });

    var scrollTimeout;
    track.addEventListener('scroll', function () {
      isPaused = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () { isPaused = false; }, 2000);
    }, { passive: true });

    startAutoplay();
  }

  document.querySelectorAll('.team-card__photo img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-broken');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
