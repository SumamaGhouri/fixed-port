/* Imperative 3D engine, ported 1:1 from the original js/main.js.
   React renders all DOM; this file drives the three.js scene, themes, auto tour and scroll effects.
   Returns a cleanup function so React can unmount it safely. */
export default function startEngine(DATA, IMG){
const THREE=window.THREE;
let dead=false,RAF=0;const offs=[],ivs=[];
const W=(e,f,o)=>{window.addEventListener(e,f,o);offs.push(()=>window.removeEventListener(e,f,o))};
const SI=(f,t)=>{const id=setInterval(f,t);ivs.push(id);return id};
document.documentElement.classList.add('js');
const M=document.querySelector('main'),ST=[],D=14;
const SECTIONS=[
 {side:1,hue:.62,build:'hero'},
 {side:-1,hue:.85,build:'about'},
 ...DATA.companies.map((c,k)=>({side:k==1?-1:1,hue:[.02,.55,.45][k],build:c})),
 {side:-1,hue:.12,build:'skills'},
 {side:1,hue:.75,build:'certs'},
 {side:-1,hue:.33,build:'projects'},
 {side:1,hue:.95,build:'contact'}
];
[...M.children].forEach((s,i)=>{const o=SECTIONS[i];ST.push({side:o.side,hue:o.hue,build:o.build,s,bx:s.firstChild})});
let MAXY=Math.max(0,document.documentElement.scrollHeight-innerHeight);var ro=null;
const N=ST.length,nav=document.getElementById('nav');
const dots=[...nav.children];
function lg(txt,h){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),g=x.createRadialGradient(200,160,40,256,256,300);g.addColorStop(0,'hsl('+h*360+',80%,60%)');g.addColorStop(1,'hsl('+((h*360+60)%360)+',80%,25%)');x.fillStyle=g;x.fillRect(0,0,512,512);x.fillStyle='#fff';x.font='bold 190px monospace';x.textAlign='center';x.fillText(txt,256,310);return c.toDataURL()}
function pj(name,h){const c=document.createElement('canvas');c.width=512;c.height=360;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,512,360);g.addColorStop(0,'hsl('+h*360+',75%,50%)');g.addColorStop(1,'hsl('+((h*360+60)%360)+',75%,28%)');x.fillStyle=g;x.fillRect(0,0,512,360);x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,0,512,40);x.fillStyle='#fff';x.textAlign='center';x.font='bold 44px sans-serif';x.fillText(name,256,190);x.font='24px sans-serif';x.fillText('[ project screenshot ]',256,245);return c.toDataURL()}
const dk=!matchMedia('(prefers-color-scheme: light)').matches;
if(!dk)document.documentElement.style.setProperty('--l1','82%');
{const tl=document.getElementById('tl'),T=DATA.taglines;let k=0;tl.textContent=T[0];if(T.length>1)SI(()=>{tl.classList.add('out');setTimeout(()=>{k=(k+1)%T.length;tl.textContent=T[k];tl.classList.remove('out')},400)},3800)}
/* typing roles */
let ri=0,ci=0,del=0,hold=0;const rl=document.getElementById('role');
SI(()=>{const w=DATA.roles[ri];if(hold){hold--;return}if(!del){ci++;if(ci>=w.length){del=1;hold=14}}else{ci--;if(ci<=0){del=0;ri=(ri+1)%DATA.roles.length}}rl.textContent=w.slice(0,ci)},85);
/* project card texture: gradient placeholder with the site name, replaced by the screenshot (cover-cropped, top aligned) once it loads */
function pjT(p,h){const W=1024,H=725,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,W,H);
 g.addColorStop(0,'hsl('+h*360+',75%,50%)');g.addColorStop(1,'hsl('+((h*360+60)%360)+',75%,28%)');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,0,W,80);x.fillStyle='#fff';x.textAlign='center';x.font='bold 88px sans-serif';x.fillText(p.name,W/2,380);
 x.font='44px sans-serif';x.fillText(String(p.link||'').replace(/^https?:\/\//,'').replace(/\/$/,''),W/2,470);
 const t=new THREE.CanvasTexture(c);
 if(p.img){const im=new Image();im.onload=()=>{if(dead)return;const s=Math.max(W/im.width,H/im.height),w=im.width*s,hh=im.height*s;x.drawImage(im,(W-w)/2,0,w,hh);t.needsUpdate=true};im.onerror=()=>{};im.src=p.img}
 return t}
/* ===== 3D ===== */
let mkFl,buildTheme,lowq=0,cube,R=0,scene,cam,rd,pl,pts,rings=[],fl=[],L=dk?.7:.42;
const H=h=>new THREE.Color().setHSL(((h%1)+1)%1,.8,.58);
let mesh,std,TL,orbs,slab,coin;
try{
mesh=(g,m)=>new THREE.Mesh(g,m);
std=(h,w)=>new THREE.MeshLambertMaterial({color:H(h),wireframe:!!w});
TL=s=>new THREE.TextureLoader().load(s);
scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,300);
rd=new THREE.WebGLRenderer({canvas:document.getElementById('c'),alpha:true,antialias:devicePixelRatio<2,powerPreference:'high-performance'});
rd.setPixelRatio(Math.min(devicePixelRatio,1.5));rd.setSize(innerWidth,innerHeight);
scene.add(new THREE.AmbientLight(0xffffff,.75));pl=new THREE.PointLight(0xffffff,1.3,70);cam.add(pl);scene.add(cam);
orbs=(g,n,h,r)=>{const a=[];for(let j=0;j<n;j++){const o=mesh(new THREE.SphereGeometry(.16+.04*(j%3),16,16),std(h+j*.09));g.add(o);a.push(o)}return t=>a.forEach((o,j)=>{const q=t*.001*(1+j%3*.2)+j*6.28/n;o.position.set(Math.cos(q)*r,Math.sin(q*1.3)*r*.5,Math.sin(q)*r)})};
slab=(s,w,h)=>{const sd=new THREE.MeshLambertMaterial({color:0x1a1c3a});return mesh(new THREE.BoxGeometry(w,h,.14),[sd,sd,sd,sd,new THREE.MeshBasicMaterial({map:typeof s=='string'?TL(s):s}),sd])};
coin=(s,r,col)=>{const g=new THREE.Group(),b=mesh(new THREE.CylinderGeometry(r,r,.26,64),new THREE.MeshLambertMaterial({color:col}));b.rotation.x=Math.PI/2;
 const f=mesh(new THREE.CircleGeometry(r*.98,64),new THREE.MeshBasicMaterial({map:TL(s),transparent:true}));f.position.z=.14;const k=f.clone();k.position.z=-.14;k.rotation.y=Math.PI;g.add(b,f,k);return g};
const B={
hero:(g,h)=>{const a=mesh(new THREE.IcosahedronGeometry(2.1,1),std(h,1)),b=mesh(new THREE.TorusKnotGeometry(.8,.25,100,14),std(h+.15)),o=orbs(g,7,h,3);g.add(a,b);return t=>{a.rotation.y=t*.0005;a.rotation.x=t*.0003;b.rotation.y=-t*.0009;b.rotation.x=t*.0006;o(t)}},
about:(g,h)=>{const a=mesh(new THREE.TorusKnotGeometry(1.3,.38,160,20),std(h)),w=mesh(new THREE.TorusKnotGeometry(1.7,.05,160,8),std(h+.2,1));g.add(a,w);return t=>{a.rotation.x=t*.0004;a.rotation.y=t*.0006;w.rotation.x=-t*.0003;w.rotation.y=t*.0005}},
skills:(g,h)=>{const c=mesh(new THREE.IcosahedronGeometry(1.2,0),std(h,1)),o=orbs(g,12,h,2.8);g.add(c);return t=>{c.rotation.y=t*.0008;c.rotation.x=t*.0005;o(t)}},
certs:(g)=>{const w=new THREE.Group(),fr=DATA.certs.map((c,j)=>{const m=slab(c.img,3.6,2.55),a=j*Math.PI*2/3;m.position.set(Math.sin(a)*3.6,0,Math.cos(a)*3.6);m.rotation.y=a;w.add(m);return m});g.add(w);return t=>{w.rotation.y=t*.00035;fr.forEach((m,j)=>m.position.y=Math.sin(t*.001+j*2)*.35)}},
projects:(g)=>{const fr=DATA.projects.map((p,j)=>{const m=slab(pjT(p,(.4+j*.15)%1),3.6,2.55);if(DATA.projects.length>3)m.position.set(j%2?2.05:-2.05,1.65-Math.floor(j/2)*3.1-(j%2?.35:0),j*.3);else m.position.set(j==1?.7:-.5,2.9-j*2.9,j*.3);g.add(m);return m});return t=>fr.forEach((m,j)=>{m.rotation.y=.3+Math.sin(t*.0008+j*2)*.2;m.position.z=j*.3+Math.sin(t*.001+j)*.3})},
contact:(g,h)=>{const a=mesh(new THREE.OctahedronGeometry(2),std(h,1)),b=mesh(new THREE.TorusGeometry(1,.3,14,40),std(h+.1)),o=orbs(g,8,h,3);g.add(a,b);return t=>{a.rotation.y=t*.0005;b.rotation.x=t*.0009;b.rotation.y=t*.0004;o(t)}}
};
const KS=['hero','about','skills','contact'];
const A=(o,geo,c,x,y,z,w)=>{const m=mesh(geo,w==1?new THREE.MeshBasicMaterial({color:c}):new THREE.MeshLambertMaterial({color:c,wireframe:w==2}));m.position.set(x||0,y||0,z||0);o.add(m);return m};
const BX=(w,h,d)=>new THREE.BoxGeometry(w,h,d),SP=(r,s)=>new THREE.SphereGeometry(r,s||14,s||14),CY=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||18),TR=(r,q,s,a)=>new THREE.TorusGeometry(r,q,10,s||40,a),GR=()=>{const o=new THREE.Group();return o};
const KIT={
def:{hero:(g,h)=>B.hero(g,h),about:(g,h)=>B.about(g,h),skills:(g,h)=>B.skills(g,h),contact:(g,h)=>B.contact(g,h)},
game:{
hero:g=>{const o=GR();g.add(o);A(o,BX(3.2,.5,1.6),0x2b2f4a);[-1,1].forEach(s=>{const m=A(o,SP(.8),0x2b2f4a,s*1.45,-.1,.25);m.scale.set(1,.6,1.2)});
 A(o,CY(.28,.28,.2),0x0e1020,-.95,.33,-.15);A(o,SP(.2),0xff7a3c,-.95,.45,-.15);A(o,CY(.28,.28,.2),0x0e1020,.55,.33,.4);A(o,SP(.2),0xff7a3c,.55,.45,.4);
 A(o,BX(.7,.14,.22),0xeeeeee,-.55,.32,.4);A(o,BX(.22,.14,.7),0xeeeeee,-.55,.32,.4);
 [[0xff3b3b,1.15,-.15],[0x3bff6a,.9,-.4],[0x3b9bff,.65,-.15],[0xffd23b,.9,.1]].forEach(b=>A(o,SP(.16),b[0],b[1],.34,b[2]));
 o.rotation.x=.55;o.scale.setScalar(1.15);return t=>{o.rotation.y=Math.sin(t*.0008)*.7;o.position.y=Math.sin(t*.0015)*.15}},
about:g=>{const o=GR();g.add(o);A(o,TR(1.5,.14,40,Math.PI),0x3a3f66);[-1,1].forEach(s=>{A(o,CY(.6,.6,.5),0xff4d6d,s*1.5,0,0).rotation.z=Math.PI/2;A(o,CY(.4,.4,.55),0x1a1c3a,s*1.52,0,0).rotation.z=Math.PI/2});
 A(o,CY(.04,.04,1.4,8),0x3a3f66,-1.8,-.7,.3).rotation.z=.5;A(o,SP(.12),0x3bff6a,-2.1,-1.3,.5);o.scale.setScalar(1.2);
 return t=>{o.rotation.y=Math.sin(t*.0008)*.8;o.rotation.z=Math.sin(t*.001)*.1}},
skills:g=>{const o=GR();g.add(o);A(o,BX(4.6,.25,2.2),0x2b2f4a);const ks=[];for(let r=0;r<3;r++)for(let c=0;c<8;c++)ks.push(A(o,BX(.46,.22,.46),new THREE.Color().setHSL((c*.07+r*.12)%1,.8,.55),(c-3.5)*.55,.22,(r-1)*.62));
 o.rotation.x=.7;o.scale.setScalar(1.1);return t=>{o.rotation.y=Math.sin(t*.0007)*.6;ks.forEach((k,i)=>k.position.y=.22+Math.max(0,Math.sin(t*.004-i*.5))*.18)}},
contact:g=>{const o=GR();g.add(o);A(o,BX(2.4,.5,2),0x2b2f4a,0,-.6,0);A(o,CY(.1,.1,1.5,10),0xcccccc,0,.4,0);const b=A(o,SP(.46),0xff3b3b,0,1.3,0);
 [[0x3bff6a,.0],[0xffd23b,1.2]].forEach(q=>A(o,CY(.2,.2,.1),q[0],q[1]-.6,-.3,.7).rotation.x=Math.PI/2);o.scale.setScalar(1.2);
 return t=>{o.rotation.y=Math.sin(t*.0006)*.6;b.position.x=Math.sin(t*.002)*.22}}},
ai:{
hero:g=>{const o=GR();g.add(o);A(o,BX(2.8,.3,2.8),0x10203a);A(o,BX(1.7,.14,1.7),0x2f7bff,0,.2,0);A(o,BX(.9,.16,.9),0x8fd0ff,0,.25,0);
 for(let i=0;i<8;i++)for(const s of[[1,0],[-1,0],[0,1],[0,-1]]){const x=(i-3.5)*.32;A(o,s[0]?BX(.4,.06,.1):BX(.1,.06,.4),0xb8c7ff,s[0]?s[0]*1.55:x,0,s[0]?x:s[1]*1.55)}
 const r=A(o,TR(2.5,.03,60),0x4aa3ff,0,0,0,1);r.rotation.x=Math.PI/2;o.rotation.x=.9;return t=>{o.rotation.y=t*.0006;r.scale.setScalar(1+Math.sin(t*.002)*.06)}},
about:g=>{const o=GR();g.add(o);const ly=[3,4,3,2],P=[];ly.forEach((n,i)=>{P[i]=[];for(let j=0;j<n;j++){const p=[(i-1.5)*1.3,(j-(n-1)/2)*.9,Math.sin(j*2+i)*.4];P[i].push(p);A(o,SP(.16),0x5ab0ff,p[0],p[1],p[2])}});
 const v=[];for(let i=0;i<ly.length-1;i++)P[i].forEach(a=>P[i+1].forEach(b=>v.push(...a,...b)));const gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
 o.add(new THREE.LineSegments(gm,new THREE.LineBasicMaterial({color:0x4a7bff,transparent:true,opacity:.55})));o.scale.setScalar(1.25);
 return t=>{o.rotation.y=Math.sin(t*.0006)*.8;o.rotation.x=Math.sin(t*.0004)*.2}},
skills:g=>{const o=GR();g.add(o);A(o,new THREE.IcosahedronGeometry(1.6,2),0x2f7bff,0,0,0,2);A(o,SP(1.45,20),0x06122e);
 const rs=[0,1,2].map(i=>{const r=A(o,TR(2.1+i*.2,.02,70),[0x4aa3ff,0x8a7cff,0x00e5ff][i],0,0,0,1);r.rotation.set(i*1.0,i*.6,0);return r});
 return t=>{o.rotation.y=t*.0005;rs.forEach((r,i)=>r.rotation.z=t*.0006*(i+1))}},
contact:g=>{const o=GR();g.add(o);const ls=[];for(let i=0;i<4;i++){A(o,BX(2.4,.55,1.2),0x10203a,0,(i-1.5)*.62,0);for(let j=0;j<4;j++)ls.push(A(o,SP(.06),0x3bff9a,-.9+j*.22,(i-1.5)*.62,.62))}
 o.scale.setScalar(1.2);return t=>{o.rotation.y=Math.sin(t*.0007)*.7;ls.forEach((l,i)=>l.material.color.setHex(Math.sin(t*.005+i*1.7)>0?0x3bff9a:0x0a3a22))}}},
cyber:{
hero:g=>{const o=GR();g.add(o);for(let i=0;i<10;i++){const w=.55+(i%3)*.15,h=1+((i*7)%5)*.6,b=A(o,BX(w,h,w),0x14002b,(i%5-2)*.85,h/2-1.2,i<5?-.5:.7);
  const e=new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry),new THREE.LineBasicMaterial({color:i%2?0xff2fa0:0x00e5ff}));e.position.copy(b.position);o.add(e)}
 const r=A(o,TR(1.8,.04,60),0xff2fa0,0,1.8,0,1);r.rotation.x=Math.PI/2;o.scale.setScalar(1.15);return t=>{o.rotation.y=Math.sin(t*.0005)*.6;r.rotation.z=t*.001}},
