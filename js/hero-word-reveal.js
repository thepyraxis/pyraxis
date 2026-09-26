/* Hero word-mask reveal (NexusNode pattern): splits #hero h1 into words that
   rise out of overflow masks on load, preserving <em> and <br>. No-JS and
   reduced-motion users see the plain headline (gated by .js + media query). */
(function(){
  'use strict';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var h1=document.querySelector('#hero h1'); if(!h1) return;
  var step=80, i=0, lastWi=null;
  var frag=document.createDocumentFragment();
  function word(text,isEm){
    /* trailing punctuation rides inside the previous word's mask */
    if(lastWi&&/^[.,!?;:]+$/.test(text)){ lastWi.appendChild(document.createTextNode(text)); return; }
    var wm=document.createElement('span'); wm.className='wm';
    var wi=document.createElement('span'); wi.className='wi';
    wi.style.setProperty('--d',(i++*step)+'ms');
    if(isEm){ var e=document.createElement('em'); e.textContent=text; wi.appendChild(e); }
    else wi.textContent=text;
    wm.appendChild(wi); frag.appendChild(wm);
    frag.appendChild(document.createTextNode(' '));
    lastWi=wi;
  }
  Array.prototype.slice.call(h1.childNodes).forEach(function(n){
    if(n.nodeType===3){
      n.textContent.trim().split(/\s+/).filter(Boolean).forEach(function(w){ word(w,false); });
    }else if(n.nodeName==='BR'){ frag.appendChild(document.createElement('br')); lastWi=null; }
    else if(n.nodeName==='EM'){
      n.textContent.trim().split(/\s+/).filter(Boolean).forEach(function(w){ word(w,true); });
    }else{ frag.appendChild(n.cloneNode(true)); lastWi=null; }
  });
  h1.innerHTML=''; h1.appendChild(frag);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ h1.classList.add('in'); }); });
})();
