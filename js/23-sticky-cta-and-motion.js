'use strict';
/* Mobile sticky CTA (shown after the hero, hidden while modal or menu is open). */
(function(){
  var bar=document.getElementById('stickyCta'), modal=document.getElementById('modal'), mnav=document.getElementById('mnav'), hero=document.getElementById('hero');
  function update(){
    if(!bar) return;
    var past=scrollY>((hero&&hero.offsetHeight)||600)*0.8;
    var blocked=(modal&&!modal.hidden)||(mnav&&mnav.classList.contains('open'));
    bar.classList.toggle('on',past&&!blocked);
  }
  if(bar){
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update);
    if(modal) new MutationObserver(update).observe(modal,{attributes:true,attributeFilter:['hidden']});
    if(mnav) new MutationObserver(update).observe(mnav,{attributes:true,attributeFilter:['class']});
    update();
  }
})();
