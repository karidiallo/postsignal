import {ITEMS} from './data.js';
import {createWorld} from './scene.js';
import {initTabs,setCaption,initModal,initCursor} from './ui.js';

const $=s=>document.querySelector(s);

/* tło wideo: pobierane w całości jako blob, więc pętla działa też na serwerach bez obsługi Range (np. python http.server) */
const bgv=$('#bgv'),BG='assets/video/bg.mp4';
const playBg=()=>{if(bgv.paused)bgv.play().catch(()=>{})};
fetch(BG).then(r=>r.blob()).then(b=>{bgv.src=URL.createObjectURL(b);playBg()}).catch(()=>{bgv.src=BG;playBg()});
['pause','stalled','suspend','waiting'].forEach(e=>bgv.addEventListener(e,()=>setTimeout(playBg,200)));
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
