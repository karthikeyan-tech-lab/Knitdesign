const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),fields=Object.fromEntries(['relief','colours','color','machineTracks'].map(k=>[k,{options:[{value:'2'},{value:'3'},{value:'4'}]}]));
const c={validPattern:()=>true,$:id=>fields[id],yarns:[]};vm.createContext(c);vm.runInContext(src.match(/function applyData\(d\)\{[^\n]+/)[0],c);
const pattern=[['K','T'],['K','K']];
for(const prefs of [{},{jerseyStudy:false,tuckStudy:false},{jerseyStudy:true,tuckStudy:true}]){
 c.applyData({pattern,...prefs,color:'#abcdef',surfaceRelief:.9,machineTracks:3});assert.equal(fields.color.value,'#abcdef');assert.equal(fields.relief.value,.9);assert.equal(fields.machineTracks.value,3);assert.deepEqual(JSON.parse(JSON.stringify(c.pattern)),pattern);
}
console.log('Automatic rendering survives legacy disabled flags while preserving yarn colour and relief.');
