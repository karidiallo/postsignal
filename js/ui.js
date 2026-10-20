import {TABS,TAGNAME,FORM_ENDPOINT,MAIL} from './config.js';
const $=s=>document.querySelector(s);

export function initTabs(onChange){
  const nav=$('#tabs');
  TABS.forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;if(k==='all')b.className='on';
    b.onclick=()=>{[...nav.children].forEach(c=>c.classList.toggle('on',c===b));onChange(k)};nav.appendChild(b)});
}

let timer;
export function setCaption(it,cardSide){
  const c=$('#cap');c.classList.remove('in');clearTimeout(timer);
  if(!it)return;
  timer=setTimeout(()=>{
    c.classList.toggle('right',cardSide>0);   /* karta po prawej → opis po jej lewej, i odwrotnie */
    $('#c-idx').textContent=pad((it._i||0)+1)+' / '+pad(total);
    $('#c-tag').textContent=(it.kind||TAGNAME[it.tag])+(it.brand?' · '+it.brand:'');$('#c-title').textContent=it.title;
    $('#c-desc').textContent=it.desc;const rs=$('#c-res');rs.textContent=it.result||'';rs.style.display=it.result?'':'none';c.classList.add('in');
  },220);
}

/* opis stoi obok karty: równy odstęp od karty, margines od krawędzi ekranu, środek w pionie = środek karty */
const clampN=(a,v,b)=>Math.min(b,Math.max(a,v));
let prev='';
export function trackCaption(l,r,cy){
  const c=$('#cap'),vw=innerWidth,G=clampN(40,vw*.05,88),M=clampN(24,vw*.05,80),isRight=c.classList.contains('right');
  const avail=isRight?l-G-M:vw-r-G-M,w=Math.round(clampN(220,avail,440));
  const x=Math.round(isRight?l-G-w:r+G),y=Math.round(cy),key=x+'|'+w+'|'+y;
  if(key===prev)return;prev=key;
  c.style.setProperty('--cx',x+'px');c.style.setProperty('--cw',w+'px');c.style.setProperty('--cy',y+'px');
}
let total=0;export const setTotal=n=>{total=n};
const pad=n=>String(n).padStart(2,'0');

export function initModal(){
  const modal=$('#modal'),box=$('#box');
  const close=()=>{modal.classList.remove('open');box.innerHTML=''};
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  return it=>{
    box.innerHTML='';
    if(/\.(mp4|webm)$/i.test(it.video)){const v=Object.assign(document.createElement('video'),{src:it.video,controls:true,autoplay:true,playsInline:true,loop:true});box.appendChild(v)}
    else if(it.video){const f=Object.assign(document.createElement('iframe'),{src:it.video,allowFullscreen:true});f.allow='autoplay; fullscreen';box.appendChild(f)}
    else box.textContent='Add a video link in js/data.js (the "video" field).';
    const x=Object.assign(document.createElement('button'),{className:'x',textContent:'Close ✕',onclick:close});box.appendChild(x);
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
    if(bad){st.textContent='Please check the highlighted fields.';return}
    const topics=[...f.querySelectorAll('[name=topic]:checked')].map(i=>i.value).join(', ');
    const data={name:name.value.trim(),email:email.value.trim(),brand:f.elements.brand.value.trim(),phone:phone.value.trim(),topics,message:f.elements.msg.value.trim()};
    if(FORM_ENDPOINT){
      btn.disabled=true;st.textContent='Sending…';
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
        if(!r.ok)throw 0;
        f.reset();st.textContent='Thanks! We’ll get back to you shortly.';
      }catch{st.textContent='Something went wrong. Please email us at '+MAIL+'.'}
      btn.disabled=false;
    }else{
      const body=`Name: ${data.name}\nEmail: ${data.email}\nBrand: ${data.brand}\nPhone: ${data.phone}\nInterested in: ${topics}\n\n${data.message}`;
      location.href=`mailto:${MAIL}?subject=${encodeURIComponent('Inquiry from portfolio: '+(data.brand||data.name))}&body=${encodeURIComponent(body)}`;
      st.textContent='Opening your email app…';
    }
  });
}

export function initGoto(){document.querySelectorAll('[data-goto]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();$('#'+el.dataset.goto).scrollIntoView({behavior:'smooth'})}))}
export function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));
}
