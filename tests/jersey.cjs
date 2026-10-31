const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCanvas,Path2D}=require('@napi-rs/canvas');
global.window=global;global.Path2D=Path2D;global.document={createElement:()=>createCanvas(1,1)};
const jersey=require('../dist/jersey.js');
assert.equal(jersey.loopLengthMm(30,100),3);
assert.throws(()=>jersey.loopLengthMm(30,0));
assert.throws(()=>jersey.model(1));
assert.equal(jersey.model().walePitch,25.4/30);assert.equal(jersey.model().coursePitch,25.4/42);
for(const length of [3,3.5,4]){const m=jersey.model(length);let arc=0;for(let i=1;i<m.points.length;i++)arc+=Math.hypot(...m.points[i].map((v,k)=>v-m.points[i-1][k]));assert(Math.abs(arc-length)<1e-10);const first=m.points[0],last=m.points.at(-1);assert(Math.abs(last[0]-first[0]-m.walePitch)<1e-10);assert.equal(last[1],first[1]);assert.equal(last[2],first[2])}
vm.runInThisContext(fs.readFileSync(require.resolve('../dist/renderer.js'),'utf8'));
const o={pattern:[['K','K'],['K','K']],jerseyStudy:true,color:'#dddcd4',yarns:null,thickness:7,spacing:22,zoom:1,side:'both',mode:'swatch',lens:{x:.5,y:.5},garmentType:'tee',garmentSide:'front'};
assert(jersey.applicable(o));assert(!jersey.applicable({...o,pattern:[['K','T'],['K','K']]}));
const start=performance.now(),front=jersey.texture(o,false),back=jersey.texture(o,true);
assert.notDeepEqual(front.toBuffer('image/png'),back.toBuffer('image/png'));
const canvas=createCanvas(1080,720);renderFabricSheet(canvas.getContext('2d'),o);fs.writeFileSync('/tmp/jersey-study.png',canvas.toBuffer('image/png'));
renderGarment(canvas.getContext('2d'),o);const prior=canvas.toBuffer('image/png');renderGarment(canvas.getContext('2d'),{...o,jerseyStudy:false});assert.notDeepEqual(prior,canvas.toBuffer('image/png'));
renderFabricSheet(canvas.getContext('2d'),{...o,pattern:[['K','T'],['K','K']]});
const max={...o,pattern:Array.from({length:32},()=>Array(24).fill('K'))};renderFabricSheet(canvas.getContext('2d'),max);
console.log('Passed: 3mm conversion, invalid length, sampled arc length, continuous course endpoints, all-knit gating, front/back distinction, garment cache invalidation, mixed fallback, maximum repeat. Total canvas test ms:',Math.round(performance.now()-start));
