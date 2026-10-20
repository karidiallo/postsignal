import {BASE} from './i18n.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const hoverOK=matchMedia('(hover:hover)').matches;

export function initSections(){
  /* tekst rozjaśniany słowo po słowie wraz ze scrollem */
  $$('[data-words]').forEach(el=>{
    const ws=el.textContent.trim().split(/\s+/);el.textContent='';
    ws.forEach(w=>{const s=document.createElement('span');s.textContent=w+' ';if(/^(guest|patient|hotels|clinics|decision|treatment|dinner|weekend|contact)/i.test(w))s.className='k';el.appendChild(s)});
  });

  /* trzy zasady: lista po lewej, duży panel po prawej */
  const items=$$('.acc-item'),bodies=$$('.acc-body');
  const setAcc=i=>{items.forEach((b,k)=>b.classList.toggle('on',k===i));bodies.forEach((b,k)=>b.classList.toggle('on',k===i))};
  items.forEach((b,i)=>{if(hoverOK)b.addEventListener('mouseenter',()=>setAcc(i));b.addEventListener('click',()=>setAcc(i));b.addEventListener('focus',()=>setAcc(i))});
  setAcc(0);

  /* rozsuwane panele branż */
  const PV=['pop2up','perla','mozaika','video43'],pans=$$('.pan');
  pans.forEach((p,i)=>{const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'none'});v.dataset.src=BASE+'assets/work/'+PV[i]+'-preview.mp4';v.poster=BASE+'assets/work/'+PV[i]+'-poster.webp';p.prepend(v)});
  const setPan=i=>pans.forEach((p,k)=>{p.classList.toggle('open',k===i);const v=p.querySelector('video');if(!v)return;if(k===i){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()});
  /* wideo startuje tylko w widoku */
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()}),{rootMargin:'150px'});
  $$('.vc video,.tile2 video').forEach(v=>io.observe(v));
  pans.forEach((p,i)=>{if(hoverOK)p.addEventListener('mouseenter',()=>setPan(i));p.addEventListener('click',()=>setPan(i));p.addEventListener('focus',()=>setPan(i))});
  setPan(0);

  /* kafelki: poświata za kursorem + lekki przechył */
  if(hoverOK)$$('.spot').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      el.style.setProperty('--mx',x+'px');el.style.setProperty('--my',y+'px');
      el.style.transform=`perspective(900px) rotateX(${(y/r.height-.5)*-5}deg) rotateY(${(x/r.width-.5)*5}deg)`;
    });
    el.addEventListener('pointerleave',()=>{el.style.transform=''});
  });

  /* elementy sterowane scrollem */
  const words=$$('[data-words]'),tl=$('.tl'),steps=$$('.step'),bar=$('#bar'),pars=$$('[data-par]'),trk=$('.track');
  const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
  function onScroll(){
    words.forEach(el=>{
      const r=el.getBoundingClientRect(),p=cl((innerHeight*.85-r.top)/(innerHeight*.45+r.height*.7),0,1),sp=el.children,n=Math.round(p*sp.length);
      for(let i=0;i<sp.length;i++)sp[i].classList.toggle('lit',i<n);
    });
    if(tl){const r=tl.getBoundingClientRect(),p=cl((innerHeight*.78-r.top)/(innerHeight*.5),0,1);tl.style.setProperty('--p',p);steps.forEach((s,i)=>s.classList.toggle('on',p>i/4+.04))}
    pars.forEach(el=>{const r=el.parentElement.getBoundingClientRect(),d=(r.top+r.height/2-innerHeight/2)/innerHeight;el.style.setProperty('--py',(d*el.dataset.par*-80).toFixed(1)+'px')});
    if(trk){const w=trk.parentElement,sr=w.getBoundingClientRect(),p=cl((innerHeight-sr.top)/(innerHeight+sr.height),0,1),mx=Math.max(0,trk.scrollWidth-w.clientWidth);trk.style.transform=`translateX(${(-p*mx).toFixed(1)}px)`}
    bar.style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`;
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
}
