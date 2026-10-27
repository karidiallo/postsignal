/* PostSignal shop V11. Configure BOTH checkout URLs. Enforce eligibility server-side. */
window.POSTSIGNAL_PROMO_CHECKOUT_URL = window.POSTSIGNAL_PROMO_CHECKOUT_URL || '';
window.POSTSIGNAL_CHECKOUT_URL = window.POSTSIGNAL_CHECKOUT_URL || '';
(()=>{'use strict';
const pl=document.documentElement.lang==='pl';
const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const storageKey='postsignal_shop_offer_first_seen_v1'; // preserve older visitors' start times
let first=Date.now();try{const saved=Number(localStorage.getItem(storageKey));if(saved>0&&saved<=Date.now())first=saved;else localStorage.setItem(storageKey,String(first));}catch{}
const ends=first+3600000;let discountActive=true;
function updatePrice(){let left=Math.max(0,Math.ceil((ends-Date.now())/1000));discountActive=left>0;const clock=discountActive?`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`:(pl?'KONIEC':'ENDED');all('[data-clock]').forEach(x=>x.textContent=clock);all('[data-price]').forEach(x=>x.textContent=discountActive?'$9.99':'$14.99');document.body.classList.toggle('offer-expired',!discountActive);}
updatePrice();setInterval(updatePrice,1000);
function purchase(){updatePrice();const url=discountActive?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;if(typeof url==='string'&&/^https:\/\//i.test(url)){location.assign(url);return;}const subject=encodeURIComponent(pl?'Zapytanie o zakup ebooka PostSignal':'PostSignal ebook purchase enquiry');const body=encodeURIComponent('How to Turn Your Beauty Content Into More Bookings — '+(discountActive?'$9.99':'$14.99'));location.href=`mailto:contact@postsignal.eu?subject=${subject}&body=${body}`;}
// Anchors lead to the checkout section; only explicitly marked checkout triggers payment.
all('[data-checkout]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();purchase()}));
const tabs=all('.journey-tab'),panels=all('.journey-panel'),radar=q('.journey-radar');function activate(i){tabs.forEach((el,j)=>{const on=i===j;el.classList.toggle('is-active',on);el.setAttribute('aria-selected',String(on));el.tabIndex=on?0:-1});panels.forEach((el,j)=>el.classList.toggle('is-active',j===i));if(radar)radar.style.transform=`rotate(${i*38}deg)`;}
tabs.forEach((el,i)=>{el.addEventListener('click',()=>activate(i));el.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();const n=(i+1)%tabs.length;activate(n);tabs[n].focus()}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const n=(i+tabs.length-1)%tabs.length;activate(n);tabs[n].focus()}})});
const book=q('#hero-product'),stage=q('.product-studio');let targetX=0,targetY=0,curX=0,curY=0,pressed=false,originX=0,originY=0,startX=0,startY=0;
if(book&&stage&&!reduced){
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pressed=true;originX=e.clientX;originY=e.clientY;startX=targetX;startY=targetY;stage.setPointerCapture?.(e.pointerId)});
  stage.addEventListener('pointermove',e=>{const rect=stage.getBoundingClientRect();if(pressed){targetX=Math.max(-32,Math.min(32,startX+(e.clientX-originX)*.12));targetY=Math.max(-14,Math.min(14,startY-(e.clientY-originY)*.07));}else if(e.pointerType==='mouse'){targetX=((e.clientX-rect.left)/rect.width-.5)*17;targetY=-((e.clientY-rect.top)/rect.height-.5)*8;}});
  const release=()=>{pressed=false;targetX=0;targetY=0};stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('pointerleave',()=>{if(!pressed)release()});
  let visible=true;const io=new IntersectionObserver(e=>visible=e[0].isIntersecting,{rootMargin:'150px'});io.observe(stage);
  function animate(){if(visible){curX+=(targetX-curX)*.085;curY+=(targetY-curY)*.085;const r=stage.getBoundingClientRect();const t=Math.max(-1,Math.min(1,r.top/innerHeight));book.style.transform=`translate3d(0,${t*-13}px,0) rotateY(${-7+curX}deg) rotateX(${2+curY}deg) rotateZ(${curX*.07}deg)`;}requestAnimationFrame(animate)}requestAnimationFrame(animate);
}
const progress=q('.progress-line'),float=q('#floating-purchase'),order=q('#order');let queued=false;function scrollTick(){queued=false;const height=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.transform=`scaleX(${height?scrollY/height:0})`;if(float&&order){const rect=order.getBoundingClientRect();float.classList.toggle('is-visible',scrollY>innerHeight*.75&&!(rect.top<innerHeight*.72&&rect.bottom>0));}}
function queue(){if(!queued){queued=true;requestAnimationFrame(scrollTick)}}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});queue();
})();

