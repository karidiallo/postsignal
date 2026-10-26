/* ============================================================
   PostSignal — sklep z materiałami
   TU DODAJESZ / EDYTUJESZ EBOOKI. Strona sama się z tego buduje (EN + PL).

   Pola produktu:
   id       – unikalny, krótki (np. 'reels-playbook')
   status   – 'live' (można kupić) | 'soon' (wkrótce → zapis na listę mailem)
   buyUrl   – link do płatności (Stripe Payment Link / Gumroad / Lemon Squeezy itp.)
              Puste = przycisk „Powiadom mnie” (mailto)
   cover    – opcjonalnie ścieżka do okładki, np. 'assets/shop/reels.webp' (bez niej: okładka generowana)
   price    – tekst ceny per język
   pages    – liczba stron, format – np. 'PDF'
   tag/title/desc/points – teksty per język
   ============================================================ */
(function(){
'use strict';
var MAIL='contact@postsignal.eu';
var LANG=document.documentElement.lang==='pl'?'pl':'en';
var BASE=document.documentElement.getAttribute('data-base')||'';

var UI={
 en:{buy:'Buy',notify:'Notify me',soon:'Coming soon',live:'Available now',pages:'pages',inside:'Inside',subject:'Notify me: ',body:'Please let me know when this ebook is available:\n',empty:'New materials are on the way.'},
 pl:{buy:'Kup',notify:'Powiadom mnie',soon:'Wkrótce',live:'Dostępny',pages:'stron',inside:'W środku',subject:'Powiadom mnie: ',body:'Proszę o informację, gdy ebook będzie dostępny:\n',empty:'Nowe materiały już wkrótce.'}
}[LANG];

/* PRZYKŁADOWE PRODUKTY – podmień tytuły, opisy, ceny i linki na swoje */
var PRODUCTS=[
 {id:'reels-playbook',status:'soon',buyUrl:'',cover:'',pages:40,format:'PDF',
  price:{en:'€19',pl:'79 zł'},
  tag:{en:'Reels · Beauty & clinics',pl:'Reelsy · Beauty i kliniki'},
  title:{en:'Reels that bring clients: a playbook for beauty & aesthetic clinics',pl:'Reelsy, które przyciągają klientów: poradnik dla beauty i klinik'},
  desc:{en:'How to choose topics, structure a short video and turn views into enquiries.',pl:'Jak wybierać tematy, budować krótkie wideo i zamieniać wyświetlenia w zapytania.'},
  points:{en:['Content ideas by service type','Shot list and script templates','What to publish after the Reel'],pl:['Pomysły na treści wg rodzaju usługi','Szablony scenariuszy i listy ujęć','Co publikować po Reelsie']}},
 {id:'hospitality-calendar',status:'soon',buyUrl:'',cover:'',pages:32,format:'PDF',
  price:{en:'€15',pl:'59 zł'},
  tag:{en:'Planning · Hotels & restaurants',pl:'Planowanie · Hotele i restauracje'},
  title:{en:'Content calendar for hotels and restaurants',pl:'Kalendarz contentu dla hoteli i restauracji'},
  desc:{en:'A 12-month plan of seasonal themes, formats and ready-to-shoot ideas.',pl:'12-miesięczny plan sezonowych tematów, formatów i gotowych pomysłów na zdjęcia i wideo.'},
  points:{en:['Month-by-month content themes','Weekly rhythm that fits a small team','Checklist for one shooting day'],pl:['Tematy miesiąc po miesiącu','Tygodniowy rytm dla małego zespołu','Checklista na jeden dzień zdjęciowy']}},
 {id:'ugc-brief-kit',status:'soon',buyUrl:'',cover:'',pages:24,format:'PDF',
  price:{en:'€12',pl:'49 zł'},
  tag:{en:'UGC · Brands & services',pl:'UGC · Marki i usługi'},
  title:{en:'UGC brief kit: how to order content that works',pl:'Zestaw do briefowania UGC: jak zamawiać content, który działa'},
  desc:{en:'Brief templates and examples that help creators deliver what you actually need.',pl:'Szablony briefów i przykłady, dzięki którym twórcy dostarczają dokładnie to, czego potrzebujesz.'},
  points:{en:['Brief template you can copy','Do and don’t examples','Feedback and approval checklist'],pl:['Szablon briefu do skopiowania','Przykłady: co robić, a czego unikać','Checklista uwag i akceptacji']}}
];

function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}

function card(p,i){
  var live=p.status==='live'&&p.buyUrl,t=p.title[LANG];
  var c=el('article','card');
  var cv=el('div','cover');
  if(p.cover){var im=el('img');im.src=BASE+p.cover;im.alt=t;im.loading='lazy';cv.appendChild(im)}
  else{cv.appendChild(el('span','no',String(i+1).padStart(2,'0')));cv.appendChild(el('span','tag',p.tag[LANG]))}
  cv.appendChild(el('span','badge'+(live?'':' soon'),live?UI.live:UI.soon));
  c.appendChild(cv);
  var b=el('div','cbody');
  b.appendChild(el('h2',null,t));
  b.appendChild(el('p',null,p.desc[LANG]));
  var ul=el('ul');p.points[LANG].forEach(function(x){ul.appendChild(el('li',null,x))});b.appendChild(ul);
  b.appendChild(el('p','meta',[p.format,p.pages?p.pages+' '+UI.pages:''].filter(Boolean).join(' · ')));
  var buy=el('div','buy');
  buy.appendChild(el('span','price',p.price[LANG]));
  var a=el('a','btn'+(live?'':' ghost'));
  if(live){a.href=p.buyUrl;a.target='_blank';a.rel='noopener';a.textContent=UI.buy}
  else{a.href='mailto:'+MAIL+'?subject='+encodeURIComponent(UI.subject+t)+'&body='+encodeURIComponent(UI.body+t);a.textContent=UI.notify}
  buy.appendChild(a);b.appendChild(buy);c.appendChild(b);
  return c;
}

var grid=document.getElementById('shop-grid');
if(grid){
  grid.textContent='';
  if(!PRODUCTS.length)grid.appendChild(el('p',null,UI.empty));
  PRODUCTS.forEach(function(p,i){grid.appendChild(card(p,i))});
}
})();
