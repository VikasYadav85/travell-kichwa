/* Destinations, About & Contact */
(() => {
  const { $, $$, esc, inr } = TK;
  const page = document.body.dataset.page;

  /* ---------- Destinations ---------- */
  if (page === 'destinations') {
    $('#phImg').src = img('pangong2', 1920);
    const S = { region: TK.params.get('region') || '', q: '' };
    const render = () => {
      const q = S.q.toLowerCase();
      const list = DESTINATIONS.filter(d => (!S.region || d.region === S.region) && (!q || [d.name, d.area, d.tagline].join(' ').toLowerCase().includes(q)));
      $$('#dRegion button').forEach(b => b.classList.toggle('is-active', b.dataset.v === S.region));
      $('#dCount').innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? 'destination' : 'destinations'}`;
      $('#dGrid').innerHTML = list.length ? list.map((d, i) => {
        const n = TK.destPackages(d.slug).length;
        return `<a class="dcard" href="packages.html?dest=${d.slug}" style="animation-delay:${i * 50}ms">
          <img src="${img(d.img, 960)}" alt="${esc(d.name)}" loading="lazy">
          <span class="badge badge-glass"><i class="ri-sun-line"></i>Best: ${esc(d.best)}</span>
          <div class="dcard-body">
            <small>${esc(d.area)}</small>
            <h3>${esc(d.name)}</h3>
            <p>${esc(d.tagline)}</p>
            <div class="dcard-meta"><span>${TK.plural(n, 'trip')} <i class="ri-arrow-right-up-line"></i></span><span>from <strong>${inr(TK.fromPrice(d.slug))}</strong></span></div>
          </div>
        </a>`;
      }).join('') : `<div class="empty" style="grid-column:1/-1"><img src="assets/img/jeep.png" alt=""><h3>No destinations match</h3><p>Try another name — or ask us to plan a custom trip anywhere.</p><a class="btn btn-primary" href="plan.html">Plan a custom trip</a></div>`;
    };
    $('#dRegion').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { S.region = b.dataset.v; render(); } });
    $('#dQ').addEventListener('input', e => { S.q = e.target.value.trim(); render(); });
    render();
  }

  /* ---------- About ---------- */
  if (page === 'about') {
    $('#phImg').src = img('van_road', 1920);
    $('#ab1').src = img('thiksey', 960);
    $('#ab2').src = img('gypsy_safari', 960);
    $('#ab3').src = img('houseboat_tree', 960);
  }

  /* ---------- Contact ---------- */
  if (page === 'contact') {
    $('#phImg').src = img('shikara', 1920);
    $('#cHours').innerHTML = `<i class="ri-time-line"></i> ${esc(SITE.hours)}`;
    $('#contactCards').innerHTML = [
      [`tel:${SITE.phoneRaw}`, 'ri-phone-line', 'Call us', SITE.phone, ''],
      [TK.waLink(), 'ri-whatsapp-line', 'WhatsApp', 'Chat with a trip expert', 'wa'],
      [`mailto:${SITE.email}`, 'ri-mail-line', 'Email', SITE.email, ''],
      [`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`, 'ri-map-pin-2-line', 'Visit us', SITE.address, '']
    ].map(([href, ic, k, v, cls]) => `<a class="c-card ${cls}" href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><i class="${ic}"></i><small>${k}</small><strong>${esc(v)}</strong></a>`).join('');
    $('#mapFrame').src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;

    const u = TK.auth.user(), f = $('#contactForm');
    if (u) { f.name.value = u.name || ''; f.email.value = u.email || ''; f.phone.value = u.phone || ''; }
    const topic = TK.params.get('topic'); if (topic) f.topic.value = topic;
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!TK.validate(f)) return;
      const item = TK.enquiries.add({ type: 'contact', subject: f.topic.value, name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim().toLowerCase(), message: f.message.value.trim(), month: f.month.value });
      $('#contactPanel').innerHTML = `<div class="p-done" style="padding:30px 0">
        <div class="success-mark"><i class="ri-check-line"></i></div>
        <h3>Message sent!</h3>
        <p>Thanks, ${esc(item.name.split(' ')[0])}. Your reference is <b>${item.id}</b> — a trip expert will get back to you within 2 working hours.</p>
        <div class="btn-row" style="justify-content:center;margin-top:24px"><a class="btn btn-primary" href="packages.html">Browse trips meanwhile</a><a class="btn btn-wa" href="${TK.waLink(`Hi! I just sent enquiry ${item.id}.`)}" target="_blank" rel="noopener"><i class="ri-whatsapp-line"></i>WhatsApp us</a></div>
      </div>`;
      TK.toast(`Message received — ref ${item.id}`, 'success', 'ri-mail-send-line');
    });

    const EXTRA = [
      ['What documents do I need?', 'A government photo ID for every traveller (passport for international trips). For Ladakh and Spiti, we arrange inner-line permits using the same ID.'],
      ['How do I pay the balance?', 'Log in to My Trips and tap “Pay balance” — UPI, cards, net banking and EMI are all supported. We\'ll also send you a secure link on WhatsApp.'],
      ['Do you arrange group or corporate trips?', 'Yes! From college groups to company offsites, we handle transport, stays, activities and on-trip coordination. Use Plan My Trip and choose “Corporate”.']
    ];
    $('#faqList').innerHTML = FAQS.concat(EXTRA).map(([q, a], i) => `<div class="acc-item${i === 1 ? ' is-open' : ''}"><button class="acc-head" type="button" aria-expanded="${i === 1}">${esc(q)}<i class="ri-add-line"></i></button><div class="acc-body"><div><p>${esc(a)}</p></div></div></div>`).join('');
    if (location.hash === '#faq') setTimeout(() => $('#faq').scrollIntoView({ behavior: 'smooth' }), 300);
  }
})();
