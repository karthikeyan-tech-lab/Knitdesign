const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const artifacts=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'knit-pwa-tests-'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');
 await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady();await navigator.serviceWorker.ready});
 await page.reload();await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady()});
 assert(await page.evaluate(()=>!!navigator.serviceWorker.controller));
 const manifest=await page.evaluate(async()=>await (await fetch('manifest.webmanifest')).json());assert.equal(manifest.display,'standalone');
 for(const icon of manifest.icons){const result=await page.evaluate(async src=>{const b=await createImageBitmap(await (await fetch(src)).blob());return [b.width,b.height]},icon.src);assert.deepEqual(result,icon.sizes.split('x').map(Number))}
 await page.locator('#load').setInputFiles(path.resolve('examples/custom-six-needle.json'));
 await page.waitForFunction(()=>pattern[0].length===6);
 const original=await page.evaluate(()=>JSON.stringify(data()));
 await page.locator('[data-brush="M"]').click();await page.locator('#grid button[data-r="0"][data-n="0"]').click();
 assert.equal(await page.evaluate(()=>pattern[0][0]),'M');await page.locator('#undo').click();assert.equal(await page.evaluate(()=>JSON.stringify(data())),original);
 const grouping=await page.evaluate(()=>trackGroups([['K','T','K'],['K','M','K']]));assert.deepEqual(grouping.map,[0,1,0]);assert.equal(grouping.signatures.length,2);
 await page.locator('#grid button[data-r="0"][data-n="0"]').focus();await page.keyboard.press('t');assert.equal(await page.evaluate(()=>pattern[0][0]),'T');await page.keyboard.press('ArrowRight');assert.equal(await page.locator(':focus').getAttribute('data-n'),'1');
 for(const mode of ['swatch','fabric','loops']){await page.locator('#'+mode).click();await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady()});assert(await page.evaluate(()=>ctx.getImageData(400,300,1,1).data[3]===255))}
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const png=await downloadPromise;assert.equal(png.suggestedFilename(),'knit-preview.png');
 const jsonDownload=page.waitForEvent('download');await page.locator('#save').click();const saved=await jsonDownload;await saved.saveAs(path.join(artifacts,'roundtrip.json'));const expected=await page.evaluate(()=>JSON.stringify(data()));await page.locator('#new').click();await page.locator('#load').setInputFiles(path.join(artifacts,'roundtrip.json'));await page.waitForFunction(text=>JSON.stringify(data())===text,expected);
 await page.evaluate(()=>flushSave());await context.setOffline(true);await page.reload();await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady()});assert.equal(await page.evaluate(()=>JSON.stringify(data())),expected);assert.match(await page.locator('#networkStatus').textContent(),/Offline/);
 await context.setOffline(false);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(artifacts,'desktop.png'),fullPage:true});
 const performanceResults=await page.evaluate(async()=>{let results=[];for(const [rows,cols]of [[4,6],[32,24]])for(const kind of ['K','T','M','mixed']){pattern=Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,n)=>kind==='mixed'?['K','T','M'][(r+n)%3]:kind));let start=performance.now();update();await new Promise(requestAnimationFrame);const uiMs=performance.now()-start;await previewReady();const previewMs=performance.now()-start;start=performance.now();for(let i=0;i<20;i++)cv.onpointermove({clientX:200+i,clientY:200});await new Promise(requestAnimationFrame);results.push({rows,cols,kind,uiMs:+uiMs.toFixed(1),previewMs:+previewMs.toFixed(1),pointerBurstMs:+(performance.now()-start).toFixed(1)})}return results});
 const fallbackContext=await browser.newContext();await fallbackContext.addInitScript(()=>{window.OffscreenCanvas=undefined});const fallback=await fallbackContext.newPage();fallback.on('pageerror',e=>errors.push(e.message));await fallback.goto('http://127.0.0.1:8000');await fallback.evaluate(async()=>{await new Promise(requestAnimationFrame);await previewReady()});assert(await fallback.evaluate(()=>ctx.getImageData(400,300,1,1).data[3]===255));
 await fallback.addInitScript(()=>{localStorage.setItem('knit-custom-v3','broken JSON')});await fallback.reload();await fallback.waitForTimeout(400);assert.equal(await fallback.evaluate(()=>localStorage.getItem('knit-custom-v3')),'broken JSON');
 await fallback.locator('#needles').fill('6');await fallback.locator('#applySize').click();fallback.once('dialog',dialog=>dialog.dismiss());await fallback.locator('#needles').fill('2');await fallback.locator('#applySize').click();assert.equal(await fallback.evaluate(()=>pattern[0].length),6);fallback.once('dialog',dialog=>dialog.accept());await fallback.locator('#applySize').click();assert.equal(await fallback.evaluate(()=>pattern[0].length),2);await fallback.locator('#undo').click();assert.equal(await fallback.evaluate(()=>pattern[0].length),6);
 await fallback.locator('#play').click();await fallback.waitForTimeout(1200);assert.equal(await fallback.locator('#step').inputValue(),'2');await fallback.locator('#play').click();
 await fallbackContext.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:['manifest and PNG icons','service worker control','JSON example import','painting and Undo','complete-sequence track grouping','keyboard editing and navigation','three calculated canvas views','PNG export','JSON save/load roundtrip','offline reload and autosave recovery','mobile width','main-thread fallback','corrupt autosave preservation','resize confirmation and Undo','playback'],performanceResults},null,2));
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
