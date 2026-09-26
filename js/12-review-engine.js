'use strict';
(function(){
  var rev=$('#rev'); if(!rev) return;
  var body=$('#revBody'), visEl=$('#revSysVis'), logEl=$('#revLog'),
      titleEl=$('#revSysTitle'), steps=$$('#revSteps li'), prog=$('#revProg'),
      s4=$('#revS4'), s5=$('#revS5');
  var endFive=$('.rev-end[data-end=five]'), endTwo=$('.rev-end[data-end=two]'),
      replayBtn=$('#revReplay');
  if(!body||!visEl) return;

  var TICK='<svg class="ticks" viewBox="0 0 18 12" aria-hidden="true"><path d="M2.5 6.4l3 3 7-8"/><path d="M8 9.2l1.1 1.1 7.2-8.2"/></svg>';
  var PSTAR='<span class="pstar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z"/></svg></span>';
  var SR5=PSTAR+PSTAR+PSTAR+PSTAR+PSTAR;
  var CHECK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.5l5 5L19.5 7"/></svg>';
  var GREVIEW='The garden at dusk, the sea bass, the candle they remembered for our anniversary — this is our new regular spot.';

  var timeouts=[], typer=null, curT=0, current='five', lastDir=null, stEl=null, stOrig=null;
  /* beat start times per ending (cumulative setStep times): step buttons
     jump the timeline here, so any beat works on first click */
  var BEATS={five:[400,4100,7500,13400,17700],two:[400,4100,7000,13100,17900]};

  function clearAll(){
    for(var i=0;i<timeouts.length;i++){ var t=timeouts[i]; clearTimeout(t&&t.id!==undefined?t.id:t); }
    timeouts=[];
    if(typer){ clearInterval(typer); typer=null; }
  }
  function setStep(n){
    steps.forEach(function(s,i){ s.classList.toggle('on', i<=n); });
    if(prog) prog.style.width=(n<=0?0:(n/(steps.length-1))*80)+'%';
  }
  function logAdd(text){
    if(!logEl) return;
    var li=document.createElement('li');
    li.innerHTML='<svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg><span>'+text+'</span>';
    logEl.appendChild(li);
    raf2(function(){ li.classList.add('in'); });
  }
  function vis(html){ visEl.innerHTML=html; }
  function titleSet(t){ if(titleEl) titleEl.textContent=t; }

  function scroll(){ body.scrollTop=body.scrollHeight; }
  function addMsg(dir,html,time){
    var m=document.createElement('div');
    m.className='wa-msg '+dir+(dir===lastDir?' cont':'');
    lastDir=dir;
    m.innerHTML='<span class="wa-c"></span><span class="wa-meta"><span>'+time+'</span>'+(dir==='out'?TICK:'')+'</span>';
    m.querySelector('.wa-c').innerHTML=html;
    body.appendChild(m);
    raf2(function(){ m.classList.add('show'); scroll(); });
    if(dir==='out'){
      var t=m.querySelector('.ticks');
      if(t){ setTimeout(function(){ t.classList.add('dbl'); },500);
             setTimeout(function(){ t.classList.add('read'); },1500); }
    }
    return m;
  }
  function typeStart(){
    if(REDUCED) return;
    var wa=body.closest('.wa');
    stEl=wa?wa.querySelector('.wa-pres'):null;
    if(stEl){ stOrig=stEl.innerHTML; stEl.textContent='typing\u2026'; }
  }
  function typeEnd(){
    if(stEl&&stOrig!=null){ stEl.innerHTML=stOrig; }
    stEl=null; stOrig=null;
  }

  function askVis(){
    return '<div class="vis-ask">'+
      '<span class="vis-chip"><svg class="ic"><use href="#i-receipt"/></svg>VISIT ENDS</span>'+
      '<span class="vis-arr">→</span>'+
      '<span class="vis-chip key"><svg class="ic"><use href="#i-chat"/></svg>PYRAXIS ASKS</span>'+
      '</div>';
  }
  function bigStarsVis(){
    return '<div class="vis-bstars" id="revBigStars">'+SR5+'</div><p class="vis-score" id="revScore"></p>';
  }
  function routeVis(mode){
    var lit = mode==='pub' ? 5 : 2, i, stars='';
    for(i=0;i<5;i++){
      stars+='<path class="rstar'+(i<lit?' lit':'')+'" style="--i:'+i+'" '+
        'd="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" '+
        'transform="translate('+(62+i*13-6)+',136) scale(.5)"/>';
    }
    var TRK='M132 150 L184 150';
    var TOP='M208 144 C258 118 288 72 350 72';
    var BOT='M208 156 C258 182 288 228 350 228';
    return '<svg class="route-svg '+mode+'" viewBox="0 0 520 300" aria-hidden="true">'+
      '<defs><linearGradient id="rgFlow" x1="0" y1="0" x2="1" y2="0">'+
      '<stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#a78bff"/></linearGradient></defs>'+
      '<circle class="rn-halo" cx="88" cy="150" r="52"/>'+
      '<circle class="rn-fill" cx="88" cy="150" r="44"/>'+ stars +
      '<text class="rn-cap" x="88" y="212" text-anchor="middle">SHE RATED</text>'+
      '<text class="rn-score" x="88" y="226" text-anchor="middle">'+lit+' / 5</text>'+
      '<circle class="rj-pulse" cx="196" cy="150" r="9"/>'+
      '<circle class="rj-pulse d2" cx="196" cy="150" r="9"/>'+
      '<rect class="rj-core" x="190" y="144" width="12" height="12" transform="rotate(45 196 150)"/>'+
      '<text class="rn-cap" x="196" y="182" text-anchor="middle">PYRAXIS</text>'+
      '<path class="rt-base" d="'+TRK+'"/>'+
      '<path class="rt-trunk" d="'+TRK+'"/>'+
      '<circle class="pkt pkt-tr" r="3" fill="#a78bff"><animateMotion dur="1.1s" repeatCount="indefinite" path="'+TRK+'"/></circle>'+
      '<path class="rt-base rt-base-top" d="'+TOP+'"/>'+
      '<path class="rt-base rt-base-bot" d="'+BOT+'"/>'+
      '<path class="rt-glow rt-glow-top" d="'+TOP+'"/>'+
      '<path class="rt-glow rt-glow-bot" d="'+BOT+'"/>'+
      '<path class="rt-flow rt-flow-top" d="'+TOP+'"/>'+
      '<path class="rt-flow rt-flow-bot" d="'+BOT+'"/>'+
      '<polygon class="rarr rarr-top" points="348,66 361,72 348,78"/>'+
      '<polygon class="rarr rarr-bot" points="348,222 361,228 348,234"/>'+
      '<g class="rgate rgate-top"><rect x="228" y="87" width="94" height="22" rx="11"/><text x="275" y="102" text-anchor="middle">ALWAYS OFFERED</text></g>'+
      '<g class="rgate rgate-bot"><rect x="228" y="191" width="94" height="22" rx="11"/><text x="275" y="206" text-anchor="middle">WHEN NEEDED</text></g>'+
      '<circle class="pkt pkt-top" r="4" fill="#a78bff"><animateMotion dur="1.5s" repeatCount="indefinite" path="'+TOP+'"/></circle>'+
      '<circle class="pkt pkt-top" r="2.6" opacity=".45" fill="#a78bff"><animateMotion dur="1.5s" begin="-0.28s" repeatCount="indefinite" path="'+TOP+'"/></circle>'+
      '<circle class="pkt pkt-bot" r="4" fill="#a78bff"><animateMotion dur="1.5s" repeatCount="indefinite" path="'+BOT+'"/></circle>'+
      '<circle class="pkt pkt-bot" r="2.6" opacity=".45" fill="#a78bff"><animateMotion dur="1.5s" begin="-0.28s" repeatCount="indefinite" path="'+BOT+'"/></circle>'+
      '<g class="rcard rcard-t">'+
        '<rect class="rcard-box" x="356" y="30" width="152" height="84" rx="12"/>'+
        '<circle class="rcard-icr" cx="432" cy="56" r="14"/>'+
        '<g class="rcard-ic" transform="translate(432,56)"><path d="M-8 0C-5-4.7-2.5-6.2 0-6.2S5-4.7 8 0C5 4.7 2.5 6.2 0 6.2S-5 4.7-8 0z"/><circle r="2.7"/></g>'+
        '<text class="rcard-tt" x="432" y="82" text-anchor="middle">PUBLIC REVIEW</text>'+
        '<text class="rcard-ts" x="432" y="95" text-anchor="middle">offered to everyone</text>'+
        '<text class="rcard-tf" x="432" y="107" text-anchor="middle">\u2192 NEW CUSTOMERS</text>'+
      '</g>'+
      '<g class="rcard rcard-b">'+
        '<rect class="rcard-box" x="356" y="188" width="152" height="84" rx="12"/>'+
        '<circle class="rcard-icr" cx="432" cy="214" r="14"/>'+
        '<g class="rcard-ic" transform="translate(432,214)"><rect x="-5.5" y="-1" width="11" height="9.5" rx="2"/><path d="M-3.2 -1v-2.4a3.2 3.2 0 0 1 6.4 0v2.4"/></g>'+
        '<text class="rcard-tt" x="432" y="240" text-anchor="middle">PRIVATE FEEDBACK</text>'+
        '<text class="rcard-ts" x="432" y="253" text-anchor="middle">if something went wrong</text>'+
        '<text class="rcard-tf" x="432" y="265" text-anchor="middle">\u2192 SHE COMES BACK</text>'+
      '</g>'+
      '</svg>';
  }
  function chip(icon,label){
    return '<span class="cyc-chip"><svg class="ic"><use href="#'+icon+'"/></svg>'+label+'</span>';
  }
  var ARR='<span class="vis-arr">→</span>';
  function loopVis(kind){
    var h = kind==='five'
      ? chip('i-star','PUBLIC REVIEW')+ARR+chip('i-eye','TRUST')+ARR+chip('i-user','NEW CUSTOMER')
      : chip('i-wrench','FIXED')+ARR+chip('i-bell','WIN-BACK')+ARR+chip('i-loop','SHE RETURNS');
    var note = kind==='five' ? '+1 REVIEW · 34 THIS MONTH' : 'HER NEXT VISIT · RATED FIVE STARS';
    return '<div class="vis-cyc">'+h+'</div><p class="vis-note">'+note+'</p>';
  }
  function googleVis(){
    return '<div class="g-card vis-in">'+
      '<div class="g-head"><span class="g-logo">G</span>'+
      '<div class="g-biz"><strong>Terra Garden</strong><span class="g-stars">★★★★★</span></div>'+
      '<span class="g-count">Google review</span></div>'+
      '<p class="g-text"><span id="gTw"></span><span class="g-caret"></span></p>'+
      '<div class="g-foot"><span class="g-av">S</span><span>Sara K. · just now</span>'+
      '<span class="g-posted">via her PYRAXIS link</span></div>'+
      '</div>';
  }
  function ownerVis(){
    return '<div class="p-card vis-in">'+
      '<span class="p-tag">PRIVATE ALERT · 2★ · SATURDAY</span>'+
      '<p>Sara left private feedback — visible to you alone:</p>'+
      '<p class="p-quote">"The service took a little long."</p>'+
      '<div class="p-stamps">'+
      '<span class="p-stamp" id="ost1">'+CHECK+'ASSIGNED · FLOOR MANAGER</span>'+
      '<span class="p-stamp" id="ost2">'+CHECK+'RESOLVED · WITHIN 2 HOURS</span>'+
      '</div></div>';
  }
  function typewrite(el,text){
    if(!el) return;
    if(REDUCED||!text){ el.textContent=text; return; }
    if(typer) clearInterval(typer);
    var i=0;
    typer=setInterval(function(){
      i++; el.textContent=text.slice(0,i);
      if(i>=text.length){
        clearInterval(typer); typer=null;
        var c=el.parentNode.querySelector('.g-caret'); if(c) c.remove();
      }
    },24);
  }
  function fillStars(box,n,stagger){
    if(!box) return;
    for(var i=0;i<n && i<box.children.length;i++){
      (function(k){
        setTimeout(function(){ k.classList.add('lit'); }, curT+300+i*stagger);
      })(box.children[i]);
    }
  }
  function scoreSet(txt){ var s=$('#revScore'); if(s) s.textContent=txt; }

  function reset(){
    clearAll();
    lastDir=null; stEl=null; stOrig=null;
    endFive.classList.remove('pulse'); endTwo.classList.remove('pulse');
    body.innerHTML='<div class="wa-sys"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>Messages are end-to-end encrypted.</span></div><div class="wa-date">TODAY · 21:14</div>';
    vis(''); if(logEl) logEl.innerHTML='';
    titleSet(''); setStep(-1);
  }

  var ASK='<p>Thanks for coming in, Sara. How was dinner?</p><div class="wa-rate-stars" id="revPhoneStars">'+SR5+'</div>';
  var SHARE='<div class="wa-btns"><button class="wa-btn" id="revShareBtn" type="button" tabindex="-1">SHARE ON GOOGLE</button></div>';
  var SHARE_ANY='<div class="wa-btns"><button class="wa-btn" type="button" tabindex="-1">SHARE AN HONEST REVIEW</button></div>';

  function play(which,fromBeat){
    current=which;
    endFive.classList.toggle('on', which==='five');
    endTwo.classList.toggle('on', which==='two');
    if(s4) s4.textContent = which==='five' ? 'THE SHARE' : 'THE FIX';
    if(s5) s5.textContent = which==='five' ? 'THE LOOP' : 'THE WIN-BACK';
    reset();
    if(typer){ clearInterval(typer); typer=null; }
    var t=0, skipFrom=0;
    var known=BEATS[which];
    if(fromBeat>0&&known&&known[fromBeat]!=null) skipFrom=known[fromBeat];
    function at(dt,fn){
      t+=dt;
      var when=t;
      if(REDUCED){ curT=when; fn(); return; }
      if(when<=skipFrom){ curT=when; fn(); return; }
      timeouts.push({id:setTimeout(function(){ curT=when; fn(); },when),when:when});
    }
    function done(){
      var other = which==='five' ? endTwo : endFive;
      if(other) other.classList.add('pulse');
    }
    if(which==='five'){ playFive(at,done); } else { playTwo(at,done); }
  }

  function playFive(at,done){
    at(400, function(){ setStep(0);
      titleSet('Dinner ends. The ask goes out — by itself.');
      vis(askVis()); logAdd('DINNER ENDED · TABLE 12 · SAT 21:14'); });
    at(700, typeStart);
    at(1000, function(){ typeEnd(); addMsg('in', ASK, '21:14'); });
    at(600, function(){ logAdd('FEEDBACK REQUEST SENT · WHATSAPP'); });
    at(1400, function(){ setStep(1);
      titleSet('One tap — that\u2019s the whole survey.');
      vis(bigStarsVis());
      fillStars($('#revBigStars'),5,190);
      fillStars($('#revPhoneStars'),5,190); });
    at(1400, function(){ scoreSet('5 / 5'); });
    at(700, function(){ logAdd('RATING RECEIVED · 5 / 5'); });
    at(1300, function(){ setStep(2);
      titleSet('The public path lights up — it always was open.');
      vis(routeVis('pub')); });
    at(900, typeStart);
    at(1200, function(){ typeEnd(); addMsg('in','<p>That\u2019s wonderful to hear. Would you share it with others?</p>','21:16'); });
    at(800, function(){ addMsg('in', SHARE, '21:16'); });
    at(1400, function(){ var b=$('#revShareBtn'); if(b) b.classList.add('used'); });
    at(600, function(){ logAdd('REVIEW LINK OPENED · GOOGLE'); });
    at(1000, function(){ setStep(3);
      titleSet('One tap later — a public, genuine review.');
      vis(googleVis()); typewrite($('#gTw'), GREVIEW); });
    at(3400, function(){ logAdd('REVIEW POSTED · PUBLIC'); });
    at(900, function(){ setStep(4);
      titleSet('Proof that brings the next customer.');
      vis(loopVis('five')); });
    at(700, typeStart);
    at(900, function(){ typeEnd(); addMsg('in','<p>Thank you, Sara — see you at the garden.</p>','21:18'); });
    at(900, function(){ logAdd('PUBLIC REVIEWS THIS MONTH · 34'); });
    at(500, done);
  }

  function playTwo(at,done){
    at(400, function(){ setStep(0);
      titleSet('Dinner ends. The ask goes out — by itself.');
      vis(askVis()); logAdd('DINNER ENDED · TABLE 12 · SAT 21:14'); });
    at(700, typeStart);
    at(1000, function(){ typeEnd(); addMsg('in', ASK, '21:14'); });
    at(600, function(){ logAdd('FEEDBACK REQUEST SENT · WHATSAPP'); });
    at(1400, function(){ setStep(1);
      titleSet('Not every night is a five.');
      vis(bigStarsVis());
      fillStars($('#revBigStars'),2,260);
      fillStars($('#revPhoneStars'),2,260); });
    at(1200, function(){ scoreSet('2 / 5'); });
    at(600, function(){ logAdd('RATING RECEIVED · 2 / 5'); });
    at(1100, function(){ setStep(2);
      titleSet('The public path stays open — and a private one opens.');
      vis(routeVis('priv')); });
    at(800, typeStart);
    at(1100, function(){ typeEnd(); addMsg('in','<p>We\u2019re sorry we fell short. What went wrong? This goes only to the owner — so it can be fixed.</p>','21:16'); });
    at(1300, function(){ addMsg('out','<p>The service took a little long.</p>','21:17'); });
    at(900, function(){ logAdd('PRIVATE FEEDBACK RECEIVED · OWNER ONLY'); });
    at(1100, function(){ addMsg('in','<p>And whenever you\u2019re ready, an honest public review is welcome too — good or bad.</p>'+SHARE_ANY,'21:18'); });
    at(900, function(){ logAdd('REVIEW LINK OFFERED · SAME FOR EVERY CUSTOMER'); });
    at(1000, function(){ setStep(3);
      titleSet('The owner gets it — while it still matters.');
      vis(ownerVis()); });
    at(1000, function(){ var s=$('#ost1'); if(s) s.classList.add('in'); });
    at(1200, function(){ var s=$('#ost2'); if(s) s.classList.add('in'); });
    at(800, function(){ logAdd('ISSUE ASSIGNED · FLOOR MANAGER'); });
    at(600, function(){ logAdd('RESOLVED · WITHIN 2 HOURS'); });
    at(1200, function(){ setStep(4);
      titleSet('Then — a second chance.');
      vis(loopVis('two')); });
    at(800, typeStart);
    at(1100, function(){ typeEnd(); addMsg('in','<p>We heard you — we\u2019ve added a second server for Saturday evenings. Your next visit is 20% off, to make it right?</p>','21:20'); });
    at(1600, function(){ addMsg('out','<p>…alright. Saturday.</p>','21:21'); });
    at(700, function(){ logAdd('WIN-BACK SENT · 20% CODE · TRACKED'); });
    at(500, function(){ logAdd('SHE REBOOKED · SATURDAY 19:30'); });
    at(500, function(){ logAdd('NEXT VISIT · RATED FIVE STARS'); });
    at(400, done);
  }

  if(endFive) endFive.addEventListener('click', function(){ play('five'); });
  if(endTwo) endTwo.addEventListener('click', function(){ play('two'); });
  if(replayBtn) replayBtn.addEventListener('click', function(){ play(current); });
  var stepsOl=$('#revSteps');
  if(stepsOl) stepsOl.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button[data-beat]'):null;
    if(!b) return;
    play(current,+b.getAttribute('data-beat'));
  });

  addTicker(rev, function(now){
    var chips=visEl.querySelectorAll('.cyc-chip');
    if(!chips.length) return;
    var idx=Math.floor(now/1300)%chips.length;
    for(var i=0;i<chips.length;i++) chips[i].classList.toggle('on', i===idx);
  });

  startOnSeen(rev, function(){ play('five'); });
})();

/* ---------- 08 · follow-up timeline ---------- */
