'use strict';
/* If this script ever fails to parse, the .js class is never added
   and all content stays visible — no blank page. */
document.documentElement.classList.add('js');

var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,c){ return (c||document).querySelector(s); }
function $$(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
function raf2(fn){ requestAnimationFrame(function(){ requestAnimationFrame(fn); }); }
function sleep(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
function toast(msg){
  var t=$('#toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(function(){ t.classList.remove('show'); },4200);
}

/* ============================================================
   PREMIUM CHROME — one pass upgrades every phone on the page
============================================================ */
