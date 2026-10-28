/* Deterministic geometric yarn renderer. No image textures or generated fabric images. */
(function(){
function mix(hex,k){let rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16));return 'rgb('+rgb.map(v=>Math.round(k>0?v+(255-v)*k:v*(1+k))).join(',')+')'}
function bezier(p0,p1,p2,p3,t){let u=1-t;return [0,1,2].map(i=>u*u*u*p0[i]+3*u*u*t*p1[i]+3*u*t*t*p2[i]+t*t*t*p3[i])}
function sample(parts){let pts=[];parts.forEach((p,j)=>{for(let i=j?1:0;i<=18;i++)pts.push(bezier(...p,i/18))});return pts}
function sequence(p,cols,rows){let held=Array(cols).fill(-1),tucks=Array.from({length:cols},()=>[]),out=[];for(let r=0;r<rows;r++)for(let n=0;n<cols;n++){let a=p[(r+p.length)%p.length][n%p[0].length],next=rows;for(let j=r+1;j<=r+p.length;j++)if(p[j%p.length][n%p[0].length]==='K'){next=j;break}out.push({r,n,a,from:held[n],tucks:[...tucks[n]],next});if(a==='K'){held[n]=r;tucks[n]=[]}if(a==='T')tucks[n].push(r)}return out}
window.knitGeometry={sequence,sample};
window.renderSwatch=function(ctx,o){
const {pattern,mode,color,thickness,spacing,relief,selected,highlight,pan}=o,W=ctx.canvas.width,H=ctx.canvas.height,structure=mode==='loops';
ctx.clearRect(0,0,W,H);let bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,structure?'#f6f8f4':'#edece5');bg.addColorStop(1,structure?'#eaf0e9':'#d6dbd1');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
let cols=24,rows=Math.max(20,pattern.length*5),dx=34,dy=spacing*.92;
let scale=Math.min(930/(cols*dx),590/((rows+1)*dy))*o.zoom;
let ox=(W-cols*dx*scale)/2+dx*scale/2+pan.x,oy=(H+(rows-1)*dy*scale)/2+pan.y;
let paths=[],ev=sequence(pattern,cols,rows);const point=(x,y,z)=>[x,y,z];
function add(e,parts,layer){let pts=sample(parts),base=structure?({K:'#316f61',T:'#c78b33',M:'#a17fb6'}[e.a]):(o.yarns?o.yarns[e.r%pattern.length]:color);paths.push({e,pts,color:base,layer})}
for(const e of ev){let x=e.n*dx,y=-e.r*dy,stretch=Math.min(e.next-e.r-1,8),top=y-dy*.63-stretch*dy*.8,low=y+dy*.62;
// A continuous feeder yarn has matching endpoints at adjacent needles.
if(e.a==='K'){
 let puff=relief*(e.tucks.length?3:0),A=point(x-dx/2,low,0),B=point(x+dx/2,low,0),L=point(x-8,top,1),R=point(x+8,top,1);
 add(e,[[A,point(x-7,low+3,-1),point(x+9,low-3,3+puff),R],[R,point(x+17,top-dy*.6,1),point(x-17,top-dy*.6,-2),L],[L,point(x-9,low-3,-2),point(x+7,low+3,3+puff),B]],1);
}else if(e.a==='T'){
 let target=y-(Math.min(e.next-e.r,9)-1)*dy*.8-dy*.4;
 add(e,[[point(x-dx/2,low,0),point(x-14,low+3,0),point(x-7,target+6,2),point(x-6,target,2)],[point(x-6,target,2),point(x-7,target-10,2),point(x+7,target-10,2),point(x+6,target,2)],[point(x+6,target,2),point(x+7,target+6,2),point(x+14,low+3,0),point(x+dx/2,low,0)]],0);
}else{
 add(e,[[point(x-dx/2,low, -4),point(x-6,low+3,-4),point(x+6,low+3,-4),point(x+dx/2,low,-4)]],-1);
}}
function project(p){return [ox+p[0]*scale,oy+p[1]*scale-p[2]*relief*scale]}
function stroke(pts,width,col,offset=0){ctx.beginPath();pts.forEach((p,i)=>{let [x,y]=project(p);i?ctx.lineTo(x+offset,y+offset):ctx.moveTo(x+offset,y+offset)});ctx.lineWidth=width;ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
// Depth layers keep miss floats behind the knitted legs. Drawing courses in order
// gives contact shadows where successive loops overlap.
ctx.save();ctx.beginPath();ctx.rect(16,46,W-32,H-78);ctx.clip();
paths.sort((a,b)=>a.layer-b.layer||a.e.r-b.e.r);
for(let p of paths){let rad=(structure?2.7:thickness)*scale;
 if(structure){stroke(p.pts,rad,p.color);continue}
 stroke(p.pts,rad+4*scale,'#20302022',2*scale);
 stroke(p.pts,rad,mix(p.color,-.44));
 stroke(p.pts,rad*.81,mix(p.color,-.12));
 stroke(p.pts,rad*.5,mix(p.color,.22),-.5*scale);
 stroke(p.pts,rad*.16,mix(p.color,.47),-.9*scale);
 // Fine twisted filament lines follow the yarn centreline, rather than a bitmap.
 for(let strand=0;strand<3;strand++){
 let line=p.pts.map((v,i)=>{let before=p.pts[Math.max(0,i-1)],after=p.pts[Math.min(p.pts.length-1,i+1)],vx=after[0]-before[0],vy=after[1]-before[1],len=Math.hypot(vx,vy)||1,off=Math.sin(i*.8+strand*2.1+p.e.n)*thickness*.22;return [v[0]-vy/len*off,v[1]+vx/len*off,v[2]]});
 stroke(line,Math.max(.28,scale*.45),strand===0?'#ffffff33':'#18302020');
 }
}
if(structure){ctx.setLineDash([3,6]);for(let e of ev.filter(e=>e.a==='M')){let p=[[e.n*dx,-e.from*dy,0],[e.n*dx,-e.r*dy,0]];stroke(p,1,'#788d7e66')}ctx.setLineDash([])}
if(highlight){for(let r=0;r<rows;r++)if(r%pattern.length===selected){let y=oy-r*dy*scale;ctx.fillStyle=structure?'#ba873b16':'#ffffff12';ctx.fillRect(ox-dx*scale/2,y-dy*.6*scale,cols*dx*scale,dy*scale);ctx.fillStyle='#245548';ctx.beginPath();ctx.moveTo(ox-dx*scale/2-11,y);ctx.lineTo(ox-dx*scale/2-21,y-5);ctx.lineTo(ox-dx*scale/2-21,y+5);ctx.fill()}}
ctx.restore();ctx.fillStyle='#e9eee6';ctx.fillRect(0,0,W,43);ctx.fillStyle='#3c5548';ctx.font='13px system-ui';ctx.fillText(structure?'LOOP STRUCTURE  /  Knit · green   Tuck · gold   Miss · purple':'FABRIC SURFACE  /  Shaded yarn · technical face',22,27);ctx.font='12px system-ui';ctx.fillText('Needle repeat  ·  '+cols+' needles × '+rows+' feeder passes  ·  '+o.zoom.toFixed(1)+'×',22,H-12);
};
let sheetCache={key:null};
function makeTexture(o,back){
 const c=document.createElement('canvas');c.width=1000;c.height=1100;let g=c.getContext('2d'),dx=15,dy=10.5*(o.spacing/22),cols=Math.ceil(c.width/dx)+2,rows=Math.ceil(c.height/dy)+5;
 const yarn=r=>o.yarns?o.yarns[((r%o.pattern.length)+o.pattern.length)%o.pattern.length]:o.color;
 g.fillStyle=mix(o.color,-.68);g.fillRect(0,0,c.width,c.height);
 function line(p,col,width,front=true){g.lineCap='round';g.lineJoin='round';g.strokeStyle=mix(col,-.58);g.lineWidth=width+1.8;g.stroke(p);g.strokeStyle=mix(col,-.12);g.lineWidth=width;g.stroke(p);g.save();g.translate(-.45,-.65);g.strokeStyle=mix(col,.22);g.lineWidth=width*.48;g.stroke(p);g.translate(0,-.25);g.strokeStyle=mix(col,.4);g.lineWidth=width*.12;g.stroke(p);g.restore()}
 const radius=2.5+o.thickness*.22;
 for(let r=-2;r<rows;r++){
 let actual=((r%o.pattern.length)+o.pattern.length)%o.pattern.length,col=yarn(r);
 for(let n=-1;n<cols;n++){
 let a=o.pattern[actual][((n%o.pattern[0].length)+o.pattern[0].length)%o.pattern[0].length],next=1;while(next<=o.pattern.length&&o.pattern[(actual+next)%o.pattern.length][((n%o.pattern[0].length)+o.pattern[0].length)%o.pattern[0].length]!=='K')next++;
 let jitter=Math.sin(n*31.77+r*16.3)*.19,x=n*dx+jitter,y=r*dy+jitter,p=new Path2D();
 if(back){
  if(a==='M')continue;
  // Back stitch view: purl crown and connecting sinker arc, not mirrored face Vs.
  p.moveTo(x-dx*.5,y+dy*.55);p.bezierCurveTo(x-dx*.27,y+dy*.65,x-dx*.27,y-dy*.3,x,y-dy*.28);p.bezierCurveTo(x+dx*.27,y-dy*.3,x+dx*.27,y+dy*.65,x+dx*.5,y+dy*.55);line(p,col,radius*.72);
  let crown=new Path2D();crown.moveTo(x-dx*.47,y+dy*.32);crown.bezierCurveTo(x-dx*.16,y-dy*.05,x+dx*.16,y-dy*.05,x+dx*.47,y+dy*.32);line(crown,col,radius);
 }else{
  if(a==='M'){p.moveTo(x-dx/2,y+dy*.55);p.lineTo(x+dx/2,y+dy*.55);line(p,col,radius*.7);continue}
  let ext=(Math.min(next,5)-1)*dy*.75,top=y-dy*.63-ext;
  if(a==='T'){
   p.moveTo(x-dx*.5,y+dy*.6);p.bezierCurveTo(x-dx*.35,y+dy*.7,x-dx*.2,top,x-dx*.12,top);p.bezierCurveTo(x-dx*.05,top-dy*.3,x+dx*.05,top-dy*.3,x+dx*.12,top);p.bezierCurveTo(x+dx*.2,top,x+dx*.35,y+dy*.7,x+dx*.5,y+dy*.6);line(p,col,radius*.84);
  }else{
   p.moveTo(x-dx/2,y+dy*.6);p.bezierCurveTo(x-dx*.22,y+dy*.95,x+dx*.29,y-dy*.06,x+dx*.23,top);p.bezierCurveTo(x+dx*.25,top-dy*.45,x-dx*.25,top-dy*.45,x-dx*.23,top);p.bezierCurveTo(x-dx*.29,y-dy*.06,x+dx*.22,y+dy*.95,x+dx/2,y+dy*.6);line(p,col,radius);
  }
 }
 // Deterministic fine fiber glints, following the legs at this viewing scale.
 if(!back&&a==='K'){g.strokeStyle='#ffffff14';g.lineWidth=.4;g.beginPath();g.moveTo(x-2,y+dy*.5);g.lineTo(x+2,y-dy*.4);g.stroke()}
 }
 if(back){
  // Float spans are continuous across consecutive missed needles.
  let start=null;for(let n=0;n<=cols;n++){let miss=n<cols&&o.pattern[actual][n%o.pattern[0].length]==='M';if(miss&&start===null)start=n;if(!miss&&start!==null){let p=new Path2D();p.moveTo((start-.5)*dx,r*dy+dy*.5);p.bezierCurveTo(start*dx,r*dy+dy*.65,n*dx,r*dy+dy*.65,(n-.5)*dx,r*dy+dy*.5);line(p,col,radius);start=null}}
 }
 }
 return c;
}
function zig(g,x,y,w,h){g.beginPath();g.moveTo(x,y);for(let i=0;i<w;i+=10)g.lineTo(x+i,y+(i%20?4:0));g.lineTo(x+w,y);for(let i=0;i<h;i+=10)g.lineTo(x+w-(i%20?4:0),y+i);g.lineTo(x+w,y+h);for(let i=w;i>=0;i-=10)g.lineTo(x+i,y+h-(i%20?4:0));g.lineTo(x,y+h);for(let i=h;i>=0;i-=10)g.lineTo(x+(i%20?4:0),y+i);g.closePath()}
window.renderFabricSheet=function(ctx,o){
 let key=JSON.stringify([o.pattern,o.yarns,o.color,o.thickness,o.spacing]);
 if(sheetCache.key!==key)sheetCache={key};
 for(const face of (o.side==='both'?['front','back']:[o.side]))if(!sheetCache[face])sheetCache[face]=makeTexture(o,face==='back');
 let W=ctx.canvas.width,H=ctx.canvas.height;ctx.clearRect(0,0,W,H);ctx.fillStyle='#fafaf7';ctx.fillRect(0,0,W,H);
 let sides=o.side==='both'?['front','back']:[o.side],gap=35,margin=30,panelW=(W-margin*2-gap*(sides.length-1))/sides.length;
 ctx.font='14px system-ui';ctx.fillStyle='#294b3f';ctx.fillText('FABRIC SWATCH  /  Custom repeat · visual approximation',margin,28);
 for(let i=0;i<sides.length;i++){
 let side=sides[i],x=margin+i*(panelW+gap),y=119,w=panelW,h=H-y-54,tex=sheetCache[side];
 ctx.fillStyle='#294b3f';ctx.font='17px Georgia';ctx.fillText(side==='front'?'Technical face':'Technical back · approximate',x,61);
 let colours=o.yarns?o.yarns.slice(0,o.pattern.length):[o.color];[...new Set(colours)].forEach((col,j)=>{ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(x+11+j*30,88,10,7,-.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0003';ctx.lineWidth=1;ctx.stroke()});
 ctx.save();zig(ctx,x+3,y+4,w,h);ctx.shadowColor='#0004';ctx.shadowBlur=7;ctx.shadowOffsetY=4;ctx.fillStyle='#d6d9d1';ctx.fill();ctx.restore();
 ctx.save();zig(ctx,x,y,w,h);ctx.clip();
 let srcW=Math.min(tex.width,tex.width/o.zoom),srcH=srcW*h/w;
 ctx.drawImage(tex,0,0,srcW,Math.min(srcH,tex.height),x,y,w,h);
 let sheen=ctx.createLinearGradient(x,y,x+w,y+h);sheen.addColorStop(0,'#ffffff0c');sheen.addColorStop(.55,'#00000000');sheen.addColorStop(1,'#00000020');ctx.fillStyle=sheen;ctx.fillRect(x,y,w,h);ctx.restore();
 // Magnifier samples the same calculated texture. Pointer changes the sample region.
 let rad=sides.length===2?79:99,cx=x+w-rad*.72,cy=y+h-rad*.77,lx=Math.max(.08,Math.min(.9,o.lens?.x??.5)),ly=Math.max(.08,Math.min(.9,o.lens?.y??.5)),sample=rad*1.35;
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.shadowColor='#0005';ctx.shadowBlur=8;ctx.fillStyle='#ddd';ctx.fill();ctx.restore();ctx.save();ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.clip();ctx.drawImage(tex,lx*(tex.width-sample),ly*(tex.height-sample),sample,sample,cx-rad,cy-rad,rad*2,rad*2);ctx.restore();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.stroke();
 }
 ctx.fillStyle='#607267';ctx.font='12px system-ui';ctx.fillText('K/T/M-driven illustration · colour by feeder · magnified yarn detail',margin,H-13);
};})();
