/* ============================================================
   THE EMBER FIELD — the PYRAXIS mark, built from its own pixels,
   riding the whole page's scroll: mark → dispersal → coherence →
   field → galaxy → genesis world.
============================================================ */
(function(){
"use strict";
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const sstep=t=>t*t*(3-2*t);
const TAU=Math.PI*2;

const canvas=$('#gl');
if(!canvas)return;
const topoCv=$('#topo');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=matchMedia('(pointer: coarse)').matches;

const toastEl=$('#toast');
let toastTO=null;
function showToast(msg){
  if(!toastEl)return;
  toastEl.textContent=msg;toastEl.classList.add('show');
  clearTimeout(toastTO);toastTO=setTimeout(()=>toastEl.classList.remove('show'),3400);
}

/* the field follows the journey hero → genesis (anchored, not the full
   document): Recent Work (#deployments) + Purpose (#purpose) were added
   later and stretched every phase when mapped to scrollHeight; small text
   trims must compress local chunks, never re-stretch the hero. So range
   ends at the compounding section's centre — tail CTA/footer can grow or
   shrink freely without touching hero pacing. */
let vh=innerHeight,range=1;
var END_ANCHOR_SEL='#compounding';
function anchorScroll(){
  var a=document.querySelector(END_ANCHOR_SEL);
  if(!a) return document.documentElement.scrollHeight-vh;
  var r=a.getBoundingClientRect();
  var top=r.top+(window.scrollY||0);
  var mid=top+r.height/2;
  return mid-vh/2;
}
function layout(){
  vh=innerHeight;
  var fallback=Math.max(1,document.documentElement.scrollHeight-vh);
  var anchored=anchorScroll();
  /* guard: if anchor is above the fold or unmeasurable, fall back */
  range=Math.max(vh*2,Math.min(fallback,Math.max(1,anchored)));
}
layout();
function relayout(){
  /* range-only update: NEVER touch `cur` here. `cur` is the smoothed
     scroll follower (tick lerps it toward scrollY every frame) — the old
     `cur=keep*range` teleported it away from the real scroll position
     whenever fonts/images/syslog lines landed in the first seconds, and
     the lerp back read as a sudden reload/refresh of the whole field.
     Keeping `cur` steady lets curP shift by the (correct, tiny) amount. */
  layout();
}
addEventListener('load',relayout);

if(typeof THREE==='undefined'){canvas.remove();return;}
if(THREE.ColorManagement)THREE.ColorManagement.enabled=false;

/* —— THE REAL MARK — the PYRAXIS emblem embedded as a data URI, so the
      pixel pipeline races nothing and depends on no network. The CDN
      copies remain only as fallback. Also used for the favicon. —— */
const MARK_SVG=`<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 2500 2500" fill="none">
<path d="M2256 2325H1920.36L1380 1647.25L1544.64 1443L2256 2325Z" fill="url(#a)"/>
<path d="M1001.75 772H658.895L1154.96 1327.06L331 2325H672.417L1493 1307.66L1001.75 772Z" fill="url(#b)"/>
<path d="M1799.12 215H157.845L412.269 475.57L1805.26 477.256C1848.37 489.905 2059.68 514.36 2071.52 790.108C2078.95 982.373 1919.09 1074.85 1838.22 1097.06L1734.26 1108.86L1592.25 1307.87L1637.9 1361H1829.77L1885.56 1353.41C2120.54 1301.13 2342 1109.71 2342 790.108C2324.42 352.284 1972.75 224.276 1799.12 215Z" fill="url(#c)"/>
<defs>
<linearGradient id="a" x1="1492.07" y1="1443" x2="2352.06" y2="1759.52" gradientUnits="userSpaceOnUse"><stop stop-color="#CCCDCC"/><stop offset=".2" stop-color="#C8C9CB"/><stop offset=".45" stop-color="#E1E3E2"/><stop offset=".780207" stop-color="#C3C5C4"/><stop offset="1" stop-color="#A5A5A6"/></linearGradient>
<linearGradient id="b" x1="911.463" y1="772" x2="908.825" y2="2324.99" gradientUnits="userSpaceOnUse"><stop stop-color="#9025F1"/><stop offset=".25" stop-color="#982EF5"/><stop offset=".5" stop-color="#750BF0"/><stop offset=".75" stop-color="#45069F"/><stop offset="1" stop-color="#2B006C"/></linearGradient>
<linearGradient id="c" x1="436.528" y1="215" x2="2061.15" y2="1362.88" gradientUnits="userSpaceOnUse"><stop stop-color="#FDFDFD"/><stop offset=".2" stop-color="#E4E4E3"/><stop offset=".45" stop-color="#CBCBCB"/><stop offset=".780207" stop-color="#FDFDFD"/><stop offset="1" stop-color="#A5A6A8"/></linearGradient>
</defs></svg>`;
const MARK_URI='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(MARK_SVG);
try{
  const link=document.createElement('link');
  link.rel='icon';link.type='image/svg+xml';link.href=MARK_URI;
  document.head.appendChild(link);
}catch(e){}

/* Archived local portrait — the remote PREV signing key already expired
   (403 on fetch), so both slots point at the local file. The embedded
   SVG mark above is primary; these are fallback-of-fallback only. */
const LOCAL_PORTRAIT='public/img/founder-latest.png';
const CDN_LATEST=LOCAL_PORTRAIT;
const CDN_PREV=LOCAL_PORTRAIT;

/* The genesis world holds the REFERENCE violet — it does NOT follow the
   mark's purple, which can drift pink. One place, one truth. */
  const GLOBE_VIOLET=0x7b61ff;
  const GLOBE_GLASS=0.66;   /* the world's glass opacity — one knob, see body shader */

let SAMPLES=null,PIXELS_OK=false,fieldLive=false;
let accAttr=null,landAttr=null,engine=null,dust=null;

/* intro-formation state */
  let introFrom=null,introT=1,introGlow=0;
  let markFormed=false;  /* formation plays once — later marks only swap the target */
  let glideFrom=null,glideT=1;  /* responsive re-layout glides; never snaps */
const INTRO_DUR=2.0;    // seconds of flight once launched
const INTRO_HOLD=-0.06; // near-zero hold while the canvas fades up
const INTRO_ARC=5.2;    // arc bloom strength
const INTRO_SWIRL=0.9;  // radians the field unwinds around the axis while settling

function isPurplePx(r,g,b){return r>g+25&&b>g+25;}

function analyzeImage(img){
  const MAXW=560,s=Math.min(1,MAXW/img.width);
  const w=Math.max(2,Math.round(img.width*s)),h=Math.max(2,Math.round(img.height*s));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const ctx=cv.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(img,0,0,w,h);
  const d=ctx.getImageData(0,0,w,h).data;

  let op=0,opL=0,opMax=0,tot=0;
  const bp=(x,y)=>{const k=(y*w+x)*4;if(d[k+3]>128){op++;const m=Math.max(d[k],d[k+1],d[k+2]);opL+=m;opMax=Math.max(opMax,m);}tot++;};
  for(let x=0;x<w;x+=3){bp(x,0);bp(x,h-1);}
  for(let y=0;y<h;y+=3){bp(0,y);bp(w-1,y);}
  const lightBg=tot>0&&op/tot>.6&&opL/Math.max(1,op)>140;
  const thrD=Math.max(70,opMax*.5+45);

  const pts=[],acc=[];
  let pr=0,pg=0,pb=0,pc=0;
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const k=(y*w+x)*4;
    if(d[k+3]<40)continue;
    const r=d[k],g=d[k+1],b=d[k+2],mx=Math.max(r,g,b),L=(r+g+b)/3;
    const ink=lightBg?(L<218||isPurplePx(r,g,b)):mx>thrD;
    if(!ink)continue;
    pts.push(x,y);
    const P=isPurplePx(r,g,b)?1:0;
    acc.push(P);
    if(P&&mx>110){pr+=r;pg+=g;pb+=b;pc++;}
    if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
  }
  if(pts.length<1200)throw new Error('no ink');
  const purple=pc?[pr/pc|0,pg/pc|0,pb/pc|0]:[154,107,255];

  const out=ctx.createImageData(w,h),o=out.data;
  const SIL=[236,234,246];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const k=(y*w+x)*4,a=d[k+3];if(a<1)continue;
    const r=d[k],g=d[k+1],b=d[k+2],mx=Math.max(r,g,b),L=(r+g+b)/3;
    const ink=lightBg?(L<218||isPurplePx(r,g,b)):mx>thrD;
    if(!ink)continue;
    const f=lightBg?clamp((218-L)/140,.35,1):clamp((mx-thrD)/Math.max(1,255-thrD),.4,1);
    const col=isPurplePx(r,g,b)?purple:SIL;
    o[k]=col[0]*f;o[k+1]=col[1]*f;o[k+2]=col[2]*f;o[k+3]=a;
  }
  ctx.putImageData(out,0,0);
  return{pts,acc,count:pts.length>>1,bx:x0,by:y0,bx1:x1,by1:y1,purple};
}

function buildMarkShape(sm){
  const pos=new Float32Array(N*3),acc=new Float32Array(N);
  const m=sm.count;
  const aspect=innerWidth/innerHeight;
  const visH=2*34*Math.tan(Math.PI/6),visW=visH*aspect;
  const bw=Math.max(1,sm.bx1-sm.bx),bh=Math.max(1,sm.by1-sm.by);
  const target=Math.min(visH*.58,visW*.7*bh/bw);
  const s=target/bh,cx=(sm.bx+sm.bx1)/2,cy=(sm.by+sm.by1)/2;
  /* hero layout: copy sits left, free space sits right — park ONLY the mark
     in that free space. Bottom edge anchored (shiftY compensates half the
     growth), so size increases extend upward; plus a small right nudge.
     Other shapes (dispersal/knot/disc/galaxy/globe) stay centered; the
     scroll flight re-animates from the offset mark naturally. Wide only. */
  const wide=innerWidth>=900&&aspect>1.1;
  const shiftX=wide?visW*0.16:0;
  const shiftY=wide?-visH*0.03:0;
  for(let i=0;i<N;i++){
    const k=(Math.random()*m)|0;
    pos[i*3]  =(sm.pts[k*2]-cx)*s+(Math.random()-.5)*.34+shiftX;
    pos[i*3+1]=-(sm.pts[k*2+1]-cy)*s+(Math.random()-.5)*.34+shiftY;
    pos[i*3+2]=(Math.random()-.5)*.9;
    acc[i]=sm.acc[k];
  }
  return{pos,acc};
}

/* pre-formation state: loose, structureless embers — no core, no ring */
function coreShape(){
  const pos=new Float32Array(N*3),acc=new Float32Array(N);
  for(let i=0;i<N;i++){
    pos[i*3]=gauss()*10;
    pos[i*3+1]=gauss()*6;
    pos[i*3+2]=gauss()*10;
  }
  return{pos,acc};
}

