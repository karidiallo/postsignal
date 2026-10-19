import {ITEMS} from './data.js';
import {createWorld} from './scene.js';
import {initTabs,setCaption,initModal,initCursor} from './ui.js';

const $=s=>document.querySelector(s);

/* tło wideo: prosty autoplay + wznawianie; gdy pliku brak, włącza się gradient zastępczy */
const bgv=$('#bgv');
const playBg=()=>{if(bgv.paused)bgv.play().catch(()=>{})};
bgv.addEventListener('error',()=>{document.body.classList.add('nobg');console.warn('Brak assets/video/bg.mp4 – sprawdź, czy plik jest w repo.')});
['pause','stalled','suspend'].forEach(e=>bgv.addEventListener(e,()=>setTimeout(playBg,200)));
document.addEventListener('visibilitychange',playBg);
addEventListener('scroll',playBg,{passive:true});
addEventListener('pointerdown',playBg,{once:true});

const openModal=initModal(),cursorBig=initCursor();
const world=createWorld($('#gl'),ITEMS,{onPick:openModal,onHover:cursorBig,onNear:setCaption});

function sync(){
  $('#spacer').style.height=innerHeight*(1.2+world.count*.7)+'px';
  $('#cnt-n').textContent=world.count+' projektów';
  const max=document.documentElement.scrollHeight-innerHeight;
  const hero=scrollY<innerHeight*.3;
  $('#hero').classList.toggle('gone',scrollY>innerHeight*.25);
  world.setProgress(max>0?scrollY/max:0,hero);
}
initTabs(k=>{world.setFilter(k);scrollTo({top:0,behavior:'smooth'});sync()});
addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);
sync();
