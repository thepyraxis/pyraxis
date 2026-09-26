/* ============ HERO TOPO FIELD — NexusNode interactive field, ember palette ============
    Hero-scoped contour background: pointer lens + pooled click waves over
    dark-purple bands — kept deep and muted so the bright ember mark stays
    the hero's focal voice. Starts only after the ember mark finishes forming (window.topoStart,
   called from the GL intro; MutationObserver on #gl.on is the fallback if the
   intro never runs). Idle-throttled, hero-gated, static under reduced motion. */
(function(){
'use strict';
var hero=document.getElementById('hero'), cv=document.getElementById('topo');
if(!hero||!cv) return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var started=false, raf=0, heroOn=false;
window.topoStart=function(){
  if(started) return; started=true;
  window.__topoOn=true; window.__topoOnT=performance.now();
  cv.classList.add('live');
  if(RM){ render(0,mouse.x,mouse.y); return; }
  play();
};

var gl=null;
try{ gl=cv.getContext('webgl',{alpha:false,antialias:false,depth:false}); }
catch(e){ gl=null; }
if(!gl) return;

/* CONTEXT LOSS — this is a raw WebGL context (not wrapped by three.js, which
   already handles this internally for #gl below). Without a listener here,
   a GPU/driver-level context loss leaves this canvas permanently blank:
   per spec the browser only attempts to restore the context if the
   'webglcontextlost' handler calls preventDefault(). We do that, stop the
   render loop while lost so we don't spend a frame's worth of no-op GL
   calls, and rebuild the program/buffer exactly once on restore. */
var glLost=false;
cv.addEventListener('webglcontextlost',function(e){
  e.preventDefault();
  glLost=true;
  if(window.PYRAXIS_DEBUG)window.PYRAXIS_DEBUG.log('topo: context lost');
},false);
cv.addEventListener('webglcontextrestored',function(){
  glLost=false;
  try{ initTopoProgram(); resize(); if(started)render(topoTime,mouse.x,mouse.y); }
  catch(e){}
  if(window.PYRAXIS_DEBUG)window.PYRAXIS_DEBUG.log('topo: context restored');
},false);

var RIPS=5;
var VS='attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.,1.);}';
var FS=[
'#ifdef GL_FRAGMENT_PRECISION_HIGH',
'precision highp float;',
'#else',
'precision mediump float;',
'#endif',
'uniform vec2 u_resolution;',
'uniform float u_time;',
'uniform vec2 u_mouse;',
'uniform vec2 u_rip[5];',
'uniform float u_ripT[5];',
'vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}',
'float snoise(vec2 v){',
' const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);',
' vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);',
' vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);',
' vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);',
' vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));',
' vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);',
' m=m*m;m=m*m;',
' vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);',
' vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);',
' vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;',
' return 130.0*dot(m,g);',
'}',
'void main(){',
' vec2 uv=gl_FragCoord.xy/u_resolution;',
' vec2 st=uv;st.x*=u_resolution.x/u_resolution.y;',
' vec2 m=u_mouse;m.x*=u_resolution.x/u_resolution.y;',
' vec2 toM=st-m;',
' float inf=exp(-dot(toM,toM)*5.0);',
' vec2 lens=m+toM*(1.0+inf*0.55);',
' float ring=0.0;',
' for(int i=0;i<5;i++){',
'  float age=u_time-u_ripT[i];',
'  float amp=clamp(1.0-age/2.4,0.0,1.0);',
'  vec2 rp=u_rip[i];rp.x*=u_resolution.x/u_resolution.y;',
'  vec2 toR=st-rp;',
'  float w=clamp((length(toR)-age*0.32)*16.0,-40.0,40.0);',
'  ring+=exp(-w*w)*amp;',
' }',
' ring=min(ring,1.5);',
' vec2 np=lens*1.4+vec2(u_time*0.015,u_time*0.025);',
' float n=snoise(np)*0.5+0.5+ring*0.85;',
' float tri=abs(fract(n*9.0)-0.5)*2.0;',
' float bw=0.05+0.035*min(ring,1.0)+0.04*inf;',
' float band=1.0-smoothstep(0.0,bw,tri);',
 ' float topo=band*0.36;',
 ' topo*=1.0+inf*1.4+ring*1.6;',
 ' vec2 vc=(uv-vec2(0.5,0.55))*vec2(u_resolution.x/u_resolution.y,1.0);',
 ' float vig=smoothstep(1.05,0.32,length(vc));',
 ' vig*=mix(0.5,1.0,smoothstep(0.0,0.22,uv.y));',
 ' vig*=mix(1.0,0.0,smoothstep(0.82,1.0,uv.y));',
 ' float g=clamp(topo*vig,0.0,1.0);',
 ' vec3 deep=vec3(0.010,0.005,0.026);',
 ' vec3 mid=vec3(0.070,0.034,0.185);',
 ' vec3 hot=vec3(0.290,0.190,0.620);',
' vec3 col=mix(deep,mid,smoothstep(0.0,0.45,g));',
' col=mix(col,hot,smoothstep(0.45,1.0,g)*0.85);',
' gl_FragColor=vec4(col,1.0);',
'}'].join('\n');

function sh(type,src){
  var s=gl.createShader(type);
  gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
    if(window.console)console.warn('[topo shader]',gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}
/* All GL objects (program, buffer, uniform locations) live on a context
   that can be lost and later restored by the browser. Everything that
   creates or looks up a GL resource is grouped here so restoration can
   rebuild it exactly once instead of duplicating this setup inline. */
var pr=null,buf=null,loc=null,uRes=null,uT=null,uMou=null,uRip=null,uRipT=null;
function locA(name){
  return gl.getUniformLocation(pr,name+'[0]')||gl.getUniformLocation(pr,name);
}
function initTopoProgram(){
  var v=sh(gl.VERTEX_SHADER,VS), f=sh(gl.FRAGMENT_SHADER,FS);
  if(!v||!f) return false;
  pr=gl.createProgram();
  gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){
    if(window.console)console.warn('[topo link]',gl.getProgramInfoLog(pr));
    return false;
  }
  gl.useProgram(pr);

  buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  loc=gl.getAttribLocation(pr,'a_position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

  uRes=gl.getUniformLocation(pr,'u_resolution');
  uT=gl.getUniformLocation(pr,'u_time');
  uMou=gl.getUniformLocation(pr,'u_mouse');
  uRip=locA('u_rip');
  uRipT=locA('u_ripT');
  return true;
}
if(!initTopoProgram()) return;

var HOME={x:0.5,y:0.45};
var mouse={x:HOME.x,y:HOME.y}, target={x:HOME.x,y:HOME.y};
var t0=performance.now(), lastMoveAt=-1e9, rippleEnd=0;
/* pause-aware clock: u_time advances only while frames actually render, so
   scrolling away (IntersectionObserver pause), hiding the tab, or a context
   loss never snaps the pattern to a new phase on return (read as restart) */
var topoTime=0, lastT=-1;

var ripXY=new Float32Array(RIPS*2), ripT=new Float32Array(RIPS);
for(var i=0;i<RIPS;i++){ ripT[i]=-1000; ripXY[i*2]=HOME.x; ripXY[i*2+1]=HOME.y; }

function nrm(e){
  return {x:e.clientX/Math.max(1,innerWidth),
          y:1-e.clientY/Math.max(1,innerHeight)};
}
function render(tSec,mx,my){
  gl.uniform1f(uT,tSec);
  gl.uniform2f(uMou,mx,my);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
}
function resize(){
  var dpr=Math.min(devicePixelRatio||1,2);
  cv.width=Math.round(innerWidth*dpr);
  cv.height=Math.round(innerHeight*dpr);
  gl.viewport(0,0,cv.width,cv.height);
  gl.uniform2f(uRes,cv.width,cv.height);
  if(started) render(topoTime,mouse.x,mouse.y);
}
addEventListener('resize',resize);

addEventListener('pointermove',function(e){
  var p=nrm(e); target.x=p.x; target.y=p.y;
  lastMoveAt=performance.now();
  if(RM&&started){ mouse.x=p.x; mouse.y=p.y; render(0,mouse.x,mouse.y); }
},{passive:true});
addEventListener('pointerdown',function(e){
  if(RM||!started) return;
  var p=nrm(e), now=topoTime;
  var idx=0, leastRemaining=Infinity;
  for(var j=0;j<RIPS;j++){
    if(ripT[j]<now-3.0){ idx=j; break; }
    var rem=ripT[j]+2.4-now;
    if(rem<leastRemaining){ leastRemaining=rem; idx=j; }
  }
  ripXY[idx*2]=p.x; ripXY[idx*2+1]=p.y;
  ripT[idx]=now;
  if(uRip) gl.uniform2fv(uRip,ripXY);
  if(uRipT) gl.uniform1fv(uRipT,ripT);
  rippleEnd=performance.now()+2400;
},{passive:true});
document.documentElement.addEventListener('mouseleave',function(){
  target.x=HOME.x; target.y=HOME.y;
});
addEventListener('pointerup',function(e){
  if(e.pointerType!=='mouse'){ target.x=HOME.x; target.y=HOME.y; }
},{passive:true});

if(uRip) gl.uniform2fv(uRip,ripXY);
if(uRipT) gl.uniform1fv(uRipT,ripT);
resize();

/* fallback: if the intro hook never fires (mark failed), start once #gl is on */
var glCanvas=document.getElementById('gl');
if(glCanvas&&'MutationObserver' in window){
  new MutationObserver(function(){
    if(!started&&glCanvas.classList.contains('on')) setTimeout(function(){
      if(window.topoStart) window.topoStart();
    },600);
  }).observe(glCanvas,{attributes:true,attributeFilter:['class']});
}

var last=0;
function frame(t){
  raf=requestAnimationFrame(frame);
  if(!heroOn) return;
  if(glLost) return;  /* GPU context lost: wait for 'webglcontextrestored' */
  /* fully faded out by scroll: hold the last frame, skip GL work */
  if(started&&(window.__topoVis||0)<=0.005) return;
  if(lastT<0)lastT=t;
  var dt=(t-lastT)*0.001;lastT=t;
  if(dt<0)dt=0; if(dt>0.1)dt=0.1;  /* background tab / pause: resume, don't leap */
  topoTime+=dt;
  var now=performance.now();
  mouse.x+=(target.x-mouse.x)*0.085;
  mouse.y+=(target.y-mouse.y)*0.085;
  render(topoTime,mouse.x,mouse.y);
}
function play(){ lastT=-1; if(!raf) raf=requestAnimationFrame(frame); }
function pause(){ cancelAnimationFrame(raf); raf=0; }
if('IntersectionObserver' in window){
  new IntersectionObserver(function(es){
    heroOn=es[0].isIntersecting;
    if(heroOn&&started) play(); else pause();
  },{threshold:0}).observe(hero);
} else { heroOn=true; }
document.addEventListener('visibilitychange',function(){
  if(document.hidden) pause();
  else if(heroOn&&started) play();
});
})();
