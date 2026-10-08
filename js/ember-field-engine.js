(function(){"use strict";const Ie=t=>document.querySelector(t),H=(t,o,a)=>t<o?o:t>a?a:t,Rt=(t,o,a)=>t+(o-t)*a,ht=t=>t*t*(3-2*t),Tt=Math.PI*2,Vt=!window.__pxCpuMorph&&!/[?&#]cpumorph\b/.test((location.search||"")+(location.hash||"")),_t=Ie("#gl");if(!_t)return;const ze=Ie("#topo"),ft=matchMedia("(prefers-reduced-motion: reduce)").matches,Ve=matchMedia("(pointer: coarse)").matches,Ee=Ie("#toast");let ya=null;function $o(t){Ee&&(Ee.textContent=t,Ee.classList.add("show"),clearTimeout(ya),ya=setTimeout(()=>Ee.classList.remove("show"),3400))}let Yt=innerHeight,Ea=1;const Kt=[["hero",0],["leak",.29],["system",.59],["builds",.94],["how",1.42],["qr",1.97],["reviews",2.5],["retain",3],["deployments",3.38],["purpose",3.85],["intel",3.95],["industries",4.2],["cta",5]];let $=[],be=[],We=[];var lo="#cta";function so(){var t=document.querySelector(lo);if(!t)return document.documentElement.scrollHeight-Yt;var o=t.getBoundingClientRect(),a=o.top+(window.scrollY||0),e=a+o.height/2;return e-Yt/2}function ba(){Yt=innerHeight;var t=Math.max(1,document.documentElement.scrollHeight-Yt),o=so();Ea=Math.max(Yt*2,Math.min(t,Math.max(1,o))),$=[],be=[],We=[];const a=window.scrollY||0;for(let e=0;e<Kt.length;e++){const i=document.getElementById(Kt[e][0]);if(!i||!i.getClientRects().length)continue;const u=i.getBoundingClientRect();let c=e===0?0:u.top+a+u.height/2-Yt/2;c-=(uo[Kt[e][0]]||0)*Yt,c=Math.max(0,Math.min(c,t)),$.length&&c<=$[$.length-1]&&(c=$[$.length-1]+1),$.push(c),be.push(Ta[Kt[e][0]]!==void 0?Ta[Kt[e][0]]:Kt[e][1]),We.push(Kt[e][0])}Ne()}const Ta={qr:2,retain:3},co={qr:.15,retain:.15,cta:.15},uo={leak:.3,system:.18};let Ht=[],kt=[],Lt=[];function Ne(){const t=$.length;Ht=[],kt=[];for(let e=0;e<t;e++){const i=co[We[e]]||0;let u=0;if(i){const f=e>0?$[e]-$[e-1]:1/0,C=e<t-1?$[e+1]-$[e]:1/0,z=Math.min(f,C);u=z===1/0?0:i*z}const c=e===0||u<1?$[e]:$[e]-u,p=e===t-1||u<1?$[e]:$[e]+u;Ht.push(c),kt.push(be[e]),p-c>=1&&(Ht.push(p),kt.push(be[e]))}const o=Ht.length;if(Lt=new Array(o).fill(0),o<2)return;const a=[];for(let e=0;e<o-1;e++)a.push((kt[e+1]-kt[e])/(Ht[e+1]-Ht[e]));Lt[0]=a[0],Lt[o-1]=a[o-2];for(let e=1;e<o-1;e++)Lt[e]=a[e-1]*a[e]<=0?0:(a[e-1]+a[e])/2;for(let e=0;e<o-1;e++){if(a[e]===0){Lt[e]=0,Lt[e+1]=0;continue}const i=Lt[e]/a[e],u=Lt[e+1]/a[e],c=i*i+u*u;if(c>9){const p=3/Math.sqrt(c);Lt[e]=p*i*a[e],Lt[e+1]=p*u*a[e]}}}function ho(t){const o=Ht.length;if(o<2)return H(t/Ea,0,1)*5;if(t<=Ht[0])return kt[0];if(t>=Ht[o-1])return kt[o-1];let a=1;for(;a<o-1&&t>Ht[a];)a++;const e=Ht[a]-Ht[a-1],i=(t-Ht[a-1])/e,u=i*i,c=u*i;return(2*c-3*u+1)*kt[a-1]+(c-2*u+i)*e*Lt[a-1]+(-2*c+3*u)*kt[a]+(c-u)*e*Lt[a]}ba();let Wt=null,Aa=0;function le(){var t=$.slice();ba(),$.length===t.length&&t.length>1?(Wt=$.slice(),$=t,Ne()):Wt=null}function fo(t){if(!Wt||Wt.length!==$.length){Wt=null;return}for(var o=1-Math.exp(-t*3.5),a=!1,e=0;e<$.length;e++){var i=Wt[e]-$[e];Math.abs(i)<.4?$[e]=Wt[e]:($[e]+=i*o,a=!0)}Ne(),a||(Wt=null)}if(addEventListener("load",le),typeof THREE=="undefined"){_t.remove();return}THREE.ColorManagement&&(THREE.ColorManagement.enabled=!1);const xa="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 2500 2500" fill="none">
<path d="M2256 2325H1920.36L1380 1647.25L1544.64 1443L2256 2325Z" fill="url(#a)"/>
<path d="M1001.75 772H658.895L1154.96 1327.06L331 2325H672.417L1493 1307.66L1001.75 772Z" fill="url(#b)"/>
<path d="M1799.12 215H157.845L412.269 475.57L1805.26 477.256C1848.37 489.905 2059.68 514.36 2071.52 790.108C2078.95 982.373 1919.09 1074.85 1838.22 1097.06L1734.26 1108.86L1592.25 1307.87L1637.9 1361H1829.77L1885.56 1353.41C2120.54 1301.13 2342 1109.71 2342 790.108C2324.42 352.284 1972.75 224.276 1799.12 215Z" fill="url(#c)"/>
<defs>
<linearGradient id="a" x1="1492.07" y1="1443" x2="2352.06" y2="1759.52" gradientUnits="userSpaceOnUse"><stop stop-color="#CCCDCC"/><stop offset=".2" stop-color="#C8C9CB"/><stop offset=".45" stop-color="#E1E3E2"/><stop offset=".780207" stop-color="#C3C5C4"/><stop offset="1" stop-color="#A5A5A6"/></linearGradient>
<linearGradient id="b" x1="911.463" y1="772" x2="908.825" y2="2324.99" gradientUnits="userSpaceOnUse"><stop stop-color="#9025F1"/><stop offset=".25" stop-color="#982EF5"/><stop offset=".5" stop-color="#750BF0"/><stop offset=".75" stop-color="#45069F"/><stop offset="1" stop-color="#2B006C"/></linearGradient>
<linearGradient id="c" x1="436.528" y1="215" x2="2061.15" y2="1362.88" gradientUnits="userSpaceOnUse"><stop stop-color="#FDFDFD"/><stop offset=".2" stop-color="#E4E4E3"/><stop offset=".45" stop-color="#CBCBCB"/><stop offset=".780207" stop-color="#FDFDFD"/><stop offset="1" stop-color="#A5A6A8"/></linearGradient>
</defs></svg>`);try{const t=document.createElement("link");t.rel="icon",t.type="image/svg+xml",t.href=xa,document.head.appendChild(t)}catch(t){}const Sa="public/img/founder-latest.png",mo=Sa,Qo=Sa,Te=8086015,po=.56;let Ue=null,Ae=!1,qe=!1,Nt=null,Ot=null,r=null,Ft=null,it=null,yt=1,je=0,Ra=!1,Ct=null,vt=1;const Ha=2,vo=-.06,Ye=5.2,Ke=.9;function xe(t,o,a){return t>o+25&&a>o+25}function Ca(t){const a=Math.min(1,560/t.width),e=Math.max(2,Math.round(t.width*a)),i=Math.max(2,Math.round(t.height*a)),u=document.createElement("canvas");u.width=e,u.height=i;const c=u.getContext("2d",{willReadFrequently:!0});c.drawImage(t,0,0,e,i);const p=c.getImageData(0,0,e,i).data;let f=0,C=0,z=0,b=0;const x=(P,K)=>{const F=(K*e+P)*4;if(p[F+3]>128){f++;const mt=Math.max(p[F],p[F+1],p[F+2]);C+=mt,z=Math.max(z,mt)}b++};for(let P=0;P<e;P+=3)x(P,0),x(P,i-1);for(let P=0;P<i;P+=3)x(0,P),x(e-1,P);const _=b>0&&f/b>.6&&C/Math.max(1,f)>140,W=Math.max(70,z*.5+45),S=[],V=[];let O=0,N=0,et=0,st=0,s=1e9,m=1e9,g=-1e9,k=-1e9;for(let P=0;P<i;P++)for(let K=0;K<e;K++){const F=(P*e+K)*4;if(p[F+3]<40)continue;const mt=p[F],ct=p[F+1],X=p[F+2],v=Math.max(mt,ct,X),E=(mt+ct+X)/3;if(!(_?E<218||xe(mt,ct,X):v>W))continue;S.push(K,P);const q=xe(mt,ct,X)?1:0;V.push(q),q&&v>110&&(O+=mt,N+=ct,et+=X,st++),K<s&&(s=K),K>g&&(g=K),P<m&&(m=P),P>k&&(k=P)}if(S.length<1200)throw new Error("no ink");const Y=st?[O/st|0,N/st|0,et/st|0]:[154,107,255],J=c.createImageData(e,i),Q=J.data,Et=[236,234,246];for(let P=0;P<i;P++)for(let K=0;K<e;K++){const F=(P*e+K)*4,mt=p[F+3];if(mt<1)continue;const ct=p[F],X=p[F+1],v=p[F+2],E=Math.max(ct,X,v),T=(ct+X+v)/3;if(!(_?T<218||xe(ct,X,v):E>W))continue;const U=_?H((218-T)/140,.35,1):H((E-W)/Math.max(1,255-W),.4,1),ut=xe(ct,X,v)?Y:Et;Q[F]=ut[0]*U,Q[F+1]=ut[1]*U,Q[F+2]=ut[2]*U,Q[F+3]=mt}return c.putImageData(J,0,0),{pts:S,acc:V,count:S.length>>1,bx:s,by:m,bx1:g,by1:k,purple:Y}}function go(t){const o=new Float32Array(h*3),a=new Float32Array(h),e=t.count,i=innerWidth/innerHeight,u=68*Math.tan(Math.PI/6),c=u*i,p=Math.max(1,t.bx1-t.bx),f=Math.max(1,t.by1-t.by),z=Math.min(u*.58,c*.7*f/p)/f,b=(t.bx+t.bx1)/2,x=(t.by+t.by1)/2,_=innerWidth>=900&&i>1.1,W=_?c*.16:0,S=_?-u*.03:0;for(let V=0;V<h;V++){const O=Math.random()*e|0;o[V*3]=(t.pts[O*2]-b)*z+(Math.random()-.5)*.13+W,o[V*3+1]=-(t.pts[O*2+1]-x)*z+(Math.random()-.5)*.13+S,o[V*3+2]=(Math.random()-.5)*.35,a[V]=t.acc[O]}return{pos:o,acc:a}}function Mo(){const t=new Float32Array(h*3),o=new Float32Array(h);for(let a=0;a<h;a++)t[a*3]=y()*10,t[a*3+1]=y()*6,t[a*3+2]=y()*10;return{pos:t,acc:o}}function wo(t,o,a){const e=new THREE.Color(t/255,o/255,a/255);r&&r.uniforms.uAcc.value.copy(e),Ft&&Ft.uniforms.uCol.value.lerp(e,.3)}function Ga(){const t=r?r.visible():null,o=Ae&&Ue?go(Ue):Ze;gt[0]=o.pos,Je&&Qe(0),r&&(r.setShape(0),r.touchDelay(0)),Nt&&(Nt.array.set(o.acc),Nt.needsUpdate=!0),r&&(r.morph(L,!0),it||(Ct=t,vt=0))}function La(t,o){Ue=t,Ae=!0,wo(t.purple[0],t.purple[1],t.purple[2]),r&&L<1&&!ft&&!Ra&&(Ra=!0,it=r.logical(),yt=vo,_t.style.transition="opacity .45s ease"),Ga()}function Oa(t,o,a,e){e=e||3e3;let i=!1;const u=new Image;u.crossOrigin="anonymous";const c=setTimeout(()=>{i||(i=!0,a())},e);u.onload=()=>{i||(i=!0,clearTimeout(c),o(u))},u.onerror=()=>{i||(i=!0,clearTimeout(c),a())},u.src=t}function yo(){const t=new Image;t.onload=()=>{try{La(Ca(t),"LIVE")}catch(o){Pa()}},t.onerror=Pa,t.src=xa}function Pa(){const t=[mo];let o=0;const a=()=>{if(o>=t.length){qe=!0;return}Oa(t[o++],e=>{try{La(Ca(e),"LIVE \xB7 NET")}catch(i){a()}},a,4e3)};a()}setTimeout(()=>{Ae||(qe=!0)},2400);const Dt=window.matchMedia&&matchMedia("(pointer: coarse)").matches,re=!!window.__pxLite,Se=Dt&&(Math.min(screen.width||9999,innerWidth||9999)<=400||navigator.deviceMemory&&navigator.deviceMemory<=3||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4),h=Dt?Se?900:1400:re?2600:innerWidth<720?4e3:8500;try{window.__pxEngine={N:h,LITE:!!re,COARSE:!!Dt,SMALL:!!Se,noPtr:!!(window.matchMedia&&matchMedia("(pointer: coarse)").matches||innerWidth<900),w:innerWidth,h:innerHeight}}catch(t){}const Xe=innerWidth<720,Re=Xe||Dt,Fa=Re?.62:.8,Eo=Re?.64:.8,bo=Re?.76:1,To=Re?.65:1;function y(){let t=0,o=0;for(;!t;)t=Math.random();for(;!o;)o=Math.random();return Math.sqrt(-2*Math.log(t))*Math.cos(Tt*o)}const Xt=8,gt=[],Ze=Mo();gt.push(Ze.pos);{const t=new Float32Array(h*3);for(let o=0;o<h;o++){const a=Math.random()<.1?17:8.2;t[o*3]=y()*a,t[o*3+1]=y()*a*.75,t[o*3+2]=y()*a}gt.push(t)}{const t=new Float32Array(h*3),o=2.75;for(let a=0;a<h;a++){const e=a/h*Tt,i=.18+Math.random()*.3;t[a*3]=(Math.sin(e)+2*Math.sin(2*e))*o+y()*i,t[a*3+1]=(Math.cos(e)-2*Math.cos(2*e))*o+y()*i,t[a*3+2]=-Math.sin(3*e)*o+y()*i}gt.push(t)}{const t=new Float32Array(h*3);let o=0;for(;o<h;){const a=(Math.random()-.5)*56,e=(Math.random()-.5)*56;a*a+e*e>576||(t[o*3]=a,t[o*3+1]=y()*.5,t[o*3+2]=e,o++)}gt.push(t)}const Zt=.23,se=3,Ut=.12,He=.047,$t=.8,B={R:new Float32Array(h),TH:new Float32Array(h),Y:new Float32Array(h),OM:new Float32Array(h),GSZ:new Float32Array(h),GA:new Float32Array(h*4),GC:new Float32Array(h*3),T0:100,T:100};{let S=function(s,m,g,k,Y,J,Q,Et,P){W>=h||(s=-s*$t,m*=$t,g*=$t,Q=-Q,B.R[W]=Math.hypot(s,g),B.TH[W]=Math.atan2(g,s),B.Y[W]=m,B.OM[W]=Q,B.GC[W*3]=k[0]*Y,B.GC[W*3+1]=k[1]*Y,B.GC[W*3+2]=k[2]*Y,B.GSZ[W]=J*_,B.GA[W*4+1]=Et,B.GA[W*4+2]=P?1:0,W++)},O=function(s,m){V+=s;const g=Math.min(h,Math.round(h*V));for(;W<g;)m()};const t=s=>.224*Math.tanh(s/2.5)/Math.max(s,.05),o=s=>t(s)*.55+.016,a=(s,m,g)=>s-Math.log(m/se)/(g||Zt),e=[{t0:Ut,p:Zt,r0:se,r1:15.2,n:1,w:.42},{t0:Ut+Math.PI,p:Zt,r0:se,r1:14.6,n:1,w:.44},{t0:Ut+Math.PI-.5,p:Zt*1.06,r0:se,r1:12.4,n:.72,w:.56},{t0:Ut+.5,p:Zt*.97,r0:se,r1:15.4,n:.72,w:.56},{t0:a(Ut+Math.PI,7.4,Zt)-.27,p:Zt*1.15,r0:7.4,r1:10.8,n:.3,w:.32}];let i=0;for(const s of e)i+=s.n*(s.r1-s.r0);const u=[1,1,1],c=[.93,.9,1],p=[.8,.74,1],f=[.62,.53,1],C=[.46,.38,.92],z=[.96,.7,.95],b=[.6,.66,1],x=s=>s[Math.random()*s.length|0],_=8*(h>=2e4?1:h>=12e3?1.15:1.6);let W=0,V=0;O(.03,()=>{const s=x([u,u,c,p]),m=1+.5*Math.random();S(y()*.22,y()*.14,y()*.22,s,m,.05+Math.pow(Math.random(),2)*.08,He,1)});const N=Math.cos(Ut),et=Math.sin(Ut);O(.08,()=>{const s=y()*2.7,m=y()*.38,g=y()*.75,k=x([c,p,f,u]),Y=.55+.6*Math.pow(Math.random(),1.3);S(s*N-g*et,m,s*et+g*N,k,Y,.05+Math.pow(Math.random(),2)*.08,He,.8+.2*Math.random())}),O(.1,()=>{const s=Math.random()<.3?.45:1,m=x([f,p,C,c]),g=.4+.55*Math.pow(Math.random(),1.6);S(y()*1.35*s,y()*.85*s,y()*1.35*s,m,g,.04+Math.pow(Math.random(),2)*.07,He,.4+.5*Math.random())}),O(.56,()=>{let s=Math.random()*i,m=e[0];for(const F of e)if(s-=F.n*(F.r1-F.r0),s<=0){m=F;break}let g,k;do{const F=m.r0+(m.r1-m.r0)*Math.pow(Math.random(),.85);k=m.w*(.65+.05*F)*1.3,g=F+y()*k}while(g<1.2);const Y=a(m.t0,g,m.p)+y()*k*.8/g,J=y()*(.09+.011*g);let Q,Et,P,K;Math.random()<.05?(Q=x([u,b,c]),Et=1+.3*Math.random(),P=.13+.09*Math.random(),K=1):(Q=x([p,f,f,f,C,z,b]),Et=.75+.6*Math.pow(Math.random(),1.4),P=.045+Math.pow(Math.random(),2)*.075,K=.6+.4*Math.random()),S(Math.cos(Y)*g,J,Math.sin(Y)*g,Q,Et,P,o(g),K)}),O(.02,()=>{const s=e[Math.random()*e.length|0],m=s.r0+(s.r1-s.r0)*Math.pow(Math.random(),.85),g=Math.max(1.2,m+y()*s.w*1.6),k=a(s.t0,g,s.p)+y()*s.w/g,Y=x([f,z,p,C]),J=.7+.5*Math.random();S(Math.cos(k)*g,y()*.12,Math.sin(k)*g,Y,J*.8,.05+.05*Math.random(),o(g),.5+.4*Math.random(),0)}),O(.04,()=>{const s=e[Math.random()*e.length|0],m=s.r0+(s.r1-s.r0)*(.15+.7*Math.random()),g=a(s.t0,m,s.p)+y()*s.w*.4/m,k=Math.random(),Y=k<.55?f:k<.85?z:[.55,.5,1],J=.6+.5*Math.random();S(Math.cos(g)*m,y()*.05,Math.sin(g)*m,Y,J*.9,.8+.7*Math.random(),o(m),.04+.05*Math.random(),1)});const st=[];for(let s=0;s<11;s++)st.push(new THREE.Vector3(y(),y(),y()).normalize().multiplyScalar(6+16*Math.random()));O(.02,()=>{const s=new THREE.Vector3(y(),y(),y()).normalize().multiplyScalar(4+26*Math.pow(Math.random(),2.4)),m=x([p,c]),g=.3+.25*Math.random();S(s.x,s.y,s.z,m,g,.04+.03*Math.random(),(Math.random()-.5)*.004,.25+.3*Math.random())}),O(.01,()=>{const s=st[Math.random()*st.length|0],m=x([p,c]),g=.5+.3*Math.random();S(s.x+y()*.24,s.y+y()*.24,s.z+y()*.24,m,g,.05+.04*Math.random(),(Math.random()-.5)*.006,.5)}),O(.01,()=>{let s;do s=-3.5*Math.log(1-Math.random());while(s>15);const m=Math.random()*Tt,g=x([f,z,C]),k=.7+.5*Math.random();S(Math.cos(m)*s,y()*.2,Math.sin(m)*s,g,k*.7,.045+.04*Math.random(),t(s),.4+.4*Math.random(),0)}),O(1,()=>{let s;do s=-3.3*Math.log(1-Math.random());while(s>15.5);const m=Math.random()*Tt,g=y()*(.1+.012*s);let k,Y,J,Q;Math.random()<.05?(k=x([c,b]),Y=.8+.4*Math.random(),J=.09+.06*Math.random(),Q=.9):(k=x([f,C,p]),Y=.35+.5*Math.pow(Math.random(),1.7),J=.04+.055*Math.pow(Math.random(),2),Q=.3+.55*Math.random()),S(Math.cos(m)*s,g,Math.sin(m)*s,k,Y,J,t(s),Q)})}function Ba(t,o){o===void 0&&(o=1),t*=o,t>0&&(B.T+=t*1.3*Math.max(0,1-(B.T-B.T0)/360))}function _a(t,o){Ba(t,o);const a=gt[4],e=B.R,i=B.TH,u=B.Y,c=B.OM,p=B.T;for(let f=0;f<h;f++){const C=i[f]+p*c[f],z=e[f],b=f*3;a[b]=Math.cos(C)*z,a[b+1]=u[f],a[b+2]=-Math.sin(C)*z}}gt.push(new Float32Array(h*3)),_a(0);{const t=new Float32Array(h*3),o=2.39996323;for(let a=0;a<h;a++){const e=1-2*(a+.5)/h,i=Math.sqrt(Math.max(0,1-e*e)),u=o*a,c=Xt+.1+y()*.1;t[a*3]=Math.cos(u)*i*c,t[a*3+1]=e*c,t[a*3+2]=Math.sin(u)*i*c}gt.push(t)}const Bt=new Float32Array(h),$e=new Float32Array(h),Mt=new Float32Array(h*3);for(let t=0;t<h;t++){Bt[t]=Math.random(),$e[t]=.6+Math.pow(Math.random(),3)*1.9;const o=new THREE.Vector3(y(),y(),y()).normalize().multiplyScalar(.5+Math.random());Mt[t*3]=o.x,Mt[t*3+1]=o.y,Mt[t*3+2]=o.z}for(let t=0;t<h;t++)B.GA[t*4]=B.GSZ[t]/$e[t];var Jt=[null,null,null,null,null],Je=!1;function Qe(t){const o=t===0?gt[0]:gt[t+1],a=new Float32Array(h);for(let c=0;c<h;c++){const p=o[c*3],f=o[c*3+1],C=o[c*3+2];a[c]=t===0?p*.8-f*.6:t===1?Math.atan2(C,p):t===4?f:Math.sqrt(p*p+C*C)}const e=new Uint32Array(h);for(let c=0;c<h;c++)e[c]=c;const i=Array.prototype.slice.call(e).sort((c,p)=>a[c]-a[p]),u=Jt[t]&&Jt[t].length===h?Jt[t]:new Float32Array(h);for(let c=0;c<h;c++){const p=i[c];u[p]=.5*(c/h)+.5*Bt[p]}Jt[t]=u}function Ao(){for(let t=0;t<5;t++)Qe(t);Je=!0}Ao();const ta=[2.6,2.8,0,2.6,0],ka=new Float32Array(h).fill(.7),xo=`
attribute vec3 aA;attribute vec3 aB;attribute float aDl;attribute vec3 aDir;
attribute vec4 aGal;attribute float aLandFrom;
uniform float uP,uSeg,uSt,uRate,uArc,uKnotC,uKnotS,uGalT,uRotA,uRotB,uGalA,uGalB,uOv,uOvT;`,So=`
  float mTh=mod(aGal.y+uGalT*aGal.w,6.28318530718);
  vec3 mGal=vec3(cos(mTh)*aGal.x,aGal.z,-sin(mTh)*aGal.x);
  vec3 mSa=uGalA>.5?mGal:aA;
  vec3 mSb=uGalB>.5?mGal:aB;
  float mT=clamp(uP-uSeg,0.,1.);
  float mL=clamp((mT-aDl*uSt)*uRate,0.,1.);
  float mE=mL*mL*mL*(mL*(mL*6.-15.)+10.);
  if(uRotA>.5){float tx=mSa.x;mSa.x=tx*uKnotC+mSa.z*uKnotS;mSa.z=-tx*uKnotS+mSa.z*uKnotC;}
  if(uRotB>.5){float tx=mSb.x;mSb.x=tx*uKnotC+mSb.z*uKnotS;mSb.z=-tx*uKnotS+mSb.z*uKnotC;}
  vec3 mBase=mSa+(mSb-mSa)*mE+aDir*(sin(3.14159265359*mE)*uArc);
  vec3 pos0=mBase;
  float mLandMix=1.;
  if(uOv>.5){
    if(uOv<1.5){
      float q=clamp((uOvT-aSeed*.45)/.55,0.,1.);float qe=q*q*(3.-2.*q);
      vec3 x=position*(1.-qe)+mBase*qe;
      x+=aDir*(sin(3.14159265359*qe)*${Ye.toFixed(4)}*(.35+aSeed));
      float th=(1.-qe)*${Ke.toFixed(4)},cs=cos(th),sn=sin(th);
      pos0=vec3(x.x*cs-x.z*sn,x.y,x.x*sn+x.z*cs);
    }else if(uOv<2.5){
      float ge=uOvT*uOvT*(3.-2.*uOvT);
      pos0=position*(1.-ge)+mBase*ge;
    }else{
      float q=clamp((uOvT-aSeed*.4)/.6,0.,1.);float qe=q*q*(3.-2.*q);
      pos0=position+(mBase-position)*qe;
      mLandMix=qe;
    }
  }
  float landV=mix(aLandFrom,aLand,mLandMix);`,Ro=`
attribute float aSeed;
attribute float aSize;
attribute float aAcc;
attribute float aLand;
attribute vec4 aGA;   /* galaxy: size mult, alpha, soft, - */
attribute vec3 aGC;   /* galaxy: colour */
uniform float uTime,uWobble,uSize,uScaleH,uEnergy,uPtrStr,uGlobe,uGal,uWind,uHero;
${Vt?xo:""}
uniform float uRepel,uAspect;   /* scroll-field repel: strength (0 in hero), viewport aspect */
uniform vec2 uRepelPos;         /* cursor in NDC */
uniform vec3 uPointer;
uniform vec3 uRip[5];uniform float uRipT[5];
varying float vMix,vGlow,vDepth,vSeed,vAcc,vLand,vFres,vBack,vShell;
varying vec3 vGC;varying vec2 vGS;varying float vHit;
void main(){
  ${Vt?So:"vec3 pos0=position;float landV=aLand;"}
  vec3 p=pos0;
  float t=uTime;
  float n1=sin(p.x*.32+t*.8+aSeed*6.283);
  float n2=cos(p.z*.28+t*.6+aSeed*4.71);
  float n3=sin(t*.45+aSeed*9.42);
  p.y+=n1*n2*uWobble*2.1;
  p.x+=n3*uWobble*.4;
  p.z+=n1*uWobble*.4;
  vec3 dv=p-uPointer;
  float f=exp(-dot(dv,dv)*.05)*uPtrStr;
  /* The mark stays INTACT under the cursor (only shines / twinkles \u2014 see vHit).
     Dust that blows away is a separate emitter (flyPts), like the old erosion
     effect. uWind = "mark stage" weight: no parting on the mark, gentle later. */
  p+=normalize(dv+vec3(1e-4))*f*.8*(1.-uWind);
  vHit=clamp(f*.9,0.,1.);
  vGlow=min(f*.9+uEnergy,1.4);
  /* CLICK RIPPLES \u2014 pooled (origin,birth) slots (NexusNode pattern): the
     shader derives each wave's age from uTime, so concurrent waves
     superpose and a new click never restarts a live one. Dead slots carry
     birth -1000, so amp clamps to 0. Glow joins vGlow \u2192 ember palette. */
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
  vMix=aSeed;vSeed=aSeed;vAcc=aAcc;vLand=landV;vGC=aGC;vGS=aGA.yz;
  vec3 nW=normalize(mat3(modelMatrix)*normalize(pos0));
  vec4 wp=modelMatrix*vec4(p,1.);
  vec3 vDir=normalize(cameraPosition-wp.xyz);
  float facing=dot(nW,vDir);
  /* GENESIS geometry \u2014 everything smooth, nothing pops:
     vFres  \u2014 limb weight, near hemisphere only (clamped)
     vBack  \u2014 far-side fade spread over ~12\xB0 (was a hard step: rim pop)
     vShell \u2014 radius gate: how close the ember is to the world's shell.
              Flying embers keep full presence; the surface skin engages
              only as they ARRIVE, so the swarm visibly condenses INTO
              the globe instead of evaporating onto it. */
  vFres=clamp(1.-max(facing,0.),0.,1.);
  vBack=smoothstep(-.2,.08,facing);
  vShell=1.-smoothstep(0.,1.2,length(pos0)-7.9);
  vec4 mv=modelViewMatrix*vec4(p,1.);
  /* SCROLL-FIELD REPEL \u2014 after the hero, embers ease away from the cursor.
     Screen-space (so it feels the same at any depth / camera stage): each
     ember is pushed along the cursor\u2192ember direction by a gaussian-weighted
     amount. Displacement ~ r*exp(-r\xB2/R\xB2): zero right under the cursor, peaks
     at ~R/1.4, fades to nothing beyond ~2R \u2014 a soft parting, never a blast.
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
  gl_PointSize=min(uSize*aSize*(1.+.3*uHero)*(1.+vHit*.55)*mix(1.,aGA.x,uGal)*(1.+uEnergy*.4+vAcc*.4)*(1.-uGlobe*.3)*.09*uScaleH/max(vDepth,.1),72.);
  gl_Position=projectionMatrix*mv;
}`,Ho=`
uniform vec3 uColA,uColB,uAcc,uGViolet;
uniform float uTime,uGlobe,uGal,uHero;
varying float vMix,vGlow,vDepth,vSeed,vAcc,vLand,vFres,vBack,vShell;
varying vec3 vGC;varying vec2 vGS;varying float vHit;
void main(){
  vec2 c=gl_PointCoord-.5;
  float d=length(c);
  if(d>.5)discard;
  /* CRYSTAL SPRITE \u2014 hard-cut core, near-zero halo: edgy diamond facets, not soft embers */
  float core=1.-smoothstep(.08,.22,d);
  core=pow(core,1.35);
  float halo=1.-smoothstep(0.,.5,d);
  halo*=halo;
  float a=min(core*.98+halo*mix(.14,.03,uGal),1.);
  /* GALAXY \u2014 bokeh / nebula embers swap the sharp spark for a soft disc, and
     every ember takes its own alpha; all gated by uGal so no other stage changes */
  float dd=d*2.;
  float sa=exp(-dd*dd*3.)*(1.-smoothstep(.8,1.,dd));
  a=mix(a,sa,vGS.y*uGal);
  a*=mix(1.,vGS.x,uGal);
  a*=.68+.32*sin(uTime*(1.8+vSeed*2.6)+vSeed*37.);
  a=mix(a,min(a*1.18+.06,1.),uHero);   /* MARK-ONLY lift \u2014 later stages keep default twinkle */
  /* TOUCH \u2014 embers under the cursor flash and twinkle fast */
  float tw=.5+.5*sin(uTime*(16.+vSeed*22.)+vSeed*61.);
  a=min(a*(1.+vHit*(.6+1.6*tw)),1.);
  a*=1.-smoothstep(40.,88.,vDepth);
  a*=smoothstep(.4,3.5,vDepth);
  vec3 col=mix(uColB,uColA,clamp(vMix*.72+vGlow,0.,1.));
  col+=uColA*vGlow*1.05;
  col=mix(col,uAcc*(.75+vGlow*.5),vAcc*.85);
  col=mix(col,vGC*1.0*(1.+vGlow*.4),uGal);       /* galaxy palette */
  col=mix(col,vec3(1.),core*core*.32*(1.-vGS.y*uGal));          /* restrained sparkle \u2014 violet stays violet */
  col*=1.+.18*uHero;                              /* MARK-ONLY gain \u2014 dispersal onward stays default */
  /* GENESIS \u2014 the world IS its particles. Landed embers become the skin:
     a dim violet interior floor (texture, not glow \u2014 city-light sparkle)
     and a bright limb. The gate is radius-based (vShell), so the flying
     swarm stays fully visible and only takes on the skin as it arrives. */
  if(uGlobe>.001){
    float land=clamp(vLand,0.,1.);
    float limb=smoothstep(.32,.75,vFres);
    vec3 gcol=uGViolet*(.08+.34*land)*(.3+.7*vSeed*vSeed);
    gcol=mix(gcol,vec3(.85,.82,1.)*(.25+.5*land),core*vSeed*vSeed*.35);  /* city-light glints */
    gcol+=uGViolet*pow(vFres,1.8)*.45;
    gcol*=.97+.03*sin(uTime*.5);
    col=mix(col,min(gcol,vec3(1.)),uGlobe);
    float gate=(.38+.62*limb)*vBack;
    a*=mix(1.,gate,vShell*uGlobe);
  }
  gl_FragColor=vec4(col,a);
}`,Co=8,Go=.12,Lo=8,Da=[[[0,0,34],[0,-1,0]],[[17,5.5,15.5],[0,.5,0]],[[0,4.5,20.5],[0,0,0]],[[0,15.5,20.5],[0,-1.5,0]],[[0,12.5,16.5],[0,.5,0]],[[0,1.2,29.2],[-3.4,-1,0]]],Ia=[.02,.5,.1,1.5,.12,.14],za=[1.25,1.07,1.14,.96,1.09,1.14],ce=[0,.015,.16,.03,.08,.05],Va=-2.95,Oo=.375,Po=.05,Fo=1.8,Bo=.08,_o=9,ue=[0];for(let t=0;t<ce.length-1;t++)ue.push(ue[t]+(ce[t]+ce[t+1])*.5*_o);const ko=Va+Tt*Math.round((ue[4]-Va)/Tt);let qt=null,de=0,Pt=0,Ce=0;const ea=[0,0];function aa(t,o,a,e,i,u){const c=2/e,p=c*u,f=1/(1+p+.48*p*p+.235*p*p*p),C=i*e;let z=H(t-o,-C,C);const b=t-z,x=(a+c*z)*u;a=(a-c*x)*f;let _=b+(z+x)*f;return o-t>0==_>o&&(_=o,a=0),ea[0]=_,ea[1]=a,ea}const Do=!0,Wa=["#ffffff","#f0eeff","#ffffff","#ece6ff","#ffffff","#faf9ff"].map(t=>new THREE.Color(t)),Na=["#9d74ff","#7a68c8","#8a72ec","#7c66dc","#9468ff","#8a82b4"].map(t=>new THREE.Color(t)),Ge=new THREE.Vector2(0,0),he=new THREE.Vector2(0,0);let Qt=0,tn=0,L=0;const Ua=new THREE.Vector2(0,0);let fe=0,Le=!1,oa=performance.now(),Io=0;const na=[-1e3,-1e3,-1e3,-1e3,-1e3];let ra="",Oe=0,lt=0,Pe=0,te=0,qa=0,ee=0,ae=0,oe=!1,ja=!1,jt=0,ia=0,la=1,It=null,me=null,pe=null,Gt=1,sa=!1,Ya=!1,ca=0,ua=0,da=0;const ha=new THREE.Raycaster,zo=new THREE.Vector3,fa=new THREE.Vector3,Fe=new THREE.Vector3,Ka=new THREE.Vector3,Vo=new THREE.Plane(new THREE.Vector3(0,0,1),0);function Xa(){oe&&(oe=!1,document.body.classList.remove("dragging"))}window.matchMedia&&matchMedia("(pointer: coarse)").matches||innerWidth<900||(addEventListener("pointermove",t=>{oa=performance.now(),t.pointerType!=="touch"&&(Le=!0);const o=t.clientX/innerWidth*2-1,a=-(t.clientY/innerHeight)*2+1;if(Qt=Math.min(Qt+Math.hypot(o-he.x,a-he.y)*.9,.8),he.set(o,a),oe){const e=t.clientX-ua,i=t.clientY-da;ae+=e*.005,ee=H(ee+i*.005,-.9,.7),ua=t.clientX,da=t.clientY;const u=performance.now(),c=(u-ia)/1e3;ia=u,c>0&&c<.12?jt=H(e*.005/c,-3,3):c>=.12&&(jt=0)}},{passive:!0}),addEventListener("pointerdown",t=>{if(Qt=1.8,oa=performance.now(),r&&!ft){const o=r.uniforms.uTime.value;let a=0,e=1/0;for(let i=0;i<5;i++){if(na[i]<o-3){a=i;break}const u=na[i]+2.4-o;u<e&&(e=u,a=i)}r.uniforms.uRip.value[a].copy(Fe),r.uniforms.uRipT.value[a]=o,na[a]=o,Io=performance.now()+2400}lt>.5&&t.target instanceof Element&&!t.target.closest("button,a,input,textarea,label")&&(oe=!0,ua=t.clientX,da=t.clientY,ia=performance.now(),jt=0,document.body.classList.add("dragging"))},{passive:!0}),document.documentElement.addEventListener("pointerleave",()=>{Le=!1},{passive:!0}),addEventListener("blur",()=>{Le=!1}),addEventListener("keydown",t=>{if(lt<=.5||t.target instanceof Element&&t.target.closest("input,textarea,select,[contenteditable]"))return;const o=t.key;let a=!0;o==="ArrowLeft"?ae-=.14:o==="ArrowRight"?ae+=.14:o==="ArrowUp"?ee=H(ee-.09,-.9,.7):o==="ArrowDown"?ee=H(ee+.09,-.9,.7):a=!1,a&&(Qt=Math.min(Qt+.5,1))}),addEventListener("pointerup",Xa,{passive:!0}),addEventListener("pointercancel",Xa,{passive:!0}));try{let Et=function(n,l,d){const w=document.createElement("canvas");w.width=w.height=n;const M=w.getContext("2d");M.translate(n/2,n/2),M.scale(1,d||1);const I=M.createRadialGradient(0,0,0,0,0,n/2);return l.forEach(G=>I.addColorStop(G[0],G[1])),M.fillStyle=I,M.fillRect(-n,-n,2*n,2*n),new THREE.CanvasTexture(w)},P=function(n,l){return new THREE.MeshBasicMaterial({map:n,transparent:!0,opacity:0,blending:THREE.AdditiveBlending,depthWrite:!1,depthTest:!1})},K=function(n,l,d,w){const M=new THREE.Mesh(new THREE.PlaneGeometry(d*$t,d*$t),P(l));M.rotation.x=-Math.PI/2,M.renderOrder=-1,M.frustumCulled=!1,n.add(M),Y.push({mat:M.material,base:w,obj:M})},F=function(n,l,d){const w=new THREE.Sprite(new THREE.SpriteMaterial({map:n,transparent:!0,opacity:0,blending:THREE.AdditiveBlending,depthWrite:!1,depthTest:!1}));w.scale.set(l*$t,l*$t,1),w.renderOrder=-1,J.add(w),Y.push({mat:w.material,base:d,obj:w})},ct=function(){const n=t.domElement.height*.5/Math.tan(Math.PI/6);e.uScaleH.value=n,Ft&&(Ft.uniforms.uScaleH.value=n),k&&(k.u.uScaleH.value=n)},E=function(n,l){if(!l&&Math.abs(n-v)<5e-5)return!1;if(v=n,Vt){const R=H(Math.floor(n),0,4),wt=R===4;R!==c&&(c=R,i.setAttribute("aA",p[R]),i.setAttribute("aB",p[R+1]),i.setAttribute("aDl",f[R]));const A=e;return A.uP.value=n,A.uSeg.value=R,A.uSt.value=(wt?.3:.35)*(R===0?.5:1),A.uRate.value=wt?1.5:1.9,A.uArc.value=ta[R],A.uKnotC.value=Math.cos(Pt),A.uKnotS.value=Math.sin(Pt),A.uRotA.value=R===2&&Pt!==0?1:0,A.uRotB.value=R===1&&Pt!==0?1:0,A.uGalT.value=B.T,A.uGalA.value=R===4?1:0,A.uGalB.value=R===3?1:0,!0}const d=H(Math.floor(n),0,4),w=H(n-d,0,1),M=gt[d],I=gt[d+1],G=ta[d],at=d===4,xt=(at?.3:.35)*(d===0?.5:1),Z=at?1.5:1.9,dt=Jt[d],bt=Math.cos(Pt),pt=Math.sin(Pt),D=d===2&&Pt!==0,tt=d===1&&Pt!==0;for(let R=0;R<h;R++){const wt=(dt?dt[R]:Bt[R])*xt;let A=(w-wt)*Z;A=A<0?0:A>1?1:A;const nt=A*A*A*(A*(A*6-15)+10),j=R*3;let St=M[j],we=M[j+1],ye=M[j+2],Ma=I[j],Zo=I[j+1],De=I[j+2],ie;D&&(ie=St,St=ie*bt+ye*pt,ye=-ie*pt+ye*bt),tt&&(ie=Ma,Ma=ie*bt+De*pt,De=-ie*pt+De*bt);const wa=Math.sin(Math.PI*nt)*G;X[j]=St+(Ma-St)*nt+Mt[j]*wa,X[j+1]=we+(Zo-we)*nt+Mt[j+1]*wa,X[j+2]=ye+(De-ye)*nt+Mt[j+2]*wa}return!0},U=function(n,l,d){if(n===4){const w=B.TH[l]+B.T*B.OM[l],M=B.R[l];d[0]=Math.cos(w)*M,d[1]=B.Y[l],d[2]=-Math.sin(w)*M}else{const w=gt[n],M=l*3;d[0]=w[M],d[1]=w[M+1],d[2]=w[M+2]}},ut=function(n,l,d,w){const M=H(Math.floor(l),0,4),I=H(l-M,0,1),G=M===4,at=(G?.3:.35)*(M===0?.5:1),xt=G?1.5:1.9;let Z=(I-Jt[M][n]*at)*xt;Z=Z<0?0:Z>1?1:Z;const dt=Z*Z*Z*(Z*(Z*6-15)+10);if(U(M,n,T),U(M+1,n,q),Pt!==0){const D=Math.cos(Pt),tt=Math.sin(Pt);let R;M===2&&(R=T[0],T[0]=R*D+T[2]*tt,T[2]=-R*tt+T[2]*D),M===1&&(R=q[0],q[0]=R*D+q[2]*tt,q[2]=-R*tt+q[2]*D)}const bt=Math.sin(Math.PI*dt)*ta[M],pt=n*3;d[w]=T[0]+(q[0]-T[0])*dt+Mt[pt]*bt,d[w+1]=T[1]+(q[1]-T[1])*dt+Mt[pt+1]*bt,d[w+2]=T[2]+(q[2]-T[2])*dt+Mt[pt+2]*bt};const t=new THREE.WebGLRenderer({canvas:_t,alpha:!0,antialias:!1,powerPreference:Dt?"low-power":"high-performance"});t.setClearColor(0,0),_t.addEventListener("webglcontextlost",n=>{n.preventDefault()},!1),_t.addEventListener("webglcontextrestored",()=>{ra="",qt=null,de=0},!1),t.setPixelRatio(Se?.75:Math.min(devicePixelRatio||1,Dt||re||innerWidth*innerHeight>16e5?1:1.25)),t.setSize(innerWidth,innerHeight,!1);const o=new THREE.Scene,a=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,240);{const n=re||Dt?Se?250:450:1200,l=new Float32Array(n*3),d=new Float32Array(n),w=new Float32Array(n);for(let Z=0;Z<n;Z++){const dt=new THREE.Vector3(y(),y(),y()).normalize().multiplyScalar(55+Math.random()*55);l[Z*3]=dt.x,l[Z*3+1]=dt.y*.6,l[Z*3+2]=dt.z,d[Z]=Math.random(),w[Z]=.2+Math.random()*1.1}const M=new THREE.BufferGeometry;M.setAttribute("position",new THREE.BufferAttribute(l,3)),M.setAttribute("aSeed",new THREE.BufferAttribute(d,1)),M.setAttribute("aTw",new THREE.BufferAttribute(w,1));const I={uTime:{value:0},uScaleH:{value:1},uAmp:{value:ft?.18:1},uOpacity:{value:.5},uCol:{value:new THREE.Color(10130633)}},G=new THREE.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,depthTest:!1,blending:THREE.AdditiveBlending,vertexShader:`
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
        }`,fragmentShader:`
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
        }`}),at=new THREE.Points(M,G);at.frustumCulled=!1,at.renderOrder=-3;const xt=new THREE.Group;xt.add(at),o.add(xt),Ft={group:xt,uniforms:I}}const e={uTime:{value:0},uWobble:{value:.02},uSize:{value:1.12},uScaleH:{value:1},uEnergy:{value:0},uPtrStr:{value:1},uGlobe:{value:0},uGal:{value:0},uWind:{value:1},uHero:{value:1},uPointer:{value:new THREE.Vector3(999,999,999)},uRepel:{value:0},uRepelPos:{value:new THREE.Vector2(9,9)},uAspect:{value:innerWidth/innerHeight},uRip:{value:[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]},uRipT:{value:[-1e3,-1e3,-1e3,-1e3,-1e3]},uColA:{value:new THREE.Color},uColB:{value:new THREE.Color},uAcc:{value:new THREE.Color("#8422f7")},uGViolet:{value:new THREE.Color(Te)}};Vt&&Object.assign(e,{uP:{value:0},uSeg:{value:0},uSt:{value:.175},uRate:{value:1.9},uArc:{value:0},uKnotC:{value:1},uKnotS:{value:0},uGalT:{value:0},uRotA:{value:0},uRotB:{value:0},uGalA:{value:0},uGalB:{value:0},uOv:{value:0},uOvT:{value:0}});const i=new THREE.BufferGeometry,u=new THREE.BufferAttribute(new Float32Array(h*3),3);i.setAttribute("position",u),i.setAttribute("aSeed",new THREE.BufferAttribute(Bt,1)),i.setAttribute("aSize",new THREE.BufferAttribute($e,1)),Nt=new THREE.BufferAttribute(new Float32Array(h),1),Nt.array.set(Ze.acc),i.setAttribute("aAcc",Nt),Ot=new THREE.BufferAttribute(ka,1),i.setAttribute("aLand",Ot),i.setAttribute("aGA",new THREE.BufferAttribute(B.GA,4)),i.setAttribute("aGC",new THREE.BufferAttribute(B.GC,3));let c=-1,p=null,f=null,C=null;if(Vt){p=gt.map(l=>new THREE.BufferAttribute(l,3)),f=Jt.map(l=>new THREE.BufferAttribute(l,1)),i.setAttribute("aDir",new THREE.BufferAttribute(Mt,3));const n=new Float32Array(h*4);for(let l=0;l<h;l++)n[l*4]=B.R[l],n[l*4+1]=B.TH[l],n[l*4+2]=B.Y[l],n[l*4+3]=B.OM[l];i.setAttribute("aGal",new THREE.BufferAttribute(n,4)),C=new THREE.BufferAttribute(new Float32Array(ka),1),i.setAttribute("aLandFrom",C),i.setAttribute("aA",p[0]),i.setAttribute("aB",p[1]),i.setAttribute("aDl",f[0]),c=0}const z=new THREE.ShaderMaterial({uniforms:e,vertexShader:Ro,fragmentShader:Ho,transparent:!0,depthWrite:!1,depthTest:!1,blending:THREE.AdditiveBlending}),b=new THREE.Points(i,z);b.frustumCulled=!1;const x=new THREE.Group;x.add(b),o.add(x);const _=Xe?32:48,W=document.createElement("canvas");W.width=W.height=2;const S=W.getContext("2d");S.fillStyle="#000",S.fillRect(0,0,2,2);const V=new THREE.CanvasTexture(W),O=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uFade:{value:0},uHasTex:{value:0},uMain:{value:new THREE.Color(Te)},uGlow:{value:new THREE.Color(Te)},uTexture:{value:V}},vertexShader:`
      varying vec2 vUv;varying vec3 vNw;varying vec3 vView;
      void main(){
        vUv=uv;
        vNw=normalize(mat3(modelMatrix)*normal);
        vec4 wp=modelMatrix*vec4(position,1.);
        vView=normalize(cameraPosition-wp.xyz);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
      }`,fragmentShader:`
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
        /* LIGHT LAND \u2014 bright violet continents lifted 30% toward white,
           shaded by the map so regions keep their own contrast; oceans
           near-black, so the contrast carries the look */
        float lit=max(dot(vNw,normalize(vec3(.5,.3,1.))),0.);
        vec3 land=mix(uMain,vec3(.97,.96,1.),.5)*(1.0+.55*shade)*(.85+.15*lit);
        vec3 col=mix(vec3(.004,.004,.009),land,landMask);
        /* the limb owns the surface's added light */
        float fres=pow(1.-max(dot(vNw,vView),0.),2.5);
        col+=uGlow*fres*.9;
        col*=.97+.03*sin(uTime*.5);
        /* faint dither \u2014 kills banding in the near-black oceans */
        col+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/160.;
        /* GLASS \u2014 deliberately translucent so the embers above and the
           dust behind read through it: a world made from its particles */
        gl_FragColor=vec4(col,uFade*mix(${po.toFixed(2)},.9,landMask));
      }`,transparent:!0,depthWrite:!1,depthTest:!1}),N=new THREE.Mesh(new THREE.SphereGeometry(Xt*.985,_,_),O);N.renderOrder=-1,N.visible=!1,N.frustumCulled=!1,x.add(N);const et=Xt*1.5,st=Xt*1.4,s=new THREE.ShaderMaterial({uniforms:{uColor:{value:new THREE.Color(Te)},uFade:{value:0},uB:{value:Xt*.985},uO:{value:st}},vertexShader:`
      varying vec3 vPos;varying vec3 vC;
      void main(){
        vec4 mv=modelViewMatrix*vec4(position,1.);
        vPos=mv.xyz;
        vC=(modelViewMatrix*vec4(0.,0.,0.,1.)).xyz;
        gl_Position=projectionMatrix*mv;
      }`,fragmentShader:`
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
      }`,side:THREE.BackSide,transparent:!0,depthWrite:!1,depthTest:!1,blending:THREE.CustomBlending,blendEquation:THREE.AddEquation,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor}),m=new THREE.Mesh(new THREE.SphereGeometry(et,_,_),s);m.renderOrder=1,m.visible=!1,m.frustumCulled=!1,x.add(m);const g=Dt||re?0:Xe?240:800;let k=null;if(g){const n=new Float32Array(g*3),l=new Float32Array(g*3),d=new Float32Array(g),w=new Float32Array(g),M=new Float32Array(g),I=new Float32Array(g*3),G=new Float32Array(g),at=new THREE.BufferGeometry,xt=new THREE.BufferAttribute(n,3).setUsage(THREE.DynamicDrawUsage),Z=new THREE.BufferAttribute(d,1).setUsage(THREE.DynamicDrawUsage);at.setAttribute("position",xt),at.setAttribute("aLife",Z),at.setAttribute("aSize",new THREE.BufferAttribute(M,1)),at.setAttribute("aCol",new THREE.BufferAttribute(I,3));const dt={uScaleH:{value:1},uTime:{value:0}},bt=new THREE.ShaderMaterial({uniforms:dt,transparent:!0,depthWrite:!1,depthTest:!1,blending:THREE.AdditiveBlending,vertexShader:`
        attribute float aLife;attribute float aSize;attribute vec3 aCol;
        uniform float uScaleH;varying float vL;varying vec3 vC;
        void main(){
          vec4 mv=modelViewMatrix*vec4(position,1.);
          vL=aLife;vC=aCol;
          gl_Position=projectionMatrix*mv;
          gl_PointSize=min(aSize*(.55+.45*aLife)*1.25*.09*uScaleH/max(-mv.z,.1),40.);
        }`,fragmentShader:`
        varying float vL;varying vec3 vC;
        void main(){
          if(vL<=0.)discard;
          vec2 c=gl_PointCoord-.5;float d=length(c);
          if(d>.5)discard;
          float core=1.-smoothstep(.12,.34,d);
          float halo=1.-smoothstep(0.,.5,d);halo*=halo;
          float a=min(core+halo*.35,1.)*pow(vL,.8);
          gl_FragColor=vec4(mix(vC,vec3(1.),core*.35),a);
        }`}),pt=new THREE.Points(at,bt);pt.frustumCulled=!1,pt.renderOrder=3,x.add(pt);let D=0;const tt=new Float32Array(3);k={u:dt,emit(R){const wt=D;D=(D+1)%g;const A=wt*3;r.logicalOne(R,tt),n[A]=tt[0],n[A+1]=tt[1],n[A+2]=tt[2];const nt=1.8+Math.random()*3.2;if(l[A]=-nt*(.55+Math.random()*.6),l[A+1]=nt*(.6+Math.random()*.7),l[A+2]=(Math.random()-.5)*.9,d[wt]=1,w[wt]=.22+Math.random()*.5,M[wt]=.9+Math.random()*1.8,G[wt]=Math.random()*6.28,Nt&&Nt.array[R]>.5)I[A]=.62,I[A+1]=.36,I[A+2]=1;else{const St=.85+Math.random()*.15;I[A]=St,I[A+1]=St*.96,I[A+2]=1}at.attributes.aCol.needsUpdate=!0,at.attributes.aSize.needsUpdate=!0},step(R,wt){let A=!1;for(let nt=0;nt<g;nt++){if(d[nt]<=0)continue;A=!0;const j=nt*3,St=1-.3*R;l[j]*=St,l[j+1]*=St,l[j+2]*=St,l[j]+=Math.sin(wt*2.3+G[nt])*.9*R,l[j+1]+=Math.cos(wt*1.9+G[nt]*1.7)*.9*R,n[j]+=l[j]*R,n[j+1]+=l[j+1]*R,n[j+2]+=l[j+2]*R,d[nt]-=w[nt]*R,d[nt]<0&&(d[nt]=0)}A&&(xt.needsUpdate=!0,Z.needsUpdate=!0)}}}const Y=[],J=new THREE.Group,Q=new THREE.Group;J.add(Q),x.add(J),K(J,Et(256,[[0,"rgba(125,108,255,.5)"],[.4,"rgba(110,95,240,.15)"],[1,"rgba(100,85,230,0)"]]),55,.16),K(J,Et(256,[[0,"rgba(255,244,235,.85)"],[.35,"rgba(225,205,255,.25)"],[1,"rgba(200,180,255,0)"]]),24,.18);const mt=[[0,"rgba(250,244,255,.95)"],[.18,"rgba(220,205,255,.7)"],[.45,"rgba(170,150,255,.22)"],[1,"rgba(150,130,255,0)"]];K(Q,Et(512,mt,.5),15,.38),F(Et(256,mt),4.2,.6),F(Et(128,[[0,"rgba(255,252,250,1)"],[.3,"rgba(240,228,255,.7)"],[1,"rgba(210,190,255,0)"]]),1.3,.3),J.visible=!1,ct();const X=new Float32Array(h*3);let v=-1;E(0,!0),u.array.set(X),u.needsUpdate=!0;const T=[0,0,0],q=[0,0,0];let ot=null,At=null;r=Object.assign({renderer:t,scene:o,camera:a,uniforms:e,group:x,morph:E,updateScale:ct,posAttr:u,baseArr:X,globeBody:N,globeAtm:m,galFx:Y,galGroup:J,barGroup:Q,fly:k,points:b},Vt?{logicalOne(n,l){ut(n,e.uP.value,l,0)},logical(){const n=new Float32Array(h*3),l=e.uP.value;for(let d=0;d<h;d++)ut(d,l,n,d*3);return n},visible(){const n=new Float32Array(h*3),l=e.uP.value,d=e.uOv.value,w=e.uOvT.value,M=u.array;for(let I=0;I<h;I++){const G=I*3;if(ut(I,l,n,G),!d)continue;const at=n[G],xt=n[G+1],Z=n[G+2],dt=M[G],bt=M[G+1],pt=M[G+2];if(d===1){let D=(w-Bt[I]*.45)/.55;D=D<0?0:D>1?1:D;const tt=D*D*(3-2*D);let R=dt*(1-tt)+at*tt,wt=bt*(1-tt)+xt*tt,A=pt*(1-tt)+Z*tt;const nt=Math.sin(Math.PI*tt)*Ye*(.35+Bt[I]);R+=Mt[G]*nt,wt+=Mt[G+1]*nt,A+=Mt[G+2]*nt;const j=(1-tt)*Ke,St=Math.cos(j),we=Math.sin(j);n[G]=R*St-A*we,n[G+1]=wt,n[G+2]=R*we+A*St}else if(d===2){const D=w*w*(3-2*w);n[G]=dt*(1-D)+at*D,n[G+1]=bt*(1-D)+xt*D,n[G+2]=pt*(1-D)+Z*D}else{let D=(w-Bt[I]*.4)/.6;D=D<0?0:D>1?1:D;const tt=D*D*(3-2*D);n[G]=dt+(at-dt)*tt,n[G+1]=bt+(xt-bt)*tt,n[G+2]=pt+(Z-pt)*tt}}return n},landVisible(){const n=new Float32Array(Ot.array);if(e.uOv.value===3){const l=e.uOvT.value,d=C.array;for(let w=0;w<h;w++){let M=(l-Bt[w]*.4)/.6;M=M<0?0:M>1?1:M;const I=M*M*(3-2*M);n[w]=d[w]+(Ot.array[w]-d[w])*I}}return n},setShape(n){p[n].array=gt[n],p[n].needsUpdate=!0},touchDelay(n){f[n].needsUpdate=!0},gpuOverlay(n,l,d,w){d&&d!==ot&&(u.array.set(d),u.needsUpdate=!0,ot=d),w&&w!==At&&(C.array.set(w),C.needsUpdate=!0,At=w),e.uOv.value=n,e.uOvT.value=l}}:{logicalOne(n,l){const d=n*3;l[0]=X[d],l[1]=X[d+1],l[2]=X[d+2]},logical(){return new Float32Array(X)},visible(){return new Float32Array(u.array)},landVisible(){return new Float32Array(Ot.array)},setShape(){},touchDelay(){}});try{const n=[N,m,J].filter(Boolean),l=n.map(d=>d.visible);n.forEach(d=>{d.visible=!0}),(t.compileAsync?t.compileAsync(o,a):Promise.resolve(t.compile(o,a))).catch(()=>{}),n.forEach((d,w)=>{d.visible=l[w]})}catch(n){}}catch(t){_t.remove()}yo();function Wo(t){const e=document.createElement("canvas");e.width=360,e.height=180;const i=e.getContext("2d",{willReadFrequently:!0});i.drawImage(t,0,0,360,180);const u=i.getImageData(0,0,360,180).data,c=[],p=[],f=[0];let C=0;for(let S=0;S<180;S++){const V=(S+.5)/180*Math.PI,O=Math.sin(V);for(let N=0;N<360;N++){const et=(S*360+N)*4,st=(u[et]*.299+u[et+1]*.587+u[et+2]*.114)/255,s=ht(H((st-.15)/.25,0,1));if(s<=0)continue;const m=s*O;m<.02||(C+=m,c.push(V),p.push((N+.5)/360*Tt),f.push(C))}}if(c.length<200)throw new Error("no land");const z=()=>{const S=Math.random()*C;let V=1,O=f.length-1;for(;V<O;){const N=V+O>>1;f[N]<S?V=N+1:O=N}return Math.min(V,f.length-1)-1},b=new Float32Array(h*3),x=new Float32Array(h);for(let S=0;S<h;S++)if(S<h*.78){const V=z(),O=H(c[V]+(Math.random()-.5)*.03,.02,Math.PI-.02),N=p[V]+(Math.random()-.5)*.055,et=Math.sin(O),st=Xt+.02+Math.random()*.16;b[S*3]=-st*Math.cos(N)*et,b[S*3+1]=st*Math.cos(O),b[S*3+2]=st*Math.sin(N)*et,x[S]=1}else{const V=1-2*Math.random(),O=Math.sqrt(Math.max(0,1-V*V)),N=Math.random()*Tt,et=Xt+.02+Math.random()*.15;b[S*3]=Math.cos(N)*O*et,b[S*3+1]=V*et,b[S*3+2]=Math.sin(N)*O*et,x[S]=.14}const _=r?r.visible():null,W=r?r.landVisible():null;gt[5]=b,Je&&Qe(4),r&&(r.setShape(5),r.touchDelay(4)),Ot&&(L>3.2&&r&&!it?(It=_,me=W,pe=x,Gt=0,sa=!0,r.morph(L,!0)):(Ot.array.set(x),Ot.needsUpdate=!0,r&&(r.morph(L,!0),it||(Ct=_,vt=0))))}function No(){const t=["public/img/earth-2048.jpg"];let o=0;const a=()=>{o>=t.length||Oa(t[o++],e=>{const i=()=>{if(r&&r.globeBody){const u=new THREE.Texture(e);u.needsUpdate=!0,u.anisotropy=Math.min(4,r.renderer.capabilities.getMaxAnisotropy()),r.globeBody.material.uniforms.uTexture.value=u;try{r.renderer.initTexture&&r.renderer.initTexture(u)}catch(c){}Ya=!0}try{Wo(e)}catch(u){}};e.decode?e.decode().then(i,i):i()},a,6e3)};a()}let ma=!1;function Za(){ma||(ma=!0,No())}(window.requestIdleCallback?(t=>requestIdleCallback(t,{timeout:4e3})):(t=>setTimeout(t,0)))(()=>setTimeout(Za,12e3));let pa=innerWidth,$a=innerHeight,Ja=null;addEventListener("resize",()=>{clearTimeout(Ja),Ja=setTimeout(Uo,120)});function Uo(){le(),(innerWidth!==pa||Math.abs(innerHeight-$a)>150)&&r&&(r.camera.aspect=innerWidth/innerHeight,r.camera.updateProjectionMatrix(),r.renderer.setSize(innerWidth,innerHeight,!1),r.updateScale(),r.renderer.render(r.scene,r.camera)),innerWidth!==pa&&(pa=innerWidth,Ga()),$a=innerHeight,setTimeout(le,300)}document.fonts&&document.fonts.ready&&document.fonts.ready.then(le);let Be=0,ve=0,Qa=0,va=0,ge=0;function qo(t){if(Qa+=t,!(Qa<2.5||!r||!r.points||Be>=2)&&(t>1/28?ve+=t:ve=Math.max(0,ve-t*1.5),ve>1.5)){Be++,ve=0;try{var o=Math.floor(Be===1?h*.65:h*.4);r.points.geometry.setDrawRange(0,o)}catch(a){}}}let ne=window.scrollY||0,to=0,eo=performance.now(),_e=0,ao="",zt=null,Me=0,oo=ne,no=0;const jo=.1,Yo=3.6,Ko=2.6,Xo=.13;let ga=0,ro=0;const ke=new Float32Array(3);(function(){if(!("IntersectionObserver"in window))return;const t=new Set,o=new IntersectionObserver(function(a){a.forEach(function(e){e.isIntersecting?t.add(e.target):t.delete(e.target)}),ga=t.size?1:0});document.querySelectorAll(".device").forEach(function(a){o.observe(a)})})();function io(t){if(requestAnimationFrame(io),document.hidden||document.documentElement.classList.contains("motion-off"))return;var o=re||Dt?28:0;if(ga&&!it&&o&&t-ro<o)return;ro=t;const a=H((t-eo)/1e3,.001,.05);eo=t,qo(a);try{va++,ge||(ge=t),t-ge>=2e3&&(window.__pxPerf={fps:Math.round(va*1e3/(t-ge)),tier:Be},va=0,ge=t)}catch(f){}const e=window.scrollY||0;ne=Ve||ft?e:ne+(e-ne)*(1-Math.exp(-a*Co)),Math.abs(e-ne)<.5&&(ne=e),Math.abs(e-oo)>.5&&(oo=e,no=t),t-Aa>(ga?5e3:1500)&&t-no>250&&(Aa=t,le()),fo(a);const i=ho(ne);if(Ve||ft||zt===null)zt=i,Me=0;else{const f=ht(H((zt-3.5)/.35,0,1))*(1-ht(H((zt-4.95)/.15,0,1))),C=aa(zt,i,Me,Rt(jo,Xo,f),Rt(Yo,Ko,f),a);zt=C[0],Me=C[1],Math.abs(i-zt)<4e-4&&Math.abs(Me)<.002&&(zt=i,Me=0)}L=zt;const u=(L-to)/a;if(to=L,r){const f=r.uniforms,C=!ft&&L>3&&L<4;C&&(Vt?Ba(a,1):_a(a,1)),Ce=ft?0:ht(H((L-1.2)/.6,0,1))*(1-ht(H((L-2.2)/.6,0,1))),Ce>0&&(Pt+=a*Bo*Ce),!ma&&L>1.2&&Za();const z=r.morph(L,C||Ce>0);if(Vt){let v=0,E=0,T=null,q=null;if(it&&yt<1){const U=L>1.2?3:1;yt=Math.min(1,yt+a*U/Ha),yt>=1?(it=null,window.topoStart&&window.topoStart()):(v=1,E=yt,T=it)}r&&vt<1&&!it&&!z?(vt=Math.min(1,vt+a/.6),vt>=1?Ct=null:Ct&&!v&&(v=2,E=vt,T=Ct)):!it&&!(It&&Gt<1)&&z&&Ct&&(Ct=null,vt=1),It&&Gt<1&&(!it||L>2)&&(Gt=Math.min(1,Gt+a/1.1),sa&&(Ot.array.set(pe),Ot.needsUpdate=!0,sa=!1),Gt>=1?(It=null,me=null,pe=null):(v=3,E=Gt,T=It,q=me)),r.gpuOverlay(v,E,T,q)}else{if(it&&yt<1){const v=L>1.2?3:1;yt=Math.min(1,yt+a*v/Ha);const E=r.posAttr.array,T=r.baseArr,q=yt>=1;for(let U=0;U<h;U++){const ut=Bt[U]*.45;let ot=(yt-ut)/.55;ot=ot<0?0:ot>1?1:ot;const At=ot*ot*(3-2*ot),rt=U*3,n=1-At;let l=it[rt]*n+T[rt]*At,d=it[rt+1]*n+T[rt+1]*At,w=it[rt+2]*n+T[rt+2]*At;const M=Math.sin(Math.PI*At)*Ye*(.35+Bt[U]);l+=Mt[rt]*M,d+=Mt[rt+1]*M,w+=Mt[rt+2]*M;const I=(1-At)*Ke,G=Math.cos(I),at=Math.sin(I);E[rt]=l*G-w*at,E[rt+1]=d,E[rt+2]=l*at+w*G}q&&(E.set(T),it=null,window.topoStart&&window.topoStart()),r.posAttr.needsUpdate=!0}if(r&&vt<1&&!it&&!z){vt=Math.min(1,vt+a/.6);const v=vt*vt*(3-2*vt),E=r.posAttr.array,T=r.baseArr;for(let q=0;q<h;q++){const U=q*3,ut=1-v;E[U]=Ct[U]*ut+T[U]*v,E[U+1]=Ct[U+1]*ut+T[U+1]*v,E[U+2]=Ct[U+2]*ut+T[U+2]*v}vt>=1&&(Ct=null),r.posAttr.needsUpdate=!0}else!it&&!(It&&Gt<1)&&(z&&Ct&&(Ct=null,vt=1),z&&(r.posAttr.array.set(r.baseArr),r.posAttr.needsUpdate=!0));if(It&&Gt<1&&(!it||L>2)){Gt=Math.min(1,Gt+a/1.1);const v=r.posAttr.array,E=r.baseArr,T=It,q=Ot.array,U=me,ut=pe;for(let ot=0;ot<h;ot++){const At=Bt[ot]*.4;let rt=(Gt-At)/.6;rt=rt<0?0:rt>1?1:rt;const n=rt*rt*(3-2*rt),l=ot*3;v[l]=T[l]+(E[l]-T[l])*n,v[l+1]=T[l+1]+(E[l+1]-T[l+1])*n,v[l+2]=T[l+2]+(E[l+2]-T[l+2])*n,q[ot]=U[ot]+(ut[ot]-U[ot])*n}Gt>=1&&(v.set(E),q.set(ut),It=null,me=null,pe=null),r.posAttr.needsUpdate=!0,Ot.needsUpdate=!0}}je=yt<1?Math.sin(Math.PI*H(yt,0,1))*.6:0;const b=H(Math.floor(L),0,4),x=H(L-b,0,1),_=x*x*x*(x*(x*6-15)+10);let W=Rt(Ia[b],Ia[b+1],_),S=Rt(za[b],za[b+1],_),V=Rt(ce[b],ce[b+1],_);ft&&(W*=.35,V*=.4);const O=ht(H((L-3.25)/.75,0,1))*(1-ht(H((L-4)/.7,0,1)));if(f.uGal.value=O,r.galGroup.visible=O>.01,r.galGroup.visible){for(const v of r.galFx)v.mat.opacity=v.base*O;r.barGroup.rotation.y=Ut+B.T*He}f.uTime.value=t/1e3,f.uWobble.value=W;const N=ft?0:Math.sin(Math.PI*ht(H((L-4.05)/.9,0,1)));let et=0;if(!ft)for(let v=2;v<=4;v++){const E=H((L-(v-.4))/.4,0,1);E>0&&E<1&&(et=Math.max(et,Math.sin(Math.PI*ht(E))))}f.uSize.value=S*(1+je*.3+N*.15+et*.06)*bo;const st=Math.sin(Math.PI*x)*H(Math.abs(u)*1.4,0,1);f.uEnergy.value=Math.min(1.25,Rt(f.uEnergy.value,(ft?st*.4:st)+je+et*.25,1-Math.exp(-a*7))+N*.4),f.uColA.value.copy(Wa[b]).lerp(Wa[b+1],_),f.uColB.value.copy(Na[b]).lerp(Na[b+1],_),Oe=ht(H((L-4.05)/.8,0,1));const s=ht(H((L-3.4)/1.1,0,1));{const v=aa(lt,Oe,Pe,Go,Lo,a);lt=H(v[0],0,1),Pe=v[1]}Math.abs(Oe-lt)<5e-4&&Math.abs(Pe)<5e-4&&(lt=Oe,Pe=0);const m=lt*lt*lt*(lt*(lt*6-15)+10);if(f.uGlobe.value=lt,window.__topoOn&&ze)if(!window.__topoNoTrans&&t-window.__topoOnT>1500&&(window.__topoNoTrans=!0,ze.style.transition="none"),window.__topoNoTrans){const v=1-ht(H((L-.25)/.45,0,1));window.__topoVis=v;const E=(.45*v).toFixed(3);E!==ao&&(ao=E,ze.style.opacity=E)}else window.__topoVis=1;Ya&&(ca=Math.min(1,ca+a/.9));const g=ht(H((lt-.5)/.5,0,1)),k=ht(H((lt-.74)/.26,0,1));if(r.globeBody){const v=r.globeBody,E=r.globeAtm;v.visible=g>.005,E.visible=k>.005,v.visible&&(v.material.uniforms.uFade.value=g,v.material.uniforms.uTime.value=t/1e3,v.material.uniforms.uHasTex.value=ca),E.visible&&(E.material.uniforms.uFade.value=k);const T=(Fa+(Eo-Fa)*g).toFixed(2);T!==ra&&(ra=T,document.documentElement.style.setProperty("--gl-o",T))}const Y=lt>.5;Y!==ja&&(ja=Y,document.body.classList.toggle("globe-live",Y)),Qt*=Math.exp(-a*1.6);const J=1,Q=1-ht(H((L-.25)/.45,0,1));f.uHero.value=Q,f.uPtrStr.value=(1+Qt)*J*(1-lt*.55)*Q,f.uWind.value=1-.6*ht(H((L-.8)/1.2,0,1));const Et=ft||Ve||!Le?0:ht(H((L-.45)/.4,0,1))*(1-lt*.5);fe+=(Et-fe)*Math.min(1,a*2),fe<.002&&(fe=0),Ua.lerp(he,Math.min(1,a*8)),f.uRepel.value=fe,f.uRepelPos.value.copy(Ua),f.uAspect.value=r.camera.aspect,Ge.lerp(he,Math.min(1,a*4.5));const P=Rt(ue[b],ue[b+1],_)*(ft?.4:1);let K=P+(ft?0:Math.sin(t*7e-5)*.05*(1-Q));K+=(ko-K)*s;let F=K;if(lt>0){if(!ft){const v=1-m;te+=a*((Do?Po*m:0)+Fo*v*v)}oe||(ae+=jt*a*m,jt*=Math.exp(-a*2.2),Math.abs(jt)<.005&&(jt=0)),m<=.999&&te>Tt&&(te=Tt),m>.999&&(te-=Math.floor(te/Tt)*Tt,ae-=Math.round(ae/Tt)*Tt),qa=0,F=K,r.group.rotation.x=(Oo+qa+ee)*m}else te=0,jt=0,r.group.rotation.x=0;qt===null&&(qt=F);{const v=aa(qt,F,de,oe?.12:.14,8,a);qt=v[0],de=v[1]}if(Math.abs(F-qt)<.003&&Math.abs(de)<.02&&(qt=F,de=0),r.group.rotation.y=qt+(lt>0?(te+ae)*m:0),Ft){const v=t/1e3;Ft.uniforms.uTime.value=v,Ft.uniforms.uOpacity.value=(.5+f.uEnergy.value*.25)*To,Ft.group.rotation.y=v*.006+P*.18+L*.12,Ft.group.rotation.x=L*.08,Ft.group.rotation.z=Math.sin(v*.07)*.03}la+=((oe?0:1)-la)*Math.min(1,a*6);const mt=ht(H(L/.8,0,1))*la,ct=Da[b],X=Da[b+1];r.camera.position.set(Rt(ct[0][0],X[0][0],_)+Ge.x*1.5*mt,Rt(ct[0][1],X[0][1],_)+Ge.y*1*mt,Rt(ct[0][2],X[0][2],_));{var c=r.camera.aspect||1,p=Math.max(.52,Math.min(1,c/1.05));r.camera.position.z/=p}if(yt<1){const v=H(yt,0,1),E=1-Math.pow(1-v,3);r.camera.position.z+=(1-E)*10,r.camera.position.y+=(1-E)*2.4}if(lt>0&&(ft||(r.camera.position.x+=Math.sin(t/1e3*.1)*.15*m,r.camera.position.y+=Math.cos(t/1e3*.08)*.1*m),r.camera.position.z-=m*2.8),Ka.set(Rt(ct[1][0],X[1][0],_),Rt(ct[1][1],X[1][1],_),Rt(ct[1][2],X[1][2],_)),r.camera.lookAt(Ka),r.camera.updateMatrixWorld(),r.group.updateMatrixWorld(),ha.setFromCamera(Ge,r.camera),ha.ray.intersectPlane(Vo,fa)||ha.ray.closestPointToPoint(zo,fa),Fe.copy(fa),r.group.worldToLocal(Fe),f.uPointer.value.lerp(Fe,Math.min(1,a*4.5)),r.fly)if(r.fly.step(a,t/1e3),!ft&&!it&&L<.45&&performance.now()-oa<2500){_e+=a*170;const E=f.uPointer.value,T=3.2*3.2;for(;_e>=1;){_e-=1;for(let q=0;q<50;q++){const U=Math.random()*h|0;r.logicalOne(U,ke);const ut=ke[0]-E.x,ot=ke[1]-E.y,At=ke[2]-E.z;if(ut*ut+ot*ot+At*At<T){r.fly.emit(U);break}}}}else _e=0;r.renderer.render(r.scene,r.camera),!_t.classList.contains("on")&&(Ae||qe||L>.7)&&_t.classList.add("on")}}requestAnimationFrame(io)})();
