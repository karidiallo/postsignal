import {ITEMS} from './data.js';
import {createWorld} from './scene.js';
import {initTabs,updateCaption,initModal,initCursor,initForm,initToTop,initTalk,initGoto,initReveal,setTotal} from './ui.js';
import {initSections} from './sections.js';
import {initSigil} from './sigil.js';

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
const spacer=$('#spacer'),contact=$('#contact'),sigil=initSigil();
const sm=t=>{t=Math.min(1,Math.max(0,t));return t*t*(3-2*t)};

/* część 3D = wysokość #spacer; dalej zwykłe sekcje z treścią */
function sync(){
  /* travel = przejazd kamery przez karty; OUT = dodatkowy odcinek, na którym stoi sigil */
  const travel=innerHeight*(.2+world.count*.7),OUT=innerHeight*.9;
  spacer.style.height=(travel+innerHeight+OUT)+'px';
  const p=Math.min(1,scrollY/Math.max(1,travel)),hero=scrollY<innerHeight*.3;
  $('#hero').classList.toggle('gone',scrollY>innerHeight*.25);
  document.body.classList.toggle('end',p>.93);
  world.setPaused(scrollY>travel+OUT+innerHeight*.6);
  $('#talk').classList.toggle('show',!hero&&contact.getBoundingClientRect().top>innerHeight*.75);
  world.setProgress(p,hero);
  /* sigil: wchodzi, gdy kamera mija ostatnią kartę, znika przy wjeździe sekcji z tekstem */
  const s1=travel*.9,s2=travel+OUT*.4,f1=travel+OUT*.75,f2=travel+OUT+innerHeight*.55;
  const out=sm((scrollY-f1)/(f2-f1));
  sigil.set(sm((scrollY-s1)/(s2-s1))*(1-out),out);
}
initForm();initToTop();initTalk();initGoto();initReveal();initSections();
initTabs(k=>{world.setFilter(k);scrollTo({top:0,behavior:'smooth'});sync()});
addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);
sync();

/* mobile (iOS Low Power Mode itp.) potrafi zablokować autoplay – pierwszy dotyk uruchamia widoczne wideo */
const kick=()=>document.querySelectorAll('video').forEach(v=>{const r=v.getBoundingClientRect();if(v.src&&v.paused&&r.bottom>0&&r.top<innerHeight&&!v.closest('#modal'))v.play().catch(()=>{})});
['touchstart','pointerdown'].forEach(e=>addEventListener(e,kick,{once:true,passive:true}));
