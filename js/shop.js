/* Set your real Stripe / Lemon Squeezy / Gumroad checkout URL here. */
window.POSTSIGNAL_CHECKOUT_URL = "";
(function(){
 const buttons=document.querySelectorAll('[data-buy]');
 const url=window.POSTSIGNAL_CHECKOUT_URL;
 buttons.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();
 if(url && /^https:\/\//.test(url)){window.location.href=url;return;}
 const pl=document.documentElement.lang==='pl';
 const subject=encodeURIComponent(pl?'Zakup e-booka PostSignal':'PostSignal ebook purchase');
 const body=encodeURIComponent(pl?'Chcę kupić e-book How to Turn Your Beauty Content Into More Bookings za $9.99. Proszę o link do płatności.':'I would like to buy How to Turn Your Beauty Content Into More Bookings for $9.99. Please send a payment link.');
 window.location.href='mailto:contact@postsignal.eu?subject='+subject+'&body='+body;
 }));
 const book=document.querySelector('.hero-book');
 if(book && window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
 const wrap=document.querySelector('.hero-visual');
 wrap.addEventListener('pointermove',e=>{const b=wrap.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;book.style.transform=`perspective(1100px) rotateY(${x*13}deg) rotateX(${-y*9}deg) translateY(-8px)`});
 wrap.addEventListener('pointerleave',()=>book.style.transform='');
 }
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');observer.unobserve(x.target)}}),{threshold:.08}):null;
 document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));
 const bar=document.querySelector('.scroll-progress');let ticking=false;
 window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{let max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?scrollY/max:0})`;ticking=false})},{passive:true});
})();
