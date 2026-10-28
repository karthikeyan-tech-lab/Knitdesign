// Navigation is separate from painting so touch gestures never need to do both.
(()=>{
 const grid=document.getElementById('grid'),card=grid.closest('.card');
 const fit=document.getElementById('fitRepeat'),full=document.getElementById('fullDesign');
 let drag=null;
 function size(){const cols=grid.querySelectorAll('tr:first-child th').length||3;grid.style.setProperty('--cell-size',Math.max(14,Math.min(48,(grid.clientWidth-4)/cols-2))+'px')}
 const resize=new ResizeObserver(size);resize.observe(grid);
 new MutationObserver(size).observe(grid,{childList:true});
 fit.onclick=()=>{const on=grid.classList.toggle('grid-fit');fit.setAttribute('aria-pressed',on);fit.classList.toggle('active',on);size()};
 function expand(on){card.classList.toggle('editor-expanded',on);document.body.classList.toggle('editor-open',on);full.textContent=on?'Close full design':'Full design';full.setAttribute('aria-expanded',on);if(on)card.scrollTop=0;size();if(!on)full.focus()}
 full.onclick=()=>expand(!card.classList.contains('editor-expanded'));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&card.classList.contains('editor-expanded'))expand(false)});
 function move(on){window.editorMove=on;grid.classList.toggle('grid-move',on);grid.classList.toggle('grid-paint',!on);for(const [id,value]of [['moveGrid',on],['paintGrid',!on]]){const b=document.getElementById(id);b.classList.toggle('active',value);b.setAttribute('aria-pressed',value)}document.getElementById('gridHelp').textContent=on?'Swipe or drag to move. Arrow buttons also move the design.':'Paint stitches with your brush. Use Fit repeat to see every feeder and needle.'}
 document.getElementById('moveGrid').onclick=()=>move(true);document.getElementById('paintGrid').onclick=()=>move(false);
 grid.addEventListener('pointerdown',e=>{if(!window.editorMove||e.pointerType==='touch'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:grid.scrollLeft,top:grid.scrollTop};grid.setPointerCapture(e.pointerId);e.preventDefault()});
 grid.addEventListener('pointermove',e=>{if(drag){grid.scrollLeft=drag.left+drag.x-e.clientX;grid.scrollTop=drag.top+drag.y-e.clientY}});
 grid.addEventListener('pointerup',()=>drag=null);grid.addEventListener('pointercancel',()=>drag=null);
 for(const [id,x,y]of [['gridLeft',-1,0],['gridRight',1,0],['gridUp',0,-1],['gridDown',0,1]])document.getElementById(id).onclick=()=>grid.scrollBy({left:x*grid.clientWidth*.75,top:y*grid.clientHeight*.75,behavior:'auto'});
 move(false);size();
})();
