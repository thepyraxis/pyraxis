/* FLOAT PHONES — tilts the 3 demo phones in 3D, adds floating glass cards, mouse parallax, idle float. */
(function(){
'use strict';
var REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=matchMedia('(pointer: fine)').matches&&matchMedia('(min-width:900px)').matches;
var OK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
var CFG=[
 {rx:7,ry:-15,rz:3,cards:[
  {x:'-36%',y:'13%',z:70,l:'Booking',t:'Confirmed \u00b7 10:30',d:.25,s:6},
  {x:'66%',y:'44%',z:115,l:'Reminder',t:'Queued \u00b7 24h before',d:.55,s:7},
  {x:'-28%',y:'78%',z:50,l:'CRM',t:'Lead saved',d:.85,s:5.5}]},
 {rx:6,ry:15,rz:-3,cards:[
  {x:'-40%',y:'20%',z:80,l:'QR scanned',t:'Table 12',d:.25,s:6.5},
  {x:'64%',y:'7%',z:115,l:'Order',t:'Sent to kitchen',d:.55,s:5.5},
  {x:'60%',y:'80%',z:60,l:'Offer',t:'Dessert redeemed',d:.85,s:7}]},
 {rx:5,ry:-10,rz:2,cards:[
  {x:'54%',y:'8%',z:100,l:'Rating',t:'5 / 5 received',d:.25,s:6},
  {x:'-4%',y:'86%',z:70,l:'Shared',t:'Google \u00b7 Instagram',d:.6,s:7}]}
];
var devs=document.querySelectorAll('.device:not(.phone--dead)');
CFG.forEach(function(c,i){
  var d=devs[i]; if(!d) return;
  var stage=d.parentElement; stage.classList.add('fp-stage');
  d.classList.add('fp-on');
  d.style.setProperty('--rx',c.rx+'deg'); d.style.setProperty('--ry',c.ry+'deg'); d.style.setProperty('--rz',c.rz+'deg');
  c.cards.forEach(function(k){
    var e=document.createElement('div'); e.className='fp-card'; e.setAttribute('aria-hidden','true');
    e.style.cssText='--x:'+k.x+';--y:'+k.y+';--z:'+k.z+'px;--d:'+k.d+'s;--t:'+k.s+'s';
    e.innerHTML='<i>'+OK+'</i><span><small>'+k.l+'</small><b>'+k.t+'</b></span>';
    d.appendChild(e);
  });
  /* in view: cards enter, idle float runs; off-screen: paused */
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ es.forEach(function(en){
      if(en.isIntersecting){ d.classList.add('fp-in'); d.classList.add('fp-live'); } else d.classList.remove('fp-live');
    }); },{threshold:.25}).observe(d);
  } else { d.classList.add('fp-in','fp-live'); }
  /* mouse parallax */
  if(FINE&&!REDUCED){
    var raf=0,nx=0,ny=0;
    function apply(){ raf=0;
      d.style.setProperty('--rx',(c.rx-ny*7).toFixed(2)+'deg');
      d.style.setProperty('--ry',(c.ry+nx*9).toFixed(2)+'deg'); }
    stage.addEventListener('pointermove',function(e){
      var r=stage.getBoundingClientRect();
      nx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
      ny=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
      if(!raf) raf=requestAnimationFrame(apply);
    },{passive:true});
    stage.addEventListener('pointerleave',function(){ nx=ny=0; if(!raf) raf=requestAnimationFrame(apply); });
  }
});
})();
