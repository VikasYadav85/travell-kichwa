/* Home page */
(() => {
  const { $, $$, esc, inr } = TK;

  /* ---------- Hero slideshow ---------- */
  const SLIDES = [
    ['ladakh_road', 'Zanskar Valley, Ladakh'],
    ['dal_lake', 'Dal Lake, Srinagar'],
    ['kerala_houseboat', 'Alleppey backwaters, Kerala'],
    ['camel_dunes', 'Thar Desert, Rajasthan']
  ];
  const media = $('#heroMedia'), dots = $('#heroDots'), place = $('#heroPlace');
  media.innerHTML = SLIDES.map(([k, label], i) =>
    `<div class="hero-slide${i === 0 ? ' is-active' : ''}"><img src="${img(k, 1920)}" alt="${esc(label)}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></div>`).join('');
  dots.innerHTML = SLIDES.map((s, i) => `<button type="button" aria-label="Show ${esc(s[1])}"${i === 0 ? ' class="is-active"' : ''}><span></span></button>`).join('');
  place.textContent = SLIDES[0][1];
  let cur = 0, timer;
  function go(n) {
    const slides = $$('.hero-slide', media), ds = $$('button', dots);
    slides[cur].classList.remove('is-active');
    cur = (n + SLIDES.length) % SLIDES.length;
    slides[cur].classList.add('is-active');
    ds.forEach((d, i) => { d.classList.toggle('is-active', i === cur); d.classList.toggle('is-done', i < cur); });
    place.textContent = SLIDES[cur][1];
    restart();
  }
  function restart() { clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 6500); }
  $$('button', dots).forEach((d, i) => d.addEventListener('click', () => go(i)));
  document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : restart()));
  restart();

  /* ---------- Search tabs ---------- */
  $$('.search-tab').forEach(t => t.addEventListener('click', () => {
    $$('.search-tab').forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', x === t); });
    $$('.search-form').forEach(f => f.classList.toggle('is-active', f.dataset.form === t.dataset.tab));
  }));

  // dates
  $$('.search-form input[type=date]').forEach(i => { i.min = TK.minTravelDate(); i.value = TK.defaultTravelDate(); });
  // open native picker when the whole field is clicked
  $$('.sf-field').forEach(f => f.addEventListener('click', e => {
    const d = f.querySelector('input[type=date]');
    if (d && e.target !== d && d.showPicker) { try { d.showPicker(); } catch (err) { d.focus(); } }
  }));

  /* ---------- Destination combobox ---------- */
  const destInput = $('#sfDest'), sug = $('#destSuggest');
  let hl = -1, items = [];
  function renderSuggest() {
    const q = destInput.value.trim().toLowerCase();
    const dests = DESTINATIONS.filter(d => !q || d.name.toLowerCase().includes(q) || d.area.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q));
    const pkgs = q ? PACKAGES.filter(p => p.title.toLowerCase().includes(q) || p.places.toLowerCase().includes(q)).slice(0, 4) : [];
    items = [...dests.slice(0, q ? 6 : 7).map(d => ({ type: 'dest', d })), ...pkgs.map(p => ({ type: 'pkg', p }))];
    hl = -1;
    if (!items.length) { sug.innerHTML = `<div class="suggest-empty">No matches — press <b>Search</b> to look everywhere, or <a class="link-arrow" href="plan.html">plan a custom trip</a>.</div>`; return; }
    let html = '', lastType = '';
    items.forEach((it, i) => {
      if (it.type !== lastType) { html += `<div class="suggest-head">${it.type === 'dest' ? (q ? 'Destinations' : 'Popular destinations') : 'Trips'}</div>`; lastType = it.type; }
      html += it.type === 'dest'
        ? `<button type="button" class="suggest-item" role="option" data-i="${i}"><img src="${img(it.d.img, 330)}" alt=""><span><strong>${esc(it.d.name)}</strong><small>${esc(it.d.area)} · ${TK.plural(TK.destPackages(it.d.slug).length, 'trip')}</small></span></button>`
        : `<button type="button" class="suggest-item" role="option" data-i="${i}"><img src="${img(it.p.cover, 330)}" alt=""><span><strong>${esc(it.p.title)}</strong><small>${it.p.nights}N/${it.p.days}D · from ${inr(it.p.price)}</small></span></button>`;
    });
    sug.innerHTML = html;
  }
  function openSuggest() { renderSuggest(); sug.classList.add('is-open'); destInput.setAttribute('aria-expanded', 'true'); }
  function closeSuggest() { sug.classList.remove('is-open'); destInput.setAttribute('aria-expanded', 'false'); }
  function pick(i) {
    const it = items[i]; if (!it) return;
    if (it.type === 'pkg') { location.href = `package.html?id=${it.p.id}`; return; }
    destInput.value = it.d.name; destInput.dataset.slug = it.d.slug; closeSuggest();
  }
  destInput.addEventListener('focus', openSuggest);
  destInput.addEventListener('input', () => { delete destInput.dataset.slug; openSuggest(); });
  destInput.addEventListener('keydown', e => {
    const btns = $$('.suggest-item', sug);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!sug.classList.contains('is-open')) openSuggest();
      hl = (hl + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
      btns.forEach((b, i) => b.classList.toggle('is-hl', i === hl));
      btns[hl]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && hl > -1 && sug.classList.contains('is-open')) { e.preventDefault(); pick(hl); }
    else if (e.key === 'Escape') closeSuggest();
  });
  sug.addEventListener('click', e => { const b = e.target.closest('.suggest-item'); if (b) pick(+b.dataset.i); });
  document.addEventListener('click', e => { if (!e.target.closest('#destField')) closeSuggest(); });

  /* ---------- Guests ---------- */
  const guests = { adults: 2, children: 0 };
  $('[data-guests]').addEventListener('change', e => {
    if (!e.detail) return;
    guests[e.detail.name] = e.detail.value;
    $('[data-guests-label]').textContent = TK.travellersLabel(guests.adults, guests.children);
  });

  /* ---------- Submit handlers ---------- */
  $('[data-form="tours"]').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, q = destInput.value.trim();
    const match = destInput.dataset.slug || (DESTINATIONS.find(d => d.name.toLowerCase() === q.toLowerCase()) || {}).slug;
    const p = new URLSearchParams();
    if (match) p.set('dest', match); else if (q) p.set('q', q);
    if (f.date.value) p.set('date', f.date.value);
    p.set('adults', guests.adults); if (guests.children) p.set('children', guests.children);
    if (f.dur.value) p.set('dur', f.dur.value);
    location.href = 'packages.html?' + p.toString();
  });

  const spotSel = $('#sfSpot');
  spotSel.innerHTML = SAFARIS.map(s => `<option value="${s.id}">${esc(s.name)} — ${esc(s.area.split('·')[0].trim())}</option>`).join('');
  $('[data-form="safari"]').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    location.href = `safari.html?spot=${f.spot.value}&date=${f.date.value}&slot=${f.slot.value}&pax=${f.pax.value}#book`;
  });

  $('#cityList').innerHTML = Object.keys(CITIES).map(c => `<option value="${c}">`).join('');
  $('#sfVehicle').innerHTML = VEHICLES.map(v => `<option value="${v.id}">${esc(v.name)} · ${v.seats} seats</option>`).join('');
  $('#sfVehicle').value = 'suv';
  $('[data-form="cabs"]').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    const p = new URLSearchParams({ tab: 'cabs', from: f.from.value.trim(), to: f.to.value.trim(), date: f.date.value, vehicle: f.vehicle.value });
    location.href = 'safari.html?' + p.toString() + '#book';
  });

  const monthSel = $('#sfMonth');
  const now = new Date();
  monthSel.innerHTML = '<option value="flexible">I\'m flexible</option>' + Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    return `<option value="${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}">${d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</option>`;
  }).join('');
  $('[data-form="custom"]').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target;
    const p = new URLSearchParams({ dest: f.dest.value.trim(), month: f.month.value, budget: f.budget.value });
    location.href = 'plan.html?' + p.toString();
  });

  /* ---------- Stats count-up ---------- */
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
      const tick = t => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = v.toLocaleString('en-IN') + suf; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Destinations ---------- */
  const FEATURED = { india: ['ladakh', 'kashmir', 'kerala', 'rajasthan', 'goa'], intl: ['dubai', 'bali', 'maldives', 'thailand', 'kenya'] };
  const destGrid = $('#destGrid');
  function renderDest(region) {
    destGrid.innerHTML = FEATURED[region].map((s, i) => TK.destTile(TK.dest(s), i)).join('');
  }
  $$('#destTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#destTabs button').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
    renderDest(b.dataset.region);
  }));
  renderDest('india');

  /* ---------- Packages ---------- */
  const CHIPS = [['all', 'All trips', 'ri-apps-2-line'], ['Adventure', 'Adventure', 'ri-landscape-line'], ['Honeymoon', 'Honeymoon', 'ri-hearts-line'], ['Family', 'Family', 'ri-parent-line'], ['Wildlife', 'Wildlife', 'ri-bear-smile-line'], ['Beach', 'Beach', 'ri-sun-line'], ['intl', 'International', 'ri-plane-line']];
  const chips = $('#pkgChips'), grid = $('#pkgGrid');
  chips.innerHTML = CHIPS.map(([k, l, ic], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-k="${k}"><i class="${ic}"></i>${l}</button>`).join('');
  function renderPkgs(k) {
    let list = PACKAGES;
    if (k === 'intl') list = PACKAGES.filter(p => p.region === 'intl');
    else if (k !== 'all') list = PACKAGES.filter(p => p.cats.includes(k));
    else list = ['ladakh-jeep-expedition', 'kashmir-paradise', 'kerala-backwaters', 'jim-corbett-jeep-safari', 'dubai-delights', 'bali-honeymoon'].map(TK.pkg);
    grid.innerHTML = list.slice(0, 6).map((p, i) => TK.pkgCard(p, { i })).join('');
    $('#allPkgLink').href = k === 'all' ? 'packages.html' : k === 'intl' ? 'packages.html?region=intl' : `packages.html?type=${encodeURIComponent(k)}`;
    TK.wish.sync();
  }
  chips.addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip', chips).forEach(x => x.classList.toggle('is-active', x === c));
    renderPkgs(c.dataset.k);
  });
  renderPkgs('all');

  /* ---------- Static images ---------- */
  $('#bandImg').src = img('gypsy_safari', 1280);
  $('#whyImg1').src = img('pangong', 1280);
  $('#whyImg2').src = img('kerala_backwater', 960);
  $('#offerImg').src = img('maldives', 1920);

  /* ---------- Countdown (ends at month end) ---------- */
  const end = (() => {
    const d = new Date(); let e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    if (e - d < 3 * 864e5) e = new Date(d.getFullYear(), d.getMonth() + 2, 0, 23, 59, 59);
    return e;
  })();
  $('#offerNote').textContent = 'Offer ends ' + end.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) + ' · T&C apply';
  const cdEls = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const tickCd = () => {
    const ms = Math.max(0, end - new Date());
    const v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 };
    Object.keys(v).forEach(k => { cdEls[k].textContent = String(v[k]).padStart(2, '0'); });
  };
  tickCd(); setInterval(tickCd, 1000);

  /* ---------- Testimonials ---------- */
  const track = $('#tTrack');
  track.innerHTML = TESTIMONIALS.map((t, i) => `
    <figure class="t-card">
      <i class="ri-double-quotes-l q" aria-hidden="true"></i>
      ${TK.stars(t.rating)}
      <blockquote style="margin:0"><p>${esc(t.text)}</p></blockquote>
      <figcaption class="t-person">
        <span class="avatar c${(i % 4) + 1}">${esc(TK.initials(t.name))}</span>
        <span><strong>${esc(t.name)}</strong><small>${esc(t.city)} · ${esc(t.trip)}</small></span>
      </figcaption>
    </figure>`).join('');
  const step = () => (track.querySelector('.t-card')?.offsetWidth || 300) + 20;
  $('#tPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#tNext').addEventListener('click', () => {
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  /* ---------- Instagram strip ---------- */
  const insta = `https://instagram.com/${SITE.instagram}`;
  $('#instaHandle').textContent = '@' + SITE.instagram;
  $('#instaLink').href = insta;
  $('#instaGrid').innerHTML = ['ladakh_road', 'maldives', 'camel_dunes', 'shikara', 'bali_temple', 'gypsy_safari']
    .map(k => `<a href="${insta}" target="_blank" rel="noopener" aria-label="Open Instagram"><img src="${img(k, 500)}" alt="" loading="lazy"><i class="ri-instagram-line"></i></a>`).join('');
  $('#ctaWa').href = TK.waLink('Hi! I want a custom trip plan.');
})();