/* The accent tints only the FIELD (embers, dust) — the page keeps its
   own palette, and the genesis world keeps the reference violet. */
function applyAccent(r,g,b){
  const c=new THREE.Color(r/255,g/255,b/255);
  if(engine)engine.uniforms.uAcc.value.copy(c);
  if(dust)dust.uniforms.uCol.value.lerp(c,.3);
}

function refreshOpening(){
  const built=PIXELS_OK&&SAMPLES?buildMarkShape(SAMPLES):CORE;
  shapes[0]=built.pos;
  if(accAttr){accAttr.array.set(built.acc);accAttr.needsUpdate=true;}
  if(engine){
    engine.morph(curP,true);            // rewrite the LOGICAL target buffer
    if(!introFrom){                     // no intro running: glide to it over ~0.6s
      glideFrom=new Float32Array(engine.posAttr.array);
      glideT=0;
    }
  }
}

function applyMark(sm,tag){
  SAMPLES=sm;PIXELS_OK=true;
  applyAccent(sm.purple[0],sm.purple[1],sm.purple[2]);
  if(engine&&curP<1&&!reduced&&!markFormed){
    markFormed=true;
    introFrom=new Float32Array(engine.baseArr);
    introT=INTRO_HOLD;
    canvas.style.transition='opacity .45s ease';
  }
  refreshOpening();
}

function trySrc(src,ok,fail,ms){
  ms=ms||3000;
  let done=false;
  const img=new Image();
  img.crossOrigin='anonymous';
  const t=setTimeout(()=>{if(!done){done=true;fail();}},ms);
  img.onload=()=>{if(done)return;done=true;clearTimeout(t);ok(img);};
  img.onerror=()=>{if(done)return;done=true;clearTimeout(t);fail();};
  img.src=src;
}

/* =====================================================================
   BOOT — the embedded mark first; the CDN copies only if it fails.
   ===================================================================== */
function bootMark(){
  const img=new Image();
  img.onload=()=>{try{applyMark(analyzeImage(img),'LIVE');}catch(e){cdnFallback();}};
  img.onerror=cdnFallback;
  img.src=MARK_URI;
}
function cdnFallback(){
  /* Local archived portrait only — the old remote signing keys expired,
     and the embedded SVG mark above is primary anyway. */
  const srcs=[CDN_LATEST];
  let i=0;
  const next=()=>{
    if(i>=srcs.length){fieldLive=true;return;}
    trySrc(srcs[i++],im=>{try{applyMark(analyzeImage(im),'LIVE · NET');}catch(e){next();}},next,4000);
  };
  next();
}
setTimeout(()=>{if(!PIXELS_OK)fieldLive=true;},2400);

/* ================= formations ================= */
/* Touch devices get a reduced GPU budget (fewer embers, lower DPR below):
   low-end mobile GPUs are fill-rate bound, and a fullscreen 20k-point
   field at DPR 2 is what turns scroll into slideshow. Desktop keeps all. */
const COARSE=window.matchMedia&&matchMedia('(pointer: coarse)').matches;
const N=COARSE?1600:(innerWidth<720?7000:20000);
const isMobile=innerWidth<720;
/* PHONES/TOUCH: same world, but far fewer px of screen and only 3000 embers —
   each one reads bigger and brighter (additive) than on desktop, and the
   hero mark sits right behind the copy. Dim + shrink so mobile matches PC. */
const DIM=isMobile||COARSE;
const GL_BASE=DIM?.62:.8;     /* canvas opacity outside the globe */
const GL_GLOBE=DIM?.74:.92;   /* canvas opacity once the world is formed */
const SZ_MUL=DIM?.76:1;        /* ember sprite size */
const DUST_MUL=DIM?.65:1;     /* background star brightness */
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v);}

const GLOBE_R=8;      /* the genesis world's radius */
const shapes=[];

/* 0 — the mark (real pixels once loaded; loose embers before — never a shape) */
const CORE=coreShape();
shapes.push(CORE.pos);

/* 1 — dispersal */
{
  const a=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    const s=Math.random()<.1?17:8.2;
    a[i*3]=gauss()*s;a[i*3+1]=gauss()*s*.75;a[i*3+2]=gauss()*s;
  }
  shapes.push(a);
}
/* 2 — coherence: fuzzy trefoil knot */
{
  const a=new Float32Array(N*3),S=2.75;
  for(let i=0;i<N;i++){
    const t=(i/N)*TAU,th=.5+Math.random()*.55;
    a[i*3]=(Math.sin(t)+2*Math.sin(2*t))*S+gauss()*th;
    a[i*3+1]=(Math.cos(t)-2*Math.cos(2*t))*S+gauss()*th;
    a[i*3+2]=(-Math.sin(3*t))*S+gauss()*th;
  }
  shapes.push(a);
}
/* 3 — field: flat disc */
{
  const a=new Float32Array(N*3);let i=0;
  while(i<N){
    const x=(Math.random()-.5)*56,z=(Math.random()-.5)*56;
    if(x*x+z*z>576)continue;
    a[i*3]=x;a[i*3+1]=gauss()*.5;a[i*3+2]=z;i++;
  }
  shapes.push(a);
}
/* 4 — the galaxy: barred spiral (nucleus · bar · bulge · 4 arms + spur ·
       disk · bokeh · halo + globulars · nebulae). Ported from the standalone
       "First light, then everything." scene. Every ember gets a fixed role:
       its polar coords + orbital rate live in GAL (so the disc can turn
       differentially, CPU-side, into shapes[4]) and its look (colour / size /
       alpha / softness) rides two static attributes the shader reads while
       uGal > 0. x and omega are both mirrored so the arms trail the spin. */
const G_PITCH=.23,G_R0=3.0,G_BAR_ANG=.12,G_OM_BAR=.047,G_SC=.8;
const GAL={R:new Float32Array(N),TH:new Float32Array(N),Y:new Float32Array(N),OM:new Float32Array(N),
  GSZ:new Float32Array(N),GA:new Float32Array(N*4),GC:new Float32Array(N*3),T0:100,T:100};
{
  const omDisk=r=>.224*Math.tanh(r/2.5)/Math.max(r,.05);
  const omArm=r=>omDisk(r)*.55+.016;
  const armTh=(t0,r,p)=>t0-Math.log(r/G_R0)/(p||G_PITCH);
  const ARMS=[
    {t0:G_BAR_ANG,             p:G_PITCH,      r0:G_R0,r1:15.2,n:1.0, w:.42},
    {t0:G_BAR_ANG+Math.PI,     p:G_PITCH,      r0:G_R0,r1:14.6,n:1.0, w:.44},
    {t0:G_BAR_ANG+Math.PI-.5,  p:G_PITCH*1.06, r0:G_R0,r1:12.4,n:.72, w:.56},
    {t0:G_BAR_ANG+.5,          p:G_PITCH*.97,  r0:G_R0,r1:15.4,n:.72, w:.56},
    {t0:armTh(G_BAR_ANG+Math.PI,7.4,G_PITCH)-.27,p:G_PITCH*1.15,r0:7.4,r1:10.8,n:.30,w:.32}
  ];
  let totW=0;for(const a of ARMS)totW+=a.n*(a.r1-a.r0);
  const C_W=[1,1,1],C_LW=[.93,.90,1],C_LV=[.80,.74,1],C_V=[.62,.53,1],
        C_DV=[.46,.38,.92],C_PINK=[.96,.70,.95],C_BLUE=[.60,.66,1];
  const pk=a=>a[(Math.random()*a.length)|0];
  /* px-size → aSize units (the sprite formula is ~3.7px per unit on desktop);
     thinner swarms on phones get slightly fatter embers so the disc still reads */
  const SZK=8.0*(N>=20000?1:N>=12000?1.15:1.6);
  let gi=0;
  function gp(x,y,z,c,b,sz,om,al,soft){
    if(gi>=N)return;
    x=-x*G_SC;y*=G_SC;z*=G_SC;om=-om;
    GAL.R[gi]=Math.hypot(x,z);GAL.TH[gi]=Math.atan2(z,x);GAL.Y[gi]=y;GAL.OM[gi]=om;
    GAL.GC[gi*3]=c[0]*b;GAL.GC[gi*3+1]=c[1]*b;GAL.GC[gi*3+2]=c[2]*b;
    GAL.GSZ[gi]=sz*SZK;GAL.GA[gi*4+1]=al;GAL.GA[gi*4+2]=soft?1:0;
    gi++;
  }
  let cum=0;
  function layer(frac,fn){cum+=frac;const tgt=Math.min(N,Math.round(N*cum));while(gi<tgt)fn();}

  /* nucleus */
  layer(.03,()=>{
    const c=pk([C_W,C_W,C_LW,C_LV]),b=1+.5*Math.random();
    gp(gauss()*.22,gauss()*.14,gauss()*.22,c,b,.05+Math.pow(Math.random(),2)*.08,G_OM_BAR,1);
  });
  /* bar */
  const ca=Math.cos(G_BAR_ANG),sa=Math.sin(G_BAR_ANG);
  layer(.08,()=>{
    const lx=gauss()*2.7,ly=gauss()*.38,lz=gauss()*.75;
    const c=pk([C_LW,C_LV,C_V,C_W]),b=.55+.6*Math.pow(Math.random(),1.3);
    gp(lx*ca-lz*sa,ly,lx*sa+lz*ca,c,b,.05+Math.pow(Math.random(),2)*.08,G_OM_BAR,.8+.2*Math.random());
  });
  /* bulge */
  layer(.10,()=>{
    const k=Math.random()<.3?.45:1;
    const c=pk([C_V,C_LV,C_DV,C_LW]),b=.4+.55*Math.pow(Math.random(),1.6);
    gp(gauss()*1.35*k,gauss()*.85*k,gauss()*1.35*k,c,b,.04+Math.pow(Math.random(),2)*.07,G_OM_BAR,.4+.5*Math.random());
  });
  /* arms (weighted across the four arms + the spur) */
  layer(.56,()=>{
    let u=Math.random()*totW,a=ARMS[0];
    for(const A of ARMS){u-=A.n*(A.r1-A.r0);if(u<=0){a=A;break;}}
    let r,sig;
    do{
      const rb=a.r0+(a.r1-a.r0)*Math.pow(Math.random(),.85);
      sig=a.w*(.65+.05*rb)*1.3;r=rb+gauss()*sig;
    }while(r<1.2);
    const th=armTh(a.t0,r,a.p)+gauss()*sig*.8/r;
    const y=gauss()*(.09+.011*r);
    let c,b,sz,al;
    if(Math.random()<.05){c=pk([C_W,C_BLUE,C_LW]);b=1+.3*Math.random();sz=.13+.09*Math.random();al=1;}
    else{c=pk([C_LV,C_V,C_V,C_V,C_DV,C_PINK,C_BLUE]);b=.75+.6*Math.pow(Math.random(),1.4);
         sz=.045+Math.pow(Math.random(),2)*.075;al=.6+.4*Math.random();}
    gp(Math.cos(th)*r,y,Math.sin(th)*r,c,b,sz,omArm(r),al);
  });
  /* arm bokeh — big soft out-of-focus dots riding the arms */
  layer(.02,()=>{
    const a=ARMS[(Math.random()*ARMS.length)|0];
    const rb=a.r0+(a.r1-a.r0)*Math.pow(Math.random(),.85);
    const r=Math.max(1.2,rb+gauss()*a.w*1.6);
    const th=armTh(a.t0,r,a.p)+gauss()*a.w/r;
    const c=pk([C_V,C_PINK,C_LV,C_DV]),b=.7+.5*Math.random();
    gp(Math.cos(th)*r,gauss()*.12,Math.sin(th)*r,c,b*.8,.05+.05*Math.random(),omArm(r),.5+.4*Math.random(),0);
  });
  /* nebulae — star-forming knots */
  layer(.04,()=>{
    const a=ARMS[(Math.random()*ARMS.length)|0];
    const r=a.r0+(a.r1-a.r0)*(.15+.7*Math.random());
    const th=armTh(a.t0,r,a.p)+gauss()*a.w*.4/r;
    const rd=Math.random();
    const c=rd<.55?C_V:(rd<.85?C_PINK:[.55,.5,1]),b=.6+.5*Math.random();
    gp(Math.cos(th)*r,gauss()*.05,Math.sin(th)*r,c,b*.9,.8+.7*Math.random(),omArm(r),.04+.05*Math.random(),1);
  });
  /* halo scatter + globular clusters */
  const GLOB=[];
  for(let k=0;k<11;k++)GLOB.push(new THREE.Vector3(gauss(),gauss(),gauss()).normalize().multiplyScalar(6+16*Math.random()));
  layer(.02,()=>{
    const d=new THREE.Vector3(gauss(),gauss(),gauss()).normalize().multiplyScalar(4+26*Math.pow(Math.random(),2.4));
    const c=pk([C_LV,C_LW]),b=.3+.25*Math.random();
    gp(d.x,d.y,d.z,c,b,.04+.03*Math.random(),(Math.random()-.5)*.004,.25+.3*Math.random());
  });
  layer(.01,()=>{
    const d=GLOB[(Math.random()*GLOB.length)|0];
    const c=pk([C_LV,C_LW]),b=.5+.3*Math.random();
    gp(d.x+gauss()*.24,d.y+gauss()*.24,d.z+gauss()*.24,c,b,.05+.04*Math.random(),(Math.random()-.5)*.006,.5);
  });
  /* disk bokeh */
  layer(.01,()=>{
    let r;do{r=-3.5*Math.log(1-Math.random());}while(r>15);
    const th=Math.random()*TAU,c=pk([C_V,C_PINK,C_DV]),b=.7+.5*Math.random();
    gp(Math.cos(th)*r,gauss()*.2,Math.sin(th)*r,c,b*.7,.045+.04*Math.random(),omDisk(r),.4+.4*Math.random(),0);
  });
  /* smooth disk — takes every remaining ember */
  layer(1,()=>{
    let r;do{r=-3.3*Math.log(1-Math.random());}while(r>15.5);
    const th=Math.random()*TAU,y=gauss()*(.10+.012*r);
    let c,b,sz,al;
    if(Math.random()<.05){c=pk([C_LW,C_BLUE]);b=.8+.4*Math.random();sz=.09+.06*Math.random();al=.9;}
    else{c=pk([C_V,C_DV,C_LV]);b=.35+.5*Math.pow(Math.random(),1.7);
         sz=.04+.055*Math.pow(Math.random(),2);al=.3+.55*Math.random();}
    gp(Math.cos(th)*r,y,Math.sin(th)*r,c,b,sz,omDisk(r),al);
  });
}
/* shapes[4] is a live buffer: galaxyStep() re-projects it from polar coords
   as the disc turns differentially (inner disk faster than the rim). */