about:g=>{const o=GR();g.add(o);const rs=[[1.2,0xff2fa0],[1.6,0x00e5ff],[2,0xffe45e]].map(a=>A(o,TR(a[0],.05,60),a[1],0,0,0,1));A(o,new THREE.OctahedronGeometry(.7),0xff2fa0,0,0,0,2);
 return t=>{rs[0].rotation.x=t*.0011;rs[1].rotation.y=t*.0008;rs[2].rotation.x=t*.0005;rs[2].rotation.y=t*.0007}},
skills:g=>{const o=GR();g.add(o);A(o,SP(.6),0x1a0033);A(o,SP(.16),0xff2fa0,0,0,.55,1);const rt=[];
 [[1,1],[-1,1],[1,-1],[-1,-1]].forEach(s=>{A(o,BX(1.1,.06,.1),0x330066,s[0]*.7,0,s[1]*.7).rotation.y=s[0]*s[1]*.8;const r=A(o,TR(.45,.03,24),0x00e5ff,s[0]*1.3,.1,s[1]*1.3,1);r.rotation.x=Math.PI/2;rt.push(r)});
 o.scale.setScalar(1.3);return t=>{o.position.y=Math.sin(t*.002)*.25;o.rotation.y=t*.0004;o.rotation.z=Math.sin(t*.0012)*.15;rt.forEach((r,i)=>r.rotation.z=t*.02*(i%2?1:-1))}},
