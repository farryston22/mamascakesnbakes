/* Mama's Cakes & Bakes — shared interactions */
const SITE = {
  phone: '07404103289',
  phoneIntl: '447404103289',
  email: 'mamascakesnbakes@gmail.com',
  instagram: 'https://www.instagram.com/mamas_cakes_n_bakes/',
  facebook: 'https://www.facebook.com/search/top?q=Mama%27s%20cakes%20and%20bakes'
};
const CATS = {
  birthday:   {name:'Birthdays',               blurb:'Show-stopping centrepieces for every age.'},
  kids:       {name:'Kids & Themed',           blurb:'Characters, colours and pure party joy.'},
  christening:{name:'Christening & Communion', blurb:'Graceful designs for sacred milestones.'},
  celebration:{name:'Weddings & Celebrations', blurb:'Anniversaries, showers, weddings & more.'},
  floral:     {name:'Floral & Elegant',        blurb:'Painted petals and pressed blooms.'},
  treats:     {name:'Cupcakes & Treats',       blurb:'Cupcakes, number cakes and sweet bites.'}
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Preloader */
window.addEventListener('load', () => {
  setTimeout(() => {
    $('.preloader')?.classList.add('done');
    document.body.classList.add('loaded');
  }, 350);
});
setTimeout(() => { $('.preloader')?.classList.add('done'); document.body.classList.add('loaded'); }, 3500);

/* Header state + back-to-top */
const header = $('.site-header');
const toTop = $('.to-top');
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 40);
  toTop?.classList.toggle('show', y > 700);
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
toTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* Mobile menu */
$('.burger')?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  $('.burger').setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('menu-open'); document.body.style.overflow = '';
}));

/* Scroll reveal */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
function observeReveal(root = document){ $$('.reveal, .tile', root).forEach(el => revealIO.observe(el)); }
observeReveal();

/* Year */
$$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

/* Gold glitter sparkles (matches the brand's glitter backdrop) */
function sparkles(canvas){
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, parts = [], mouse = {x:-999, y:-999};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(Math.min(140, w * h / 9000));
    parts = Array.from({length:n}, () => mk(true));
  };
  const mk = (init) => ({
    x: Math.random()*w, y: init ? Math.random()*h : h + 10,
    r: Math.random()*2.4 + .4, vy: -(Math.random()*.35 + .08), vx: (Math.random()-.5)*.15,
    a: Math.random()*.7 + .2, tw: Math.random()*Math.PI*2, bokeh: Math.random() < .12
  });
  canvas.parentElement.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
  const tick = () => {
    ctx.clearRect(0,0,w,h);
    for (const p of parts){
      p.tw += .04; p.x += p.vx; p.y += p.vy;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx,dy);
      if (d < 120){ p.x += dx/d*1.6; p.y += dy/d*1.6; }
      if (p.y < -10) Object.assign(p, mk(false));
      const al = p.a * (.55 + .45*Math.sin(p.tw));
      if (p.bokeh){
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*9);
        g.addColorStop(0,`rgba(233,208,143,${al*.35})`); g.addColorStop(1,'rgba(233,208,143,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*9,0,7); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(233,208,143,${al})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill();
        if (p.r > 2){ ctx.strokeStyle = `rgba(255,240,200,${al*.6})`; ctx.lineWidth=.6;
          ctx.beginPath(); ctx.moveTo(p.x-p.r*3,p.y); ctx.lineTo(p.x+p.r*3,p.y); ctx.moveTo(p.x,p.y-p.r*3); ctx.lineTo(p.x,p.y+p.r*3); ctx.stroke(); }
      }
    }
    if (!still) requestAnimationFrame(tick);
  };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize(); window.addEventListener('resize', resize);
  tick();
}
sparkles($('#sparkles'));

/* Custom cursor ring (pointer devices only) */
if (matchMedia('(hover:hover) and (pointer:fine)').matches){
  const dot = document.createElement('div'); dot.className = 'cursor-dot'; document.body.appendChild(dot);
  let x=0,y=0,tx=0,ty=0;
  window.addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; dot.style.opacity=1; });
  document.addEventListener('mouseleave', () => dot.style.opacity = 0);
  (function loop(){ x+=(tx-x)*.2; y+=(ty-y)*.2; dot.style.transform=`translate(${x-17}px,${y-17}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => dot.classList.toggle('big', !!e.target.closest('a,button,.tile,.deck-card,.swatch,.chip,.filter')));
  dot.style.transform = 'translate(-100px,-100px)';
}

/* Toast + confetti helpers */
function toast(msg){
  let t = $('.toast'); if (!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
function confetti(x = innerWidth/2, y = innerHeight/2){
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#c9a24b','#e9d08f','#f2c9cf','#1a1410','#a9d3e6','#fffdf8'];
  for (let i=0;i<70;i++){
    const c = document.createElement('i'); c.className='confetti';
    c.style.background = cols[i%cols.length]; c.style.borderRadius = Math.random()<.4?'50%':'2px';
    document.body.appendChild(c);
    const ang = Math.random()*Math.PI*2, v = 6+Math.random()*9;
    let vx = Math.cos(ang)*v, vy = Math.sin(ang)*v - 7, px = x, py = y, rot = 0, life = 0;
    (function f(){ life++; vy += .35; vx *= .98; px += vx; py += vy; rot += 12;
      c.style.transform = `translate(${px}px,${py}px) rotate(${rot}deg)`; c.style.opacity = 1 - life/110;
      if (life < 110) requestAnimationFrame(f); else c.remove(); })();
  }
}

/* Magnetic buttons */
$$('.btn').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width/2)*.18}px,${(e.clientY - r.top - r.height/2)*.3 - 3}px)`;
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

/* Share this page (native share sheet on phones, copy link elsewhere) */
$$('.share-fab, [data-share]').forEach(b => b.addEventListener('click', async () => {
  const url = location.href.split('?')[0], title = document.title;
  if (navigator.share){ try { await navigator.share({title, url}); } catch {} return; }
  try { await navigator.clipboard.writeText(url); toast('Link copied — ready to share ✓'); }
  catch { prompt('Copy this link:', url); }
}));
