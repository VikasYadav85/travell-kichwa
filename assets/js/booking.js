/* Checkout: trip details → travellers → payment → confirmation */
(() => {
  const { $, $$, esc, inr, params } = TK;
  const clampInt = (v, lo, hi, d) => { v = parseInt(v, 10); return Number.isNaN(v) ? d : Math.max(lo, Math.min(hi, v)); };
  const validDate = v => (v && v >= TK.minTravelDate() ? v : TK.defaultTravelDate());

  /* ---------- what are we booking? ---------- */
  const kind = params.get('id') ? 'package' : params.get('safari') ? 'safari' : params.get('cab') ? 'cab' : null;
  const p = kind === 'package' ? TK.pkg(params.get('id')) : null;
  let sp = kind === 'safari' ? SAFARIS.find(s => s.id === params.get('safari')) : null;

  if (!kind || (kind === 'package' && !p) || (kind === 'safari' && !sp)) {
    $('#coHead').remove();
    $('#coGrid').outerHTML = `<div class="empty" style="margin:30px 0 60px">
      <img src="assets/img/jeep.png" alt="">
      <h3>Nothing to check out yet</h3>
      <p>Pick a trip, jeep safari or ride first — your booking summary will appear here.</p>
      <div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="packages.html">Browse packages</a><a class="btn btn-outline" href="safari.html">Book a safari or cab</a></div></div>`;
    return;
  }

  const S = {
    step: 1,
    date: validDate(params.get('date')),
    adults: clampInt(params.get('adults'), 1, 20, 2),
    children: clampInt(params.get('children'), 0, 10, 0),
    tier: TIERS.some(t => t.id === params.get('tier')) ? params.get('tier') : 'standard',
    slot: params.get('slot') || 'morning',
    pax: clampInt(params.get('pax'), 1, 24, 2),
    vehicle: VEHICLES.some(v => v.id === params.get('cab')) ? params.get('cab') : 'suv',
    from: params.get('from') || 'Delhi',
    to: params.get('to') || 'Manali',
    time: /^\d{2}:\d{2}$/.test(params.get('time') || '') ? params.get('time') : '07:00',
    trip: ['oneway', 'round', 'local'].includes(params.get('trip')) ? params.get('trip') : 'oneway',
    days: clampInt(params.get('days'), 1, 15, 2),
    addons: new Set(),
    coupon: null,
    plan: 'part',
    method: 'upi'
  };
  const slotsFor = s => (s && s.slots) || SAFARI_SLOTS;
  if (sp && !slotsFor(sp).some(s => s[0] === S.slot)) S.slot = slotsFor(sp)[0][0];
  const TRIP_LABEL = { oneway: 'One way', round: 'Round trip', local: 'Local (8 hr)' };

  /* ---------- pricing ---------- */
  const travellers = () => (kind === 'package' ? S.adults + S.children : kind === 'safari' ? S.pax : 1);
  const jeeps = () => Math.ceil(S.pax / 6);
  function subtotal() {
    let base = 0, addons = 0; const lines = [], addonLines = [];
    if (kind === 'package') {
      const a = TK.tierPrice(p, S.tier), c = TK.childPrice(a);
      lines.push([`${inr(a)} × ${TK.plural(S.adults, 'adult')}`, a * S.adults]);
      if (S.children) lines.push([`${inr(c)} × ${TK.plural(S.children, 'child', 'children')}`, c * S.children]);
      base = a * S.adults + c * S.children;
      ADDONS.forEach(x => {
        if (!S.addons.has(x.id)) return;
        const amt = x.price * (x.per === 'person' ? travellers() : 1);
        addons += amt; addonLines.push([x.name + (x.per === 'person' ? ` × ${travellers()}` : ''), amt]);
      });
    } else if (kind === 'safari') {
      base = sp.price * jeeps();
      lines.push([`${inr(sp.price)} × ${TK.plural(jeeps(), 'jeep')}`, base]);
    } else {
      const f = TK.cabFare({ vehicle: S.vehicle, from: S.from, to: S.to, trip: S.trip, days: S.days });
      base = f.total; f.lines.forEach(l => lines.push(l));
    }
    return { base, addons, lines, addonLines, sub: base + addons };
  }
  function couponError(code) {
    const c = COUPONS[code];
    if (!c) return "Hmm, that code doesn't exist";
    if (c.kinds && !c.kinds.includes(kind)) return 'This code works on jeep safaris & rides only';
    if (c.min && subtotal().sub < c.min) return `Valid on bookings above ${inr(c.min)}`;
    return null;
  }
  function calc() {
    const s = subtotal();
    let discount = 0;
    if (S.coupon) {
      const c = COUPONS[S.coupon];
      discount = c.type === 'pct' ? Math.min(c.max || Infinity, Math.round((s.sub * c.value) / 100)) : c.value;
      discount = Math.min(discount, s.sub);
    }
    const taxable = s.sub - discount, gst = Math.round(taxable * 0.05), total = taxable + gst;
    const payNow = S.plan === 'part' ? Math.round(total * 0.25) : total;
    return { ...s, discount, gst, total, payNow, balance: total - payNow };
  }
  const endDate = () => TK.isoDate(TK.addDays(TK.parseISO(S.date), p ? p.nights : 0));
  const balanceDue = () => { const d = TK.addDays(TK.parseISO(S.date), -15); return TK.isoDate(d < TK.today() ? TK.today() : d); };

  /* ---------- item meta ---------- */
  const vehicle = () => VEHICLES.find(v => v.id === S.vehicle);
  function meta() {
    if (kind === 'package') return { title: p.title, subtitle: p.places, image: p.cover, back: `package.html?id=${p.id}`, backLabel: p.title };
    if (kind === 'safari') return { title: `${sp.name} Jeep Safari`, subtitle: sp.area, image: sp.img, back: `safari.html?spot=${sp.id}`, backLabel: 'Jeep safari' };
    const v = vehicle();
    return { title: `${v.name} · ${S.trip === 'local' ? S.from + ' local' : S.from + ' → ' + S.to}`, subtitle: v.model, image: null, back: 'safari.html?tab=cabs', backLabel: 'Cabs & SUVs' };
  }
  const m0 = meta();
  $('#coBackCrumb').href = m0.back; $('#coBackCrumb').textContent = m0.backLabel;
  document.title = `Checkout · ${m0.title} — Travell Kichwa`;

  /* ---------- summary ---------- */
  function renderSummary() {
    const c = calc(), m = meta(), v = vehicle();
    const media = m.image
      ? `<img src="${img(m.image, 330)}" alt="">`
      : `<div class="vehicle-art" style="width:92px;height:92px;flex:none">${v.jeep ? '<img src="assets/img/jeep.png" alt="" style="height:34px">' : `<i class="${v.icon}" style="font-size:40px"></i>`}</div>`;
    let details = [];
    if (kind === 'package') details = [
      ['ri-calendar-2-line', 'Dates', `${TK.shortDate(S.date)} – ${TK.fmtDate(endDate(), { day: 'numeric', month: 'short', year: 'numeric' })}`],
      ['ri-group-line', 'Travellers', TK.travellersLabel(S.adults, S.children)],
      ['ri-hotel-bed-line', 'Stays', TK.tier(S.tier).name]
    ];
    else if (kind === 'safari') {
      const sl = slotsFor(sp).find(x => x[0] === S.slot);
      details = [
        ['ri-calendar-2-line', 'Date', TK.fmtDate(S.date)],
        ['ri-sun-line', 'Slot', `${sl[1]} · ${sl[2]}`],
        ['ri-group-line', 'Guests', `${S.pax} · ${TK.plural(jeeps(), 'jeep')}`]
      ];
    } else details = [
      ['ri-calendar-2-line', 'Pickup', `${TK.shortDate(S.date)} · ${S.time}`],
      ['ri-route-line', 'Trip', TRIP_LABEL[S.trip] + (S.trip !== 'oneway' ? ` · ${TK.plural(S.days, 'day')}` : '')],
      ['ri-user-3-line', 'Vehicle', `${v.name} · ${v.seats} seats`]
    ];
    $('#summary').innerHTML = `
      <div class="summary-media">${media}
        <div><small><i class="ri-map-pin-2-line"></i>${esc(m.subtitle)}</small><strong>${esc(m.title)}</strong>
        ${p ? `<span class="rating"><i class="ri-star-fill"></i>${p.rating}<span>(${p.reviews})</span></span>` : ''}</div>
      </div>
      <div class="sum-block">${details.map(([ic, k, val]) => `<div class="sum-line"><span><i class="${ic}"></i>${k}</span><span>${esc(val)}</span></div>`).join('')}</div>
      <div class="sum-block">
        ${c.lines.map(([k, val]) => `<div class="sum-line"><span>${esc(k)}</span><span>${inr(val)}</span></div>`).join('')}
        ${c.addonLines.map(([k, val]) => `<div class="sum-line"><span>${esc(k)}</span><span>${inr(val)}</span></div>`).join('')}
        ${c.discount ? `<div class="sum-line discount"><span><i class="ri-coupon-3-line"></i>${esc(S.coupon)}</span><span>− ${inr(c.discount)}</span></div>` : ''}
        <div class="sum-line"><span>GST (5%)</span><span>${inr(c.gst)}</span></div>
      </div>
      <div class="sum-total"><span>Total<small>incl. taxes</small></span><strong>${inr(c.total)}</strong></div>
      <div class="sum-due"><span>${S.plan === 'part' ? 'Due now (25%)' : 'Due now'}</span><span>${inr(c.payNow)}</span></div>`;
    const btn = $('#payBtn'); if (btn) btn.innerHTML = `<i class="ri-lock-line"></i>Pay ${inr(c.payNow)} securely`;
    $$('[data-plan-now]').forEach(el => { el.textContent = inr(el.dataset.planNow === 'part' ? Math.round(c.total * 0.25) : c.total); });
    $$('[data-plan-later]').forEach(el => { el.textContent = inr(c.total - Math.round(c.total * 0.25)); });
    $$('[data-pay-now]').forEach(el => { el.textContent = inr(c.payNow); });
    renderEmi();
  }

  /* ---------- step 1 ---------- */
  function step1HTML() {
    const dateField = label => `<div class="field"><label class="label" for="coDate">${label}</label><input class="input" type="date" id="coDate" value="${S.date}" min="${TK.minTravelDate()}" required><span class="field-error">Pick a date at least 3 days from today</span></div>`;
    const actions = `<div class="step-actions"><a class="btn btn-outline" href="${m0.back}"><i class="ri-arrow-left-line"></i>Back</a><button class="btn btn-primary btn-lg" type="submit">Continue <i class="ri-arrow-right-line"></i></button></div>`;

    if (kind === 'package') return `
      <div class="panel">
        <div class="panel-title"><i class="ri-calendar-2-line"></i><div>When are you travelling?<small>${p.nights} nights / ${p.days} days · starts at ${esc(p.facts.start)}</small></div></div>
        <div class="form-grid">${dateField('Start date')}
          <div class="field"><label class="label" for="coEnd">Trip ends</label><input class="input" id="coEnd" value="${TK.fmtDate(endDate())}" disabled></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-group-line"></i><div>Who's travelling?<small>Children 5 – 11 years pay 60%. Kids under 5 travel free.</small></div></div>
        <div class="count-row"><div><strong>Adults</strong><small>12 years &amp; above</small></div>${TK.stepper('adults', S.adults, 1, 20)}</div>
        <div class="count-row"><div><strong>Children</strong><small>5 – 11 years</small></div>${TK.stepper('children', S.children, 0, 10)}</div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-hotel-bed-line"></i><div>Choose your stays<small>Prices per person, twin sharing</small></div></div>
        <div class="opt-grid">${TIERS.map((t, i) => `
          <label class="opt-card">
            <input type="radio" name="tier" value="${t.id}"${S.tier === t.id ? ' checked' : ''}>
            <span class="opt-tick tr"><i class="ri-check-line"></i></span>
            <span class="opt-icon"><i class="${['ri-hotel-bed-line', 'ri-hotel-line', 'ri-vip-crown-line'][i]}"></i></span>
            <span class="opt-body"><strong>${t.name}</strong><small>${t.note}</small></span>
            <span class="opt-price">${inr(TK.tierPrice(p, t.id))}</span>
          </label>`).join('')}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-sparkling-2-line"></i><div>Make it special<small>Optional add-ons — add or remove anytime</small></div></div>
        <div class="opt-grid cols-2">${ADDONS.map(a => `
          <label class="opt-card">
            <input type="checkbox" name="addon" value="${a.id}"${S.addons.has(a.id) ? ' checked' : ''}>
            <span class="opt-icon"><i class="${a.icon}"></i></span>
            <span class="opt-body"><strong>${a.name}</strong><small>${a.note}</small></span>
            <span class="opt-price">+${inr(a.price)}<small>per ${a.per}</small></span>
            <span class="opt-tick"><i class="ri-check-line"></i></span>
          </label>`).join('')}
        </div>
      </div>${actions}`;

    if (kind === 'safari') return `
      <div class="panel">
        <div class="panel-title"><i class="ri-bear-smile-line"></i><div>Safari details<small>${esc(sp.season)}</small></div></div>
        <div class="form-grid">
          <div class="field"><label class="label" for="coPark">Safari park</label><select class="select" id="coPark">${SAFARIS.map(s => `<option value="${s.id}"${s.id === sp.id ? ' selected' : ''}>${esc(s.name)} — ${inr(s.price)} / jeep</option>`).join('')}</select></div>
          ${dateField('Safari date')}
        </div>
        <p class="label" style="margin:20px 0 10px">Time slot</p>
        <div class="slot-grid" id="coSlots">${slotsFor(sp).map(([id, l, t]) => `<button type="button" class="slot${S.slot === id ? ' is-active' : ''}" data-slot="${id}"><strong><i class="${id.includes('ev') || id === 'sunset' ? 'ri-sun-foggy-line' : 'ri-sun-line'}"></i>${l}</strong><small>${t}</small></button>`).join('')}</div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-group-line"></i><div>Guests<small>Up to 6 guests share one open jeep with a naturalist.</small></div></div>
        <div class="count-row"><div><strong>Guests</strong><small>Age 5+ · <span id="coJeeps">${TK.plural(jeeps(), 'jeep')}</span></small></div>${TK.stepper('pax', S.pax, 1, 24)}</div>
        <div class="demo-note" style="margin-top:14px"><i class="ri-information-line"></i><span>Permits are issued in guests' names — carry the same photo ID to the gate. Private jeep for your group is included.</span></div>
      </div>${actions}`;

    const v = vehicle();
    return `
      <div class="panel">
        <div class="panel-title"><i class="ri-route-line"></i><div>Your ride<small>Chauffeur-driven · tolls &amp; parking extra at actuals</small></div></div>
        <div class="trip-type" id="coTrip">${Object.entries(TRIP_LABEL).map(([k, l]) => `<button type="button" data-trip="${k}"${S.trip === k ? ' class="is-active"' : ''}>${l}</button>`).join('')}</div>
        <div class="form-grid" style="margin-top:18px">
          <div class="field"><label class="label" for="coFrom">Pickup city</label><input class="input" id="coFrom" list="coCities" value="${esc(S.from)}" required><span class="field-error">Enter a pickup city</span></div>
          <div class="field" data-when="to"><label class="label" for="coTo">Drop city</label><input class="input" id="coTo" list="coCities" value="${esc(S.to)}"><span class="field-error">Enter a drop city</span></div>
          ${dateField('Pickup date')}
          <div class="field"><label class="label" for="coTime">Pickup time</label><input class="input" type="time" id="coTime" value="${S.time}" required></div>
          <div class="field" data-when="days"><label class="label">Number of days</label>${TK.stepper('days', S.days, 1, 15)}</div>
        </div>
        <p class="hint" id="coDist" style="margin-top:12px"></p>
        <datalist id="coCities">${Object.keys(CITIES).map(c => `<option value="${c}">`).join('')}</datalist>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-car-line"></i><div>Vehicle</div></div>
        <div class="opt-grid cols-2">${VEHICLES.map(x => `
          <label class="opt-card">
            <input type="radio" name="vehicle" value="${x.id}"${x.id === v.id ? ' checked' : ''}>
            <span class="opt-icon">${x.jeep ? '<img src="assets/img/jeep.png" alt="" style="width:34px">' : `<i class="${x.icon}"></i>`}</span>
            <span class="opt-body"><strong>${x.name}</strong><small>${x.seats} seats · ${TK.plural(x.bags, 'bag')} · ₹${x.rate}/km</small></span>
            <span class="opt-tick"><i class="ri-check-line"></i></span>
          </label>`).join('')}
        </div>
      </div>${actions}`;
  }

  function bindStep1() {
    const f = $('#step1');
    const date = $('#coDate');
    date.addEventListener('change', () => { S.date = date.value; if ($('#coEnd')) $('#coEnd').value = TK.fmtDate(endDate()); renderSummary(); });
    f.addEventListener('change', e => {
      const t = e.target;
      if (e.detail && e.detail.name) {
        S[e.detail.name] = e.detail.value;
        if (e.detail.name === 'pax') $('#coJeeps').textContent = TK.plural(jeeps(), 'jeep');
      }
      if (t.name === 'tier') S.tier = t.value;
      if (t.name === 'addon') t.checked ? S.addons.add(t.value) : S.addons.delete(t.value);
      if (t.name === 'vehicle') S.vehicle = t.value;
      if (t.id === 'coPark') {
        sp = SAFARIS.find(s => s.id === t.value);
        if (!slotsFor(sp).some(s => s[0] === S.slot)) S.slot = slotsFor(sp)[0][0];
        $('#step1').innerHTML = step1HTML(); bindStep1(); return renderSummary();
      }
      if (t.id === 'coTime') S.time = t.value;
      recheckCoupon();
      renderSummary();
    });
    $('#coSlots')?.addEventListener('click', e => {
      const b = e.target.closest('[data-slot]'); if (!b) return;
      S.slot = b.dataset.slot; $$('#coSlots .slot').forEach(x => x.classList.toggle('is-active', x === b)); renderSummary();
    });
    const cityInput = (id, key) => $(id)?.addEventListener('input', e => { S[key] = e.target.value.trim(); updateDist(); renderSummary(); });
    cityInput('#coFrom', 'from'); cityInput('#coTo', 'to');
    $('#coTrip')?.addEventListener('click', e => {
      const b = e.target.closest('[data-trip]'); if (!b) return;
      S.trip = b.dataset.trip; $$('#coTrip button').forEach(x => x.classList.toggle('is-active', x === b)); tripFields(); updateDist(); renderSummary();
    });
    tripFields(); updateDist();
  }
  function tripFields() {
    if (kind !== 'cab') return;
    const to = $('[data-when="to"]'), days = $('[data-when="days"]');
    to.hidden = S.trip === 'local'; $('#coTo').required = S.trip !== 'local';
    days.hidden = S.trip === 'oneway';
  }
  function updateDist() {
    if (kind !== 'cab') return;
    const el = $('#coDist'); if (!el) return;
    if (S.trip === 'local') { el.innerHTML = `<i class="ri-information-line"></i> 8 hours / 80 km per day within ${esc(S.from)}. Extra km at ₹${vehicle().rate}/km.`; return; }
    const km = TK.distanceKm(S.from, S.to);
    el.innerHTML = km ? `<i class="ri-road-map-line"></i> Approx. ${km.toLocaleString('en-IN')} km by road · minimum billing 250 km/day` : `<i class="ri-information-line"></i> We'll confirm the exact distance — estimate uses 250 km/day minimum billing.`;
  }

  /* ---------- step 2 ---------- */
  function step2HTML() {
    const u = TK.auth.user() || {};
    const extra = kind === 'package' ? S.adults + S.children - 1 : kind === 'safari' ? S.pax - 1 : 0;
    const rows = Array.from({ length: extra }, (_, i) => {
      const isChild = kind === 'package' && i >= S.adults - 1;
      return `<div class="traveller">
        <span class="tnum">${i + 2}</span>
        <input class="input" name="tName" placeholder="${isChild ? 'Child' : 'Traveller'} ${i + 2} full name" aria-label="Traveller ${i + 2} name" autocomplete="off">
        <input class="input" name="tAge" type="number" min="${isChild ? 5 : 12}" max="99" placeholder="Age" aria-label="Traveller ${i + 2} age">
        <select class="select" name="tGender" aria-label="Traveller ${i + 2} gender"><option value="">Gender</option><option>Female</option><option>Male</option><option>Other</option></select>
      </div>`;
    }).join('');
    return `
      <div class="panel">
        <div class="panel-title"><i class="ri-user-3-line"></i><div>Lead traveller<small>Voucher and live trip updates go here.</small></div></div>
        <div class="form-grid">
          <div class="field span-2"><label class="label" for="ldName">Full name (as on ID) <span class="req">*</span></label><input class="input" id="ldName" name="name" autocomplete="name" value="${esc(u.name || '')}" required><span class="field-error">Please enter the lead traveller's name</span></div>
          <div class="field"><label class="label" for="ldEmail">Email <span class="req">*</span></label><input class="input" type="email" id="ldEmail" name="email" autocomplete="email" value="${esc(u.email || '')}" required><span class="field-error">Enter a valid email address</span></div>
          <div class="field"><label class="label" for="ldPhone">Mobile (WhatsApp) <span class="req">*</span></label><input class="input" type="tel" id="ldPhone" name="phone" autocomplete="tel" placeholder="+91 98xxx xxxxx" value="${esc(u.phone || '')}" required><span class="field-error">Enter a 10-digit mobile number</span></div>
          <div class="field${kind === 'cab' ? '' : ' span-2'}"><label class="label" for="ldCity">City</label><input class="input" id="ldCity" name="city" autocomplete="address-level2" value="${esc(u.city || '')}"></div>
          ${kind === 'cab' ? `<div class="field"><label class="label" for="ldPickup">Pickup address <span class="req">*</span></label><input class="input" id="ldPickup" name="pickup" autocomplete="street-address" placeholder="House / hotel, area" required><span class="field-error">Where should the driver pick you up?</span></div>` : ''}
        </div>
      </div>
      ${extra ? `<div class="panel">
        <div class="panel-title"><i class="ri-team-line"></i><div>Co-travellers<small>Names as per government ID — you can also add these later from My Trips.</small></div></div>
        <div>${rows}</div>
      </div>` : ''}
      <div class="panel">
        <div class="panel-title"><i class="ri-chat-3-line"></i><div>Special requests<small>Optional</small></div></div>
        <textarea class="textarea" id="ldReq" name="requests" placeholder="${kind === 'package' ? 'Dietary needs, celebrations, room preferences…' : 'Anything the driver or naturalist should know?'}"></textarea>
        <label class="check" style="margin-top:14px"><input type="checkbox" id="ldWa" checked>Send booking updates on WhatsApp</label>
      </div>
      <div class="step-actions"><button type="button" class="btn btn-outline" data-back><i class="ri-arrow-left-line"></i>Back</button><button class="btn btn-primary btn-lg" type="submit">Continue to payment <i class="ri-arrow-right-line"></i></button></div>`;
  }

  /* ---------- step 3 ---------- */
  const BANKS = [['SBI', '#1A5DAB'], ['HDFC', '#004C8F'], ['ICICI', '#AE282E'], ['Axis', '#97144D'], ['Kotak', '#ED1C24'], ['Yes Bank', '#00518F']];
  function step3HTML() {
    const c = calc();
    return `
      <div class="panel">
        <div class="panel-title"><i class="ri-wallet-3-line"></i><div>How would you like to pay?</div></div>
        <div class="opt-grid cols-2">
          <label class="opt-card"><input type="radio" name="plan" value="part"${S.plan === 'part' ? ' checked' : ''}><span class="opt-body"><strong>Reserve with 25%</strong><small>Pay <b data-plan-now="part"></b> now, <b data-plan-later></b> by ${TK.shortDate(balanceDue())}</small></span><span class="opt-tick"><i class="ri-check-line"></i></span></label>
          <label class="opt-card"><input type="radio" name="plan" value="full"${S.plan === 'full' ? ' checked' : ''}><span class="opt-body"><strong>Pay in full</strong><small>Pay <b data-plan-now="full"></b> now · nothing later</small></span><span class="opt-tick"><i class="ri-check-line"></i></span></label>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-coupon-3-line"></i><div>Offers &amp; coupons</div></div>
        <div id="couponBox"></div>
      </div>
      <div class="panel">
        <div class="panel-title"><i class="ri-secure-payment-line"></i><div>Payment method<small>Demo mode — no real money is charged.</small></div></div>
        <div class="pay-tabs" role="tablist">
          ${[['upi', 'ri-qr-code-line', 'UPI'], ['card', 'ri-bank-card-line', 'Card'], ['netbanking', 'ri-bank-line', 'Net banking'], ['emi', 'ri-calendar-schedule-line', 'EMI']].map(([k, ic, l]) => `<button type="button" class="pay-tab${S.method === k ? ' is-active' : ''}" data-method="${k}" role="tab"><i class="${ic}"></i>${l}</button>`).join('')}
        </div>
        <div class="pay-pane" data-pane="upi">
          <div class="field"><label class="label" for="upiId">UPI ID</label><div class="input-wrap"><i class="ri-at-line"></i><input class="input" id="upiId" placeholder="yourname@okaxis" data-validate="upi" autocomplete="off"></div><span class="field-error">Enter a valid UPI ID, e.g. name@okaxis</span></div>
          <div class="upi-apps">${['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => `<span class="chip chip-sm"><i class="ri-smartphone-line"></i>${a}</span>`).join('')}</div>
          <div class="qr-box"><div class="qr">${TK.qr(m0.title + S.date)}</div><div><strong>Or scan &amp; pay</strong><p class="muted" style="margin:4px 0 10px">Open any UPI app and scan to pay <b data-pay-now></b>.</p><span class="badge">Demo QR · do not scan</span></div></div>
        </div>
        <div class="pay-pane" data-pane="card">
          <div class="form-grid">
            <div class="field span-2"><label class="label" for="ccNum">Card number</label><div class="input-wrap"><i class="ri-bank-card-2-line"></i><input class="input" id="ccNum" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" data-validate="card" maxlength="19"><span class="input-addon badge badge-outline" id="ccBrand" hidden></span></div><span class="field-error">Enter a valid card number</span></div>
            <div class="field span-2"><label class="label" for="ccName">Name on card</label><input class="input" id="ccName" autocomplete="cc-name" data-validate="text"><span class="field-error">Enter the name on your card</span></div>
            <div class="field"><label class="label" for="ccExp">Expiry</label><input class="input" id="ccExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" data-validate="expiry" maxlength="7"><span class="field-error">Use MM / YY</span></div>
            <div class="field"><label class="label" for="ccCvv">CVV</label><input class="input" id="ccCvv" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" data-validate="cvv" maxlength="4"><span class="field-error">3 or 4 digits</span></div>
          </div>
          <p class="hint" style="margin-top:10px">Demo tip: use test card 4111 1111 1111 1111, any future expiry and any CVV.</p>
        </div>
        <div class="pay-pane" data-pane="netbanking">
          <div class="bank-grid">${BANKS.map(([b, col]) => `<label class="opt-card"><input type="radio" name="bank" value="${b}"><span class="bank-logo" style="background:${col}">${b.slice(0, 2).toUpperCase()}</span><span class="opt-body"><strong>${b}</strong></span></label>`).join('')}</div>
        </div>
        <div class="pay-pane" data-pane="emi"><div id="emiBox"></div></div>
      </div>
      <div class="field" style="margin:4px 0 22px">
        <label class="check"><input type="checkbox" id="terms" required><span>I agree to the <a href="contact.html#faq" target="_blank" rel="noopener" style="color:var(--brown);font-weight:600">booking terms &amp; cancellation policy</a></span></label>
        <span class="field-error">Please accept the terms to continue</span>
      </div>
      <div class="step-actions"><button type="button" class="btn btn-outline" data-back><i class="ri-arrow-left-line"></i>Back</button><button class="btn btn-primary btn-lg" type="submit" id="payBtn"><i class="ri-lock-line"></i>Pay ${inr(c.payNow)} securely</button></div>`;
  }

  function renderCoupon() {
    const box = $('#couponBox'); if (!box) return;
    if (S.coupon) {
      box.innerHTML = `<div class="applied"><i class="ri-checkbox-circle-fill"></i><span><b>${esc(S.coupon)}</b> applied — you save ${inr(calc().discount)}</span><button type="button" data-rm-coupon>Remove</button></div>`;
      return;
    }
    const offers = Object.entries(COUPONS).filter(([code]) => !couponError(code));
    box.innerHTML = `<div class="coupon-row"><input class="input" id="couponInput" placeholder="Enter coupon code" aria-label="Coupon code" autocomplete="off"><button class="btn btn-dark" type="button" id="couponApply">Apply</button></div>
      ${offers.length ? `<div class="offer-chips">${offers.map(([code, c]) => `<button type="button" class="offer-chip" data-coupon="${code}"><i class="ri-price-tag-3-line"></i><span><strong>${code}</strong> · ${esc(c.label)}</span></button>`).join('')}</div>` : ''}`;
  }
  function applyCoupon(code) {
    code = (code || '').trim().toUpperCase();
    if (!code) return TK.toast('Enter a coupon code', 'error');
    const err = couponError(code);
    if (err) return TK.toast(err, 'error');
    S.coupon = code; renderCoupon(); renderSummary();
    TK.toast(`${code} applied — you save ${inr(calc().discount)}`, 'success', 'ri-coupon-3-line');
  }
  function recheckCoupon() {
    if (S.coupon && couponError(S.coupon)) { TK.toast(`${S.coupon} removed — ${couponError(S.coupon).toLowerCase()}`, 'info'); S.coupon = null; renderCoupon(); }
  }

  let emiPick = null;
  function renderEmi() {
    const box = $('#emiBox'); if (!box) return;
    const c = calc();
    if (c.payNow < 10000) { box.innerHTML = `<div class="demo-note"><i class="ri-information-line"></i><span>No-cost EMI is available on payments above ₹10,000. Choose “Pay in full” or another method.</span></div>`; emiPick = null; return; }
    box.innerHTML = `<div class="field" style="margin-bottom:14px"><label class="label" for="emiBank">Credit card bank</label><select class="select" id="emiBank">${BANKS.map(([b]) => `<option>${b}</option>`).join('')}</select></div>
      <div class="opt-grid cols-2">${[3, 6, 9, 12].map(n => `<label class="opt-card"><input type="radio" name="emi" value="${n}"${emiPick === n ? ' checked' : ''}><span class="opt-body"><strong>${inr(Math.ceil(c.payNow / n))} / month</strong><small>${n} months · ${n <= 6 ? 'No-cost EMI' : '13% p.a.'}</small></span><span class="opt-tick"><i class="ri-check-line"></i></span></label>`).join('')}</div>`;
  }

  function setMethod(k) {
    S.method = k;
    $$('.pay-tab').forEach(t => t.classList.toggle('is-active', t.dataset.method === k));
    $$('.pay-pane').forEach(p => { const on = p.dataset.pane === k; p.hidden = !on; p.classList.toggle('is-active', on); });
  }

  function bindStep3() {
    const f = $('#step3');
    renderCoupon(); setMethod(S.method); renderEmi(); renderSummary();
    f.addEventListener('change', e => {
      const t = e.target;
      if (t.name === 'plan') { S.plan = t.value; renderSummary(); }
      if (t.name === 'emi') emiPick = +t.value;
    });
    f.addEventListener('click', e => {
      const m = e.target.closest('[data-method]'); if (m) setMethod(m.dataset.method);
      const oc = e.target.closest('[data-coupon]'); if (oc) applyCoupon(oc.dataset.coupon);
      if (e.target.closest('#couponApply')) applyCoupon($('#couponInput').value);
      if (e.target.closest('[data-rm-coupon]')) { S.coupon = null; renderCoupon(); renderSummary(); }
    });
    f.addEventListener('keydown', e => { if (e.target.id === 'couponInput' && e.key === 'Enter') { e.preventDefault(); applyCoupon(e.target.value); } });
    // card formatting
    $('#ccNum').addEventListener('input', e => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = d.replace(/(.{4})/g, '$1 ').trim();
      const brand = /^4/.test(d) ? 'VISA' : /^(5[1-5]|2[2-7])/.test(d) ? 'MASTERCARD' : /^(60|65|81|82|508)/.test(d) ? 'RUPAY' : /^3[47]/.test(d) ? 'AMEX' : '';
      const b = $('#ccBrand'); b.hidden = !brand; b.textContent = brand;
    });
    $('#ccExp').addEventListener('input', e => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    });
    $('#ccCvv').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
  }

  /* ---------- navigation ---------- */
  function goto(n) {
    S.step = n;
    [1, 2, 3].forEach(i => { $('#step' + i).hidden = i !== n; });
    $$('.progress-item').forEach(el => { const i = +el.dataset.p; el.classList.toggle('is-active', i === n); el.classList.toggle('is-done', i < n); el.querySelector('.progress-dot').innerHTML = i < n ? '<i class="ri-check-line"></i>' : i; });
    $$('.progress-line').forEach(el => el.classList.toggle('is-done', +el.dataset.l < n));
    if (n === 2 && !$('#step2').dataset.built) { $('#step2').innerHTML = step2HTML(); $('#step2').dataset.built = travellers(); }
    if (n === 2 && +$('#step2').dataset.built !== travellers()) { keepLead(); $('#step2').innerHTML = step2HTML(); restoreLead(); $('#step2').dataset.built = travellers(); }
    if (n === 3) { $('#step3').innerHTML = step3HTML(); bindStep3(); }
    renderSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  let leadCache = null;
  const keepLead = () => { const f = $('#step2'); if (f.name) leadCache = { name: f.name.value, email: f.email.value, phone: f.phone.value, city: f.city.value }; };
  const restoreLead = () => { const f = $('#step2'); if (leadCache && f.name) Object.entries(leadCache).forEach(([k, v]) => { if (f[k] && v) f[k].value = v; }); };

  document.addEventListener('click', e => { if (e.target.closest('[data-back]')) goto(S.step - 1); });

  $('#step1').addEventListener('submit', e => {
    e.preventDefault();
    const d = $('#coDate');
    if (!d.value || d.value < TK.minTravelDate()) { d.closest('.field').classList.add('has-error'); d.focus(); return; }
    S.date = d.value;
    if (kind === 'cab') {
      if (!TK.validate(e.target)) return;
      if (S.trip !== 'local' && S.from.toLowerCase() === S.to.toLowerCase()) { TK.toast('Pickup and drop cities are the same — choose “Local” instead', 'error'); return; }
    }
    goto(2);
  });
  $('#step2').addEventListener('submit', e => {
    e.preventDefault();
    if (!TK.validate(e.target)) { TK.toast('Please fill in the highlighted details', 'error'); return; }
    goto(3);
  });
  $('#step3').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!TK.validate(f)) { TK.toast('Please check the highlighted payment details', 'error'); return; }
    if (S.method === 'netbanking' && !f.querySelector('input[name=bank]:checked')) { TK.toast('Choose your bank to continue', 'error'); return; }
    if (S.method === 'emi' && (calc().payNow < 10000 || !emiPick)) { TK.toast(calc().payNow < 10000 ? 'EMI needs a payment above ₹10,000' : 'Choose an EMI plan', 'error'); return; }
    pay();
  });

  /* ---------- pay + confirm ---------- */
  function pay() {
    const ov = $('#payOverlay'), msg = $('#payMsg');
    const bank = S.method === 'upi' ? 'your UPI app' : S.method === 'card' ? 'your bank' : S.method === 'netbanking' ? ($('input[name=bank]:checked')?.value || 'your bank') : 'your card issuer';
    msg.textContent = `Connecting to ${bank}…`;
    ov.classList.add('is-open');
    setTimeout(() => { msg.textContent = 'Processing payment…'; }, 1000);
    setTimeout(() => { msg.textContent = 'Payment successful!'; }, 2000);
    setTimeout(() => { ov.classList.remove('is-open'); confirmBooking(); }, 2600);
  }

  function confirmBooking() {
    const c = calc(), m = meta(), f2 = $('#step2'), v = vehicle();
    const others = $$('.traveller', f2).map(r => ({ name: r.querySelector('[name=tName]').value.trim(), age: r.querySelector('[name=tAge]').value, gender: r.querySelector('[name=tGender]').value })).filter(o => o.name);
    const lead = { name: f2.name.value.trim(), email: f2.email.value.trim().toLowerCase(), phone: f2.phone.value.trim(), city: f2.city.value.trim() };
    const sl = sp ? slotsFor(sp).find(x => x[0] === S.slot) : null;
    const b = {
      id: TK.uid('TK'), kind, itemId: p ? p.id : sp ? sp.id : S.vehicle,
      title: m.title, subtitle: m.subtitle, image: m.image,
      date: S.date, endDate: p ? endDate() : S.date, nights: p ? p.nights : 0,
      adults: S.adults, children: S.children, tier: S.tier, tierName: TK.tier(S.tier).name,
      pax: S.pax, jeeps: jeeps(), slot: S.slot, slotLabel: sl ? `${sl[1]} · ${sl[2]}` : '',
      vehicle: S.vehicle, vehicleName: v ? v.name : '', from: S.from, to: S.to, time: S.time, trip: S.trip,
      tripLabel: TRIP_LABEL[S.trip] + (S.trip !== 'oneway' ? ` · ${TK.plural(S.days, 'day')}` : ''), days: S.days,
      pickup: f2.pickup ? f2.pickup.value.trim() : '',
      addons: [...S.addons].map(id => ADDONS.find(a => a.id === id).name),
      lead, others, requests: $('#ldReq').value.trim(),
      pricing: { base: c.base, addons: c.addons, discount: c.discount, coupon: S.coupon, gst: c.gst, total: c.total },
      paid: c.payNow, balance: c.balance, balanceDue: balanceDue(),
      plan: S.plan, method: S.method, status: 'confirmed', createdAt: new Date().toISOString()
    };
    let newAccount = false;
    if (!TK.auth.user()) { TK.auth.login({ name: lead.name, email: lead.email, phone: lead.phone, city: lead.city }); newAccount = true; }
    b.owner = TK.auth.user().email;
    TK.bookings.add(b);
    renderConfirm(b, newAccount);
  }

  function renderConfirm(b, newAccount) {
    $('#coGrid').remove();
    $('#coHead').hidden = true;
    $$('.progress-item').forEach(el => { el.classList.remove('is-active'); el.classList.add('is-done'); el.querySelector('.progress-dot').innerHTML = '<i class="ri-check-line"></i>'; });
    $$('.progress-line').forEach(el => el.classList.add('is-done'));
    $('#coTitle').textContent = 'Booking confirmed';
    const d = kind === 'package' ? TK.dest(p.dest) : null;
    const headline = kind === 'package' ? `You're going to <span class="script">${esc(d.name)}!</span>` : kind === 'safari' ? `Your safari is <span class="script">booked!</span>` : `Your ride is <span class="script">booked!</span>`;
    const waText = `My ${SITE.name} booking ${b.id} is confirmed: ${b.title} on ${TK.fmtDate(b.date)}.`;
    const conf = $('#confirm');
    conf.innerHTML = `<div class="confirm">
        <div class="success-mark"><i class="ri-check-line"></i></div>
        <h1>${headline}</h1>
        <p>Booking <b>${b.id}</b> is confirmed. Your e-voucher has been sent to <b>${esc(b.lead.email)}</b>${b.lead.phone ? ' and WhatsApp' : ''}.${newAccount ? ' We\'ve also created your account so you can manage this trip anytime.' : ''}</p>
        ${TK.ticketHTML(b)}
        <div class="confirm-actions">
          <button class="btn btn-primary" type="button" onclick="window.print()"><i class="ri-download-2-line"></i>Download voucher</button>
          <a class="btn btn-outline" href="account.html#trips"><i class="ri-suitcase-3-line"></i>Go to My Trips</a>
          <a class="btn btn-wa" href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i>Share</a>
        </div>
        <div class="next-steps">
          <div class="next-step"><i class="ri-customer-service-2-line"></i><h4>Your trip captain calls you</h4><p>Within 2 working hours to confirm pickups, room preferences and anything special.</p></div>
          <div class="next-step"><i class="ri-wallet-3-line"></i><h4>${b.balance > 0 ? `Pay ${inr(b.balance)} by ${TK.shortDate(b.balanceDue)}` : 'Fully paid — nothing due'}</h4><p>${b.balance > 0 ? 'Pay the balance anytime from My Trips — we\'ll remind you on WhatsApp.' : 'Your booking is fully paid. Free cancellation up to 15 days before travel.'}</p></div>
          <div class="next-step"><i class="ri-suitcase-3-line"></i><h4>Pack &amp; go</h4><p>A packing list, driver details and live location sharing arrive 48 hours before departure.</p></div>
        </div>
      </div>`;
    conf.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    TK.toast('Payment received — booking confirmed!', 'success');
  }

  /* ---------- boot ---------- */
  $('#step1').innerHTML = step1HTML();
  bindStep1();
  renderSummary();
})();