contact:g=>{const o=GR();g.add(o);A(o,BX(2.6,.4,1.1),0x1a0033);A(o,BX(1.2,.35,.9),0x330066,-.1,.35,0);A(o,BX(2.7,.05,1.15),0x00e5ff,0,-.25,0,1);A(o,BX(.1,.12,.8),0xff2fa0,-1.3,.05,0,1);A(o,SP(.12),0xffe45e,1.3,0,.3,1);A(o,SP(.12),0xffe45e,1.3,0,-.3,1);o.scale.setScalar(1.2);
 return t=>{o.rotation.y=.5+Math.sin(t*.0007)*.4;o.position.y=Math.sin(t*.002)*.2;o.rotation.z=Math.sin(t*.0015)*.06}}},
simple:{
hero:g=>{const o=GR();g.add(o);const bg=new THREE.IcosahedronGeometry(1.8,4),pa=bg.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i),k=1+.18*Math.sin(x*1.7)*Math.cos(y*1.9+z);pa.setXYZ(i,x*k,y*k,z*k)}bg.computeVertexNormals();A(o,bg,0xa6b4ff);
 const ps=[0xffb3e1,0xa6f0e0,0xffe0a6,0xc9b3ff].map((c,i)=>A(o,SP(.2+.04*i),c));return t=>{o.rotation.y=t*.0004;o.rotation.x=t*.0003;ps.forEach((p,i)=>{const q=t*.001+i*1.6;p.position.set(Math.cos(q)*2.6,Math.sin(q*1.2)*1.2,Math.sin(q)*2.6)})}},
