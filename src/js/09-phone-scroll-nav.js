'use strict';
/* Phone mockups never react to the mouse wheel / touch scroll (page always scrolls instead).
   When a mockup's chat/app has more content than fits, small up/down arrow buttons appear
   on its right edge so the visitor can still move through the screen by clicking. */
(function(){
  var ARROW_UP='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6"/></svg>';
  var ARROW_DN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10l6 6 6-6"/></svg>';
  function setup(scr){
    var pane=scr.querySelector('.wa-body,.q-app');
    var host=scr.closest('.device')||scr;
    if(!pane||host.querySelector('.d-nav')) return;
    var nav=document.createElement('div');
    nav.className='d-nav'; nav.hidden=true;
    nav.innerHTML='<button type="button" class="d-nav-up" aria-label="Scroll screen up">'+ARROW_UP+'</button>'+
                  '<button type="button" class="d-nav-dn" aria-label="Scroll screen down">'+ARROW_DN+'</button>';
    host.appendChild(nav);
    var up=nav.firstChild, dn=nav.lastChild;
    function update(){
      var max=pane.scrollHeight-pane.clientHeight;
      nav.hidden=max<=24;
      up.disabled=pane.scrollTop<=2;
      dn.disabled=pane.scrollTop>=max-2;
    }
    function go(dir){
      var step=Math.max(80,pane.clientHeight*.6)*dir;
      try{ pane.scrollBy({top:step,behavior:REDUCED?'auto':'smooth'}); }catch(e){ pane.scrollTop+=step; }
    }
    up.addEventListener('click',function(){ go(-1); });
    dn.addEventListener('click',function(){ go(1); });
    pane.addEventListener('scroll',update,{passive:true});
    try{ new MutationObserver(update).observe(pane,{childList:true,subtree:true,characterData:true}); }catch(e){}
    if(window.ResizeObserver) new ResizeObserver(update).observe(pane);
    window.addEventListener('resize',update);
    update();
  }
  function init(){ $$('.d-scr').forEach(setup); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
