'use strict';
(function(){
  var nav=$('#nav'), burger=$('#burger'), mnav=$('#mnav'); if(!nav) return;
  var tick=false;
  addEventListener('scroll',function(){
    if(!tick){ tick=true; requestAnimationFrame(function(){ nav.classList.toggle('scrolled',scrollY>26); tick=false; }); }
  },{passive:true});
  if(burger&&mnav){
    var main=document.getElementById('main'), foot=document.querySelector('footer');
    function setMenu(open){
      mnav.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      burger.setAttribute('aria-label',open?'Close menu':'Open menu');
      document.body.style.overflow=open?'hidden':'';
      /* keyboard users must not tab through the page behind the open menu */
      if(main) main.inert=open;
      if(foot) foot.inert=open;
      if(open){
        var first=mnav.querySelector('a');
        if(first) first.focus();
      }
    }
    burger.addEventListener('click',function(){ setMenu(!mnav.classList.contains('open')); });
    $$('#mnav a, #mnav button').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape' && mnav.classList.contains('open')){ setMenu(false); burger.focus(); }
    });
  }
})();

/* ---------- roll-hover links: duplicate link text into a sliding italic
   accent line (pure CSS motion, see .roll rules). Plain-text anchors only;
   runs synchronously so there is never an unstyled flash. No-JS keeps the
   original links untouched. */
(function(){
  if(REDUCED) return;
  $$('.nav-links a, .foot-links a').forEach(function(a){
    if(a.querySelector('*')) return;   /* rich content: leave alone */
    var t=a.textContent; if(!t.trim()) return;
    a.textContent='';
    var s1=document.createElement('span'); s1.className='roll-t'; s1.textContent=t;
    var s2=document.createElement('span'); s2.className='roll-t roll-t2';
    s2.setAttribute('aria-hidden','true'); s2.textContent=t;
    a.classList.add('roll'); a.appendChild(s1); a.appendChild(s2);
  });
})();



/* ============================================================
   WHATSAPP ENGINE
============================================================ */
