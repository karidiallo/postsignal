import {TABS,TAGNAME} from './data.js';
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