about:g=>{const o=GR();g.add(o);const ts=[0xffb3e1,0xa6b4ff,0xa6f0e0].map((c,i)=>A(o,TR(1.3-i*.25,.35,40),c,0,(i-1)*.7,0));return t=>ts.forEach((m,i)=>{m.rotation.x=1.2+Math.sin(t*.001+i)*.3;m.rotation.y=Math.sin(t*.0008+i)*.4})},
skills:g=>{const o=GR();g.add(o);const bs=[0xffb3e1,0xa6b4ff,0xa6f0e0,0xffe0a6,0xc9b3ff,0xffc2c2,0xb3e5ff].map((c,i)=>A(o,SP(.5+(i%3)*.25,24),c,Math.cos(i*2.4)*1.6,Math.sin(i*1.7)*1.3,Math.sin(i*2.4)*1.2));return t=>{o.rotation.y=t*.0004;bs.forEach((b,i)=>b.scale.setScalar(1+Math.sin(t*.002+i)*.08))}},
contact:g=>{const o=GR();g.add(o);A(o,new THREE.TorusKnotGeometry(1.1,.38,120,16),0xffb3e1);return t=>{o.rotation.x=t*.0004;o.rotation.y=t*.0006}}}
};
ST.forEach((s,i)=>{const g=new THREE.Group();g.position.z=-i*D-6;s.g=g;g.userData={bs:1,by:0};
 if(typeof s.build=='string'){if(KS.includes(s.build)){s.slot=s.build;s.tick=()=>{}}else s.tick=B[s.build](g,s.hue)}
 else{const c=s.build,h=s.hue,m=c.shape=='slab'?slab(c.logo,4.4,4.4/IMG.elkR):coin(c.logo,1.7,H(h));
  const r1=mesh(new THREE.TorusGeometry(2.8,.04,12,100),new THREE.MeshBasicMaterial({color:H(h)})),r2=r1.clone();r2.rotation.x=1.2;
  const gl=mesh(new THREE.CircleGeometry(3.6,48),new THREE.MeshBasicMaterial({color:H(h),transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false}));gl.position.z=-.8;
  g.add(m,r1,r2,gl);const o=orbs(g,6,h,3.3);
  s.tick=t=>{m.rotation.y=Math.sin(t*.0009)*.8;m.rotation.x=Math.sin(t*.0007)*.15;r1.rotation.y=t*.0007;r1.rotation.z=t*.0003;r2.rotation.y=-t*.0005;r2.rotation.z=t*.0006;gl.scale.setScalar(1+Math.sin(t*.002)*.08);o(t)}}
 scene.add(g)});
