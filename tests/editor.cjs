const{chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');const artifacts=require('node:fs').mkdtempSync(path.join(require('node:os').tmpdir(),'knit-editor-'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('http://127.0.0.1:8000');
 for(const [rows,cols]of [[12,8],[32,24]]){
  await page.selectOption('#rows',String(rows));await page.fill('#needles',String(cols));await page.click('#applySize');
  await page.waitForTimeout(100);
  const fitted=await page.locator('#grid').evaluate(g=>({width:g.clientWidth,total:g.scrollWidth,height:g.clientHeight,totalHeight:g.scrollHeight}));
  assert(fitted.total<=fitted.width+1,JSON.stringify(fitted));assert(fitted.totalHeight<=fitted.height+1,JSON.stringify(fitted));
  await page.click('#fullDesign');await page.waitForTimeout(100);
  assert.equal(await page.locator('#fullDesign').getAttribute('aria-expanded'),'true');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.click('#fitRepeat');await page.click('#moveGrid');
  const before=await page.evaluate(()=>JSON.stringify(pattern));
  await page.locator('#grid button[data-r="0"][data-n="0"]').click();assert.equal(await page.evaluate(()=>JSON.stringify(pattern)),before);
  await page.click('#gridRight');await page.click('#gridDown');
  assert(await page.locator('#grid').evaluate(g=>g.scrollLeft>0&&g.scrollTop>0),'Both axes should move');
  await page.click('#gridLeft');await page.click('#gridUp');
  await page.locator('#grid').evaluate(g=>{g.scrollLeft=g.scrollWidth;g.scrollTop=g.scrollHeight});
  await page.click('#paintGrid');await page.locator('[data-brush="T"]').click();await page.locator(`#grid button[data-r="${rows-1}"][data-n="${cols-1}"]`).click();
  assert.equal(await page.evaluate(()=>pattern.at(-1).at(-1)),'T');
  await page.click('#fitRepeat');
  await page.locator('#grid').evaluate(g=>g.closest('.card').scrollTop=0);await page.screenshot({path:path.join(artifacts,`editor-${rows}x${cols}.png`),fullPage:true});
  await page.click('#fullDesign');assert.equal(await page.locator('#fullDesign').getAttribute('aria-expanded'),'false');
 }
 await context.close();await browser.close();console.log('Passed: mobile 12×8 and 32×24 full-repeat fit, expanded view, two-axis navigation, Move without edits, Paint last cell, close editor.');
})().catch(e=>{console.error(e);process.exit(1)});
