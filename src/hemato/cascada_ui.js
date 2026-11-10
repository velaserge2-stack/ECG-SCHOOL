/* ───────── CASOS CASCADA · dificultad extrema ─────────
   Varios casos; cada uno es un paciente con preguntas en orden. Cada respuesta desbloquea datos
   nuevos y la historia clínica se acumula. El progreso de cada caso se guarda por separado en
   IndexedDB: el caso 1 en SID('cascada') (como antes) y los siguientes en SID('cascadaN'). */
const CASOS=[typeof CASCADA!=='undefined'?CASCADA:null,typeof CASCADA2!=='undefined'?CASCADA2:null].filter(Boolean);
const CXG=[[/Vacun|pasiva|Memoria/,'Vacunación y memoria inmune'],[/Herencia/,'Herencia de grupos sanguíneos'],[/Hematopoyesis|Eritropoyesis|^EPO$/,'Hematopoyesis y EPO'],
 [/Venoso|Starling/,'Vascular, venoso y Starling'],
 [/Electrocardiograma/,'Electrocardiograma'],[/Potencial|Electrolitos/,'Potencial de acción y electrolitos'],[/Conducción|Pulso venoso/,'Conducción y ritmo'],
 [/isquemia|lesión|coronaria/i,'Isquemia y flujo coronario'],[/Hemostasia|Fármacos|Plaqueta/,'Hemostasia y fármacos'],[/Bilirrubina|Ictericia/,'Bilirrubina'],
 [/Inmunidad|Inmunoglobulinas|Hipersensibilidad|ABO|Rh|Pruebas|Grupos/,'Inmunidad y transfusión'],[/Hierro|EPO \/ médula/,'Hierro, inflamación y médula'],[/Eritrocito|Biometría/,'Eritrocito, EPO y biometría'],
 [/Hemoglobina|curva|pH|O₂|HbF|gases/,'Hemoglobina, curva de O₂ y pH'],[/Hemodinamia|Gasto|Microcirculación|Control/,'Hemodinamia y control'],[/Integración/,'Integración']];
function cxGrp(s){for(const [r,n] of CXG)if(r.test(s))return n;return s}
function cxFlat(c){const out=[];c.actos.forEach((a,ai)=>a.preguntas.forEach(p=>out.push(Object.assign({acto:ai,k:out.length},p))));return out}
const CXALL=CASOS.map(cxFlat);
const CXST=CASOS.map(()=>({i:0,ans:{},started:false,view:-1,done:false}));
let CXN=-1,CASCADA_CUR=CASOS[0]||null,CXQ=CXALL[0]||[],CX=CXST[0]||{i:0,ans:{},started:false,view:-1,done:false};
function cxSid(n){return n?'cascada'+(n+1):'cascada'}
function cxPick(n){CXN=n;if(n>=0){CASCADA_CUR=CASOS[n];CXQ=CXALL[n];CX=CXST[n]}saveSession('cascada-sel',{n})}
function cxOrder(k){return shuffle(CXQ[k].o.map((_,i)=>i),rng((k+1000*Math.max(0,CXN))*104729+77))}
function cxSave(){saveSession(cxSid(CXN),{i:CX.i,ans:CX.ans,started:CX.started,done:CX.done})}
async function cxRestore(){
  await Promise.all(CASOS.map(async(_,n)=>{try{const s=await ECGDB.get('sessions',SID(cxSid(n)));const st=CXST[n];
    if(s){st.i=Math.min(s.i||0,CXALL[n].length-1);st.ans=s.ans||{};st.started=!!s.started;st.done=!!s.done}}catch(e){}}));
  try{const s=await ECGDB.get('sessions',SID('cascada-sel'));if(s&&s.n>=0&&s.n<CASOS.length){CXN=s.n;CASCADA_CUR=CASOS[s.n];CXQ=CXALL[s.n];CX=CXST[s.n]}}catch(e){}
}
function cxScoreOf(n){const st=CXST[n];let ok=0,c=0;for(const k in st.ans){c++;if(st.ans[k]===0)ok++}return{ok,n:c}}
function cxScore(){return cxScoreOf(Math.max(0,CXN))}
function cxHist(upto){let h='';CASCADA_CUR.actos.forEach((a,ai)=>{if(ai>upto)return;
  h+=`<div class="cxact"><b>${esc(a.titulo)}</b><p>${esc(a.relato)}</p><ul>${a.datos.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>`});return h}
