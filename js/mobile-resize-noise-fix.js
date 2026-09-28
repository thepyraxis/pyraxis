/* AUTO-RELOAD FIX — the URL bar sliding in/out on phones fires a height-only
   'resize' on nearly every scroll, and simply resizing a desktop browser window
   fires the same 'resize' repeatedly mid-drag. Some canvases (see hero-topo-field.js)
   resize their backing buffer directly on every 'resize', which clears the canvas to
   black for a frame — with several canvases doing this at once it reads as the whole
   page reloading. Small height-only changes (<220px) are now ignored everywhere,
   touch or mouse; a real change (rotation, width change, big height change) still
   passes through untouched. */
(function(){
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
