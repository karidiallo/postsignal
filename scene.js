import * as THREE from 'three';
import {TAGNAME} from './data.js';

const W=2.25,H=4,GAP=6,START=8;
const L=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>Math.min(b,Math.max(a,v));

function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function rr(x,X,Y,w,h,r){x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h);x.closePath()}

const alphaTex=tex(450,800,(x)=>{x.fillStyle='#000';x.fillRect(0,0,450,800);x.fillStyle='#fff';rr(x,0,0,450,800,64);x.fill()});
const shadowTex=tex(512,768,(x,w,h)=>{x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=60;x.fillStyle='#000';rr(x,70,70,w-140,h-140,50);x.fill()});

function placeholder(i,it){
  return tex(450,800,(x,w,h)=>{
    const g=x.createLinearGradient(0,0,w,h);
    if(i%2===0){g.addColorStop(0,'#1f5c3f');g.addColorStop(1,'#06120c')}else{g.addColorStop(0,'#dcc48c');g.addColorStop(1,'#2a2112')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
    x.fillStyle='rgba(255,255,255,.92)';x.font='800 150px "Arial Black",Arial';x.fillText(String(i+1).padStart(2,'0'),30,h-84);
    x.font='700 22px Arial';x.fillText(TAGNAME[it.tag].toUpperCase(),34,64);
  });
}

export function createWorld(canvas,items,hooks){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);
  const geo=new THREE.PlaneGeometry(W,H),shGeo=new THREE.PlaneGeometry(W*1.6,H*1.45);
  const loader=new THREE.TextureLoader();

  const cards=items.map((it,i)=>{
    const mat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,alphaMap:alphaTex,side:THREE.DoubleSide,depthWrite:false});
    mat.map=placeholder(i,it);let video=null;
    if(it.preview){
      video=Object.assign(document.createElement('video'),{src:it.preview,muted:true,loop:true,playsInline:true,crossOrigin:'anonymous'});
      const vt=new THREE.VideoTexture(video);vt.colorSpace=THREE.SRGBColorSpace;mat.map=vt;
    }else if(it.poster)loader.load(it.poster,t=>{t.colorSpace=THREE.SRGBColorSpace;mat.map=t;mat.needsUpdate=true});
    const m=new THREE.Mesh(geo,mat);
    const sh=new THREE.Mesh(shGeo,new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,opacity:0,depthWrite:false}));
    sh.position.set(0,-.18,-.03);m.add(sh);
    m.userData={it,sh,video,tp:new THREE.Vector3(),show:true,sc:1,ph:i*1.9};
    m.position.set(0,0,-i*GAP);m.scale.setScalar(.6);scene.add(m);return m;
  });

  const bubbles=Array.from({length:18},()=>{
    const r=.35+Math.random()*1.3;
    const b=new THREE.Mesh(new THREE.RingGeometry(r,r+.03+Math.random()*.03,72),new THREE.MeshBasicMaterial({color:0xf0e3bd,transparent:true,opacity:0,depthWrite:false}));
    b.userData={bx:(Math.random()-.5)*15,by:(Math.random()-.5)*8,sp:.15+Math.random()*.25,ph:Math.random()*6,u:Math.random(),bo:.14+Math.random()*.2};
    scene.add(b);return b;
  });

  let vis=[],filter='all',camZ=START,tz=START,endZ=START,progress=0,inHero=true,mx=0,my=0,sx=0,sy=0,hov=null,last=null;

  function layout(){
    vis=cards.filter(m=>filter==='all'||m.userData.it.tag===filter);
    const off=innerWidth/innerHeight<.8?.85:2.7;
    cards.forEach(m=>m.userData.show=vis.includes(m));
    vis.forEach((m,i)=>{const u=m.userData;
      if(i===0){u.tp.set(off*1.15,-.1,1.5);u.sc=1.1}
      else{u.tp.set(Math.cos(i*1.05)*off,Math.sin(i*1.05+1)*.7,-i*GAP);u.sc=.92+((i*37)%5)*.045}});
    endZ=vis.length?-(vis.length-1)*GAP+7:START;
    bubbles.forEach(b=>b.position.z=START+3-b.userData.u*(START+3-endZ+8));
    tz=START+(endZ-START)*progress;
  }
  function resize(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.fov=cam.aspect<.8?70:55;cam.updateProjectionMatrix();layout()}

  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function pick(){mv.set(sx/innerWidth*2-1,-(sy/innerHeight)*2+1);ray.setFromCamera(mv,cam);
    const h=ray.intersectObjects(vis.filter(m=>m.material.opacity>.5))[0];return h?h.object:null}
  addEventListener('mousemove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;sx=e.clientX;sy=e.clientY});
  addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  canvas.addEventListener('click',()=>{const m=pick();if(m)hooks.onPick(m.userData.it)});
  addEventListener('resize',resize);

  function tick(){
    const t=performance.now()/1000;
    camZ=L(camZ,tz,.07);
    cam.position.set(L(cam.position.x,mx*.7,.05),L(cam.position.y,-my*.4,.05),camZ);
    cam.lookAt(cam.position.x*.5,cam.position.y*.5,camZ-10);
    const h=matchMedia('(hover:hover)').matches?pick():null;
    if(h!==hov){hov=h;hooks.onHover(!!h)}
    let near=null,nd=1e9;
    cards.forEach(m=>{
      const u=m.userData,s=u.show;
      m.position.x=L(m.position.x,s?u.tp.x:0,.08);
      m.position.y=L(m.position.y,(s?u.tp.y:0)+Math.sin(t*.9+u.ph)*.12,.08);
      m.position.z=L(m.position.z,s?u.tp.z:m.position.z,.08);
      m.rotation.y=L(m.rotation.y,s?-u.tp.x*.1:0,.08);
      m.rotation.z=L(m.rotation.z,s?-u.tp.x*.04+Math.sin(t*.6+u.ph)*.03:0,.08);
      m.scale.setScalar(L(m.scale.x,s?u.sc*(m===hov?1.06:1):.5,.1));
      const a=cl((camZ-m.position.z-1)/2.5,0,1)*cl(1-(camZ-m.position.z-16)/10,0,1);
      m.material.opacity=L(m.material.opacity,s?a:0,.1);
      u.sh.material.opacity=m.material.opacity*.55;
      m.visible=m.material.opacity>.01;
      if(u.video){const on=m.material.opacity>.3;if(on&&u.video.paused)u.video.play().catch(()=>{});else if(!on&&!u.video.paused)u.video.pause()}
      if(s){const d=Math.abs(camZ-8-m.position.z);if(d<nd){nd=d;near=m}}
    });
    bubbles.forEach(b=>{const u=b.userData;
      b.position.x=u.bx+Math.cos(t*u.sp+u.ph)*.6;b.position.y=u.by+Math.sin(t*u.sp*1.3+u.ph)*.9;
      b.material.opacity=u.bo*cl((camZ-b.position.z-1)/2,0,1);b.lookAt(cam.position)});
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