function galaxyStep(dt){
  if(dt>0){
    /* ease to a near-stop after ~120 Myr of viewing so the arms never wind up */
    GAL.T+=dt*1.3*Math.max(0,1-(GAL.T-GAL.T0)/120);
  }
  const P=shapes[4],R=GAL.R,TH=GAL.TH,Y=GAL.Y,OM=GAL.OM,T=GAL.T;
  for(let j=0;j<N;j++){
    const th=TH[j]+T*OM[j],r=R[j],j3=j*3;
    P[j3]=Math.cos(th)*r;P[j3+1]=Y[j];P[j3+2]=Math.sin(th)*r;
  }
}
shapes.push(new Float32Array(N*3));
galaxyStep(0);

/* 5 — genesis: the world (fibonacci placeholder; rebuilt from earth pixels
       the moment the texture arrives) */
{
  const a=new Float32Array(N*3),GA=2.39996323;
  for(let i=0;i<N;i++){
    const y=1-2*(i+.5)/N,r=Math.sqrt(Math.max(0,1-y*y)),th=GA*i,R=GLOBE_R+.1+gauss()*.1;
    a[i*3]=Math.cos(th)*r*R;a[i*3+1]=y*R;a[i*3+2]=Math.sin(th)*r*R;
  }
  shapes.push(a);
}

const SEEDS=new Float32Array(N),SIZES=new Float32Array(N),DIRS=new Float32Array(N*3);
for(let i=0;i<N;i++){
  SEEDS[i]=Math.random();
  SIZES[i]=.6+Math.pow(Math.random(),3)*1.9;
  const v=new THREE.Vector3(gauss(),gauss(),gauss()).normalize().multiplyScalar(.5+Math.random());
  DIRS[i*3]=v.x;DIRS[i*3+1]=v.y;DIRS[i*3+2]=v.z;
}
for(let j=0;j<N;j++)GAL.GA[j*4]=GAL.GSZ[j]/SIZES[j];   /* px-size → multiplier on aSize */
const ARCS=[2.6,2.8,2.0,2.6,1.4];
const LAND=new Float32Array(N).fill(.7);  /* fallback ember-world glow */

/* ================= shaders ================= */
const VERT=`
attribute float aSeed;
attribute float aSize;
attribute float aAcc;
attribute float aLand;
attribute vec4 aGA;   /* galaxy: size mult, alpha, soft, - */
attribute vec3 aGC;   /* galaxy: colour */
uniform float uTime,uWobble,uSize,uScaleH,uEnergy,uPtrStr,uGlobe,uGal,uWind;
uniform float uRepel,uAspect;   /* scroll-field repel: strength (0 in hero), viewport aspect */
uniform vec2 uRepelPos;         /* cursor in NDC */
uniform vec3 uPointer;
uniform vec3 uRip[5];uniform float uRipT[5];
varying float vMix,vGlow,vDepth,vSeed,vAcc,vLand,vFres,vBack,vShell;
varying vec3 vGC;varying vec2 vGS;varying float vHit;
void main(){
  vec3 p=position;
  float t=uTime;
  float n1=sin(p.x*.32+t*.8+aSeed*6.283);
  float n2=cos(p.z*.28+t*.6+aSeed*4.71);
  float n3=sin(t*.45+aSeed*9.42);
  p.y+=n1*n2*uWobble*2.1;
  p.x+=n3*uWobble*.4;
  p.z+=n1*uWobble*.4;
  vec3 dv=p-uPointer;
  float f=exp(-dot(dv,dv)*.05)*uPtrStr;
  /* The mark stays INTACT under the cursor (only shines / twinkles — see vHit).
     Dust that blows away is a separate emitter (flyPts), like the old erosion
     effect. uWind = "mark stage" weight: no parting on the mark, gentle later. */
  p+=normalize(dv+vec3(1e-4))*f*.8*(1.-uWind);
  vHit=clamp(f*.9,0.,1.);
  vGlow=min(f*.9+uEnergy,1.4);
  /* CLICK RIPPLES — pooled (origin,birth) slots (NexusNode pattern): the
     shader derives each wave's age from uTime, so concurrent waves
     superpose and a new click never restarts a live one. Dead slots carry
     birth -1000, so amp clamps to 0. Glow joins vGlow → ember palette. */
  float ring=0.;vec3 push=vec3(0.);
  for(int i=0;i<5;i++){
    float age=t-uRipT[i];
    float amp=clamp(1.-age/2.4,0.,1.);
    vec3 rv=p-uRip[i];
    float rl=length(rv);
    float w=clamp((rl-age*1.4)*3.2,-40.,40.);
    float band=exp(-w*w)*amp;
    ring+=band;
    push+=rv/(rl+1e-3)*band;
  }
  ring=min(ring,1.5);
  p+=push*.5;
  vGlow=min(vGlow+ring*.45,1.4);vHit=min(vHit+ring*.5,1.);
  vMix=aSeed;vSeed=aSeed;vAcc=aAcc;vLand=aLand;vGC=aGC;vGS=aGA.yz;
  vec3 nW=normalize(mat3(modelMatrix)*normalize(position));
  vec4 wp=modelMatrix*vec4(p,1.);
  vec3 vDir=normalize(cameraPosition-wp.xyz);
  float facing=dot(nW,vDir);
  /* GENESIS geometry — everything smooth, nothing pops:
     vFres  — limb weight, near hemisphere only (clamped)
     vBack  — far-side fade spread over ~12° (was a hard step: rim pop)
     vShell — radius gate: how close the ember is to the world's shell.
              Flying embers keep full presence; the surface skin engages
              only as they ARRIVE, so the swarm visibly condenses INTO
              the globe instead of evaporating onto it. */
  vFres=clamp(1.-max(facing,0.),0.,1.);
  vBack=smoothstep(-.2,.08,facing);
  vShell=1.-smoothstep(0.,1.2,length(position)-7.9);
  vec4 mv=modelViewMatrix*vec4(p,1.);
  /* SCROLL-FIELD REPEL — after the hero, embers ease away from the cursor.
     Screen-space (so it feels the same at any depth / camera stage): each
     ember is pushed along the cursor→ember direction by a gaussian-weighted
     amount. Displacement ~ r*exp(-r²/R²): zero right under the cursor, peaks
     at ~R/1.4, fades to nothing beyond ~2R — a soft parting, never a blast.
     uRepel is 0 through the whole hero (the mark has its own pointer play). */
  if(uRepel>.001){
    vec4 cl=projectionMatrix*mv;
    if(cl.w>.1){
      vec2 da=cl.xy/cl.w-uRepelPos;
      da.x*=uAspect;
      float w=exp(-dot(da,da)/(.24*.24))*uRepel*.35;
      vec2 sh=da*w;
      sh.x/=uAspect;
      mv.xy+=sh*cl.w/vec2(projectionMatrix[0][0],projectionMatrix[1][1]);
    }
  }
  vDepth=-mv.z;
  gl_PointSize=min(uSize*aSize*(1.+vHit*.55)*mix(1.,aGA.x,uGal)*(1.+uEnergy*.4+vAcc*.4)*(1.-uGlobe*.3)*.09*uScaleH/max(vDepth,.1),72.);
  gl_Position=projectionMatrix*mv;
}`;
const FRAG=`
uniform vec3 uColA,uColB,uAcc,uGViolet;
uniform float uTime,uGlobe,uGal;
varying float vMix,vGlow,vDepth,vSeed,vAcc,vLand,vFres,vBack,vShell;
varying vec3 vGC;varying vec2 vGS;varying float vHit;
void main(){
  vec2 c=gl_PointCoord-.5;
  float d=length(c);
  if(d>.5)discard;
  /* SHARP SPRITE — crisp bright core + small soft halo (was one wide
     blurry falloff), livelier per-particle twinkle */
  float core=1.-smoothstep(.15,.33,d);
  float halo=1.-smoothstep(0.,.5,d);
  halo*=halo;
  float a=min(core*.95+halo*mix(.4,.06,uGal),1.);
  /* GALAXY — bokeh / nebula embers swap the sharp spark for a soft disc, and
     every ember takes its own alpha; all gated by uGal so no other stage changes */
  float dd=d*2.;
  float sa=exp(-dd*dd*3.)*(1.-smoothstep(.8,1.,dd));
  a=mix(a,sa,vGS.y*uGal);
  a*=mix(1.,vGS.x,uGal);
  a*=.68+.32*sin(uTime*(1.8+vSeed*2.6)+vSeed*37.);
  /* TOUCH — embers under the cursor flash and twinkle fast */
  float tw=.5+.5*sin(uTime*(16.+vSeed*22.)+vSeed*61.);
  a=min(a*(1.+vHit*(.6+1.6*tw)),1.);
  a*=1.-smoothstep(40.,88.,vDepth);
  a*=smoothstep(.4,3.5,vDepth);
  vec3 col=mix(uColB,uColA,clamp(vMix*.72+vGlow,0.,1.));
  col+=uColA*vGlow*.9;
  col=mix(col,uAcc*(.75+vGlow*.5),vAcc*.85);
  col=mix(col,vGC*1.0*(1.+vGlow*.4),uGal);       /* galaxy palette */
  col=mix(col,vec3(1.),core*.28*(1.-vGS.y*uGal));          /* hot white centre — spark */
  /* GENESIS — the world IS its particles. Landed embers become the skin:
     a dim violet interior floor (texture, not glow — city-light sparkle)
     and a bright limb. The gate is radius-based (vShell), so the flying
     swarm stays fully visible and only takes on the skin as it arrives. */
  if(uGlobe>.001){
    float land=clamp(vLand,0.,1.);
    float limb=smoothstep(.32,.75,vFres);
    vec3 gcol=uGViolet*(.08+.34*land)*(.3+.7*vSeed*vSeed);
    gcol=mix(gcol,vec3(.85,.82,1.)*(.25+.5*land),core*vSeed*vSeed*.35);  /* city-light glints */
    gcol+=uGViolet*pow(vFres,1.8)*.6;
    gcol*=.97+.03*sin(uTime*.5);
    col=mix(col,min(gcol,vec3(1.)),uGlobe);
    float gate=(.38+.62*limb)*vBack;
    a*=mix(1.,gate,vShell*uGlobe);
  }
  gl_FragColor=vec4(col,a);
}`;

