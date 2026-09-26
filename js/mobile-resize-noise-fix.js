/* MOBILE "AUTO-RELOAD" FIX — on phones the URL bar sliding in/out fires a height-only
   'resize' on nearly every scroll. Every resize listener on the page rebuilt its
   canvas / SVG paths, so animations visibly restarted (read as the page reloading).
   Touch devices now ignore height-only resizes under 220px; real changes (rotation,
   width change, big height change) still pass through. Desktop is untouched. */
(function(){
  var coarse=false;try{coarse=matchMedia('(pointer: coarse)').matches;}catch(e){}
  if(!coarse)return;
  var lw=innerWidth,lh=innerHeight,add=window.addEventListener;
  function noise(e){
    if(e.__pxNoise===undefined){
      var w=innerWidth,h=innerHeight;
      e.__pxNoise=(w===lw&&Math.abs(h-lh)<220);
      if(!e.__pxNoise){lw=w;lh=h;}
    }
    return e.__pxNoise;
  }
  window.addEventListener=function(type,fn,opt){
    if(type==='resize'&&typeof fn==='function'){
      return add.call(window,type,function(e){if(noise(e))return;return fn.call(this,e);},opt);
    }
    return add.call(window,type,fn,opt);
  };
})();
