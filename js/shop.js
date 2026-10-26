/* POSTSIGNAL SHOP V9: add checkout URLs before taking payments. */
window.POSTSIGNAL_PROMO_CHECKOUT_URL=window.POSTSIGNAL_PROMO_CHECKOUT_URL||'';
window.POSTSIGNAL_CHECKOUT_URL=window.POSTSIGNAL_CHECKOUT_URL||'';
(()=>{'use strict';
const pl=document.documentElement.lang==='pl';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const key='postsignal_shop_offer_first_seen_v2'; // reuse existing V8 expiry; no reset during upgrade
let first=Date.now();try{const saved=Number(localStorage.getItem(key));if(Number.isFinite(saved)&&saved>0&&saved<=Date.now())first=saved;else localStorage.setItem(key,String(first));}catch(e){}
const expiry=first+3600000;let active=false;
function offer(){let secs=Math.max(0,Math.ceil((expiry-Date.now())/1000));active=secs>0;
 const clock=active?String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0'):(pl?'KONIEC':'ENDED');
 $$('[data-countdown]').forEach(n=>n.textContent=clock);
 $$('[data-offer-price]').forEach(n=>n.textContent=active?'$9.99':'$14.99');
 $$('[data-timer-label]').forEach(n=>n.textContent=active?(pl?'DO KOŃCA OFERTY':'OFFER ENDS IN'):(pl?'CENA REGULARNA':'REGULAR PRICE'));
 document.body.classList.toggle('offer-ended',!active);
}offer();setInterval(offer,1000);
function buy(e){e.preventDefault();offer();const url=active?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;
 if(typeof url==='string'&&/^https:\/\//i.test(url)){location.href=url;return;}
 const subject=encodeURIComponent(pl?'Zakup ebooka PostSignal':'PostSignal ebook purchase');
 const body=encodeURIComponent((pl?'Proszę o link do zakupu: ':'Please send a checkout link for: ')+'How to Turn Your Beauty Content Into More Bookings — '+(active?'$9.99':'$14.99'));
 location.href='mailto:contact@postsignal.eu?subject='+subject+'&body='+body;
}
$$('[data-buy]').forEach(el=>el.addEventListener('click',buy));
const experience=$('.experience'),book=$('.book-book'),flat=$('.book-flat'),wrap=$('.book-wrap'),chapters=$$('.chapter'),index=$('[data-current-chapter]'),rail=$('.offer-rail'),dock=$('.buy-dock'),progress=$('.progress'),stage=$('.stage-sun');
let last=0, raf=0, movement=0;
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const smooth=(a,b,t)=>a+(b-a)*t;
function draw(){raf=0;const y=scrollY, viewport=innerHeight, total=document.documentElement.scrollHeight-viewport;
 progress.style.transform=`scaleX(${total>0?clamp(y/total):0})`;
 dock.classList.toggle('is-visible',y>viewport*.8 && y<document.documentElement.scrollHeight-viewport*1.18);
 const rect=experience.getBoundingClientRect();const distance=Math.max(1,experience.offsetHeight-viewport);const t=clamp(-rect.top/distance);
 const current=Math.min(3,Math.floor(Math.min(.9999,t)*4));
 chapters.forEach((c,i)=>c.classList.toggle('is-active',i===current));index.textContent=String(current+1).padStart(2,'0');
 if(!reduced){movement=smooth(movement,t,.15);const s=movement;
 const reveal=clamp((s-.28)*2.0),flatten=clamp((s-.52)*2.8),exit=clamp((s-.79)*4.5);
 const mobile=innerWidth<761;
 wrap.style.transform=mobile?`translate3d(${(-s*3).toFixed(2)}vw,${(-s*2).toFixed(2)}vh,0) scale(${(1-s*.09).toFixed(3)})`:`translate3d(${(-s*6).toFixed(2)}vw,${(s*4).toFixed(2)}vh,0) scale(${(1-s*.08).toFixed(3)})`;
 book.style.transform=`rotateY(${(-12-reveal*17+flatten*30).toFixed(2)}deg) rotateZ(${(-7+reveal*5+flatten*2).toFixed(2)}deg) translateY(${(-s*17).toFixed(1)}px) scale(${(1-reveal*.06).toFixed(3)})`;
 book.style.opacity=String(clamp(1-flatten*1.3));
 flat.style.transform=`rotateY(${(32-flatten*32).toFixed(2)}deg) rotateZ(${(10-flatten*10).toFixed(2)}deg) scale(${(.85+flatten*.15).toFixed(3)})`;
 flat.style.opacity=String(clamp(flatten*1.35));
 if(stage)stage.style.transform=`scale(${(1+s*.14).toFixed(3)}) rotate(${(s*23).toFixed(1)}deg)`;
 }
 last=y;
}
function queue(){if(!raf)raf=requestAnimationFrame(draw)}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});addEventListener('pageshow',()=>{offer();queue()});queue();
})();
