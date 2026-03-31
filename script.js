/* ════════════════════════════════════════════════
   ART BY HEART — Main JavaScript
   ════════════════════════════════════════════════ */
'use strict';

/* ── LOADER ──────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    if (loader) {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-hidden', 'true');
    }
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * 130);
    });
  }, 1500);
});

/* ── YEAR ─────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── NAVIGATION ──────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const nav       = document.querySelector('.nav');
const navLinks  = document.querySelectorAll('.nav__link');
const header    = document.querySelector('.site-header');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('is-active');
    nav.classList.toggle('is-open');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    if (navToggle) {
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Header shadow on scroll
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id], footer[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: .4 });
sections.forEach(s => navObserver.observe(s));

/* ── SCROLL REVEAL ────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .11, rootMargin: '0px 0px -36px 0px' });

  reveals.forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });
}

/* ── GALLERY LIGHTBOX ────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));
let currentIndex = 0;

function openLightbox(index) {
  const item = galleryItems[index];
  if (!item) return;
  currentIndex = index;
  lightboxImage.src = item.dataset.full || item.querySelector('img').src;
  lightboxImage.alt = item.querySelector('img').alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (lightboxClose) lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  setTimeout(() => { lightboxImage.src = ''; }, 340);
  document.body.style.overflow = '';
}

function stepLightbox(dir) {
  openLightbox((currentIndex + dir + galleryItems.length) % galleryItems.length);
}

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev)  lightboxPrev.addEventListener('click', () => stepLightbox(-1));
if (lightboxNext)  lightboxNext.addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

let lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - lbTouchX;
  if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
});

/* ── TESTIMONIAL SLIDER ──────────────────────── */
const track    = document.getElementById('testimonialTrack');
const dotsWrap = document.getElementById('testimonialDots');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

if (track) {
  const slides = Array.from(track.querySelectorAll('.testimonial'));
  let current  = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testimonial-dot';
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.testimonial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5200);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  let sliderTouchX = 0;
  track.addEventListener('touchstart', e => { sliderTouchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sliderTouchX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  const sliderEl = document.getElementById('testimonialSlider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
    sliderEl.addEventListener('mouseleave', resetTimer);
  }

  resetTimer();
}

/* ── RIPPLE ──────────────────────────────────── */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', e => {
    const r   = btn.getBoundingClientRect();
    const d   = Math.max(btn.clientWidth, btn.clientHeight) * 2;
    const span = document.createElement('span');
    span.className = 'ripple-effect';
    span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d/2}px;top:${e.clientY - r.top - d/2}px`;
    btn.querySelector('.ripple-effect')?.remove();
    btn.appendChild(span);
  });
});

/* ── BACK TO TOP ─────────────────────────────── */
const backTop = document.getElementById('backToTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── TILT CARDS ──────────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.style.transform = `perspective(900px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-6px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), background .3s ease, border-color .3s ease, box-shadow .3s ease';
    card.style.transform  = '';
    setTimeout(() => { card.style.transition = ''; }, 520);
  });
});

/* ── PARALLAX HERO BG ────────────────────────── */
const heroBgImg = document.querySelector('.hero__bg img');
if (heroBgImg && window.matchMedia('(min-width:760px)').matches) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight * 1.3) {
      heroBgImg.style.transform = `scale(1) translateY(${sy * 0.25}px)`;
    }
  }, { passive: true });
}

/* ── SMOOTH SCROLL ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0) - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
