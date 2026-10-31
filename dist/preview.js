// One active render and one latest pending state; failed workers cannot strand the UI.
(()=>{
  let worker=null,busy=false,pending=null,version=0,complete=0,active=null,watchdog,garmentKey='';
  const waiters=[];
  const status=message=>{document.getElementById('previewStatus').textContent=message};
  function finish(){for(let i=waiters.length-1;i>=0;i--)if(complete>=waiters[i].id){waiters[i].resolve();waiters.splice(i,1)}}
  function showError(error){status('Preview could not be drawn. Try a smaller repeat or reload the app.');console.warn('Preview renderer:',error)}
  function drawGarment(job){
    const key=JSON.stringify([job.options.pattern,job.options.yarns,job.options.color,job.options.thickness,job.options.spacing,job.options.relief,job.options.garmentType,job.options.garmentSide]);
    if(key!==garmentKey){renderGarment(document.getElementById('garmentView').getContext('2d'),job.options);garmentKey=key}
  }
  function fallback(job){
    try{(job.options.mode==='swatch'?renderFabricSheet:renderSwatch)(job.ctx,job.options);drawGarment(job);status('Preview up to date · compatibility mode')}
    catch(error){showError(error)}
    complete=job.id;finish();
  }
  function disable(){
    clearTimeout(watchdog);worker?.terminate();worker=null;busy=false;
    const job=pending||active;pending=null;active=null;if(job)fallback(job);
  }
  function send(job){
    active=job;busy=true;
    try{worker.postMessage({id:job.id,options:job.options});watchdog=setTimeout(disable,5000)}catch{disable()}
  }
  if(typeof OffscreenCanvas!=='undefined'&&typeof Worker!=='undefined'){
    try{
      worker=new Worker('render-worker.js');
      worker.onmessage=({data})=>{
        clearTimeout(watchdog);
        if(data.error){disable();return}
        try{
          active.ctx.clearRect(0,0,active.ctx.canvas.width,active.ctx.canvas.height);
          active.ctx.drawImage(data.bitmap,0,0);data.bitmap.close();
          if(data.garment){const canvas=document.getElementById('garmentView');canvas.getContext('2d').drawImage(data.garment,0,0);data.garment.close()}
          complete=data.id;busy=false;active=null;finish();
          if(pending){const next=pending;pending=null;send(next)}else status('Preview up to date');
        }catch(error){showError(error);disable()}
      };
      worker.onerror=event=>{event.preventDefault();disable()};
      worker.onmessageerror=disable;
    }catch{worker=null}
  }
  window.paintPreview=(ctx,options)=>{
    const job={id:++version,ctx,options:JSON.parse(JSON.stringify(options))};
    status('Updating fabric and garment…');
    if(!worker)fallback(job);else if(busy)pending=job;else send(job);
  };
  window.previewReady=()=>complete>=version?Promise.resolve():new Promise(resolve=>waiters.push({id:version,resolve}));
})();

