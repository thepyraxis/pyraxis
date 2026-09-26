'use strict';
(function(){
  var nav=$('#nav'), burger=$('#burger'), mnav=$('#mnav'); if(!nav) return;
  var tick=false;
  addEventListener('scroll',function(){
    if(!tick){ tick=true; requestAnimationFrame(function(){ nav.classList.toggle('scrolled',scrollY>26); tick=false; }); }
  },{passive:true});
  if(burger&&mnav){
    burger.addEventListener('click',function(){
      var open=!mnav.classList.contains('open');
      mnav.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      document.body.style.overflow=open?'hidden':'';
    });
    $$('#mnav a').forEach(function(a){ a.addEventListener('click',function(){
      mnav.classList.remove('open'); document.body.style.overflow='';
    }); });
  }
})();



/* ============================================================
   WHATSAPP ENGINE
============================================================ */