const cxBackBtn=()=>CASOS.length>1?`<button class="cxcases">← Todos los casos</button>`:'';
function cxWireBack(root){root.querySelectorAll('.cxcases').forEach(b=>b.onclick=()=>{CX.view=-1;cxPick(-1);cxRender();root.scrollIntoView({block:'start'})})}
/* lista de casos */
function cxList(){
  const root=$('cx-root');
  const tot=CXALL.reduce((s,q)=>s+q.length,0);
  $('cx-score').textContent=`${CASOS.length} casos · ${tot} preguntas en total`;$('cx-meter').style.width='0';
  let h='';
  CASOS.forEach((c,n)=>{const q=CXALL[n],st=CXST[n],sc=cxScoreOf(n);
    const estado=st.done?`Terminado · ${Math.round(100*sc.ok/q.length)} %`:sc.n?`En curso · ${sc.n} de ${q.length} respondidas`:'Sin empezar';
    const sis=[...new Set(q.map(x=>cxGrp(x.s)))];
    h+=`<div class="card cxcase"><div class="qmeta"><span class="pill xt">Extrema</span><span class="pill">Caso ${n+1}</span><span>${q.length} preguntas · ${c.actos.length} actos</span></div>
      <div class="verdict" style="font-size:21px">${esc(c.titulo)}</div>
      <p style="margin:0">${esc(c.paciente)}</p>
      <p class="hint" style="margin:0">Conecta: ${sis.map(esc).join(' · ')}.</p>
      <div class="meter"><i style="width:${100*sc.n/q.length}%"></i></div>
      <div class="bar"><button class="primary" data-case="${n}">${st.done?'Ver mi mapa':sc.n?'Continuar':'Empezar'}</button><span class="hint">${estado}</span></div></div>`});
  root.innerHTML=h;
  root.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{cxPick(+b.dataset.case);cxRender();root.scrollIntoView({block:'start'})});
}
function cxRender(){
  const root=$('cx-root');if(!root||!CASOS.length)return;
  if(CXN<0&&CASOS.length>1){cxList();return}
  if(CXN<0)cxPick(0);
  const sc=cxScore();
  $('cx-score').textContent=(CASOS.length>1?`Caso ${CXN+1} · `:'')+(sc.n?`Aciertos ${sc.ok} de ${sc.n} respondidas · ${CXQ.length} preguntas`:`${CXQ.length} preguntas · ${CASCADA_CUR.actos.length} actos`);
  $('cx-meter').style.width=(100*sc.n/CXQ.length)+'%';
  if(!CX.started){
    root.innerHTML=`${cxBackBtn()?`<div>${cxBackBtn()}</div>`:''}<div class="card"><div class="verdict" style="font-size:22px">${esc(CASCADA_CUR.titulo)}</div>
      <p style="margin:0"><b>Paciente:</b> ${esc(CASCADA_CUR.paciente)}</p><p style="margin:0;color:var(--muted)">${esc(CASCADA_CUR.instrucciones)}</p>
      <p class="hint" style="margin:0">Sistemas que vas a conectar: ${[...new Set(CXQ.map(q=>cxGrp(q.s)))].map(esc).join(' · ')}.</p>
      <div class="bar"><button class="primary" id="cx-go">${sc.n?'Continuar el caso':'Empezar el caso'}</button></div></div>`;
    cxWireBack(root);$('cx-go').onclick=()=>{CX.started=true;cxSave();cxRender()};return}
  if(CX.done&&CX.view<0){cxSummary();return}
  const k=CX.view>=0?CX.view:CX.i,q=CXQ[k],a=CASCADA_CUR.actos[q.acto],ans=CX.ans[k],answered=ans!=null,order=cxOrder(k);
  const maxAct=CXQ[Math.max(CX.i,k)].acto;
  let h=cxBackBtn()?`<div>${cxBackBtn()}</div>`:'';
  h+=`<details class="cxhist" ${q.acto>0?'open':''}><summary>Historia clínica acumulada (hasta el ${esc(CASCADA_CUR.actos[maxAct].titulo.split(' · ')[0].toLowerCase())})</summary>${cxHist(maxAct)}</details>`;
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
  root.innerHTML=h;cxWireBack(root);
  root.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(CX.ans[k]!=null)return;CX.ans[k]=+b.dataset.oi;cxSave();cxRender();
    const t=root.querySelector('.teach');if(t&&t.getBoundingClientRect().bottom>innerHeight)t.scrollIntoView({block:'nearest',behavior:'smooth'})});
  const pv=$('cx-prev');if(pv)pv.onclick=()=>{CX.view=k-1;cxRender();root.scrollIntoView({block:'start'})};
  const bk=$('cx-back');if(bk)bk.onclick=()=>{CX.view=-1;cxRender()};
  const nx=$('cx-next');if(nx)nx.onclick=()=>{CX.i=k+1;CX.view=-1;cxSave();cxRender();root.scrollIntoView({block:'start'})};
  const en=$('cx-end');if(en)en.onclick=()=>{CX.done=true;CX.view=-1;cxSave();cxFinish();cxRender();root.scrollIntoView({block:'start'})};
}
function cxFinish(){const sc=cxScore(),ts=Date.now();
  DB.run(ECGDB.put('results',{id:SID('cascada-')+(CXN>0?'c'+(CXN+1)+'-':'')+ts,source:'cascada',caso:CXN+1,titulo:CASCADA_CUR.titulo,ts,total:CXQ.length,ok:sc.ok,ms:0,ans:Object.assign({},CX.ans)}))}