/* ================= scroll keyframes ================= */
const CAM=[
  [[0,0,34],[0,-1,0]],
  [[17,5.5,15.5],[0,.5,0]],
  [[0,4.5,20.5],[0,0,0]],
  [[0,15.5,20.5],[0,-1.5,0]],
  [[0,12.5,16.5],[0,.5,0]],
  [[0,1.2,26.5],[0,-1,0]],
];
const WOB=[.02,.5,.1,1.5,.12,.14];
const SIZ=[1.25,1.07,1.14,.96,1.09,1.14];
const ROT=[0,.015,.16,.03,.08,.05];
/* GLOBE_HOME_Y — local Y rotation (radians) that faces India toward the
   camera once the globe has formed. Derived from the earth texture's
   equirectangular mapping (buildGenesisFromEarth: ph=(x+.5)/W*TAU) for
   India's centre (~79°E, the commonly-cited geographic centre near
   Nagpur): rot = PI/2 - ph. Single knob — nudge by a small amount (radians)
   and re-check if India isn't quite centred; a full turn is TAU (~6.283). */
const GLOBE_HOME_Y=-2.95;
const CA=['#ffffff','#f0eeff','#ffffff','#ece6ff','#ffffff','#faf9ff'].map(c=>new THREE.Color(c));
const CB=['#9d74ff','#7a68c8','#8a72ec','#7c66dc','#9468ff','#8a82b4'].map(c=>new THREE.Color(c));

/* ================= interaction state ================= */
const ndc=new THREE.Vector2(0,0),ndcT=new THREE.Vector2(0,0);
let ptrBoost=0,rotFree=0,curP=0;
/* scroll-field repel state: cursor (smoothed, NDC), eased strength, cursor-in-window flag */
const rNdc=new THREE.Vector2(0,0);
let repelAmt=0,ptrIn=false;
let lastActive=performance.now(),rippleEnd=0;
const ripT=[-1000,-1000,-1000,-1000,-1000];  /* ripple pool birth times, shader clock */
let lastGlO='';
let globeMix=0,globeMixS=0,globeSpin=0,globeTilt=0,globeDragX=0,globeDragY=0,globeDragging=false,grabHint=false;
/* late-texture melt: if the earth map resolves mid-finale, the particle
   target crossfades in instead of teleporting the swarm */
let globeBlendFrom=null,globeBlendLand=null,globeBlendToLand=null,globeBlendT=1;
let texReady=false,texFade=0;
let dragPX=0,dragPY=0;
const ray=new THREE.Raycaster();
const ORIGIN=new THREE.Vector3(),ptrW=new THREE.Vector3(),ptrL=new THREE.Vector3(),lookV=new THREE.Vector3();
/* PTR_PLANE — the flat z=0 surface the embers live on. The hero mark is
   parked off-centre (shiftX/shiftY in buildMarkShape) so the pointer's
   world position has to come from where the ray actually crosses that
   surface, not from the point on the ray nearest the world origin: that
   origin-relative shortcut is fine for shapes centred on (0,0,0), but for
   the off-centre mark it warps unevenly left-to-right, which read as the
   glow/shine only responding on one side. */
const PTR_PLANE=new THREE.Plane(new THREE.Vector3(0,0,1),0);

