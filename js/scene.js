import * as THREE from 'three';

const GAP=6,START=8;
const L=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>Math.min(b,Math.max(a,v));
const ratioOf=it=>{if(it.ratio){const [a,b]=it.ratio.split(':').map(Number);if(a&&b)return a/b}return it.tag==='cinematic'?16/9:9/16};
const isL=it=>ratioOf(it)>=1;
const sizeOf=r=>{if(r<1)return[4*r,4];const w=4.4+(r-1.333)*1.4;return[w,w/r]};

function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
function rr(x,X,Y,w,h,r){x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h);x.closePath()}

/* zasoby karty zależne od proporcji (cache) */
const cache={};
function assets(r){
  const k=r.toFixed(3);if(cache[k])return cache[k];
  const [cw,ch]=sizeOf(r),pw=r>=1?800:Math.round(800*r),ph=r>=1?Math.round(800/r):800,rad=Math.min(pw,ph)*.14,pad=Math.round(Math.max(pw,ph)*.11);
  const mask=tex(pw,ph,x=>{x.fillStyle='#000';x.fillRect(0,0,pw,ph);x.fillStyle='#fff';rr(x,0,0,pw,ph,rad);x.fill()});
  const sh=tex(pw+pad*2,ph+pad*2,x=>{x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=pad*.6;x.fillStyle='#000';rr(x,pad,pad,pw,ph,rad);x.fill()});
  return cache[k]={pw,ph,mask,sh,geo:new THREE.PlaneGeometry(cw,ch),sgeo:new THREE.PlaneGeometry(cw*(pw+pad*2)/pw,ch*(ph+pad*2)/ph)};
}

function placeholder(i,A){
  return tex(A.pw,A.ph,(x,w,h)=>{
    const g=x.createLinearGradient(0,0,w,h);
    if(i%2===0){g.addColorStop(0,'#1f5c3f');g.addColorStop(1,'#06120c')}else{g.addColorStop(0,'#dcc48c');g.addColorStop(1,'#2a2112')}
    x.fillStyle=g;x.fillRect(0,0,w,h);
  });
}

export function createWorld(canvas,items,hooks){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setClearColor(0,0);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);
  const loader=new THREE.TextureLoader();

  const cards=items.map((it,i)=>{
    const A=assets(ratioOf(it));
    const mat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,alphaMap:A.mask,side:THREE.DoubleSide,depthWrite:false});
    const ph=placeholder(i,A);mat.map=ph;let video=null;
    if(it.poster)loader.load(it.poster,t=>{t.colorSpace=THREE.SRGBColorSpace;ph.dispose();mat.map=t;mat.needsUpdate=true});
    if(it.preview){
      video=Object.assign(document.createElement('video'),{muted:true,loop:true,playsInline:true,preload:'none'});
      const vt=new THREE.VideoTexture(video);vt.colorSpace=THREE.SRGBColorSpace;vt.generateMipmaps=false;vt.minFilter=THREE.LinearFilter;
      const u0=()=>m.userData;
      video.addEventListener('playing',()=>{mat.map=vt;mat.needsUpdate=true;u0().ready=true},{once:true});
      video.addEventListener('error',()=>{if(it.video&&/\.mp4$/i.test(it.video)&&!video.dataset.fb){video.dataset.fb=1;video.src=it.video;video.play().catch(()=>{})}else u0().ready=true});
    }
    const m=new THREE.Mesh(A.geo,mat);
    const sh=new THREE.Mesh(A.sgeo,new THREE.MeshBasicMaterial({map:A.sh,transparent:true,opacity:0,depthWrite:false}));
    sh.position.set(0,-.18,-.03);m.add(sh);
    m.userData={it,sh,video,ready:!it.preview||!!it.poster,loaded:false,tp:new THREE.Vector3(),show:true,sc:1,ph:i*1.9};
    m.position.set(0,0,-i*GAP);m.scale.setScalar(.6);scene.add(m);return m;
  });

  let vis=[],filter='all',camZ=START,tz=START,endZ=START,progress=0,inHero=true,mx=0,my=0,sx=0,sy=0,moved=true,hov=null,last=null;
  const canHover=matchMedia('(hover:hover)').matches;

  function layout(){
    vis=cards.filter(m=>filter==='all'||m.userData.it.tag===filter);
    const off=innerWidth/innerHeight<.8?.85:2.4,narrow=off<1;
    cards.forEach(m=>m.userData.show=vis.includes(m));
    vis.forEach((m,i)=>{const u=m.userData,side=i%2===0?1:-1,land=isL(u.it);
      if(i===0)u.tp.set(off*(land?.8:1.15),-.1,1.5);
      else u.tp.set(side*off*(land?.8:1),Math.cos(i*1.3)*.45,-i*GAP+(land?1.2:0));
      if(land)u.sc=narrow?.62:1.12;else if(i>0)u.sc=.95+((i*37)%5)*.04;
      if(narrow&&land)u.tp.x=0;});
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
      const a=cl((dist-1)/2.5,0,1)*cl(1-(dist-8)/3.5,0,1);
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
    if(n!==last){last=n;hooks.onNear(n?n.userData.it:null,n?Math.sign(n.userData.tp.x):0)}
    if(last&&hooks.onTrack){
      const hw=last.geometry.parameters.width/2*last.scale.x,pr=x=>(new THREE.Vector3(x,last.position.y,last.position.z).project(cam).x*.5+.5)*innerWidth;
      const cy=(-new THREE.Vector3(last.position.x,last.userData.tp.y,last.position.z).project(cam).y*.5+.5)*innerHeight;
      hooks.onTrack(pr(last.position.x-hw),pr(last.position.x+hw),cy);
    }
    renderer.render(scene,cam);requestAnimationFrame(tick);
  }
  resize();tick();
  return{
    setFilter(k){filter=k;layout()},
    setProgress(p,hero){progress=p;inHero=hero;tz=START+(endZ-START)*p},
    get count(){return vis.length}
  };
}
