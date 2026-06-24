/* ============================================================
   ANY AND ALL WIND — script
   ============================================================ */

/* ====== 収録曲データ ====== */
/* video: YouTube動画ID（追記でMOVIEバッジ表示） / color: クオリア色（曲ごとのイメージカラー、ここで調整可） */
const TRACKS = [
  {no:'01', ja:'モラトリアム・ディシジョン', video:'LYW-qOvpYWI', color:'#ff7a4d'},
  {no:'02', ja:'アノニマスヒーロー', video:'XCbkbXYIuiI', color:'#b9aee0'},
  {no:'03', ja:'余白を透る', color:'#8fcfe6'},           /* 動画投稿予定 */
  {no:'04', ja:'BlackStar', color:'#6a78ff'},
  {no:'05', ja:'Dead-End Dance', video:'cXVxWTl76tk', color:'#f3608f'},
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

/* ====== 風に舞うモチーフ群（◯●＋✕✦ーを流れ場に乗せて・カーソル反応・クオリア色） ====== */
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cv = document.getElementById('wind-canvas');
  const ctx = cv.getContext('2d');
  let w, h, parts, t = 0;
  const COLORS = ['#9fd9ec', '#a9e3cf', '#f0e1a0', '#f3a8c4', '#bcb0e6', '#e7cf8e', '#43d0ec', '#f4f1e6'];
  const TYPES = ['dot', 'ring', 'ring', 'plus', 'cross', 'star', 'line'];
  const hexRgb = (x) => { x = x.replace('#', ''); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; };

  /* クオリア色のティント（曲ホバーで window.aawSetTint が呼ばれる） */
  let tintTo = null, tintRgb = [0, 0, 0], tintT = 0;
  window.aawSetTint = (col) => { tintTo = col; if (col) tintRgb = hexRgb(col); };

  /* カーソル/タッチで起きる突風 */
  let windX = 0, windY = 0, lastT = null;
  const clamp = (v) => Math.max(-3.5, Math.min(3.5, v));
  addEventListener('mousemove', (e) => { windX = clamp(windX + (e.movementX || 0) * 0.05); windY = clamp(windY + (e.movementY || 0) * 0.03); }, { passive: true });
  addEventListener('touchmove', (e) => { const p = e.touches[0]; if (lastT) { windX = clamp(windX + (p.clientX - lastT.x) * 0.04); windY = clamp(windY + (p.clientY - lastT.y) * 0.03); } lastT = { x: p.clientX, y: p.clientY }; }, { passive: true });
  addEventListener('touchend', () => { lastT = null; }, { passive: true });

  /* 風の流れ場（角度）— 軽量な擬似ノイズ */
  const flow = (x, y) => (Math.sin(x * 0.0016 + t * 0.004) + Math.cos(y * 0.0021 - t * 0.005)) * 1.1 + Math.sin((x + y) * 0.001) * 0.7;

  function resize() { w = cv.width = innerWidth; h = cv.height = innerHeight; }
  function mk() {
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: Math.random() * 0.4 + 0.1, vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.32 + 0.22,
      s: Math.random() * 8 + 5,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.025,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      cr: hexRgb(COLORS[Math.floor(Math.random() * COLORS.length)])
    };
  }
  function init() { resize(); parts = Array.from({ length: Math.min(64, Math.floor(w / 24)) }, mk); }

  function drawMotif(type, s) {
    const o = s * 0.5, lw = Math.max(1, s * 0.16);
    ctx.lineWidth = lw;
    if (type === 'dot') { ctx.beginPath(); ctx.arc(0, 0, o * 0.7, 0, 7); ctx.fill(); }
    else if (type === 'ring') { ctx.beginPath(); ctx.arc(0, 0, o, 0, 7); ctx.stroke(); }
    else if (type === 'plus') { ctx.beginPath(); ctx.moveTo(-o, 0); ctx.lineTo(o, 0); ctx.moveTo(0, -o); ctx.lineTo(0, o); ctx.stroke(); }
    else if (type === 'cross') { ctx.beginPath(); ctx.moveTo(-o, -o); ctx.lineTo(o, o); ctx.moveTo(-o, o); ctx.lineTo(o, -o); ctx.stroke(); }
    else if (type === 'line') { ctx.beginPath(); ctx.moveTo(-o * 1.3, 0); ctx.lineTo(o * 1.3, 0); ctx.stroke(); }
    else { const i = o * 0.34; ctx.beginPath(); ctx.moveTo(0, -o); ctx.lineTo(i, -i); ctx.lineTo(o, 0); ctx.lineTo(i, i); ctx.lineTo(0, o); ctx.lineTo(-i, i); ctx.lineTo(-o, 0); ctx.lineTo(-i, -i); ctx.closePath(); ctx.fill(); }
  }

  function loop() {
    t++;
    ctx.clearRect(0, 0, w, h);
    windX *= 0.95; windY *= 0.95;
    tintT += ((tintTo ? 1 : 0) - tintT) * 0.06;
    ctx.lineCap = 'round';
    for (const p of parts) {
      const ang = flow(p.x, p.y);
      p.vx += Math.cos(ang) * 0.04 + 0.035 + windX * 0.014;
      p.vy += Math.sin(ang) * 0.04 + windY * 0.014;
      p.vx *= 0.92; p.vy *= 0.92;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const m = p.s + 8;
      if (p.x > w + m) { p.x = -m; p.y = Math.random() * h; }
      if (p.x < -m) p.x = w + m;
      if (p.y > h + m) p.y = -m;
      if (p.y < -m) p.y = h + m;
      let r = p.cr[0], g = p.cr[1], b = p.cr[2];
      if (tintT > 0.01) { r += (tintRgb[0] - r) * tintT; g += (tintRgb[1] - g) * tintT; b += (tintRgb[2] - b) * tintT; }
      const col = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = col; ctx.strokeStyle = col;
      drawMotif(p.type, p.s);
      ctx.restore();
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

/* ====== 入場イントロ（粒が ANY AND ALL WIND を形成→ホワイトアウト→ヒーローへ） ====== */
/* 訪問のたびに毎回表示する */
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;
  /* フェイルセーフ：何があっても7秒で幕を必ず外す（白幕の居座り防止） */
  setTimeout(() => { try { document.documentElement.style.overflow = ''; document.body.style.overflow = ''; } catch (e) {} const el = document.getElementById('intro'); if (el) el.remove(); }, 7000);
  /* 毎回表示。セッション1回だけにしたい場合は、ここで sessionStorage を見て return する処理を足す */
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) { intro.remove(); return; }
  document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
  const cv = document.getElementById('introCv'), ctx = cv.getContext('2d');
  const white = document.getElementById('introWhite');
  const oc = document.createElement('canvas'), octx = oc.getContext('2d', { willReadFrequently: true });
  const COLS = ['244,241,230', '231,207,142', '231,207,142', '201,162,74', '240,225,160', '243,168,196', '169,227,207', '188,176,230', '159,217,236', '67,208,236'];
  let W, H, t = 0, parts = [], flashes = [], finished = false, raf = 0;
  function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; } size(); addEventListener('resize', size);

  function sample() {
    oc.width = W; oc.height = H; octx.clearRect(0, 0, W, H);
    octx.fillStyle = '#fff'; octx.textAlign = 'center'; octx.textBaseline = 'middle';
    const setF = (s) => octx.font = "500 " + s + "px 'Cormorant Garamond'";
    const lines = W < 760 ? ['ANY AND', 'ALL WIND'] : ['ANY AND ALL WIND'];   // 狭い画面は2行にして大きく
    let fs = Math.min(W * 0.16, H * 0.2);
    setF(fs); let mw = 0; for (const L of lines) mw = Math.max(mw, octx.measureText(L).width);
    if (mw > W * 0.84) { fs = Math.floor(fs * W * 0.84 / mw); setF(fs); }
    const lh = fs * 1.08, y0 = H * 0.46 - (lines.length - 1) * lh / 2;
    lines.forEach((L, i) => octx.fillText(L, W / 2, y0 + i * lh));
    const d = octx.getImageData(0, 0, W, H).data; let pts = [], step = 2;
    for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 120) pts.push({ x, y });
    while (pts.length > 4000) { const f = []; for (let i = 0; i < pts.length; i += 2) f.push(pts[i]); pts = f; }
    return pts;
  }
  function init() {
    let pts = sample(); pts.sort((a, b) => a.x - b.x);
    const minX = pts.length ? pts[0].x : 0, maxX = pts.length ? pts[pts.length - 1].x : 1, span = Math.max(1, maxX - minX);
    const SPREAD = 45, Np = Math.min(4500, pts.length + 400);
    parts = [];
    for (let i = 0; i < Np; i++) {
      const tp = i < pts.length ? pts[i] : null;
      parts.push({
        x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2,
        tx: tp ? tp.x : W / 2, ty: tp ? tp.y : H / 2, timer: tp ? Math.round((tp.x - minX) / span * SPREAD) : 0,
        st: tp ? 'wait' : 'fade', a: 0, baseA: Math.random() * .4 + .55, sz: Math.random() * 1.4 + 1.1,
        col: COLS[(Math.random() * COLS.length) | 0], tw: Math.random() * .02 + .008
      });
    }
  }
  function flash(x, y, r, life) { flashes.push({ x, y, r, age: 0, life }); }
  function loop() {
    t++;
    ctx.fillStyle = 'rgba(8,26,31,0.3)'; ctx.fillRect(0, 0, W, H);
    for (const p of parts) {
      if (p.st === 'active') { p.vx += (p.tx - p.x) * .013; p.vy += (p.ty - p.y) * .013; p.vx *= .86; p.vy *= .86; p.x += p.vx; p.y += p.vy; p.a += (p.baseA - p.a) * .09; }
      else if (p.st === 'wait') { if (p.timer > 0) { p.timer--; p.x += p.vx * .25; p.y += p.vy * .25; p.vx *= .96; p.vy *= .96; p.a += (p.baseA * .4 - p.a) * .05; } else p.st = 'active'; }
      else { p.vy += .02; p.vx *= .97; p.x += p.vx; p.y += p.vy; p.a += (0 - p.a) * .05; }
      if (p.a < .012) continue;
      ctx.globalAlpha = p.a * (0.8 + 0.2 * Math.sin(t * p.tw + p.x * .01));
      ctx.fillStyle = 'rgb(' + p.col + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'lighter';
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i]; f.age++; const pr = f.age / f.life; if (pr >= 1) { flashes.splice(i, 1); continue; }
      const r = (1 - Math.pow(1 - pr, 2)) * f.r, al = (1 - pr) * .8;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      g.addColorStop(0, 'rgba(255,250,228,' + al + ')'); g.addColorStop(.4, 'rgba(231,207,142,' + (al * .5) + ')'); g.addColorStop(1, 'rgba(231,207,142,0)');
      ctx.fillStyle = g; ctx.fillRect(f.x - r, f.y - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(loop);
  }
  function finish(fast) {
    if (finished) return; finished = true;
    white.classList.remove('on');
    intro.style.transition = fast ? 'opacity .55s ease' : 'opacity 1s ease';
    intro.classList.add('done');
    for (const p of parts) { p.st = 'fade'; p.vx = (Math.random() - .5) * 16; p.vy = -(Math.random() * 7 + 1); }
    document.documentElement.style.overflow = ''; document.body.style.overflow = '';
    setTimeout(() => { cancelAnimationFrame(raf); intro.remove(); }, fast ? 650 : 1100);
  }
  function start() {
    if (finished) return;
    init(); loop();
    setTimeout(() => { if (!finished) { white.classList.add('on'); flash(W / 2, H * 0.46, Math.max(W, H) * 0.55, 38); } }, 2700);
    setTimeout(() => { finish(false); }, 3200);
  }
  document.fonts.load("500 140px 'Cormorant Garamond'").then(start).catch(start);
  setTimeout(() => { if (!parts.length && !finished) start(); }, 1200);
  ['click', 'touchstart', 'keydown', 'wheel'].forEach(ev => addEventListener(ev, () => finish(true), { once: true, passive: true }));
})();
