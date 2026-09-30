/* SCROLL-JERK FIX: CSS animations kept running in every section, even far off-screen. Some animate
   layout/paint properties (scan bar 'top', SVG stroke-dashoffset, box-shadow pulses), so the browser
   redid style/layout work every frame no matter where you were on the page. This marks sections that
   are not near the viewport, and CSS pauses their animations. Nothing changes visually: an animation
   resumes as the section approaches (400px early). */
(function(){
  'use strict';
  if(!('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++) es[i].target.classList.toggle('anim-off',!es[i].isIntersecting);
  },{rootMargin:'400px 0px 400px 0px'});
  var els=document.querySelectorAll('section.sec, .mq');
  for(var i=0;i<els.length;i++) io.observe(els[i]);
})();
