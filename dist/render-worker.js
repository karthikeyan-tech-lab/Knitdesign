// Keep procedural geometry and texture work off the UI thread.
self.window=self;
self.document={createElement:()=>new OffscreenCanvas(1,1)};
importScripts('renderer.js');
const canvas=new OffscreenCanvas(1080,720),context=canvas.getContext('2d');
self.onmessage=({data:{id,options}})=>{
  try {
    (options.mode==='swatch'?renderFabricSheet:renderSwatch)(context,options);
    const bitmap=canvas.transferToImageBitmap();
    self.postMessage({id,bitmap},[bitmap]);
  } catch(error) { self.postMessage({id,error:String(error)}); }
};
