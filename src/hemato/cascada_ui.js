/* ───────── CASO CASCADA · dificultad extrema ─────────
   Un paciente, preguntas en orden. Cada respuesta desbloquea datos nuevos y la historia clínica
   se acumula. El progreso se guarda en IndexedDB (sesión SID('cascada')). */
const CXQ=[];(typeof CASCADA!=='undefined'?CASCADA.actos:[]).forEach((a,ai)=>a.preguntas.forEach(p=>CXQ.push(Object.assign({acto:ai,k:CXQ.length},p))));
const CXG=[[/Electrocardiograma/,'Electrocardiograma'],[/Potencial|Electrolitos/,'Potencial de acción y electrolitos'],[/Conducción|Pulso venoso/,'Conducción y ritmo'],
 [/isquemia|lesión|coronaria/i,'Isquemia y flujo coronario'],[/Hemostasia|Fármacos|Plaqueta/,'Hemostasia y fármacos'],[/Bilirrubina|Ictericia/,'Bilirrubina'],
 [/Inmunidad|ABO|Rh|Pruebas/,'Inmunidad y transfusión'],[/Hierro|EPO \/ médula/,'Hierro, inflamación y médula'],[/Eritrocito|Biometría/,'Eritrocito, EPO y biometría'],
 [/Hemoglobina|curva|pH|O₂/,'Hemoglobina, curva de O₂ y pH'],[/Hemodinamia|Gasto|Microcirculación|Control/,'Hemodinamia y control'],[/Integración/,'Integración']];
function cxGrp(s){for(const [r,n] of CXG)if(r.test(s))return n;return s}
const CX={i:0,ans:{},started:false,view:-1,done:false};
function cxOrder(k){return shuffle(CXQ[k].o.map((_,i)=>i),rng(k*104729+77))}
function cxSave(){saveSession('cascada',{i:CX.i,ans:CX.ans,started:CX.started,done:CX.done})}
async function cxRestore(){try{const s=await ECGDB.get('sessions',SID('cascada'));if(s){CX.i=Math.min(s.i||0,CXQ.length-1);CX.ans=s.ans||{};CX.started=!!s.started;CX.done=!!s.done}}catch(e){}}
function cxScore(){let ok=0,n=0;for(const k in CX.ans){n++;if(CX.ans[k]===0)ok++}return{ok,n}}
function cxHist(upto){let h='';CASCADA.actos.forEach((a,ai)=>{if(ai>upto)return;
  h+=`<div class="cxact"><b>${esc(a.titulo)}</b><p>${esc(a.relato)}</p><ul>${a.datos.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>`});return h}