function endDrag(){
  if(globeDragging){
    globeDragging=false;
    document.body.classList.remove('dragging');
  }
}
addEventListener('pointermove',e=>{
  lastActive=performance.now();
  if(e.pointerType!=='touch')ptrIn=true;
  const nx=(e.clientX/innerWidth)*2-1,ny=-(e.clientY/innerHeight)*2+1;
  /* a fast flick swells the field gently (cap .8), never detonates it */
  ptrBoost=Math.min(ptrBoost+Math.hypot(nx-ndcT.x,ny-ndcT.y)*.9,.8);
  ndcT.set(nx,ny);
  /* dragging the world — your GlobeCanvas gestures, verbatim in feel */
  if(globeDragging){
    globeDragY+=(e.clientX-dragPX)*.005;
    globeDragX=clamp(globeDragX+(e.clientY-dragPY)*.005,-Math.PI/2.2,Math.PI/2.2);
    dragPX=e.clientX;dragPY=e.clientY;
  }
},{passive:true});
addEventListener('pointerdown',e=>{
  ptrBoost=1.8;  /* press = one soft pulse */
  lastActive=performance.now();
  /* CLICK RIPPLE — claim a pool slot (NexusNode pattern): a finished slot,
     else retire the wave with the least life left. Origin is the current
     group-local pointer (same space as uPointer); birth is the shader
     clock, so three.js needs no manual uniform upload. */
  if(engine&&!reduced){
    const tSec=engine.uniforms.uTime.value;
    let idx=0,least=Infinity;
    for(let i=0;i<5;i++){
      if(ripT[i]<tSec-3){idx=i;break;}
      const rem=ripT[i]+2.4-tSec;
      if(rem<least){least=rem;idx=i;}
    }
    engine.uniforms.uRip.value[idx].copy(ptrL);
    engine.uniforms.uRipT.value[idx]=tSec;
    ripT[idx]=tSec;
    rippleEnd=performance.now()+2400;
  }
  if(globeMixS>.5&&e.target instanceof Element&&!e.target.closest('button,a,input,textarea,label')){
    globeDragging=true;
    dragPX=e.clientX;dragPY=e.clientY;
    document.body.classList.add('dragging');
  }
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{ptrIn=false;},{passive:true});
addEventListener('blur',()=>{ptrIn=false;});
addEventListener('pointerup',endDrag,{passive:true});
addEventListener('pointercancel',endDrag,{passive:true});

/* ================= three.js setup ================= */
try{
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance'});
  renderer.setClearColor(0x0a0a0d,0);  /* transparent: the topo field behind stays visible */
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,COARSE?1:2));
  renderer.setSize(innerWidth,innerHeight,false);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,240);

  /* —— DRIFTING DUST — the starfield floats like motes in a lit room.
        All motion lives in the vertex shader (three slow, incommensurate
        currents at a unique phase per mote), so the CPU never touches it. —— */
  {
    const M=1200,sp=new Float32Array(M*3),sd=new Float32Array(M),twk=new Float32Array(M);
    for(let i=0;i<M;i++){
      const v=new THREE.Vector3(gauss(),gauss(),gauss()).normalize().multiplyScalar(55+Math.random()*55);
      sp[i*3]=v.x;sp[i*3+1]=v.y*.6;sp[i*3+2]=v.z;
      sd[i]=Math.random();
      twk[i]=.2+Math.random()*1.1;
    }
    const sg=new THREE.BufferGeometry();
    sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
    sg.setAttribute('aSeed',new THREE.BufferAttribute(sd,1));
    sg.setAttribute('aTw',new THREE.BufferAttribute(twk,1));
    const du={
      uTime:{value:0},uScaleH:{value:1},uAmp:{value:reduced?.18:1},
      uOpacity:{value:.5},uCol:{value:new THREE.Color(0x9a94c9)}
    };
    const dmat=new THREE.ShaderMaterial({
      uniforms:du,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,
      vertexShader:`
        attribute float aSeed;
        attribute float aTw;
        uniform float uTime,uScaleH,uAmp;
        varying float vTw,vDepth,vSeed;
        void main(){
          vec3 p=position;
          float ph=aSeed*6.28318,t=uTime;
          p.x+=(sin(t*(.05+aTw*.05)+ph)*2.6+sin(t*.023+ph*2.7)*1.5)*uAmp;
          p.y+=(cos(t*(.04+aTw*.04)+ph*1.9)*1.9+sin(t*.017+ph*4.1)*1.2)*uAmp;
          p.z+=sin(t*.037+ph*3.3)*2.2*uAmp;
          float breathe=.85+.3*sin(t*(.3+aTw*.5)+ph*7.);
          vec4 mv=modelViewMatrix*vec4(p,1.);
          vDepth=-mv.z;
          gl_PointSize=clamp((.34+aSeed*.42)*breathe*uScaleH/max(vDepth,.1),1.,9.);
          vSeed=aSeed;
          vTw=mix(1.,.55+.45*sin(t*(.2+aTw*.6)+ph*11.3),uAmp);
          gl_Position=projectionMatrix*mv;
        }`,
      fragmentShader:`
        uniform vec3 uCol;
        uniform float uOpacity;
        varying float vTw,vDepth,vSeed;
        void main(){
          vec2 c=gl_PointCoord-.5;
          float d=length(c);
          if(d>.5)discard;
          float a=1.-smoothstep(.12,.36,d);
          a=min(a+.25*(1.-smoothstep(0.,.5,d)),1.);
          a*=smoothstep(10.,26.,vDepth);
          a*=(1.-smoothstep(95.,160.,vDepth));
          vec3 col=mix(uCol,vec3(.97,.96,1.),vSeed*.55);
          gl_FragColor=vec4(col,a*uOpacity*vTw);
        }`
    });
    const dpts=new THREE.Points(sg,dmat);
    dpts.frustumCulled=false;
    dpts.renderOrder=-3;
    const dgroup=new THREE.Group();
    dgroup.add(dpts);
    scene.add(dgroup);
    dust={group:dgroup,uniforms:du};
  }

  const uniforms={
    uTime:{value:0},uWobble:{value:.02},uSize:{value:1.12},uScaleH:{value:1},
    uEnergy:{value:0},uPtrStr:{value:1},uGlobe:{value:0},uGal:{value:0},uWind:{value:1},
    uPointer:{value:new THREE.Vector3(999,999,999)},
    uRepel:{value:0},uRepelPos:{value:new THREE.Vector2(9,9)},uAspect:{value:innerWidth/innerHeight},
    uRip:{value:[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()]},
    uRipT:{value:[-1000,-1000,-1000,-1000,-1000]},
    uColA:{value:new THREE.Color()},uColB:{value:new THREE.Color()},
    uAcc:{value:new THREE.Color('#8422f7')},
    uGViolet:{value:new THREE.Color(GLOBE_VIOLET)}
  };
  const geo=new THREE.BufferGeometry();
  const posAttr=new THREE.BufferAttribute(new Float32Array(N*3),3);
  geo.setAttribute('position',posAttr);
  geo.setAttribute('aSeed',new THREE.BufferAttribute(SEEDS,1));
  geo.setAttribute('aSize',new THREE.BufferAttribute(SIZES,1));
  accAttr=new THREE.BufferAttribute(new Float32Array(N),1);
  accAttr.array.set(CORE.acc);
  geo.setAttribute('aAcc',accAttr);
  landAttr=new THREE.BufferAttribute(LAND,1);
  geo.setAttribute('aLand',landAttr);
  geo.setAttribute('aGA',new THREE.BufferAttribute(GAL.GA,4));
  geo.setAttribute('aGC',new THREE.BufferAttribute(GAL.GC,3));
  /* NO DEPTH TEST — occlusion is the shader's job (vBack/vShell/limb
     gates, atmosphere rim gate), so no invisible depth wall can ever
     cull the swarm mid-flight. Nothing anywhere writes depth. */
  const mat=new THREE.ShaderMaterial({uniforms,vertexShader:VERT,fragmentShader:FRAG,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending});
  const points=new THREE.Points(geo,mat);
  points.frustumCulled=false;
  const group=new THREE.Group();
  group.add(points);
  scene.add(group);

  /* —— THE GENESIS WORLD — a GLASS globe beneath its own embers.
        Draw order (painter's, no depth): dust → glass body → embers →
        atmosphere ring. The body is translucent (GLOBE_GLASS): the
        arriving embers render on top of it, dust shows through it, and
        the world reads as being made from the particle field itself. —— */
  const gseg=isMobile?32:48;
  const phCv=document.createElement('canvas');phCv.width=phCv.height=2;
  const phx=phCv.getContext('2d');phx.fillStyle='#000';phx.fillRect(0,0,2,2);
  const phTex=new THREE.CanvasTexture(phCv);
  const globeBodyMat=new THREE.ShaderMaterial({
    uniforms:{
      uTime:{value:0},uFade:{value:0},uHasTex:{value:0},
      uMain:{value:new THREE.Color(GLOBE_VIOLET)},uGlow:{value:new THREE.Color(GLOBE_VIOLET)},
      uTexture:{value:phTex}
    },
    vertexShader:`
      varying vec2 vUv;varying vec3 vNw;varying vec3 vView;
      void main(){
        vUv=uv;
        vNw=normalize(mat3(modelMatrix)*normal);
        vec4 wp=modelMatrix*vec4(position,1.);
        vView=normalize(cameraPosition-wp.xyz);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }`,
    fragmentShader:`
      uniform float uTime,uFade,uHasTex;
      uniform vec3 uMain,uGlow;
      uniform sampler2D uTexture;
      varying vec2 vUv;varying vec3 vNw;varying vec3 vView;
      void main(){
        vec3 mapColor=texture2D(uTexture,vUv).rgb;
        float luminance=(mapColor.r+mapColor.g+mapColor.b)/3.;
        /* uHasTex is a FADE, not a switch: when the earth map arrives
           late, the continents melt onto the glass instead of snapping */
        float landMask=smoothstep(.15,.4,luminance)*uHasTex;
        float shade=smoothstep(.15,.6,luminance)*uHasTex;
        /* LIGHT LAND — bright violet continents lifted 30% toward white,
           shaded by the map so regions keep their own contrast; oceans
           near-black, so the contrast carries the look */
        float lit=max(dot(vNw,normalize(vec3(.5,.3,1.))),0.);
        vec3 land=mix(uMain,vec3(.97,.96,1.),.5)*(1.0+.55*shade)*(.85+.15*lit);
        vec3 col=mix(vec3(.004,.004,.009),land,landMask);
        /* the limb owns the surface's added light */
        float fres=pow(1.-max(dot(vNw,vView),0.),2.5);
        col+=uGlow*fres*.9;
        col*=.97+.03*sin(uTime*.5);
        /* faint dither — kills banding in the near-black oceans */
        col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/160.;
        /* GLASS — deliberately translucent so the embers above and the
           dust behind read through it: a world made from its particles */
        gl_FragColor=vec4(col,uFade*mix(${GLOBE_GLASS.toFixed(2)},.9,landMask));
      }`,
    transparent:true,depthWrite:false,depthTest:false
  });
  const globeBody=new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R*.985,gseg,gseg),globeBodyMat);
  globeBody.renderOrder=-1;
  globeBody.visible=false;
  globeBody.frustumCulled=false;
  group.add(globeBody);

  /* atmosphere — backside additive ring. Confined geometrically to the
     annulus OUTSIDE the body's silhouette (vNormal.z gated): the ring
     runs projected radius ≈ 7.7→8.9, so the backside center can never
     glow — no depth buffer needed, and nothing pops. */
  const ATM_MESH=GLOBE_R*1.5;    /* geometry — a bit bigger than the glow's reach */
  const ATM_OUT=GLOBE_R*1.4;     /* where the glow has fully faded to nothing */
  const atmMat=new THREE.ShaderMaterial({
    uniforms:{uColor:{value:new THREE.Color(GLOBE_VIOLET)},uFade:{value:0},
      uB:{value:GLOBE_R*.985},uO:{value:ATM_OUT}},
    vertexShader:`
      varying vec3 vPos;varying vec3 vC;
      void main(){
        vec4 mv=modelViewMatrix*vec4(position,1.);
        vPos=mv.xyz;
        vC=(modelViewMatrix*vec4(0.,0.,0.,1.)).xyz;
        gl_Position=projectionMatrix*mv;
      }`,
    fragmentShader:`
      uniform vec3 uColor;
      uniform float uFade,uB,uO;
      varying vec3 vPos;varying vec3 vC;
      void main(){
        /* perspective-correct angular distance from the globe's centre,
           mapped so d=0 is the body's edge and d=1 is where light is gone */
        float dC=length(vC);
        float ang=acos(clamp(dot(normalize(vPos),vC/dC),-1.,1.));
        float angB=asin(uB/dC),angO=asin(min(uO/dC,.999));
        float d=(ang-angB)/(angO-angB);
        /* light fades with distance: bright at the limb, long soft tail
           (zero value AND zero slope at d=1, so no visible outer edge) */
        float g=pow(clamp(1.-max(d,0.),0.,1.),2.6);
        g*=smoothstep(-.4,0.,d);          /* ease in over the body's rim */
        vec3 c=mix(uColor,vec3(.93,.93,1.),.3);
        /* premultiplied additive: alpha tracks glow strength, so where the
           glow is ~0 the canvas stays transparent (no opaque black disc) */
        float k=g*.36*uFade;
        gl_FragColor=vec4(c*k,k);
      }`,
    side:THREE.BackSide,transparent:true,depthWrite:false,depthTest:false,
    blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor
  });
  const globeAtm=new THREE.Mesh(new THREE.SphereGeometry(ATM_MESH,gseg,gseg),atmMat);
  globeAtm.renderOrder=1;
  globeAtm.visible=false;
  globeAtm.frustumCulled=false;
  group.add(globeAtm);

  /* —— FLY-AWAY DUST — hover the mark and tiny copies of its own embers
        (same colour) break off and blow away up-left on the wind, fading as
        they go. The mark itself is never deformed. Pooled, CPU-stepped. —— */
  const FLY_N=COARSE?0:(isMobile?240:800);
  let fly=null;
  if(FLY_N){
    const fPos=new Float32Array(FLY_N*3),fVel=new Float32Array(FLY_N*3),
          fLife=new Float32Array(FLY_N),fDec=new Float32Array(FLY_N),
          fSize=new Float32Array(FLY_N),fCol=new Float32Array(FLY_N*3),fSd=new Float32Array(FLY_N);
    const fg=new THREE.BufferGeometry();
    const aPos=new THREE.BufferAttribute(fPos,3).setUsage(THREE.DynamicDrawUsage);
    const aLife=new THREE.BufferAttribute(fLife,1).setUsage(THREE.DynamicDrawUsage);
    fg.setAttribute('position',aPos);
    fg.setAttribute('aLife',aLife);
    fg.setAttribute('aSize',new THREE.BufferAttribute(fSize,1));
    fg.setAttribute('aCol',new THREE.BufferAttribute(fCol,3));
    const fu={uScaleH:{value:1},uTime:{value:0}};
    const fm=new THREE.ShaderMaterial({uniforms:fu,transparent:true,depthWrite:false,depthTest:false,
      blending:THREE.AdditiveBlending,
      vertexShader:`
        attribute float aLife;attribute float aSize;attribute vec3 aCol;
        uniform float uScaleH;varying float vL;varying vec3 vC;
        void main(){
          vec4 mv=modelViewMatrix*vec4(position,1.);
          vL=aLife;vC=aCol;
          gl_Position=projectionMatrix*mv;
          gl_PointSize=min(aSize*(.55+.45*aLife)*1.25*.09*uScaleH/max(-mv.z,.1),40.);
        }`,
      fragmentShader:`
        varying float vL;varying vec3 vC;
        void main(){
          if(vL<=0.)discard;
          vec2 c=gl_PointCoord-.5;float d=length(c);
          if(d>.5)discard;
          float core=1.-smoothstep(.12,.34,d);
          float halo=1.-smoothstep(0.,.5,d);halo*=halo;
          float a=min(core+halo*.35,1.)*pow(vL,.8);
          gl_FragColor=vec4(mix(vC,vec3(1.),core*.35),a);
        }`});
    const fp=new THREE.Points(fg,fm);
    fp.frustumCulled=false;fp.renderOrder=3;
    group.add(fp);
    let head=0;
    fly={
      u:fu,
      emit(j){
        const i=head;head=(head+1)%FLY_N;
        const b=engine.baseArr,i3=i*3,j3=j*3;
        fPos[i3]=b[j3];fPos[i3+1]=b[j3+1];fPos[i3+2]=b[j3+2];
        /* wind: up and to the left, each mote its own speed */
        const sp=1.8+Math.random()*3.2;
        fVel[i3]=-sp*(.55+Math.random()*.6);
        fVel[i3+1]=sp*(.6+Math.random()*.7);
        fVel[i3+2]=(Math.random()-.5)*.9;
        fLife[i]=1;
        fDec[i]=.22+Math.random()*.5;          /* 2–4.5 s of flight */
        fSize[i]=.9+Math.random()*1.8;
        fSd[i]=Math.random()*6.28;
        const violet=accAttr&&accAttr.array[j]>.5;
        if(violet){fCol[i3]=.62;fCol[i3+1]=.36;fCol[i3+2]=1;}
        else{const w=.85+Math.random()*.15;fCol[i3]=w;fCol[i3+1]=w*.96;fCol[i3+2]=1;}
        fg.attributes.aCol.needsUpdate=true;fg.attributes.aSize.needsUpdate=true;
      },
      step(dt,t){
        let any=false;
        for(let i=0;i<FLY_N;i++){
          if(fLife[i]<=0)continue;
          any=true;
          const i3=i*3,k=1-.3*dt;               /* light drag */
          fVel[i3]*=k;fVel[i3+1]*=k;fVel[i3+2]*=k;
          /* gusty flutter — dust, not bullets */
          fVel[i3]+=Math.sin(t*2.3+fSd[i])*.9*dt;
          fVel[i3+1]+=Math.cos(t*1.9+fSd[i]*1.7)*.9*dt;
          fPos[i3]+=fVel[i3]*dt;fPos[i3+1]+=fVel[i3+1]*dt;fPos[i3+2]+=fVel[i3+2]*dt;
          fLife[i]-=fDec[i]*dt;
          if(fLife[i]<0)fLife[i]=0;
        }
        if(any){aPos.needsUpdate=true;aLife.needsUpdate=true;}
      }
    };
  }

  /* —— GALAXY GLOW — soft core light + a bar-aligned smear, additive, faded in
        with uGal. The bar group turns with the bar embers (mirrored: +rot). —— */
  const galFx=[],galGroup=new THREE.Group(),barGroup=new THREE.Group();
  galGroup.add(barGroup);group.add(galGroup);
  function glowTex(size,stops,sy){
    const cv=document.createElement('canvas');cv.width=cv.height=size;
    const x=cv.getContext('2d');x.translate(size/2,size/2);x.scale(1,sy||1);
    const g=x.createRadialGradient(0,0,0,0,0,size/2);
    stops.forEach(t=>g.addColorStop(t[0],t[1]));
    x.fillStyle=g;x.fillRect(-size,-size,2*size,2*size);
    return new THREE.CanvasTexture(cv);
  }
  function fxMat(tex,op){
    return new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false});
  }
  function fxPlane(parent,tex,size,base){
    const m=new THREE.Mesh(new THREE.PlaneGeometry(size*G_SC,size*G_SC),fxMat(tex));
    m.rotation.x=-Math.PI/2;m.renderOrder=-1;m.frustumCulled=false;parent.add(m);
    galFx.push({mat:m.material,base,obj:m});
  }
  function fxSprite(tex,size,base){
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false}));
    sp.scale.set(size*G_SC,size*G_SC,1);sp.renderOrder=-1;galGroup.add(sp);
    galFx.push({mat:sp.material,base,obj:sp});
  }
  fxPlane(galGroup,glowTex(256,[[0,'rgba(125,108,255,.5)'],[.4,'rgba(110,95,240,.15)'],[1,'rgba(100,85,230,0)']]),55,.16);
  fxPlane(galGroup,glowTex(256,[[0,'rgba(255,244,235,.85)'],[.35,'rgba(225,205,255,.25)'],[1,'rgba(200,180,255,0)']]),24,.18);
  const barStops=[[0,'rgba(250,244,255,.95)'],[.18,'rgba(220,205,255,.7)'],[.45,'rgba(170,150,255,.22)'],[1,'rgba(150,130,255,0)']];
  fxPlane(barGroup,glowTex(512,barStops,.5),15,.38);
  fxSprite(glowTex(256,barStops),4.2,.6);
  fxSprite(glowTex(128,[[0,'rgba(255,252,250,1)'],[.3,'rgba(240,228,255,.7)'],[1,'rgba(210,190,255,0)']]),1.3,.3);
  galGroup.visible=false;

  function updateScale(){
    const sh=renderer.domElement.height*.5/Math.tan(Math.PI/6);
    uniforms.uScaleH.value=sh;
    if(dust)dust.uniforms.uScaleH.value=sh;
    if(fly)fly.u.uScaleH.value=sh;
  }
  updateScale();

  /* baseArr: LOGICAL buffer (what morph computes). posAttr: VISIBLE buffer. */
  const baseArr=new Float32Array(N*3);

  let lastP=-1;
  function morph(p,force){
    if(!force&&Math.abs(p-lastP)<.00005)return false;
    lastP=p;
    const i=clamp(Math.floor(p),0,4);
    const t=clamp(p-i,0,1);
    const A=shapes[i],B=shapes[i+1],arc=ARCS[i];
    /* THE LAST FLIGHT — its own timing: quintic ease (buttery endpoints),
       longer staggered travel (.67 of the segment), and a swirl that winds
       the disc onto the world — zero at BOTH segment ends, peak mid-flight,
       so the boundary with the previous segment stays perfectly continuous. */
    const slow=(i===4);
    const rate=slow?1.15:1.9;
    const st=(slow?.42:.35)*(i===0?.5:1);
    for(let j=0;j<N;j++){
      const d=SEEDS[j]*st;
      let l=(t-d)*rate;
      l=l<0?0:l>1?1:l;
      const e=slow?l*l*l*(l*(l*6-15)+10):l*l*(3-2*l);
      const j3=j*3;
      const s=Math.sin(Math.PI*e)*arc;
      const x=A[j3]+(B[j3]-A[j3])*e+DIRS[j3]*s;
      const y=A[j3+1]+(B[j3+1]-A[j3+1])*e+DIRS[j3+1]*s;
      const z=A[j3+2]+(B[j3+2]-A[j3+2])*e+DIRS[j3+2]*s;
      if(slow){
        const sw=1.2*e*(1-e),cw=Math.cos(sw),sn=Math.sin(sw);
        baseArr[j3]=x*cw-z*sn;
        baseArr[j3+1]=y;
        baseArr[j3+2]=x*sn+z*cw;
      }else{
        baseArr[j3]=x;baseArr[j3+1]=y;baseArr[j3+2]=z;
      }
    }
    return true;
  }
  morph(0,true);
  posAttr.array.set(baseArr);
  posAttr.needsUpdate=true;

  engine={renderer,scene,camera,uniforms,group,morph,updateScale,posAttr,baseArr,globeBody,globeAtm,galFx,galGroup,barGroup,fly,points};
}catch(err){
  canvas.remove();
}

