window.POSTSIGNAL_PROMO_CHECKOUT_URL = window.POSTSIGNAL_PROMO_CHECKOUT_URL || '';
window.POSTSIGNAL_CHECKOUT_URL = window.POSTSIGNAL_CHECKOUT_URL || '';
(()=>{
'use strict';
const pl=document.documentElement.lang==='pl';
const $$=(s)=>[...document.querySelectorAll(s)];
const q=(s)=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const key='postsignal_shop_offer_first_seen_v1';
let first=Date.now();
try{const saved=Number(localStorage.getItem(key)); if(saved>0&&saved<=Date.now()) first=saved; else localStorage.setItem(key,String(first));}catch{}
const end=first+3600*1000;
let active=true;
function updateOffer(){
  const left=Math.max(0,Math.ceil((end-Date.now())/1000));
  active=left>0;
  const label=active?`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`:(pl?'KONIEC':'ENDED');
  $$('[data-clock]').forEach(el=>el.textContent=label);
  $$('[data-price]').forEach(el=>el.textContent=active?'$9.99':'$14.99');
  document.body.classList.toggle('offer-expired',!active);
}
updateOffer(); setInterval(updateOffer,1000);
function purchase(){
  updateOffer();
  const url=active?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;
  if(typeof url==='string' && /^https:\/\//i.test(url)){ location.assign(url); return; }
  const subject=encodeURIComponent(pl?'Zakup ebooka PostSignal':'PostSignal ebook purchase');
  const body=encodeURIComponent('How to Turn Your Beauty Content Into More Bookings — '+(active?'$9.99':'$14.99'));
  location.href=`mailto:contact@postsignal.eu?subject=${subject}&body=${body}`;
}
$$('[data-checkout]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();purchase();}));

const progress=q('.progress-line');
const floating=q('#floating-buy');
const buy=q('#buy');
let raf=0;
function renderScroll(){
  raf=0;
  const total=document.documentElement.scrollHeight-innerHeight;
  if(progress) progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;
  if(floating&&buy){ const rect=buy.getBoundingClientRect(); floating.classList.toggle('is-visible',scrollY>innerHeight*.75 && !(rect.top<innerHeight*.8 && rect.bottom>0)); }
}
function queue(){ if(!raf) raf=requestAnimationFrame(renderScroll); }
addEventListener('scroll',queue,{passive:true}); addEventListener('resize',queue,{passive:true}); queue();

const revealEls=$$('.reveal');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible'); io.unobserve(entry.target);}}),{threshold:.15});
  revealEls.forEach(el=>io.observe(el));
}else revealEls.forEach(el=>el.classList.add('is-visible'));

const book=q('#hero-book'); const stage=q('.hero__stage');
if(book&&stage&&!reduced){
  let tx=0, ty=0, cx=0, cy=0, dragging=false, sx=0, sy=0, ox=0, oy=0;
  stage.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return; dragging=true; sx=e.clientX; sy=e.clientY; ox=tx; oy=ty; stage.setPointerCapture?.(e.pointerId);});
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(); if(dragging){tx=Math.max(-30,Math.min(30,ox+(e.clientX-sx)*.13)); ty=Math.max(-14,Math.min(14,oy-(e.clientY-sy)*.08));} else {tx=((e.clientX-r.left)/r.width-.5)*15; ty=-((e.clientY-r.top)/r.height-.5)*7;}});
  const stop=()=>{dragging=false; tx=0; ty=0;}; stage.addEventListener('pointerup',stop); stage.addEventListener('pointercancel',stop); stage.addEventListener('pointerleave',()=>{if(!dragging) stop();});
  function animate(){cx+=(tx-cx)*.09; cy+=(ty-cy)*.09; const rect=stage.getBoundingClientRect(); const drift=Math.max(-1,Math.min(1,(innerHeight*0.5-rect.top)/(innerHeight*1.3))); book.style.transform=`translate3d(0,${drift*-12}px,0) rotateY(${-6+cx}deg) rotateX(${2+cy}deg) rotateZ(${cx*.05}deg)`; requestAnimationFrame(animate);} requestAnimationFrame(animate);
}

