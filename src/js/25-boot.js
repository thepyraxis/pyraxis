/* Ember particle field is desktop-only — phones get the light contour
   (topo) field as the single background (non-interactive, throttled for
   small Android). No WebGL / tiny devices still get topo; only a total
   WebGL failure on desktop falls back to the static mark. */
/* RESIZE FIX: phone-vs-desktop mode (ember/globe engine vs static mark + topo backdrop) is decided
   once at load. Crossing the 900px / touch breakpoint later (devtools device toggle, rotating a
   tablet, snapping a window) left the wrong mode running - no PYRAXIS mark until manual reload.
   When the mode flips, reload once the resize settles. Same-mode resizes are untouched. */
(function(){
  function mode(){ return ((window.matchMedia&&matchMedia('(pointer: coarse)').matches)||innerWidth<900)?'m':'d'; }
  var was=mode(), t=null;
  /* double-confirmed: a single odd reading (zoom rounding, scrollbar flicker,
     devtools dock) must never reload the page. Reload only if the flipped
     mode is still flipped 600ms later. */
  function check(){ clearTimeout(t); t=setTimeout(function(){
    if(mode()===was) return;
    setTimeout(function(){
      if(mode()===was) return;
      was=mode();
      /* NO page reload, ever. Growing into desktop mode boots the engine in place;
         shrinking keeps whatever is already running (it scales itself). */
      if(was==='d'&&window.__pxModeFlip) window.__pxModeFlip();
    },600);
  },350); }
  addEventListener('resize',check);
})();
(function(){
var engineStarted=false;
/* LOW-END PC TIERS — data-saver / slow-network desktops get the ember field
   in LITE mode: fewer particles, DPR<=1, no fly-away dust (see
   ember-field-engine.js), and the topo backdrop renders at half res / lower
   fps. Missing WebGL falls back to the static mark. Full-tier desktops
   additionally preload the earth texture; lite/static never fetch it.
   NOTE: deviceMemory/hardwareConcurrency are deliberately NOT used here —
   privacy browsers (Brave) spoof them downward, which put the SAME pc in
   LITE in one browser and FULL in another (2600 vs 8500 particles). Only
   explicit user/network signals gate the tier, so every browser on the
   same machine renders the same field. */
var lite=(navigator.connection&&(navigator.connection.saveData||/2g|slow-2g/.test(navigator.connection.effectiveType||'')));
function glOK(){
  /* right after a device-toggle/resize the GPU process can refuse one context
     request — ask up to 3 times and release the probe context. */
  for(var tr=0; tr<3; tr++){
    try{ var c=document.createElement('canvas'); var g=c.getContext('webgl')||c.getContext('experimental-webgl');
      if(window.WebGLRenderingContext&&g){
        if(g.getExtension){ var lc=g.getExtension('WEBGL_lose_context'); if(lc) lc.loseContext(); }
        return true;
      } }catch(e){}
  }
  return false;
}
function loadEmber(){
  ['public/vendor/three-r159.min.js','js/ember-field-engine.js'].forEach(function(src){
    var s=document.createElement('script'); s.src=src; s.async=false; document.body.appendChild(s);
  });
}
function startDesktop(){
  if(engineStarted) return; engineStarted=true;
  /* Reduced-motion desktops asked for stillness: skip the 1.1MB ember+earth
     download entirely and show the static mark + topo like weak-GPU PCs.
     Everyone else is untouched. */
  try{
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){
      window.__topoMobile=false;
      document.documentElement.classList.add('no-gl');
      if(window.topoStart) window.topoStart();
      return;
    }
  }catch(e){}
  window.__topoMobile=false;
  window.__pxLite=!!lite;
  var ok=glOK();
  var weak=(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
  /* No engine on a desktop (weak GPU, no WebGL) used to leave the hero with NO PYRAXIS mark at all.
     'no-gl' turns on the static mark (css) so the symbol is always there. */
  if(!ok||weak){ document.documentElement.classList.add('no-gl'); if(window.topoStart) window.topoStart(); return; }
  document.documentElement.classList.add('has-gl');
  /* FIRST-LOAD LAG FIX: the earth texture is no longer preloaded here — the engine fetches it only when the
     visitor scrolls toward the globe (or idles on the hero), so it never competes with first paint. */
  /* LAG FIX: parsing 670KB three.js + building 8500 embers + compiling shaders used to land in the
     same frames as every section script. Wait until the browser is idle (max 900ms) so first paint
     and the section scripts finish first. */
  var boot=loadEmber;
  /* FAST START: scripts are preloaded in <head> (download overlaps HTML/CSS), so boot right after first
     paint. Headline reveal runs on the compositor (transform), so engine parse does not jerk it. */
  requestAnimationFrame(function(){ requestAnimationFrame(boot); });
  /* WATCHDOG: if the ember engine has not come alive in 8s (blocked script, GPU hiccup, context lost),
     show the static mark instead of an empty hero; drop it again the moment the engine turns on. */
  var wd=0, wdt=setInterval(function(){
    var live=document.querySelector('#gl.on'), h=document.documentElement.classList;
    if(live){ h.remove('no-gl'); clearInterval(wdt); }
    else if(++wd>=6){ h.add('no-gl'); if(window.topoStart) window.topoStart(); if(wd>=14) clearInterval(wdt); }
  },2000);
}
document.addEventListener('DOMContentLoaded',function(){
  /* PHONES/TOUCH: no particle ember engine, no static PYRAXIS mark. The
     light contour (topo) field is the only background — non-interactive
     and throttled for small Android (see hero-topo-field.js). Starts idle
     so first paint stays fast. */
  /* DIAG: expose the tier decision so a "works local, broken live" report can
     be settled from the console (same PC + same window must give same values;
     if innerWidth<900 or coarse is true here, the mobile/touch path is — by
     design — topo-only with no ember particles and no mouse interaction). */
  try{
    window.__pxDbg={w:innerWidth,h:innerHeight,dpr:window.devicePixelRatio||1,
      coarse:!!(window.matchMedia&&matchMedia('(pointer: coarse)').matches),
      lite:!!lite,mem:navigator.deviceMemory||null,cpu:navigator.hardwareConcurrency||null,
      saveData:!!(navigator.connection&&navigator.connection.saveData),
      effType:(navigator.connection&&navigator.connection.effectiveType)||null};
  }catch(e){}
  if((window.matchMedia&&matchMedia('(pointer: coarse)').matches)||innerWidth<900){
    window.__topoMobile=true;
    var kick=function(){ if(window.topoStart) window.topoStart(); };
    if('requestIdleCallback' in window) requestIdleCallback(kick,{timeout:1200});
    else setTimeout(kick,600);
    return;
  }
  startDesktop();
});
/* called by the resize watcher above when a small window grows into desktop mode */
window.__pxModeFlip=function(){
  if(engineStarted||document.readyState==='loading') return;
  if((window.matchMedia&&matchMedia('(pointer: coarse)').matches)||innerWidth<900) return;
  startDesktop();
};
})();
