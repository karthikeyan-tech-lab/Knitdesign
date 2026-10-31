const {chromium}=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  await page.route('**/tests/browser.html',route=>route.fulfill({path:path.join(__dirname,'browser.html'),contentType:'text/html'}));
  await page.goto('http://127.0.0.1:8000/tests/browser.html');
  await page.waitForFunction(()=>/passed|FAILED/.test(document.getElementById('status').textContent),null,{timeout:180000});
  const result=await page.locator('#status').textContent();assert(!result.startsWith('FAILED'),result);console.log(result);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
