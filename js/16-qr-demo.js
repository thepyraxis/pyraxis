'use strict';
(function(){
  var qv=$('#qView'); if(!qv) return;
  var tent=$('#qrTent'), log=$('#qrLog'), grid=$('#qrGrid');
  var seed=1234567;
  function rnd(){ seed^=seed<<13; seed^=(seed>>>17); seed^=seed<<5; return ((seed>>>0)%1000)/1000; }
  var N=21, c=100/N, M=[], x, y;
  function inF(px,py){ return (px<7&&py<7)||(px>N-8&&py<7)||(px<7&&py>N-8); }
  for(y=0;y<N;y++){ M[y]=[]; for(x=0;x<N;x++) M[y][x]=inF(x,y)?0:(rnd()>0.52?1:0); }
  function put(x0,y0){
    for(y=0;y<7;y++) for(x=0;x<7;x++)
      M[y0+y][x0+x]=(x===0||x===6||y===0||y===6||(x>=2&&x<=4&&y>=2&&y<=4))?1:0;
  }
  put(0,0); put(N-7,0); put(0,N-7);
  var d='';
  for(y=0;y<N;y++) for(x=0;x<N;x++) if(M[y][x]) d+='M'+(x*c).toFixed(2)+' '+(y*c).toFixed(2)+'h'+c.toFixed(2)+'v'+c.toFixed(2)+'h-'+c.toFixed(2)+'z';
  var qrSVG='<svg viewBox="0 0 100 100" aria-hidden="true" style="width:100%;height:auto"><path d="'+d+'" fill="currentColor"/></svg>';
  var tq=$('#tentQR'); if(tq) tq.innerHTML=qrSVG;

  var started=false;
  function pushLog(text){
    if(!log) return;
    var li=document.createElement('li');
    li.innerHTML='<svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg><span>'+text+'</span>';
    log.appendChild(li);
    raf2(function(){ li.classList.add('in'); });
  }
  var OPTS=[
    {k:'order',ic:'i-fork',l:'ORDER'},
    {k:'reserve',ic:'i-cal',l:'RESERVE A TABLE'},
    {k:'pay',ic:'i-card',l:'PAY THE BILL'},
    {k:'special',ic:'i-spark',l:'SPECIAL REQUEST'},
    {k:'offer',ic:'i-tag',l:'GET THE OFFER',key:1}
  ];
  var FLOWS={
    order:{h:'ORDER',s:'What can we bring to table 12?',
      o:[{l:'Garden salad',r:'₹320'},{l:'Sea bass',r:'₹890',key:1},{l:'Chocolate fondant',r:'₹420'}],
      d:['Order #247 sent to the kitchen','Saved to table 12 · guest profile'],tag:'ORDER RECORDED · GUEST IDENTIFIED'},
    reserve:{h:'RESERVE',s:'Which evening shall we hold?',
      o:[{l:'Tonight · 19:30'},{l:'Tomorrow · 19:00',key:1},{l:'Saturday · 18:30'}],
      d:['Garden table held for two','Confirmation sent on WhatsApp'],tag:'RESERVATION CREATED'},
    pay:{h:'PAY',bill:[['TABLE 12 · TWO GUESTS',''],['SEA BASS','₹890'],['GARDEN SALAD','₹320'],['FONDANT + WINE','₹2,990'],['TOTAL','₹4,200']],
      o:[{l:'SEND PAYMENT LINK',key:1}],
      d:['Payment link sent to WhatsApp','Bill settles the moment she pays'],tag:'PAYMENT LINK SENT'},
    special:{h:'SPECIAL REQUEST',s:'Anything we should know?',
      o:[{l:"IT'S A BIRTHDAY",key:1},{l:'A QUIET TABLE, PLEASE'}],
      d:['The team has been told','A candle may appear'],tag:'SPECIAL REQUEST LOGGED'},
    offer:{h:'YOUR OFFER',s:'Dessert on the house — where should we send it?',
      o:[{l:'SEND TO MY WHATSAPP',key:1}],
      d:['Offer sent — show it to your waiter','A customer profile was quietly created'],tag:'OFFER DELIVERED · PROFILE CREATED'}
  };
  var cur=null, locked=false;
  function vScan(){
    qv.innerHTML='<div class="q-scan"><span style="display:block;width:104px;height:104px;color:#7a776e">'+qrSVG+'</span><p>SCANNING TABLE 12…</p></div>';
  }
  function vWelcome(){
    locked=false;
    qv.innerHTML='<p class="q-hello">Welcome to<br>Terra Garden</p><p class="q-sub">What would you like to do?</p>'+
      OPTS.map(function(o){ return '<button class="q-opt'+(o.key?' key':'')+'" type="button" data-k="'+o.k+'"><svg class="ic"><use href="#'+o.ic+'"/></svg><span>'+o.l+'</span><i>→</i></button>'; }).join('');
  }
  function vFlow(k){
    cur=FLOWS[k]; locked=false;
    var html='<div class="q-flow"><button class="q-back" type="button">← back to menu</button><h4>'+cur.h+'</h4><p class="q-sub">'+cur.s+'</p>';
    if(cur.bill) html+='<div class="q-bill">'+cur.bill.map(function(r,i){
      return '<div'+(i===cur.bill.length-1?' class="tt"':'')+'><span>'+r[0]+'</span><span>'+r[1]+'</span></div>';
    }).join('')+'</div>';
    html+='<div class="q-opts">'+cur.o.map(function(o){
      return '<button class="q-item'+(o.key?' key':'')+'" type="button"><span>'+o.l+'</span>'+(o.r?'<b class="r">'+o.r+'</b>':'')+'</button>';
    }).join('')+'</div><div class="q-done" id="qDone"></div></div>';
    qv.innerHTML=html;
  }
  function choose(item){
    if(locked) return; locked=true;
    item.classList.add('sel');
    var done=$('#qDone'); if(!done) return;
    cur.d.forEach(function(line,i){
      setTimeout(function(){
        var div=document.createElement('div');
        div.innerHTML='<svg class="ic"><use href="#i-check"/></svg><span>'+line+'</span>';
        done.appendChild(div);
        raf2(function(){ div.classList.add('in'); });
        if(i===cur.d.length-1) pushLog(cur.tag);
      }, 380+i*420);
    });
  }
  qv.addEventListener('click',function(e){
    var t=e.target;
    while(t && t!==qv){
      if(t.classList && t.classList.contains('q-back')){ vWelcome(); return; }
      if(t.classList && t.classList.contains('q-opt')){ vFlow(t.getAttribute('data-k')); return; }
      if(t.classList && t.classList.contains('q-item')){ choose(t); return; }
      t=t.parentNode;
    }
  });
  function start(){
    if(started) return; started=true;
    if(tent) tent.classList.add('live');
    if(REDUCED){ vWelcome(); pushLog('QR SCANNED · TABLE 12'); return; }
    vScan();
    setTimeout(function(){ vWelcome(); pushLog('QR SCANNED · TABLE 12'); },1600);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ io.disconnect(); start(); } });
    },{threshold:.25});
    io.observe(grid||qv);
  } else { start(); }
})();

/* ---------- 09 · counters ---------- */
