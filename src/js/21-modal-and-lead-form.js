'use strict';
/* "Get a demo" modal. Validates, then opens WhatsApp with the details prefilled
   (visitor presses send there). The modal stays open on a confirmation panel with a
   tap-to-open link + email/phone fallback, so a blocked popup never loses the lead.
   No backend/key needed; CSP-safe. */
(function(){
  var modal=$('#modal'), form=$('#leadForm'), err=$('#fErr'); if(!modal||!form) return;
  var WA='919837104413', lastFocus=null, src='site';
  var done=$('#mDone'), doneT=$('#mDoneT'), waLink=$('#mWa'), mailLink=$('#mMail');
  function showForm(){ if(done.hidden) return; form.reset(); done.hidden=true; form.hidden=false; $('#mTitle').hidden=false; $('.m-lede',modal).hidden=false; modal.setAttribute('aria-labelledby','mTitle'); }
  var bg=[$('#main'),$('footer'),$('#nav')];
  function lock(on){ bg.forEach(function(el){ if(el) el.inert=on; }); }
  function open(){
    lastFocus=document.activeElement;
    var m=$('#mnav'); if(m&&m.classList.contains('open')){ m.classList.remove('open'); }
    showForm();
    err.hidden=true; $$('.f-warn',form).forEach(function(n){ n.hidden=true; }); $$('.bad',form).forEach(function(i){ i.classList.remove('bad'); });
    modal.hidden=false; lock(true); document.body.style.overflow='hidden';
    setTimeout(function(){ form.elements.name.focus(); },60);
  }
  function close(){
    modal.hidden=true; lock(false); document.body.style.overflow='';
    if(lastFocus&&document.contains(lastFocus)&&lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open-modal]').forEach(function(b){
    b.addEventListener('click',function(e){ e.preventDefault(); src=b.getAttribute('data-src')||'site'; open(); });
  });
  modal.addEventListener('click',function(e){
    var t=e.target;
    while(t&&t!==modal){ if(t.hasAttribute&&t.hasAttribute('data-close-modal')){ close(); return; } t=t.parentNode; }
  });
  document.addEventListener('keydown',function(e){
    if(modal.hidden) return;
    if(e.key==='Escape'){ close(); return; }
    if(e.key==='Tab'){
      var f=$$('button,input,select,a[href]',modal).filter(function(x){ return !x.disabled&&x.offsetParent!==null; });
      if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey&&document.activeElement===last){ first.focus(); e.preventDefault(); }
    }
  });
  function phoneOk(v){ var d=v.replace(/\D/g,''); return /^[+\d\s()-]+$/.test(v)&&d.length>=7&&d.length<=15; }
  function emailOk(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function flag(input,note,msg){
    input.classList.toggle('bad',!!msg); input.setAttribute('aria-invalid',msg?'true':'false');
    note.textContent=msg||''; note.hidden=!msg;
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.elements.name, phone=form.elements.phone, email=form.elements.email;
    var pErr=$('#phoneErr'), eErr=$('#emailErr');
    var pv=phone.value.trim(), ev=email.value.trim();
    name.classList.remove('bad'); err.hidden=true;
    flag(phone,pErr,''); flag(email,eErr,'');
    var first=null;
    if(!name.value.trim()){ name.classList.add('bad'); err.textContent='Please add your name.'; err.hidden=false; first=name; }
    if(!pv&&!ev){
      err.textContent=first?'Please add your name, and a WhatsApp number or email (one is enough).':'Add a WhatsApp number or an email — one is enough, both is fine.';
      err.hidden=false; phone.classList.add('bad'); email.classList.add('bad'); first=first||phone;
    }
    if(pv&&!phoneOk(pv)){ flag(phone,pErr,'This number doesn’t look right. Please check it and enter the correct number.'); first=first||phone; }
    if(ev&&!emailOk(ev)){ flag(email,eErr,'This email doesn’t look right. Please check it and enter the correct email.'); first=first||email; }
    if(first){ first.focus(); return; }
    var contact=[pv&&'WhatsApp: '+pv, ev&&'Email: '+ev].filter(Boolean).join('\n');
    var text=['Hi PYRAXIS! I’d like to build my system.','',
      'Name: '+name.value.trim(),
      'Business type: '+form.elements.type.value,
      'Want help with: '+(form.elements.need.value.trim()||'—'),
      contact,'','(sent from: '+src+')'].join('\n');
    var url='https://wa.me/'+WA+'?text='+encodeURIComponent(text);
    /* show the confirmation first, keep the typed data until the next open */
    waLink.href=url;
    mailLink.href='mailto:thepyraxis@gmail.com?subject='+encodeURIComponent('Demo request')+'&body='+encodeURIComponent(text);
    form.hidden=true; $('#mTitle').hidden=true; $('.m-lede',modal).hidden=true;
    done.hidden=false; modal.setAttribute('aria-labelledby','mDoneT');
    doneT.focus();
    window.open(url,'_blank','noopener,noreferrer');
  });
  form.addEventListener('input',function(e){
    var t=e.target; if(t.classList) t.classList.remove('bad');
    if(t.name==='phone'||t.name==='email'){ var n=$(t.name==='phone'?'#phoneErr':'#emailErr'); if(n) n.hidden=true; }
  });
})();
/* UX/A11Y: links that open a new tab say so for screen-reader users (visually unchanged). */
(function(){
  Array.prototype.forEach.call(document.querySelectorAll('a[target="_blank"]'),function(a){
    if(a.getAttribute('aria-label')||a.querySelector('.sr-only')) return;
    var s=document.createElement('span'); s.className='sr-only'; s.textContent=' (opens in a new tab)'; a.appendChild(s);
  });
})();
