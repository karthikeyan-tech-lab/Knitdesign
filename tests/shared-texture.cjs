const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCanvas,Path2D}=require('@napi-rs/canvas');global.window=global;global.Path2D=Path2D;global.document={createElement:()=>createCanvas(1,1)};
require('../dist/jersey');require('../dist/tuck');vm.runInThisContext(fs.readFileSync(require.resolve('../dist/renderer'),'utf8'));
const defaults={color:'#dad7cd',thickness:7,spacing:22,relief:.6,zoom:1,lens:{x:.5,y:.5},garmentType:'tee',jerseyStudy:false,tuckStudy:false};
for(const motif of [[['K','K'],['K','K']],[['K','T'],['K','K']],[['K','K'],['K','T'],['K','K'],['T','K']]])for(const face of ['front','back']){
 const o={...defaults,pattern:motif,yarns:motif.map((_,r)=>r%2?'#ffffff':'#87ceeb'),side:face,garmentSide:face};
 const ctx=createCanvas(1080,720).getContext('2d'),draw=ctx.drawImage.bind(ctx);let images=[];ctx.drawImage=(img,...rest)=>{images.push(img);return draw(img,...rest)};
 renderFabricSheet(ctx,o);const shared=images[0];images=[];renderGarment(ctx,o);assert.equal(images[0],shared,'Swatch and garment must sample the exact same face texture');
 const tiled={...o,pattern:Array.from({length:32},(_,r)=>Array.from({length:24},(_,n)=>motif[r%motif.length][n%2])),yarns:Array.from({length:32},(_,r)=>o.yarns[r%motif.length])};
 images=[];renderGarment(ctx,tiled);assert.deepEqual(images[0].toBuffer('image/png'),shared.toBuffer('image/png'),'Exact tiling preserves motif geometry and feeder colours');
 const coloured={...tiled,yarns:tiled.yarns.map((c,i)=>i===31?'#cc2233':c)};images=[];renderGarment(ctx,coloured);assert.notDeepEqual(images[0].toBuffer('image/png'),shared.toBuffer('image/png'),'An individual feeder colour cannot be lost by repeat reduction');
}
for(const relief of [0,.6,1]){assert(Math.abs(jerseyStudy.model(3,jerseyStudy.reference,relief).lengthMm-3)<1e-10);const p=[['K','K'],['K','T'],['K','K'],['T','K']],m=tuckStudy.modelFor(p,relief),paths=tuckStudy.paths({pattern:p,relief},m,{rows:8,cols:8,dy:28,dx:40,px:40/m.walePitch}),unit=paths.filter(v=>v.row>=0&&v.row<4&&v.event.n>=0&&v.event.n<2);const arc=ps=>ps.slice(1).reduce((s,v,i)=>s+Math.hypot(...v.map((x,k)=>x-ps[i][k])),0);assert(Math.abs(unit.reduce((s,v)=>s+arc(v.points),0)/8-2.7)<1e-8)}
console.log('Passed: identical shared face textures, exact motif tiling, individual feeder colours, 3 mm jersey and 2.7 mm mean piqué across relief range.');
