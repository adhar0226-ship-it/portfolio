/* =========================================================
   1. UTILITIES
   ========================================================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   2. LOADING SCREEN
   ========================================================= */
window.addEventListener('load', () => {
  setTimeout(() => $('#loader').classList.add('hidden'), 700);
});

/* =========================================================
   3. CUSTOM CURSOR + MOUSE GLOW
   ========================================================= */
if (!isTouch) {
  const dot = $('.cursor-dot');
  const ring = $('.cursor-ring');
  const glow = $('.mouse-glow');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my, gx = mx, gy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Cursor hover state for interactive elements
  $$('a, button, .project-card, .gallery-item, .service-card, .skill-card, .blog-card, .award-card, .cert-card, .soft-skill, .testi-card, .contact-item, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
}

/* =========================================================
   4. PARTICLES (Canvas)
   ========================================================= */
(() => {
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 205, 207, ${p.a})`;
      ctx.fill();
    });
    // Connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 13000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(141, 182, 176, ${0.12 * (1 - d2 / 13000)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  if (!reduceMotion) draw();
})();

/* =========================================================
   5. TYPING ANIMATION
   ========================================================= */
(() => {
  const roles = ['Perfectionist', 'Web Developer', 'AI Integrator', 'Problem Solver', 'Fast Learner', 'Builder of Dreams'];
  const el = $('#typing');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const role = roles[roleIdx];
    el.textContent = role.substring(0, charIdx);
    if (!deleting) {
      charIdx++;
      if (charIdx > role.length) { deleting = true; setTimeout(tick, 1600); return; }
      setTimeout(tick, 70 + Math.random() * 50);
    } else {
      charIdx--;
      if (charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 1200);
})();

/* =========================================================
   6. NAVIGATION - hide on scroll, active highlight, mobile menu
   ========================================================= */
(() => {
  const nav = $('#nav');
  const sections = $$('section, header.hero');
  const links = $$('.nav-links a');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');

  // Hide on scroll down, show on scroll up
  let lastY = 0, ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 200) {
          if (y > lastY) nav.classList.add('hidden');
          else nav.classList.remove('hidden');
        } else {
          nav.classList.remove('hidden');
        }
        nav.classList.toggle('scrolled', y > 30);
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Active section highlight
  const setActive = () => {
    const y = window.scrollY + window.innerHeight / 3;
    let current = links[0]?.getAttribute('href');
    sections.forEach(s => {
      if (s.offsetTop <= y) current = '#' + s.id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Mobile menu
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
    });
  });
})();

/* =========================================================
   7. SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
(() => {
  const items = $$('.reveal, .timeline-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach(i => io.observe(i));
})();

/* =========================================================
   8. SKILL CIRCLE PROGRESS (animate on view)
   ========================================================= */
(() => {
  const circles = $$('.skill-circle .fill');
  const C = 2 * Math.PI * 56; // circumference
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      const pct = parseInt(fill.getAttribute('data-pct'), 10);
      const offset = C - (pct / 100) * C;
      fill.style.strokeDashoffset = C;
      // animate
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.strokeDashoffset = offset;
        });
      });
      // number counter
      const num = fill.closest('.skill-circle').querySelector('.pct');
      const dur = 1400;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        num.textContent = Math.round(pct * eased) + '%';
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(fill);
    });
  }, { threshold: 0.4 });
  circles.forEach(c => io.observe(c));
})();

/* =========================================================
   9. COUNTER ANIMATION (about counters)
   ========================================================= */
(() => {
  const counters = $$('.counter');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + (target === 100 ? '%' : '+');
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
})();

/* =========================================================
   10. SKILL TABS
   ========================================================= */
$$('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    $$('[data-group]').forEach(g => {
      g.style.display = g.dataset.group === cat ? '' : 'none';
    });
  });
});

/* =========================================================
   11. 3D TILT on cards
   ========================================================= */
if (!isTouch && !reduceMotion) {
  $$('.project-card, .service-card, .skill-card, .award-card, .blog-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =========================================================
   12. MAGNETIC BUTTONS
   ========================================================= */
if (!isTouch && !reduceMotion) {
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* =========================================================
   13. RIPPLE EFFECT on .btn
   ========================================================= */
$$('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* =========================================================
   14. TESTIMONIALS CAROUSEL
   ========================================================= */
(() => {
  const track = $('#testiTrack');
  const prev = $('#testiPrev');
  const next = $('#testiNext');
  if (!track) return;
  let offset = 0;
  const cards = $$('.testi-card', track);
  function step(dir) {
    const card = cards[0];
    const w = card.offsetWidth + 24; // gap
    const visible = Math.max(1, Math.floor(track.parentElement.offsetWidth / w));
    const max = Math.max(0, cards.length - visible);
    offset = Math.max(0, Math.min(max, offset + dir));
    track.style.transform = `translateX(${-offset * w}px)`;
  }
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  window.addEventListener('resize', () => { offset = 0; track.style.transform = 'translateX(0)'; });
})();

/* =========================================================
   15. BACK TO TOP
   ========================================================= */
(() => {
  const btn = $('#toTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* =========================================================
   16. CONTACT FORM (frontend validation)
   ========================================================= */
(() => {
  const form = $('#contactForm');
  const success = $('#formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    $$('.form-group', form).forEach(g => g.classList.remove('error'));

    const name = $('#name'), email = $('#email'), message = $('#message');
    if (!name.value.trim()) { name.closest('.form-group').classList.add('error'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.closest('.form-group').classList.add('error'); valid = false; }
    if (!message.value.trim()) { message.closest('.form-group').classList.add('error'); valid = false; }

    if (valid) {
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
})();

/* =========================================================
   17. AMBIENT SOUND (Web Audio API - soft pad)
   ========================================================= */
(() => {
  const btn = $('#musicToggle');
  const icon = $('#musicIcon');
  let ctx, masterGain, oscillators = [], started = false, playing = false;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    // Soft low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.4;
    filter.connect(masterGain);

    // Soothing chord: A2 root + E3 + A3 + C#4 (Amaj7-ish) + gentle 5th
    const freqs = [110, 164.81, 220, 277.18, 329.63];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.value = 0.18 / freqs.length;

      // Slow LFO for movement
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + i * 0.03;
      lfoGain.gain.value = f * 0.008;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(g);
      g.connect(filter);
      osc.start();
      lfo.start();
      oscillators.push(osc, lfo);
    });
  }

  function play() {
    if (!started) { build(); started = true; }
    if (ctx.state === 'suspended') ctx.resume();
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5);
    playing = true;
    btn.classList.add('playing');
    icon.className = 'fa-solid fa-music';
  }
  function stop() {
    if (!started) return;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    playing = false;
    btn.classList.remove('playing');
    icon.className = 'fa-solid fa-volume-xmark';
  }

  btn.addEventListener('click', () => playing ? stop() : play());

  // Auto-stop when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) stop();
  });
})();

/* =========================================================
   18. PARALLAX (subtle) for hero portrait + blobs
   ========================================================= */
(() => {
  if (isTouch || reduceMotion) return;
  const portrait = $('#portraitWrap');
  const blobs = $$('.bg-blob');
  let mx = 0, my = 0, fx = 0, fy = 0;
  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  function loop() {
    fx += (mx - fx) * 0.06;
    fy += (my - fy) * 0.06;
    if (portrait) portrait.style.transform = `translate(${fx * 14}px, ${fy * 14}px)`;
    blobs.forEach((b, i) => {
      const k = (i + 1) * 8;
      b.style.transform = `translate(${fx * k}px, ${fy * k}px)`;
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* =========================================================
   19. FOOTER YEAR
   ========================================================= */
$('#year').textContent = new Date().getFullYear();

/* =========================================================
   20. HIRE ME button - opens contact
   ========================================================= */
$('#hireMeBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
});


