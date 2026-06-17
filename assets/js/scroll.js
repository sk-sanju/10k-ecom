// scroll.js – adds .visible class to .scroll-animate elements when they enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -10% 0px' // trigger slightly before element fully enters view
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scroll-animate').forEach(el => {
    // Apply optional delay via data-delay attribute (in seconds)
    const delay = el.dataset.delay ? `${el.dataset.delay}s` : '0s';
    el.style.setProperty('--scroll-delay', delay);
    observer.observe(el);
  });
});
