'use strict';

/* ════════════════════════════════════════════
   SCROLL PROGRESS
════════════════════════════════════════════ */
window.addEventListener('scroll', function () {
  const bar = document.getElementById('scroll-progress');
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let rx = 0, ry = 0;
  let dx = 0, dy = 0;

  document.addEventListener('mousemove', function (e) {
    dx = e.clientX;
    dy = e.clientY;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
  });

  (function animateRing() {
    rx += (dx - rx) * 0.12;
    ry += (dy - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = 'a, button, .tech-card, .service-card, .stat-card, .contact-item, .social-btn, .back-to-top';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovered');
  });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity = '1';
    ring.style.opacity = '0.5';
  });
})();

/* ════════════════════════════════════════════
   MOUSE GLOW
════════════════════════════════════════════ */
(function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();

/* ════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════ */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveLink();
  }, { passive: true });

  function openNav() {
    navLinks.classList.add('open');
    navbar.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navLinks.classList.remove('open');
    navbar.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', openNav);
  navClose.addEventListener('click', closeNav);

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
})();

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = 'home';

  sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  links.forEach(function (link) {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ════════════════════════════════════════════
   THREE.JS — morphing dual-shell blob
════════════════════════════════════════════ */
(function initThreeJS() {
  if (typeof THREE === 'undefined') return;

  var isMobile = window.innerWidth <= 767;
  var canvas = document.getElementById('hero-canvas');
  var hero = document.querySelector('.hero');
  var W = hero.offsetWidth, H = hero.offsetHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100);
  camera.position.z = 3;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isMobile });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  /* ── Outer morphing blob ── */
  var blobGeo = new THREE.IcosahedronGeometry(0.7, 2);
  var blobOrig = new Float32Array(blobGeo.attributes.position.array);
  var blob = new THREE.Mesh(blobGeo,
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.28 }));
  blob.position.set(1.3, 0, 0);
  scene.add(blob);

  /* ── Inner counter-rotating shell ── */
  var inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 1),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.18 }));
  inner.position.set(1.3, 0, 0);
  scene.add(inner);

  /* ── Orbiting torus ring ── */
  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.007, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0x9f67ff, transparent: true, opacity: 0.22 }));
  ring.position.set(1.3, 0, 0);
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  /* ── Background particles ── */
  var pCount = isMobile ? 600 : 2200;
  var pPos = new Float32Array(pCount * 3);
  var pCol = new Float32Array(pCount * 3);
  for (var i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    var t = Math.random();
    pCol[i * 3] = 0.49 * (1 - t) + 0.13 * t;
    pCol[i * 3 + 1] = 0.23 * (1 - t) + 0.83 * t;
    pCol[i * 3 + 2] = 0.93 * (1 - t) + 0.93 * t;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  var particles = new THREE.Points(pGeo,
    new THREE.PointsMaterial({ size: 0.014, vertexColors: true, transparent: true, opacity: 0.5 }));
  scene.add(particles);

  /* ── Accent tetrahedron ── */
  var tet = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.27),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.28 }));
  tet.position.set(-1.8, 0.6, -0.4);
  scene.add(tet);

  /* ── Accent octahedron ── */
  var oct = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.2),
    new THREE.MeshBasicMaterial({ color: 0x9f67ff, wireframe: true, transparent: true, opacity: 0.28 }));
  oct.position.set(-0.4, -1.3, -0.5);
  scene.add(oct);

  /* ── Mouse ── */
  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5) * 0.9;
    my = (e.clientY / window.innerHeight - 0.5) * 0.6;
  }, { passive: true });

  /* ── Animate ── */
  var clk = 0, frameCount = 0;
  function animate() {
    requestAnimationFrame(animate);
    clk += 0.007;
    frameCount++;

    // On mobile, morph vertices every other frame — visually identical, half the CPU
    if (!isMobile || frameCount % 2 === 0) {
      var bpos = blob.geometry.attributes.position;
      for (var j = 0; j < bpos.count; j++) {
        var ox = blobOrig[j * 3], oy = blobOrig[j * 3 + 1], oz = blobOrig[j * 3 + 2];
        var ln = Math.sqrt(ox * ox + oy * oy + oz * oz);
        var nx = ox / ln, ny = oy / ln, nz = oz / ln;
        var n = Math.sin(nx * 5 + clk * 1.4) * 0.045 + Math.cos(ny * 6 + clk * 0.8) * 0.035 + Math.sin(nz * 4 + clk * 1.9) * 0.03;
        bpos.setXYZ(j, nx * (0.7 + n), ny * (0.7 + n), nz * (0.7 + n));
      }
      bpos.needsUpdate = true;
    }

    blob.rotation.y += 0.005; blob.rotation.z += 0.003;
    inner.rotation.x -= 0.006; inner.rotation.y -= 0.004;
    ring.rotation.y += 0.007; ring.rotation.x += 0.001;
    particles.rotation.y += 0.00025; particles.rotation.x += 0.0001;
    tet.rotation.x += 0.008; tet.rotation.y += 0.005; tet.rotation.z += 0.003;
    oct.rotation.x += 0.005; oct.rotation.y += 0.009; oct.rotation.z += 0.004;

    cx += (mx - cx) * 0.04; cy += (my - cy) * 0.04;
    camera.position.x += (cx * 0.7 - camera.position.x) * 0.05;
    camera.position.y += (-cy * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function () {
    W = hero.offsetWidth; H = hero.offsetHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }, { passive: true });
})();

