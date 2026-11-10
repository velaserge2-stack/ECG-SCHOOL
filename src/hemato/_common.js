var $=function(id){return document.getElementById(id)};
var css=function(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()};
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function fmt(x,d){var v=Math.abs(x)<Math.pow(10,-(d||0))/2?0:x;return v.toFixed(d).replace('.',',').replace(/^-0(,0*)?$/,'0$1')}
function sgn(x,d){return (x>0?'+':'')+fmt(x,d)}
function chip(l,v,cls,txt){return '<span class="chip '+(cls||'ok')+'">'+l+' <b>'+v+'</b>'+(txt?' <em>'+txt+'</em>':'')+'</span>'}
function fit(c,w,h){var r=window.devicePixelRatio||1;c.width=Math.round(w*r);c.height=Math.round(h*r);c.style.width=w+'px';c.style.height=h+'px';var x=c.getContext('2d');x.setTransform(r,0,0,r,0,0);return x}
function cw(c,mx){var p=c.parentElement,s=getComputedStyle(p);return Math.max(240,Math.min(mx||940,Math.floor(p.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight))))}
function axes(x,r,xr,yr,xt,yt,xl,yl,fy){x.font='10px '+css('--font-mono');x.strokeStyle=css('--line');x.fillStyle=css('--muted');x.lineWidth=1;x.textAlign='right';x.textBaseline='middle';
  yt.forEach(function(v){var y=r.y+r.h-(v-yr[0])/(yr[1]-yr[0])*r.h;x.beginPath();x.moveTo(r.x,y);x.lineTo(r.x+r.w,y);x.stroke();x.fillText(fy?fy(v):v,r.x-4,y)});
  x.textAlign='center';x.textBaseline='top';xt.forEach(function(v){var xx=r.x+(v-xr[0])/(xr[1]-xr[0])*r.w;x.beginPath();x.moveTo(xx,r.y+r.h);x.lineTo(xx,r.y+r.h+3);x.stroke();x.fillText(v,xx,r.y+r.h+5)});
  if(xl){x.textAlign='right';x.fillText(xl,r.x+r.w,r.y+r.h+18)}
  if(yl){x.save();x.translate(10,r.y+r.h/2);x.rotate(-Math.PI/2);x.textAlign='center';x.textBaseline='middle';x.fillText(yl,0,0);x.restore()}}
function line(x,r,xr,yr,f,col,lw,dash,n){x.strokeStyle=col;x.lineWidth=lw||2;x.setLineDash(dash||[]);x.lineJoin='round';x.beginPath();n=n||200;
  for(var i=0;i<=n;i++){var t=xr[0]+(xr[1]-xr[0])*i/n,v=f(t),px=r.x+i/n*r.w,py=r.y+r.h-(clamp(v,yr[0],yr[1])-yr[0])/(yr[1]-yr[0])*r.h;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.setLineDash([])}
function dot(x,r,xr,yr,vx,vy,col,rad){x.fillStyle=col;x.beginPath();x.arc(r.x+(vx-xr[0])/(xr[1]-xr[0])*r.w,r.y+r.h-(clamp(vy,yr[0],yr[1])-yr[0])/(yr[1]-yr[0])*r.h,rad||5,0,7);x.fill()}
/* Orden estable y barajado de opciones (la correcta no siempre va primero) */
function perm(n,seed){var a=[],i,j,t,s=seed*9301+49297;for(i=0;i<n;i++)a.push(i);for(i=n-1;i>0;i--){s=(s*9301+49297)%233280;j=Math.floor(s/233280*(i+1));t=a[i];a[i]=a[j];a[j]=t}return a}
/* Reto «Predice y observa» con confianza; cada reto aplica su cambio al modelo */
function Quiz(QS){var qi=0,tot=0,okc=0;
  function show(){var q=QS[qi];$('qText').innerHTML='<b>Reto '+(qi+1)+' de '+QS.length+'.</b> '+q.q;
    $('qOpts').innerHTML=perm(q.o.length,qi*7+q.q.length).map(function(k){return '<label class="opt"><input type="radio" name="qo" value="'+k+'"> <span>'+q.o[k]+'</span></label>'}).join('');$('qFb').textContent=''}
  $('qGo').onclick=function(){var r=document.querySelector('input[name=qo]:checked');if(!r){$('qFb').textContent='Elige primero una respuesta.';return}
    var q=QS[qi],ok=+r.value===q.a,cf=$('qConf').value;q.ap();tot++;if(ok)okc++;
    var cal=ok?(cf==='alta'?' Buena calibración.':cf==='baja'?' Acertaste con poca confianza: confía más en la cadena causal.':''):(cf==='alta'?' Estabas muy seguro: revisa en qué eslabón falló el razonamiento.':'');
    $('qFb').innerHTML=(ok?'<span class="ok"><b>Correcto.</b></span> ':'<span class="no"><b>No era esa.</b></span> La respuesta es: '+q.o[q.a]+'. ')+q.e()+cal+' <span class="note">Aciertos: '+okc+' de '+tot+'. El modelo de arriba ya aplicó el cambio.</span>'};
  $('qNext').onclick=function(){qi=(qi+1)%QS.length;show()};show()}
function onRedraw(fn){var t;window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fn,80)});
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',fn);
  new MutationObserver(fn).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fn)}
