/* Home page interactions */
const G = window.GALLERY || [];
const byFile = f => G.find(x => x.file === f) || {file:f, title:'', cat:'birthday'};

/* ---- Hero deck of cards ---- */
(() => {
  const deck = $('#deck'); if (!deck) return;
  const picks = ['cake-035.jpg','cake-012.jpg','cake-084.jpg','cake-071.jpg','cake-052.jpg','cake-070.jpg','cake-085.jpg'];
  const dots = $('.deck-dots', deck);
  const cards = picks.map((f,i) => {
    const d = byFile(f);
    const fig = document.createElement('figure'); fig.className = 'deck-card';
    fig.innerHTML = `<img src="images/thumbs/${f}" alt="${d.title}" ${i>2?'loading="lazy"':''}><figcaption>${d.title}</figcaption>`;
    deck.appendChild(fig); dots.appendChild(document.createElement('i'));
    return fig;
  });
  let order = cards.map((_,i) => i), mx = 0, my = 0;
  const layout = () => {
    order.forEach((ci, pos) => {
      const c = cards[ci];
      const rot = [0, 7, -7, 12, -12, 0, 0][pos] || 0;
      const tx = [0, 26, -26, 44, -44, 0, 0][pos] || 0;
      const z = cards.length - pos;
      c.style.zIndex = z;
      c.style.opacity = pos > 4 ? 0 : 1;
      c.style.filter = pos ? `brightness(${1 - pos*.12})` : '';
      c.style.transform = `translate(-50%,-50%) translate(${tx + (pos===0?mx*18:mx*6)}%, ${pos*2 + (pos===0?my*10:0)}%) rotate(${rot + (pos===0?mx*4:0)}deg) scale(${1 - pos*.05}) rotateY(${pos===0?mx*10:0}deg) rotateX(${pos===0?-my*10:0}deg)`;
    });
    $$('i', dots).forEach((d,i) => d.classList.toggle('on', i === order[0]));
  };
  const next = () => { order.push(order.shift()); layout(); };
  deck.addEventListener('click', e => { if (e.target.closest('.deck-card')) { next(); restart(); } });
  deck.addEventListener('mousemove', e => {
    const r = deck.getBoundingClientRect();
    mx = ((e.clientX - r.left)/r.width - .5); my = ((e.clientY - r.top)/r.height - .5); layout();
  });
  deck.addEventListener('mouseleave', () => { mx = my = 0; layout(); });
  let timer; const restart = () => { clearInterval(timer); timer = setInterval(next, 3800); };
  layout(); restart();
  // swipe
  let sx = null; deck.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
  deck.addEventListener('touchend', e => { if (sx !== null && Math.abs(e.changedTouches[0].clientX - sx) > 40){ next(); restart(); } sx = null; });
})();

/* ---- Counters ---- */
const countIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; countIO.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || ''; const t0 = performance.now();
  (function f(t){ const p = Math.min(1,(t - t0)/1600), v = Math.round(end * (1 - Math.pow(1-p,3)));
    el.textContent = v + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(f); })(t0);
}), {threshold:.6});
$$('[data-count]').forEach(el => countIO.observe(el));

/* ---- Marquee ---- */
(() => {
  const m = $('#marquee'); if (!m) return;
  const words = ['Birthday cakes','Christenings','Holy Communions','Weddings','Baby showers','Anniversaries','Cupcakes','Number cakes','Themed kids cakes','Decorating classes'];
  m.innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join('');
})();

