window.POSTSIGNAL_CHECKOUT_URL = window.POSTSIGNAL_CHECKOUT_URL || '';
window.POSTSIGNAL_PROMO_CHECKOUT_URL = window.POSTSIGNAL_PROMO_CHECKOUT_URL || '';
window.POSTSIGNAL_PROMO_SECONDS = window.POSTSIGNAL_PROMO_SECONDS || 3600;
(()=>{
'use strict';
const pl=document.documentElement.lang==='pl';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const key='postsignal_shop_offer_first_seen_v2';
let firstSeen=Date.now();
try{
  const stored=Number(localStorage.getItem(key));
  if(Number.isFinite(stored)&&stored>0&&stored<=Date.now()) firstSeen=stored;
  else localStorage.setItem(key,String(firstSeen));
}catch(_){/* ignore */}
const offerSeconds=Number(window.POSTSIGNAL_PROMO_SECONDS)||3600;
const end=firstSeen + offerSeconds*1000;
let active=true;
const $$=(sel)=>[...document.querySelectorAll(sel)];
function formatClock(left){
  const min=String(Math.floor(left/60)).padStart(2,'0');
  const sec=String(left%60).padStart(2,'0');
  return `${min}:${sec}`;
}
function updateOffer(){
  const left=Math.max(0,Math.ceil((end-Date.now())/1000));
  active=left>0;
  const label=active?formatClock(left):(pl?'KONIEC':'EXPIRED');
  $$('[data-countdown]').forEach(el=>el.textContent=label);
  $$('[data-price-value],[data-dynamic-price]').forEach(el=>el.textContent=active?'$9.99':'$14.99');
  document.body.classList.toggle('offer-expired',!active);
}
updateOffer();
setInterval(updateOffer,1000);

const buyLinks=$$('[data-buy]');
function resolveCheckout(){
  updateOffer();
  const url=active?window.POSTSIGNAL_PROMO_CHECKOUT_URL:window.POSTSIGNAL_CHECKOUT_URL;
  if(url && /^https:\/\//.test(url)) return url;
  const subject=encodeURIComponent(pl?'Zakup ebooka PostSignal':'PostSignal ebook purchase');
  const body=encodeURIComponent((pl?'Proszę o link do zakupu dla: ':'Please send a checkout link for: ')+'How to Turn Your Beauty Content Into More Bookings — '+(active?'$9.99':'$14.99'));
  return `mailto:contact@postsignal.eu?subject=${subject}&body=${body}`;
}
buyLinks.forEach(link=>link.addEventListener('click',e=>{
  const href=link.getAttribute('href')||'';
  if(href.startsWith('#')) return;
  e.preventDefault();
  location.href=resolveCheckout();
}));

const scrollLine=document.querySelector('.scroll-line');
const stickyBuy=document.querySelector('[data-sticky-buybar]');
const revealEls=$$('[data-reveal]');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target);}
  }),{threshold:.12});
  revealEls.forEach(el=>io.observe(el));
}else revealEls.forEach(el=>el.classList.add('visible'));

const showcase=document.querySelector('.scroll-showcase');
const panels=$$('.scene-panel');
const sceneBook=document.querySelector('.scene-book');
const sceneCover=document.querySelector('.scene-cover');
const sceneNumber=document.querySelector('[data-scene-number]');
const heroStage=document.querySelector('.hero-stage');
const heroBook=document.querySelector('.hero-book');
const heroBg=document.querySelector('.hero-bg');
let raf=0;
function clamp(min,max,v){return Math.max(min,Math.min(max,v));}
function render(){
  raf=0;
  const total=document.documentElement.scrollHeight - innerHeight;
  if(scrollLine) scrollLine.style.transform=`scaleX(${total>0?scrollY/total:0})`;
  if(stickyBuy){ stickyBuy.classList.toggle('is-visible', scrollY > innerHeight*0.55); }

  if(heroBook && !reduce){
    const heroRect=heroStage.getBoundingClientRect();
    const heroProgress=clamp(-1,1,(innerHeight*0.5 - heroRect.top)/(innerHeight*1.2));
    heroBook.style.transform=`translate3d(0, ${heroProgress*-18}px, 0) rotateY(${heroProgress*16}deg) rotateX(${heroProgress*-5}deg)`;
    if(heroBg) heroBg.style.transform=`scale(${1 + Math.abs(heroProgress)*0.03}) translateY(${heroProgress*10}px)`;
  }

  if(showcase && sceneBook && sceneCover){
    const rect=showcase.getBoundingClientRect();
    const max=Math.max(1, showcase.offsetHeight - innerHeight);
    const t=clamp(0,1,-rect.top/max);
    const scene=Math.min(2, Math.floor(t*3));
    panels.forEach((panel,i)=>panel.classList.toggle('is-active', i===scene));
    if(sceneNumber) sceneNumber.textContent=String(scene+1).padStart(2,'0');
    if(!reduce){
      const a=clamp(0,1,t*2.1);
      const b=clamp(0,1,(t-.34)*2.6);
      const c=clamp(0,1,(t-.68)*3.2);
      sceneBook.style.transform=`translate3d(${a*4-b*8}%, ${-a*4+b*7}%,0) rotateY(${-18-a*18+b*44}deg) rotateX(${-2+a*5}deg) rotateZ(${-8+a*7+b*8}deg) scale(${1-a*.06-b*.11})`;
      sceneBook.style.opacity=String(1-c*.92);
      sceneCover.style.opacity=String(clamp(0,1,b*1.15+c*.3));
      sceneCover.style.transform=`translate3d(${12-b*12}%, ${20-b*22+c*8}px,0) rotateY(${42-b*42}deg) rotateZ(${-10+b*10}deg) scale(${.73+b*.27})`;
    }
  }
}
function onScroll(){ if(!raf) raf=requestAnimationFrame(render); }
addEventListener('scroll', onScroll, {passive:true});
addEventListener('resize', onScroll, {passive:true});
render();

if(!reduce && matchMedia('(pointer:fine)').matches && heroStage && heroBook){
  heroStage.addEventListener('pointermove',e=>{
    const r=heroStage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    heroBook.style.transition='transform .12s ease-out';
    heroBook.style.transform=`translate3d(${x*14}px, ${y*10}px, 0) rotateY(${x*18}deg) rotateX(${-y*12}deg)`;
  });
  heroStage.addEventListener('pointerleave',()=>{ heroBook.style.transition='transform .25s ease-out'; onScroll(); });
}
})();
