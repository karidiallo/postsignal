/* Set your real Stripe / Lemon Squeezy / Gumroad checkout URL here. */
window.POSTSIGNAL_CHECKOUT_URL = ""; // Regular-price checkout URL (required for live sales)
window.POSTSIGNAL_PROMO_CHECKOUT_URL = ""; // Optional $9.99 checkout URL; must enforce expiry server-side
window.POSTSIGNAL_PROMO_SECONDS = 3600;
(function(){
 const buttons=document.querySelectorAll('[data-buy]');
 const url=window.POSTSIGNAL_CHECKOUT_URL;
 const promoUrl=window.POSTSIGNAL_PROMO_CHECKOUT_URL;
 const key='postsignal_shop_offer_first_seen_v1';
 let firstSeen;
 try { const stored=Number(localStorage.getItem(key));firstSeen=(Number.isFinite(stored)&&stored>0&&stored<=Date.now())?stored:Date.now();if(!stored)localStorage.setItem(key,String(firstSeen)); }
 catch(_){ firstSeen=Date.now(); }
 const endsAt=firstSeen + window.POSTSIGNAL_PROMO_SECONDS*1000;
 const pl=document.documentElement.lang==='pl';
 let promoActive=true;
 function renderOffer(){
  const remaining=Math.max(0,Math.ceil((endsAt-Date.now())/1000));promoActive=remaining>0;
  const time=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
  document.querySelectorAll('[data-countdown]').forEach(n=>n.textContent=promoActive?time:(pl?'KONIEC':'EXPIRED'));
  document.querySelectorAll('[data-dynamic-price],[data-price-value]').forEach(n=>n.textContent=promoActive?'$9.99':'$14.99');
  document.querySelectorAll('[data-discount]').forEach(n=>n.hidden=!promoActive);
  document.querySelectorAll('[data-original-price]').forEach(n=>n.hidden=!promoActive);
  document.body.classList.toggle('offer-expired',!promoActive);
  const promo=document.querySelector('.promo');if(promo&&!promoActive)promo.textContent=pl?'PROMOCJA ZAKOŃCZONA · CENA REGULARNA $14.99':'OFFER ENDED · REGULAR PRICE $14.99';
 }
 renderOffer();setInterval(renderOffer,1000);
 buttons.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();
 renderOffer();
 const destination=promoActive?promoUrl:url;
 if(destination && /^https:\/\//.test(destination)){window.location.href=destination;return;}
 const subject=encodeURIComponent(pl?'Zakup e-booka PostSignal':'PostSignal ebook purchase');
 const body=encodeURIComponent(pl?'Chcę kupić e-book How to Turn Your Beauty Content Into More Bookings za '+(promoActive?'$9.99':'$14.99')+'. Proszę o link do płatności.':'I would like to buy How to Turn Your Beauty Content Into More Bookings for '+(promoActive?'$9.99':'$14.99')+'. Please send a payment link.');
 window.location.href='mailto:contact@postsignal.eu?subject='+subject+'&body='+body;
 }));
 const book=document.querySelector('.hero-book');
 if(book && window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
 const wrap=document.querySelector('.hero-visual');
 wrap.addEventListener('pointermove',e=>{const b=wrap.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;book.style.transform=`perspective(1100px) rotateY(${x*13}deg) rotateX(${-y*9}deg) translateY(-8px)`});
 wrap.addEventListener('pointerleave',()=>book.style.transform='');
 }
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');observer.unobserve(x.target)}}),{threshold:.08}):null;
 document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));
 const bar=document.querySelector('.scroll-progress');let ticking=false;
 window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{let max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;ticking=false})},{passive:true});
})();