for(let i=0;i<N;i++){const r=mesh(new THREE.TorusGeometry(11+i%3,.03,8,120),new THREE.MeshBasicMaterial({color:H(ST[i].hue),transparent:true,opacity:.55}));r.position.z=-i*D;scene.add(r);rings.push(r)}
const FS={def:()=>[new THREE.TetrahedronGeometry(.5),new THREE.OctahedronGeometry(.5),new THREE.IcosahedronGeometry(.45,0),BX(.6,.6,.6)],game:()=>[BX(.6,.6,.6),CY(.4,.4,.1,16),BX(.35,.35,.35)],ai:()=>[new THREE.TetrahedronGeometry(.5),new THREE.OctahedronGeometry(.5),BX(.3,.3,.3)],cyber:()=>[BX(.25,1.6,.25),new THREE.ConeGeometry(.4,.7,3),BX(.9,.5,.08)],simple:()=>[SP(.4,16),TR(.4,.12,24),SP(.25,16)]};
const FC={def:i=>H(ST[i%N].hue+Math.random()*.1),game:i=>[0xffd23b,0xff3b3b,0x3bff6a,0x3b9bff][i%4],ai:i=>[0x4aa3ff,0x8a7cff,0x00e5ff][i%3],cyber:i=>[0xff2fa0,0x00e5ff,0xffe45e][i%3],simple:i=>[0xffb3e1,0xa6b4ff,0xa6f0e0,0xffe0a6][i%4]};
mkFl=n=>{fl.forEach(m=>{scene.remove(m);m.material.dispose()});fl.length=0;const gs=FS[n]();for(let i=0;i<28;i++){const m=mesh(gs[i%gs.length],new THREE.MeshLambertMaterial({color:FC[n](i),wireframe:n=='ai'||n=='cyber'||(n=='def'&&i%2==0)}));
 m.position.set((Math.random()<.5?-1:1)*(6+Math.random()*12),(Math.random()-.5)*16,-Math.random()*N*D);m.userData.s=.4+Math.random();if(lowq)m.visible=i%2==0;scene.add(m);fl.push(m)}};
