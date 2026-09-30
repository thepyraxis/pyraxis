/* DEVICE DEPTH — stacked slices behind each dental phone = real visible side rail (polished purple-titanium, rim + specular stripe). */
(function(){
'use strict';
var N=30;
function L(k){ return 30+30*Math.exp(-Math.pow(k-1.5,2)/5)+20*Math.exp(-Math.pow(k-14,2)/14)-k*.35; }
document.querySelectorAll('.duo .device').forEach(function(d){
  var f=document.createDocumentFragment();
  for(var k=N;k>=1;k--){
    var s=document.createElement('i'); s.className='dv-s'; s.setAttribute('aria-hidden','true');
    s.style.setProperty('--k',k); s.style.setProperty('--l',L(k).toFixed(1)+'%'); f.appendChild(s);
  }
  d.insertBefore(f,d.firstChild);
});
})();
