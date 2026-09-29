/* My account: trips, wishlist, enquiries, profile */
(() => {
  const { $, $$, esc, inr } = TK;
  const root = $('#accRoot');
  const PANES = ['trips', 'wishlist', 'enquiries', 'profile'];
  let pane = PANES.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'trips';
  let tripTab = 'upcoming';
  let actionId = null;

  const todayISO = () => TK.isoDate(TK.today());
  const mine = u => TK.bookings.all().filter(b => (b.owner || (b.lead && b.lead.email)) === u.email);
  const myEnq = u => TK.enquiries.all().filter(e => (e.owner || e.email) === u.email || e.email === u.email);
  const bucket = b => (b.status === 'cancelled' ? 'cancelled' : b.status === 'completed' || (b.endDate || b.date) < todayISO() ? 'completed' : 'upcoming');

  /* ---------- guest ---------- */
  function renderGuest() {
    root.innerHTML = `<div class="auth-card text-center">
      <img src="assets/img/jeep.png" alt="" style="width:150px;margin:0 auto 20px">
      <h2 style="font-size:32px;font-weight:500;letter-spacing:-.02em">Your trips live <span class="script" style="font-size:1.3em">here</span></h2>
      <p class="muted" style="margin:12px 0 26px">Log in to see bookings, download vouchers, pay balances and manage your wishlist.</p>
      <div class="btn-row" style="justify-content:center"><button class="btn btn-primary btn-lg" type="button" data-auth="login">Log in</button><button class="btn btn-outline btn-lg" type="button" data-auth="signup">Create account</button></div>
      <p class="hint" style="margin-top:18px">Just booked a trip? Log in with the email you used while booking.</p>
    </div>`;
  }

  /* ---------- dashboard ---------- */
  function render() {
    const u = TK.auth.user();
    if (!u) return renderGuest();
    const list = mine(u);
    root.innerHTML = `<div class="acc-grid">
      <aside class="acc-side">
        <div class="acc-user"><span class="avatar avatar-lg c1">${esc(TK.initials(u.name))}</span><div><strong>${esc(u.name)}</strong><small>${esc(u.email)}</small></div></div>
        <nav class="acc-nav" aria-label="Account">
          <button type="button" data-pane="trips"><i class="ri-suitcase-3-line"></i>My trips<span class="n">${list.length}</span></button>
          <button type="button" data-pane="wishlist"><i class="ri-heart-3-line"></i>Wishlist<span class="n" data-wish-count>${TK.wish.list().length}</span></button>
          <button type="button" data-pane="enquiries"><i class="ri-chat-smile-3-line"></i>Enquiries<span class="n">${myEnq(u).length}</span></button>
          <button type="button" data-pane="profile"><i class="ri-user-settings-line"></i>Profile</button>
          <button type="button" data-logout><i class="ri-logout-box-r-line"></i>Log out</button>
        </nav>
      </aside>
      <div>
        <section class="acc-pane" data-pane="trips">${tripsHTML(u, list)}</section>
        <section class="acc-pane" data-pane="wishlist">${wishHTML()}</section>
        <section class="acc-pane" data-pane="enquiries">${enqHTML(u)}</section>
        <section class="acc-pane" data-pane="profile">${profileHTML(u)}</section>
      </div>
    </div>`;
    setPane(pane, false);
    renderTrips();
    TK.wish.sync();
    bindProfile();
  }

  function setPane(p, push = true) {
    pane = p;
    $$('.acc-nav [data-pane]').forEach(b => b.classList.toggle('is-active', b.dataset.pane === p));
    $$('.acc-pane').forEach(s => s.classList.toggle('is-active', s.dataset.pane === p));
    if (push) history.replaceState(null, '', '#' + p);
  }

  /* ---------- trips ---------- */
  function tripsHTML(u, list) {
    const up = list.filter(b => bucket(b) === 'upcoming');
    const paid = list.filter(b => b.status !== 'cancelled').reduce((a, b) => a + b.paid, 0);
    const n = k => list.filter(b => bucket(b) === k).length;
    return `
      <div class="acc-pane-head"><div><span class="eyebrow">Hello, ${esc(u.name.split(' ')[0])}</span><h2 style="margin-top:8px">My trips</h2></div><a class="btn btn-primary" href="packages.html"><i class="ri-add-line"></i>Book a new trip</a></div>
      <div class="acc-kpis">
        <div class="kpi"><i class="ri-plane-line"></i><div><strong>${up.length}</strong><small>Upcoming ${up.length === 1 ? 'trip' : 'trips'}</small></div></div>
        <div class="kpi"><i class="ri-wallet-3-line"></i><div><strong>${inr(paid)}</strong><small>Paid so far</small></div></div>
        <div class="kpi"><i class="ri-medal-line"></i><div><strong>${Math.floor(paid / 100).toLocaleString('en-IN')}</strong><small>Kichwa points</small></div></div>
      </div>
      <div class="segmented" id="tripTabs" style="margin-bottom:18px">
        <button type="button" data-tt="upcoming">Upcoming (${n('upcoming')})</button>
        <button type="button" data-tt="completed">Completed (${n('completed')})</button>
        <button type="button" data-tt="cancelled">Cancelled (${n('cancelled')})</button>
      </div>
      <div id="tripList"></div>`;
  }

  function tripCard(b, i) {
    const bk = bucket(b);
    const v = VEHICLES.find(x => x.id === b.vehicle);
    const media = b.image ? `<img src="${img(b.image, 500)}" alt="">` : `<div class="vehicle-art" style="width:100%;height:140px">${v && v.jeep ? '<img src="assets/img/jeep.png" alt="">' : `<i class="${v ? v.icon : 'ri-car-line'}"></i>`}</div>`;
    const dates = b.kind === 'package'
      ? `${TK.shortDate(b.date)} – ${TK.fmtDate(b.endDate, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : `${TK.fmtDate(b.date, { day: 'numeric', month: 'short', year: 'numeric' })}${b.kind === 'cab' ? ' · ' + b.time : ''}`;
    const people = b.kind === 'package' ? TK.travellersLabel(b.adults, b.children) : b.kind === 'safari' ? `${TK.plural(b.pax, 'guest')} · ${b.slotLabel.split(' · ')[0]}` : b.tripLabel;
    const statusCls = bk === 'completed' ? 'completed' : b.status;
    const statusTxt = bk === 'completed' ? 'Completed' : TK.STATUS[b.status];
    const money = b.status === 'cancelled' ? `Refund of ${inr(b.refund || 0)} initiated` : b.balance > 0 ? `Paid ${inr(b.paid)} · <b style="color:var(--ink)">${inr(b.balance)} due by ${TK.shortDate(b.balanceDue)}</b>` : 'Fully paid';
    return `<article class="trip" style="animation-delay:${i * 60}ms">
      ${media}
      <div class="trip-info">
        <span class="status ${statusCls}">${statusTxt}</span>
        <h3>${esc(b.title)}</h3>
        <div class="meta-row">
          <span><i class="ri-calendar-2-line"></i>${esc(dates)}</span>
          <span><i class="${b.kind === 'cab' ? 'ri-route-line' : 'ri-group-line'}"></i>${esc(people)}</span>
          ${b.kind === 'package' ? `<span><i class="ri-hotel-bed-line"></i>${esc(b.tierName)}</span>` : ''}
        </div>
        <p class="bid">Booking ID <strong>${esc(b.id)}</strong> · booked ${TK.fmtDate(b.createdAt.slice(0, 10), { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>
      <div class="trip-side">
        <span class="amt">${inr(b.pricing.total)}</span>
        <small>${money}</small>
        <div class="btn-row">
          <button class="btn btn-outline btn-sm" type="button" data-voucher="${b.id}"><i class="ri-ticket-2-line"></i>Voucher</button>
          ${bk === 'upcoming' && b.balance > 0 ? `<button class="btn btn-primary btn-sm" type="button" data-pay="${b.id}">Pay ${inr(b.balance)}</button>` : ''}
          ${bk === 'upcoming' ? `<button class="btn btn-soft btn-sm" type="button" data-cancel="${b.id}">Cancel</button>` : ''}
          ${bk === 'completed' ? `<button class="btn btn-soft btn-sm" type="button" data-review="${b.id}"${b.review ? ' disabled' : ''}><i class="ri-star-line"></i>${b.review ? 'Reviewed' : 'Review'}</button>` : ''}
          ${bk === 'completed' && b.kind === 'package' ? `<a class="btn btn-soft btn-sm" href="package.html?id=${b.itemId}"><i class="ri-refresh-line"></i>Book again</a>` : ''}
        </div>
      </div>
    </article>`;
  }

  function renderTrips() {
    const u = TK.auth.user(); if (!u || !$('#tripList')) return;
    $$('#tripTabs button').forEach(b => b.classList.toggle('is-active', b.dataset.tt === tripTab));
    const list = mine(u).filter(b => bucket(b) === tripTab).sort((a, b) => (tripTab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    const empty = {
      upcoming: ['No upcoming trips — yet', 'Your next adventure is a few clicks away.', '<a class="btn btn-primary" href="packages.html">Explore trips</a><a class="btn btn-outline" href="safari.html">Book a jeep safari</a>'],
      completed: ['No completed trips', 'Trips you finish will appear here with your vouchers and reviews.', ''],
      cancelled: ['Nothing cancelled', 'Good news — every plan is still on.', '']
    }[tripTab];
    $('#tripList').innerHTML = list.length ? list.map(tripCard).join('')
      : `<div class="empty"><img src="assets/img/jeep.png" alt=""><h3>${empty[0]}</h3><p>${empty[1]}</p><div class="btn-row" style="justify-content:center">${empty[2]}</div></div>`;
  }

  /* ---------- wishlist ---------- */
  function wishHTML() {
    const list = TK.wish.list().map(TK.pkg).filter(Boolean);
    return `<div class="acc-pane-head"><div><span class="eyebrow">Saved for later</span><h2 style="margin-top:8px">Wishlist</h2></div>${list.length ? '<a class="link-arrow" href="packages.html">Find more trips <i class="ri-arrow-right-line"></i></a>' : ''}</div>
      ${list.length ? `<div class="pkg-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">${list.map((p, i) => TK.pkgCard(p, { i })).join('')}</div>`
        : `<div class="empty"><img src="assets/img/jeep.png" alt=""><h3>Your wishlist is empty</h3><p>Tap the <i class="ri-heart-3-line"></i> on any trip to save it here for later.</p><a class="btn btn-primary" href="packages.html">Browse trips</a></div>`}`;
  }

  /* ---------- enquiries ---------- */
  function enqHTML(u) {
    const list = myEnq(u);
    const icon = t => (t === 'custom' ? 'ri-route-line' : t === 'contact' ? 'ri-mail-line' : 'ri-chat-3-line');
    return `<div class="acc-pane-head"><div><span class="eyebrow">Requests &amp; questions</span><h2 style="margin-top:8px">Enquiries</h2></div><a class="btn btn-outline" href="plan.html"><i class="ri-route-line"></i>Plan a custom trip</a></div>
      ${list.length ? list.map(e => {
        const d = e.details;
        const summary = d ? `${esc(d.month)} · ${d.nights} nights · ${esc(d.group)} · ${inr(d.budget)}/person` : esc(e.message || `${e.pax || ''} travellers${e.date ? ' · ' + TK.fmtDate(e.date) : ''}`);
        const fresh = Date.now() - new Date(e.createdAt) < 36e5;
        return `<div class="enq"><i class="${icon(e.type)}"></i><div><h4>${esc(e.subject)}</h4><p>${summary}</p><p class="muted" style="font-size:13px;margin-top:6px">${esc(e.id)} · ${TK.fmtDate(e.createdAt.slice(0, 10), { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><span class="status ${fresh ? 'pending' : 'confirmed'}">${fresh ? 'Received' : 'Designer assigned'}</span></div>`;
      }).join('') : `<div class="empty"><img src="assets/img/jeep.png" alt=""><h3>No enquiries yet</h3><p>Ask about any trip or request a custom plan — replies show up here.</p><a class="btn btn-primary" href="plan.html">Plan my trip</a></div>`}`;
  }

  /* ---------- profile ---------- */
  function profileHTML(u) {
    return `<div class="acc-pane-head"><div><span class="eyebrow">Your details</span><h2 style="margin-top:8px">Profile</h2></div></div>
      <form class="panel" id="profileForm" novalidate>
        <div class="form-grid">
          <div class="field span-2"><label class="label" for="pfName">Full name</label><input class="input" id="pfName" name="name" value="${esc(u.name)}" autocomplete="name" required><span class="field-error">Please enter your name</span></div>
          <div class="field"><label class="label" for="pfEmail">Email</label><input class="input" id="pfEmail" value="${esc(u.email)}" disabled></div>
          <div class="field"><label class="label" for="pfPhone">Mobile</label><input class="input" id="pfPhone" name="phone" type="tel" value="${esc(u.phone || '')}" autocomplete="tel"></div>
          <div class="field"><label class="label" for="pfCity">City</label><input class="input" id="pfCity" name="city" value="${esc(u.city || '')}" autocomplete="address-level2"></div>
          <div class="field"><label class="label" for="pfDob">Birthday <span class="muted" style="font-weight:500">(for a surprise)</span></label><input class="input" id="pfDob" name="dob" type="date" value="${esc(u.dob || '')}"></div>
        </div>
        <label class="check" style="margin-top:18px"><input type="checkbox" name="news"${u.news === false ? '' : ' checked'}>Send me deals and travel stories (max once a month)</label>
        <div class="step-actions" style="margin-top:22px"><span class="hint"><i class="ri-shield-check-line"></i> Stored only in this browser (demo)</span><button class="btn btn-primary" type="submit">Save changes</button></div>
      </form>
      <div class="panel" style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">
        <div><strong style="display:block;font-size:16px">Reset demo data</strong><small class="muted">Clears bookings, wishlist, enquiries and your login from this browser.</small></div>
        <button class="btn btn-outline" type="button" id="resetDemo"><i class="ri-delete-bin-line"></i>Reset</button>
      </div>`;
  }
  function bindProfile() {
    const f = $('#profileForm'); if (!f) return;
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!TK.validate(f)) return;
      const u = TK.auth.user();
      TK.auth.login({ ...u, name: f.name.value.trim(), phone: f.phone.value.trim(), city: f.city.value.trim(), dob: f.dob.value, news: f.news.checked });
      TK.toast('Profile saved', 'success');
      render();
    });
    $('#resetDemo').addEventListener('click', () => {
      ['user', 'bookings', 'wish', 'enquiries', 'seeded', 'profiles'].forEach(k => TK.store.set(k, null));
      try { Object.keys(localStorage).filter(k => k.startsWith('tk_')).forEach(k => localStorage.removeItem(k)); } catch (err) { /* ignore */ }
      TK.toast('Demo data cleared');
      setTimeout(() => location.replace('account.html'), 600);
    });
  }

  /* ---------- actions ---------- */
  function daysUntil(b) { return Math.round((TK.parseISO(b.date) - TK.today()) / 864e5); }
  function refundFor(b) {
    const d = daysUntil(b);
    const pct = b.kind === 'package' ? (d >= 15 ? 100 : d >= 7 ? 50 : 0) : (d >= 2 ? 100 : 0);
    return { pct, amount: Math.round((b.paid * pct) / 100), days: d };
  }

  root.addEventListener('click', e => {
    const t = e.target;
    const pn = t.closest('.acc-nav [data-pane]'); if (pn) setPane(pn.dataset.pane);
    const tt = t.closest('[data-tt]'); if (tt) { tripTab = tt.dataset.tt; renderTrips(); }

    const vo = t.closest('[data-voucher]');
    if (vo) { $('#voucherBody').innerHTML = TK.ticketHTML(TK.bookings.get(vo.dataset.voucher)); TK.modal.open('voucherModal'); }

    const ca = t.closest('[data-cancel]');
    if (ca) {
      const b = TK.bookings.get(ca.dataset.cancel), r = refundFor(b);
      actionId = b.id;
      $('#cancelText').textContent = `${b.title} · ${TK.fmtDate(b.date)} (${TK.plural(r.days, 'day')} away)`;
      $('#cancelCalc').innerHTML = `
        <div class="sum-line"><span>Amount paid</span><span>${inr(b.paid)}</span></div>
        <div class="sum-line"><span>Refund as per policy</span><span>${r.pct}%</span></div>
        <div class="sum-line discount"><span><b>You get back</b></span><span>${inr(r.amount)}</span></div>
        <small class="muted">Refunds reach your original payment method in 5 – 7 working days.</small>`;
      TK.modal.open('cancelModal');
    }

    const py = t.closest('[data-pay]');
    if (py) {
      const b = TK.bookings.get(py.dataset.pay);
      actionId = b.id;
      $('#payText').textContent = `${b.title} · booking ${b.id}`;
      $('#payMethods').innerHTML = [['upi', 'ri-qr-code-line', 'UPI'], ['card', 'ri-bank-card-line', 'Card'], ['netbanking', 'ri-bank-line', 'Net banking'], ['emi', 'ri-calendar-schedule-line', 'EMI']]
        .map(([k, ic, l], i) => `<label class="opt-card"><input type="radio" name="bm" value="${k}"${i === 0 ? ' checked' : ''}><span class="opt-icon"><i class="${ic}"></i></span><span class="opt-body"><strong>${l}</strong></span><span class="opt-tick"><i class="ri-check-line"></i></span></label>`).join('');
      $('#payYes').innerHTML = `<i class="ri-lock-line"></i>Pay ${inr(b.balance)} securely`;
      TK.modal.open('payModal');
    }

    const rv = t.closest('[data-review]');
    if (rv) {
      const b = TK.bookings.get(rv.dataset.review);
      actionId = b.id; stars = 5;
      $('#reviewSub').textContent = b.title;
      $('#reviewText').value = '';
      paintStars();
      TK.modal.open('reviewModal');
    }
  });

  $('#cancelYes').addEventListener('click', () => {
    const b = TK.bookings.get(actionId); if (!b) return;
    const r = refundFor(b);
    TK.bookings.update(b.id, { status: 'cancelled', refund: r.amount, balance: 0, cancelledAt: new Date().toISOString() });
    TK.modal.close('cancelModal');
    TK.toast(`Booking ${b.id} cancelled · ${inr(r.amount)} refund initiated`, 'info');
    tripTab = 'cancelled'; render();
  });

  $('#payYes').addEventListener('click', () => {
    const b = TK.bookings.get(actionId); if (!b) return;
    TK.modal.close('payModal');
    const ov = $('#payOverlay'); $('#payMsg').textContent = 'Processing payment…'; ov.classList.add('is-open');
    setTimeout(() => { $('#payMsg').textContent = 'Payment successful!'; }, 1400);
    setTimeout(() => {
      ov.classList.remove('is-open');
      TK.bookings.update(b.id, { paid: b.paid + b.balance, balance: 0, plan: 'full' });
      TK.toast(`${inr(b.balance)} received — ${b.id} is fully paid`, 'success');
      render();
    }, 2000);
  });

  let stars = 5;
  function paintStars() {
    $('#reviewStars').innerHTML = [1, 2, 3, 4, 5].map(i => `<i class="${i <= stars ? 'ri-star-fill' : 'ri-star-line off'}" data-star="${i}" role="radio" aria-checked="${i === stars}" aria-label="${i} star${i > 1 ? 's' : ''}" tabindex="0"></i>`).join('');
  }
  $('#reviewStars').addEventListener('click', e => { const s = e.target.closest('[data-star]'); if (s) { stars = +s.dataset.star; paintStars(); } });
  $('#reviewSend').addEventListener('click', () => {
    TK.bookings.update(actionId, { review: { rating: stars, text: $('#reviewText').value.trim() } });
    TK.modal.close('reviewModal');
    TK.toast('Thanks for sharing your story!', 'success', 'ri-star-smile-line');
    render();
  });

  document.addEventListener('tk:auth', render);
  document.addEventListener('tk:wish', () => { const s = $('.acc-pane[data-pane="wishlist"]'); if (s) { s.innerHTML = wishHTML(); TK.wish.sync(); } });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (PANES.includes(h)) setPane(h, false); });

  render();
})();
