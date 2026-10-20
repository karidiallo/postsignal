/* ============ TU EDYTUJESZ TREŚĆ ============
   tag:     'reels' | 'ads' | 'ugc' | 'cinematic'  (cinematic = karta 16:9, reszta 9:16)
   ratio:   opcjonalnie proporcje karty, np. '4:3', '1:1', '16:9' (domyślnie: 9:16, a dla tagu cinematic 16:9)
   poster:  okładka (proporcje jak karta) (jpg/webp), np. 'assets/work/reel1.jpg'
   preview: krótki, lekki klip 9:16 (mp4, 3–6 s, do ~1 MB) – gra na karcie w 3D
   video:   pełne wideo po kliknięciu: 'assets/work/reel1.mp4' albo embed Vimeo/YouTube
   Puste pola = placeholder.
*/
/* Formularz: wklej adres endpointu z formspree.io (https://formspree.io/f/xxxxxxx), a wiadomości będą przychodzić na maila.
   Puste = formularz otworzy program pocztowy z gotową wiadomością do contact@postsignal.eu. */
export const FORM_ENDPOINT='';
export const MAIL='contact@postsignal.eu';

export const TABS=[['all','Wszystko'],['reels','Reels'],['cinematic','Cinematic'],['ads','Reklamy'],['ugc','UGC']];
export const TAGNAME={reels:'Reel',cinematic:'Cinematic',ads:'Reklama',ugc:'UGC'};
export const ITEMS=[
 {title:'POP2UP',brand:'PostSignal',tag:'ads',desc:'Brief: dodać opis case study. Wpisz tu, co było celem i co zrobiłaś.',result:'Dodaj wynik',poster:'',preview:'assets/work/pop2up-preview.mp4',video:'assets/work/pop2up.mp4'},
 {title:'Perla',brand:'Perla',tag:'cinematic',desc:'Dodaj tu krótki opis: jaki był cel projektu i co zrobiłaś.',result:'Dodaj wynik',poster:'',preview:'assets/work/perla-preview.mp4',video:'assets/work/perla.mp4'},
 {title:'Projekt 4:3',brand:'Marka L',tag:'cinematic',ratio:'4:3',desc:'Dodaj tu krótki opis: cel projektu i co zrobiłaś.',result:'Dodaj wynik',poster:'',preview:'assets/work/video43-preview.mp4',video:'assets/work/video43.mp4'},
 {title:'NotSeen',brand:'NotSeen',tag:'cinematic',desc:'Dodaj tu krótki opis: jaki był cel projektu i co zrobiłaś.',result:'Dodaj wynik',poster:'',preview:'assets/work/notseen.mp4',video:'assets/work/notseen.mp4'},
 {title:'Mozaika',brand:'Marka A',tag:'ads',desc:'Brief: wejście nowego produktu na rynek. 6 wariantów hooków pod Meta Ads, zwycięzca wybrany po 72h testów.',result:'Dodaj wynik',poster:'',preview:'assets/work/mozaika.mp4',video:'assets/work/mozaika.mp4'},
 {title:'Unboxing UGC',brand:'Marka C',tag:'ugc',desc:'Brief: autentyczny materiał do reklam. Naturalne światło i telefon, a efekt jak od prawdziwego klienta.',result:'Hook rate 38%',poster:'',preview:'',video:''},
 {title:'Spot 15 sekund',brand:'Marka D',tag:'ads',desc:'Brief: krótki spot do social ads w 3 formatach (9:16, 1:1, 4:5) z jednego planu zdjęciowego.',result:'ROAS 3,4×',poster:'',preview:'',video:''},
];
