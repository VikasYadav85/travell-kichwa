/* Plan My Trip — 5-step custom trip request */
(() => {
  const { $, $$, esc, inr, params } = TK;
  $('#plImg').src = img('van_road', 960);

  const PICKS = ['ladakh', 'kashmir', 'kerala', 'rajasthan', 'goa', 'spiti', 'himachal', 'andaman', 'uttarakhand', 'dubai', 'bali', 'maldives'];
  const GROUPS = [['solo', 'Solo', 'ri-user-3-line'], ['couple', 'Couple', 'ri-hearts-line'], ['family', 'Family', 'ri-parent-line'], ['friends', 'Friends', 'ri-group-line'], ['corporate', 'Corporate', 'ri-briefcase-4-line']];
  const STAYS = ['Budget', '3★ Comfort', '4★ Premium', '5★ Luxury', 'Homestays & camps'];
  const INTERESTS = [['Mountains', 'ri-landscape-line'], ['Beaches', 'ri-sun-line'], ['Wildlife', 'ri-bear-smile-line'], ['Culture & heritage', 'ri-ancient-gate-line'], ['Adventure sports', 'ri-riding-line'], ['Food trails', 'ri-restaurant-2-line'], ['Spiritual', 'ri-leaf-line'], ['Snow', 'ri-snowflake-line'], ['Road trips', 'ri-roadster-line'], ['Wellness & spa', 'ri-seedling-line'], ['Nightlife', 'ri-goblet-line'], ['Shopping', 'ri-shopping-bag-3-line']];
  const CONTACT = [['WhatsApp', 'ri-whatsapp-line'], ['Phone call', 'ri-phone-line'], ['Email', 'ri-mail-line']];

  const S = { step: 1, dests: new Set(), month: '', nights: 6, flex: true, group: '', adults: 2, kids: 0, budget: 30000, stay: '3★ Comfort', interests: new Set(), contact: 'WhatsApp' };

  // prefill from the home search
  const qDest = (params.get('dest') || '').trim();
  if (qDest) {
    const m = DESTINATIONS.find(d => d.name.toLowerCase() === qDest.toLowerCase() || d.slug === qDest.toLowerCase());
    if (m && PICKS.includes(m.slug)) S.dests.add(m.slug); else $('#plOther').value = qDest;
  }
  if (params.get('month')) S.month = params.get('month');
  if (+params.get('budget')) S.budget = Math.min(300000, Math.max(5000, +params.get('budget')));

  /* ---------- render controls ---------- */
  $('#pickGrid').innerHTML = PICKS.map(s => { const d = TK.dest(s); return `<button type="button" class="pick" data-pick="${s}" aria-pressed="false"><img src="${img(d.img, 500)}" alt="" loading="lazy"><span>${esc(d.name)}<small>${esc(d.region === 'intl' ? d.area : d.tagline)}</small></span><i class="ri-check-line tick"></i></button>`; }).join('');

  const now = new Date();
  const months = [['flexible', 'Anytime', 'Flexible']].concat(Array.from({ length: 11 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    return [`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, d.toLocaleDateString('en-IN', { month: 'short' }), String(d.getFullYear())];
  }));
  $('#monthGrid').innerHTML = months.map(([v, a, b]) => `<button type="button" class="month" data-month="${v}"><strong>${a}</strong><small>${b}</small></button>`).join('');
  $('#groupGrid').innerHTML = GROUPS.map(([k, l, ic]) => `<button type="button" class="choice" data-group="${k}"><i class="${ic}"></i>${l}</button>`).join('');
  $('#plAdults').innerHTML = TK.stepper('adults', S.adults, 1, 40);
  $('#plKids').innerHTML = TK.stepper('kids', S.kids, 0, 20);
  $('#stayChips').innerHTML = STAYS.map(s => `<button type="button" class="chip" data-stay="${esc(s)}">${esc(s)}</button>`).join('');
  $('#interestChips').innerHTML = INTERESTS.map(([s, ic]) => `<button type="button" class="chip" data-interest="${esc(s)}"><i class="${ic}"></i>${esc(s)}</button>`).join('');
  $('#contactChips').innerHTML = CONTACT.map(([s, ic]) => `<button type="button" class="chip" data-contact="${s}"><i class="${ic}"></i>${s}</button>`).join('');
  const u = TK.auth.user();
  if (u) { $('#plName').value = u.name || ''; $('#plEmail').value = u.email || ''; $('#plPhone').value = u.phone || ''; }

  function paintRange(r) { r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min)) * 100 + '%'); }
  function sync() {
    $$('[data-pick]').forEach(b => { const on = S.dests.has(b.dataset.pick); b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
    $$('[data-month]').forEach(b => b.classList.toggle('is-active', b.dataset.month === S.month));
    $$('[data-group]').forEach(b => b.classList.toggle('is-active', b.dataset.group === S.group));
    $$('[data-stay]').forEach(b => b.classList.toggle('is-active', b.dataset.stay === S.stay));
    $$('[data-interest]').forEach(b => b.classList.toggle('is-active', S.interests.has(b.dataset.interest)));
    $$('[data-contact]').forEach(b => b.classList.toggle('is-active', b.dataset.contact === S.contact));
    const dur = $('#plDur'), bud = $('#plBudget');
    dur.value = S.nights; bud.value = S.budget; paintRange(dur); paintRange(bud);
    $('#durVal').textContent = `${S.nights} nights · ${S.nights + 1} days`;
    $('#budVal').textContent = S.budget >= 300000 ? '₹3 lakh +' : inr(S.budget);
  }

  const form = $('#planner');
  form.addEventListener('click', e => {
    const t = e.target;
    const pk = t.closest('[data-pick]'); if (pk) { const s = pk.dataset.pick; S.dests.has(s) ? S.dests.delete(s) : S.dests.add(s); }
    const mo = t.closest('[data-month]'); if (mo) S.month = mo.dataset.month;
    const gr = t.closest('[data-group]'); if (gr) {
      S.group = gr.dataset.group;
      const preset = { solo: [1, 0], couple: [2, 0], family: [2, 2], friends: [4, 0], corporate: [10, 0] }[S.group];
      [S.adults, S.kids] = preset;
      $('#plAdults').innerHTML = TK.stepper('adults', S.adults, 1, 40);
      $('#plKids').innerHTML = TK.stepper('kids', S.kids, 0, 20);
    }
    const st = t.closest('[data-stay]'); if (st) S.stay = st.dataset.stay;
    const it = t.closest('[data-interest]'); if (it) { const v = it.dataset.interest; S.interests.has(v) ? S.interests.delete(v) : S.interests.add(v); }
    const ct = t.closest('[data-contact]'); if (ct) S.contact = ct.dataset.contact;
    sync();
  });
  form.addEventListener('change', e => { if (e.detail && e.detail.name) S[e.detail.name] = e.detail.value; if (e.target.id === 'plFlex') S.flex = e.target.checked; });
  $('#plDur').addEventListener('input', e => { S.nights = +e.target.value; sync(); });
  $('#plBudget').addEventListener('input', e => { S.budget = +e.target.value; sync(); });

  /* ---------- steps ---------- */
  function show(n) {
    S.step = n;
    $$('.p-pane').forEach(p => p.classList.toggle('is-active', String(p.dataset.step) === String(n)));
    $$('.p-step').forEach((el, i) => { el.classList.toggle('is-active', i + 1 === n); el.classList.toggle('is-done', n === 'done' || i + 1 < n); el.querySelector('span').innerHTML = (n === 'done' || i + 1 < n) ? '<i class="ri-check-line"></i>' : i + 1; });
    $('#pBar').style.width = n === 'done' ? '100%' : `${n * 20}%`;
    $('#pNav').hidden = n === 'done';
    $('#pBack').style.visibility = n === 1 ? 'hidden' : 'visible';
    $('#pLabel').textContent = `Step ${n} of 5`;
    $('#pNext').innerHTML = n === 5 ? '<i class="ri-send-plane-line"></i>Send my request' : 'Next <i class="ri-arrow-right-line"></i>';
    const top = $('.planner').getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  }
  $('#pBack').addEventListener('click', () => show(Math.max(1, S.step - 1)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const other = $('#plOther').value.trim();
    if (S.step === 1 && !S.dests.size && !other) return TK.toast('Pick a destination — or type one in', 'error');
    if (S.step === 2 && !S.month) return TK.toast('Choose a month (or “Anytime”)', 'error');
    if (S.step === 3 && !S.group) return TK.toast("Tell us who's travelling", 'error');
    if (S.step < 5) return show(S.step + 1);
    if (!TK.validate($('[data-step="5"]'))) return;
    submit(other);
  });

  function submit(other) {
    const names = [...S.dests].map(s => TK.dest(s).name).concat(other ? [other] : []);
    const monthLabel = S.month === 'flexible' ? 'Anytime' : TK.fmtDate(S.month + '-01', { month: 'long', year: 'numeric' });
    const groupLabel = GROUPS.find(g => g[0] === S.group)[1];
    const item = TK.enquiries.add({
      type: 'custom', subject: 'Custom trip · ' + names.join(', '),
      name: $('#plName').value.trim(), phone: $('#plPhone').value.trim(), email: $('#plEmail').value.trim().toLowerCase(),
      details: { destinations: names, month: monthLabel, nights: S.nights, flexible: S.flex, group: groupLabel, adults: S.adults, kids: S.kids, budget: S.budget, stay: S.stay, interests: [...S.interests], contact: S.contact },
      message: $('#plNotes').value.trim()
    });
    // suggestions
    const MAP = { Mountains: ['Adventure', 'Road Trip'], Beaches: ['Beach'], Wildlife: ['Wildlife'], 'Culture & heritage': ['Heritage'], 'Adventure sports': ['Adventure'], Spiritual: ['Spiritual'], 'Road trips': ['Road Trip'], Snow: ['Adventure'], 'Wellness & spa': ['Luxury'] };
    const cats = new Set([...S.interests].flatMap(i => MAP[i] || []));
    const picks = PACKAGES.map(p => ({ p, s: (S.dests.has(p.dest) ? 5 : 0) + p.cats.filter(c => cats.has(c)).length + (p.price <= S.budget ? 1 : 0) + (S.group === 'couple' && p.cats.includes('Honeymoon') ? 1 : 0) + (S.group === 'family' && p.cats.includes('Family') ? 1 : 0) }))
      .sort((a, b) => b.s - a.s).slice(0, 3).map(o => o.p);

    $('[data-step="done"]').innerHTML = `<div class="p-done">
        <div class="success-mark"><i class="ri-check-line"></i></div>
        <h3>Request received, ${esc(item.name.split(' ')[0])}!</h3>
        <p>Your reference is <b>${item.id}</b>. A trip designer will ${S.contact === 'Email' ? 'email' : S.contact === 'Phone call' ? 'call' : 'WhatsApp'} you within 24 hours with a personalised plan.</p>
        <div class="p-recap">
          <div><small>Destinations</small><strong>${esc(names.join(', '))}</strong></div>
          <div><small>When</small><strong>${esc(monthLabel)} · ${S.nights} nights${S.flex ? ' · flexible' : ''}</strong></div>
          <div><small>Travellers</small><strong>${esc(groupLabel)} · ${TK.plural(S.adults, 'adult')}${S.kids ? ' + ' + TK.plural(S.kids, 'child', 'children') : ''}</strong></div>
          <div><small>Budget</small><strong>${S.budget >= 300000 ? '₹3 lakh +' : inr(S.budget)} / person · ${esc(S.stay)}</strong></div>
        </div>
        <div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="account.html#enquiries"><i class="ri-chat-smile-3-line"></i>Track my request</a><a class="btn btn-wa" href="${TK.waLink(`Hi! My trip request ${item.id} — ${names.join(', ')}, ${monthLabel}.`)}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i>Chat now</a></div>
        <p class="p-sub" style="justify-content:center;margin-top:34px">Meanwhile, trips you might love</p>
      </div>
      <div class="pkg-grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px">${picks.map((p, i) => TK.pkgCard(p, { i })).join('')}</div>`;
    show('done');
    TK.wish.sync();
    TK.toast(`Request ${item.id} sent — we'll be in touch soon`, 'success', 'ri-send-plane-line');
  }

  sync();
  show(1);
})();
