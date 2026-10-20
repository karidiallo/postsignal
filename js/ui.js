import {TABS,TAGNAME,FORM_ENDPOINT,MAIL} from './config.js';
import {T} from './i18n.js';
const $=s=>document.querySelector(s);

export function initMenu(){
  const nav=$('#menu'),links=[...nav.querySelectorAll('a[data-nav]')],ids=links.map(a=>a.dataset.nav),secs=[...document.querySelectorAll('main .sec')];
  const go=id=>{
    if(id==='top')scrollTo({top:0,behavior:'smooth'});
    else if(id==='work')scrollTo({top:innerHeight*.5,behavior:'smooth'});   /* początek portfolio (hero znika, pierwsza karta) */
    else{const el=$('#'+id);if(el)el.scrollIntoView({behavior:'smooth'})}
  };
  document.querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();go(a.dataset.nav)}));
  /* podświetla aktualną sekcję; tło nagłówka włącza się, gdy zaczyna się treść pod portfolio */
  const spy=()=>{
    let cur='work';
    secs.forEach(s=>{if(s.getBoundingClientRect().top<=innerHeight*.45)cur=ids.includes(s.id)?s.id:null});
    links.forEach(a=>a.classList.toggle('on',a.dataset.nav===cur));
    document.body.classList.toggle('past',scrollY>$('#content').offsetTop-90);
  };
  addEventListener('scroll',spy,{passive:true});addEventListener('resize',spy);spy();
}

/* opis przy karcie: pozycja stała, przezroczystość i lekki dryf zależą od scrolla (bez timerów i skakania) */
const clampN=(a,v,b)=>Math.min(b,Math.max(a,v));
let total=0;export const setTotal=n=>{total=n};
const pad=n=>String(n).padStart(2,'0');
let shown=null,op=0;
function fill(it,side,rest){
  const c=$('#cap'),vw=innerWidth,G=clampN(40,vw*.05,88),M=clampN(24,vw*.05,80),isRight=side>0;
  const avail=isRight?rest.l-G-M:vw-rest.r-G-M,w=Math.round(clampN(220,avail,440));
  c.style.setProperty('--cx',Math.round(isRight?rest.l-G-w:rest.r+G)+'px');
  c.style.setProperty('--cw',w+'px');c.style.setProperty('--cy',Math.round(rest.cy)+'px');
  $('#c-idx').textContent=pad((it._i||0)+1)+' / '+pad(total);
  $('#c-tag').textContent=(it.kind||TAGNAME[it.tag])+(it.brand?' · '+it.brand:'');
  $('#c-title').textContent=it.title;$('#c-desc').textContent=it.desc;
  const rs=$('#c-res');rs.textContent=it.result||'';rs.style.display=it.result?'':'none';
}
export function updateCaption(it,side,w,rest,ds){
  const c=$('#cap');
  if(it&&rest&&it!==shown&&op<.05){fill(it,side,rest);shown=it}
  const target=it&&it===shown?w:0;
  op+=(target-op)*.25;if(Math.abs(target-op)<.003)op=target;
  c.style.opacity=op;
  c.style.transform=`translateY(${Math.round((ds||0)*14)}px)`;
  if(!it&&op===0)shown=null;
}

export function initModal(){
  const modal=$('#modal'),box=$('#box');
  const close=()=>{modal.classList.remove('open');box.innerHTML=''};
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  return it=>{
    box.innerHTML='';
    if(/\.(mp4|webm)$/i.test(it.video)){const v=Object.assign(document.createElement('video'),{src:it.video,controls:true,autoplay:true,playsInline:true,loop:true});box.appendChild(v)}
    else if(it.video){const f=Object.assign(document.createElement('iframe'),{src:it.video,allowFullscreen:true});f.allow='autoplay; fullscreen';box.appendChild(f)}
    else box.textContent=T.modalEmpty;
    const x=Object.assign(document.createElement('button'),{className:'x',textContent:T.close,onclick:close});box.appendChild(x);
    modal.classList.add('open');
  };
}

export function initCursor(){
  const c=$('#cursor');let x=0,y=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{if(!c.classList.contains('on')){cx=x=e.clientX;cy=y=e.clientY;c.classList.add('on')}x=e.clientX;y=e.clientY});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  return on=>c.classList.toggle('big',on);
}

/* przycisk „Let's talk”: przeskakuje na sam koniec do kontaktu + efekt magnetyczny */
export function initTalk(){
  const b=$('#talk');
  b.addEventListener('click',()=>$('#contact').scrollIntoView({behavior:'smooth'}));
  if(!matchMedia('(hover:hover)').matches)return;
  addEventListener('mousemove',e=>{
    const r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);
    b.style.transform=d<150?`translate(${dx*.22}px,${dy*.3}px)`:'';
  });
}

export function initToTop(){$('#totop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}))}

export function initForm(){
  const f=$('#form'),st=$('#fstatus'),btn=f.querySelector('button');
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    if(f.elements._hp.value)return;
    const name=f.elements.name,email=f.elements.email,phone=f.elements.phone;
    [name,email,phone].forEach(i=>i.classList.remove('invalid'));
    let bad=false;
    if(!name.value.trim()){name.classList.add('invalid');bad=true}
    if(!/^\S+@\S+\.\S+$/.test(email.value.trim())){email.classList.add('invalid');bad=true}
    if(phone.value.trim()&&!/^[+\d][\d\s()-]{6,}$/.test(phone.value.trim())){phone.classList.add('invalid');bad=true}
    if(bad){st.textContent=T.invalid;return}
    const topics=[...f.querySelectorAll('[name=topic]:checked')].map(i=>i.value).join(', ');
    const data={name:name.value.trim(),email:email.value.trim(),brand:f.elements.brand.value.trim(),phone:phone.value.trim(),topics,message:f.elements.msg.value.trim()};
    if(FORM_ENDPOINT){
      btn.disabled=true;st.textContent=T.sending;
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
        if(!r.ok)throw 0;
        f.reset();st.textContent=T.thanks;
      }catch{st.textContent=T.error+MAIL+'.'}
      btn.disabled=false;
    }else{
      const L=T.labels,body=`${L.name}: ${data.name}\n${L.email}: ${data.email}\n${L.brand}: ${data.brand}\n${L.phone}: ${data.phone}\n${L.topics}: ${topics}\n\n${data.message}`;
      location.href=`mailto:${MAIL}?subject=${encodeURIComponent(T.subject+(data.brand||data.name))}&body=${encodeURIComponent(body)}`;
      st.textContent=T.opening;
    }
  });
}

export function initGoto(){document.querySelectorAll('[data-goto]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();$('#'+el.dataset.goto).scrollIntoView({behavior:'smooth'})}))}
export function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));
}
