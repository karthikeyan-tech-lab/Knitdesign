const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCanvas,Path2D}=require('@napi-rs/canvas');
global.window=global;global.Path2D=Path2D;global.document={createElement:()=>createCanvas(1,1)};
require('../dist/jersey.js');vm.runInThisContext(fs.readFileSync(require.resolve('../dist/renderer.js'),'utf8'));
const o={pattern:[['K','K'],['K','K']],color:'#ffffff',thickness:7,spacing:22,garmentType:'tee',garmentSide:'front'};
const mean=(ctx)=>{const d=ctx.getImageData(450,280,180,260).data,s=[0,0,0];for(let i=0;i<d.length;i+=4)for(let c=0;c<3;c++)s[c]+=d[i+c];return s.map(v=>v/(d.length/4))};
const results=[];
for(const jerseyStudy of [false,true])for(const garmentSide of ['front','back']){
 const a=createCanvas(1080,720),b=createCanvas(1080,720);
 renderGarment(a.getContext('2d'),{...o,jerseyStudy,garmentSide,yarns:['#87ceeb','#ffffff']});
 renderGarment(b.getContext('2d'),{...o,jerseyStudy,garmentSide,yarns:['#ffffff','#87ceeb']});
 const ma=mean(a.getContext('2d')),mb=mean(b.getContext('2d')),difference=ma.map((v,i)=>Math.abs(v-mb[i]));
 results.push({jerseyStudy,garmentSide,difference});
 // A one-course phase shift may alter edge pixels, not the overall colour balance.
 assert(Math.max(...difference)<1,'Swapping alternating colours must not recolour the fabric background: '+JSON.stringify(results.at(-1)));
 // The collar has its own colour; changing the starting feeder must not change it.
 assert.deepEqual(a.getContext('2d').getImageData(540,garmentSide==='front'?193:139,1,1).data,b.getContext('2d').getImageData(540,garmentSide==='front'?193:139,1,1).data);
}
console.log(JSON.stringify({passed:'colour-order balance and independent collar in both renderers and garment faces',results}));