function cxSummary(){const sc=cxScore(),bySys={};
  CXQ.forEach(q=>{const s=cxGrp(q.s);bySys[s]=bySys[s]||[0,0];bySys[s][1]++;if(CX.ans[q.k]===0)bySys[s][0]++});
  const pct=Math.round(100*sc.ok/CXQ.length);
  let h=`${cxBackBtn()?`<div>${cxBackBtn()}</div>`:''}<div class="card"><div class="eyebrow">${esc(CASCADA_CUR.titulo)}</div><div class="result-head"><div class="big">${pct}%</div><div>${sc.ok} de ${CXQ.length} eslabones conectados correctamente</div></div>
    <p style="margin:0">${pct>=85?'Razonamiento en cascada sólido: conectaste mecanismos de varios sistemas sin perder el hilo.':pct>=60?'Buen hilo general; revisa los eslabones fallados: suelen ser los puntos donde un sistema «empuja» a otro.':'La cadena se rompió en varios puntos. Repasa los eslabones en rojo en orden: cada uno depende del anterior.'}</p>
    <div style="overflow-x:auto"><table class="mini"><thead><tr><th>Sistema</th><th style="text-align:right">Aciertos</th></tr></thead><tbody>${Object.entries(bySys).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).map(([s,v])=>`<tr><td>${esc(s)}</td><td class="n">${v[0]}/${v[1]}</td></tr>`).join('')}</tbody></table></div>
    <h4 style="margin:0">Tu mapa de la cascada</h4><ol class="cxmap">`;
  CXQ.forEach(q=>{const ok=CX.ans[q.k]===0;h+=`<li class="${ok?'ok':'bad'}"><button data-k="${q.k}"><span class="mk ${ok?'ok':'bad'}">${ok?'✓':'✗'}</span> <b>${esc(q.s)}</b> · ${esc(q.q.length>90?q.q.slice(0,88)+'…':q.q)}</button></li>`});
  h+=`</ol><div class="bar"><button id="cx-reset">Reiniciar el caso</button><span class="hint" id="cx-reset-msg">Tus intentos anteriores quedan en el historial de resultados.</span></div></div>`;
  $('cx-root').innerHTML=h;cxWireBack($('cx-root'));
  $('cx-root').querySelectorAll('.cxmap button').forEach(b=>b.onclick=()=>{CX.view=+b.dataset.k;cxRender();$('cx-root').scrollIntoView({block:'start'})});
  let arm=false;$('cx-reset').onclick=()=>{if(!arm){arm=true;$('cx-reset').textContent='Confirmar: reiniciar';$('cx-reset-msg').textContent='Vuelve a pulsar para empezar de cero.';return}
    CX.i=0;CX.ans={};CX.done=false;CX.view=-1;CX.started=true;cxSave();cxRender()};
}
