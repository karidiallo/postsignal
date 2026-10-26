/* PostSignal single-product shop — configure both URLs before accepting real payments. */
window.POSTSIGNAL_CHECKOUT_URL = window.POSTSIGNAL_CHECKOUT_URL || '';
window.POSTSIGNAL_PROMO_CHECKOUT_URL = window.POSTSIGNAL_PROMO_CHECKOUT_URL || '';
window.POSTSIGNAL_PROMO_SECONDS = 3600;
(()=>{
'use strict';
const pl=document.documentElement.lang==='pl';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const key='postsignal_shop_offer_first_seen_v1';
let firstSeen=Date.now();
try{const stored=Number(localStorage.getItem(key));if(Number.isFinite(stored)&&stored>0&&stored<=Date.now())firstSeen=stored;else localStorage.setItem(key,String(firstSeen))}catch(_){/* storage blocked: page-only fallback */}
const end=firstSeen+3600*1000;
let active=true;
function offer(){const left=Math.max(0,Math.ceil((end-Date.now())/1000));active=left>0;
const clock=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0');
document.querySelectorAll('[data-countdown]').forEach(x=>x.textContent=active?clock:(pl?'KONIEC':'EXPIRED'));
document.querySelectorAll('[data-price-value],[data-dynamic-price]').forEach(x=>x.textContent=active?'$9.99':'$14.99');
document.body.classList.toggle('offer-expired',!active);
}offer();setInterval(offer,1000);
document.querySelectorAll('[data-buy]').forEach(a=>a.addEventListener('click',e=>{
 e.preventDefault();offer();const url=active?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;
 if(url&&/^https:\/\//.test(url)){location.assign(url);return;}
 const subject=encodeURIComponent(pl?'Zakup e-booka PostSignal':'PostSignal ebook purchase');
 const body=encodeURIComponent((pl?'Proszę o link do zakupu: ':'Please send a checkout link for: ')+'How to Turn Your Beauty Content Into More Bookings — '+(active?'$9.99':'$14.99'));
 location.href='mailto:contact@postsignal.eu?subject='+subject+'&body='+body;
}));
const targets=document.querySelectorAll('[data-reveal]');
if(!reduce&&'IntersectionObserver' in window){const obs=new IntersectionObserver(rows=>rows.forEach(r=>{if(r.isIntersecting){r.target.classList.add('visible');obs.unobserve(r.target)}}),{threshold:.08});targets.forEach(x=>obs.observe(x));}else targets.forEach(x=>x.classList.add('visible'));
const scrollLine=document.querySelector('.scroll-line'),story=document.querySelector('.scroll-showcase'),book=document.querySelector('.scene-book'),cover=document.querySelector('.scene-cover'),panels=[...document.querySelectorAll('.scene-panel')],num=document.querySelector('[data-scene-number]');
let pointerX=0,pointerY=0,scrollValue=0,frame=false;
const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));const lerp=(a,b,t)=>a+(b-a)*t;
function render(){frame=false;const range=document.documentElement.scrollHeight-innerHeight;scrollLine.style.transform=`scaleX(${range>0?scrollY/range:0})`;
 const r=story.getBoundingClientRect();const max=Math.max(1,story.offsetHeight-innerHeight);const t=clamp(0,1,-r.top/max);
 scrollValue=lerp(scrollValue,t,.18);const phase=scrollValue*3;const current=Math.min(2,Math.floor(t*3));
 panels.forEach((p,i)=>p.classList.toggle('is-active',i===current));num.textContent=String(current+1).padStart(2,'0');
 if(!reduce){const p=scrollValue;const v1=clamp(0,1,p*2);const v2=clamp(0,1,(p-.45)*2.7);
 book.style.transform=`translate3d(${(v1*18-v2*20).toFixed(1)}%,${(-v1*8+v2*11).toFixed(1)}%,0) rotateY(${(-v1*28+v2*53).toFixed(1)}deg) rotateZ(${(-v1*9+v2*16).toFixed(1)}deg) scale(${(1-v1*.13-v2*.12).toFixed(3)})`;
 book.style.opacity=String(1-v2);cover.style.opacity=String(v2);cover.style.transform=`translate3d(${(15-v2*15).toFixed(1)}%,${(40-v2*40).toFixed(1)}px,0) rotateY(${(48-v2*48).toFixed(1)}deg) rotateZ(${(-12+v2*12).toFixed(1)}deg) scale(${(.67+v2*.33).toFixed(3)})`;
 }}
function queue(){if(!frame){frame=true;requestAnimationFrame(render)}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});queue();
const visual=document.querySelector('.hero-art'),heroBook=document.querySelector('.hero-book'),detail=document.querySelector('.detail-visual'),detailCover=document.querySelector('.cover-interactive');
if(!reduce&&matchMedia('(pointer:fine)').matches){
function tilt(el,target,mult){el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;target.style.transform=`perspective(1100px) rotateY(${x*mult}deg) rotateX(${-y*mult*.7}deg) translateY(-8px)`});el.addEventListener('pointerleave',()=>target.style.transform='');}
if(visual&&heroBook)tilt(visual,heroBook,15);if(detail&&detailCover)tilt(detail,detailCover,22);
}
})();
