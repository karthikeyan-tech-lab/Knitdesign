/* Plain-jersey geometry study. Not an equilibrium/contact simulation.
 * Both faces project the same periodic 3D yarn centreline. No photo textures.
 */
(function(root){
 const reference=Object.freeze({yarnCount:"30's",countSystem:'unconfirmed',gauge:24,yarnCm:30,needles:100});
 function loopLengthMm(cm,needles){if(!Number.isFinite(cm)||!Number.isFinite(needles)||cm<=0||needles<=0)throw Error('Positive yarn length and needle count required');return cm*10/needles}
 function model(length=3){
  if(!Number.isFinite(length)||length<=0)throw Error('Positive loop length required');
  const parts=[
   [[-.5,.62,-.18],[-.2,.77,-.18],[.35,.1,.18],[.22,-.63,.18]],
   [[.22,-.63,.18],[.5,-1.12,.18],[-.5,-1.12,.18],[-.22,-.63,.18]],
   [[-.22,-.63,.18],[-.35,.1,.18],[.2,.77,-.18],[.5,.62,-.18]]
  ];
  const points=[];
  for(const [j,p]of parts.entries())for(let i=j?1:0;i<=36;i++){const t=i/36,u=1-t;points.push([0,1,2].map(k=>u*u*u*p[0][k]+3*u*u*t*p[1][k]+3*u*t*t*p[2][k]+t*t*t*p[3][k]))}
  let arc=0;for(let i=1;i<points.length;i++)arc+=Math.hypot(...points[i].map((v,k)=>v-points[i-1][k]));
  const scale=length/arc;
  return {points:points.map(p=>p.map(v=>v*scale)),walePitch:scale,coursePitch:.72*scale,lengthMm:length};
 }
 function applicable(o){return !!o.jerseyStudy&&o.pattern.every(row=>row.every(a=>a==='K'))}
 function texture(o,back){
  const c=document.createElement('canvas');const m=model(),px=15/m.walePitch,dy=Math.round(m.coursePitch*px*(o.spacing/22)),dx=15;c.width=60;c.height=dy*o.pattern.length;const g=c.getContext('2d');
  const rgb=hex=>hex.match(/\w\w/g).map(v=>parseInt(v,16));
  const shade=(hex,f)=>'rgb('+rgb(hex).map(v=>Math.round(Math.max(0,Math.min(255,v*f)))).join(',')+')';
  const yarn=r=>o.yarns?o.yarns[(r%o.pattern.length+o.pattern.length)%o.pattern.length]:o.color;
  g.fillStyle=shade(yarn(0),.72);g.fillRect(0,0,c.width,c.height);
  const segments=[];
  for(let r=-3;r<Math.ceil(c.height/dy)+3;r++)for(let n=-1;n<5;n++){
   for(let i=1;i<m.points.length;i++){
    const a=m.points[i-1],b=m.points[i];
    segments.push({a:[(n+(back?-a[0]:a[0])/m.walePitch)*dx,r*dy+a[1]*px],b:[(n+(back?-b[0]:b[0])/m.walePitch)*dx,r*dy+b[1]*px],z:(a[2]+b[2])*(back?-1:1),col:yarn(r)});
   }
  }
  segments.sort((a,b)=>a.z-b.z);
  // Segment depth determines which yarn is visible from each face.
  const width=1.15+o.thickness*.20;
  // Paint each depth-sorted segment with a matte body and a soft highlight.
  g.lineCap='round';
  for(const s of segments){for(const [factor,light]of [[1.25,.66],[1,.91],[.48,1.04]]){g.strokeStyle=shade(s.col,light*(.96+s.z/m.walePitch*.10));g.lineWidth=width*factor;g.beginPath();g.moveTo(...s.a);g.lineTo(...s.b);g.stroke()}}
  const expanded=document.createElement('canvas');expanded.width=1000;expanded.height=1100;const output=expanded.getContext('2d');output.fillStyle=output.createPattern(c,'repeat');output.fillRect(0,0,1000,1100);return expanded;
 }
 root.jerseyStudy={reference,loopLengthMm,model,applicable,texture};
 if(typeof module!=='undefined')module.exports=root.jerseyStudy;
})(typeof window==='undefined'?globalThis:window);
