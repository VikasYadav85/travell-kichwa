/* Packages listing: filters, search, sort */
(() => {
  const { $, $$, esc, inr, params } = TK;
  const split = v => (v ? v.split(',').filter(Boolean) : []);

  const S = {
    q: params.get('q') || '',
    region: params.get('region') || '',
    dest: split(params.get('dest')),
    type: split(params.get('type')),
    dur: params.get('dur') || '',
    price: +params.get('price') || 0,
    rating: +params.get('rating') || 0,
    sort: params.get('sort') || 'popular'
  };
  // carry trip details through to the detail page
  const carry = ['date', 'adults', 'children'].filter(k => params.get(k)).map(k => `&${k}=${encodeURIComponent(params.get(k))}`).join('');

  const DUR = [['', 'Any length'], ['short', '1 – 3 days'], ['mid', '4 – 6 days'], ['long', '7+ days']];
  const RATE = [[0, 'Any rating'], [4.7, '4.7 & above'], [4.8, '4.8 & above'], [4.9, 'Exceptional · 4.9']];
  const TYPES = CATEGORIES.map(c => c.id);
  const POPULAR = ['ladakh-jeep-expedition', 'kashmir-paradise', 'kerala-backwaters', 'dubai-delights', 'bali-honeymoon', 'jim-corbett-jeep-safari',
    'royal-rajasthan', 'goa-beach-holiday', 'maldives-overwater', 'spiti-valley-road-trip', 'andaman-island-escape', 'manali-solang-escape',
    'thailand-phuket-krabi', 'rishikesh-rafting-camping', 'kenya-masai-mara', 'swiss-paris'];

  function match(p, s) {
    if (s.region && p.region !== s.region) return false;
    if (s.dest.length && !s.dest.includes(p.dest)) return false;
    if (s.type.length && !s.type.some(t => p.cats.includes(t))) return false;
    if (s.dur === 'short' && p.days > 3) return false;
    if (s.dur === 'mid' && (p.days < 4 || p.days > 6)) return false;
    if (s.dur === 'long' && p.days < 7) return false;
    if (s.price && p.price > s.price) return false;
    if (s.rating && p.rating < s.rating) return false;
    if (s.q) {
      const d = TK.dest(p.dest);
      const hay = [p.title, p.places, p.cats.join(' '), d && d.name, d && d.area, p.summary, p.highlights.join(' ')].join(' ').toLowerCase();
      if (!s.q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w))) return false;
    }
    return true;
  }

  /* ---------- filter UI ---------- */
  function renderFilters() {
    $$('#fRegion button').forEach(b => b.classList.toggle('is-active', b.dataset.v === S.region));

    const dests = DESTINATIONS.filter(d => !S.region || d.region === S.region);
    $('#fDest').innerHTML = dests.map(d => {
      const n = PACKAGES.filter(p => p.dest === d.slug && match(p, { ...S, dest: [] })).length;
      return `<label class="check"><input type="checkbox" value="${d.slug}"${S.dest.includes(d.slug) ? ' checked' : ''}>${esc(d.name)}<span class="n">${n}</span></label>`;
    }).join('');

    $('#fType').innerHTML = TYPES.map(t => {
      const n = PACKAGES.filter(p => p.cats.includes(t) && match(p, { ...S, type: [] })).length;
      return `<label class="check"><input type="checkbox" value="${t}"${S.type.includes(t) ? ' checked' : ''}>${t}<span class="n">${n}</span></label>`;
    }).join('');

    $('#fDur').innerHTML = DUR.map(([v, l]) => `<label class="check"><input type="radio" name="dur" value="${v}"${S.dur === v ? ' checked' : ''}>${l}</label>`).join('');
    $('#fRating').innerHTML = RATE.map(([v, l]) => `<label class="check"><input type="radio" name="rating" value="${v}"${S.rating === v ? ' checked' : ''}>${v ? `<i class="ri-star-fill" style="color:var(--amber)"></i>` : ''}${l}</label>`).join('');

    const r = $('#fPrice');
    r.value = S.price || r.max;
    paintRange();
  }
  function paintRange() {
    const r = $('#fPrice');
    const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty('--p', pct + '%');
    $('#fPriceVal').textContent = +r.value >= +r.max ? 'Any budget' : 'Up to ' + inr(r.value);
  }

  /* ---------- results ---------- */
  function sorted(list) {
    const l = [...list];
    if (S.sort === 'price-asc') l.sort((a, b) => a.price - b.price);
    else if (S.sort === 'price-desc') l.sort((a, b) => b.price - a.price);
    else if (S.sort === 'rating') l.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (S.sort === 'duration') l.sort((a, b) => a.days - b.days);
    else l.sort((a, b) => POPULAR.indexOf(a.id) - POPULAR.indexOf(b.id));
    return l;
  }

  function renderResults() {
    const list = sorted(PACKAGES.filter(p => match(p, S)));
    $('#resCount').innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? 'trip' : 'trips'} found${S.q ? ` for “${esc(S.q)}”` : ''}`;
    $('#applyCount').textContent = list.length;
    $('#results').innerHTML = list.length
      ? list.map((p, i) => TK.pkgCard(p, { i, query: carry })).join('')
      : `<div class="empty" style="grid-column:1/-1">
           <img src="assets/img/jeep.png" alt="">
           <h3>No trips match — yet</h3>
           <p>Try removing a filter or two. Or tell us what you're after and we'll design a custom trip for you.</p>
           <div class="btn-row" style="justify-content:center"><button class="btn btn-outline" type="button" data-reset>Reset filters</button><a class="btn btn-primary" href="plan.html"><i class="ri-route-line"></i>Plan a custom trip</a></div>
         </div>`;
    TK.wish.sync();
    renderActive();
    renderHero();
    syncURL();
  }

  function renderActive() {
    const tags = [];
    if (S.q) tags.push(['q', '', `“${S.q}”`]);
    if (S.region) tags.push(['region', '', S.region === 'intl' ? 'International' : 'India']);
    S.dest.forEach(d => tags.push(['dest', d, TK.dest(d)?.name || d]));
    S.type.forEach(t => tags.push(['type', t, t]));
    if (S.dur) tags.push(['dur', '', DUR.find(d => d[0] === S.dur)[1]]);
    if (S.price) tags.push(['price', '', 'Up to ' + inr(S.price)]);
    if (S.rating) tags.push(['rating', '', S.rating + '★ & above']);
    $('#activeFilters').innerHTML = tags.map(([k, v, l]) => `<span class="tag-x">${esc(l)}<button type="button" data-rm="${k}" data-v="${esc(v)}" aria-label="Remove ${esc(l)}"><i class="ri-close-line"></i></button></span>`).join('')
      + (tags.length > 1 ? `<button class="link-arrow" type="button" data-reset style="font-size:13px">Clear all</button>` : '');
  }

  function renderHero() {
    const single = S.dest.length === 1 ? TK.dest(S.dest[0]) : null;
    const key = single ? single.img : S.region === 'intl' ? 'dubai' : 'manali_leh_hwy';
    const want = img(key, 1920);
    if ($('#phImg').getAttribute('src') !== want) $('#phImg').src = want;
    if (single) {
      $('#phTitle').innerHTML = `${esc(single.name)} <span class="script">trips</span>`;
      $('#phSub').textContent = `${single.tagline}. Best time to visit: ${single.best}.`;
      $('#phCrumb').textContent = single.name;
      document.title = `${single.name} Tour Packages — Travell Kichwa`;
    } else {
      $('#phTitle').innerHTML = S.region === 'intl' ? 'International <span class="script">holidays</span>' : 'Tour <span class="script">packages</span>';
      $('#phSub').textContent = S.region === 'intl' ? 'Visa help, flights on request and handpicked stays — the world, sorted.' : 'Handcrafted trips across India and abroad — every route driven, every stay slept in by our team.';
      $('#phCrumb').textContent = 'Packages';
      document.title = 'Tour Packages — Travell Kichwa';
    }
  }

  function syncURL() {
    const p = new URLSearchParams();
    if (S.q) p.set('q', S.q);
    if (S.region) p.set('region', S.region);
    if (S.dest.length) p.set('dest', S.dest.join(','));
    if (S.type.length) p.set('type', S.type.join(','));
    if (S.dur) p.set('dur', S.dur);
    if (S.price) p.set('price', S.price);
    if (S.rating) p.set('rating', S.rating);
    if (S.sort !== 'popular') p.set('sort', S.sort);
    ['date', 'adults', 'children'].forEach(k => params.get(k) && p.set(k, params.get(k)));
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  function update() { renderFilters(); renderResults(); }

  /* ---------- events ---------- */
  $('#fRegion').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    S.region = b.dataset.v;
    S.dest = S.dest.filter(d => !S.region || TK.dest(d)?.region === S.region);
    update();
  });
  $('#fDest').addEventListener('change', e => { S.dest = $$('#fDest input:checked').map(i => i.value); update(); });
  $('#fType').addEventListener('change', e => { S.type = $$('#fType input:checked').map(i => i.value); update(); });
  $('#fDur').addEventListener('change', e => { S.dur = e.target.value; update(); });
  $('#fRating').addEventListener('change', e => { S.rating = +e.target.value; update(); });
  $('#fPrice').addEventListener('input', paintRange);
  $('#fPrice').addEventListener('change', e => { const v = +e.target.value; S.price = v >= +e.target.max ? 0 : v; update(); });
  let qt;
  $('#fQ').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { S.q = e.target.value.trim(); update(); }, 220); });
  $('#fSort').addEventListener('change', e => { S.sort = e.target.value; renderResults(); });

  document.addEventListener('click', e => {
    const c = e.target.closest('[data-clear]');
    if (c) { S[c.dataset.clear] = []; update(); }
    const rm = e.target.closest('[data-rm]');
    if (rm) {
      const k = rm.dataset.rm, v = rm.dataset.v;
      if (k === 'dest' || k === 'type') S[k] = S[k].filter(x => x !== v);
      else S[k] = (k === 'price' || k === 'rating') ? 0 : '';
      if (k === 'q') $('#fQ').value = '';
      update();
    }
    if (e.target.closest('[data-reset]')) {
      Object.assign(S, { q: '', region: '', dest: [], type: [], dur: '', price: 0, rating: 0 });
      $('#fQ').value = '';
      update();
    }
  });

  // mobile filters drawer
  const openF = () => { $('#filters').classList.add('is-open'); $('#scrim').classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const closeF = () => { $('#filters').classList.remove('is-open'); $('#scrim').classList.remove('is-open'); document.body.style.overflow = ''; };
  $('#openFilters').addEventListener('click', openF);
  $('#scrim').addEventListener('click', closeF);
  $$('[data-close-filters]').forEach(b => b.addEventListener('click', closeF));

  $('#fQ').value = S.q;
  $('#fSort').value = S.sort;
  update();
})();
