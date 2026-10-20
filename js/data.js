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
export const ITEMS=[
 {tag:'reels',kind:'Reels & short-form video',brand:'POP2UP',title:'Give people a reason to learn more.',desc:'Short-form videos designed to capture attention and communicate your offer.',result:'',poster:'',preview:'assets/work/pop2up-preview.mp4',video:'assets/work/pop2up.mp4'},
 {tag:'cinematic',kind:'Campaign & brand visuals',brand:'Perla',title:'Consistent across every placement.',desc:'Supporting visual content that keeps your communication consistent across the formats you need.',result:'',poster:'',preview:'assets/work/perla-preview.mp4',video:'assets/work/perla.mp4'},
 {tag:'ads',kind:'Advertising creatives',brand:'Mozaika',title:'Make the value understandable.',desc:'Visual assets for campaigns that need to communicate a clear offer and motivate the next step.',result:'',poster:'',preview:'assets/work/mozaika-preview.mp4',video:'assets/work/mozaika.mp4'},
 {tag:'cinematic',ratio:'4:3',kind:'Campaign & brand visuals',brand:'',title:'Show the experience.',desc:'Give people a reason to imagine themselves at your hotel, in your restaurant or receiving your treatment.',result:'',poster:'',preview:'assets/work/video43-preview.mp4',video:'assets/work/video43.mp4'},
 {tag:'ugc',kind:'UGC-style content',brand:'',title:'Closer to a real customer experience.',desc:'Natural, relatable content that presents your product or service the way a customer would.',result:'',poster:'',preview:'assets/work/vertical-preview.mp4',video:'assets/work/vertical.mp4'}
];
