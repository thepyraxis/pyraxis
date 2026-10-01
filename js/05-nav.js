'use strict';
(function(){
  var nav=$('#nav'), burger=$('#burger'), mnav=$('#mnav'); if(!nav) return;
  var tick=false;
  addEventListener('scroll',function(){
    if(!tick){ tick=true; requestAnimationFrame(function(){ nav.classList.toggle('scrolled',scrollY>26); tick=false; }); }
  },{passive:true});
  if(burger&&mnav){
    function setMenu(open){
      mnav.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      burger.setAttribute('aria-label',open?'Close menu':'Open menu');
      document.body.style.overflow=open?'hidden':'';
    }
    burger.addEventListener('click',function(){ setMenu(!mnav.classList.contains('open')); });
    $$('#mnav a, #mnav button').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && mnav.classList.contains('open')){ setMenu(false); burger.focus(); }
    });
  }
})();



/* ============================================================
   WHATSAPP ENGINE
============================================================ */
