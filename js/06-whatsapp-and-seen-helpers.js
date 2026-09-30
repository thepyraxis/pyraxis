'use strict';
function makeWA(opts){
  var body=opts.body, log=opts.log, clock=opts.clock, token=0, lastDir=null;
  var TICK='<svg class="ticks" viewBox="0 0 18 12" aria-hidden="true"><path pathLength="1" d="M2.5 6.4l3 3 7-8"/><path pathLength="1" d="M8 9.2l1.1 1.1 7.2-8.2"/></svg>';
  function scroll(){ body.scrollTop=body.scrollHeight; }
  function life(m){
    var t=m.querySelector('.ticks');
    if(!t) return;
    setTimeout(function(){ t.classList.add('dbl'); },480);
    setTimeout(function(){ t.classList.add('read'); },1400);
  }
  function bubble(dir,text,time){
    var m=document.createElement('div');
    m.className='wa-msg '+dir+(dir===lastDir?' cont':'');
    lastDir=dir;
    m.innerHTML='<span class="wa-c"></span><span class="wa-meta"><span>'+time+'</span>'+(dir==='out'?TICK:'')+'</span>';
    m.querySelector('.wa-c').textContent=text;
    body.appendChild(m);
    raf2(function(){ m.classList.add('show'); });
    scroll();
    if(dir==='out') life(m);
    if(clock) clock.textContent=time;
    return m;
  }
  function card(html,time){
    var m=document.createElement('div');
    m.className='wa-msg out'+(lastDir==='out'?' cont':'');
    lastDir='out';
    m.innerHTML='<span class="wa-c"></span><span class="wa-meta"><span>'+time+'</span>'+TICK+'</span>';
    m.querySelector('.wa-c').innerHTML=html;
    body.appendChild(m);
    raf2(function(){ m.classList.add('show'); });
    scroll(); life(m);
    if(clock) clock.textContent=time;
    return m;
  }
  /* typing: header "typing…" + on-screen three-dot bubble on the side of the coming message */
  function typing(ms){
    var wa=body.closest('.wa');
    var st=wa?wa.querySelector('.wa-pres'):null;
    var orig=st?st.innerHTML:null;
    var tEl=null;
    if(!REDUCED && ms>0){
      tEl=document.createElement('div');
      tEl.className='wa-msg out wa-typing'+(lastDir==='out'?' cont':'');
      tEl.innerHTML='<span class="tdots" aria-hidden="true"><i></i><i></i><i></i></span>';
      body.appendChild(tEl);
      raf2(function(){ tEl.classList.add('show'); });
      scroll();
    }
    if(st){ st.textContent='typing\u2026'; st.classList.add('typing'); }
    return sleep(ms).then(function(){
      if(tEl){ tEl.classList.remove('show'); setTimeout(function(){ tEl.remove(); },220); }
      if(st){ if(orig!=null) st.innerHTML=orig; st.classList.remove('typing'); }
    });
  }
  function ev(text){
    if(!log) return sleep(200);
    var li=document.createElement('li');
    li.innerHTML='<svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg><span>'+text+'</span>';
    log.appendChild(li);
    raf2(function(){ li.classList.add('in'); });
    return sleep(280);
  }
  function ripple(btn,e){
    if(REDUCED) return;
    var r=document.createElement('span'); r.className='wa-ripple';
    var rc=btn.getBoundingClientRect();
    r.style.left=((e&&e.clientX)?e.clientX-rc.left:rc.width/2)+'px';
    r.style.top=((e&&e.clientY)?e.clientY-rc.top:rc.height/2)+'px';
    btn.appendChild(r);
    setTimeout(function(){ r.remove(); },700);
  }
  function pick(i,time){
    var btns=body.querySelectorAll('.wa-btn');
    var b=btns[i]; if(!b) return sleep(200);
    b.classList.add('used'); ripple(b,null);
    return sleep(600).then(function(){ bubble('in', b.textContent, time); });
  }
  var waitCancel=null;
  /* tap-to-pick (ported from Next.js DualPhone): arm the slot buttons as
     real controls and pause the chain until the visitor taps one */
  function waitPick(time,tok,picked){
    var btns=body.querySelectorAll('.wa-btn');
    if(!btns.length) return sleep(200);
    for(var i=0;i<btns.length;i++){ btns[i].removeAttribute('tabindex'); }
    return new Promise(function(resolve){
      function onTap(e){
        var t=e.target;
        while(t&&t!==body){ if(t.classList&&t.classList.contains('wa-btn')) break; t=t.parentNode; }
        if(!t||t===body||t.disabled) return;
        body.removeEventListener('click',onTap);
        waitCancel=null;
        t.classList.add('used');
        ripple(t,e);
        for(var j=0;j<btns.length;j++){ btns[j].disabled=true; if(btns[j]!==t) btns[j].style.opacity='.45'; }
        var m=/(\d{2}:\d{2})/.exec(t.textContent||'');
        if(m&&picked) picked.slot=m[1];
        bubble('in',t.textContent,time);
        sleep(600).then(function(){ if(tok===token) resolve(); });
      }
      waitCancel=function(){ body.removeEventListener('click',onTap); };
      body.addEventListener('click',onTap);
    });
  }
  function reset(){
    lastDir=null;
    if(waitCancel){ waitCancel(); waitCancel=null; }
    body.innerHTML='<div class="wa-sys"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>Messages are end-to-end encrypted.</span></div>'+
      '<div class="wa-date">'+(opts.date||'TODAY')+'</div>';
    if(log) log.innerHTML='';
  }
  function finish(){
    if(opts.onDone) opts.onDone();
  }
  function play(){
    var tok=++token;
    reset();
    if(REDUCED){
      opts.steps.forEach(function(s){
        if(s.m) bubble(s.m[0],s.m[1],s.m[2]);
        else if(s.ai) bubble('out',typeof s.ai==='function'?s.ai():s.ai,s.time||'');
        else if(s.card) card(s.card,s.time||'');
        else if(s.pick!==undefined) pick(s.pick,s.time||'');
        else if(s.waitPick) return waitPick(s.time||'',tok,opts.picked);
        else if(s.confirm&&opts.confirm) card(opts.confirm(s.time||''),s.time||'');
        else if(s.ev) return ev(typeof s.ev==='function'?s.ev():s.ev);
        else if(s.done) finish();
      });
      return;
    }
    var chain=Promise.resolve();
    opts.steps.forEach(function(s){
      chain=chain.then(function(){
        return sleep(s.t||0).then(function(){
          if(tok!==token) return;
          if(s.m) bubble(s.m[0],s.m[1],s.m[2]);
          else if(s.ai) return typing(s.typing||700).then(function(){ if(tok===token) bubble('out',typeof s.ai==='function'?s.ai():s.ai,s.time||''); });
          else if(s.card) card(s.card,s.time||'');
          else if(s.pick!==undefined) return pick(s.pick,s.time||'');
          else if(s.waitPick) return waitPick(s.time||'',tok,opts.picked);
          else if(s.confirm&&opts.confirm) card(opts.confirm(s.time||''),s.time||'');
          else if(s.ev) return ev(typeof s.ev==='function'?s.ev():s.ev);
          else if(s.done) finish();
        });
      });
    });
  }
  return { play: play };
}

function startOnSeen(el, play){
  if(!('IntersectionObserver' in window)){ play(); return; }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ io.disconnect(); setTimeout(play,350); } });
  },{threshold:.3});
  io.observe(el);
}

/* ---------- hero chat ---------- */
