/* PostSignal — single product / configure both hosted checkout links. */
window.POSTSIGNAL_PROMO_CHECKOUT_URL=window.POSTSIGNAL_PROMO_CHECKOUT_URL||'';
window.POSTSIGNAL_CHECKOUT_URL=window.POSTSIGNAL_CHECKOUT_URL||'';
(()=>{'use strict';
 const pl=document.documentElement.lang==='pl', reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const $=(q)=>document.querySelector(q), $$=(q)=>Array.from(document.querySelectorAll(q));
 const key='postsignal_shop_offer_first_seen_v2'; let first=Date.now();
 try{let saved=Number(localStorage.getItem(key));if(saved>0 && saved<=Date.now()) first=saved;else localStorage.setItem(key,String(first));}catch(e){}
 const end=first+3600000; let promo=true;
 function tick(){let remaining=Math.max(0,Math.ceil((end-Date.now())/1000));promo=remaining>0;
 const clock=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');
 $$('[data-countdown]').forEach(x=>x.textContent=promo?clock:(pl?'KONIEC':'ENDED'));
 $$('[data-price]').forEach(x=>x.textContent=promo?'$9.99':'$14.99');
 document.body.classList.toggle('offer-ended',!promo);
 $$('[data-offer-caption]').forEach(x=>x.textContent=promo?((window.POSTSIGNAL_SHOP_TEXT||{}).promo|| (pl?'OFERTA NA START':'INTRO OFFER')):((window.POSTSIGNAL_SHOP_TEXT||{}).now || 'REGULAR PRICE'));
 }tick();setInterval(tick,1000);
 function checkout(){tick();let url=promo?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;
 if(/^https:\/\//i.test(url)) return url;
 const sub=encodeURIComponent(pl?'Zapytanie o zakup ebooka PostSignal':'PostSignal ebook purchase request');
 const body=encodeURIComponent((pl?'Proszę o link do zakupu: ':'Please send the purchase link for: ')+'How to Turn Your Beauty Content Into More Bookings — '+(promo?'$9.99':'$14.99'));
 return 'mailto:contact@postsignal.eu?subject='+sub+'&body='+body;
 }
 $$('[data-buy]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();location.href=checkout()}));
 const reveals=$$('.reveal');if('IntersectionObserver' in window){const obs=new IntersectionObserver((entries)=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');obs.unobserve(x.target)}}),{threshold:.05});reveals.forEach(x=>obs.observe(x));}else reveals.forEach(x=>x.classList.add('is-visible'));
 const hero=$('.hero'),heroBook=$('.hero-book'),story=$('.story'),storyBook=$('.story-book'),storyFlat=$('.story-flat'),panels=$$('.story-panel'),number=$('[data-scene-index]'),float=$('[data-floating]'),progress=$('.scroll-progress');let frame=0,drag=false,dragX=0,dragY=0;
 const clamp=(a,b,n)=>Math.max(a,Math.min(b,n));
 function render(){frame=0;let total=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(total?scrollY/total:0)+')';if(float)float.classList.toggle('is-visible',scrollY>innerHeight*.65);
 if(heroBook&&!reduce&&!drag){let r=hero.getBoundingClientRect(),p=clamp(0,1,-r.top/Math.max(1,r.height));heroBook.style.transform='translate3d(0,'+(-p*65)+'px,0) rotateY('+(-p*13)+'deg) rotateZ('+(-p*4)+'deg) scale('+(1-p*.1)+')';}
 if(story){let r=story.getBoundingClientRect(),span=Math.max(1,story.offsetHeight-innerHeight),t=clamp(0,1,-r.top/span),idx=Math.min(2,Math.floor(t*3));panels.forEach((panel,i)=>panel.classList.toggle('is-active',i===idx));number.textContent=String(idx+1).padStart(2,'0');
 if(!reduce){let phase=clamp(0,1,t*1.8),flip=clamp(0,1,(t-.43)*2.7);storyBook.style.transform='translate3d('+(phase*8-flip*13)+'%,'+(-phase*5)+'%,0) rotateY('+(-phase*24+flip*33)+'deg) rotateZ('+(-phase*8+flip*6)+'deg) scale('+(1-phase*.12)+')';storyBook.style.opacity=1-flip;storyFlat.style.opacity=flip;storyFlat.style.transform='translate3d('+(12-flip*12)+'%,'+(30-flip*30)+'px,0) rotateY('+(28-flip*28)+'deg) scale('+(.79+flip*.21)+')';}
 }}
 function queue(){if(!frame)frame=requestAnimationFrame(render)}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});queue();
 // Deliberate product interaction: small, constrained drag; not a false full 3D model.
 if(heroBook&&!reduce){const stage=$('.hero-object');stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag=true;stage.setPointerCapture(e.pointerId);dragX=e.clientX;dragY=e.clientY;heroBook.style.transition='none';});stage.addEventListener('pointermove',e=>{if(!drag)return;let dx=clamp(-1,1,(e.clientX-dragX)/170),dy=clamp(-1,1,(e.clientY-dragY)/170);heroBook.style.transform='translate3d('+(dx*20)+'px,'+(dy*12)+'px,0) rotateY('+(dx*21)+'deg) rotateX('+(-dy*12)+'deg) rotateZ('+(dx*3)+'deg)';});function stop(){drag=false;heroBook.style.transition='transform .45s cubic-bezier(.2,.8,.2,1)';queue();}stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);}
 const views=$$('[data-view]'),stage=$('[data-view-stage]');views.forEach(button=>button.addEventListener('click',()=>{let mode=button.dataset.view;views.forEach(v=>{let on=v===button;v.classList.toggle('is-active',on);v.setAttribute('aria-pressed',String(on));});stage.querySelector('.product-stage__3d').classList.toggle('is-active',mode==='3d');stage.querySelector('.product-stage__cover').classList.toggle('is-active',mode==='cover');}));
})();