buildTheme=n=>{ST.forEach(s=>{if(!s.slot)return;const g=s.g;while(g.children.length){const c=g.children[0];g.remove(c);c.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()})}s.tick=((KIT[n]||KIT.def)[s.slot](g,s.hue))||(()=>{})});mkFl(n)};
const n=1000,ps=new Float32Array(n*3);for(let i=0;i<n;i++){ps[i*3]=(Math.random()-.5)*60;ps[i*3+1]=(Math.random()-.5)*40;ps[i*3+2]=-Math.random()*(N*D+20)}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(ps,3));
pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.09,transparent:true,opacity:.85}));scene.add(pts);
{const k=10,a=new Float32Array(k*k*k*3);let q=0;for(let x=0;x<k;x++)for(let y=0;y<k;y++)for(let z=0;z<k;z++){a[q++]=(x-4.5)*1.1;a[q++]=(y-4.5)*1.1;a[q++]=(z-4.5)*1.1}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));cube=new THREE.Points(g,new THREE.PointsMaterial({size:.16,color:0x8a7cff,transparent:true,opacity:.85}));cube.position.set(0,0,-26);cube.visible=false;cam.add(cube)}
R=1;
}catch(e){console.error(e);R=0;document.getElementById('c').style.display='none'}
function layout(){if(!R)return;const a=innerWidth/innerHeight,m=a<.9,s=m?.5:a<1.4?.75:1;ST.forEach(o=>{const g=o.g;g.userData.bs=s;g.userData.by=m?3.2:0;g.position.x=m?0:o.side*(a<1.4?3.6:4.4)})}
layout();
/* ===== Background themes ===== */
const TH={def:null,game:{h:.09,L:.72},ai:{h:.6,L:.75},cyber:{h:.88,L:.7},simple:{h:.62,L:.4}};
let th=null,cur='def';
var AU=null;
function vidPlay(v){if(!v.getAttribute('src'))v.src=v.dataset.src;v.currentTime=0;const q=v.play();if(q)q.catch(()=>{})}
function vidNext(v){const vs=[...v.parentNode.querySelectorAll('.bgv')],nx=vs[(vs.indexOf(v)+1)%vs.length];if(nx===v)return;v.classList.remove('on');vidPlay(nx)}
function vidSet(n){document.querySelectorAll('.bgv').forEach(v=>{if(!v._l){v._l=1;v.muted=true;v.addEventListener('playing',()=>{v.classList.add('on');v.parentNode.classList.add('vok')});v.addEventListener('ended',()=>vidNext(v))}v.pause();v.classList.remove('on')});
 const lay=document.querySelector('.l-'+n),vs=lay?[...lay.querySelectorAll('.bgv')]:[];if(vs.length)vidPlay(vs[0])}
function setBg(n){cur=n;th=TH[n];document.body.dataset.bg=n;
 if(th)document.documentElement.style.setProperty('--h',th.h*360);
 L=th?th.L:(dk?.7:.42);
 if(R){cube.visible=n=='ai';pts.material.opacity=n=='game'?.5:.85;buildTheme(n)}
 vidSet(n);if(AU&&AU.on)auStart();
 try{localStorage.setItem('bg',n)}catch(e){}
 document.querySelectorAll('#swm button').forEach(b=>b.classList.toggle('on',b.dataset.b==n))}
