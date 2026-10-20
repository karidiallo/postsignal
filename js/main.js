import {ITEMS} from './data.js';
import {createWorld} from './scene.js';
import {initTabs,updateCaption,initModal,initCursor,initForm,initToTop,initTalk,initGoto,initReveal,setTotal} from './ui.js';
import {initSections} from './sections.js';

const $=s=>document.querySelector(s);

/* tło wideo: autoplay + wznawianie; gdy pliku brak, włącza się gradient zastępczy */
const bgv=$('#bgv');
const playBg=()=>{if(bgv.paused)bgv.play().catch(()=>{})};
bgv.addEventListener('error',()=>{document.body.classList.add('nobg');console.warn('Missing assets/video/bg.mp4')});
['pause','stalled','suspend'].forEach(e=>bgv.addEventListener(e,()=>setTimeout(playBg,200)));
document.addEventListener('visibilitychange',playBg);
addEventListener('scroll',playBg,{passive:true});
addEventListener('pointerdown',playBg,{once:true});

ITEMS.forEach((it,i)=>{it._i=i});setTotal(ITEMS.length);
const openModal=initModal(),cursorBig=initCursor();
const world=createWorld($('#gl'),ITEMS,{onPick:openModal,onHover:cursorBig,onCaption:updateCaption});
const spacer=$('#spacer'),contact=$('#contact');

/* część 3D = wysokość #spacer; dalej zwykłe sekcje z treścią */
function sync(){
  spacer.style.height=innerHeight*(1.2+world.count*.7)+'px';
  const range=Math.max(1,spacer.offsetHeight-innerHeight);
  const p=Math.min(1,scrollY/range),hero=scrollY<innerHeight*.3;
  $('#hero').classList.toggle('gone',scrollY>innerHeight*.25);
  document.body.classList.toggle('end',p>.93);
  world.setPaused(scrollY>range+innerHeight*.6);
  $('#talk').classList.toggle('show',!hero&&contact.getBoundingClientRect().top>innerHeight*.75);
  world.setProgress(p,hero);
}
initForm();initToTop();initTalk();initGoto();initReveal();initSections();
initTabs(k=>{world.setFilter(k);scrollTo({top:0,behavior:'smooth'});sync()});
addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);
sync();
