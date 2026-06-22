/* ===== VIP Taplink — interactive effects ===== */

/* 1) Floating golden particles on canvas */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const COUNT = 46;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function make() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.2,
      tw: Math.random() * 0.02 + 0.005
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.y += p.vy;
      p.x += p.vx;
      p.a += p.tw;
      const alpha = 0.25 + Math.abs(Math.sin(p.a)) * 0.55;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247,215,116,${alpha})`;
      ctx.shadowColor = 'rgba(247,215,116,0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  resize();
  make();
  tick();
  window.addEventListener('resize', () => { resize(); make(); });
})();

/* 2) Subtle 3D tilt of the card following the pointer */
(function () {
  const card = document.getElementById('card');
  if (!card || window.matchMedia('(pointer:coarse)').matches) return;
  const MAX = 6;
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${-py * MAX}deg) rotateY(${px * MAX}deg)`;
    card.style.transition = 'transform .1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
    card.style.transform = 'rotateX(0) rotateY(0)';
  });
})();

/* 3) Ripple effect on button tap */
(function () {
  document.querySelectorAll('.link, .social').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const r = this.getBoundingClientRect();
      circle.style.cssText = `position:absolute;border-radius:50%;transform:scale(0);
        background:rgba(255,255,255,.35);pointer-events:none;
        width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;
        top:${e.clientY - r.top - d / 2}px;animation:ripple .6s ease-out forwards;`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
  const s = document.createElement('style');
  s.textContent = '@keyframes ripple{to{transform:scale(2.4);opacity:0}}';
  document.head.appendChild(s);
})();