(function(){const g=document.getElementById('gm'),cols=['#f7a92b','#ee8a22','#d46a1d','#a8461a','#5e2012'];let sd=11;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;let h='';
cols.forEach((c,i)=>{const b=46+i*9,am=15-i*1.5,ph=[rnd()*6,rnd()*6,rnd()*6],ry=x=>b-am*(Math.sin(x*.03+ph[0])+.5*Math.sin(x*.07+ph[1])+.25*Math.sin(x*.16+ph[2]));let d='M0,100 L0,'+ry(0).toFixed(1);for(let x=4;x<=200;x+=4)d+=' L'+x+','+ry(x).toFixed(1);d+=' L200,100Z';let tr='';
 if(i>=2)for(let x=2;x<200;x+=i>=4?3.2:5){const y=ry(x)+3,hh=(i>=4?13:8)+rnd()*6;tr+='<path d="M'+(x-2.2)+','+y.toFixed(1)+' L'+x+','+(y-hh).toFixed(1)+' L'+(x+2.2)+','+y.toFixed(1)+'Z"/>'}
 h+='<svg class="gl" viewBox="0 0 200 100" preserveAspectRatio="none"><path d="'+d+'" fill="'+c+'"/><g fill="'+c+'">'+tr+'</g></svg>'});
g.insertAdjacentHTML('beforeend',h);
for(let k=0;k<12;k++){const e=document.createElement('i');e.className='em';e.style.cssText='left:'+Math.random()*100+'%;animation-delay:-'+Math.random()*8+'s;animation-duration:'+(5+Math.random()*5)+'s';g.appendChild(e)}})();
const swb=document.getElementById('swb'),swm=document.getElementById('swm');
swb.onclick=()=>swm.classList.toggle('open');
swm.onclick=e=>{const b=e.target.closest('button');if(!b)return;setBg(b.dataset.b);swm.classList.remove('open')};
let sv='def';try{sv=localStorage.getItem('bg')||'def'}catch(e){}
setBg(TH[sv]!==undefined?sv:'def');
let p=0,tp=0,mx=0,my=0;
const barEl=document.getElementById('bar');
function onS(){const h=MAXY;tp=h>0?scrollY/h:0;barEl.style.transform='scaleX('+tp+')'}
W('scroll',onS);onS();
W('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
let rzT=0;W('resize',()=>{layout();if(R){clearTimeout(rzT);rzT=setTimeout(()=>{if(dead)return;cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();rd.setSize(innerWidth,innerHeight)},90)}});
/* ===== Auto tour: starts after a pause, speed is matched to the background video loop ===== */
AU={on:false,t0:0,y0:0,y1:0,dur:1,timer:0,cy:0};
const aub=document.getElementById('aub');
function acfg(){return DATA.auto||{delay:5,target:70}}
function tourSecs(frac){const T=acfg().target*frac,lay=document.querySelector('.l-'+cur),vs=lay?[...lay.querySelectorAll('.bgv')]:[];
 if(!vs.length||!vs[0].dataset.dur)return Math.max(8,T);
 const ds=vs.map(v=>+v.dataset.dur),cyc=ds.reduce((a,b)=>a+b,0);let i=vs.findIndex(v=>!v.paused&&v.classList.contains('on'));if(i<0)i=0;
 let pos=0;for(let k=0;k<i;k++)pos+=ds[k];pos+=vs[i].currentTime||0;const r=cyc-(pos%cyc);
 return r+Math.max(0,Math.round((T-r)/cyc))*cyc}
var LD=false;
function atEnd(){return scrollY>=MAXY-2}
function auLabel(){const s=AU.on?'⏸ Pause tour':(atEnd()?'↻ Restart tour':'▶ Continue tour');if(aub._t!==s){aub._t=s;aub.textContent=s}}
function auStop(){AU.on=false;clearTimeout(AU.timer);auLabel()}
function auStart(){clearTimeout(AU.timer);const m=MAXY,y=scrollY;if(y>=m-2){auStop();return}
 AU.y0=y;AU.y1=m;AU.dur=tourSecs((m-y)/m)*1000;AU.t0=performance.now();AU.last=y;AU.cy=y;AU.on=true;auLabel()}
function auStep(now){if(!AU.on)return;if(Math.abs(scrollY-AU.last)>4){auStop();return}const k=Math.min(1,(now-AU.t0)/AU.dur),y=AU.y0+(AU.y1-AU.y0)*k;scrollTo({top:y,behavior:'instant'});AU.last=y;AU.cy=y;if(k>=1)auStop()}
function runLoader(cb){const pn=document.getElementById('pn'),pre=document.getElementById('pre');LD=true;pre.style.animation='none';void pre.offsetWidth;const D=acfg().delay*1000,t0=performance.now();
 (function tk(){if(dead)return;const k=Math.min(1,(performance.now()-t0)/D),v=Math.round(k*100);pn.textContent=('00'+v).slice(-3);pre.style.setProperty('--pw',k);if(k<1)requestAnimationFrame(tk);else{LD=false;pre.style.animation='preout .5s forwards';cb()}})()}
function auGo(){if(!AU.cancel)auStart()}
function restart(){AU.cancel=false;auStop();runLoader(auGo);scrollTo({top:0,behavior:'instant'})}
const stopIt=()=>{clearTimeout(AU.timer);if(AU.on)auStop();if(LD)AU.cancel=true};
['wheel','touchstart','keydown'].forEach(e=>W(e,stopIt,{passive:true}));
W('pointerdown',e=>{if(!e.target.closest('#aub'))stopIt()});
W('scroll',()=>{if(!AU.on)auLabel()},{passive:true});
aub.onclick=()=>{if(AU.on)auStop();else if(atEnd())restart();else auStart()};
auLabel();
let lt=0,slow=0,lh=-1,sy=0,lsy=-1,TP=[],SC=[],vh=innerHeight,fs=0,hk=-1,sm=scrollY,ema=.0167,acc=0,good=0,lastUp=0,pr=Math.min(devicePixelRatio,1.5),prMax=pr;
/* adaptive resolution: drops render scale a notch if frames run long, restores it when there is headroom */
function adapt(t){if(!R)return;const ap=()=>{rd.setPixelRatio(pr);rd.setSize(innerWidth,innerHeight);ema=.0167};
 if(ema>.021&&pr>.75){pr=Math.max(.75,pr-.25);good=0;if(t-lastUp<10000)prMax=pr;if(pr<1&&!lowq){lowq=1;fl.forEach((m,k)=>m.visible=k%2==0)}ap()}
 else if(ema<.0135&&pr<prMax){if(++good>=3){good=0;pr=Math.min(prMax,pr+.25);lastUp=t;ap()}}else good=0}
const hn=document.getElementById('hn'),ht=document.getElementById('ht'),NM=['Intro','About',...DATA.companies.map(c=>c.name),'Skills','Certificates','Projects','Contact'];
function meas(){vh=innerHeight;MAXY=Math.max(0,document.documentElement.scrollHeight-innerHeight);TP=ST.map(s=>[s.s.offsetTop,s.s.offsetHeight]);SC=TP.map(q=>q[0]+q[1]/2-vh/2);lsy=-1}
function fOf(y){if(y<=SC[0])return 0;for(let k=0;k<N-1;k++)if(y<SC[k+1])return k+(y-SC[k])/(SC[k+1]-SC[k]);return N-1}
meas();W('resize',meas);W('load',meas);
try{if(document.fonts)document.fonts.ready.then(()=>{if(!dead)meas()})}catch(err){}
if(window.ResizeObserver){ro=new ResizeObserver(()=>{if(!dead)meas()});ro.observe(M)}
const defEl=document.querySelector('.l-def'),gls=[...document.querySelectorAll('.gl')];
{const mq=document.querySelector('#mq span'),tx=(DATA.roles.join(' ✦ ')+' ✦ SCROLL TO EXPLORE ✦ ').repeat(4);mq.textContent=tx+tx}
runLoader(auGo);
function frame(t){
 if(dead)return;
 const dt=Math.min(.05,(t-lt)/1000||.016);lt=t;
 ema+=(dt-ema)*.05;acc+=dt;const ka=1-Math.exp(-dt*3.08);if(acc>1.2){acc=0;adapt(t)}
 
 auStep(t);{const raw=AU.on?AU.cy:scrollY;sm+=(raw-sm)*(1-Math.exp(-dt*14));if(Math.abs(raw-sm)<.05)sm=raw;sy=sm}const ft=fOf(sy),vel=ft-fs;fs+=vel*(1-Math.exp(-dt*7));
 const f=fs,i=Math.min(N-2,Math.floor(f)),u=f-i,h0=ST[i].hue,dh=((ST[i+1].hue-h0+1.5)%1)-.5,hue=th?th.h:((h0+dh*u)%1+1)%1;
 if(!th){const q=Math.round(hue*120);if(q!==lh){lh=q;document.documentElement.style.setProperty('--h',q*3);defEl.style.filter='hue-rotate('+(q*3-220)+'deg)'}}
 const k=Math.round(f);if(k!==hk){hk=k;hn.textContent=('0'+(k+1)).slice(-2);ht.textContent=NM[k];dots.forEach((d,j)=>d.classList.toggle('on',j==k))}
 if(R){cam.position.z=-f*D+4;cam.position.x+=((mx*2.5+Math.sin(f*.8)*1.4)-cam.position.x)*ka;cam.position.y+=(-my*1.5-cam.position.y)*ka;cam.rotation.z=Math.sin(f*1.1)*.05;
  const fv=Math.round((60+Math.min(16,Math.abs(vel)*90))*2)/2;if(fv!==cam.fov){cam.fov=fv;cam.updateProjectionMatrix()}
  pl.color.setHSL(hue,.9,.65);pts.material.color.setHSL(hue,.8,L);
  ST.forEach((s,j)=>{const g=s.g,e=Math.max(0,1-Math.abs(f-j)*.9);g.scale.setScalar(g.userData.bs*(.55+.45*e));g.position.y=g.userData.by-(1-e)*2+Math.sin(t*.001+j)*.25;s.tick(t+f*600)});
  rings.forEach((r,j)=>r.rotation.z=t*.00012*(j%2?1:-1));
  fl.forEach(m=>{m.rotation.x=t*.0006*m.userData.s;m.rotation.y=t*.0008*m.userData.s});
  if(cube.visible){cube.rotation.y=t*.0002;cube.rotation.x=t*.00013}
  rd.render(scene,cam)}
 if(cur=='game')gls.forEach((s,j)=>s.style.transform='translate3d('+(-mx*(8+j*14)).toFixed(1)+'px,'+(tp*(10+j*34)).toFixed(1)+'px,0)');
 if(Math.abs(vel)>1e-4||sy!==lsy){lsy=sy;
 ST.forEach((s,j)=>{const d=(SC[j]-sy)/vh,a=Math.abs(d),o=Math.max(0,Math.min(1,1-(a-.3)*2.6)),b=s.bx.style;
  if(a<.5&&!s.sh){s.sh=1;s.bx.classList.add('in')}else if(a>.85&&s.sh){s.sh=0;s.bx.classList.remove('in')}
  if(o<.002){if(!s.hid){b.visibility='hidden';s.hid=1}return}
  if(s.hid){b.visibility='';s.hid=0}
  const pe=o>.3?'auto':'none';b.opacity=o.toFixed(3);b.transform='translate3d(0,'+(d*70).toFixed(2)+'px,0)';if(s.pe!==pe){s.pe=pe;b.pointerEvents=pe}})}
 (dead||(RAF=requestAnimationFrame(frame)))}
(dead||(RAF=requestAnimationFrame(frame)));

return ()=>{
 dead=true;cancelAnimationFrame(RAF);if(ro)ro.disconnect();clearTimeout(rzT);offs.forEach(f=>f());ivs.forEach(clearInterval);clearTimeout(AU.timer);
 document.querySelectorAll('.bgv').forEach(v=>{try{v.pause()}catch(e){}});
 const gm=document.getElementById('gm');if(gm)gm.querySelectorAll('.gl,.em').forEach(n=>n.remove());
 try{if(R){rd.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.dispose)o.material.dispose()})}}catch(e){}
 ['aub','swb','swm'].forEach(id=>{const e=document.getElementById(id);if(e)e.onclick=null});
 document.documentElement.classList.remove('js');
};
}
