/* Periodic K/T state and geometric tuck study. No mechanical solver. */
(function(root){
 const mod=(a,n)=>(a%n+n)%n;
 function valid(p){return Array.isArray(p)&&p.length>0&&Array.isArray(p[0])&&p[0].length>0&&p.every(row=>row.length===p[0].length&&row.every(a=>['K','T','M'].includes(a)))}
 function supports(p){return valid(p)&&p.some(row=>row.includes('T'))&&p.every(row=>!row.includes('M'))&&p[0].every((_,n)=>p.some(row=>row[n]==='K'))}
 function event(p,r,n){
  const rows=p.length,action=p[mod(r,rows)][mod(n,p[0].length)];let heldFrom=null,nextKnit=null;
  for(let k=1;k<=rows;k++){if(p[mod(r-k,rows)][mod(n,p[0].length)]==='K'){heldFrom=r-k;break}}
  for(let k=1;k<=rows;k++){if(p[mod(r+k,rows)][mod(n,p[0].length)]==='K'){nextKnit=r+k;break}}
  const tucks=[];if(heldFrom!==null)for(let i=heldFrom+1;i<r;i++)if(p[mod(i,rows)][mod(n,p[0].length)]==='T')tucks.push(i);
  return {r,n,action,heldFrom,nextKnit,tucks,clears:action==='K'&&heldFrom!==null?{knit:heldFrom,tucks:[...tucks]}:null};
 }
 function events(p,from=0,to=p.length){if(!valid(p))throw Error('Rectangular K/T/M repeat required');const out=[];for(let r=from;r<to;r++)for(let n=0;n<p[0].length;n++)out.push(event(p,r,n));return out}
 function applicable(o){return !!o.tuckStudy&&supports(o.pattern)}
 function sample(parts){const out=[];for(const [j,p]of parts.entries())for(let i=j?1:0;i<=48;i++){const t=i/48,u=1-t;out.push([0,1,2].map(k=>u*u*u*p[0][k]+3*u*u*t*p[1][k]+3*u*t*t*p[2][k]+t*t*t*p[3][k]))}return out}
 function paths(o,m,layout){
  const p=o.pattern,R=p.length,N=p[0].length,w=m.walePitch,h=layout.dy/layout.px,bottom=m.points[0][1],top=Math.min(...m.points.map(v=>v[1])),out=[];
  // Apply a small continuous displacement field around tuck sites. Applying the
  // same field to coincident course endpoints keeps neighbouring yarns joined.
  function warp(v){let x=v[0],y=v[1],sx=0,sy=0;const nearN=Math.round(x/w),nearR=Math.round(-y/h);
   for(let dr=-1;dr<=1;dr++)for(let dn=-1;dn<=1;dn++){
    const r=nearR+dr,n=nearN+dn;if(p[mod(r,R)][mod(n,N)]!=='T')continue;
    const dx=(x-n*w)/w,dy=(y+r*h)/h,k=Math.exp(-dx*dx*2-dy*dy*1.5);sx-=dx*w*.025*k;sy-=dy*h*.025*k;
   }return [x+sx,y+sy,v[2]];
  }
  for(let r=-layout.rows-R*2;r<R*2;r++)for(let n=-2;n<layout.cols+2;n++){
   const e=event(p,r,n);let points;
   if(e.action==='K'){
    const span=e.nextKnit-r,stretch=1+(span-1)*h/(bottom-top);
    points=m.points.map((v,i)=>{const envelope=Math.sin(Math.PI*i/(m.points.length-1))**2;
     return [v[0]*(1+envelope*(e.tucks.length*.08-Math.min(span-1,4)*.08)),bottom+(v[1]-bottom)*stretch,v[2]];
    });
   }else{
    // The feeder deposits a tuck bight while the old knit remains held.
    // It joins the same course endpoints as adjacent K cells.
    const z=-.025,peak=top-(e.nextKnit-r-1)*h;
    points=sample([
     [[-w/2,bottom,-.10],[-w*.22,bottom,-.10],[w*.16,peak+h*.25,z],[w*.13,peak,z]],
     [[w*.13,peak,z],[w*.19,peak-h*.18,z],[-w*.19,peak-h*.18,z],[-w*.13,peak,z]],
     [[-w*.13,peak,z],[-w*.16,peak+h*.25,z],[w*.22,bottom,-.10],[w/2,bottom,-.10]]
    ]);
   }
   points=points.map(v=>warp([v[0]+n*w,v[1]-r*h,v[2]]));
   out.push({points,row:r,radius:1,type:e.action,event:e});
  }
  return out;
 }
 function texture(o,back){return root.jerseyStudy.texture(o,back,(m,layout)=>paths(o,m,layout).map(path=>({...path,x:back?layout.cols*layout.dx:0})))}
 function renderDetail(ctx,o){
  const W=ctx.canvas.width,H=ctx.canvas.height,m=root.jerseyStudy.model(),structure=o.mode==='loops',cols=8,rows=8,scale=85*o.zoom;
  ctx.fillStyle=structure?'#f5f8f3':'#e9ece5';ctx.fillRect(0,0,W,H);
  const list=paths(o,m,{cols,rows,dx:40,dy:40*m.coursePitch/m.walePitch,px:40/m.walePitch}),segments=[];
  const ox=(W-cols*m.walePitch*scale)/2+(o.pan?.x||0),oy=H*.72+(o.pan?.y||0);
  for(const path of list){
   const e=path.event;if(e.n<0||e.n>=cols||e.r< -o.pattern.length||e.r>=rows+o.pattern.length)continue;
   const col=structure?(e.action==='T'?'#c58b32':'#2b7161'):(o.yarns?o.yarns[mod(path.row,o.pattern.length)]:o.color);
   const alpha=o.highlight&&mod(path.row,o.pattern.length)!==o.selected ? .36 : 1;
   for(let i=1;i<path.points.length;i++)segments.push({a:path.points[i-1],b:path.points[i],col,alpha,z:(path.points[i-1][2]+path.points[i][2])/2});
  }
  segments.sort((a,b)=>a.z-b.z);ctx.save();ctx.beginPath();ctx.rect(12,76,W-24,H-130);ctx.clip();ctx.lineCap='round';
  for(const s of segments){ctx.globalAlpha=s.alpha;const a=[ox+s.a[0]*scale,oy+s.a[1]*scale],b=[ox+s.b[0]*scale,oy+s.b[1]*scale];
   if(!structure){ctx.strokeStyle='#20372c44';ctx.lineWidth=.25*scale;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}
   ctx.strokeStyle=s.col;ctx.lineWidth=(structure ? .048 : .18)*scale;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();
  }
  ctx.restore();ctx.fillStyle='#294b3f';ctx.font='16px system-ui';ctx.fillText(structure?'TUCK LOOP STRUCTURE  /  Knit yarn · green   Tuck yarn · gold':'TUCK YARN DETAIL  /  Same geometry as the fabric preview',24,30);
  ctx.font='13px system-ui';ctx.fillText(describe(o.pattern,o.selected||0),24,57);ctx.fillText('Held loops span tuck passes. Geometry is illustrative; yarn tension and relaxation are not simulated.',24,H-20);
 }
 function describe(p,selected){if(!supports(p))return 'This study supports K/T repeats where every needle knits. Miss stitches or unreleased loops use the original preview.';
  const row=mod(selected,p.length),tucks=events(p,row,row+1).filter(e=>e.action==='T'),clears=events(p,row,row+1).filter(e=>e.clears?.tucks.length);
  return 'F'+(row+1)+': '+[...tucks.map(e=>'N'+(e.n+1)+' holds the old knit and collects tuck yarn'),...clears.map(e=>'N'+(e.n+1)+' knits through the held loop and '+e.tucks.length+' tuck bight'+(e.tucks.length>1?'s':''))].join('; ')+(tucks.length||clears.length?'.':'all needles form new knit loops.');
 }
 root.tuckStudy={supports,events,paths,applicable,texture,renderDetail,describe};if(typeof module!=='undefined')module.exports=root.tuckStudy;
})(typeof window==='undefined'?globalThis:window);
