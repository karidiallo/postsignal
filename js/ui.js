import {TABS,TAGNAME,FORM_ENDPOINT,MAIL} from './data.js';
const $=s=>document.querySelector(s);

export function initTabs(onChange){
  const nav=$('#tabs');
  TABS.forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;if(k==='all')b.className='on';
    b.onclick=()=>{[...nav.children].forEach(c=>c.classList.toggle('on',c===b));onChange(k)};nav.appendChild(b)});
}

let timer;
export function setCaption(it){
  const c=$('#cap');c.classList.remove('in');clearTimeout(timer);
  if(!it)return;
  timer=setTimeout(()=>{
    $('#c-tag').textContent=TAGNAME[it.tag]+' · '+it.brand;$('#c-title').textContent=it.title;
    $('#c-desc').textContent=it.desc;$('#c-res').textContent=it.result;c.classList.add('in');
  },220);
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
    else box.textContent='Dodaj link do wideo w js/data.js (pole „video”).';
    const x=Object.assign(document.createElement('button'),{className:'x',textContent:'Zamknij ✕',onclick:close});box.appendChild(x);
    modal.classList.add('open');
  };
}

export function initCursor(){
  const c=$('#cursor');let x=0,y=0,cx=0,cy=0;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
  return on=>c.classList.toggle('big',on);
}

export function initForm(){
  const f=$('#form'),st=$('#fstatus'),btn=f.querySelector('button');
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    if(f.elements._hp.value)return;
    const name=f.elements.name,email=f.elements.email;
    [name,email].forEach(i=>i.classList.remove('invalid'));
    let bad=false;
    if(!name.value.trim()){name.classList.add('invalid');bad=true}
    if(!/^\S+@\S+\.\S+$/.test(email.value.trim())){email.classList.add('invalid');bad=true}
    if(bad){st.textContent='Uzupełnij imię i poprawny e-mail.';return}
    const topics=[...f.querySelectorAll('[name=topic]:checked')].map(i=>i.value).join(', ');
    const data={name:name.value.trim(),email:email.value.trim(),brand:f.elements.brand.value.trim(),topics,message:f.elements.msg.value.trim()};
    if(FORM_ENDPOINT){
      btn.disabled=true;st.textContent='Wysyłam…';
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
        if(!r.ok)throw 0;
        f.reset();st.textContent='Dzięki! Odezwiemy się najszybciej, jak to możliwe.';
      }catch{st.textContent='Nie udało się wysłać. Napisz do nas na '+MAIL+'.'}
      btn.disabled=false;
    }else{
      const body=`Imię: ${data.name}\nE-mail: ${data.email}\nMarka: ${data.brand}\nTemat: ${topics}\n\n${data.message}`;
      location.href=`mailto:${MAIL}?subject=${encodeURIComponent('Zapytanie z portfolio: '+(data.brand||data.name))}&body=${encodeURIComponent(body)}`;
      st.textContent='Otwieram Twoją pocztę…';
    }
  });
}
