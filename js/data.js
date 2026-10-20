/* ============ YOUR WORK GOES HERE ============
   Order = order on the page. Cards alternate right / left automatically.
   tag:     'reels' | 'ads' | 'ugc' | 'cinematic'   (filter + default card shape)
   ratio:   optional card shape, e.g. '4:3', '1:1', '16:9' (default 9:16, and 16:9 for tag 'cinematic')
   kind:    label above the title, e.g. 'Reels & short-form video'
   brand:   client / project name (shown after the label, optional)
   title:   short headline, desc: 1–2 sentences
   result:  OPTIONAL small tag, e.g. '250k views', '3.1% CTR'. Leave '' to hide it.
   poster:  optional cover image, preview: short light clip (mp4, 3–6 s), video: full video on click
*/
import {LANG,BASE} from './i18n.js';

/* Media i ustawienia wspólne dla obu języków */
const MEDIA=[
 {tag:'reels',poster:'assets/work/pop2up-poster.webp',preview:'assets/work/pop2up-preview.mp4',video:'assets/work/pop2up.mp4'},
 {tag:'cinematic',poster:'assets/work/perla-poster.webp',preview:'assets/work/perla-preview.mp4',video:'assets/work/perla.mp4'},
 {tag:'ads',poster:'assets/work/mozaika-poster.webp',preview:'assets/work/mozaika-preview.mp4',video:'assets/work/mozaika.mp4'},
 {tag:'cinematic',ratio:'4:3',poster:'assets/work/video43-poster.webp',preview:'assets/work/video43-preview.mp4',video:'assets/work/video43.mp4'},
 {tag:'ugc',ratio:'16:9',poster:'assets/work/notseen-poster.webp',preview:'assets/work/notseen-preview.mp4',video:'assets/work/notseen.mp4'}
];

/* Teksty – ta sama kolejność co MEDIA. brand/result zwykle takie same w obu językach */
const TEXT={
 en:[
  {kind:'Reels & short-form video',brand:'POP2UP',title:'Give people a reason to learn more.',desc:'Short-form videos designed to capture attention and communicate your offer.',result:''},
  {kind:'Campaign & brand visuals',brand:'Perła',title:'Consistent across every placement.',desc:'Supporting visual content that keeps your communication consistent across the formats you need.',result:''},
  {kind:'Advertising creatives',brand:'Mozaika',title:'Make the value understandable.',desc:'Visual assets for campaigns that need to communicate a clear offer and motivate the next step.',result:''},
  {kind:'UGC-style content',brand:'',title:'Show the experience.',desc:'Give people a reason to imagine themselves at your hotel, in your restaurant or receiving your treatment.',result:''},
  {kind:'Campaign & brand visuals',brand:'',title:'Closer to a real customer experience.',desc:'Natural, relatable content that presents your product or service the way a customer would.',result:''}
 ],
 pl:[
  {kind:'Reelsy i krótkie formy wideo',brand:'POP2UP',title:'Daj ludziom powód, by dowiedzieli się więcej.',desc:'Krótkie wideo stworzone, by przyciągać uwagę i jasno komunikować Twoją ofertę.',result:''},
  {kind:'Kampanie i wizualia marki',brand:'Perla',title:'Spójnie w każdym miejscu emisji.',desc:'Uzupełniający content wizualny, który utrzymuje spójność komunikacji we wszystkich potrzebnych formatach.',result:''},
  {kind:'Kreacje reklamowe',brand:'Mozaika',title:'Spraw, by wartość była zrozumiała.',desc:'Materiały wizualne do kampanii, które jasno komunikują ofertę i motywują do następnego kroku.',result:''},
  {kind:'Kampanie i wizualia marki',brand:'',title:'Pokaż doświadczenie.',desc:'Daj ludziom powód, by wyobrazili sobie siebie w Twoim hotelu, w Twojej restauracji lub podczas zabiegu u Ciebie.',result:''},
  {kind:'Content w stylu UGC',brand:'',title:'Bliżej prawdziwego doświadczenia klienta.',desc:'Naturalny, bliski odbiorcom content, który pokazuje Twój produkt lub usługę tak, jak zrobiłby to klient.',result:''}
 ]
};

const pre=u=>u?BASE+u:u;
export const ITEMS=MEDIA.map((m,i)=>({...m,...TEXT[LANG][i],poster:pre(m.poster),preview:pre(m.preview),video:pre(m.video)}));
