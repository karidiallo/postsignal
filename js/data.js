/* ============ TU EDYTUJESZ TREŚĆ ============
   tag:     'reels' | 'ads' | 'ugc'
   poster:  okładka 9:16 (jpg/webp), np. 'assets/work/reel1.jpg'
   preview: krótki, lekki klip 9:16 (mp4, 3–6 s, do ~1 MB) – gra na karcie w 3D
   video:   pełne wideo po kliknięciu: 'assets/work/reel1.mp4' albo embed Vimeo/YouTube
   Puste pola = placeholder.
*/
export const TABS=[['all','Wszystko'],['reels','Reels'],['ads','Reklamy'],['ugc','UGC']];
export const TAGNAME={reels:'Reel',ads:'Reklama',ugc:'UGC'};
export const ITEMS=[
 {title:'POP2UP',brand:'PostSignal',tag:'ads',desc:'Brief: dodać opis case study. Wpisz tu, co było celem i co zrobiłaś.',result:'Dodaj wynik',poster:'',preview:'assets/work/pop2up.mp4',video:'assets/work/pop2up.mp4'},
 {title:'Launch kampanii',brand:'Marka A',tag:'ads',desc:'Brief: wejście nowego produktu na rynek. 6 wariantów hooków pod Meta Ads, zwycięzca wybrany po 72h testów.',result:'CTR +42% · CPA −31%',poster:'',preview:'',video:''},
 {title:'Reel produktowy',brand:'Marka B',tag:'reels',desc:'Brief: pokazać produkt w 20 sekund bez lektora. Mocne ujęcie otwierające, napisy w rytmie muzyki, CTA w ostatniej sekundzie.',result:'1,2 mln wyświetleń',poster:'',preview:'',video:''},
 {title:'Unboxing UGC',brand:'Marka C',tag:'ugc',desc:'Brief: autentyczny materiał do reklam. Naturalne światło i telefon, a efekt jak od prawdziwego klienta.',result:'Hook rate 38%',poster:'',preview:'',video:''},
 {title:'Spot 15 sekund',brand:'Marka D',tag:'ads',desc:'Brief: krótki spot do social ads w 3 formatach (9:16, 1:1, 4:5) z jednego planu zdjęciowego.',result:'ROAS 3,4×',poster:'',preview:'',video:''},
 {title:'Behind the scenes',brand:'Marka E',tag:'reels',desc:'Brief: pokazać ludzi za marką. Seria 5 reelsów, jeden temat na odcinek, publikacja co tydzień.',result:'+8,5k obserwujących',poster:'',preview:'',video:''},
 {title:'Testimonial',brand:'Marka F',tag:'ugc',desc:'Brief: dowód społeczny na landing page. Trzy krótkie opinie klientów w jednym stylu.',result:'Konwersja LP +18%',poster:'',preview:'',video:''},
 {title:'Kreacje Meta Ads',brand:'Marka G',tag:'ads',desc:'Brief: odświeżyć zmęczone kreacje. Nowy kierunek wizualny i pakiet 10 materiałów do testów.',result:'Frequency −22%',poster:'',preview:'',video:''},
 {title:'Reel lifestyle',brand:'Marka H',tag:'reels',desc:'Brief: pokazać markę w codzienności. Spokojny montaż, naturalny dźwięk, jedna historia na klip.',result:'Zapisy ×3',poster:'',preview:'',video:''},
 {title:'Day in my life',brand:'Marka I',tag:'ugc',desc:'Brief: treści do TikToka od zwykłej użytkowniczki. Dzień z produktem wplecionym w rutynę.',result:'380k wyświetleń',poster:'',preview:'',video:''},
 {title:'TikTok Ads',brand:'Marka J',tag:'ads',desc:'Brief: spot natywny dla TikToka. Trend, dźwięk i produkt w pierwszych 2 sekundach.',result:'CPM −27%',poster:'',preview:'',video:''}
];
