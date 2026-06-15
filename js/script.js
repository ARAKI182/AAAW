/* ============================================================
   ANY AND ALL WIND — script
   ============================================================ */

/* ====== 収録曲データ ====== */
/* video: YouTube動画ID（追記でMOVIEバッジ表示） / color: クオリア色（曲ごとのイメージカラー、ここで調整可） */
const TRACKS = [
  {no:'01', ja:'モラトリアム・ディシジョン', video:'LYW-qOvpYWI', color:'#ff7a4d'},
  {no:'02', ja:'アノニマスヒーロー', color:'#b9aee0'},   /* 動画投稿予定 */
  {no:'03', ja:'余白を透る', color:'#8fcfe6'},           /* 動画投稿予定 */
  {no:'04', ja:'BlackStar', color:'#6a78ff'},
  {no:'05', ja:'Dead-End Dance', color:'#f3608f'},
  {no:'06', ja:'Filter Bubble', color:'#b6d96a'},
  {no:'07', ja:'Qualia', video:'ElufWTpeXUs', color:'#43d0ec'},
  {no:'08', ja:'Nameless Ballade', color:'#e7cf8e'},
  {no:'09', ja:'グッバイリメンバー', color:'#d2a0b8'}
];

/* ====== トラックリスト描画（各曲クレジット付・スクロール演出付） ====== */
const tl = document.getElementById('trackList');
tl.innerHTML = TRACKS.map((t, i) => {
  const cred = t.no === '05'
    ? ['Words：ARAKI', 'Music：Narukaze', 'Arrangement：Narukaze']
    : ['Words &amp; Music：ARAKI', 'Arrangement：Narukaze'];
  const badge = t.video
    ? `<button class="movie-badge" data-video="${t.video}" aria-label="MOVIEを再生"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Movie</button>`
    : '';
  return `
  <div class="track reveal" data-color="${t.color}" style="transition-delay:${i * 55}ms">
    <div class="track-head">
      <span class="track-no">${t.no}</span>
      <div class="track-titles">
        <div class="track-ttl">${t.ja}</div>
        <div class="track-meta-row">
          <div class="track-cred">${cred.map(c => `<span>${c}</span>`).join('')}</div>
          ${badge}
        </div>
      </div>
    </div>
  </div>`;
}).join('');

/* ====== クオリア — 曲ごとの色でセクションと風を染める ====== */
const tracksSection = document.getElementById('tracks');
const trackListEl = document.getElementById('trackList');
document.querySelectorAll('.track').forEach(tr => {
  tr.addEventListener('mouseenter', () => {
    const col = tr.dataset.color;
    if (!col) return;
    tracksSection.style.setProperty('--qualia', col);
    tracksSection.classList.add('q-active');
    if (window.aawSetTint) window.aawSetTint(col);
  });
});
trackListEl.addEventListener('mouseleave', () => {
  tracksSection.classList.remove('q-active');
  if (window.aawSetTint) window.aawSetTint(null);
});

/* ====== 動画モーダル ====== */
const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');
function openVideo(id) {
  modalIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalIframe.src = '';
  document.body.style.overflow = '';
}
document.querySelectorAll('.movie-badge').forEach(b =>
  b.addEventListener('click', () => openVideo(b.dataset.video))
);
modal.querySelector('.modal-backdrop').addEventListener('click', closeVideo);
modal.querySelector('.modal-close').addEventListener('click', closeVideo);
addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo(); });

/* ====== 全曲クロスフェード（収録曲の下） ====== */
/* ★クロスフェード動画ができたら、ここにYouTubeのIDを入れるだけでボタンが出ます（例: 'AbCdEf12345'） */
const CROSSFADE_ID = '';
const cfWrap = document.getElementById('crossfadeWrap');
if (CROSSFADE_ID) {
  cfWrap.innerHTML = `<button class="crossfade-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>全曲クロスフェードを見る</button>`;
  cfWrap.querySelector('.crossfade-btn').addEventListener('click', () => openVideo(CROSSFADE_ID));
}

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

/* ====== Xシェアボタン ====== */
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  /* URL・ハッシュタグも全てtextに入れて改行を制御（3行表示） */
  const shareText = 'あらき - ANY AND ALL WIND\nhttps://araki-live.jp/aaaw/\n#あらき #AAAW';
  shareBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
}

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

/* ====== 風パーティクル（カーソル/タッチに反応＋クオリア色ティント） ====== */
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cv = document.getElementById('wind-canvas');
  const ctx = cv.getContext('2d');
  let w, h, parts;
  const COLORS = ['#9fd9ec', '#a9e3cf', '#f0e1a0', '#f3a8c4', '#bcb0e6', '#e7cf8e'];
  const hexRgb = (x) => { x = x.replace('#', ''); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; };

  /* クオリア色のティント（曲ホバーで window.aawSetTint が呼ばれる） */
  let tintTo = null, tintRgb = [0, 0, 0], tintT = 0;
  window.aawSetTint = (col) => { tintTo = col; if (col) tintRgb = hexRgb(col); };

  /* カーソル/タッチで起きる風 */
  let windX = 0, windY = 0, lastT = null;
  const clamp = (v) => Math.max(-3, Math.min(3, v));
  addEventListener('mousemove', (e) => { windX = clamp(windX + (e.movementX || 0) * 0.05); windY = clamp(windY + (e.movementY || 0) * 0.03); }, { passive: true });
  addEventListener('touchmove', (e) => { const t = e.touches[0]; if (lastT) { windX = clamp(windX + (t.clientX - lastT.x) * 0.04); windY = clamp(windY + (t.clientY - lastT.y) * 0.03); } lastT = { x: t.clientX, y: t.clientY }; }, { passive: true });
  addEventListener('touchend', () => { lastT = null; }, { passive: true });

  function resize() { w = cv.width = innerWidth; h = cv.height = innerHeight; }
  function mk() {
    return {
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2.2 + 0.5,
      vx: Math.random() * 0.35 + 0.12,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
      cr: hexRgb(COLORS[Math.floor(Math.random() * COLORS.length)]),
      sw: Math.random() * Math.PI * 2
    };
  }
  function init() { resize(); parts = Array.from({ length: Math.min(70, Math.floor(w / 22)) }, mk); }
  function loop() {
    ctx.clearRect(0, 0, w, h);
    windX *= 0.95; windY *= 0.95;
    tintT += ((tintTo ? 1 : 0) - tintT) * 0.06;
    for (const p of parts) {
      p.x += p.vx + windX; p.sw += 0.01; p.y += p.vy + windY + Math.sin(p.sw) * 0.15;
      if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
      if (p.x < -10) p.x = w + 10;
      if (p.y > h + 10) p.y = -10;
      if (p.y < -10) p.y = h + 10;
      let r = p.cr[0], g = p.cr[1], b = p.cr[2];
      if (tintT > 0.01) { r += (tintRgb[0] - r) * tintT; g += (tintRgb[1] - g) * tintT; b += (tintRgb[2] - b) * tintT; }
      ctx.globalAlpha = p.a; ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  init(); loop();
  addEventListener('resize', init);
})();

/* ====== ヒーロー：ジャケの3Dチルト（PCのみ） ====== */
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  if (!matchMedia('(pointer:fine)').matches) return;
  const hero = document.getElementById('hero');
  const jk = hero && hero.querySelector('.hero-jacket');
  if (!jk) return;
  hero.addEventListener('mousemove', (e) => {
    const b = hero.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    jk.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
  });
  hero.addEventListener('mouseleave', () => { jk.style.transform = ''; });
})();
