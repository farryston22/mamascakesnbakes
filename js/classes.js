/* Classes page interactions */

/* ---- Count-up numbers ---- */
const cIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cIO.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  (function f(t){ const p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? (el.dataset.suffix || '') : ''); if (p < 1) requestAnimationFrame(f); })(t0);
}), {threshold:.6});
$$('[data-count]').forEach(el => cIO.observe(el));

/* ---- Learning journey ---- */
(() => {
  const STEPS = [
    ['Level & stack', 'Levelling and stacking a real 5-inch cake', 'Trim the domed tops so every layer sits flat, then stack them straight — the foundation of a great-looking cake.'],
    ['Fill', 'Filling without bulging', 'Pipe a buttercream dam and add your filling so the sides stay neat and nothing bulges out later.'],
    ['Crumb coat', 'Crumb coating for a clean base', 'A thin first layer of buttercream that locks in the crumbs, giving you a clean base to work on.'],
    ['Smooth coat', 'Achieving a smooth final coat', 'Build up the final coat and use your scraper for smooth sides and sharp, clean edges.'],
    ['Colour', 'Colouring buttercream (two colours)', 'Mix two buttercream colours with confidence and bring them together on your cake.'],
    ['Pipe', 'Using two piping tips for borders and designs', 'Practise with two different tips to create borders, florals and fun designs.'],
    ['Finish', 'Professional finishing techniques', 'The final details and touches that make your cake look professionally finished.'],
    ['Store & transport', 'Storage and transport guidance', 'Learn how to store your cake and get it home safely — boxed up and ready to show off.']
  ];
  const list = $('#steps'), svg = $('#jsvg'); if (!list) return;
  list.innerHTML = STEPS.map((s, i) => `<li class="jstep" data-i="${i}"><button type="button" aria-expanded="false"><span class="n"><span>${i + 1}</span></span><span class="t">${s[1]}</span></button><div class="d"><p>${s[2]}</p></div></li>`).join('');

  // piping pearls along top & bottom edge
  const pip = $('#piping'); let p = '';
  for (let x = 112; x <= 288; x += 12) p += `<circle cx="${x}" cy="${320}" r="6.5" fill="#fffaf0" stroke="#e3a2ae" stroke-width="1.2"/>`;
  for (let x = 112; x <= 288; x += 12) p += `<circle cx="${x}" cy="${184}" r="5.5" fill="#f2c9cf" stroke="#d98e9b" stroke-width="1"/>`;
  [140, 200, 260].forEach(x => { for (let k = 0; k < 5; k++){ const a = k / 5 * Math.PI * 2; p += `<circle cx="${x + Math.cos(a) * 7}" cy="${270 + Math.sin(a) * 7}" r="5" fill="#fffaf0" stroke="#d98e9b" stroke-width=".8"/>`; } p += `<circle cx="${x}" cy="270" r="3" fill="#e9d08f"/>`; });
  pip.innerHTML = p;

  const layers = $$('[data-from]', svg), top = $('#topLayer'), dome = $('#dome'), cut = $('#cutline'), knife = $('#knife');
  let cur = 0, timer = null;
  function show(i){
    cur = i;
    layers.forEach(l => { const on = +l.dataset.from <= i; l.style.opacity = on ? 1 : 0; l.style.transform = on ? '' : 'translateY(-14px)'; });
    top.style.transform = i === 0 ? 'translateY(-46px)' : '';
    dome.style.opacity = i === 0 ? 1 : 0; cut.style.opacity = i === 0 ? 1 : 0;
    knife.style.opacity = i === 0 ? 1 : 0; knife.style.transform = i === 0 ? 'translate(0,-46px)' : 'translate(60px,-46px)';
    $$('.jstep', list).forEach((li, k) => { li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); $('button', li).setAttribute('aria-expanded', k === i); });
    $('#jNum').textContent = i + 1; $('#jName').textContent = STEPS[i][0];
    $('#jBar').style.width = ((i + 1) / STEPS.length * 100) + '%';
  }
  const stop = () => { clearInterval(timer); timer = null; $('#jPlay').innerHTML = '<svg width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; $('#jPlay').setAttribute('aria-label','Play all steps'); };
  const play = () => {
    if (cur === STEPS.length - 1) show(0);
    $('#jPlay').innerHTML = '<svg width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'; $('#jPlay').setAttribute('aria-label','Pause');
    timer = setInterval(() => { if (cur >= STEPS.length - 1){ stop(); const r = svg.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 3); return; } show(cur + 1); }, 2200);
  };
  $('#jPlay').addEventListener('click', () => timer ? stop() : play());
  $('#jNext').addEventListener('click', () => { stop(); show(Math.min(cur + 1, STEPS.length - 1)); });
  $('#jPrev').addEventListener('click', () => { stop(); show(Math.max(cur - 1, 0)); });
  list.addEventListener('click', e => { const li = e.target.closest('.jstep'); if (li){ stop(); show(+li.dataset.i); } });
  show(0);
  // auto-play once when the section first comes into view
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting){ io.disconnect(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play(); } }, {threshold:.5});
  io.observe(svg);
})();

/* ---- What's included: pop in & tick one by one ---- */
(() => {
  const grid = $('#boxGrid'); if (!grid) return;
  const items = $$('.box-item', grid);
  const io = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return; io.disconnect();
    items.forEach((it, i) => {
      setTimeout(() => it.classList.add('in'), i * 110);
      setTimeout(() => { it.classList.add('checked'); $('#boxN').textContent = i + 1; }, 500 + i * 260);
    });
  }, {threshold:.2});
  io.observe(grid);
})();

/* ---- Booking: places × £95 → pre-written WhatsApp ---- */
(() => {
  const out = $('#seats'); if (!out) return;
  const PRICE = 95; let n = 1;
  const upd = () => {
    out.textContent = n;
    const t = $('#total'); t.textContent = '£' + (n * PRICE); t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump');
    const msg = `Hi Mama's Cakes & Bakes! 🎂\nI'd like to reserve ${n} place${n > 1 ? 's' : ''} on the Cake Decorating Class in Slough (£${PRICE} per person).\nWhen is the next available date?`;
    $('#bookWa').href = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(msg)}`;
  };
  $('#plus').addEventListener('click', () => { n = Math.min(n + 1, 10); upd(); });
  $('#minus').addEventListener('click', () => { n = Math.max(n - 1, 1); upd(); });
  upd(); $('#total').classList.remove('bump');
})();
