/* =========================================================
   Travell Kichwa — shared app logic (demo, no backend)
   Data is kept in localStorage so the full booking flow works.
   ========================================================= */

const TK = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- storage (falls back to memory) ---------- */
  const mem = {};
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem('tk_' + k); if (v !== null) return JSON.parse(v); } catch (e) { /* private mode */ }
      return k in mem ? mem[k] : d;
    },
    set(k, v) { mem[k] = v; try { localStorage.setItem('tk_' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------- formatting ---------- */
  const inr = n => '₹' + Math.round(n || 0).toLocaleString('en-IN');
  const params = new URLSearchParams(location.search);
  const pad = n => String(n).padStart(2, '0');
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parseISO = s => { if (!s) return null; const [y, m, d] = String(s).split('-').map(Number); return y ? new Date(y, m - 1, d) : null; };
  const fmtDate = (s, o = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) => { const d = s instanceof Date ? s : parseISO(s); return d ? d.toLocaleDateString('en-IN', o) : '—'; };
  const shortDate = s => fmtDate(s, { day: 'numeric', month: 'short' });
  const uid = (p = 'TK') => p + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const initials = name => (name || '?').split(/\s+/).filter(w => /^[a-z]/i.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
  const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + 's')}`;
  const travellersLabel = (a, c = 0) => plural(a, 'Adult') + (c ? ' · ' + plural(c, 'Child', 'Children') : '');
  const minTravelDate = () => isoDate(addDays(today(), 3));
  const defaultTravelDate = () => isoDate(addDays(today(), 21));

  /* ---------- data helpers ---------- */
  const pkg = id => PACKAGES.find(p => p.id === id);
  const dest = slug => DESTINATIONS.find(d => d.slug === slug);
  const destPackages = slug => PACKAGES.filter(p => p.dest === slug);
  const fromPrice = slug => Math.min(...destPackages(slug).map(p => p.price));
  const tier = id => TIERS.find(t => t.id === id) || TIERS[0];
  const tierPrice = (p, id) => { const t = tier(id); return t.mult === 1 ? p.price : Math.ceil(p.price * t.mult / 1000) * 1000 - 1; };
  const childPrice = adult => Math.ceil(adult * 0.6 / 100) * 100 - 1;
  const discountPct = p => Math.round((1 - p.price / p.old) * 100);
  const waLink = text => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text || 'Hi Travell Kichwa! I want to plan a trip.')}`;

  /* ---------- toast ---------- */
  function toast(msg, type = 'info', icon) {
    let wrap = $('.toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const ic = icon || (type === 'success' ? 'ri-checkbox-circle-fill' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<i class="${ic}"></i><span>${esc(msg)}</span>`;
    wrap.appendChild(el);
    while (wrap.children.length > 3) wrap.firstChild.remove();
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 3400);
  }

  /* ---------- modal ---------- */
  const modal = {
    open(id) {
      const m = typeof id === 'string' ? document.getElementById(id) : id;
      if (!m) return;
      m.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      const f = m.querySelector('.modal-card input:not([type=hidden]), .modal-card select, .modal-card textarea');
      setTimeout(() => f && f.focus({ preventScroll: true }), 80);
    },
    close(id) {
      const m = typeof id === 'string' ? document.getElementById(id) : id;
      if (!m) return;
      m.classList.remove('is-open');
      if (!$('.modal.is-open') && !$('.drawer.is-open')) document.body.style.overflow = '';
    }
  };

  /* ---------- form validation ---------- */
  function validate(form) {
    let first = null;
    $$('input, select, textarea', form).forEach(el => {
      const f = el.closest('.field');
      if (!f || el.closest('[hidden]') || !(el.required || el.dataset.validate)) return;
      const v = el.value.trim();
      let ok = el.type === 'checkbox' ? el.checked : v !== '';
      if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (ok && el.type === 'tel') ok = v.replace(/\D/g, '').length >= 10;
      if (ok && el.minLength > 0) ok = v.length >= el.minLength;
      if (ok && el.dataset.validate === 'card') ok = v.replace(/\D/g, '').length >= 15;
      if (ok && el.dataset.validate === 'expiry') ok = /^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(v);
      if (ok && el.dataset.validate === 'cvv') ok = /^\d{3,4}$/.test(v);
      if (ok && el.dataset.validate === 'upi') ok = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v);
      f.classList.toggle('has-error', !ok);
      if (!ok && !first) first = el;
    });
    if (first) { first.focus({ preventScroll: true }); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return !first;
  }

  /* ---------- auth (demo) ---------- */
  let pendingAuth = null;
  const auth = {
    user: () => store.get('user', null),
    login(u) {
      store.set('user', u);
      const profiles = store.get('profiles', {});
      profiles[u.email] = u; store.set('profiles', profiles);
      seedDemo(u);
      renderUserSlot();
      document.dispatchEvent(new CustomEvent('tk:auth', { detail: u }));
    },
    logout() {
      store.set('user', null);
      renderUserSlot();
      document.dispatchEvent(new CustomEvent('tk:auth', { detail: null }));
    },
    require(cb, mode = 'login') {
      const u = auth.user();
      if (u) return cb(u);
      pendingAuth = cb;
      openAuth(mode);
    }
  };

  /* ---------- wishlist ---------- */
  const wish = {
    list: () => store.get('wish', []),
    has: id => wish.list().includes(id),
    toggle(id) {
      const l = wish.list(); const i = l.indexOf(id);
      if (i > -1) l.splice(i, 1); else l.push(id);
      store.set('wish', l); wish.sync();
      document.dispatchEvent(new CustomEvent('tk:wish'));
      return i === -1;
    },
    sync() {
      const l = wish.list();
      $$('[data-wish]').forEach(b => {
        const on = l.includes(b.dataset.wish);
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
        const i = b.querySelector('i'); if (i) i.className = on ? 'ri-heart-3-fill' : 'ri-heart-3-line';
        const t = b.querySelector('[data-wish-label]'); if (t) t.textContent = on ? 'Saved' : 'Save';
      });
      $$('[data-wish-count]').forEach(c => { c.textContent = l.length; c.classList.toggle('is-zero', !l.length); });
    }
  };

  /* ---------- bookings & enquiries ---------- */
  const bookings = {
    all: () => store.get('bookings', []),
    add(b) { const l = bookings.all(); l.unshift(b); store.set('bookings', l); return b; },
    update(id, patch) { store.set('bookings', bookings.all().map(b => (b.id === id ? { ...b, ...patch } : b))); },
    get: id => bookings.all().find(b => b.id === id)
  };
  const enquiries = {
    all: () => store.get('enquiries', []),
    add(e) {
      const item = { id: uid('ENQ'), status: 'received', createdAt: new Date().toISOString(), owner: (auth.user() || {}).email || (e.email || '').toLowerCase(), ...e };
      const l = enquiries.all(); l.unshift(item); store.set('enquiries', l);
      return item;
    }
  };

  function seedDemo(u) {
    if (store.get('seeded', false)) return;
    const p = pkg('goa-beach-holiday');
    const d = addDays(today(), -150);
    const base = tierPrice(p, 'deluxe') * 2;
    const gst = Math.round(base * 0.05);
    const b = {
      id: 'TK-GOA7Q2', kind: 'package', itemId: p.id, title: p.title, image: p.cover, subtitle: p.places,
      date: isoDate(d), endDate: isoDate(addDays(d, p.nights)), nights: p.nights, adults: 2, children: 0,
      tier: 'deluxe', tierName: 'Deluxe', addons: [], lead: { name: u.name, email: u.email, phone: u.phone || '' },
      pricing: { base, addons: 0, discount: 0, gst, total: base + gst }, paid: base + gst, balance: 0,
      plan: 'full', method: 'upi', status: 'completed', createdAt: addDays(d, -35).toISOString(), demo: true, owner: u.email
    };
    store.set('bookings', [...bookings.all(), b]);
    store.set('seeded', true);
  }

  /* ---------- rides ---------- */
  function distanceKm(a, b) {
    const A = CITIES[a], B = CITIES[b];
    if (!A || !B) return null;
    const r = x => x * Math.PI / 180, R = 6371;
    const dLat = r(B[0] - A[0]), dLon = r(B[1] - A[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(A[0])) * Math.cos(r(B[0])) * Math.sin(dLon / 2) ** 2;
    return Math.max(20, Math.round((2 * R * Math.asin(Math.sqrt(h)) * 1.32) / 10) * 10);
  }
  function cabFare({ vehicle, from, to, trip = 'oneway', days = 1 }) {
    const v = VEHICLES.find(x => x.id === vehicle) || VEHICLES[1];
    if (trip === 'local') {
      const total = v.local * days;
      return { v, km: 80 * days, days, known: true, total, lines: [[`Local · 8 hr / 80 km × ${plural(days, 'day')}`, total]] };
    }
    let km = distanceKm(from, to);
    const known = km !== null;
    if (!known) km = 250;
    const d = trip === 'round' ? Math.max(days, Math.ceil((km * 2) / 350)) : Math.max(1, Math.ceil(km / 350));
    const billKm = trip === 'round' ? Math.max(km * 2, 250 * d) : Math.max(km, 250);
    const kmCost = billKm * v.rate, allowance = v.allowance * d;
    return { v, km, billKm, days: d, known, total: kmCost + allowance, lines: [[`${billKm.toLocaleString('en-IN')} km × ₹${v.rate}/km`, kmCost], [`Driver allowance × ${plural(d, 'day')}`, allowance]] };
  }

  /* ---------- voucher graphics ---------- */
  function barcode(text) {
    const seq = [2, 1, 1];
    [...String(text)].forEach(ch => { const n = ch.charCodeAt(0); seq.push(1 + (n % 3), 1 + ((n >> 2) % 2), 1 + ((n >> 3) % 3), 1 + ((n >> 1) % 2)); });
    seq.push(1, 1, 2);
    let x = 0, bars = '';
    seq.forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="60"/>`; x += w; });
    return `<svg class="barcode" viewBox="0 0 ${x} 60" preserveAspectRatio="none" aria-hidden="true" fill="#1F1611">${bars}</svg>`;
  }
  function qr(seedText, size = 25) {
    let seed = hash(seedText) || 1;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9);
    let cells = '';
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!inFinder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    return `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" fill="#1F1611" aria-label="Demo UPI QR code">${cells}${finder(0, 0)}${finder(size - 7, 0)}${finder(0, size - 7)}</svg>`;
  }
  const STATUS = { confirmed: 'Confirmed', pending: 'Pending', cancelled: 'Cancelled', completed: 'Completed' };
  function ticketHTML(b) {
    const d = o => fmtDate(b.date, o);
    const rows = b.kind === 'package' ? [
      ['Travel dates', `${d({ day: 'numeric', month: 'short' })} – ${fmtDate(b.endDate, { day: 'numeric', month: 'short', year: 'numeric' })}`],
      ['Travellers', travellersLabel(b.adults, b.children)],
      ['Stay category', b.tierName],
      ['Lead traveller', b.lead.name],
      ['Mobile', b.lead.phone || '—'],
      ['Add-ons', b.addons && b.addons.length ? b.addons.join(', ') : 'None']
    ] : b.kind === 'safari' ? [
      ['Safari date', d()],
      ['Time slot', b.slotLabel],
      ['Guests', `${b.pax} · ${plural(b.jeeps, 'jeep')}`],
      ['Lead guest', b.lead.name],
      ['Mobile', b.lead.phone || '—'],
      ['Reporting', '30 min before slot, main gate']
    ] : [
      ['Pickup', `${d({ day: 'numeric', month: 'short', year: 'numeric' })} · ${b.time}`],
      ['Route', b.trip === 'local' ? `${b.from} · local` : `${b.from} → ${b.to}`],
      ['Trip', b.tripLabel],
      ['Vehicle', b.vehicleName],
      ['Passenger', b.lead.name],
      ['Mobile', b.lead.phone || '—']
    ];
    return `<div class="ticket print-area">
      <div class="ticket-main">
        <div class="ticket-top"><img src="assets/img/logo.png" alt="Travell Kichwa"><span class="status ${b.status}">${STATUS[b.status] || b.status}</span></div>
        <div class="ticket-title">${esc(b.title)}</div>
        <div class="ticket-sub"><i class="ri-map-pin-2-line"></i>${esc(b.subtitle)}</div>
        <div class="ticket-grid">${rows.map(([k, v]) => `<div><small>${k}</small><strong>${esc(v)}</strong></div>`).join('')}</div>
      </div>
      <div class="ticket-stub">
        <div><small>Booking ID</small><div class="bid">${esc(b.id)}</div></div>
        ${barcode(b.id)}
        <div><small>Amount paid</small><div class="paid">${inr(b.paid)}</div></div>
        <div><small>${b.status === 'cancelled' ? 'Refund' : b.balance > 0 ? 'Balance due by ' + shortDate(b.balanceDue) : 'Balance'}</small><strong>${b.status === 'cancelled' ? inr(b.refund || 0) : b.balance > 0 ? inr(b.balance) : 'Fully paid'}</strong></div>
      </div>
    </div>`;
  }

  /* ---------- UI snippets ---------- */
  function stars(r) {
    let h = '';
    for (let i = 1; i <= 5; i++) h += `<i class="${r >= i ? 'ri-star-fill' : r >= i - 0.5 ? 'ri-star-half-s-fill' : 'ri-star-line off'}"></i>`;
    return `<span class="stars" aria-label="${r} out of 5">${h}</span>`;
  }

  function stepper(name, value, min, max) {
    return `<div class="stepper" data-name="${name}" data-min="${min}" data-max="${max}">
      <button type="button" data-step="-1" aria-label="Decrease ${name}" ${value <= min ? 'disabled' : ''}><i class="ri-subtract-line"></i></button>
      <output aria-live="polite">${value}</output>
      <button type="button" data-step="1" aria-label="Increase ${name}" ${value >= max ? 'disabled' : ''}><i class="ri-add-line"></i></button>
    </div>`;
  }

  function pkgCard(p, o = {}) {
    const url = `package.html?id=${p.id}${o.query || ''}`;
    const feats = p.feats.map(f => `<li><i class="${FEATURES[f][0]}"></i>${FEATURES[f][1]}</li>`).join('');
    return `<article class="pkg-card" style="animation-delay:${(o.i || 0) * 60}ms">
      <a class="pkg-media" href="${url}" tabindex="-1" aria-hidden="true">
        <img src="${img(p.cover, 960)}" alt="" loading="lazy">
        ${p.badge ? `<span class="badge badge-glass">${esc(p.badge)}</span>` : ''}
        <span class="badge badge-dark pkg-duration"><i class="ri-time-line"></i>${p.nights}N / ${p.days}D</span>
      </a>
      <button class="wish-btn" type="button" data-wish="${p.id}" aria-label="Save ${esc(p.title)} to wishlist" aria-pressed="false"><i class="ri-heart-3-line"></i></button>
      <div class="pkg-body">
        <div class="pkg-top"><span class="pkg-loc"><i class="ri-map-pin-2-line"></i>${esc(p.places)}</span><span class="rating"><i class="ri-star-fill"></i>${p.rating}<span>(${p.reviews})</span></span></div>
        <h3 class="pkg-title"><a href="${url}">${esc(p.title)}</a></h3>
        <ul class="pkg-feats">${feats}</ul>
      </div>
      <div class="pkg-foot">
        <div class="price"><small>Starts from <s>${inr(p.old)}</s></small><strong>${inr(p.price)} <span>/ person</span></strong></div>
        <a class="pkg-go" href="${url}" aria-label="View ${esc(p.title)}"><i class="ri-arrow-right-up-line"></i></a>
      </div>
    </article>`;
  }

  function destTile(d, i = 0) {
    return `<a class="dest-tile" href="packages.html?dest=${d.slug}" style="animation-delay:${i * 70}ms">
      <img src="${img(d.img, i === 0 ? 1280 : 960)}" alt="${esc(d.name)}" loading="lazy">
      <span class="badge badge-glass"><i class="ri-sun-line"></i>${esc(d.best)}</span>
      <span class="dest-arrow"><i class="ri-arrow-right-up-line"></i></span>
      <div class="dest-info"><h3>${esc(d.name)}</h3><p><span>${esc(d.tagline)}</span><span><i class="ri-price-tag-3-line"></i>from ${inr(fromPrice(d.slug))}</span></p></div>
    </a>`;
  }

  /* ---------- header, drawer, footer ---------- */
  const NAV = [
    ['destinations.html', 'Destinations', 'destinations'],
    ['packages.html', 'Packages', 'packages'],
    ['safari.html', 'Jeep Safari', 'safari'],
    ['plan.html', 'Plan My Trip', 'plan'],
    ['about.html', 'About', 'about'],
    ['contact.html', 'Contact', 'contact']
  ];

  function renderChrome() {
    const page = document.body.dataset.page || '';
    const year = new Date().getFullYear();

    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `<div class="container"><nav class="nav" aria-label="Main">
        <a class="nav-logo" href="index.html" aria-label="Travell Kichwa home"><img src="assets/img/logo.png" alt="Travell Kichwa — Search. Plan. Travel." width="90" height="50"></a>
        <ul class="nav-links">${NAV.map(([h, l, k]) => `<li><a href="${h}"${page === k ? ' class="is-active" aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul>
        <div class="nav-actions">
          <a class="icon-btn nav-wish" href="account.html#wishlist" aria-label="Wishlist"><i class="ri-heart-3-line"></i><span class="count-dot is-zero" data-wish-count>0</span></a>
          <span id="userSlot"></span>
          <a class="btn btn-primary btn-sm nav-cta" href="packages.html"><i class="ri-suitcase-3-line"></i>Book a trip</a>
          <button class="icon-btn nav-burger" type="button" aria-label="Open menu" aria-expanded="false" data-drawer-open><i class="ri-menu-4-line"></i></button>
        </div>
        <div class="user-menu" id="userMenu" role="menu"></div>
      </nav></div>`;
    document.body.prepend(header);

    const drawer = document.createElement('div');
    drawer.className = 'drawer'; drawer.id = 'drawer';
    drawer.innerHTML = `<div class="drawer-backdrop" data-drawer-close></div>
      <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer-top"><img src="assets/img/logo.png" alt="Travell Kichwa"><button class="icon-btn bordered" type="button" data-drawer-close aria-label="Close menu"><i class="ri-close-line"></i></button></div>
        <nav class="drawer-links">
          <a href="index.html"${page === 'home' ? ' class="is-active"' : ''}>Home <i class="ri-arrow-right-up-line"></i></a>
          ${NAV.map(([h, l, k]) => `<a href="${h}"${page === k ? ' class="is-active"' : ''}>${l} <i class="ri-arrow-right-up-line"></i></a>`).join('')}
          <a href="account.html"${page === 'account' ? ' class="is-active"' : ''}>My Trips <i class="ri-arrow-right-up-line"></i></a>
        </nav>
        <div class="drawer-cta">
          <a class="btn btn-primary btn-lg" href="packages.html"><i class="ri-suitcase-3-line"></i>Book a trip</a>
          <a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i>Chat on WhatsApp</a>
        </div>
        <div class="drawer-contact">
          <a href="tel:${SITE.phoneRaw}"><i class="ri-phone-line"></i>${SITE.phone}</a>
          <a href="mailto:${SITE.email}"><i class="ri-mail-line"></i>${SITE.email}</a>
        </div>
      </aside>`;
    document.body.appendChild(drawer);

    if (!document.body.hasAttribute('data-no-footer')) {
      const footer = document.createElement('footer');
      footer.className = 'footer';
      footer.innerHTML = `<div class="container">
        <div class="footer-news">
          <h3>Secret deals & road stories, <span class="script">once a month.</span></h3>
          <form class="news-form" data-newsletter novalidate>
            <input type="email" name="email" placeholder="Your email address" aria-label="Email address" autocomplete="email">
            <button class="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
        <div class="footer-grid">
          <div>
            <a class="footer-logo" href="index.html"><img src="assets/img/logo.png" alt="Travell Kichwa"></a>
            <p class="footer-about">Handcrafted road trips, jeep safaris and holidays across India and beyond. You search and dream — we plan every detail.</p>
            <div class="socials">
              <a href="https://instagram.com/${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="ri-instagram-line"></i></a>
              <a href="https://facebook.com/${SITE.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="ri-facebook-circle-line"></i></a>
              <a href="https://youtube.com/@${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><i class="ri-youtube-line"></i></a>
              <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ri-whatsapp-line"></i></a>
            </div>
          </div>
          <div><h4>Explore</h4><ul class="footer-links">
            <li><a href="destinations.html">Destinations</a></li>
            <li><a href="packages.html">Tour packages</a></li>
            <li><a href="safari.html">Jeep safari & cabs</a></li>
            <li><a href="plan.html">Plan my trip</a></li>
            <li><a href="account.html">My trips</a></li>
            <li><a href="about.html">About us</a></li>
          </ul></div>
          <div><h4>Top trips</h4><ul class="footer-links">
            ${['ladakh-jeep-expedition', 'kashmir-paradise', 'kerala-backwaters', 'jim-corbett-jeep-safari', 'dubai-delights', 'bali-honeymoon'].map(id => `<li><a href="package.html?id=${id}">${esc(pkg(id).title)}</a></li>`).join('')}
          </ul></div>
          <div><h4>Get in touch</h4><ul class="footer-contact">
            <li><i class="ri-phone-line"></i><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></li>
            <li><i class="ri-mail-line"></i><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><i class="ri-map-pin-2-line"></i><span>${SITE.address}</span></li>
            <li><i class="ri-time-line"></i><span>${SITE.hours}</span></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} ${SITE.name}. All rights reserved. · <a href="contact.html#faq">Cancellation policy</a></span>
          <div class="pay-chips" aria-label="Payment methods"><span>UPI</span><span>VISA</span><span>MASTERCARD</span><span>RUPAY</span><span>NET BANKING</span></div>
        </div>
      </div>`;
      document.body.appendChild(footer);
    }

    const extras = document.createElement('div');
    extras.innerHTML = `
      <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="ri-whatsapp-line"></i><span class="wa-tip">Chat with a trip expert</span></a>
      <button class="to-top" type="button" aria-label="Back to top"><i class="ri-arrow-up-line"></i></button>
      <div class="modal" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
        <div class="modal-backdrop" data-close-modal></div>
        <div class="modal-card">
          <button class="icon-btn modal-close" type="button" data-close-modal aria-label="Close"><i class="ri-close-line"></i></button>
          <img class="modal-logo" src="assets/img/logo.png" alt="">
          <h3 id="authTitle">Welcome back</h3>
          <p class="sub" id="authSub">Log in to manage bookings, your wishlist and trip plans.</p>
          <div class="segmented auth-switch" role="tablist">
            <button type="button" class="is-active" data-auth-tab="login">Log in</button>
            <button type="button" data-auth-tab="signup">Create account</button>
          </div>
          <form class="form-stack" id="authForm" novalidate>
            <div class="field" data-signup hidden><label class="label" for="auName">Full name</label><input class="input" id="auName" name="name" autocomplete="name" placeholder="e.g. Aanya Sharma" required><span class="field-error">Please enter your name</span></div>
            <div class="field"><label class="label" for="auEmail">Email</label><input class="input" id="auEmail" type="email" name="email" autocomplete="email" placeholder="you@example.com" required><span class="field-error">Enter a valid email address</span></div>
            <div class="field" data-signup hidden><label class="label" for="auPhone">Mobile number</label><input class="input" id="auPhone" type="tel" name="phone" autocomplete="tel" placeholder="+91 98xxx xxxxx" required><span class="field-error">Enter a 10-digit mobile number</span></div>
            <div class="field"><label class="label" for="auPass">Password</label><input class="input" id="auPass" type="password" name="password" autocomplete="current-password" placeholder="Minimum 4 characters" minlength="4" required><span class="field-error">Password must be at least 4 characters</span></div>
            <button class="btn btn-primary btn-lg btn-block" type="submit" id="authSubmit">Log in</button>
          </form>
          <p class="modal-foot"><i class="ri-lock-line"></i> Demo mode — any email & password works.</p>
        </div>
      </div>
      <div class="modal" id="enquiryModal" role="dialog" aria-modal="true" aria-labelledby="enqTitle">
        <div class="modal-backdrop" data-close-modal></div>
        <div class="modal-card">
          <button class="icon-btn modal-close" type="button" data-close-modal aria-label="Close"><i class="ri-close-line"></i></button>
          <span class="eyebrow">Quick enquiry</span>
          <h3 id="enqTitle" style="margin-top:10px">Talk to a trip expert</h3>
          <p class="sub" id="enqSub">Share a few details — we'll call you back within 2 working hours.</p>
          <form class="form-stack" id="enquiryForm" novalidate>
            <div class="field"><label class="label" for="enName">Your name</label><input class="input" id="enName" name="name" autocomplete="name" required><span class="field-error">Please enter your name</span></div>
            <div class="form-grid">
              <div class="field"><label class="label" for="enPhone">Mobile</label><input class="input" id="enPhone" type="tel" name="phone" autocomplete="tel" required><span class="field-error">10-digit mobile number</span></div>
              <div class="field"><label class="label" for="enEmail">Email</label><input class="input" id="enEmail" type="email" name="email" autocomplete="email" required><span class="field-error">Enter a valid email</span></div>
              <div class="field"><label class="label" for="enDate">Travel date</label><input class="input" id="enDate" type="date" name="date"></div>
              <div class="field"><label class="label" for="enPax">Travellers</label><select class="select" id="enPax" name="pax">${[1, 2, 3, 4, 5, 6, 8, 10, 15].map(n => `<option${n === 2 ? ' selected' : ''}>${n}${n === 15 ? '+' : ''}</option>`).join('')}</select></div>
            </div>
            <div class="field"><label class="label" for="enMsg">Anything we should know?</label><textarea class="textarea" id="enMsg" name="message" rows="3" placeholder="Hotel preference, special occasion, budget…"></textarea></div>
            <button class="btn btn-primary btn-lg btn-block" type="submit"><i class="ri-send-plane-line"></i>Send enquiry</button>
          </form>
        </div>
      </div>`;
    while (extras.firstElementChild) document.body.appendChild(extras.firstElementChild);

    renderUserSlot();
    wish.sync();
  }

  function renderUserSlot() {
    const slot = $('#userSlot'), menu = $('#userMenu');
    if (!slot) return;
    const u = auth.user();
    if (!u) {
      slot.innerHTML = `<button class="icon-btn nav-user" type="button" data-auth="login" aria-label="Log in"><i class="ri-user-3-line"></i></button>`;
      menu.innerHTML = ''; menu.classList.remove('is-open');
      return;
    }
    slot.innerHTML = `<button class="icon-btn nav-user" type="button" data-user-menu aria-label="Account menu" aria-haspopup="true"><span class="avatar c1">${esc(initials(u.name))}</span></button>`;
    menu.innerHTML = `<div class="um-head"><strong>${esc(u.name)}</strong><small>${esc(u.email)}</small></div>
      <a href="account.html#trips" role="menuitem"><i class="ri-suitcase-3-line"></i>My trips</a>
      <a href="account.html#wishlist" role="menuitem"><i class="ri-heart-3-line"></i>Wishlist</a>
      <a href="account.html#enquiries" role="menuitem"><i class="ri-chat-smile-3-line"></i>Enquiries</a>
      <a href="account.html#profile" role="menuitem"><i class="ri-user-settings-line"></i>Profile</a>
      <button type="button" data-logout role="menuitem"><i class="ri-logout-box-r-line"></i>Log out</button>`;
  }

  function openAuth(mode = 'login') {
    setAuthMode(mode);
    modal.open('authModal');
  }
  function setAuthMode(mode) {
    const m = $('#authModal'); if (!m) return;
    m.dataset.mode = mode;
    $$('[data-auth-tab]', m).forEach(b => b.classList.toggle('is-active', b.dataset.authTab === mode));
    $$('[data-signup]', m).forEach(f => { f.hidden = mode !== 'signup'; f.classList.remove('has-error'); });
    $('#authTitle').textContent = mode === 'signup' ? 'Create your account' : 'Welcome back';
    $('#authSub').textContent = mode === 'signup' ? 'Save trips, track bookings and get member-only deals.' : 'Log in to manage bookings, your wishlist and trip plans.';
    $('#authSubmit').textContent = mode === 'signup' ? 'Create account' : 'Log in';
    $('#auPass').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  }

  let enquiryContext = {};
  function openEnquiry(ctx = {}) {
    enquiryContext = ctx;
    const u = auth.user();
    $('#enqTitle').textContent = ctx.title ? 'Enquire about this trip' : 'Talk to a trip expert';
    $('#enqSub').textContent = ctx.title ? `“${ctx.title}” — we'll call you back within 2 working hours.` : "Share a few details — we'll call you back within 2 working hours.";
    const f = $('#enquiryForm');
    if (u) { f.name.value = f.name.value || u.name; f.email.value = f.email.value || u.email; f.phone.value = f.phone.value || u.phone || ''; }
    f.date.min = minTravelDate();
    if (ctx.date) f.date.value = ctx.date;
    if (ctx.pax) f.pax.value = String(ctx.pax);
    modal.open('enquiryModal');
  }

  function closeDrawer() {
    const d = $('#drawer'); if (!d || !d.classList.contains('is-open')) return;
    d.classList.remove('is-open');
    $('[data-drawer-open]')?.setAttribute('aria-expanded', 'false');
    if (!$('.modal.is-open')) document.body.style.overflow = '';
  }

  /* ---------- global events ---------- */
  function bindGlobal() {
    document.addEventListener('click', e => {
      const t = e.target;

      if (t.closest('[data-close-modal]')) modal.close(t.closest('.modal'));

      if (t.closest('[data-drawer-open]')) { $('#drawer').classList.add('is-open'); t.closest('[data-drawer-open]').setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
      if (t.closest('[data-drawer-close]')) closeDrawer();

      const authBtn = t.closest('[data-auth]');
      if (authBtn) { e.preventDefault(); openAuth(authBtn.dataset.auth); }

      const tab = t.closest('[data-auth-tab]');
      if (tab) setAuthMode(tab.dataset.authTab);

      const um = $('#userMenu');
      if (t.closest('[data-user-menu]')) um.classList.toggle('is-open');
      else if (um && !t.closest('#userMenu')) um.classList.remove('is-open');

      if (t.closest('[data-logout]')) { auth.logout(); toast('You have been logged out'); if (document.body.dataset.page === 'account') location.reload(); }

      const enq = t.closest('[data-enquire]');
      if (enq) { e.preventDefault(); openEnquiry({ title: enq.dataset.enquire || '', type: enq.dataset.type || 'general' }); }

      // wishlist
      const w = t.closest('[data-wish]');
      if (w) {
        e.preventDefault(); e.stopPropagation();
        const added = wish.toggle(w.dataset.wish);
        w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
        const p = pkg(w.dataset.wish);
        toast(added ? `Saved “${p ? p.title : 'trip'}” to your wishlist` : 'Removed from wishlist', added ? 'success' : 'info', added ? 'ri-heart-3-fill' : 'ri-heart-3-line');
      }

      // steppers
      const sb = t.closest('.stepper [data-step]');
      if (sb) {
        const s = sb.closest('.stepper'), out = s.querySelector('output');
        const min = +s.dataset.min || 0, max = +s.dataset.max || 99;
        const v = Math.min(max, Math.max(min, (+out.textContent || 0) + +sb.dataset.step));
        out.textContent = v;
        s.querySelector('[data-step="-1"]').disabled = v <= min;
        s.querySelector('[data-step="1"]').disabled = v >= max;
        s.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { name: s.dataset.name, value: v } }));
      }

      // popovers
      const pt = t.closest('[data-pop-toggle]');
      const inside = t.closest('.popover, .suggest');
      $$('.popover.is-open, .suggest.is-open').forEach(p => {
        if (p === inside) return;
        if (pt && pt.closest('.has-pop') === p.closest('.has-pop') && p.classList.contains('popover')) return;
        p.classList.remove('is-open');
      });
      if (pt) { const p = pt.closest('.has-pop').querySelector('.popover'); p && p.classList.toggle('is-open'); }
      if (t.closest('[data-pop-close]')) t.closest('.popover')?.classList.remove('is-open');

      // accordions
      const ah = t.closest('.acc-head');
      if (ah) { const it = ah.closest('.acc-item'); it.classList.toggle('is-open'); ah.setAttribute('aria-expanded', it.classList.contains('is-open')); }

      if (t.closest('.to-top')) window.scrollTo({ top: 0, behavior: 'smooth' });

      const share = t.closest('[data-share]');
      if (share) {
        const data = { title: document.title, url: location.href };
        if (navigator.share) navigator.share(data).catch(() => {});
        else copy(location.href, 'Link copied to clipboard');
      }
      const cp = t.closest('[data-copy]');
      if (cp) copy(cp.dataset.copy, cp.dataset.copyMsg || 'Copied!');
    });

    document.addEventListener('input', e => { const f = e.target.closest('.field.has-error'); if (f) f.classList.remove('has-error'); });
    document.addEventListener('change', e => { const f = e.target.closest?.('.field.has-error'); if (f) f.classList.remove('has-error'); });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      $$('.modal.is-open').forEach(m => modal.close(m));
      $$('.popover.is-open, .suggest.is-open, .user-menu.is-open').forEach(p => p.classList.remove('is-open'));
      closeDrawer();
    });

    // auth submit
    $('#authForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      if (!validate(f)) return;
      const mode = $('#authModal').dataset.mode || 'login';
      const email = f.email.value.trim().toLowerCase();
      const known = store.get('profiles', {})[email];
      const nameFromEmail = email.split('@')[0].replace(/[._\-\d]+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase()) || 'Traveller';
      const u = mode === 'signup'
        ? { name: f.name.value.trim(), email, phone: f.phone.value.trim(), city: '' }
        : (known || { name: nameFromEmail, email, phone: '', city: '' });
      auth.login(u);
      modal.close('authModal');
      f.reset();
      toast(mode === 'signup' ? `Welcome aboard, ${u.name.split(' ')[0]}!` : `Welcome back, ${u.name.split(' ')[0]}!`, 'success', 'ri-hand-heart-line');
      if (pendingAuth) { const cb = pendingAuth; pendingAuth = null; cb(u); }
    });

    // enquiry submit
    $('#enquiryForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      if (!validate(f)) return;
      const item = enquiries.add({ type: enquiryContext.type || 'package', subject: enquiryContext.title || 'General enquiry', name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), date: f.date.value, pax: f.pax.value, message: f.message.value.trim() });
      modal.close('enquiryModal');
      f.message.value = '';
      toast(`Enquiry ${item.id} received — we'll call you shortly`, 'success');
    });

    // newsletter
    $$('[data-newsletter]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const v = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { toast('Please enter a valid email address', 'error'); f.email.focus(); return; }
      f.reset(); toast("You're subscribed! Watch your inbox for deals.", 'success', 'ri-mail-send-line');
    }));

    // header state + back-to-top
    const header = $('.site-header'), top = $('.to-top');
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle('is-scrolled', y > 30);
      top && top.classList.toggle('is-visible', y > 800);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function copy(text, msg) {
    const done = () => toast(msg, 'success', 'ri-file-copy-line');
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
    else fallback();
    function fallback() {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(text); }
      ta.remove();
    }
  }

  /* ---------- reveal on scroll ---------- */
  function reveal(root = document) {
    const els = $$('[data-reveal]:not(.in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------- smart sticky: tall sidebars scroll until their bottom is visible ---------- */
  function smartSticky() {
    const els = $$('[data-sticky]');
    if (!els.length) return;
    const fit = () => els.forEach(el => {
      if (getComputedStyle(el).position !== 'sticky') { el.style.top = ''; return; }
      const head = (($('.site-header .nav')?.getBoundingClientRect().bottom) || 90) + 14;
      el.style.top = Math.min(head, window.innerHeight - el.offsetHeight - 16) + 'px';
    });
    fit();
    window.addEventListener('resize', fit);
    if ('ResizeObserver' in window) els.forEach(el => new ResizeObserver(fit).observe(el));
  }

  /* ---------- image fallback: retry once, then a soft branded landscape ---------- */
  const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#EDE3D2'/><stop offset='1' stop-color='#D2BF95'/></linearGradient></defs><rect width='400' height='300' fill='url(#g)'/><circle cx='300' cy='86' r='24' fill='#FBF7F1' opacity='.75'/><path d='M0 228 90 138l58 50 82-92 92 104 78-50v150H0z' fill='#A6955C' opacity='.55'/><path d='M0 262l72-52 68 40 70-60 92 62 98-30v78H0z' fill='#6B432A' opacity='.38'/></svg>");
  document.addEventListener('error', e => {
    const el = e.target;
    if (!el || el.tagName !== 'IMG' || el.src.startsWith('data:')) return;
    if (!el.dataset.retry) { el.dataset.retry = '1'; const src = el.src; setTimeout(() => { el.src = src; }, 1200 + Math.random() * 2400); return; }
    el.src = FALLBACK_IMG;
  }, true);

  /* ---------- init ---------- */
  function init() {
    renderChrome();
    bindGlobal();
    reveal();
    smartSticky();
    $$('input[type="date"][data-min-today]').forEach(i => { i.min = minTravelDate(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  return {
    $, $$, esc, store, inr, params, isoDate, today, addDays, parseISO, fmtDate, shortDate, uid, initials, hash, plural,
    travellersLabel, minTravelDate, defaultTravelDate, pkg, dest, destPackages, fromPrice, tier, tierPrice, childPrice,
    discountPct, waLink, toast, modal, validate, auth, wish, bookings, enquiries, stars, stepper, pkgCard, destTile,
    reveal, openAuth, openEnquiry, copy, distanceKm, cabFare, barcode, qr, ticketHTML, STATUS
  };
})();
