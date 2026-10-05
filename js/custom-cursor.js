/* ============ CUSTOM CURSOR — liquid dot + ring, contextual states ============
   Fine pointers only; touch devices keep the native behavior. States:
   default (dot + trailing ring) · link (ring swells) · view (labeled
   disc over preview targets) · text (caret over inputs). */
(function(){
'use strict';
var fine=window.matchMedia&&matchMedia('(pointer: fine)').matches;
if(!fine||innerWidth<900) return; /* no custom cursor on phones / narrow (mobile emulation) */
var cDot=document.getElementById('cDot'), cRing=document.getElementById('cRing'), rLabel=document.getElementById('rLabel');
if(!cDot||!cRing||!rLabel) return;
/* native pointer is hidden only AFTER a real mouse move proves the custom one is alive,
   and is restored if any script error fires */
addEventListener('error',function(){ document.documentElement.classList.remove('finecur'); document.body.classList.remove('cur-on'); });
var rEl=cRing.firstElementChild;
var MX=innerWidth/2, MY=innerHeight/2, cstate='default', seen=false;
var LABELS={view:'View'};
function setState(s){
  if(s===cstate) return;
  cstate=s;
  document.body.dataset.cstate=s;
  rLabel.textContent=LABELS[s]||'';
}
var textPend=false;
function resolveText(){
  textPend=false;
  if(elState||document.hidden)return; /* link/view states win */
  var tg=document.elementFromPoint?document.elementFromPoint(MX,MY):null;
  if(tg&&tg.closest&&tg.closest('input,textarea')){setState('text');return;}
  setState(textAt(MX,MY)?'text':'default');
}
/* SCROLL-JERK FIX: resolveText runs elementFromPoint + caretRangeFromPoint + getClientRects, a
   forced hit-test/layout. It used to run on EVERY scroll frame and every mousemove, which stalls
   scrolling in text-dense sections (flow map, phones). Now: never while scrolling (one pass 220ms
   after scroll stops), and mouse moves are limited to ~1 pass per 70ms. */
var scrolling=false, scrollT=0, lastResolve=0;
function queueResolve(){
  if(textPend||scrolling)return;
  var wait=Math.max(0,70-(performance.now()-lastResolve));
  textPend=true;
  /* re-derive the element state here (not just in mouseover) so a cursor
     parked while the page moves under it snaps back to default/view/link
     correctly instead of freezing on a stale state */
  var run=function(){ lastResolve=performance.now(); elState=resolveEl(); resolveText(); };
  if(wait>0) setTimeout(function(){ requestAnimationFrame(run); },wait);
  else requestAnimationFrame(run);
}
function onScrollCursor(){
  scrolling=true; clearTimeout(scrollT);
  scrollT=setTimeout(function(){ scrolling=false; queueResolve(); },220);
}
addEventListener('mousemove',function(e){
  MX=e.clientX; MY=e.clientY;
  if(!seen){seen=true;document.documentElement.classList.add('finecur');document.body.classList.add('cur-on');}
  queueResolve();
},{passive:true});
addEventListener('scroll',onScrollCursor,{passive:true});
addEventListener('mousedown',function(){document.body.classList.add('pressing');});
addEventListener('mouseup',function(){document.body.classList.remove('pressing');});
document.addEventListener('mouseleave',function(){document.body.classList.remove('cur-on');});
document.addEventListener('mouseenter',function(){if(seen)document.body.classList.add('cur-on');});
/* element-level states (links, views) ride mouseover for immediacy; the
   throttled resolve pass below re-derives them via elementFromPoint, so a
   stale state self-corrects when the element under the cursor changes
   WITHOUT the mouse moving (scroll-away, DOM shifts) — no mouseover fires
   then, and the old elState used to block the reset to default forever. */
var elState=null;
function resolveEl(tg){
  if(!tg) tg=document.elementFromPoint?document.elementFromPoint(MX,MY):null;
  if(!tg||!tg.closest)return null;
  var t=tg.closest('[data-cursor]');
  if(t)return t.dataset.cursor||null;
  if(tg.closest('.deploy-prev a'))return 'view';
  if(tg.closest('a,button,select,[role="button"]'))return 'link';
  return null;
}
function textAt(x,y){
  var r=null;
  try{
    if(document.caretRangeFromPoint){
      r=document.caretRangeFromPoint(x,y);
    }else if(document.caretPositionFromPoint){
      var cp=document.caretPositionFromPoint(x,y);
      if(cp&&cp.offsetNode){
        r=document.createRange();
        var max=cp.offsetNode.textContent?cp.offsetNode.textContent.length:0;
        r.setStart(cp.offsetNode,Math.min(cp.offset,max));
        r.collapse(true);
      }
    }
  }catch(_){r=null;}
  if(!r||!r.startContainer)return null;
  /* snapped carets lie: the API returns the NEAREST text even for empty
     space, so only trust it if the caret rect actually holds the pointer */
  var rects=null;
  try{rects=r.getClientRects();}catch(_){rects=null;}
  var hit=false;
  if(rects&&rects.length){
    for(var i=0;i<rects.length;i++){var b=rects[i];
      if(x>=b.left-3&&x<=b.right+3&&y>=b.top-2&&y<=b.bottom+2){hit=true;break;}}
  }
  if(!hit)return null;
  var n=r.startContainer, el=n.nodeType===3?n.parentElement:n;
  if(!el||!el.closest)return null;
  if(el.closest('#hero'))return null; /* hero locked — never promise selection there */
  if(el.closest('a,button,select,input,textarea,[role="button"],#cDot,#cRing'))return null;
  return el.closest('p,h1,h2,h3,h4,h5,h6,li,blockquote,dd,dt');
}
document.addEventListener('mouseover',function(e){
  var tg=(e.target&&e.target.closest)?e.target:null;
  elState=resolveEl(tg);
  if(elState)setState(elState);
  /* falsy: leave the visual state alone — the throttled resolve pass will
     drop it back to default/text on its next tick */
});
var dX=MX, dY=MY, rX=MX, rY=MY, pvx=MX, pvy=MY, stretch=0, last=0, lastMX=MX, lastMY=MY;
function frame(now){
  requestAnimationFrame(frame);
  var dt=now-last; last=now;
  if(dt>48)dt=48; if(dt<1)dt=1;
  var kd=1-Math.pow(0.16,dt/16.7), kr=1-Math.pow(0.72,dt/16.7);
  dX+=(MX-dX)*kd; dY+=(MY-dY)*kd;
  rX+=(MX-rX)*kr; rY+=(MY-rY)*kr;
  var sp=Math.hypot(rX-pvx,rY-pvy); pvx=rX; pvy=rY;
  var want=sp*0.011; if(want>0.22)want=0.22;
  stretch+=(want-stretch)*0.18;
  /* mouse parked and trail settled: skip DOM writes until it moves again */
  var moved=(MX!==lastMX||MY!==lastMY); lastMX=MX; lastMY=MY;
  if(!moved&&Math.abs(MX-dX)<0.05&&Math.abs(MY-dY)<0.05&&Math.abs(MX-rX)<0.05&&Math.abs(MY-rY)<0.05&&stretch<0.002) return;
  cDot.style.transform='translate3d('+dX.toFixed(1)+'px,'+dY.toFixed(1)+'px,0)';
  cRing.style.transform='translate3d('+rX.toFixed(1)+'px,'+rY.toFixed(1)+'px,0)';
  rEl.style.transform='scaleX('+(1+stretch).toFixed(3)+') scaleY('+(1-stretch*0.6).toFixed(3)+')';
}
requestAnimationFrame(function(now){last=now;requestAnimationFrame(frame);});
})();