/* ---- Occasion cards (with 3D tilt) ---- */
(() => {
  const wrap = $('#occasions'); if (!wrap) return;
  const covers = {birthday:'cake-035.jpg', kids:'cake-085.jpg', christening:'cake-083.jpg', celebration:'cake-071.jpg', floral:'cake-001.jpg', treats:'cake-096.jpg'};
  Object.entries(CATS).forEach(([k,c], i) => {
    const n = G.filter(g => g.cat === k).length;
    const a = document.createElement('a'); a.href = `gallery.html#${k}`; a.className = 'occ reveal'; a.dataset.d = (i%3)+1;
    a.innerHTML = `<img src="images/thumbs/${covers[k]}" alt="${c.name}" loading="lazy"><span class="count">${n} cakes</span>
      <div class="occ-body"><h3>${c.name}</h3><p>${c.blurb}</p>
      <span class="arrow"><svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg></span></div>`;
    if (matchMedia('(hover:hover)').matches){
      a.addEventListener('mousemove', e => { const r = a.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
        a.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`; });
      a.addEventListener('mouseleave', () => a.style.transform = '');
    }
    wrap.appendChild(a); revealIO.observe(a);
  });
})();

/* ---- Featured carousel: drag, buttons, progress ---- */
(() => {
  const car = $('#carousel'); if (!car) return;
  const picks = ['cake-084.jpg','cake-058.jpg','cake-061.jpg','cake-035.jpg','cake-052.jpg','cake-018.jpg','cake-070.jpg','cake-044.jpg','cake-083.jpg','cake-085.jpg','cake-042.jpg','cake-094.jpg','cake-054.jpg','cake-075.jpg'];
  car.innerHTML = picks.map(f => { const d = byFile(f);
    return `<a class="slide" href="gallery.html#${d.cat}" draggable="false"><img src="images/thumbs/${f}" alt="${d.title}" loading="lazy" draggable="false"><figcaption><small>${CATS[d.cat].name}</small>${d.title}</figcaption></a>`; }).join('');
  const prog = $('#carProg');
  const upd = () => { const max = car.scrollWidth - car.clientWidth; prog.style.width = (max ? (car.scrollLeft/max)*100 : 0) + '%'; };
  car.addEventListener('scroll', upd, {passive:true}); upd();
  $$('.car-btn').forEach(b => b.addEventListener('click', () => car.scrollBy({left: +b.dataset.dir * car.clientWidth * .7, behavior:'smooth'})));
  let down = false, sx, sl, moved = false;
  car.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = car.scrollLeft; });
  window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5){ moved = true; car.classList.add('dragging'); } car.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', () => { down = false; setTimeout(() => car.classList.remove('dragging'), 30); });
  car.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);
})();

/* ---- Cake builder ---- */
(() => {
  const stage = $('#stage'); if (!stage) return;
  const st = {tiers:2, color:'#f7efdc', deco:'drip', topper:'Happy Birthday'};
  const shade = (hex, amt) => { const n = parseInt(hex.slice(1),16); let r=(n>>16)+amt,g=(n>>8&255)+amt,b=(n&255)+amt;
    r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b)); return `rgb(${r},${g},${b})`; };
  const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const draw = () => {
    const widths = [260, 200, 144], heights = [110, 96, 84];
    let y = 380, svg = '';
    // board + stand
    svg += `<ellipse cx="200" cy="392" rx="170" ry="20" fill="#e4d6bd"/><ellipse cx="200" cy="386" rx="165" ry="18" fill="#fff" stroke="#e6dcc9"/>`;
    const tops = [];
    for (let i = 0; i < st.tiers; i++){
      const w = widths[i + (3 - st.tiers > 0 && st.tiers===1 ? 0 : 0)], h = heights[i];
      const x = 200 - w/2; const top = y - h;
      const c = st.color, dk = shade(c,-22), lt = shade(c,18);
      svg += `<g class="tier" style="animation:none">
        <rect x="${x}" y="${top}" width="${w}" height="${h}" rx="6" fill="url(#g${i})"/>
        <ellipse cx="200" cy="${top}" rx="${w/2}" ry="11" fill="${lt}"/>
        <ellipse cx="200" cy="${y}" rx="${w/2}" ry="11" fill="${dk}" opacity=".35"/>
        <defs><linearGradient id="g${i}" x1="0" x2="1"><stop offset="0" stop-color="${dk}"/><stop offset=".35" stop-color="${lt}"/><stop offset=".7" stop-color="${c}"/><stop offset="1" stop-color="${dk}"/></linearGradient></defs>`;
      // piping border
      for (let px = x + 8; px < x + w - 4; px += 14) svg += `<circle cx="${px}" cy="${y - 4}" r="6" fill="${lt}" stroke="${dk}" stroke-width=".6"/>`;
      // decoration per tier
      if (st.deco === 'drip'){
        let d = `M${x} ${top}`; for (let px = x; px <= x + w; px += 18){ const len = 12 + ((px*7)%26); d += ` L${px} ${top} Q${px+4} ${top+len+6} ${px+9} ${top+len} Q${px+13} ${top+len-8} ${px+18} ${top}`; }
        svg += `<path d="${d} Z" fill="#d4b057" opacity=".95"/><ellipse cx="200" cy="${top}" rx="${w/2}" ry="11" fill="#e2c46e"/>`;
      } else if (st.deco === 'pearls'){
        for (let px = x + 10; px < x + w - 6; px += 16){ const py = top + 24 + Math.sin((px-x)/w*Math.PI)*22;
          svg += `<circle cx="${px}" cy="${py}" r="4.5" fill="#fff" stroke="#d9cfbf"/><circle cx="${px-1.4}" cy="${py-1.4}" r="1.3" fill="#fff"/>`; }
      } else if (st.deco === 'flowers'){
        const fx = [x + w*.18, x + w*.82], cols = ['#d98e9b','#f2c9cf','#fff'];
        fx.forEach((cx,k) => { const cy = top + h*.5 + (k?8:-4);
          for (let p=0;p<6;p++){ const a = p/6*Math.PI*2; svg += `<ellipse cx="${cx+Math.cos(a)*9}" cy="${cy+Math.sin(a)*9}" rx="8" ry="6" transform="rotate(${a*57} ${cx+Math.cos(a)*9} ${cy+Math.sin(a)*9})" fill="${cols[(i+k)%3]}" stroke="#c9788a" stroke-width=".5"/>`; }
          svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="#e2c46e"/><path d="M${cx+10} ${cy+6} q14 6 20 -4" stroke="#8aa77a" stroke-width="3" fill="none"/>`; });
      } else if (st.deco === 'berries'){
        const count = Math.floor(w/26);
        for (let k=0;k<count;k++){ const bx = x + 14 + k*(w-28)/(count-1||1); const by = top - 4 + (k%2)*3;
          svg += k%3===0 ? `<path d="M${bx-7} ${by-6} q7 -6 14 0 q-2 12 -7 14 q-5 -2 -7 -14z" fill="#d6283d"/><path d="M${bx-5} ${by-7} l5 -4 l5 4" stroke="#4d7a3a" stroke-width="2" fill="none"/>`
            : `<circle cx="${bx}" cy="${by}" r="6" fill="${k%3===1?'#3b2a5a':'#7a1f2b'}"/><circle cx="${bx-2}" cy="${by-2}" r="1.6" fill="#fff" opacity=".6"/>`; }
      }
      svg += `</g>`;
      tops.push(top); y = top - 2;
    }
    // topper
    const tTop = tops[tops.length-1];
    if (st.topper.trim()){
      svg += `<g><line x1="186" y1="${tTop-6}" x2="186" y2="${tTop-40}" stroke="#b8923d" stroke-width="2"/><line x1="214" y1="${tTop-6}" x2="214" y2="${tTop-40}" stroke="#b8923d" stroke-width="2"/>
        <text x="200" y="${tTop-46}" text-anchor="middle" font-family="Great Vibes, cursive" font-size="${st.topper.length>12?34:44}" fill="url(#goldT)" stroke="#9a7630" stroke-width=".5">${esc(st.topper)}</text></g>`;
    }
    stage.innerHTML = `<svg viewBox="0 0 400 420" role="img" aria-label="Your cake preview"><defs><linearGradient id="goldT" x1="0" x2="1"><stop offset="0" stop-color="#9a7630"/><stop offset=".4" stop-color="#e9d08f"/><stop offset="1" stop-color="#b8923d"/></linearGradient></defs>
      <g style="transform-origin:200px 400px;animation:pop .6s cubic-bezier(.2,.8,.2,1)">${svg}</g></svg>`;
    // update link
    const colName = $(`.swatch[data-v="${st.color}"]`)?.getAttribute('aria-label') || '';
    const idea = `${st.tiers}-tier ${colName.toLowerCase()} cake with ${$(`[data-opt=deco] .chip.on`).textContent.toLowerCase()}${st.topper.trim()?`, topper: "${st.topper.trim()}"`:''}`;
    $('#sendIdea').href = 'contact.html?idea=' + encodeURIComponent(idea);
  };
  const style = document.createElement('style'); style.textContent = '@keyframes pop{from{transform:scale(.94);opacity:.4}}'; document.head.appendChild(style);
  $$('[data-opt]').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    $$('[data-v]', g).forEach(x => x.classList.toggle('on', x === b));
    st[g.dataset.opt] = g.dataset.opt === 'tiers' ? +b.dataset.v : b.dataset.v; draw();
  }));
  $('#topper').addEventListener('input', e => { st.topper = e.target.value; draw(); });
  draw();
})();

/* ---- Instagram strip ---- */
(() => {
  const w = $('#insta'); if (!w) return;
  ['cake-042.jpg','cake-085.jpg','cake-015.jpg','cake-052.jpg','cake-061.jpg','cake-096.jpg'].forEach(f => {
    const d = byFile(f);
    w.insertAdjacentHTML('beforeend', `<a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="See more on Instagram"><img src="images/thumbs/${f}" alt="${d.title}" loading="lazy"></a>`);
  });
})();
