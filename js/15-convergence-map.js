'use strict';
(function(){
  var box=$('#flow'); if(!box) return;
  var svg=$('#flowSvg'), L=$('#fcL'), Rr=$('#fcR'), node=box.querySelector('.flow-node'), term=$('#flowTerm');
  var NS='http://www.w3.org/2000/svg';
  function nodeNS(t,a){ var n=document.createElementNS(NS,t); for(var k in a) n.setAttribute(k,a[k]); return n; }
  var dots=[], t0=null;
  function build(){
    if(!svg) return;
    svg.innerHTML=''; dots=[]; t0=null;
    var bw=box.offsetWidth, bh=box.offsetHeight, br=box.getBoundingClientRect();
    svg.setAttribute('viewBox','0 0 '+bw+' '+bh);
    svg.setAttribute('width',bw); svg.setAttribute('height',bh);
    function rel(r){ return {x:r.left-br.left,y:r.top-br.top,w:r.width,h:r.height}; }
    var nr=rel(node.getBoundingClientRect()), tr=rel(term.getBoundingClientRect());
    var desk=matchMedia('(min-width:900px)').matches;
    function mk(d){ var p=nodeNS('path',{d:d,fill:'none',stroke:'rgba(255,255,255,.12)','stroke-width':'1'}); svg.appendChild(p); return p; }
    var paths=[], NC=nr.x+nr.w/2;
    if(desk){
      $$('.src-chip',L).forEach(function(c,j){
        var r=rel(c.getBoundingClientRect());
        var sx=r.x+r.w, sy=r.y+r.h/2, ex=nr.x-12, ey=nr.y+nr.h*(0.18+0.64*j/5);
        paths.push(mk('M'+sx+' '+sy+' C'+(sx+(ex-sx)*.4)+' '+sy+', '+(ex-(ex-sx)*.4)+' '+ey+', '+ex+' '+ey));
      });
      $$('.src-chip',Rr).forEach(function(c,j){
        var r=rel(c.getBoundingClientRect());
        var sx=r.x, sy=r.y+r.h/2, ex=nr.x+nr.w+12, ey=nr.y+nr.h*(0.18+0.64*j/4);
        paths.push(mk('M'+sx+' '+sy+' C'+(sx+(ex-sx)*.4)+' '+sy+', '+(ex-(ex-sx)*.4)+' '+ey+', '+ex+' '+ey));
      });
      paths.push(mk('M'+NC+' '+(nr.y+nr.h)+' C'+NC+' '+(nr.y+nr.h+38)+', '+NC+' '+(tr.y-28)+', '+NC+' '+(tr.y-4)));
    } else {
      var chips=$$('.src-chip',box);
      chips.forEach(function(c,j){
        var r=rel(c.getBoundingClientRect());
        var sx=r.x+r.w/2, sy=r.y+r.h, ex=nr.x+nr.w*(0.12+0.76*j/Math.max(1,chips.length-1)), ey=nr.y-8;
        var dy=ey-sy;
        paths.push(mk('M'+sx+' '+sy+' C'+sx+' '+(sy+dy*.35)+', '+ex+' '+(ey-dy*.35)+', '+ex+' '+ey));
      });
      paths.push(mk('M'+NC+' '+(nr.y+nr.h)+' C'+NC+' '+(nr.y+nr.h+28)+', '+NC+' '+(tr.y-22)+', '+NC+' '+(tr.y-4)));
    }
    if(REDUCED) return;
    paths.forEach(function(p,j){
      var g=nodeNS('g',{});
      g.appendChild(nodeNS('circle',{r:4.5,fill:'rgba(124,92,255,.22)'}));
      g.appendChild(nodeNS('circle',{r:2.3,fill:'#a78bff'}));
      svg.appendChild(g);
      dots.push({g:g,p:p,L:p.getTotalLength(),sp:1/(3600+j*230),off:(j*.11)%1});
    });
    t0=performance.now();
  }
  build();
  var rz; addEventListener('resize',function(){ clearTimeout(rz); rz=setTimeout(build,220); });
  addTicker(box,function(now){
    if(t0==null) t0=now;
    dots.forEach(function(d){
      var u=((now-t0)/1000*d.sp+d.off)%1;
      var q=d.p.getPointAtLength(u*d.L);
      d.g.setAttribute('transform','translate('+q.x+' '+q.y+')');
    });
  });
})();

/* ---------- 06 · QR demo ---------- */
