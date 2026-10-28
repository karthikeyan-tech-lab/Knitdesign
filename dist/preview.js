// At most one active render and one latest pending state: no pointer-event backlog.
(()=>{
  let worker,busy=false,pending=null,version=0,complete=0,failed=false;
  const waiters=[];
  function finish(){for(let i=waiters.length-1;i>=0;i--)if(complete>=waiters[i].id){waiters[i].resolve();waiters.splice(i,1)}}
  function fallback(job){try{(job.options.mode==='swatch'?renderFabricSheet:renderSwatch)(job.ctx,job.options)}finally{complete=job.id;finish()}}
  function send(job){busy=true;worker.postMessage({id:job.id,options:job.options});worker.active=job}
  function disable(){failed=true;worker?.terminate();busy=false;const job=pending||worker?.active;pending=null;if(job)fallback(job)}
  if(typeof OffscreenCanvas!=='undefined'&&typeof Worker!=='undefined'){
    worker=new Worker('render-worker.js');
    worker.onmessage=({data})=>{if(data.error){disable();return}const job=worker.active;job.ctx.clearRect(0,0,1080,720);job.ctx.drawImage(data.bitmap,0,0);data.bitmap.close();complete=data.id;busy=false;finish();if(pending){const next=pending;pending=null;send(next)}};
    worker.onerror=disable;
  }
  window.paintPreview=(ctx,options)=>{const job={id:++version,ctx,options:structuredClone(options)};if(!worker||failed)fallback(job);else if(busy)pending=job;else send(job)};
  window.previewReady=()=>complete>=version?Promise.resolve():new Promise(resolve=>waiters.push({id:version,resolve}));
})();
