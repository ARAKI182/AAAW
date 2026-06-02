/* ============================================================
   ANY AND ALL WIND — script
   ============================================================ */

/* ====== 収録曲データ ====== */
const TRACKS = [
  {no:'01', ja:'モラトリアム・ディシジョン'},
  {no:'02', ja:'アノニマスヒーロー'},
  {no:'03', ja:'余白を透る'},
  {no:'04', ja:'BlackStar'},
  {no:'05', ja:'Dead-End Dance'},
  {no:'06', ja:'Filter Bubble'},
  {no:'07', ja:'Qualia'},
  {no:'08', ja:'Nameless Ballade'},
  {no:'09', ja:'グッバイリメンバー'}
];

/* ====== トラックリスト描画（各曲クレジット付・スクロール演出付） ====== */
const tl = document.getElementById('trackList');
tl.innerHTML = TRACKS.map((t, i) => {
  const cred = t.no === '05'
    ? ['Words：ARAKI', 'Music：Narukaze', 'Arrangement：Narukaze']
    : ['Words &amp; Music：ARAKI', 'Arrangement：Narukaze'];
  return `
  <div class="track reveal" style="transition-delay:${i * 55}ms">
    <div class="track-head">
      <span class="track-no">${t.no}</span>
      <div class="track-titles">
        <div class="track-ttl">${t.ja}</div>
        <div class="track-cred">${cred.map(c => `<span>${c}</span>`).join('')}</div>
      </div>
    </div>
  </div>`;
}).join('');

/* ====== ハンバーガーメニュー ====== */
const burger = document.getElementById('burger');
const mmenu = document.getElementById('mmenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('x');
  mmenu.classList.toggle('open');
});
mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('x');
  mmenu.classList.remove('open');
}));

/* ====== スクロール演出（要素が浮き上がってくる） ====== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ====== 追従CTA（ヒーローを抜けたら表示） ====== */
const fcta = document.getElementById('floatCta');
const heroEl = document.getElementById('hero');
const hio = new IntersectionObserver((entries) => {
  entries.forEach(e => fcta.classList.toggle('show', !e.isIntersecting));
}, { threshold: 0.05 });
hio.observe(heroEl);

/* ====== 風パーティクル ====== */
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cv = document.getElementById('wind-canvas');
  const ctx = cv.getContext('2d');
  let w, h, parts;
  const COLORS = ['#9fd9ec', '#a9e3cf', '#f0e1a0', '#f3a8c4', '#bcb0e6', '#e7cf8e'];
  function resize() { w = cv.width = innerWidth; h = cv.height = innerHeight; }
  function mk() {
    return {
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2.2 + 0.5,
      vx: Math.random() * 0.35 + 0.12,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      sw: Math.random() * Math.PI * 2
    };
  }
  function init() { resize(); parts = Array.from({ length: Math.min(70, Math.floor(w / 22)) }, mk); }
  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.sw += 0.01; p.y += p.vy + Math.sin(p.sw) * 0.15;
      if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
      if (p.y > h + 10) p.y = -10;
      if (p.y < -10) p.y = h + 10;
      ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  init(); loop();
  addEventListener('resize', init);
})();
