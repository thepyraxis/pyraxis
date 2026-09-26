(function(){
  'use strict';
  var cards=document.querySelectorAll('.deploy-card'); if(!cards.length) return;
  Array.prototype.forEach.call(cards,function(card){
    var glow=card.querySelector('.deploy-glow'), rect=null, pend=null, raf=null;
    function flush(){
      raf=null; if(!glow||!pend) return;
      glow.style.background='radial-gradient(220px circle at '+pend.x+'% '+pend.y+'%, rgba(242,240,235,.08), transparent 70%)';
    }
    card.addEventListener('pointerenter',function(e){
      rect=card.getBoundingClientRect();
      pend={x:((e.clientX-rect.left)/rect.width)*100,y:((e.clientY-rect.top)/rect.height)*100};
      flush();
    });
    card.addEventListener('pointermove',function(e){
      if(!rect) return;
      pend={x:((e.clientX-rect.left)/rect.width)*100,y:((e.clientY-rect.top)/rect.height)*100};
      if(raf===null) raf=requestAnimationFrame(flush);
    });
    card.addEventListener('pointerleave',function(){
      if(raf!==null){ cancelAnimationFrame(raf); raf=null; }
    });
    card.style.cursor='pointer';
    card.addEventListener('click',function(e){
      if(e.target.closest('a')) return; // real link already handles it
      var link=card.querySelector('.deploy-stat a');
      if(link) window.open(link.href,'_blank','noopener,noreferrer');
    });
    card.addEventListener('keydown',function(e){
      if(e.target!==card) return;
      if(e.key==='Enter'||e.key===' '){
        var link=card.querySelector('.deploy-stat a');
        if(link){ e.preventDefault(); window.open(link.href,'_blank','noopener,noreferrer'); }
      }
    });
  });
})();