bootMark();

/* =====================================================================
   THE WORLD — sample the real earth texture and rebuild the genesis
   formation as ember continents, weighted by actual land area.
   ===================================================================== */
function buildGenesisFromEarth(img){
  const W=360,H=180;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const ctx=cv.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(img,0,0,W,H);
  const d=ctx.getImageData(0,0,W,H).data;

  /* land points with the exact luminance mask the body shader uses,
     weighted by sin(theta) so equirect pixels near the poles don't bunch */
  const th=[],ph=[],cw=[0];
  let tot=0;
  for(let y=0;y<H;y++){
    const theta=(y+.5)/H*Math.PI,area=Math.sin(theta);
    for(let x=0;x<W;x++){
      const k=(y*W+x)*4;
      const lum=(d[k]*.299+d[k+1]*.587+d[k+2]*.114)/255;
      const m=sstep(clamp((lum-.15)/.25,0,1));
      if(m<=0)continue;
      const w=m*area;
      if(w<.02)continue;
      tot+=w;
      th.push(theta);
      ph.push((x+.5)/W*TAU);
      cw.push(tot);
    }
  }
  if(th.length<200)throw new Error('no land');

  const pick=()=>{
    const r=Math.random()*tot;
    let lo=1,hi=cw.length-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(cw[mid]<r)lo=mid+1;else hi=mid;}
    return Math.min(lo,cw.length-1)-1;
  };

  const pos=new Float32Array(N*3),land=new Float32Array(N);
  for(let i=0;i<N;i++){
    if(i<N*.78){
      /* continents of ember — uv→sphere via SphereGeometry's own mapping */
      const k=pick();
      const t=clamp(th[k]+(Math.random()-.5)*.03,.02,Math.PI-.02);
      const p=ph[k]+(Math.random()-.5)*.055;
      const st=Math.sin(t),R=GLOBE_R+.02+Math.random()*.16;
      pos[i*3]  =-R*Math.cos(p)*st;
      pos[i*3+1]= R*Math.cos(t);
      pos[i*3+2]= R*Math.sin(p)*st;
      land[i]=1;
    }else{
      /* speckle on black water (visible only at the limb, like land) */
      const y=1-2*Math.random(),rr=Math.sqrt(Math.max(0,1-y*y)),a=Math.random()*TAU;
      const R=GLOBE_R+.02+Math.random()*.15;
      pos[i*3]=Math.cos(a)*rr*R;pos[i*3+1]=y*R;pos[i*3+2]=Math.sin(a)*rr*R;
      land[i]=.14;
    }
  }
  shapes[5]=pos;
  if(landAttr){
    if(curP>3.2&&engine&&!introFrom){
      /* THE TEXTURE ARRIVED MID-STORY — snapshot what is on screen and
         MELT into the continents over ~1.1s (per-particle stagger),
         instead of teleporting the whole swarm to the new target */
      globeBlendFrom=new Float32Array(engine.posAttr.array);
      globeBlendLand=new Float32Array(landAttr.array);
      globeBlendToLand=land;
      globeBlendT=0;
      engine.morph(curP,true);        /* rewrite the LOGICAL target only */
    }else{
      landAttr.array.set(land);landAttr.needsUpdate=true;
      if(engine){
        engine.morph(curP,true);
        /* texture arrived: glide from what's on screen — the old snap here
           teleported the swarm at a random moment after load */
        if(!introFrom){ glideFrom=new Float32Array(engine.posAttr.array); glideT=0; }
      }
    }
  }
}

