'use strict';
(function(){
  var row=$("#gsysRow"), panel=$("#gsysPanel"), swap=$("#gsysSwap");
  if(!row||!panel||!swap) return;
  var EM="—";
  var NODES=[
    {b:'Google, social, QR codes and word of mouth — customers find you.',s:'Every channel',sl:'One Front Door'},
    {b:'Every scan, chat and enquiry becomes a known contact, not a stranger.',s:'First contact',sl:'Never Lost'},
    {b:'The AI answers, qualifies and books — while you are busy serving.',s:'Any hour',sl:'Answered Instantly'},
    {b:'Confirmations, reminders and requests handled around the visit itself.',s:'Before & after',sl:'Communication'},
    {b:'Every visit, order and review lands in one clean customer record.',s:'One record',sl:'Per Customer'},
    {b:'Timely follow-ups and offers give regulars a reason to come back.',s:'On purpose',sl:'Every Return'},
    {b:'Happy customers review and refer — and it is credited back to them.',s:'Word of mouth',sl:'Made Measurable'},
    {b:'Each stage feeds the next — the loop compounds with every customer.',s:'One system',sl:'Connected By Design'}
  ];
  var LABELS=["Attract","Capture","Convert","Serve","Understand","Retain","Amplify","Grow"];
  var NEUT={h:"One Connected Growth System",b:"Move through each stage to discover how every module works together to turn visitors into loyal customers."};
  function esc(t){ return t.replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function nodeHtml(n,i){ return "<h3>"+LABELS[i]+"</h3>"+
    "<p class=\"ben\">"+esc(n.b)+"</p>"+
    "<p class=\"stat\">"+esc(n.s)+"</p>"+
    "<p class=\"statl\">"+esc(n.sl)+"</p>"; }
  function neutHtml(){ return "<h3>"+NEUT.h+"</h3><p class=\"ben\">"+NEUT.b+"</p>"; }
  var cur=null, resetT=null, swapT=null;
  function show(i){
    if(resetT){ clearTimeout(resetT); resetT=null; }
    if(swapT){ clearTimeout(swapT); swapT=null; }
    if(i===cur) return;
    var btns=row.querySelectorAll(".gnode"), k;
    for(k=0;k<btns.length;k++) btns[k].classList.toggle("on",k===i);
    swap.classList.add("out");
    swapT=setTimeout(function(){
      swap.innerHTML=(i==null)?neutHtml():nodeHtml(NODES[i],i);
      panel.classList.toggle("live",i!=null);
      swap.classList.remove("out");
      cur=i;
    },REDUCED?0:180);
  }
  function schedReset(){ if(!resetT) resetT=setTimeout(function(){ show(null); },250); }
  row.addEventListener("pointerover",function(e){
    var b=e.target&&e.target.closest?e.target.closest(".gnode"):null;
    if(b) show(+b.getAttribute("data-i"));
  });
  row.addEventListener("focusin",function(e){
    var b=e.target&&e.target.closest?e.target.closest(".gnode"):null;
    if(b) show(+b.getAttribute("data-i"));
  });
  row.addEventListener("click",function(e){
    var b=e.target&&e.target.closest?e.target.closest(".gnode"):null;
    if(b) show(+b.getAttribute("data-i"));
  });
  row.addEventListener("pointerleave",schedReset);
  row.addEventListener("focusout",schedReset);
  swap.innerHTML=neutHtml();
})();

/* ============================================================
   04 · THE SYSTEM BUS — modules power on along one line
============================================================ */
