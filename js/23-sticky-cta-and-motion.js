'use strict';
/* Mobile sticky CTA (shown after the hero, hidden while the menu is open). */
(function(){
  var bar=document.getElementById('stickyCta'), mnav=document.getElementById('mnav'), hero=document.getElementById('hero');
  function update(){
    if(!bar) return;
    var past=scrollY>((hero&&hero.offsetHeight)||600)*0.8;
    var blocked=(mnav&&mnav.classList.contains('open'));
    bar.classList.toggle('on',past&&!blocked);
  }
  if(bar){
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update);
    if(mnav) new MutationObserver(update).observe(mnav,{attributes:true,attributeFilter:['class']});
    update();
  }
})();
