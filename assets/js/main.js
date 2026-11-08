'use strict';

(function () {
  var header = document.getElementById('top');
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('site-nav');

  // Show the header rule once the page scrolls
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // In-page links: scroll to the section without putting #section in the address bar
  var cleanUrl = location.pathname + location.search;
  if (location.hash) history.replaceState(null, '', cleanUrl);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id === 'top' || id === 'main' ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (target === document.body) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', cleanUrl);
  });

  // Underline the nav link for the section in view
  var links = {};
  nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].classList.toggle('on', id === en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Message form: opens WhatsApp with the message pre-filled
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var message = form.elements.message.value.trim();
      if (!name || !message) return;

      var text = 'Hi Yash, this is ' + name + '.\n\n' + message;
      var url = 'https://wa.me/919067228636?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
      if (status) status.textContent = 'WhatsApp opened in a new tab. Press send there to deliver your message.';
      form.reset();
    });
  }
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  });
}
