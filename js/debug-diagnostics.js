/* ============================================================
   TEMPORARY DEV DIAGNOSTICS — animation-restart / reload audit
   ------------------------------------------------------------
   Off by default: zero listeners, zero overhead, zero visible
   change to the page. Enable with ?debug=1 in the URL, or by
   running  localStorage.pyraxisDebug='1'  in the console and
   reloading. Disable the same way ('0' / remove the key) or
   simply delete this <script> block — nothing else references it
   except the two optional window.PYRAXIS_DEBUG.log(...) calls in
   the #topo context-loss handlers above, which are themselves
   no-ops when this block is absent (the `if(window.PYRAXIS_DEBUG)`
   guard). Safe to strip entirely for production.

   Captures exactly the signals in section 3/9/10/12 of the audit:
   real vs. perceived reload, resize/relayout timing, WebGL context
   loss on both canvases, and uncaught errors — so a future
   occurrence of "the animation restarted" can be pinned to one of
   these instead of guessed at.
============================================================ */
(function(){
'use strict';
var on = /(?:^|[?&])debug=1(?:&|$)/.test(location.search) ||
         (function(){ try{ return localStorage.getItem('pyraxisDebug')==='1'; }catch(e){ return false; } })();
if(!on) return;

var log=[];
/* Panel + render() must exist BEFORE the first push() call below — push()
   calls render(), and render() writes to `panel`. With `var panel` declared
   further down, panel was still undefined at that first call (hoisting),
   so render() threw ("Cannot set properties of undefined (setting
   'textContent')") and killed this whole script before a single listener
   was attached — the overlay silently never worked. */
var panel=document.createElement('div');
panel.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;max-width:46vw;'+
  'max-height:40vh;overflow:auto;background:rgba(10,10,13,.92);color:#9ee;font:10px/1.4 monospace;'+
  'padding:8px;border:1px solid rgba(255,255,255,.15);border-radius:6px;pointer-events:none;white-space:pre-wrap';
document.body.appendChild(panel);
function render(){
  var gl1=document.getElementById('gl'), gl2=document.getElementById('topo');
  var stat=[
    'PYRAXIS DEBUG (?debug=1) · scrollY='+Math.round(scrollY)+
    ' · dpr='+(devicePixelRatio||1).toFixed(2)+
    ' · #gl='+(gl1?gl1.width+'x'+gl1.height:'—')+
    ' · #topo='+(gl2?gl2.width+'x'+gl2.height:'—'),
    '——'
  ].concat(log.slice().reverse()).join('\n');
  panel.textContent=stat;
}
function push(msg){
  var line='['+(performance.now()/1000).toFixed(2)+'s] '+msg;
  log.push(line);
  if(log.length>40) log.shift();
  render();
}
window.PYRAXIS_DEBUG={log:push};

/* 1. Real page reload vs. perceived restart — a true reload always
      resets performance.timeOrigin; a JS-only glitch never does. */
push('boot · timeOrigin='+performance.timeOrigin.toFixed(0)+' · readyState='+document.readyState);
addEventListener('pageshow',function(e){ push('pageshow · persisted='+e.persisted); });
addEventListener('pagehide',function(){ push('pagehide'); });
addEventListener('beforeunload',function(){ push('beforeunload (real navigation/reload)'); });
document.addEventListener('visibilitychange',function(){ push('visibilitychange · hidden='+document.hidden); });
addEventListener('focus',function(){ push('window focus'); });
addEventListener('blur',function(){ push('window blur'); });
addEventListener('orientationchange',function(){ push('orientationchange'); });

/* 2. Resize / relayout timing — to correlate a visual snap with a
      specific resize event rather than assuming one. */
var rzN=0;
addEventListener('resize',function(){ rzN++; push('resize #'+rzN+' · '+innerWidth+'x'+innerHeight); },{passive:true});

/* 3. WebGL context loss on BOTH canvases. #gl is a three.js
      WebGLRenderer, which already guards itself against context
      loss internally (verified in vendor/three-r159.min.js: the
      lost handler calls preventDefault() and render() no-ops while
      lost) — logged here for visibility only. #topo is a raw WebGL
      context and owns its own recovery (see the handlers above). */
['gl','topo'].forEach(function(id){
  var cv=document.getElementById(id); if(!cv) return;
  cv.addEventListener('webglcontextlost',function(){ push('#'+id+' webglcontextlost'); });
  cv.addEventListener('webglcontextrestored',function(){ push('#'+id+' webglcontextrestored'); });
});

/* 4. Uncaught errors / rejections — a single thrown error inside a
      rAF callback can silently stop that loop while others keep
      running, which reads as one system "restarting" on its own. */
addEventListener('error',function(e){ push('ERROR · '+(e.message||'?')+' @ '+(e.filename||'?')+':'+(e.lineno||'?')); });
addEventListener('unhandledrejection',function(e){ push('UNHANDLED REJECTION · '+(e.reason&&e.reason.message||e.reason)); });

/* 5. Small overlay panel — current scroll/animation state, sampled
      a few times a second rather than every frame. (panel/render defined
      above, before the first push() call.) */
render();
setInterval(render,500);
push('debug overlay active');
})();