const sampleData=pl?{
 before:['Świeży glow ✨ Uwielbiam ten efekt! #beauty #skincare #selfcare','Piękny efekt, ale bez konkretnego następnego kroku.','Pokazuje efekt, ale daje potencjalnej klientce bardzo mało powodów, by zareagować właśnie teraz.'],
 after:['Masz wrażenie, że Twoja skóra wygląda na zmęczoną mimo pielęgnacji? ✨ Zobacz, jak dobieramy zabieg do potrzeb cery i czego możesz się spodziewać podczas wizyty. Napisz „KONSULTACJA”, jeśli chcesz omówić opcje.','Jasny następny krok: napisz po konsultację.','Łączy problem klientki z Twoją wiedzą i daje prosty powód, by wykonała kolejny krok.']
}:{
 before:['Fresh glow ✨ Loving this result! #beauty #skincare #selfcare','Beautiful result, but no real next step.','It shows the result, but gives a potential client very little reason to act now.'],
 after:['Skin looking tired even with a routine in place? ✨ See how we tailor the treatment, what to expect during the visit, and how to choose the right option. DM “CONSULT” if you want to talk through it.','Clear next step: DM for a consultation.','It connects the client problem to your expertise and gives them an obvious action to take.']
};
const tabs=$$('[data-example]'); const postCaption=q('[data-post-caption]'); const postCta=q('[data-post-cta]'); const postInsight=q('[data-post-insight]');
function setExample(key){ tabs.forEach(btn=>{const on=btn.dataset.example===key; btn.classList.toggle('is-active',on); btn.setAttribute('aria-selected',String(on));}); if(postCaption) postCaption.textContent=sampleData[key][0]; if(postCta) postCta.textContent=sampleData[key][1]; if(postInsight) postInsight.textContent=sampleData[key][2]; }
tabs.forEach(btn=>btn.addEventListener('click',()=>setExample(btn.dataset.example)));

const flowBtns=$$('[data-flow]'); const flowIndex=q('[data-flow-index]'); const flowIcon=q('[data-flow-icon]'); const flowTitle=q('[data-flow-title]'); const flowCopy=q('[data-flow-copy]'); const flowTake=q('[data-flow-takeaway]');
const flowData=pl?[
 ['✦','Zacznij od realnego problemu klientki beauty.','Wyjdź od potrzeby, którą idealna klientka już odczuwa — nie tylko od nazwy zabiegu. Trafność buduje uwagę.','Wniosek: „To dotyczy mojego problemu”.'],
 ['◎','Pokaż, dlaczego można Ci zaufać.','Pokaż przebieg wizyty, wiedzę specjalisty, rezultaty i informacje, które rozwiewają niepewność przed wizytą.','Wniosek: „Wiem, czego mogę się spodziewać”.'],
 ['↗','Zaproś do jednego konkretnego działania.','Zaproponuj jasny kolejny krok: rezerwację, konsultację lub wiadomość w sprawie terminu. Nie każ klientce zgadywać, co zrobić dalej.','Wniosek: „Wiem, jak przejść dalej”.']
]:[
 ['✦','Lead with a real beauty-client concern.','Start from the need your ideal client already feels — not only the treatment name. Relevance creates attention.','Takeaway: “This is relevant to me.”'],
 ['◎','Show them why they can trust you.','Show the visit process, your expertise, the expected result and the information that reduces uncertainty before someone enquires.','Takeaway: “I know what to expect.”'],
 ['↗','Invite one clear next action.','Offer one clear next step: book, enquire or request a consultation. Do not make people guess what happens next.','Takeaway: “I know how to move forward.”']
];
function setFlow(i){ flowBtns.forEach((btn,idx)=>{const on=idx===i; btn.classList.toggle('is-active',on); btn.setAttribute('aria-selected',String(on));}); if(flowIndex) flowIndex.textContent=String(i+1).padStart(2,'0'); if(flowIcon) flowIcon.textContent=flowData[i][0]; if(flowTitle) flowTitle.textContent=flowData[i][1]; if(flowCopy) flowCopy.textContent=flowData[i][2]; if(flowTake) flowTake.textContent=flowData[i][3]; }
flowBtns.forEach((btn,i)=>btn.addEventListener('click',()=>setFlow(i)));
q('[data-flow-next]')?.addEventListener('click',()=>{const current=Math.max(0, flowBtns.findIndex(x=>x.classList.contains('is-active'))); setFlow((current+1)%flowBtns.length);});
})();
