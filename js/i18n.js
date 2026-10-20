/* Język strony bierzemy z <html lang>. EN = / , PL = /pl/
   BASE = prefiks do zasobów (assets/...) – w /pl/ ustawiony w index.html na "../" (data-base). */
export const LANG=document.documentElement.lang==='pl'?'pl':'en';
export const BASE=document.documentElement.dataset.base||'';

const STR={
 en:{
  tabs:[['all','All'],['reels','Reels'],['ads','Ads'],['ugc','UGC'],['cinematic','Cinematic']],
  tagname:{reels:'Reel',ads:'Ad',ugc:'UGC',cinematic:'Cinematic'},
  modalEmpty:'Add a video link in js/data.js (the "video" field).',close:'Close ✕',
  invalid:'Please check the highlighted fields.',consent:'Please confirm you have read the Privacy Policy.',sending:'Sending…',thanks:'Thanks! We’ll get back to you shortly.',
  error:'Something went wrong. Please email us at ',opening:'Opening your email app…',
  subject:'Inquiry from portfolio: ',labels:{name:'Name',email:'Email',brand:'Brand',phone:'Phone',topics:'Interested in'},
  keywords:/^(guest|patient|hotels|clinics|decision|treatment|dinner|weekend|contact)/i
 },
 pl:{
  tabs:[['all','Wszystkie'],['reels','Reelsy'],['ads','Reklamy'],['ugc','UGC'],['cinematic','Cinematic']],
  tagname:{reels:'Reel',ads:'Reklama',ugc:'UGC',cinematic:'Cinematic'},
  modalEmpty:'Dodaj link do wideo w js/data.js (pole „video”).',close:'Zamknij ✕',
  invalid:'Sprawdź zaznaczone pola.',consent:'Potwierdź zapoznanie się z Polityką prywatności.',sending:'Wysyłanie…',thanks:'Dziękujemy! Wkrótce się odezwiemy.',
  error:'Coś poszło nie tak. Napisz do nas na ',opening:'Otwieram aplikację pocztową…',
  subject:'Zapytanie ze strony: ',labels:{name:'Imię',email:'Email',brand:'Marka',phone:'Telefon',topics:'Zainteresowanie'},
  keywords:/^(gość|gościom|pacjent|hotel|klinik|decyduje|zabieg|treści|content)/i
 }
};
export const T=STR[LANG];