/* V12 interactive conversion demonstrations */
(()=>{
const pl=document.documentElement.lang==='pl';
const examples=Array.from(document.querySelectorAll('[data-example]'));
const caption=document.querySelector('[data-post-caption]'),action=document.querySelector('[data-post-cta]'),insight=document.querySelector('[data-post-insight]');
const samples=pl?{
 before:['Świeży glow ✨ Uwielbiam ten efekt! #beauty #skincare #selfcare','Ładny post — i tyle','Pokazuje efekt, ale nie daje potencjalnej klientce jasnego powodu, by wykonała kolejny krok.'],
 after:['Masz wrażenie, że Twoja skóra wygląda na zmęczoną mimo codziennej pielęgnacji? ✨ Zobacz, jak dobieramy zabieg do potrzeb cery i czego możesz się spodziewać podczas wizyty. Napisz „KONSULTACJA”, jeśli chcesz omówić opcje.','Jasne CTA: zapytaj o konsultację','Pokazuje problem klientki, tłumaczy wartość usługi i daje prosty następny krok.']
}:{
 before:['Fresh glow ✨ Loving this result! #beauty #skincare #selfcare','Just another pretty post','It shows the result, but gives a potential client little reason to take the next step.'],
 after:['Skin looking tired even when you keep up with your routine? ✨ See how we tailor a treatment to your skin goals, what a consultation looks like, and what to expect. DM “CONSULT” to talk through your options.','Clear CTA: ask about a consultation','It connects a client problem to your expertise, then makes the next step unmistakable.']
};
examples.forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.example;examples.forEach(x=>{const on=x===btn;x.classList.toggle('is-active',on);x.setAttribute('aria-pressed',String(on))});[caption,action,insight].forEach((el,i)=>{if(el)el.textContent=samples[key][i]})}));
const flow=Array.from(document.querySelectorAll('[data-flow]'));
const data=pl?[
 ['✦','Odpowiedz na konkretną potrzebę.','Zacznij od problemu, z którym klientka już się mierzy — nie tylko od nazwy zabiegu.','Wniosek: „To dotyczy mojego problemu”.'],
 ['◎','Pokaż, dlaczego warto Ci zaufać.','Pokaż przebieg wizyty, kompetencje, realne efekty i informacje, które rozwiewają wątpliwości.','Wniosek: „Wiem, czego mogę się spodziewać”.'],
 ['↗','Poprowadź do jednego działania.','Zaproś do konkretnego kroku: rezerwacji, konsultacji lub zapytania o wolny termin.','Wniosek: „Wiem, jak umówić wizytę”.']
]:[
 ['✦','Speak to a real client problem.','Lead with the concern your ideal client already has — not just the name of the treatment.','Takeaway: “This speaks to my problem.”'],
 ['◎','Show them why they can trust you.','Use real process details, expertise and useful reassurance to make your service less of an unknown.','Takeaway: “I know what to expect.”'],
 ['↗','Make one next action clear.','Invite one specific action: book, ask a question or enquire about a consultation.','Takeaway: “I know how to book.”']
];
const fields=['[data-flow-icon]','[data-flow-title]','[data-flow-copy]','[data-flow-takeaway]'].map(s=>document.querySelector(s));
const idx=document.querySelector('[data-flow-index]');
function activate(i){flow.forEach((btn,j)=>{const on=i===j;btn.classList.toggle('is-active',on);btn.setAttribute('aria-selected',String(on));btn.tabIndex=on?0:-1});fields.forEach((el,j)=>{if(el)el.textContent=data[i][j]});if(idx)idx.textContent=String(i+1).padStart(2,'0')}
flow.forEach((btn,i)=>{btn.addEventListener('click',()=>activate(i));btn.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();const next=(i+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:flow.length-1))%flow.length;activate(next);flow[next].focus()}})});
const next=document.querySelector('[data-flow-next]');if(next)next.addEventListener('click',()=>{const curr=flow.findIndex(x=>x.classList.contains('is-active'));activate((curr+1)%flow.length)});
})();
