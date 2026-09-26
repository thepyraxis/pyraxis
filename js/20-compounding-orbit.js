'use strict';
(function(){
  var root=$('#orbit'); if(!root) return;
  var cv=$('#orbCv'), ctx=cv&&cv.getContext&&cv.getContext('2d'); if(!ctx) return;
  var cards=$$('.ob',root), N=cards.length; if(!N) return;
  var rn=$('#orbRn'), rt=$('#orbRt'), rd=$('#orbRd'), read=$('#orbRead'), cyc=$('#orbCycle'), dotsEl=$('#orbDots');
  var STEPS=[
    {t:'Customer data',        d:'Every visit, booking and message lands in one record.'},
    {t:'Smarter decisions',    d:'You see who returns, who drifts and what actually works.'},
    {t:'Better experience',    d:'Each customer is remembered, so service feels personal.'},
    {t:'More returning',       d:'Timely follow-ups bring regulars back before they drift.'},
    {t:'Reviews & referrals',  d:'Happy customers are asked at the right moment.'},
    {t:'More growth',          d:'Retention compounds — and feeds the record again.'}
  ];
  var TAU=Math.PI*2, LAP=15;                 /* seconds per full lap */
  var desk=false, W=0, H=0, DPR=1, cx=0, cy=0, rx=1, ry=1;
  var pts=[], parts=[], energy=[], rings=[], sparks=[], echoes=[], dots=[];
  var pm=0, lap=0, pvPrev=0, lock=-1, shown=-1, hotIdx=-2, coreFlash=0, tNow=0, last=0, swT=0;
  var i;
  for(i=0;i<N;i++){ energy.push(0); pts.push({x:0,y:0}); dots.push(document.createElement('i')); dotsEl.appendChild(dots[i]); }
  for(i=0;i<170;i++) parts.push({a:Math.random()*TAU,v:.16+Math.random()*.26,o:(Math.random()-.5)*11,s:.6+Math.random()*1.3,k:Math.random()});

  function pad(n){ return (n<10?'0':'')+n; }
  function wrap(d){ return ((d+N/2)%N+N)%N-N/2; }
  function wrapA(a){ a=(a+Math.PI)%TAU; if(a<0) a+=TAU; return a-Math.PI; }
  function ease(f){ return f-.8*Math.sin(TAU*f)/TAU; }          /* dwell at every station */
  function visP(){ var s=Math.floor(pm); return s+ease(pm-s); }

  /* ---------- rounded-rect track ----------
     Real rectangle, not a 6-sided hex: corners only where the shape
     actually turns (top/right/bottom/left), sized so ALL 6 stations
     still land exactly on its boundary. Top/bottom stations (k=0,3)
     sit at the midpoint of the top/bottom edge; the 4 side stations
     (k=1,2,4,5) sit in pairs along the left/right edges — none of
     them need their own corner. */
  var COS30=Math.cos(Math.PI/6), CR=26; /* corner fillet radius, px */
  function rectHalf(sx,sy){ return {w:sx*COS30, h:sy}; }
  function hexAt(angle,sx,sy){
    var h=rectHalf(sx,sy), dx=Math.cos(angle), dy=Math.sin(angle);
    var t=Math.min(dx?Math.abs(h.w/dx):Infinity, dy?Math.abs(h.h/dy):Infinity);
    return {x:cx+dx*t, y:cy+dy*t};
  }
  function hexPathAt(sx,sy){
    var h=rectHalf(sx,sy), x0=cx-h.w,y0=cy-h.h,x1=cx+h.w,y1=cy+h.h, r=Math.min(CR,h.w*.3,h.h*.3);
    ctx.moveTo(x0+r,y0);
    ctx.lineTo(x1-r,y0); ctx.arcTo(x1,y0,x1,y0+r,r);
    ctx.lineTo(x1,y1-r); ctx.arcTo(x1,y1,x1-r,y1,r);
    ctx.lineTo(x0+r,y1); ctx.arcTo(x0,y1,x0,y1-r,r);
    ctx.lineTo(x0,y0+r); ctx.arcTo(x0,y0,x0+r,y0,r);
    ctx.closePath();
  }

  function setReadout(k,instant){
    if(k===shown) return; shown=k;
    var apply=function(){
      rn.textContent=pad(k+1); rt.textContent=STEPS[k].t; rd.textContent=STEPS[k].d;
      read.classList.remove('sw');
      for(var d=0;d<N;d++) dots[d].classList.toggle('on',d<=k);
    };
    clearTimeout(swT);
    if(instant||REDUCED){ apply(); return; }
    read.classList.add('sw'); swT=setTimeout(apply,190);
  }
  function setHot(k){
    if(k===hotIdx) return; hotIdx=k;
    for(var c=0;c<N;c++) cards[c].classList.toggle('hot',c===k);
  }

  function layout(){
    var r=root.getBoundingClientRect(); W=r.width;
    desk = W>=720;
    root.classList.toggle('is-desk',desk);
    if(!desk){ for(var m=0;m<N;m++){ cards[m].style.left=''; cards[m].style.top=''; } root.classList.add('ready'); return; }
    H=r.height; DPR=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
    var cw=cards[0].offsetWidth, ch=cards[0].offsetHeight;
    cx=W/2; cy=H/2;
    ry=H/2-ch/2-12;
    rx=W/2-cw/2-6;
    for(var k=0;k<N;k++){
      var a=(-90+k*60)*Math.PI/180;
      pts[k].x=cx+rx*Math.cos(a); pts[k].y=cy+ry*Math.sin(a);
      cards[k].style.left=pts[k].x.toFixed(1)+'px'; cards[k].style.top=pts[k].y.toFixed(1)+'px';
    }
    root.classList.add('ready');
  }

  function arrive(k){
    energy[k]=1;
    if(!desk) return;
    rings.push({x:pts[k].x,y:pts[k].y,t:tNow});
    for(var n=0;n<16;n++){
      var an=Math.random()*TAU, sp=50+Math.random()*130;
      sparks.push({x:pts[k].x,y:pts[k].y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,age:0,life:.9+Math.random()*.9,s:.8+Math.random()*1.5});
    }
  }
  function jump(k){
    pm=k; pvPrev=visP(); arrive(k);
  }

  /* ---------- drawing (desktop) ---------- */
  function draw(pv,dt){
    var t=tNow, ca=(-90+pv*60)*Math.PI/180, lv=Math.min(lap,6), j, k, g;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';

    /* core aurora — the record; brighter with every lap */
    var ga=.10+.022*lv+.18*coreFlash;
    ctx.save(); ctx.translate(cx,cy); ctx.scale(1,ry/rx*1.05);
    g=ctx.createRadialGradient(0,0,0,0,0,rx*.62);
    g.addColorStop(0,'rgba(124,92,255,'+ga.toFixed(3)+')');
    g.addColorStop(.55,'rgba(88,64,220,'+(ga*.33).toFixed(3)+')');
    g.addColorStop(1,'rgba(88,64,220,0)');
    ctx.fillStyle=g; ctx.fillRect(-rx,-rx,rx*2,rx*2); ctx.restore();

    /* slow instrument rings inside the orbit */
    var R=[[.44,[2,9],9,1],[.63,[34,12],-6,.75],[.82,[1,5],4,.55]];
    ctx.lineWidth=1;
    for(j=0;j<R.length;j++){
      ctx.setLineDash(R[j][1]); ctx.lineDashOffset=-t*R[j][2];
      ctx.strokeStyle='rgba(167,139,255,'+(.11*R[j][3])+')';
      ctx.beginPath(); hexPathAt(rx*R[j][0],ry*R[j][0]); ctx.closePath(); ctx.stroke();
    }
    ctx.setLineDash([]);

    /* echo waves — each completed lap radiates outward and compounds */
    for(j=echoes.length-1;j>=0;j--){
      var ea=(t-echoes[j])/2.8;
      if(ea>=1){ echoes.splice(j,1); continue; }
      var es=.12+.98*(1-Math.pow(1-ea,3));
      ctx.strokeStyle='rgba(196,181,253,'+((1-ea)*.42).toFixed(3)+')'; ctx.lineWidth=1.4;
      ctx.beginPath(); hexPathAt(rx*es,ry*es); ctx.closePath(); ctx.stroke();
    }

    /* bezel ticks — flare as the comet passes */
    var K=90;
    for(j=0;j<K;j++){
      var ta=j/K*TAU-Math.PI/2, df=wrapA(ta-ca), pr=Math.exp(-(df*df)/(2*.16*.16)), maj=(j%15===0);
      var tp=hexAt(ta,rx-30,ry-30), px=tp.x, py=tp.y;
      var nx=Math.cos(ta), ny=Math.sin(ta);
      var ln=(maj?11:4)+pr*10, al=(maj?.45:.2)+pr*.7;
      ctx.strokeStyle='rgba(196,181,253,'+al.toFixed(3)+')'; ctx.lineWidth=maj?1.4:1;
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px+nx*ln,py+ny*ln); ctx.stroke();
    }

    /* the orbit itself + a faint dashed outer echo */
    ctx.lineWidth=1.3; ctx.strokeStyle='rgba(167,139,255,.34)';
    ctx.beginPath(); hexPathAt(rx,ry); ctx.closePath(); ctx.stroke();
    ctx.setLineDash([1,7]); ctx.lineDashOffset=t*5; ctx.lineWidth=1; ctx.strokeStyle='rgba(167,139,255,.10)';
    ctx.beginPath(); hexPathAt(rx+10,ry+10); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);

    /* threads — a station that just fired feeds the record at the centre */
    for(k=0;k<N;k++){
      var e=energy[k]; if(e<.03) continue;
      var sx=pts[k].x, sy=pts[k].y, dx=cx-sx, dy=cy-sy, dl=Math.sqrt(dx*dx+dy*dy);
      var x0=sx+dx/dl*78, y0=sy+dy/dl*46, x1=sx+dx*.62, y1=sy+dy*.62;
      g=ctx.createLinearGradient(x0,y0,x1,y1);
      g.addColorStop(0,'rgba(196,181,253,'+(e*.5).toFixed(3)+')'); g.addColorStop(1,'rgba(196,181,253,0)');
      ctx.strokeStyle=g; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    }

    /* comet tail — tapered, fading */
    var SEG=42, TL=1.25;
    ctx.lineCap='round';
    for(j=0;j<SEG;j++){
      var a0=ca-TL*(j/SEG), a1=ca-TL*((j+1)/SEG), f=1-j/SEG;
      ctx.strokeStyle='rgba('+(150+Math.round(90*f))+','+(120+Math.round(100*f))+',255,'+(f*f*.8).toFixed(3)+')';
      ctx.lineWidth=.8+3.4*f;
      var tP0=hexAt(a0,rx,ry), tP1=hexAt(a1,rx,ry);
      ctx.beginPath(); ctx.moveTo(tP0.x,tP0.y); ctx.lineTo(tP1.x,tP1.y); ctx.stroke();
    }
    ctx.lineCap='butt';

    /* particle stream — the orbit is alive */
    for(j=0;j<parts.length;j++){
      var p=parts[j]; p.a+=p.v*dt*.62;
      var dd=wrapA(p.a-ca), bo=Math.exp(-(dd*dd)/(2*.3*.3));
      var qp=hexAt(p.a,rx+p.o,ry+p.o*.6), qx=qp.x, qy=qp.y;
      var qa=Math.min(1,.16+.34*p.k+.6*bo), qs=p.s*(1+bo*.9);
      ctx.fillStyle='rgba('+(190+Math.round(50*bo))+','+(170+Math.round(70*bo))+',255,'+qa.toFixed(3)+')';
      ctx.beginPath(); ctx.arc(qx,qy,qs,0,TAU); ctx.fill();
    }

    /* station beacons + arrival rings */
    for(k=0;k<N;k++){
      var be=energy[k];
      g=ctx.createRadialGradient(pts[k].x,pts[k].y,0,pts[k].x,pts[k].y,78);
      g.addColorStop(0,'rgba(124,92,255,'+(.05+.32*be).toFixed(3)+')'); g.addColorStop(1,'rgba(124,92,255,0)');
      ctx.fillStyle=g; ctx.fillRect(pts[k].x-78,pts[k].y-78,156,156);
    }
    for(j=rings.length-1;j>=0;j--){
      var ra=(t-rings[j].t)/1.5;
      if(ra>=1){ rings.splice(j,1); continue; }
      var re=1-Math.pow(1-ra,3);
      ctx.strokeStyle='rgba(216,200,255,'+((1-ra)*.6).toFixed(3)+')'; ctx.lineWidth=1.3;
      ctx.beginPath(); ctx.arc(rings[j].x,rings[j].y,34+120*re,0,TAU); ctx.stroke();
      if(ra>.12){
        var rb=(ra-.12)/.88;
        ctx.strokeStyle='rgba(167,139,255,'+((1-rb)*.35).toFixed(3)+')';
        ctx.beginPath(); ctx.arc(rings[j].x,rings[j].y,30+90*(1-Math.pow(1-rb,3)),0,TAU); ctx.stroke();
      }
    }

    /* comet head — grows a little with each lap */
    var hp2=hexAt(ca,rx,ry), hx=hp2.x, hy=hp2.y, cs=1+Math.min(lap,5)*.06;
    g=ctx.createRadialGradient(hx,hy,0,hx,hy,58*cs);
    g.addColorStop(0,'rgba(150,120,255,.62)'); g.addColorStop(.35,'rgba(124,92,255,.24)'); g.addColorStop(1,'rgba(124,92,255,0)');
    ctx.fillStyle=g; ctx.fillRect(hx-60*cs,hy-60*cs,120*cs,120*cs);
    ctx.fillStyle='rgba(216,200,255,.55)'; ctx.beginPath(); ctx.arc(hx,hy,8.5*cs,0,TAU); ctx.fill();
    ctx.fillStyle='#f5f3ff'; ctx.beginPath(); ctx.arc(hx,hy,3.6*cs,0,TAU); ctx.fill();

    /* sparks */
    for(j=sparks.length-1;j>=0;j--){
      var sp=sparks[j]; sp.age+=dt;
      if(sp.age>=sp.life){ sparks.splice(j,1); continue; }
      sp.x+=sp.vx*dt; sp.y+=sp.vy*dt; sp.vx*=1-1.4*dt; sp.vy*=1-1.4*dt;
      var sa=1-sp.age/sp.life;
      ctx.fillStyle='rgba(225,212,255,'+(sa*.85).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(sp.x,sp.y,sp.s*(.5+sa*.6),0,TAU); ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
  }

  /* ---------- state step (runs desktop + mobile) ---------- */
  function step(now){
    var dt=last?Math.min((now-last)/1000,.05):.016; last=now; tNow=now/1000;
    pm+=dt*N/LAP;
    if(pm>=N){ pm-=N; lap++; coreFlash=1; echoes.push(tNow); cyc.textContent='CYCLE '+pad(lap+1); }
    var pv=visP(), k;
    for(k=0;k<N;k++){
      var pd=wrap(pvPrev-k), cd=wrap(pv-k);
      if(pd<0&&cd>=0) arrive(k);
      var bump=Math.exp(-Math.pow(cd/.28,2));
      energy[k]=Math.max(energy[k]*Math.exp(-dt*1.2),bump);
    }
    pvPrev=pv; coreFlash*=Math.exp(-dt*1.6);
    var idx=Math.floor(pv+.15)%N, hot=-1;
    for(k=0;k<N;k++) if(Math.abs(wrap(pv-k))<.32){ hot=k; break; }
    if(lock>=0){ idx=lock; hot=lock; }
    setReadout(idx); setHot(hot);
    if(desk) draw(pv,dt);
    else root.style.setProperty('--prog',(pv/N*100).toFixed(1));
  }

  /* ---------- interaction ---------- */
  cards.forEach(function(li,k){
    var b=$('.ob-b',li);
    li.addEventListener('pointerenter',function(){ lock=k; if(REDUCED){ setReadout(k,true); setHot(k); } });
    li.addEventListener('pointerleave',function(){ if(lock===k){ lock=-1; if(REDUCED) staticFrame(); } });
    li.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect();
      b.style.setProperty('--mx',(e.clientX-r.left)+'px'); b.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    b.addEventListener('focus',function(){ lock=k; if(REDUCED){ setReadout(k,true); setHot(k); } });
    b.addEventListener('blur',function(){ if(lock===k){ lock=-1; if(REDUCED) staticFrame(); } });
    b.addEventListener('click',function(){ if(!REDUCED) jump(k); });
  });

  function staticFrame(){
    setReadout(0,true); setHot(0); pm=0; pvPrev=0; energy[0]=.6;
    if(desk) draw(0,0); else root.style.setProperty('--prog','0');
  }

  layout();
  var rz; addEventListener('resize',function(){ clearTimeout(rz); rz=setTimeout(function(){ layout(); if(REDUCED) staticFrame(); },160); });
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ layout(); if(REDUCED) staticFrame(); });
  if(REDUCED){ staticFrame(); return; }
  setReadout(0,true);
  addTicker(root,step);
})();

/* ---------- modal + toast ---------- */
