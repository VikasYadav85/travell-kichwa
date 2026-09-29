/* Jeep safari & cab rentals */
(() => {
  const { $, $$, esc, inr, params } = TK;
  $('#phImg').src = img('gypsy_safari', 1920);

  /* ---------- tabs ---------- */
  function showPane(name) {
    $$('#rideTabs button').forEach(b => { const on = b.dataset.pane === name; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    $$('.ride-layout').forEach(l => { l.hidden = l.dataset.pane !== name; });
    const u = new URL(location.href); if (name === 'cabs') u.searchParams.set('tab', 'cabs'); else u.searchParams.delete('tab');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
    window.dispatchEvent(new Event('resize'));
  }
  $('#rideTabs').addEventListener('click', e => { const b = e.target.closest('[data-pane]'); if (b) showPane(b.dataset.pane); });

  /* ---------- safari ---------- */
  const SF = {
    spot: SAFARIS.some(s => s.id === params.get('spot')) ? params.get('spot') : 'corbett',
    date: params.get('date') && params.get('date') >= TK.minTravelDate() ? params.get('date') : TK.defaultTravelDate(),
    slot: params.get('slot') || 'morning',
    pax: Math.max(1, Math.min(24, +params.get('pax') || 2))
  };
  const spot = () => SAFARIS.find(s => s.id === SF.spot);
  const slotsOf = s => s.slots || SAFARI_SLOTS;

  $('#spotGrid').innerHTML = SAFARIS.map((s, i) => `
    <article class="spot" data-spot="${s.id}" tabindex="0" role="button" aria-pressed="false" style="animation-delay:${i * 60}ms">
      <div class="spot-media"><img src="${img(s.img, 960)}" alt="${esc(s.name)}" loading="lazy"><span class="badge badge-glass">${esc(s.badge)}</span><span class="sel"><i class="ri-check-line"></i></span></div>
      <div class="spot-body">
        <h3>${esc(s.name)}</h3>
        <p class="muted" style="font-size:13.5px"><i class="ri-map-pin-2-line"></i> ${esc(s.area)}</p>
        <p>${esc(s.note)}</p>
        <div class="spot-meta"><strong>${inr(s.price)} <span>/ jeep · up to 6</span></strong><span class="badge badge-moss"><i class="ri-calendar-check-line"></i>${esc(s.season.replace(/^Open |^Best /, ''))}</span></div>
      </div>
    </article>`).join('');
  $('#sfPark').innerHTML = SAFARIS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
  $('#sfPax').innerHTML = TK.stepper('pax', SF.pax, 1, 24);
  const sfDate = $('#sfDate'); sfDate.min = TK.minTravelDate(); sfDate.value = SF.date;

  function renderSafari() {
    const s = spot();
    if (!slotsOf(s).some(x => x[0] === SF.slot)) SF.slot = slotsOf(s)[0][0];
    $$('.spot').forEach(el => { const on = el.dataset.spot === SF.spot; el.classList.toggle('is-selected', on); el.setAttribute('aria-pressed', on); });
    $('#sfPark').value = SF.spot;
    $('#sfSlots').innerHTML = slotsOf(s).map(([id, l, t]) => `<button type="button" class="slot${SF.slot === id ? ' is-active' : ''}" data-slot="${id}"><strong><i class="${/even|sunset/.test(id) ? 'ri-sun-foggy-line' : 'ri-sun-line'}"></i>${l}</strong><small>${t}</small></button>`).join('');
    const j = Math.ceil(SF.pax / 6), base = s.price * j, gst = Math.round(base * 0.05);
    $('#sfJeeps').textContent = `${TK.plural(j, 'jeep')} · age 5+`;
    $('#sfFare').innerHTML = `
      <div class="sum-line"><span>${inr(s.price)} × ${TK.plural(j, 'jeep')}</span><span>${inr(base)}</span></div>
      <div class="sum-line"><span>Permits &amp; naturalist</span><span style="color:var(--moss-d)">Included</span></div>
      <div class="sum-line"><span>GST (5%)</span><span>${inr(gst)}</span></div>
      <div class="fare-total"><span>Total</span><strong>${inr(base + gst)}</strong></div>`;
  }
  $('#spotGrid').addEventListener('click', e => {
    const c = e.target.closest('.spot'); if (!c) return;
    SF.spot = c.dataset.spot; renderSafari();
    if (window.innerWidth <= 960) $('#book').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#spotGrid').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.spot')) { e.preventDefault(); e.target.click(); } });
  $('#sfPark').addEventListener('change', e => { SF.spot = e.target.value; renderSafari(); });
  sfDate.addEventListener('change', () => { SF.date = sfDate.value; });
  $('#sfSlots').addEventListener('click', e => { const b = e.target.closest('[data-slot]'); if (b) { SF.slot = b.dataset.slot; renderSafari(); } });
  $('#sfPax').addEventListener('change', e => { if (e.detail) { SF.pax = e.detail.value; renderSafari(); } });
  $('#sfBook').addEventListener('click', () => {
    if (!sfDate.value || sfDate.value < TK.minTravelDate()) { TK.toast('Pick a safari date at least 3 days ahead', 'error'); sfDate.focus(); return; }
    location.href = `booking.html?${new URLSearchParams({ safari: SF.spot, date: sfDate.value, slot: SF.slot, pax: SF.pax })}`;
  });
  renderSafari();

  /* ---------- cabs ---------- */
  const CB = {
    vehicle: VEHICLES.some(v => v.id === params.get('vehicle')) ? params.get('vehicle') : 'suv',
    trip: ['oneway', 'round', 'local'].includes(params.get('trip')) ? params.get('trip') : 'oneway',
    from: params.get('from') || 'Delhi',
    to: params.get('to') || 'Manali',
    date: params.get('date') && params.get('date') >= TK.minTravelDate() ? params.get('date') : TK.defaultTravelDate(),
    days: 2
  };
  $('#vehicleGrid').innerHTML = VEHICLES.map((v, i) => `
    <article class="vehicle" data-vehicle="${v.id}" tabindex="0" role="button" aria-pressed="false" style="animation-delay:${i * 60}ms">
      <div class="vehicle-art">${v.jeep ? '<img src="assets/img/jeep.png" alt="">' : `<i class="${v.icon}"></i>`}${v.badge ? `<span class="badge badge-glass" style="position:absolute;top:12px;left:12px">${esc(v.badge)}</span>` : ''}</div>
      <div><h3>${esc(v.name)}</h3><p class="v-sub">${esc(v.model)}</p></div>
      <div class="v-specs"><span><i class="ri-user-3-line"></i>${v.seats} seats</span><span><i class="ri-suitcase-3-line"></i>${TK.plural(v.bags, 'bag')}</span><span><i class="ri-temp-cold-line"></i>${v.jeep ? 'Open-top' : 'AC'}</span></div>
      <div class="v-price"><strong>₹${v.rate} <span>/ km</span></strong><span class="sel-label"><i class="ri-checkbox-circle-fill"></i>Selected</span></div>
    </article>`).join('');
  $('#cbCities').innerHTML = Object.keys(CITIES).map(c => `<option value="${c}">`).join('');
  $('#cbDays').innerHTML = TK.stepper('days', CB.days, 1, 15);
  const cbFrom = $('#cbFrom'), cbTo = $('#cbTo'), cbDate = $('#cbDate');
  cbFrom.value = CB.from; cbTo.value = CB.to; cbDate.min = TK.minTravelDate(); cbDate.value = CB.date;

  function renderCab() {
    $$('.vehicle').forEach(el => { const on = el.dataset.vehicle === CB.vehicle; el.classList.toggle('is-selected', on); el.setAttribute('aria-pressed', on); });
    $$('#cbTrip button').forEach(b => b.classList.toggle('is-active', b.dataset.trip === CB.trip));
    $('#bookCab [data-when="to"]').hidden = CB.trip === 'local';
    $('#bookCab [data-when="days"]').hidden = CB.trip === 'oneway';
    const f = TK.cabFare({ vehicle: CB.vehicle, from: CB.from, to: CB.to, trip: CB.trip, days: CB.days });
    const gst = Math.round(f.total * 0.05);
    const note = CB.trip === 'local' ? `8 hr / 80 km per day in ${esc(CB.from || 'your city')}` : f.known ? `≈ ${f.km.toLocaleString('en-IN')} km by road${CB.trip === 'round' ? ' each way' : ''}` : 'Distance to be confirmed · 250 km/day minimum';
    $('#cbFare').innerHTML = `
      <div class="sum-line"><span><i class="ri-road-map-line"></i>${note}</span></div>
      ${f.lines.map(([k, v]) => `<div class="sum-line"><span>${esc(k)}</span><span>${inr(v)}</span></div>`).join('')}
      <div class="sum-line"><span>GST (5%)</span><span>${inr(gst)}</span></div>
      <div class="fare-total"><span>Estimated fare</span><strong>${inr(f.total + gst)}</strong></div>`;
  }
  $('#vehicleGrid').addEventListener('click', e => {
    const c = e.target.closest('.vehicle'); if (!c) return;
    CB.vehicle = c.dataset.vehicle; renderCab();
    if (window.innerWidth <= 960) $('#bookCab').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#vehicleGrid').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.vehicle')) { e.preventDefault(); e.target.click(); } });
  $('#cbTrip').addEventListener('click', e => { const b = e.target.closest('[data-trip]'); if (b) { CB.trip = b.dataset.trip; renderCab(); } });
  cbFrom.addEventListener('input', () => { CB.from = cbFrom.value.trim(); renderCab(); });
  cbTo.addEventListener('input', () => { CB.to = cbTo.value.trim(); renderCab(); });
  cbDate.addEventListener('change', () => { CB.date = cbDate.value; });
  $('#cbDays').addEventListener('change', e => { if (e.detail) { CB.days = e.detail.value; renderCab(); } });
  $('#cbBook').addEventListener('click', () => {
    if (!CB.from) { TK.toast('Enter a pickup city', 'error'); cbFrom.focus(); return; }
    if (CB.trip !== 'local' && !CB.to) { TK.toast('Enter a drop city', 'error'); cbTo.focus(); return; }
    if (CB.trip !== 'local' && CB.from.toLowerCase() === CB.to.toLowerCase()) { TK.toast('Same pickup and drop? Choose “Local” instead', 'error'); return; }
    if (!cbDate.value || cbDate.value < TK.minTravelDate()) { TK.toast('Pick a date at least 3 days ahead', 'error'); cbDate.focus(); return; }
    location.href = `booking.html?${new URLSearchParams({ cab: CB.vehicle, from: CB.from, to: CB.trip === 'local' ? CB.from : CB.to, date: cbDate.value, time: $('#cbTime').value || '07:00', trip: CB.trip, days: CB.days })}`;
  });
  renderCab();

  /* ---------- FAQ ---------- */
  const RIDE_FAQ = [
    ['How many people fit in one safari jeep?', 'Up to 6 guests plus the driver and naturalist. For larger groups we book multiple jeeps in the same zone and slot.'],
    ['Which safari slot is better?', 'Morning slots have cooler air and more animal movement near water. Evening slots have beautiful golden light for photography. Both are great!'],
    ['What ID do I need at the gate?', 'The same government photo ID used while booking (Aadhaar, passport or driving licence) for every guest.'],
    ['How is the cab fare calculated?', 'Outstation trips are billed per km with a 250 km/day minimum, plus a driver allowance. Tolls, parking and state taxes are paid at actuals.'],
    ['Can I cancel or reschedule?', 'Safaris can be cancelled free up to 48 hours before the slot (park permit fees are non-refundable once issued). Cabs can be rescheduled free up to 24 hours before pickup.']
  ];
  $('#rideFaq').innerHTML = RIDE_FAQ.map(([q, a], i) => `<div class="acc-item${i === 0 ? ' is-open' : ''}"><button class="acc-head" type="button" aria-expanded="${i === 0}">${esc(q)}<i class="ri-add-line"></i></button><div class="acc-body"><div><p>${esc(a)}</p></div></div></div>`).join('');

  if (params.get('tab') === 'cabs') showPane('cabs');
  if (location.hash === '#book') setTimeout(() => ($('.ride-layout:not([hidden]) .ride-panel')).scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
})();
