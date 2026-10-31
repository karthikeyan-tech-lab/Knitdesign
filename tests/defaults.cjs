const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),fields=Object.fromEntries(['jerseyStudy','tuckStudy','relief','colours','color'].map(k=>[k,{}]));
const c={validPattern:()=>true,$:id=>fields[id],yarns:[]};vm.createContext(c);vm.runInContext(src.match(/function applyData\(d\)\{[^\n]+/)[0],c);
const pattern=[['K','T'],['K','K']];
for(const prefs of [{},{jerseyStudy:false,tuckStudy:false},{jerseyStudy:true,tuckStudy:true}]){
 c.applyData({pattern,...prefs,color:'#abcdef',surfaceRelief:.9});assert(fields.jerseyStudy.checked&&fields.tuckStudy.checked);assert.equal(fields.color.value,'#abcdef');assert.equal(fields.relief.value,.9);
}
console.log('Automatic rendering survives legacy disabled flags while preserving yarn colour and relief.');
