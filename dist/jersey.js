/* Measured-spacing jersey geometry with software tube rendering.
 * Geometry is fitted, not mechanically relaxed. No photographic textures.
 */
(function(root){
 const reference=Object.freeze({yarnCount:30,countSystem:'Ne',composition:'100% cotton',fabricCondition:'finished',gauge:24,wpi:30,cpi:42,waleSpacingMm:25.4/30,courseSpacingMm:25.4/42,yarnCm:30,needles:100});
 function loopLengthMm(cm,needles){if(!Number.isFinite(cm)||!Number.isFinite(needles)||cm<=0||needles<=0)throw Error('Positive yarn length and needle count required');return cm*10/needles}
 const arc=points=>points.slice(1).reduce((s,p,i)=>s+Math.hypot(...p.map((v,k)=>v-points[i][k])),0);
 function model(length=3){
  if(!Number.isFinite(length)||length<=0)throw Error('Positive loop length required');
  const w=reference.waleSpacingMm,h=reference.courseSpacingMm,z=.10;
  function points(head){
   const parts=[
    [[-w/2,h*.62,-z],[w*.04,h*.62,-z],[w*.16,-head*.2,z*3.5],[w*.25,-head,-z]],
    [[w*.25,-head,-z],[w*.36,-head-h*.30,-z],[-w*.36,-head-h*.30,-z],[-w*.25,-head,-z]],
    [[-w*.25,-head,-z],[-w*.16,-head*.2,z*3.5],[-w*.04,h*.62,-z],[w/2,h*.62,-z]]
   ],out=[];
   for(const [j,p]of parts.entries())for(let i=j?1:0;i<=48;i++){const t=i/48,u=1-t;out.push([0,1,2].map(k=>u*u*u*p[0][k]+3*u*u*t*p[1][k]+3*u*t*t*p[2][k]+t*t*t*p[3][k]))}
   return out;
  }
  let low=0,high=length;
  if(arc(points(low))>length)throw Error('Loop length is too short for measured spacing');
  for(let i=0;i<45;i++){const mid=(low+high)/2;if(arc(points(mid))>length)high=mid;else low=mid}
  const p=points((low+high)/2);return {points:p,walePitch:w,coursePitch:h,lengthMm:arc(p)};
 }
 function applicable(o){return !!o.jerseyStudy&&o.pattern.every(row=>row.every(a=>a==='K'))}
 const hash=(a,b)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v)};
 function texture(o,back,buildPaths){
  const m=model(),cols=buildPaths?Math.ceil(8/o.pattern[0].length)*o.pattern[0].length:8,rows=Math.ceil(8/o.pattern.length)*o.pattern.length,width=cols*40,px=40/m.walePitch;
  const height=Math.round(rows*m.coursePitch*px),dy=height/rows,dx=width/cols;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const g=canvas.getContext('2d');
  const image=g.createImageData(width,height),pixels=image.data,depth=new Float32Array(width*height).fill(-100),shading=new Float32Array(width*height),red=new Uint8Array(width*height),green=new Uint8Array(width*height),blue=new Uint8Array(width*height);
  const rgb=hex=>hex.match(/\w\w/g).map(v=>parseInt(v,16)),yarn=r=>rgb(o.yarns?o.yarns[(r%o.pattern.length+o.pattern.length)%o.pattern.length]:o.color);
  // Diameter is an appearance estimate, not a measurement derived from Ne.
  const radius=(.120+(o.thickness-7)*.006)*px;
  const paths=buildPaths?buildPaths(m,{cols,rows,dx,dy,px}):(()=>{
   const paths=[];for(let r=-3;r<rows+3;r++)for(let n=-1;n<cols+1;n++)paths.push({points:m.points,row:r,x:n*dx,y:r*dy+Math.sin(r/rows*Math.PI*2)*.30});return paths;
  })();
  for(const path of paths){
   const col=yarn(path.row),points=path.points,radius=(.120+(o.thickness-7)*.006)*px*(path.radius||1);
   let distance=0;
   for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],flip=back?-1:1;
    const ax=(path.x||0)+flip*a[0]*px,ay=(path.y||0)+a[1]*px,az=flip*a[2]*px;
    const bx=(path.x||0)+flip*b[0]*px,by=(path.y||0)+b[1]*px,bz=flip*b[2]*px;
    const vx=bx-ax,vy=by-ay,vv=vx*vx+vy*vy||1e-9,len=Math.sqrt(vv),tx=vx/len,ty=vy/len;
    const x0=Math.max(0,Math.floor(Math.min(ax,bx)-radius-1)),x1=Math.min(width-1,Math.ceil(Math.max(ax,bx)+radius+1));
    const y0=Math.max(0,Math.floor(Math.min(ay,by)-radius-1)),y1=Math.min(height-1,Math.ceil(Math.max(ay,by)+radius+1));
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
     const t=Math.max(0,Math.min(1,((x+.5-ax)*vx+(y+.5-ay)*vy)/vv));
     const ex=x+.5-ax-t*vx,ey=y+.5-ay-t*vy,d2=ex*ex+ey*ey;if(d2>radius*radius)continue;
     const nz=Math.sqrt(Math.max(0,1-d2/(radius*radius))),z=az+t*(bz-az)+radius*nz,index=y*width+x;
     if(z<depth[index])continue;depth[index]=z;
     const nx=ex/radius,ny=ey/radius,light=Math.max(0,-.38*nx-.45*ny+.81*nz);
     const across=(-ty*ex+tx*ey)/radius,along=distance+t*len;
     const twist=Math.sin(along*1.10+across*7.5),fibres=(hash(x,y)-.5)*.065;
     shading[index]=.78+.21*light+.018*twist+fibres*.6;
     red[index]=col[0];green[index]=col[1];blue[index]=col[2];
    }
    distance+=len;
   }
  }
  // Treat every active feeder equally; colour order must not tint empty space.
  const bg=[0,1,2].map(i=>Math.round(Array.from({length:o.pattern.length},(_,r)=>yarn(r)[i]).reduce((a,b)=>a+b,0)/o.pattern.length));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const i=y*width+x,p=i*4;
   if(depth[i]===-100){const k=.84+(hash(x,y)-.5)*.045;pixels[p]=bg[0]*k;pixels[p+1]=bg[1]*k;pixels[p+2]=bg[2]*k;pixels[p+3]=255;continue}
   // Nearby higher yarn softly shadows recesses, enhancing intermeshing contacts.
   let shadow=0;for(const [ox,oy]of [[-3,-3],[3,-3],[-3,3],[3,3]]){const xx=(x+ox+width)%width,yy=(y+oy+height)%height;shadow+=Math.min(1,Math.max(0,(depth[yy*width+xx]-depth[i]-1)/radius))}
   const k=shading[i]*(1-shadow*.025);pixels[p]=red[i]*k;pixels[p+1]=green[i]*k;pixels[p+2]=blue[i]*k;pixels[p+3]=255;
  }
  g.putImageData(image,0,0);
  // Sparse cotton fibres follow the surface; no flat noise or fabric photograph.
  g.lineWidth=.30;
  for(let i=0;i<width*height/24;i++){
   const x=hash(i,13)*width,y=hash(i,29)*height,index=Math.floor(y)*width+Math.floor(x);if(depth[index]===-100)continue;
   g.strokeStyle='rgba(255,255,250,.13)';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+1.4,y-1.5,x+(hash(i,47)-.5)*3,y-3);g.stroke();
  }
  const expanded=document.createElement('canvas');expanded.width=1000;expanded.height=1100;const out=expanded.getContext('2d');
  out.scale(15/40,15/40);out.fillStyle=out.createPattern(canvas,'repeat');out.fillRect(0,0,1000*40/15,1100*40/15);return expanded;
 }
 root.jerseyStudy={reference,loopLengthMm,model,applicable,texture};
 if(typeof module!=='undefined')module.exports=root.jerseyStudy;
})(typeof window==='undefined'?globalThis:window);
