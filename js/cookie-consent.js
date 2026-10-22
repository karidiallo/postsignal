/* ============================================================
   PostSignal — zgoda na cookies (analityka / marketing)
   Działa na wszystkich stronach (główne PL/EN + prawne).
   Język bierze z <html lang>.

   JAK TO DZIAŁA
   • Dopóki poniżej jest pusty GTM_ID, strona NIC nie śledzi i baner
     się nie pokazuje (zgodnie z obecną Polityką cookies).
   • Po wklejeniu GTM_ID: baner pojawia się przy pierwszej wizycie,
     a Google Tag Manager ładuje się DOPIERO po „Akceptuję wszystkie”.
   • „Tylko niezbędne” nie ładuje niczego.
   • Wybór można zmienić w każdej chwili: link „Ustawienia cookies”
     w stopce (dodawany automatycznie, gdy skrypt jest aktywny).
   ============================================================ */
(function () {
  'use strict';

  /* ---------- KONFIGURACJA ---------- */
  var GTM_ID = '';                 // np. 'GTM-XXXXXXX'  ← wklej ID kontenera PostSignal
  var STORAGE_KEY = 'ps_cookie_consent';
  var POLICY_VERSION = 1;          // zmień na 2, 3… gdy zmienisz zakres śledzenia → baner wróci
  var MONTHS_VALID = 12;           // po tylu miesiącach pytamy ponownie

  /* ---------- TEKSTY ---------- */
  var PL = document.documentElement.lang === 'pl';
  var TXT = PL ? {
    title: 'Pliki cookies',
    body: 'Strona działa bez cookies. Z Twoją zgodą włączymy analitykę, by sprawdzać, co działa, i ulepszać serwis. Zgodę możesz zmienić w każdej chwili. Szczegóły: ',
    policy: 'Polityka cookies',
    policyUrl: '/pl/polityka-cookies/',
    reject: 'Tylko niezbędne',
    accept: 'Akceptuję wszystkie',
    settings: 'Ustawienia cookies'
  } : {
    title: 'Cookies',
    body: 'This site works without cookies. With your consent we’ll turn on analytics to see what works and improve the site. You can change your choice at any time. Details: ',
    policy: 'Cookie Policy',
    policyUrl: '/cookie-policy/',
    reject: 'Necessary only',
    accept: 'Accept all',
    settings: 'Cookie settings'
  };

  /* ---------- STORAGE (odporny na blokadę localStorage) ---------- */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || c.v !== POLICY_VERSION || (c.a !== 'all' && c.a !== 'essential')) return null;
      var ageMs = Date.now() - (c.t || 0);
      if (ageMs > MONTHS_VALID * 30 * 24 * 3600 * 1000) return null;
      return c.a;
    } catch (e) { return null; }
  }
  function writeConsent(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: POLICY_VERSION, a: choice, t: Date.now() }));
    } catch (e) { /* tryb prywatny — wybór obowiązuje do końca wizyty */ }
  }

  /* ---------- ŁADOWANIE NARZĘDZI (tylko po zgodzie) ---------- */
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded || !GTM_ID) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }

  /* Wycofanie zgody: kasujemy cookies Google i przeładowujemy stronę,
     bo już załadowanego skryptu nie da się „wyładować”. */
  function clearAnalyticsCookies() {
    var host = location.hostname, parts = host.split('.'), domains = ['', host];
    for (var i = 1; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_gcl)/.test(name)) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  /* ---------- STYLE (samodzielne — bez zależności od style.css) ---------- */
  function injectStyle() {
    var css =
      '.ps-cc{position:fixed;left:50%;bottom:20px;z-index:2000;width:min(760px,calc(100% - 32px));' +
      'transform:translate(-50%,24px);opacity:0;visibility:hidden;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .3s,visibility 0s .4s;' +
      'display:flex;align-items:center;gap:20px 28px;padding:20px 24px;border-radius:20px;' +
      'background:rgba(14,15,12,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);' +
      'border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 60px -20px rgba(0,0,0,.7);' +
      'color:var(--fg,#f5f1e8);font-family:"Archivo","Arial",sans-serif;}' +
      '.ps-cc.show{transform:translate(-50%,0);opacity:1;visibility:visible;transition-delay:0s}' +
      '.ps-cc p{margin:0;font-size:13px;line-height:1.5;color:var(--mute,#b9b3a3);flex:1}' +
      '.ps-cc b{display:block;color:var(--fg,#f5f1e8);font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-stretch:112%;margin-bottom:4px}' +
      '.ps-cc a{color:var(--fg,#f5f1e8);text-decoration:underline;text-decoration-color:var(--acc,#e0c88f);text-underline-offset:3px}' +
      '.ps-cc-act{display:flex;gap:10px;flex:none}' +
      '.ps-cc button{font:inherit;font-stretch:112%;font-weight:800;font-size:11px;letter-spacing:.1em;text-transform:uppercase;' +
      'padding:13px 20px;border-radius:99px;cursor:pointer;white-space:nowrap;transition:filter .2s,transform .2s,border-color .2s}' +
      '.ps-cc-yes{background:var(--acc,#e0c88f);color:#0b0b09;border:1px solid var(--acc,#e0c88f)}' +
      '.ps-cc-no{background:transparent;color:var(--fg,#f5f1e8);border:1px solid rgba(255,255,255,.4)}' +
      '.ps-cc button:hover{filter:brightness(1.1);transform:translateY(-1px)}' +
      '.ps-cc-no:hover{border-color:var(--fg,#f5f1e8)}' +
      '.ps-cc button:focus-visible{outline:2px solid var(--fg,#f5f1e8);outline-offset:3px}' +
      '.ps-cc-link{background:none;border:0;padding:6px 0;font:inherit;font-size:11px;letter-spacing:.12em;text-transform:uppercase;' +
      'color:var(--mute,#b9b3a3);cursor:pointer;transition:color .2s}' +
      '.ps-cc-link:hover,.ps-cc-link:focus-visible{color:var(--acc,#e0c88f)}' +
      '@media(max-width:640px){.ps-cc{flex-direction:column;align-items:stretch;bottom:12px;padding:18px}' +
      '.ps-cc-act{flex-direction:column-reverse}.ps-cc button{width:100%;padding:15px 20px}}' +
      '@media(prefers-reduced-motion:reduce){.ps-cc{transition:none}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- BANER ---------- */
  var banner;
  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'ps-cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', TXT.title);
    banner.innerHTML =
      '<p><b>' + TXT.title + '</b>' + TXT.body +
      '<a href="' + TXT.policyUrl + '">' + TXT.policy + '</a>.</p>' +
      '<div class="ps-cc-act">' +
      '<button type="button" class="ps-cc-no" data-cc="essential">' + TXT.reject + '</button>' +
      '<button type="button" class="ps-cc-yes" data-cc="all">' + TXT.accept + '</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]');
      if (b) choose(b.getAttribute('data-cc'));
    });
  }
  function showBanner() {
    if (!banner) buildBanner();
    requestAnimationFrame(function () { banner.classList.add('show'); });
  }
  function hideBanner() { if (banner) banner.classList.remove('show'); }

  function choose(choice) {
    var previous = readConsent();
    writeConsent(choice);
    hideBanner();
    if (choice === 'all') {
      loadAnalytics();
    } else if (previous === 'all' || analyticsLoaded) {
      clearAnalyticsCookies();
      location.reload();
    }
  }

  /* ---------- LINK „USTAWIENIA COOKIES” W STOPCE ---------- */
  function injectSettingsLink() {
    document.querySelectorAll('.flinks, .mlegal').forEach(function (nav) {
      if (nav.querySelector('.ps-cc-link')) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ps-cc-link';
      b.textContent = TXT.settings;
      b.addEventListener('click', showBanner);
      nav.appendChild(b);
    });
  }

  /* ---------- START ---------- */
  function init() {
    if (!GTM_ID) return;                 // nic do zgody → brak banera, brak śledzenia
    injectStyle();
    injectSettingsLink();
    var consent = readConsent();
    if (consent === 'all') loadAnalytics();
    else if (!consent) showBanner();
  }

  window.PSCookies = { open: function () { if (GTM_ID) showBanner(); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
