/* Gallery: filters, search, progressive loading, lightbox */
(() => {
  const SRC = window.GALLERY || [];
  /* mix categories so 'All cakes' feels varied (round-robin across collections) */
  const buckets = Object.keys(CATS).map(k => SRC.filter(x => x.cat === k));
  const ALL = []; for (let i = 0; ALL.length < SRC.length; i++) buckets.forEach(b => b[i] && ALL.push(b[i]));
  const grid = $('#grid'), more = $('#more'), empty = $('#empty'), q = $('#q');
  const PAGE = 24;
  let cat = (location.hash || '#all').slice(1), shown = PAGE, list = [];
  if (cat !== 'all' && !CATS[cat]) cat = 'all';

  /* filter chips with counts */
  const fw = $('#filters');
  const mkF = (k, label, n) => `<button class="filter" role="tab" data-cat="${k}">${label}<sup>${n}</sup></button>`;
  fw.innerHTML = mkF('all','All cakes',ALL.length) + Object.entries(CATS).map(([k,c]) => mkF(k, c.name, ALL.filter(x => x.cat === k).length)).join('');
  fw.addEventListener('click', e => {
    const b = e.target.closest('.filter'); if (!b) return;
    cat = b.dataset.cat; history.replaceState(null,'', cat === 'all' ? location.pathname : '#'+cat);
    shown = PAGE; render(true);
    b.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
  });
  let qt; q.addEventListener('input', () => { clearTimeout(qt); qt = setTimeout(() => { shown = PAGE; render(true); }, 180); });

  function render(scrollUp){
    $$('.filter', fw).forEach(b => { const on = b.dataset.cat === cat; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    const term = q.value.trim().toLowerCase();
    list = ALL.filter(x => (cat === 'all' || x.cat === cat) && (!term || (x.title + ' ' + CATS[x.cat].name).toLowerCase().includes(term)));
    grid.innerHTML = '';
    list.slice(0, shown).forEach((x, i) => grid.appendChild(tile(x, i)));
    observeReveal(grid);
    empty.style.display = list.length ? 'none' : 'block';
    more.parentElement.style.display = list.length > shown ? 'flex' : 'none';
    more.textContent = `Show more cakes (${list.length - shown} left)`;
    if (scrollUp && window.scrollY > grid.offsetTop) window.scrollTo({top: grid.offsetTop - 160, behavior:'smooth'});
  }
  function tile(x, i){
    const a = document.createElement('a');
    a.className = 'tile'; a.href = 'images/gallery/' + x.file; a.dataset.i = i;
    a.style.transitionDelay = (i % PAGE % 8) * 60 + 'ms';
    a.innerHTML = `<img src="images/thumbs/${x.file}" alt="${x.title}" loading="lazy">
      <span class="zoom"><svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg></span>
      <span class="cap"><small>${CATS[x.cat].name}</small><b>${x.title}</b></span>`;
    a.addEventListener('click', e => { e.preventDefault(); open(i); });
    return a;
  }
  more.addEventListener('click', () => {
    const start = shown; shown += PAGE;
    list.slice(start, shown).forEach((x, k) => grid.appendChild(tile(x, start + k)));
    observeReveal(grid);
    more.parentElement.style.display = list.length > shown ? 'flex' : 'none';
    more.textContent = `Show more cakes (${list.length - shown} left)`;
  });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (CATS[h] || h === 'all'){ cat = h; shown = PAGE; render(true); } });

  /* Lightbox */
  const lb = $('#lb'), img = $('#lbImg'), th = $('#lbThumbs'); let cur = 0;
  function open(i){ cur = i; lb.classList.add('open'); document.body.style.overflow = 'hidden'; show(); }
  function close(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
  function show(){
    const x = list[cur]; img.classList.add('swap');
    const pre = new Image(); pre.onload = () => { img.src = pre.src; img.alt = x.title; img.classList.remove('swap'); }; pre.src = 'images/gallery/' + x.file;
    $('#lbTitle').textContent = x.title; $('#lbCat').textContent = CATS[x.cat].name;
    $('#lbCount').textContent = `${String(cur+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}`;
    $('#lbAsk').href = 'contact.html?ref=' + encodeURIComponent(x.file);
    const from = Math.max(0, Math.min(cur - 7, list.length - 15));
    th.innerHTML = list.slice(from, from + 15).map((t,k) => `<img src="images/thumbs/${t.file}" data-i="${from+k}" class="${from+k===cur?'on':''}" alt="">`).join('');
    [cur+1, cur-1].forEach(n => { if (list[n]) new Image().src = 'images/gallery/' + list[n].file; });
  }
  const go = d => { cur = (cur + d + list.length) % list.length; show(); };
  $('#lbNext').onclick = () => go(1); $('#lbPrev').onclick = () => go(-1); $('#lbClose').onclick = close;
  th.addEventListener('click', e => { const t = e.target.closest('img'); if (t){ cur = +t.dataset.i; show(); } });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  let sx = null; lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
  lb.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); sx = null; });

  render(false);
})();
