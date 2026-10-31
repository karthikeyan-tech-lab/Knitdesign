const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const artifacts=process.env.KNIT_ARTIFACTS||fs.mkdtempSync('/tmp/knit-structures-');fs.mkdirSync(artifacts,{recursive:true});
const base=process.env.KNIT_BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[],timings=[],checks=[];
 try{
 for(const fallback of [false,true]){
  const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
  await context.addInitScript(()=>{if(!localStorage.getItem('knit-custom-v3'))localStorage.setItem('knit-custom-v3',JSON.stringify({pattern:[['K','T'],['K','K']],jerseyStudy:false,tuckStudy:false,colourMode:'solid',color:'#e4e3dc',machineTracks:3}))});
  if(fallback)await context.addInitScript(()=>{window.OffscreenCanvas=undefined});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  const ready=()=>page.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady()});await ready();
  assert.equal(await page.locator('#jerseyStudy,#tuckStudy').count(),0);
  assert(await page.evaluate(()=>tuckStudy.applicable({pattern,tuckStudy:false})));assert.equal(await page.locator('#machineTracks').inputValue(),'3');checks.push(`${fallback?'fallback':'worker'}: legacy false autosave opens with improved geometry`);
  const image=()=>page.evaluate(()=>({fabric:cv.toDataURL(),garment:$('garmentView').toDataURL()}));
  const input=async(id,value)=>{await page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))},value);await ready()};
  const fixtures={jersey:[['K','K'],['K','K']],tuck:[['K','T'],['K','K']],pique:[['K','K'],['K','T'],['K','K'],['T','K']]};
  for(const [name,pattern]of Object.entries(fixtures)){
   const saved={version:3,pattern,yarns:Array.from({length:32},(_,i)=>i%2?'#ffffff':'#87ceeb'),jerseyStudy:false,tuckStudy:false,colourMode:'two',color:'#d9d6cb',surfaceRelief:.6,machineTracks:3};
   await page.locator('#load').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});await ready();
   assert.deepEqual(await page.evaluate(()=>pattern),saved.pattern);assert.equal(await page.locator('#machineTracks').inputValue(),'3');
   assert(await page.evaluate(()=>jerseyStudy.applicable({pattern,jerseyStudy:false})||tuckStudy.applicable({pattern,tuckStudy:false})));
   const arrangement=await page.locator('#trackMap').textContent(),cams=await page.locator('#cams').textContent();
   for(const face of ['front','back']){
    await input('side',face);await input('garmentSide',face);const original=await image();
    await input('relief','0.95');const relief=await image();assert.notEqual(relief.fabric,original.fabric,name+' relief fabric '+face);assert.notEqual(relief.garment,original.garment,name+' relief garment '+face);
    await page.locator('#feederColors input').first().evaluate(el=>{el.value='#bc537b';el.dispatchEvent(new Event('input',{bubbles:true}))});await ready();const colour=await image();assert.notEqual(colour.fabric,relief.fabric);assert.notEqual(colour.garment,relief.garment);
    if(!fallback){await page.locator('#view').screenshot({path:path.join(artifacts,`${name}-${face}-swatch.png`)});await page.locator('#garmentView').screenshot({path:path.join(artifacts,`${name}-${face}-garment.png`)});}
    await page.locator('#feederColors input').first().evaluate(el=>{el.value='#87ceeb';el.dispatchEvent(new Event('input',{bubbles:true}))});await input('relief','0.6');
   }
   const prior=await image();await page.selectOption('#garmentType','sweater');await ready();assert.notEqual((await image()).garment,prior.garment);await page.selectOption('#garmentType','tee');await ready();
   const before=await image();await page.locator('#grid button[data-r="0"][data-n="0"]').focus();await page.keyboard.press(name==='jersey'?'t':'k');
   if(name!=='jersey'){await page.keyboard.press('t')};await ready();const edited=await image();assert.notEqual(edited.fabric,before.fabric);assert.notEqual(edited.garment,before.garment);await page.click('#undo');await ready();if(name!=='jersey'){await page.click('#undo');await ready()};
   assert.equal(await page.locator('#trackMap').textContent(),arrangement);assert.equal(await page.locator('#cams').textContent(),cams);
   const downloaded=page.waitForEvent('download');await page.click('#save');const download=await downloaded;const json=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.deepEqual(json.pattern,pattern);assert.deepEqual(json.yarns,saved.yarns);assert.equal(json.machineTracks,3);assert.equal(json.jerseyStudy,true);assert.equal(json.tuckStudy,true);
   for(const [id,file]of [['export','knit-preview.png'],['exportGarment','knit-garment.png']]){const pending=page.waitForEvent('download');await page.click('#'+id);const d=await pending;assert.equal(d.suggestedFilename(),file);assert.equal(fs.readFileSync(await d.path()).subarray(1,4).toString(),'PNG')}
   await page.reload();await ready();assert.deepEqual(await page.evaluate(()=>pattern),saved.pattern);assert.equal(await page.locator('#machineTracks').inputValue(),'3');
   checks.push(`${fallback?'fallback':'worker'}: ${name}, legacy flags, both faces, relief, feeder colours, stitches, cams, save/load, exports`);
  }
  await page.selectOption('#preset','miss');await ready();assert(await page.evaluate(()=>!jerseyStudy.applicable({pattern})&&!tuckStudy.applicable({pattern})));assert.deepEqual(await page.evaluate(()=>pattern),[['K','M'],['K','K']]);
  checks.push(`${fallback?'fallback':'worker'}: miss fallback preserves M`);
  if(!fallback){
   await page.setViewportSize({width:390,height:844});await page.click('#tryPique');await ready();await page.screenshot({path:path.join(artifacts,'mobile-pique.png'),fullPage:true});
   await page.selectOption('#rows','32');await page.fill('#needles','24');await page.click('#applySize');await ready();
   for(const kind of ['jersey','tuck','pique']){
    const metric=await page.evaluate(async kind=>{const start=performance.now();let frames=0;const tick=()=>{frames++;if(!done)requestAnimationFrame(tick)};let done=false;requestAnimationFrame(tick);
     const p=kind==='jersey'?[['K','K'],['K','K']]:kind==='tuck'?[['K','T'],['K','K']]:[['K','K'],['K','T'],['K','K'],['T','K']];
     pattern=Array.from({length:32},(_,r)=>Array.from({length:24},(_,n)=>p[r%p.length][n%2]));update();await new Promise(requestAnimationFrame);const uiMs=performance.now()-start;await previewReady();done=true;return {kind,uiMs,previewMs:performance.now()-start,frames,status:$('previewStatus').textContent};
    },kind);assert(!metric.status.includes('compatibility'),'worker must finish before its timeout');assert(metric.frames>1);assert(metric.previewMs<5000);timings.push(metric);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   await page.screenshot({path:path.join(artifacts,'mobile-maximum-repeat.png'),fullPage:true});
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({checks,timings,artifacts},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
