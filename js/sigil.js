/* Sigil na końcu portfolio: pojawia się, gdy kamera przeleci przez ostatnią kartę.
   Cienki biały zarys + złota poświata, która podąża za kursorem (na dotyku dryfuje sama). */
const $=s=>document.querySelector(s);
export function initSigil(){
  const root=$('#sigil'),sg=$('#sg');
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let px=null,py=0,tx=0,ty=0,x=0,y=0,gx=.5,gy=.5,vis=0,lift=0,raf=0;
  addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;px=e.clientX;py=e.clientY},{passive:true});

  function frame(t){
    raf=0;if(vis<.01)return;
    let tgx,tgy;
    if(px===null||still){            /* brak kursora: poświata dryfuje sama */
      tgx=.5+Math.sin(t/1700)*.3;tgy=.5+Math.cos(t/2300)*.2;tx=Math.sin(t/3000)*.3;ty=Math.cos(t/3700)*.2;
    }else{
      const w=sg.offsetWidth||1,h=sg.offsetHeight||1;
      tgx=(px-innerWidth/2)/w+.5;tgy=(py-innerHeight/2)/h+.5;
      tx=(px/innerWidth-.5)*2;ty=(py/innerHeight-.5)*2;
    }
    x+=(tx-x)*.07;y+=(ty-y)*.07;gx+=(tgx-gx)*.12;gy+=(tgy-gy)*.12;
    sg.style.setProperty('--gx',(gx*100).toFixed(1)+'%');sg.style.setProperty('--gy',(gy*100).toFixed(1)+'%');
    sg.style.transform=`translate3d(${(-x*18).toFixed(1)}px,${(-y*12-lift*70).toFixed(1)}px,0) rotateX(${(-y*6).toFixed(2)}deg) rotateY(${(x*8).toFixed(2)}deg) scale(${(.9+.1*vis).toFixed(3)})`;
    raf=requestAnimationFrame(frame);
  }
  /* v: 0–1 widoczność, k: 0–1 wyjście w górę przy przejściu do sekcji z tekstem */
  return{set(v,k){
    vis=v;lift=k;
    root.style.opacity=v.toFixed(3);root.style.visibility=v<.01?'hidden':'visible';
    if(v>=.01&&!raf)raf=requestAnimationFrame(frame);
  }};
}
