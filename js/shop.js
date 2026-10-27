window.POSTSIGNAL_PROMO_CHECKOUT_URL = window.POSTSIGNAL_PROMO_CHECKOUT_URL || '';
window.POSTSIGNAL_CHECKOUT_URL = window.POSTSIGNAL_CHECKOUT_URL || '';
(() => {
'use strict';
const pl=window.POSTSIGNAL_SHOP_LANGUAGE==='pl';
const $=s=>document.querySelector(s), all=s=>Array.from(document.querySelectorAll(s));
const key='postsignal_shop_offer_first_seen_v1';let initial=Date.now();
try{const existing=Number(localStorage.getItem(key));if(existing>0&&existing<=Date.now())initial=existing;else localStorage.setItem(key,String(initial));}catch{}
const expires=initial+3600000;let promo=true;
function offer(){const left=Math.max(0,Math.ceil((expires-Date.now())/1000));promo=left>0;const clock=promo?String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0'):window.POSTSIGNAL_CLOCK_ENDED;all('[data-clock]').forEach(el=>el.textContent=clock);all('[data-price]').forEach(el=>el.textContent=promo?'$9.99':'$14.99');document.body.classList.toggle('offer-expired',!promo);}
offer();setInterval(offer,1000);
all('[data-checkout]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();offer();const url=promo?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;if(typeof url==='string'&&/^https:\/\//i.test(url)){location.assign(url);return}const subj=encodeURIComponent(pl?'Zakup e-booka PostSignal':'PostSignal ebook purchase');const msg=encodeURIComponent('How to Turn Your Beauty Content Into More Bookings — '+(promo?'$9.99':'$14.99'));location.href='mailto:contact@postsignal.eu?subject='+subj+'&body='+msg;}));
const weeks=window.POSTSIGNAL_SHOP_WEEKS||[];function showWeek(i){if(!weeks[i])return;all('[data-week]').forEach(el=>{const active=Number(el.dataset.week)===i;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',active?'true':'false')});$('[data-week-title]').textContent=weeks[i][0];$('[data-week-text]').textContent=weeks[i][1];$('[data-week-count]').textContent=String(i+1).padStart(2,'0');$('[data-week-small]').textContent=String(i+1).padStart(2,'0');}all('[data-week]').forEach(btn=>btn.addEventListener('click',()=>showWeek(Number(btn.dataset.week))));
const progress=$('.progress'),sticky=$('#sticky-sale');let queued=false;
function onFrame(){queued=false;const range=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform='scaleX('+(range?scrollY/range:0)+')';if(sticky)sticky.classList.toggle('show',scrollY>innerHeight*.75&&($('#buy')?.getBoundingClientRect().top||10000)>innerHeight*.35)}
function update(){if(!queued){queued=true;requestAnimationFrame(onFrame)}}addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
})();