/* ════════════════════════════════════════════
   TYPED.JS
════════════════════════════════════════════ */
(function initTyped() {
  if (typeof Typed === 'undefined') return;
  new Typed('#typed-text', {
    strings: [
      'Full-Stack Developer',
      'AI Solutions Builder',
      'React and Next.js Dev',
      'Python and FastAPI Dev',
      'Mobile App Developer',
      'API Architect'
    ],
    typeSpeed: 55,
    backSpeed: 30,
    backDelay: 2200,
    startDelay: 1000,
    loop: true,
    cursorChar: '_'
  });
})();

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
(function initReveal() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseFloat(el.dataset.delay || 0);
      setTimeout(function () { el.classList.add('revealed'); }, delay * 1000);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { io.observe(el); });
})();

/* ════════════════════════════════════════════
   SKILL SEGMENT ANIMATION
════════════════════════════════════════════ */
(function initSkillDials() {
  var items = document.querySelectorAll('.sd-item');
  if (!items.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('sd-animate');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  items.forEach(function (item) { io.observe(item); });
})();

(function initStackReveal() {
  var rows = document.querySelectorAll('.stk-row');
  if (!rows.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('stk-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  rows.forEach(function (r) { io.observe(r); });
})();

/* ════════════════════════════════════════════
   JOURNEY — MOUSE PARALLAX ON 3D ELEMENTS
════════════════════════════════════════════ */
(function initJourneyParallax() {
  var section = document.getElementById('resume');
  if (!section) return;

  var layers = [
    { sel: '.rd-cube--lg', depth: 0.038 },
    { sel: '.rd-cube--md', depth: -0.024 },
    { sel: '.rd-cube--sm', depth: 0.030 },
    { sel: '.rd-ring3d--1', depth: 0.020 },
    { sel: '.rd-ring3d--2', depth: -0.014 },
    { sel: '.rd-glow--1', depth: 0.058 },
    { sel: '.rd-glow--2', depth: -0.038 },
    { sel: '.rd-grid', depth: 0.008 },
  ].map(function (l) {
    return { el: section.querySelector(l.sel), depth: l.depth, cx: 0, cy: 0 };
  }).filter(function (l) { return !!l.el; });

  if (!layers.length) return;

  var mx = 0, my = 0, rafId = null;

  document.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function tick() {
    rafId = requestAnimationFrame(tick);
    var r = section.getBoundingClientRect();
    if (r.bottom < -300 || r.top > window.innerHeight + 300) return;

    var hw = window.innerWidth * 0.5;
    var hh = window.innerHeight * 0.5;

    layers.forEach(function (l) {
      var tx = mx * l.depth * hw;
      var ty = my * l.depth * hh;
      l.cx += (tx - l.cx) * 0.055;
      l.cy += (ty - l.cy) * 0.055;
      l.el.style.translate = l.cx.toFixed(1) + 'px ' + l.cy.toFixed(1) + 'px';
    });
  }

  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      if (!rafId) tick();
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, { threshold: 0.05 });

  io.observe(section);
})();


/* ════════════════════════════════════════════
   DYNAMIC YEARS EXPERIENCE
════════════════════════════════════════════ */
(function initYearsExp() {
  var startDate = new Date('2023-06-05');
  var now = new Date();
  var years = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 365.25));

  var counter = document.getElementById('years-exp');
  if (counter) counter.dataset.count = years;

  var heroYears = document.getElementById('hero-years');
  if (heroYears) heroYears.textContent = years;

  var skillsYears = document.getElementById('skills-years');
  if (skillsYears) skillsYears.textContent = years;

  var footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = now.getFullYear();
})();

/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
(function initCounters() {
  var counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.dataset.count, 10);
      var dur = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { io.observe(el); });
})();

/* ════════════════════════════════════════════
   PARALLAX
════════════════════════════════════════════ */
(function initParallax() {
  var els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  window.addEventListener('scroll', function () {
    var sy = window.pageYOffset;
    els.forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax);
      el.style.transform = 'translateY(' + (sy * speed) + 'px)';
    });
  }, { passive: true });
})();

/* ════════════════════════════════════════════
   VANILLA TILT
════════════════════════════════════════════ */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.15,
    scale: 1.02
  });
})();

/* ════════════════════════════════════════════
   SERVICES — click arrow to expand
════════════════════════════════════════════ */
(function initServiceToggle() {
  document.querySelectorAll('.svc-arr').forEach(function (arrow) {
    arrow.addEventListener('click', function (e) {
      e.stopPropagation();
      var row = arrow.closest('.svc-row');
      if (!row) return;
      var isOpen = row.classList.contains('is-open');
      document.querySelectorAll('.svc-row.is-open').forEach(function (r) {
        r.classList.remove('is-open');
      });
      if (!isOpen) row.classList.add('is-open');
    });
  });
})();

/* ════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════ */
(function initForm() {
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var subject = document.getElementById('cf-subject').value.trim();
    var message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) return;

    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    var gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1'
      + '&to=contact.yashwaghadhare@gmail.com'
      + '&su=' + encodeURIComponent(subject || 'Portfolio Contact from ' + name)
      + '&body=' + encodeURIComponent(body);

    window.open(gmailUrl, '_blank', 'noopener');

    if (success) {
      success.textContent = '✓ Gmail opened — review and hit Send!';
      setTimeout(function () { success.textContent = ''; }, 6000);
    }

    form.reset();
  });
})();

/* ════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ════════════════════════════════════════════
   HERO TECH PILL STAGGER
════════════════════════════════════════════ */
(function pillStagger() {
  document.querySelectorAll('.hero-pills .pill').forEach(function (pill, i) {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(12px)';
    pill.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(function () {
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0)';
    }, (1300 + i * 80));
  });
})();

/* ════════════════════════════════════════════
   SERVICE WORKER — cache for fast repeat loads
════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  });
}
