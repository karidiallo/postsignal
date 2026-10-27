import * as THREE from 'three';
const section=document.querySelector('.chapter');const canvas=document.querySelector('#book-scene');const visual=document.querySelector('.chapter-visual');
if(section&&canvas&&visual&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 try{
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,9.6);
 scene.add(new THREE.AmbientLight(0xffffff,2.0));const key=new THREE.DirectionalLight(0xffe7c4,3.5);key.position.set(-3,5,8);scene.add(key);const edge=new THREE.DirectionalLight(0xc6d6d8,2);edge.position.set(4,1,-4);scene.add(edge);
 const cover=new THREE.TextureLoader().load(new URL('../assets/shop/book-face.webp',import.meta.url).href,()=>{cover.colorSpace=THREE.SRGBColorSpace;cover.anisotropy=renderer.capabilities.getMaxAnisotropy();});
 const group=new THREE.Group();scene.add(group);
 const w=3.15,h=4.54,d=.34;
 const geometry=new THREE.BoxGeometry(w,h,d);
 const paper=new THREE.MeshStandardMaterial({color:0xeae5d7,roughness:.8});const spine=new THREE.MeshStandardMaterial({color:0x14251b,metalness:.08,roughness:.52});const front=new THREE.MeshStandardMaterial({map:cover,roughness:.64,metalness:.03});const back=new THREE.MeshStandardMaterial({color:0x0d1e14,roughness:.85});
 const book=new THREE.Mesh(geometry,[paper,paper,paper,paper,front,back]);book.castShadow=true;group.add(book);
 const spineStrip=new THREE.Mesh(new THREE.BoxGeometry(.065,h+.04,d+.05),spine);spineStrip.position.x=-w/2;group.add(spineStrip);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(4.5,4.5),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.0}));shadow.position.set(.2,-2.9,-1);scene.add(shadow);
 let progress=0,smoothed=0,visible=true,frameId=0;
 const steps=Array.from(document.querySelectorAll('[data-chapter]'));const counter=document.querySelector('[data-scene-count]');const bar=document.querySelector('[data-chapter-progress]');
 function resize(){const rect=visual.getBoundingClientRect();const width=Math.max(1,rect.width),height=Math.max(1,rect.height);renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=width<560?44:34;camera.updateProjectionMatrix();}
 function scroll(){const r=section.getBoundingClientRect();progress=THREE.MathUtils.clamp(-r.top/Math.max(1,section.offsetHeight-innerHeight),0,1);const idx=Math.min(2,Math.floor(progress*3));steps.forEach((s,i)=>s.classList.toggle('is-active',i===idx));if(counter)counter.textContent=String(idx+1).padStart(2,'0');if(bar)bar.style.transform='scaleX('+progress+')';visible=r.bottom>0&&r.top<innerHeight;}
 function animate(){frameId=requestAnimationFrame(animate);if(!visible)return;smoothed=THREE.MathUtils.lerp(smoothed,progress,.075);const t=smoothed;const wave=Math.sin(t*Math.PI);group.rotation.set(-.1+t*.16, -.47+t*Math.PI*1.65, -.11+t*.14);group.position.set(-.12+Math.sin(t*Math.PI*2)*.18,Math.sin(t*Math.PI)*.16,0);group.scale.setScalar((innerWidth<760?.83:1.04)+wave*.09);renderer.render(scene,camera);}
 addEventListener('resize',resize,{passive:true});addEventListener('scroll',scroll,{passive:true});resize();scroll();animate();visual.classList.add('is-ready');
 }catch(error){console.warn('Book 3D fallback:',error)}
}
