/* Contact page: enquiry builder → WhatsApp / email */
(() => {
  const params = new URLSearchParams(location.search);
  const G = window.GALLERY || [];
  const form = $('#enquiry');

  /* occasion chips (single select) */
  let occasion = '';
  const occ = $('#occasion');
  occ.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return;
    const on = !b.classList.contains('on'); $$('.chip', occ).forEach(c => c.classList.remove('on'));
    b.classList.toggle('on', on); occasion = on ? b.textContent : ''; });
  if (params.get('occasion')){
    const b = $$('.chip', occ).find(c => c.textContent.toLowerCase() === params.get('occasion').toLowerCase());
    if (b){ b.classList.add('on'); occasion = b.textContent; }
  }

  /* guests slider */
  const g = $('#guests'), gv = $('#guestsVal');
  const upd = () => { gv.textContent = g.value >= 150 ? '150+' : g.value; g.style.background = ''; };
  g.addEventListener('input', upd); upd();

  /* min date = today */
  const d = $('#date'); d.min = new Date().toISOString().split('T')[0];

  /* reference cake from gallery / idea from builder */
  let ref = null;
  const refFile = params.get('ref');
  if (refFile){ ref = G.find(x => x.file === refFile); }
  if (ref){
    $('#refImg').src = 'images/thumbs/' + ref.file; $('#refTitle').textContent = ref.title; $('#refBox').classList.add('show');
    const map = {birthday:'Birthday', christening:'Christening', kids:'Birthday', treats:'Cupcakes'};
    if (!occasion && map[ref.cat]){ const b = $$('.chip', occ).find(c => c.textContent === map[ref.cat]); b?.classList.add('on'); occasion = b?.textContent || ''; }
  }
  $('#refClear').addEventListener('click', () => { ref = null; $('#refBox').classList.remove('show'); });
  if (params.get('idea')) $('#msg').value = 'My cake idea: ' + params.get('idea') + '\n';

  /* copy email */
  $('#copyEmail').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(SITE.email); toast('Email address copied ✓'); }
    catch { location.href = 'mailto:' + SITE.email; }
  });

  /* compose + send */
  let via = 'wa';
  $$('button[type=submit]', form).forEach(b => b.addEventListener('click', () => via = b.dataset.via));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name');
    if (!name.value.trim()){ name.classList.add('err'); name.focus(); toast('Please add your name'); return; }
    name.classList.remove('err');
    const date = d.value ? new Date(d.value + 'T12:00').toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'long', year:'numeric'}) : '';
    const lines = [
      `Hi Mama's Cakes & Bakes! 🎂`,
      ``,
      `Name: ${name.value.trim()}`,
      $('#phone').value && `Phone: ${$('#phone').value}`,
      $('#email').value && `Email: ${$('#email').value}`,
      occasion && `Occasion: ${occasion}`,
      date && `Date needed: ${date}`,
      `Guests: approx. ${gv.textContent}`,
      $('#flavour').value && `Flavour: ${$('#flavour').value}`,
      ref && `Inspired by: "${ref.title}" – ${new URL('images/gallery/' + ref.file, location.href).href}`,
      $('#msg').value.trim() && `\nDetails:\n${$('#msg').value.trim()}`
    ].filter(Boolean).join('\n');
    const r = e.submitter?.getBoundingClientRect?.();
    confetti(r ? r.left + r.width/2 : innerWidth/2, r ? r.top : innerHeight/2);
    setTimeout(() => {
      if (via === 'mail'){
        location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Cake enquiry' + (occasion ? ' – ' + occasion : '') + ' – ' + name.value.trim())}&body=${encodeURIComponent(lines)}`;
      } else {
        window.open(`https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
      }
      toast('Opening your message… just press send!');
    }, 450);
  });
})();