function cxRender(){
  const root=$('cx-root');if(!root||!CXQ.length)return;
  const sc=cxScore();
  $('cx-score').textContent=sc.n?`Aciertos ${sc.ok} de ${sc.n} respondidas · ${CXQ.length} preguntas`:`${CXQ.length} preguntas · ${CASCADA.actos.length} actos`;
  $('cx-meter').style.width=(100*sc.n/CXQ.length)+'%';
  if(!CX.started){
    root.innerHTML=`<div class="card"><div class="verdict" style="font-size:22px">${esc(CASCADA.titulo)}</div>
      <p style="margin:0"><b>Paciente:</b> ${esc(CASCADA.paciente)}</p><p style="margin:0;color:var(--muted)">${esc(CASCADA.instrucciones)}</p>
      <p class="hint" style="margin:0">Sistemas que vas a conectar: ${[...new Set(CXQ.map(q=>cxGrp(q.s)))].map(esc).join(' · ')}.</p>
      <div class="bar"><button class="primary" id="cx-go">${sc.n?'Continuar el caso':'Empezar el caso'}</button></div></div>`;
    $('cx-go').onclick=()=>{CX.started=true;cxSave();cxRender()};return}
  if(CX.done&&CX.view<0){cxSummary();return}
  const k=CX.view>=0?CX.view:CX.i,q=CXQ[k],a=CASCADA.actos[q.acto],ans=CX.ans[k],answered=ans!=null,order=cxOrder(k);
  const maxAct=CXQ[Math.max(CX.i,k)].acto;
  let h=`<details class="cxhist" ${q.acto>0?'open':''}><summary>Historia clínica acumulada (hasta el ${esc(CASCADA.actos[maxAct].titulo.split(' · ')[0].toLowerCase())})</summary>${cxHist(maxAct)}</details>`;
  const newAct=k===0||CXQ[k-1].acto!==q.acto;
  if(newAct)h+=`<div class="cxnew"><div class="eyebrow">${esc(a.titulo)}</div><p style="margin:0">${esc(a.relato)}</p><ul>${a.datos.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>`;
  h+=`<div class="card"><div class="qmeta"><span class="pill xt">Extrema</span><span class="pill">${esc(q.s)}</span><span>${esc(a.titulo.split(' · ')[0])} · pregunta ${k+1} de ${CXQ.length}</span></div>
    <p class="stem">${esc(q.q)}</p><ul class="opts">`;
  order.forEach((oi,j)=>{let cls='';if(answered){if(oi===0)cls='right';else if(oi===ans)cls='wrong'}
    h+=`<li><button class="opt ${cls}" data-oi="${oi}" ${answered?'disabled':''}><b>${L[j]})</b><span>${esc(q.o[oi])}</span></button></li>`});
  h+='</ul>';
  if(answered){const ok=ans===0;h+=`<div class="teach ${ok?'ok':'bad'}" role="status"><div class="verdict">${ok?'Correcto':'Incorrecto · la respuesta es '+L[order.indexOf(0)]+')'}</div>
    <h4>Mecanismo</h4><p>${esc(q.e)}</p><h4>Conexión con la cascada</h4><p>${esc(q.c)}</p></div>`}
  h+=`</div><div class="nav"><button id="cx-prev" ${k===0?'disabled':''}>← Anterior</button>`+
    (CX.view>=0?`<button id="cx-back" class="primary">Volver a la pregunta actual →</button>`:
     (answered?(k<CXQ.length-1?`<button id="cx-next" class="primary">Siguiente eslabón →</button>`:`<button id="cx-end" class="primary">Ver mi mapa de la cascada →</button>`):'<span class="hint">Responde para desbloquear el siguiente dato.</span>'))+'</div>';
  root.innerHTML=h;
  root.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(CX.ans[k]!=null)return;CX.ans[k]=+b.dataset.oi;cxSave();cxRender();
    const t=root.querySelector('.teach');if(t&&t.getBoundingClientRect().bottom>innerHeight)t.scrollIntoView({block:'nearest',behavior:'smooth'})});
  const pv=$('cx-prev');if(pv)pv.onclick=()=>{CX.view=k-1;cxRender();root.scrollIntoView({block:'start'})};
  const bk=$('cx-back');if(bk)bk.onclick=()=>{CX.view=-1;cxRender()};
  const nx=$('cx-next');if(nx)nx.onclick=()=>{CX.i=k+1;CX.view=-1;cxSave();cxRender();root.scrollIntoView({block:'start'})};
  const en=$('cx-end');if(en)en.onclick=()=>{CX.done=true;CX.view=-1;cxSave();cxFinish();cxRender();root.scrollIntoView({block:'start'})};
}
function cxFinish(){const sc=cxScore(),ts=Date.now();
  DB.run(ECGDB.put('results',{id:SID('cascada-')+ts,source:'cascada',ts,total:CXQ.length,ok:sc.ok,ms:0,ans:Object.assign({},CX.ans)}))}
function cxSummary(){const sc=cxScore(),bySys={};
  CXQ.forEach(q=>{const s=cxGrp(q.s);bySys[s]=bySys[s]||[0,0];bySys[s][1]++;if(CX.ans[q.k]===0)bySys[s][0]++});
  const pct=Math.round(100*sc.ok/CXQ.length);
  let h=`<div class="card"><div class="result-head"><div class="big">${pct}%</div><div>${sc.ok} de ${CXQ.length} eslabones conectados correctamente</div></div>
    <p style="margin:0">${pct>=85?'Razonamiento en cascada sólido: conectaste mecanismos de varios sistemas sin perder el hilo.':pct>=60?'Buen hilo general; revisa los eslabones fallados: suelen ser los puntos donde un sistema «empuja» a otro.':'La cadena se rompió en varios puntos. Repasa los eslabones en rojo en orden: cada uno depende del anterior.'}</p>
    <div style="overflow-x:auto"><table class="mini"><thead><tr><th>Sistema</th><th style="text-align:right">Aciertos</th></tr></thead><tbody>${Object.entries(bySys).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).map(([s,v])=>`<tr><td>${esc(s)}</td><td class="n">${v[0]}/${v[1]}</td></tr>`).join('')}</tbody></table></div>
    <h4 style="margin:0">Tu mapa de la cascada</h4><ol class="cxmap">`;
  CXQ.forEach(q=>{const ok=CX.ans[q.k]===0;h+=`<li class="${ok?'ok':'bad'}"><button data-k="${q.k}"><span class="mk ${ok?'ok':'bad'}">${ok?'✓':'✗'}</span> <b>${esc(q.s)}</b> · ${esc(q.q.length>90?q.q.slice(0,88)+'…':q.q)}</button></li>`});
  h+=`</ol><div class="bar"><button id="cx-reset">Reiniciar el caso</button><span class="hint" id="cx-reset-msg">Tus intentos anteriores quedan en el historial de resultados.</span></div></div>`;
  $('cx-root').innerHTML=h;
  $('cx-root').querySelectorAll('.cxmap button').forEach(b=>b.onclick=()=>{CX.view=+b.dataset.k;cxRender();$('cx-root').scrollIntoView({block:'start'})});
  let arm=false;$('cx-reset').onclick=()=>{if(!arm){arm=true;$('cx-reset').textContent='Confirmar: reiniciar';$('cx-reset-msg').textContent='Vuelve a pulsar para empezar de cero.';return}
    CX.i=0;CX.ans={};CX.done=false;CX.view=-1;CX.started=true;cxSave();cxRender()};
}
