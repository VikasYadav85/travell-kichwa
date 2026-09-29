/* Package detail page */
(() => {
  const { $, $$, esc, inr, params } = TK;
  const p = TK.pkg(params.get('id')) || null;

  if (!p) {
    $('#detail').innerHTML = `<div class="empty" style="margin:40px 0">
      <img src="assets/img/jeep.png" alt="">
      <h3>We couldn't find that trip</h3>
      <p>It may have been renamed or retired. Explore our current packages instead.</p>
      <a class="btn btn-primary" href="packages.html">Browse all packages</a></div>`;
    $('#similarWrap').remove(); $('#mbar').remove();
    return;
  }

  const d = TK.dest(p.dest);
  document.title = `${p.title} — ${p.nights}N/${p.days}D | Travell Kichwa`;
  document.body.classList.add('has-mbar');

  /* ---------- head ---------- */
  $('#crumbs').innerHTML = `<a href="index.html">Home</a><i class="ri-arrow-right-s-line"></i><a href="packages.html">Packages</a><i class="ri-arrow-right-s-line"></i><a href="packages.html?dest=${p.dest}">${esc(d.name)}</a><i class="ri-arrow-right-s-line"></i><span>${esc(p.title)}</span>`;
  $('#dBadges').innerHTML = [p.badge && `<span class="badge badge-brown"><i class="ri-fire-line"></i>${esc(p.badge)}</span>`, ...p.cats.map(c => `<span class="badge">${esc(c)}</span>`)].filter(Boolean).join('');
  $('#dTitle').textContent = p.title;
  $('#dMeta').innerHTML = `
    <span><i class="ri-map-pin-2-line"></i>${esc(p.places)}</span>
    <span><i class="ri-time-line"></i>${p.nights} Nights / ${p.days} Days</span>
    <span class="rating"><i class="ri-star-fill"></i>${p.rating} <span>· ${p.reviews} reviews</span></span>`;
  $('#dWish').dataset.wish = p.id;
  TK.wish.sync();

  /* ---------- gallery + lightbox ---------- */
  const photos = [p.cover, ...p.gallery];
  $('#gallery').innerHTML = photos.slice(0, 5).map((k, i) =>
    `<button type="button" data-lb="${i}" aria-label="Open photo ${i + 1}"><img src="${img(k, i === 0 ? 1280 : 960)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></button>`).join('')
    + `<button class="btn btn-light btn-sm" type="button" data-lb="0"><i class="ri-gallery-view-2"></i>View all ${photos.length} photos</button>`;
  let lbi = 0;
  const lb = $('#lightbox');
  const showLb = i => { lbi = (i + photos.length) % photos.length; $('#lbImg').src = img(photos[lbi], 1920); $('#lbCount').textContent = `${lbi + 1} / ${photos.length}`; };
  const openLb = i => { showLb(i); lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const closeLb = () => { lb.classList.remove('is-open'); document.body.style.overflow = ''; };
  $('#gallery').addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (b) openLb(+b.dataset.lb); });
  $('.lb-close').addEventListener('click', closeLb);
  $('.lb-prev').addEventListener('click', () => showLb(lbi - 1));
  $('.lb-next').addEventListener('click', () => showLb(lbi + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showLb(lbi - 1);
    if (e.key === 'ArrowRight') showLb(lbi + 1);
  });

  /* ---------- overview ---------- */
  $('#dAbout').innerHTML = p.about.map(t => `<p>${esc(t)}</p>`).join('');
  const f = p.facts;
  $('#dFacts').innerHTML = [
    ['ri-time-line', 'Duration', `${p.nights}N / ${p.days}D`],
    ['ri-group-line', 'Group size', f.group],
    ['ri-sun-line', 'Best time', f.best],
    ['ri-map-pin-line', 'Starts at', f.start],
    ['ri-speed-up-line', 'Difficulty', f.level],
    ['ri-customer-service-2-line', 'Support', '24×7 trip captain']
  ].map(([ic, k, v]) => `<div class="fact"><i class="${ic}"></i><div><small>${k}</small><strong>${esc(v)}</strong></div></div>`).join('');
  $('#dHighlights').innerHTML = p.highlights.map(h => `<li><i class="ri-checkbox-circle-fill"></i>${esc(h)}</li>`).join('');

  /* ---------- itinerary ---------- */
  $('#dItin').innerHTML = p.itinerary.map(([t, desc, meals, stay], i) => `
    <div class="day${i === 0 ? ' is-open' : ''}">
      <span class="day-num">${String(i + 1).padStart(2, '0')}</span>
      <button class="day-head" type="button" aria-expanded="${i === 0}">
        <span><small>Day ${i + 1}</small><strong>${esc(t)}</strong></span><i class="ri-arrow-down-s-line"></i>
      </button>
      <div class="day-body"><div>
        <p>${esc(desc)}</p>
        <div class="day-tags">
          ${meals && meals !== '—' ? `<span class="badge badge-outline"><i class="ri-restaurant-line"></i>${esc(meals)}</span>` : ''}
          ${stay && stay !== '—' ? `<span class="badge badge-outline"><i class="ri-hotel-bed-line"></i>${esc(stay)}</span>` : ''}
        </div>
      </div></div>
    </div>`).join('');
  $('#dItin').addEventListener('click', e => {
    const h = e.target.closest('.day-head'); if (!h) return;
    const day = h.closest('.day'); day.classList.toggle('is-open'); h.setAttribute('aria-expanded', day.classList.contains('is-open'));
    syncExpand();
  });
  const syncExpand = () => { $('#expandAll').textContent = $$('.day:not(.is-open)').length ? 'Expand all' : 'Collapse all'; };
  $('#expandAll').addEventListener('click', () => {
    const open = $$('.day:not(.is-open)').length > 0;
    $$('.day').forEach(dy => { dy.classList.toggle('is-open', open); dy.querySelector('.day-head').setAttribute('aria-expanded', open); });
    syncExpand();
  });

  /* ---------- inclusions ---------- */
  $('#dInc').innerHTML = p.inc.map(x => `<li><i class="ri-check-line"></i>${esc(x)}</li>`).join('');
  $('#dExc').innerHTML = p.exc.map(x => `<li><i class="ri-close-line"></i>${esc(x)}</li>`).join('');

  /* ---------- reviews ---------- */
  const p5 = Math.max(40, Math.min(92, Math.round((p.rating - 3.9) * 88)));
  const p4 = Math.round((100 - p5) * 0.72), p3 = Math.round((100 - p5 - p4) * 0.7), p2 = Math.round((100 - p5 - p4 - p3) * 0.7), p1 = Math.max(0, 100 - p5 - p4 - p3 - p2);
  $('#dRevSummary').innerHTML = `
    <div><div class="big-score">${p.rating}</div>${TK.stars(p.rating)}<br><small>${p.reviews} verified reviews</small></div>
    <div class="bars">${[[5, p5], [4, p4], [3, p3], [2, p2], [1, p1]].map(([s, v]) => `<div class="bar-row"><span>${s} ★</span><div class="bar"><span style="width:${v}%"></span></div><span>${v}%</span></div>`).join('')}</div>`;
  const start = TK.hash(p.id) % REVIEW_POOL.length;
  const months = ['2 weeks ago', '1 month ago', '2 months ago'];
  $('#dReviews').innerHTML = [0, 1, 2].map(k => {
    const r = REVIEW_POOL[(start + k * 2) % REVIEW_POOL.length];
    return `<div class="review">
      <div class="review-head"><span class="avatar c${k + 1}">${esc(TK.initials(r.name))}</span><div><strong>${esc(r.name)}</strong><small>${esc(r.city)} · ${months[k]}</small></div>${TK.stars(r.rating)}</div>
      <p>${esc(r.text.replace(/\{place\}/g, d.name))}</p></div>`;
  }).join('');

  /* ---------- FAQ ---------- */
  $('#dFaq').innerHTML = FAQS.map(([q, a], i) => `
    <div class="acc-item${i === 0 ? ' is-open' : ''}">
      <button class="acc-head" type="button" aria-expanded="${i === 0}">${esc(q)}<i class="ri-add-line"></i></button>
      <div class="acc-body"><div><p>${esc(a)}</p></div></div>
    </div>`).join('');

  /* ---------- booking card ---------- */
  const B = {
    date: params.get('date') && params.get('date') >= TK.minTravelDate() ? params.get('date') : TK.defaultTravelDate(),
    adults: Math.max(1, Math.min(20, +params.get('adults') || 2)),
    children: Math.max(0, Math.min(10, +params.get('children') || 0)),
    tier: TIERS.some(t => t.id === params.get('tier')) ? params.get('tier') : 'standard'
  };
  const dateInput = $('#bcDate');
  dateInput.min = TK.minTravelDate();
  dateInput.value = B.date;
  dateInput.addEventListener('change', () => { B.date = dateInput.value; });
  dateInput.closest('.bfield').addEventListener('click', e => { if (e.target !== dateInput && dateInput.showPicker) try { dateInput.showPicker(); } catch (err) { /* noop */ } });

  $('#bcAdults').innerHTML = TK.stepper('adults', B.adults, 1, 20);
  $('#bcChildren').innerHTML = TK.stepper('children', B.children, 0, 10);
  $('#bcPax').addEventListener('change', e => { if (e.detail) { B[e.detail.name] = e.detail.value; render(); } });

  $('#bcTier').innerHTML = TIERS.map(t => `<button type="button" data-tier="${t.id}">${t.name}<small>${inr(TK.tierPrice(p, t.id))}</small></button>`).join('');
  $('#bcTier').addEventListener('click', e => { const b = e.target.closest('[data-tier]'); if (b) { B.tier = b.dataset.tier; render(); } });

  $('#dTiers').innerHTML = TIERS.map(t => `
    <div class="tier">
      <span class="badge ${t.id === 'standard' ? 'badge-moss' : t.id === 'deluxe' ? '' : 'badge-brown'}">${t.id === 'standard' ? 'Best value' : t.id === 'deluxe' ? 'Most chosen' : 'Premium'}</span>
      <h3>${t.name}</h3><p>${t.note}</p>
      <strong>${inr(TK.tierPrice(p, t.id))} <span>/ person</span></strong>
      <button class="btn btn-soft btn-sm btn-block" type="button" data-pick-tier="${t.id}" style="margin-top:14px">Choose ${t.name}</button>
    </div>`).join('');
  $('#dTiers').addEventListener('click', e => {
    const b = e.target.closest('[data-pick-tier]'); if (!b) return;
    B.tier = b.dataset.pickTier; render();
    TK.toast(`${TK.tier(B.tier).name} stays selected`, 'success');
    if (window.innerWidth > 960) $('#bookCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  function render() {
    const adult = TK.tierPrice(p, B.tier), child = TK.childPrice(adult);
    const base = adult * B.adults + child * B.children;
    const total = Math.round(base * 1.05);
    $('#bcPrice').textContent = inr(adult);
    $('#bcOld').textContent = inr(Math.round(p.old * TK.tier(B.tier).mult));
    $('#bcSave').textContent = `Save ${TK.discountPct(p)}%`;
    $('#bcPaxBtn').textContent = TK.travellersLabel(B.adults, B.children);
    $$('#bcTier button').forEach(b => b.classList.toggle('is-active', b.dataset.tier === B.tier));
    $$('[data-pick-tier]').forEach(b => { const on = b.dataset.pickTier === B.tier; b.className = `btn ${on ? 'btn-primary' : 'btn-soft'} btn-sm btn-block`; b.innerHTML = on ? '<i class="ri-check-line"></i>Selected' : `Choose ${TK.tier(b.dataset.pickTier).name}`; });
    $('#bcLines').innerHTML = `
      <div><span>${inr(adult)} × ${TK.plural(B.adults, 'adult')}</span><span>${inr(adult * B.adults)}</span></div>
      ${B.children ? `<div><span>${inr(child)} × ${TK.plural(B.children, 'child', 'children')}</span><span>${inr(child * B.children)}</span></div>` : ''}
      <div><span>GST (5%)</span><span>${inr(total - base)}</span></div>`;
    $('#bcTotal').textContent = inr(total);
    $('#bcAdvance').innerHTML = `Reserve today with just <b>${inr(Math.round(total * 0.25))}</b> (25%)`;
    $('#mbPrice').textContent = inr(adult);
    $('#mbPer').textContent = `per person · ${TK.tier(B.tier).name}`;
  }
  render();

  function book() {
    if (!dateInput.value || dateInput.value < TK.minTravelDate()) {
      TK.toast('Please pick a travel date at least 3 days from today', 'error');
      dateInput.closest('.bfield').scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => dateInput.focus(), 300);
      return;
    }
    const q = new URLSearchParams({ id: p.id, date: dateInput.value, adults: B.adults, children: B.children, tier: B.tier });
    location.href = 'booking.html?' + q.toString();
  }
  $('#bcBook').addEventListener('click', book);
  $('#mbBook').addEventListener('click', book);
  $('#bcEnquire').addEventListener('click', () => TK.openEnquiry({ title: p.title, type: 'package', date: dateInput.value, pax: B.adults + B.children }));
  $('#bcPhone').href = `tel:${SITE.phoneRaw}`; $('#bcPhone').textContent = SITE.phone;
  $('#bcWa').href = TK.waLink(`Hi! I'm interested in "${p.title}" (${p.nights}N/${p.days}D).`);

  /* ---------- scrollspy ---------- */
  const links = $$('#tabsNav a');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      const act = $('#tabsNav a.is-active'), nav = $('#tabsNav'); if (act && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: act.offsetLeft - 16, behavior: 'smooth' });
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('.d-section').forEach(s => io.observe(s));
  }

  /* ---------- similar ---------- */
  const similar = PACKAGES.filter(x => x.id !== p.id)
    .map(x => ({ x, s: (x.region === p.region ? 2 : 0) + x.cats.filter(c => p.cats.includes(c)).length + (x.dest === p.dest ? 3 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.x);
  $('#similar').innerHTML = similar.map((x, i) => TK.pkgCard(x, { i })).join('');
  TK.wish.sync();
})();
