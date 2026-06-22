/* ============================================================
   VIP · Link in Bio — interactions
   ============================================================ */

/* ---------- 1. Animated mesh gradient (canvas blobs) ---------- */
(function () {
  const cv = document.getElementById('mesh');
  const ctx = cv.getContext('2d');
  let w, h, t = 0;
  const blobs = [
    { c: [124, 92, 255], r: 0.55, ox: 0.25, oy: 0.30, sx: 0.6, sy: 0.5 },
    { c: [255, 77, 157], r: 0.50, ox: 0.75, oy: 0.25, sx: 0.5, sy: 0.7 },
    { c: [34, 211, 238], r: 0.45, ox: 0.70, oy: 0.78, sx: 0.7, sy: 0.4 },
    { c: [255, 213, 107], r: 0.40, ox: 0.25, oy: 0.80, sx: 0.4, sy: 0.6 }
  ];
  function resize() {
    w = cv.width = innerWidth;
    h = cv.height = innerHeight;
  }
  function draw() {
    t += 0.0032;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, w, h);
    const m = Math.max(w, h);
    for (const b of blobs) {
      const x = (b.ox + Math.sin(t * b.sx + b.oy * 6) * 0.13) * w;
      const y = (b.oy + Math.cos(t * b.sy + b.ox * 6) * 0.13) * h;
      const rad = b.r * m * (0.85 + Math.sin(t + b.ox * 4) * 0.15);
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.55)`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    requestAnimationFrame(draw);
  }
  resize();
  draw();
  addEventListener('resize', resize);
})();

/* ---------- 2. Cursor spotlight + card shine ---------- */
(function () {
  const sp = document.getElementById('spotlight');
  const coarse = matchMedia('(pointer:coarse)').matches;
  if (coarse) { sp.style.opacity = '.5'; return; }
  addEventListener('mousemove', (e) => {
    sp.style.left = e.clientX + 'px';
    sp.style.top = e.clientY + 'px';
    document.querySelectorAll('.cell-shine').forEach((s) => {
      const r = s.parentElement.getBoundingClientRect();
      s.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      s.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ---------- 3. Magnetic elements ---------- */
(function () {
  if (matchMedia('(pointer:coarse)').matches) return;
  const STR = 0.35;
  document.querySelectorAll('[data-mag]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * STR}px, ${y * STR}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
      el.style.transform = 'translate(0,0)';
      setTimeout(() => (el.style.transition = ''), 500);
    });
  });
})();

/* ---------- 4. Staggered entrance reveal ---------- */
(function () {
  const els = document.querySelectorAll('[data-anim]');
  requestAnimationFrame(() => els.forEach((el) => el.classList.add('in')));
})();

/* ---------- 5. Count-up stats ---------- */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  const run = (el) => {
    const target = +el.dataset.count;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  setTimeout(() => nums.forEach(run), 700);
})();

/* ---------- 6. Ripple on tap ---------- */
(function () {
  document.querySelectorAll('.cell, .socials .mag').forEach((b) => {
    b.addEventListener('click', function (e) {
      const c = document.createElement('span');
      const d = Math.max(this.clientWidth, this.clientHeight);
      const r = this.getBoundingClientRect();
      c.style.cssText = `position:absolute;border-radius:50%;transform:scale(0);
        background:rgba(255,255,255,.25);pointer-events:none;z-index:0;
        width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;
        top:${e.clientY - r.top - d / 2}px;animation:rip .65s ease-out forwards;`;
      this.appendChild(c);
      setTimeout(() => c.remove(), 650);
    });
  });
  const s = document.createElement('style');
  s.textContent = '@keyframes rip{to{transform:scale(2.6);opacity:0}}';
  document.head.appendChild(s);
})();
