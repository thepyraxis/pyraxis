'use strict';
(function(){
  var modal=$('#modal'); if(!modal) return;
  var form=$('#leadForm'), err=$('#fErr'), mForm=$('#mForm'), mDone=$('#mDone'), mChoice=$('#mChoice');
  var chWa=$('#chWa'), chMail=$('#chMail'), chBack=$('#chBack'), mailNote=$('#mailNote'), doneChannel=$('#doneChannel');
  var consent=$('#leadConsent');
  /* Receiving inbox for the Email channel — set this to switch email on.
     Until then only WhatsApp is offered, so nothing ever dead-ends. */
  var LEAD_TO_EMAIL="thepyaxis@gmail.com";
  var pendingMsg="";
  var lastFocus=null;
  var DRAFT_KEY='pyraxis-lead-draft';
  /* Half-filled forms survive crashes, reloads and accidental closes:
     every keystroke is mirrored to sessionStorage (same tab only). */
  function isDirty(){
    if(!form) return false;
    var names=['name','need','phone','email'], i, el;
    for(i=0;i<names.length;i++){ el=form.elements[names[i]]; if(el&&el.value&&el.value.trim()) return true; }
    el=form.elements.type;
    return !!(el&&el.selectedIndex>0);
  }
  function saveDraft(){
    if(!form) return;
    try{
      sessionStorage.setItem(DRAFT_KEY,JSON.stringify({
        name:form.elements.name.value, type:form.elements.type.value,
        need:form.elements.need.value, phone:form.elements.phone.value,
        email:form.elements.email.value
      }));
    }catch(e){}
  }
  function readDraft(){
    try{ return JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null'); }catch(e){ return null; }
  }
  function draftHasData(d){
    return !!(d&&((d.name||'')+(d.need||'')+(d.phone||'')+(d.email||'')).trim());
  }
  function clearDraft(){ try{ sessionStorage.removeItem(DRAFT_KEY); }catch(e){} }
  function open(fromRestore){
    lastFocus=document.activeElement;
    if(mForm) mForm.hidden=false;
    if(mDone) mDone.hidden=true;
    if(mChoice) mChoice.hidden=true;
    var mailOn=LEAD_TO_EMAIL&&LEAD_TO_EMAIL.indexOf('@')>-1;
    if(chMail) chMail.disabled=!mailOn;
    if(mailNote) mailNote.hidden=!!mailOn;
    if(err) err.hidden=true;
    $$('.bad',form).forEach(function(i){ i.classList.remove('bad'); });
    if(consent){ consent.checked=false; consent.classList.remove('bad'); }
    modal.hidden=false;
    document.body.style.overflow='hidden';  /* background must not scroll under the form on mobile */
    if(form){
      var d=readDraft();
      if(draftHasData(d)){
        try{
          if(form.elements.name) form.elements.name.value=d.name||'';
          if(form.elements.type&&d.type) form.elements.type.value=d.type;
          if(form.elements.need) form.elements.need.value=d.need||'';
          if(form.elements.phone) form.elements.phone.value=d.phone||'';
          if(form.elements.email) form.elements.email.value=d.email||'';
        }catch(e){}
      }else{ try{ form.reset(); }catch(e){} }
      if(!fromRestore){
        var first=$('input,select',form);
        if(first) setTimeout(function(){ first.focus(); },60);
      }
    }
  }
  function close(){
    saveDraft();
    modal.hidden=true;
    document.body.style.overflow='';
    if(lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus();
  }
  if(form) form.addEventListener('input',saveDraft);
  modal.addEventListener('click',function(e){
    var t=e.target;
    while(t && t!==modal){
      if(t.getAttribute && t.getAttribute('data-close-modal')!==null){
        /* a stray backdrop tap must never nuke a half-filled form —
           the X button and Escape still close explicitly */
        if(t.classList&&t.classList.contains('modal-back')&&isDirty()){ saveDraft(); return; }
        close(); return;
      }
      t=t.parentNode;
    }
  });
  $$('[data-open-modal]').forEach(function(b){
    b.addEventListener('click',function(){
      var m=$('#mnav');
      if(m && m.classList.contains('open')){ m.classList.remove('open'); document.body.style.overflow=''; }
      open();
    });
  });
  document.addEventListener('keydown',function(e){
    if(modal.hidden) return;
    if(e.key==='Escape'){ close(); return; }
    if(e.key==='Tab'){
      var f=$$('button,input,select,a[href]',modal).filter(function(x){ return !x.disabled && x.offsetParent!==null; });
      if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement===last){ first.focus(); e.preventDefault(); }
    }
  });
  if(form) form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.elements.name, phone=form.elements.phone, email=form.elements.email, bad=null;
    if(!name.value.trim()) bad=name;
    name.classList.remove('bad');
    [phone,email].forEach(function(i){ i.classList.remove('bad'); i.classList.remove('warn'); });
    if(consent) consent.parentNode.classList.remove('bad');
    var phoneWarn=$('#phoneWarn'), emailWarn=$('#emailWarn');
    if(phoneWarn) phoneWarn.hidden=true;
    if(emailWarn) emailWarn.hidden=true;
    if(err) err.hidden=true;
    if(bad){
      bad.classList.add('bad');
      if(err){ err.textContent='Please add your name.'; err.hidden=false; }
      bad.focus(); return;
    }
    /* Fill either, or both — but at least one has to be valid. */
    function phoneOk(v){ var d=v.replace(/\D/g,''); return d.length>=7&&d.length<=15; }
    function emailOk(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
    var pval=phone.value.trim(), emval=email.value.trim();
    var pBad=pval&&!phoneOk(pval), eBad=emval&&!emailOk(emval);
    var contactStr=[pval&&!pBad?pval:null, emval&&!eBad?emval:null].filter(Boolean).join(" / ");
    if(!contactStr){
      if(!pval&&!emval){
        if(err){ err.textContent='Add your mobile number or your email — either works.'; err.hidden=false; }
        phone.classList.add('bad'); email.classList.add('bad');
        phone.focus(); return;
      }
      /* something typed, nothing valid — hard block, red on the wrong field(s) */
      if(pBad) phone.classList.add('bad');
      if(eBad) email.classList.add('bad');
      if(err){ err.textContent='That '+(pBad&&eBad?'number and email don’t':pBad?'number doesn’t':'email doesn’t')+' look right — check and try again.'; err.hidden=false; }
      (pBad?phone:email).focus(); return;
    }
    /* one side valid, the other wrong — amber warn on the wrong side, still sendable */
    if(pBad){ phone.classList.add('warn'); if(phoneWarn){ phoneWarn.textContent='That number looks wrong — we’ll use your email.'; phoneWarn.hidden=false; } }
    if(eBad){ email.classList.add('warn'); if(emailWarn){ emailWarn.textContent='That email looks wrong — we’ll use your number.'; emailWarn.hidden=false; } }
    if(consent && !consent.checked){
      consent.parentNode.classList.add('bad');
      if(err){ err.textContent='Please tick the consent box so we can get back to you.'; err.hidden=false; }
      consent.focus(); return;
    }
    /* Validated — hand the visitor the choice instead of forcing a redirect.
       Each channel opens on THEIR device; they press send there. */
    var payload={
      name:name.value.trim(),
      Business:form.elements.type.value,
      Need:(form.elements.need.value.trim()||"—"),
      Contact:contactStr,
      Page:location.href
    };
    pendingMsg=["Growth system request (from pyraxis site)",
      "Name: "+payload.name,
      "Business: "+payload.Business,
      "Fix first: "+payload.Need,
      "Contact: "+payload.Contact].join("\n");
    if(mForm) mForm.hidden=true;
    if(mDone) mDone.hidden=true;
    if(mChoice){ mChoice.hidden=false; var fb=mChoice.querySelector('button'); if(fb) fb.focus(); }
  });
  if(chBack) chBack.addEventListener('click',function(){
    if(mChoice) mChoice.hidden=true;
    if(mDone) mDone.hidden=true;
    if(mForm) mForm.hidden=false;
  });
  function showDone(channel){
    clearDraft();    if(mChoice) mChoice.hidden=true;
    if(mForm) mForm.hidden=true;
    if(doneChannel) doneChannel.textContent=channel;
    if(mDone){ mDone.hidden=false; var b=mDone.querySelector('button'); if(b) b.focus(); }
  }
  if(chWa) chWa.addEventListener('click',function(){
    window.open("https://wa.me/919837104413?text="+encodeURIComponent(pendingMsg),"_blank","noopener,noreferrer");
    showDone('WhatsApp');
    toast('WhatsApp opened — press send there and we will reach you quickly.');
  });
  if(chMail) chMail.addEventListener('click',function(){
    if(!(LEAD_TO_EMAIL&&LEAD_TO_EMAIL.indexOf('@')>-1)) return;
    var sub="New PYRAXIS request — "+(form.elements.name.value.trim()||"website");
    window.location.href="mailto:"+LEAD_TO_EMAIL+"?subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(pendingMsg);
    showDone('your mail app');
    toast('Your mail app opened — press send there and we will reach you quickly.');
  });
  /* reloaded / crashed mid-fill? put the visitor straight back into the
     form with their draft — never strand them on the main menu */
  try{
    if(draftHasData(readDraft())) setTimeout(function(){ open(true); },600);
  }catch(e){}
})();