/* Caso clínico guiado: pasos con opciones; cada paso revela el razonamiento y abre el siguiente */
function Case(root,steps){var el=$(root),i=0,ok=0;
  function draw(){var h='';steps.forEach(function(s,k){if(k>i)return;var done=s.done;
    h+='<div class="cstep'+(done?' done':'')+'"><p><b>Paso '+(k+1)+'.</b> '+s.q+'</p><div class="chips">'+perm(s.o.length,k*5+s.q.length).map(function(j){var t=s.o[j],cls=done?(j===s.a?' right':(j===s.pick?' wrong':'')):'';return '<button class="btn cbtn'+cls+'" data-k="'+k+'" data-j="'+j+'"'+(done?' disabled':'')+'>'+t+'</button>'}).join('')+'</div>'+
    (done?'<p class="why">'+(s.pick===s.a?'<span class="ok"><b>Bien.</b></span> ':'<span class="no"><b>Revisa.</b></span> ')+s.e+'</p>':'')+'</div>'});
    if(i>=steps.length)h+='<p class="note">Caso resuelto: '+ok+' de '+steps.length+' pasos al primer intento. <button class="btn" data-reset="1">Volver a empezar</button></p>';
    el.innerHTML=h;el.querySelectorAll('.cbtn').forEach(function(b){b.onclick=function(){var s=steps[+b.dataset.k];if(s.done)return;s.pick=+b.dataset.j;s.done=true;if(s.pick===s.a)ok++;i++;draw()}});
    var r=el.querySelector('[data-reset]');if(r)r.onclick=function(){steps.forEach(function(s){s.done=false;s.pick=null});i=0;ok=0;draw()}}
  draw()}
/* Mini-repaso: 5 tarjetas del módulo (las mismas existen en el Banco Hemato) */
function MiniFC(root,cards){var el=$(root);el.innerHTML=cards.map(function(c,k){return '<button class="mfc" aria-expanded="false" data-k="'+k+'"><span class="mfq">'+c[0]+'</span><span class="mfa" hidden>'+c[1]+'</span><span class="note">Toca para ver la respuesta</span></button>'}).join('');
  el.querySelectorAll('.mfc').forEach(function(b){b.onclick=function(){var a=b.querySelector('.mfa'),open=a.hidden;a.hidden=!open;b.setAttribute('aria-expanded',open);b.querySelector('.note').textContent=open?'Toca para ocultar':'Toca para ver la respuesta'}})}
