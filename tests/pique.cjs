const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {createCanvas,Path2D}=require('@napi-rs/canvas');global.window=global;global.Path2D=Path2D;global.document={createElement:()=>createCanvas(1,1)};
const jersey=require('../dist/jersey'),tuck=require('../dist/tuck');vm.runInThisContext(fs.readFileSync(require.resolve('../dist/renderer.js'),'utf8'));
const p=[['K','K'],['K','T'],['K','K'],['T','K']],arc=p=>p.slice(1).reduce((s,v,i)=>s+Math.hypot(...v.map((x,k)=>x-p[i][k])),0);
for(let phase=0;phase<4;phase++)for(let swap=0;swap<2;swap++){
 const pattern=p.map((_,r)=>p[(r+phase)%4].map((_,n)=>p[(r+phase)%4][(n+swap)%2]));
 assert.equal(tuck.profileFor(pattern),tuck.piqueReference);
 const m=tuck.modelFor(pattern);assert.equal(m.walePitch,25.4/35);assert.equal(m.coursePitch,25.4/50);
 const paths=tuck.paths({pattern},m,{cols:8,rows:8,dx:40,dy:40*35/50,px:40/m.walePitch}),unit=paths.filter(v=>v.row>=0&&v.row<4&&v.event.n>=0&&v.event.n<2);
 assert(Math.abs(unit.reduce((s,v)=>s+arc(v.points),0)/8-2.7)<1e-8,'Mean path length must fit the 27 cm / 100 needles target');
 for(let r=0;r<4;r++){const a=unit.find(v=>v.row===r&&v.event.n===0),b=unit.find(v=>v.row===r&&v.event.n===1);assert(a.points.at(-1).every((v,i)=>Math.abs(v-b.points[0][i])<1e-9),'Course yarn remains continuous')}
}
assert.equal(tuck.profileFor([['K','T'],['K','K']]),null);assert.equal(tuck.profileFor([['K','K'],['K','K'],['K','K'],['K','K']]),null);
assert.throws(()=>jersey.model(2.7,{wpi:0,cpi:50}));
const events=tuck.events(p);assert.deepEqual(events.find(e=>e.r===2&&e.n===1).clears,{knit:0,tucks:[1]});assert.deepEqual(events.find(e=>e.r===0&&e.n===0).clears,{knit:-2,tucks:[-1]});
const o={pattern:p,tuckStudy:true,jerseyStudy:true,color:'#e4e3dc',yarns:null,thickness:7,spacing:22,side:'both',mode:'swatch',zoom:1,lens:{x:.5,y:.5},garmentType:'tee',garmentSide:'front',pan:{x:0,y:0},highlight:false,selected:1};
const c=createCanvas(1080,720),g=c.getContext('2d');renderFabricSheet(g,o);fs.writeFileSync('/tmp/pique-study.png',c.toBuffer('image/png'));const front=tuck.texture(o,false),back=tuck.texture(o,true);assert.notDeepEqual(front.toBuffer('image/png'),back.toBuffer('image/png'));
renderSwatch(g,{...o,mode:'loops'});fs.writeFileSync('/tmp/pique-loops.png',c.toBuffer('image/png'));
console.log('Passed: 35 WPI / 50 CPI; eight phase/needle rotations; 2.7 mm mean over eight operations; continuous K/T yarn joins; scope separation; cyclic piqué release; front/back/detail rendering.');
