'use strict';
(function(){
  var box=$('#jflow'); if(!box) return;
  var chips=$$('.jf',box);
  if(!chips.length) return;
  if(REDUCED){ chips[chips.length-1].classList.add('on'); return; }
  if(!('IntersectionObserver' in window)){ chips[chips.length-1].classList.add('on'); return; }
  var i=0, timer=null;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        if(!timer) timer=setInterval(function(){
          chips.forEach(function(c,j){ c.classList.toggle('on', j===i); });
          i=(i+1)%chips.length;
        },900);
      } else { clearInterval(timer); timer=null; }
    });
  },{threshold:.25});
  io.observe(box);
})();

/* ============================================================
   07 · THE REVIEW ENGINE — every customer asked,
   every customer offered the same public path.
============================================================ */