function bootEarth(){
  /* Local texture only — no external fallbacks. If it ever fails to load,
     the chain ends gracefully (dark world + rim embers, per trySrc). */
  const srcs=['public/img/earth-2048.jpg'];
  let i=0;
  const next=()=>{
    if(i>=srcs.length)return;  /* graceful: dark world + rim embers only */
    trySrc(srcs[i++],img=>{
      if(engine&&engine.globeBody){
        const tex=new THREE.Texture(img);
        tex.needsUpdate=true;
        tex.anisotropy=Math.min(4,engine.renderer.capabilities.getMaxAnisotropy());
        engine.globeBody.material.uniforms.uTexture.value=tex;
        texReady=true;   /* continents melt in via texFade in the loop */
      }
      try{buildGenesisFromEarth(img);}catch(e){}
    },next,6000);
  };
  next();
}
bootEarth();

/* ================= events ================= */
let lastW=innerWidth,lastH=innerHeight;
addEventListener('resize',()=>{
  relayout();
  /* width-gated (+ a real height jump, e.g. tablet split-view): mobile
     URL-bar show/hide fires small height-only resizes on scroll — those
     must not re-touch camera/scale, or the swarm visibly snaps size
     every time the browser chrome collapses (the old snap read as a
     reload). A genuine resize always pairs with a width change, or a
     height delta far bigger than any toolbar. */
  const realResize=innerWidth!==lastW||Math.abs(innerHeight-lastH)>150;
  if(realResize&&engine){
    engine.camera.aspect=innerWidth/innerHeight;
    engine.camera.updateProjectionMatrix();
    engine.renderer.setSize(innerWidth,innerHeight,false);
    engine.updateScale();
  }
  if(innerWidth!==lastW){ lastW=innerWidth; refreshOpening(); }
  lastH=innerHeight;
  setTimeout(relayout,300);
});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(relayout);
/* NOTE: no continuous ResizeObserver on #main here on purpose. The review
   engine appends ~10 syslog lines + chat messages over ~18s after first
   seen, and every height growth recomputed `range` → stepped curP down a
   notch → the morph target teleported → the field visibly snapped/blinked
   "a few times, a few seconds in". Range now updates only on load / resize
   / fonts (static, unnoticed); demo-driven growth causes zero re-anchoring.
   When text/labels are trimmed later, re-tune range manually instead. */

/* ================= adaptive perf guard =================
   One-way, two-step downgrade for weak devices: if frames run
   sustained-slow (not a one-off hitch) we trim the point count that
   actually gets drawn and cap DPR — cheap (setDrawRange, no rebuild)
   and never oscillates back up, so it can't fight the scroll-smoothing
   above. Silent tab-crash/reload under memory+GPU pressure is exactly
   what this exists to prevent. */
let perfTier=0,perfBadT=0,perfWarmT=0;
function perfGuard(dt){
  perfWarmT+=dt;
  if(perfWarmT<2.5||!engine||!engine.points||perfTier>=2)return;
  if(dt>1/24)perfBadT+=dt; else perfBadT=Math.max(0,perfBadT-dt*2);
  if(perfBadT>1.8){
    perfTier++;perfBadT=0;
    const range=perfTier===1?Math.floor(N*.6):Math.floor(N*.35);
    engine.points.geometry.setDrawRange(0,range);
    engine.renderer.setPixelRatio(perfTier===1?Math.min(devicePixelRatio||1,1.5):1);
    engine.renderer.setSize(innerWidth,innerHeight,false);
    engine.updateScale();
  }
}

