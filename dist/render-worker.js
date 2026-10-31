// OffscreenCanvas is optional: the UI has a guarded fallback and a timeout.
self.window=self;
self.document={createElement:()=>new OffscreenCanvas(1,1)};
importScripts('jersey.js','renderer.js');
const canvas=new OffscreenCanvas(1080,720),context=canvas.getContext('2d');
const garmentCanvas=new OffscreenCanvas(1080,720),garmentContext=garmentCanvas.getContext('2d');
let garmentKey='';
self.onmessage=({data:{id,options}})=>{
  try{
    if(!context||!garmentContext)throw Error('Worker Canvas 2D is unavailable');
    (options.mode==='swatch'?renderFabricSheet:renderSwatch)(context,options);
    const bitmap=canvas.transferToImageBitmap(),key=JSON.stringify([options.pattern,options.yarns,options.color,options.thickness,options.spacing,options.jerseyStudy,options.garmentType,options.garmentSide]);
    let garment;
    if(key!==garmentKey){renderGarment(garmentContext,options);garment=garmentCanvas.transferToImageBitmap();garmentKey=key}
    self.postMessage({id,bitmap,garment},garment?[bitmap,garment]:[bitmap]);
  }catch(error){self.postMessage({id,error:String(error)})}
};

