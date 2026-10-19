import * as THREE from 'three';
import {TAGNAME} from './data.js';

const W=2.25,H=4,HW=5,HH=2.8125,GAP=6,START=8;
const L=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const isH=it=>it.tag==='horizontal';

function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function rr(x,X,Y,w,h,r){x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h);x.closePath()}
const mask=(w,h,r)=>tex(w,h,x=>{x.fillStyle='#000';x.fillRect(0,0,w,h);x.fillStyle='#fff';rr(x,0,0,w,h,r);x.fill()});
const shadow=(w,h,r)=>tex(w,h,(x,w,h)=>{x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=50;x.fillStyle='#000';rr(x,70,70,w-140,h-140,r);x.fill()});
const MASK={v:mask(450,800,64),h:mask(800,450,56)},SHADOW={v:shadow(512,768,50),h:shadow(768,512,46)};

function placeholder(i,it){
  const hz=isH(it);
  return tex(hz?800:450,hz?450:800,(x,w,h)=>{
    const g=x.createLinearGradient(0,0,w,h);
    if(i%2===0){g.addColorStop(0,'#1f5c3f');g.addColorStop(1,'#06120c')}else{g.addColorStop(0,'#dcc48c');g.addColorStop(1,'#2a2112')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
  });
}

export function createWorld(canvas,items,hooks){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setClearColor(0,0);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);
  const G={v:new THREE.PlaneGeometry(W,H),h:new THREE.PlaneGeometry(HW,HH)};
  const SG={v:new THREE.PlaneGeometry(W*1.6,H*1.45),h:new THREE.PlaneGeometry(HW*1.3,HH*1.6)};
  const loader=new THREE.TextureLoader();

  const cards=items.map((it,i)=>{
    const k=isH(it)?'h':'v';
    const mat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,alphaMap:MASK[k],side:THREE.DoubleSide,depthWrite:false});
    const ph=placeholder(i,it);mat.map=ph;let video=null;
    if(it.poster)loader.load(it.poster,t=>{t.colorSpace=THREE.SRGBColorSpace;ph.dispose();mat.map=t;mat.needsUpdate=true});
    if(it.preview){
      video=Object.assign(document.createElement('video'),{muted:true,loop:true,playsInline:true,preload:'none'});
      const vt=new THREE.VideoTexture(video);vt.colorSpace=THREE.SRGBColorSpace;vt.generateMipmaps=false;vt.minFilter=THREE.LinearFilter;
      const u0=()=>m.userData;
      video.addEventListener('playing',()=>{mat.map=vt;mat.needsUpdate=true;u0().ready=true},{once:true});
      video.addEventListener('error',()=>{if(it.video&&/\.mp4$/i.test(it.video)&&!video.dataset.fb){video.dataset.fb=1;video.src=it.video;video.play().catch(()=>{})}else u0().ready=true});
    }
    const m=new THREE.Mesh(G[k],mat);
    const sh=new THREE.Mesh(SG[k],new THREE.MeshBasicMaterial({map:SHADOW[k],transparent:true,opacity:0,depthWrite:false}));
    sh.position.set(0,-.18,-.03);m.add(sh);
    m.userData={it,sh,video,ready:!it.preview||!!it.poster,loaded:false,tp:new THREE.Vector3(),show:true,sc:1,ph:i*1.9};
    m.position.set(0,0,-i*GAP);m.scale.setScalar(.6);scene.add(m);return m;
  });

  let vis=[],filter='all',camZ=START,tz=START,endZ=START,progress=0,inHero=true,mx=0,my=0,sx=0,sy=0,moved=true,hov=null,last=null;
  const canHover=matchMedia('(hover:hover)').matches;

  function layout(){
    vis=cards.filter(m=>filter==='all'||m.userData.it.tag===filter);
    const off=innerWidth/innerHeight<.8?.85:2.7,narrow=off<1;
    cards.forEach(m=>m.userData.show=vis.includes(m));
    let hc=0;
    vis.forEach((m,i)=>{const u=m.userData;
      if(isH(u.it)){
        const left=hc++%2===0;
        u.tp.set(narrow?0:(left?-1:1)*off*.95,.05,-i*GAP+1.2);u.sc=narrow?.62:1.12;
      }else if(i===0){u.tp.set(off*1.15,-.1,1.5);u.sc=1.1}
      else{u.tp.set(Math.cos(i*1.05)*off,Math.sin(i*1.05+1)*.7,-i*GAP);u.sc=.92+((i*37)%5)*.045}});
    endZ=vis.length?-(vis.length-1)*GAP-2:START;
    tz=START+(endZ-START)*progress;
  }
  function resize(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<.8?70:55;cam.updateProjectionMatrix();layout()}

  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function pick(){mv.set(sx/innerWidth*2-1,-(sy/innerHeight)*2+1);ray.setFromCamera(mv,cam);
    const h=ray.intersectObjects(vis.filter(m=>m.material.opacity>.5))[0];return h?h.object:null}
  addEventListener('mousemove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;sx=e.clientX;sy=e.clientY;moved=true});
  addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  addEventListener('scroll',()=>{moved=true},{passive:true});
  canvas.addEventListener('click',()=>{const m=pick();if(m)hooks.onPick(m.userData.it)});
  addEventListener('resize',resize);

  function tick(){
    const t=performance.now()/1000;
    camZ=L(camZ,tz,.08);
    cam.position.set(L(cam.position.x,mx*.7,.05),L(cam.position.y,-my*.4,.05),camZ);
    cam.lookAt(cam.position.x*.5,cam.position.y*.5,camZ-10);
    cam.updateMatrixWorld();
    if(canHover&&moved){moved=false;const h=pick();if(h!==hov){hov=h;hooks.onHover(!!h)}}
    let near=null,nd=1e9;
    cards.forEach(m=>{
      const u=m.userData,s=u.show,dist=camZ-m.position.z;
      m.position.x=L(m.position.x,s?u.tp.x:0,.09);
      m.position.y=L(m.position.y,(s?u.tp.y:0)+Math.sin(t*.9+u.ph)*.12,.09);
      m.position.z=L(m.position.z,s?u.tp.z:m.position.z,.09);
      m.rotation.y=L(m.rotation.y,s?-u.tp.x*.1:0,.09);
      m.rotation.z=L(m.rotation.z,s?-u.tp.x*.04+Math.sin(t*.6+u.ph)*.03:0,.09);
      m.scale.setScalar(L(m.scale.x,s?u.sc*(m===hov?1.06:1):.5,.12));
      const a=cl((dist-1)/2.5,0,1)*cl(1-(dist-16)/10,0,1);
      m.material.opacity=L(m.material.opacity,s&&u.ready?a:0,.12);
      u.sh.material.opacity=m.material.opacity*.55;
      m.visible=m.material.opacity>.01;
      if(u.video){
        const pre=s&&dist>1&&dist<26,on=s&&dist>1&&dist<14;   /* ładuje z wyprzedzeniem, gra tylko w zasięgu kamery */
        if(pre&&!u.loaded){u.loaded=true;u.video.src=u.it.preview;u.video.load()}
        if(on){if(u.video.paused)u.video.play().catch(()=>{})}
        else if(!u.video.paused)u.video.pause();
      }
      if(s){const d=Math.abs(dist-8);if(d<nd){nd=d;near=m}}
    });
    const n=!inHero&&near?near:null;
    if(n!==last){last=n;hooks.onNear(n?n.userData.it:null)}
    renderer.render(scene,cam);requestAnimationFrame(tick);
  }
  resize();tick();
  return{
    setFilter(k){filter=k;layout()},
    setProgress(p,hero){progress=p;inHero=hero;tz=START+(endZ-START)*p},
    get count(){return vis.length}
  };
}