/* ================= main loop ================= */
let cur=window.scrollY||0,lastFrameP=0,lastNow=performance.now(),flyAcc=0;
function tick(now){
  requestAnimationFrame(tick);
  if(document.hidden)return;  /* background tab: skip work, rAF re-arms on return */
  const dt=clamp((now-lastNow)/1000,.001,.05);lastNow=now;
  perfGuard(dt);

  const tgt=window.scrollY||0;
  /* single smoothing layer: fast follow so one scroll = one move.
     The old dt*3.2 + 0.6s glide double-smoothing caused
     slow-fast-slow (hang) inside a single wheel tick. */
  cur=coarse||reduced?tgt:cur+(tgt-cur)*Math.min(1,dt*8);
  if(Math.abs(tgt-cur)<.5)cur=tgt;
  curP=clamp(cur/range,0,1)*5;
  const vel=(curP-lastFrameP)/dt;lastFrameP=curP;
  /* full rate always while visible: the 60→30fps step-down read as lag
     whenever the pointer rested — smoothness beats the battery saving */

  if(engine){
    const u=engine.uniforms;

    /* GALAXY — while it is (or is about to be) on screen the disc turns
       differentially: re-project shapes[4] and force a morph each frame */
    const galOn=!reduced&&curP>3&&curP<4.85;
    if(galOn)galaxyStep(dt);
    const dirty=engine.morph(curP,galOn);

    /* CINEMATIC INTRO: embers → the PYRAXIS mark */
    if(introFrom&&introT<1){
      const speed=curP>1.2?3:1;
      introT=Math.min(1,introT+dt*speed/INTRO_DUR);
      const P=engine.posAttr.array,B=engine.baseArr;
      const done=introT>=1;
      for(let j=0;j<N;j++){
        const d=SEEDS[j]*.45;
        let t=(introT-d)/.55;
        t=t<0?0:t>1?1:t;
        const e=t*t*(3-2*t);
        const j3=j*3,rs=1-e;
        let x=introFrom[j3]*rs+B[j3]*e;
        let y=introFrom[j3+1]*rs+B[j3+1]*e;
        let z=introFrom[j3+2]*rs+B[j3+2]*e;
        const a=Math.sin(Math.PI*e)*INTRO_ARC*(.35+SEEDS[j]);
        x+=DIRS[j3]*a;y+=DIRS[j3+1]*a;z+=DIRS[j3+2]*a;
        const th=(1-e)*INTRO_SWIRL,cs=Math.cos(th),sn=Math.sin(th);
        P[j3]=x*cs-z*sn;P[j3+1]=y;P[j3+2]=x*sn+z*cs;
      }
      if(done){P.set(B);introFrom=null;if(window.topoStart)window.topoStart();}
      engine.posAttr.needsUpdate=true;
    }
    if(engine&&glideT<1&&!introFrom&&!dirty){
      /* responsive re-layout / texture glide ONLY when scroll is idle:
         never fight an active scroll or it restarts every frame and
         reads as slow-fast-slow (hang) inside one scroll gesture */
      glideT=Math.min(1,glideT+dt/0.6);
      const e=glideT*glideT*(3-2*glideT);
      const P=engine.posAttr.array,B=engine.baseArr;
      for(let j=0;j<N;j++){
        const j3=j*3,rs=1-e;
        P[j3]=glideFrom[j3]*rs+B[j3]*e;
        P[j3+1]=glideFrom[j3+1]*rs+B[j3+1]*e;
        P[j3+2]=glideFrom[j3+2]*rs+B[j3+2]*e;
      }
      if(glideT>=1)glideFrom=null;
      engine.posAttr.needsUpdate=true;
    }else if(!introFrom&&!(globeBlendFrom&&globeBlendT<1)){
      /* normal scroll path: 1:1 copy of the logical target.
         Floating/idle motion lives in the vertex shader (uWobble/uTime),
         so the swarm still breathes when scroll stops. */
      if(dirty&&glideFrom){glideFrom=null;glideT=1;} /* scroll cancels stale layout glide */
      if(dirty){engine.posAttr.array.set(engine.baseArr);engine.posAttr.needsUpdate=true;}
    }
    /* LATE-TEXTURE MELT — crossfade whatever is on screen into the new
       continents, staggered per particle; runs alongside scrolling
       because it reads the live baseArr every frame */
    if(globeBlendFrom&&globeBlendT<1&&(!introFrom||curP>2)){
      globeBlendT=Math.min(1,globeBlendT+dt/1.1);
      const P=engine.posAttr.array,B=engine.baseArr,F=globeBlendFrom;
      const L=landAttr.array,FL=globeBlendLand,TL=globeBlendToLand;
      for(let j=0;j<N;j++){
        const d=SEEDS[j]*.4;
        let t=(globeBlendT-d)/.6;
        t=t<0?0:t>1?1:t;
        const e=t*t*(3-2*t);
        const j3=j*3;
        P[j3]  =F[j3]  +(B[j3]  -F[j3]  )*e;
        P[j3+1]=F[j3+1]+(B[j3+1]-F[j3+1])*e;
        P[j3+2]=F[j3+2]+(B[j3+2]-F[j3+2])*e;
        L[j]=FL[j]+(TL[j]-FL[j])*e;
      }
      if(globeBlendT>=1){
        P.set(B);L.set(TL);
        globeBlendFrom=null;globeBlendLand=null;globeBlendToLand=null;
      }
      engine.posAttr.needsUpdate=true;
      landAttr.needsUpdate=true;
    }
    introGlow=introT<1?Math.sin(Math.PI*clamp(introT,0,1))*.6:0;

    const i=clamp(Math.floor(curP),0,4);
    const f=clamp(curP-i,0,1);
    const e=f*f*f*(f*(f*6-15)+10);

    let wob=lerp(WOB[i],WOB[i+1],e),siz=lerp(SIZ[i],SIZ[i+1],e),rs=lerp(ROT[i],ROT[i+1],e);
    if(reduced){wob*=.35;rs*=.4;}

    /* galaxy look gate: 0 outside, 1 exactly at the galaxy keyframe (curP 4) */
    const galGate=sstep(clamp((curP-3.25)/.75,0,1))*(1-sstep(clamp((curP-4)/.7,0,1)));
    u.uGal.value=galGate;
    engine.galGroup.visible=galGate>.01;
    if(engine.galGroup.visible){
      for(const f of engine.galFx)f.mat.opacity=f.base*galGate;
      engine.barGroup.rotation.y=G_BAR_ANG+GAL.T*G_OM_BAR;
    }
    u.uTime.value=now/1000;
    u.uWobble.value=wob;
    u.uSize.value=siz*(1+introGlow*.3)*SZ_MUL;
    const energy=Math.sin(Math.PI*f)*clamp(Math.abs(vel)*1.4,0,1);
    u.uEnergy.value=Math.min(1.3,lerp(u.uEnergy.value,(reduced?energy*.4:energy)+introGlow,.25));
    u.uColA.value.copy(CA[i]).lerp(CA[i+1],e);
    u.uColB.value.copy(CB[i]).lerp(CB[i+1],e);

    /* —— THE WORLD TURNS — choreographed, layered, all smoothed.
          One master reveal (globeMixS, ~0.4s inertia) drives everything,
          staggered so the story reads as: swarm condenses (uGlobe) →
          glass fades in beneath the arriving embers (bodyFade) →
          atmosphere ring breathes on last (atmFade). —— */
    globeMix=sstep(clamp((curP-4.05)/.8,0,1));
    globeMixS+=(globeMix-globeMixS)*Math.min(1,dt*1.8);
    const gmE=globeMixS*globeMixS*(3-2*globeMixS);
    u.uGlobe.value=globeMixS;
    /* HERO TOPO FIELD — presence follows scroll, not a binary gate: full
       while the mark shows, melting out as the journey leaves the hero.
       A continuous function of curP can't blink or get stuck visible in
       other sections. Takes over from the CSS intro fade 1.5s after start
       (transition disabled first, or every update would lag 1.4s). */
    if(window.__topoOn&&topoCv){
      if(!window.__topoNoTrans&&now-window.__topoOnT>1500){
        window.__topoNoTrans=true;topoCv.style.transition='none';
      }
      if(window.__topoNoTrans){
        /* full through the hero, melting away across the Problem section.
           Multiplier matches #topo.live (0.28) so the JS takeover at 1.5s
           is seamless — the old 0.55 doubled brightness in one frame. */
        const tf=1-sstep(clamp((curP-0.25)/0.45,0,1));
        window.__topoVis=tf;
        topoCv.style.opacity=(0.28*tf).toFixed(3);
      }else{ window.__topoVis=1; }
    }
    if(texReady)texFade=Math.min(1,texFade+dt/0.9);   /* map melts onto the glass */
    const bodyFade=sstep(clamp((globeMixS-.42)/.58,0,1));
    const atmFade=sstep(clamp((globeMixS-.68)/.32,0,1));
    if(engine.globeBody){
      const gb=engine.globeBody,ga=engine.globeAtm;
      gb.visible=bodyFade>.005;
      ga.visible=atmFade>.005;
      if(gb.visible){
        gb.material.uniforms.uFade.value=bodyFade;
        gb.material.uniforms.uTime.value=now/1000;
        gb.material.uniforms.uHasTex.value=texFade;
      }
      if(ga.visible)ga.material.uniforms.uFade.value=atmFade;
      /* the formed world reads brighter: lift the canvas' overall opacity
         (0.5 everywhere else) as the globe condenses, ease back on leave */
      const glO=(GL_BASE+(GL_GLOBE-GL_BASE)*bodyFade).toFixed(2);
      if(glO!==lastGlO){lastGlO=glO;document.documentElement.style.setProperty('--gl-o',glO);}
    }
    const wantGrab=globeMixS>.5;
    if(wantGrab!==grabHint){
      grabHint=wantGrab;
      document.body.classList.toggle('globe-live',wantGrab);
    }

    /* PREMIUM POINTER — the swell exhales on a slow tail (1.6/s), the
       still name barely stirs, and the formed world only breathes at
       half strength so its skin holds its shape. */
    ptrBoost*=Math.exp(-dt*1.6);
    const pdamp=1;
    /* HERO-ONLY SHINE — the mouse glow/shimmer (and the ripple push it
       drives in the vertex shader) belongs to the pyraxis symbol only.
       heroGate rides the same pacing as the topo field's own fade (full
       through the mark, melting out by curP~0.7) so it never re-appears
       once the field has moved into dispersal/coherence/galaxy/globe. */
    const heroGate=1-sstep(clamp((curP-0.25)/0.45,0,1));
    u.uPtrStr.value=(1+ptrBoost)*pdamp*(1.-globeMixS*.55)*heroGate;
    u.uWind.value=1-.6*sstep(clamp((curP-.8)/1.2,0,1));   /* full gust on the mark, lighter later */
    /* SCROLL-FIELD REPEL — the counterpart to heroGate: 0 while the mark is
       up (it already has shine + fly-away dust, more would be too much),
       fades in as the hero melts into dispersal (curP .45→.85), softer on
       the formed world so its skin keeps its shape. Mouse only; off for
       touch, reduced motion, and when the cursor has left the window. */
    const repelWant=(reduced||coarse||!ptrIn)?0:sstep(clamp((curP-0.45)/0.4,0,1))*(1-globeMixS*.5);
    repelAmt+=(repelWant-repelAmt)*Math.min(1,dt*2);
    if(repelAmt<.002)repelAmt=0;
    rNdc.lerp(ndcT,Math.min(1,dt*8));   /* light lag — the parting trails the cursor */
    u.uRepel.value=repelAmt;
    u.uRepelPos.value.copy(rNdc);
    u.uAspect.value=engine.camera.aspect;
    ndc.lerp(ndcT,Math.min(1,dt*4.5));        /* slow camera drift — floats, doesn't swing */

    rotFree+=rs*dt;
    let rot=rotFree;
    if(curP<0.65){
      const b=sstep(clamp((0.65-curP)/.65,0,1));
      const target=Math.round(rotFree/TAU)*TAU;
      let d=target-rotFree;
      d-=Math.round(d/TAU)*TAU;
      rot=rotFree+d*b;
    }
    engine.group.rotation.y=rot;
    if(globeMixS>0){
      /* SPIN-INTO-PLACE — as the globe condenses (gmE 0→1), the baseline
         heading eases from wherever free rotation left off toward the
         India-centered home angle (nearest congruent turn, so it always
         turns the short way, never whips around). Combined with the
         spin-up below this reads as the world turning to face you as it
         forms, then settling into its slow idle drift from there. */
      const homeTarget=GLOBE_HOME_Y+Math.round((rot-GLOBE_HOME_Y)/TAU)*TAU;
      rot+=(homeTarget-rot)*gmE;
      /* gentle spin-up DURING the transition: faster while assembling
         (1-gmE weights it), settles to the slow steady turn once formed —
         so the globe visibly starts turning as it condenses, not only after */
      if(!globeDragging&&!reduced)globeSpin+=dt*(.035+.05*(1-gmE));
      const tiltT=(globeDragging||reduced)?0:clamp(-ndc.y*.35,-1.1,1.1);
      globeTilt+=(tiltT-globeTilt)*Math.min(1,dt*3);
      /* spin and tilt EASE IN through gmE — the world winds itself up */
      engine.group.rotation.y=rot+(globeSpin+globeDragY)*gmE;
      engine.group.rotation.x=(globeTilt+globeDragX)*gmE;
    }else{
      engine.group.rotation.x=0;
    }

    /* DUST LAYER — the room breathes around the world */
    if(dust){
      const tS=now/1000;
      dust.uniforms.uTime.value=tS;
      dust.uniforms.uOpacity.value=(.5+u.uEnergy.value*.25)*DUST_MUL;
      dust.group.rotation.y=tS*.006+rotFree*.18+curP*.12;
      dust.group.rotation.x=curP*.08;
      dust.group.rotation.z=Math.sin(tS*.07)*.03;
    }

    const damp=sstep(clamp(curP/0.8,0,1));
    const cp=CAM[i],cn=CAM[i+1];
    engine.camera.position.set(
      lerp(cp[0][0],cn[0][0],e)+ndc.x*1.5*damp,
      lerp(cp[0][1],cn[0][1],e)+ndc.y*1.0*damp,
      lerp(cp[0][2],cn[0][2],e)
    );
    if(introT<1){
      const gp=clamp(introT,0,1),ez=1-Math.pow(1-gp,3);
      engine.camera.position.z+=(1-ez)*10;
      engine.camera.position.y+=(1-ez)*2.4;
    }
    if(globeMixS>0){
      /* slow orbital drift + a smoothed scroll dolly toward the world */
      if(!reduced){
        engine.camera.position.x+=Math.sin(now/1000*.1)*.15*gmE;
        engine.camera.position.y+=Math.cos(now/1000*.08)*.1*gmE;
      }
      engine.camera.position.z-=gmE*2.2;
    }
    lookV.set(lerp(cp[1][0],cn[1][0],e),lerp(cp[1][1],cn[1][1],e),lerp(cp[1][2],cn[1][2],e));
    engine.camera.lookAt(lookV);
    engine.camera.updateMatrixWorld();
    engine.group.updateMatrixWorld();

    ray.setFromCamera(ndc,engine.camera);
    if(!ray.ray.intersectPlane(PTR_PLANE,ptrW))ray.ray.closestPointToPoint(ORIGIN,ptrW);
    ptrL.copy(ptrW);
    engine.group.worldToLocal(ptrL);
    u.uPointer.value.lerp(ptrL,Math.min(1,dt*4.5));  /* the dent trails the cursor gracefully */

    /* FLY-AWAY DUST — while the cursor is over the mark, break embers off it */
    if(engine.fly){
      engine.fly.step(dt,now/1000);
      const hovering=!reduced&&!introFrom&&curP<.45&&(performance.now()-lastActive)<2500;
      if(hovering){
        flyAcc+=dt*170;
        const pv=u.uPointer.value,R2=3.2*3.2,B=engine.baseArr;
        while(flyAcc>=1){
          flyAcc-=1;
          for(let tries=0;tries<50;tries++){
            const j=(Math.random()*N)|0,j3=j*3;
            const dx=B[j3]-pv.x,dy=B[j3+1]-pv.y,dz=B[j3+2]-pv.z;
            if(dx*dx+dy*dy+dz*dz<R2){engine.fly.emit(j);break;}
          }
        }
      }else flyAcc=0;
    }

    engine.renderer.render(engine.scene,engine.camera);

    if(!canvas.classList.contains('on')&&(PIXELS_OK||fieldLive||curP>0.7))canvas.classList.add('on');
  }
}
requestAnimationFrame(tick);
})();
