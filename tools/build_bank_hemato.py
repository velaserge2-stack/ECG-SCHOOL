#!/usr/bin/env python3
"""Genera modulos/39_banco_hemato.html a partir del Banco Cardio (33).

El Banco Hemato usa exactamente el mismo motor que el 33 (práctica, simulacro,
flashcards, repaso FSRS, progreso y respaldo). Este script:
  - sustituye los datos (preguntas y flashcards) por src/hemato/banco/*.js,
  - cambia la configuración del banco: espacio de nombres 'h:' en IndexedDB y
    clave bancoHemato.v1, para no mezclar progreso con el Banco Cardio,
  - cambia temas, títulos y textos,
  - quita el generador de trazos de ECG y su renderizado (no hay trazos).
Así, cualquier mejora del 33 se hereda volviendo a correr el script.

Uso:  python3 tools/build_bank_hemato.py .
"""
import glob, os, re, sys

root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
src = open(os.path.join(root, 'modulos', '33_banco_cardio.html'), encoding='utf-8').read()
data = ''.join(open(p, encoding='utf-8').read() + '\n'
               for p in sorted(glob.glob(os.path.join(root, 'src', 'hemato', 'banco', '*.js')))
               if not p.endswith('fc.js'))
data += open(os.path.join(root, 'src', 'hemato', 'banco', 'fc.js'), encoding='utf-8').read()
h = src


def rep(old, new, cnt=1):
    global h
    n = h.count(old)
    assert n == cnt, '%d× %r' % (n, old[:80])
    h = h.replace(old, new)


# 1) datos
a = h.index("// La opción correcta va siempre primero aquí; la página baraja las opciones.")
a = h.index('\n', a) + 1
b = h.index('</script>', a)
h = h[:a] + '\n' + data + '\n' + h[b:]

# 2) configuración del banco y temas
rep("const BANK={id:'cardio',ns:'',name:'Banco Cardio'};", "const BANK={id:'hemato',ns:'h:',name:'Banco Hemato'};")
rep("const KEY='bancoCardio.v1';", "const KEY='bancoHemato.v1';")
t0 = h.index('const TEMAS={')
t1 = h.index('};', t0) + 2
h = h[:t0] + ("const TEMAS={HB:'Hemoglobina, curva de O₂, CO, MetHb y CO₂',ER:'Eritrocito, hierro, EPO y hepcidina',"
              "BR:'Bilirrubina e ictericias',AN:'Biometría y anemias (B12 y folato)',HM:'Hemostasia, coagulación y fármacos',"
              "IN:'Inmunidad e hipersensibilidad',GS:'Grupos sanguíneos, transfusión y EHRN'};") + h[t1:]

# 3) textos
rep('<title>Banco Cardio</title>', '<title>Banco Hemato</title>')
rep('<div class="eyebrow">Banco de preguntas · fisiología cardiovascular</div>',
    '<div class="eyebrow">Banco de preguntas · Hematología</div>')
rep('<h1>Banco Cardio</h1>', '<h1>Banco Hemato</h1>')
rep('<p class="sub">Preguntas en el estilo de tu examen, con trazos de ECG para leer, y tarjetas con los valores que más se preguntan. Cada respuesta trae su enseñanza, aciertes o no.</p>',
    '<p class="sub">Preguntas tipo examen y casos clínicos de hematología, con tarjetas de repaso espaciado. Cada respuesta explica el mecanismo y la trampa clásica, aciertes o no.</p>')
f0 = h.index('<footer>Material de estudio; no sirve')
f1 = h.index('</footer>', f0)
h = h[:f0] + ('<footer>Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales. '
              'Sin aval institucional. '
              'Los valores de referencia dependen del laboratorio; las cifras marcadas VERIFICAR deben confirmarse con el libro o las diapositivas del curso. '
              'Tu avance se guarda sólo en este navegador, separado del Banco Cardio.') + h[f1:]

# 4) sin trazos de ECG en las preguntas del banco (el generador se conserva para los casos cascada)
rep('<label class="chk"><input type="checkbox" id="p-ecg"> Sólo con trazo</label>',
    '<input type="checkbox" id="p-ecg" hidden aria-hidden="true">')
rep("${q.s?'<span class=\"pill\">Con trazo</span>':''}", '')
rep("  if(q.s)h+=`<div class=\"ecg\">${ECG.svg(q.s).html}</div>`;\n", '')
rep("<span>${QS.filter(q=>q.s).length} con trazo de ECG</span>", "<span>${QS.filter(q=>/\\b(años|Paciente|paciente|Mujer|Hombre|Niñ[oa]|Varón|Recién nacido|Embarazada|Adolescente|Atleta|Corredor|Fumador|Alcohólico)\\b/.test(q.q)).length} casos clínicos</span>")
# generador: onda Q patológica (q, en mV) y espiga de marcapasos (spike) — solo en este banco
rep("    if(m==='n'){d=o.qrs||.08;const R=o.ramp||1.1;\n",
    "    if(o.spike)C.push({k:'spk',c:q0-.004});\n    if(m==='n'){d=o.qrs||.08;const R=o.ramp||1.1;if(o.q)C.push(G(q0+.02,-o.q,.014));\n")
rep("rr:o.rr||sp.rr||.8,t:sp.t,tw:sp.tw,st:sp.st,u:sp.u,qt:sp.qt,ramp:sp.ramp,qrs:sp.qrs}",
    "rr:o.rr||sp.rr||.8,t:sp.t,tw:sp.tw,st:sp.st,u:sp.u,qt:sp.qt,ramp:sp.ramp,qrs:sp.qrs,q:sp.q,spike:sp.spike}")
rep("        else if(c.k==='st'){",
    "        else if(c.k==='spk'){if(Math.abs(t-c.c)<.003)s+=1.6}\n        else if(c.k==='st'){")
# 5) Caso cascada (dificultad extrema): pestaña, sección, estilos y lógica
cx_js = open(os.path.join(root, 'src', 'hemato', 'cascada_ui.js'), encoding='utf-8').read()
rep('<a href="#simulacro" data-v="simulacro">Simulacro</a>',
    '<a href="#simulacro" data-v="simulacro">Simulacro</a>\n    <a href="#cascada" data-v="cascada">Casos cascada<span class="tbadge xt">Extrema</span></a>')
rep('  <!-- SIMULACRO -->', '''  <!-- CASO CASCADA -->
  <section id="v-cascada" hidden style="display:grid;gap:16px">
    <div><div class="progress"><span id="cx-score"></span><span class="hint">Dificultad: extrema · razonamiento en cadena</span></div><div class="meter"><i id="cx-meter"></i></div></div>
    <div id="cx-root" style="display:grid;gap:14px"></div>
  </section>

  <!-- SIMULACRO -->''')
rep('<button id="p-shuf">Barajar</button>', '<button id="p-shuf">Barajar</button>\n      <button id="p-xt" class="xtb" title="Casos clínicos en cascada: dificultad extrema">Extrema: casos cascada →</button>')
rep('@media (prefers-reduced-motion: reduce){.fc{transition:none}}', '''.tbadge.xt{background:var(--bad)}.pill.xt{color:var(--bad);border-color:var(--bad);font-weight:700}
.xtb{border-color:var(--bad);color:var(--bad);font-weight:600}
.cxhist{border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:10px 14px}
.cxhist summary{cursor:pointer;font-weight:600}.cxhist[open]{display:grid;gap:10px}
.cxact{border-left:3px solid var(--accent);padding:4px 10px;display:grid;gap:4px}.cxact p{margin:0;color:var(--muted);font-size:15px}
.cxact ul,.cxnew ul{margin:0;padding-left:18px;font-size:15px}
.cxnew{border:2px solid var(--accent);border-radius:12px;background:var(--accent-soft);padding:12px 16px;display:grid;gap:6px}
ol.cxmap{margin:0;padding-left:22px;display:grid;gap:4px}ol.cxmap button{all:unset;cursor:pointer;display:block;font-size:15px;line-height:1.4}ol.cxmap button:hover{text-decoration:underline}
ol.cxmap button:focus-visible{outline:2px solid var(--accent)}
.cxcases{font-size:14px;padding:6px 12px}.cxcase{display:grid;gap:10px}
.cxecg{margin:0;display:grid;gap:4px}.cxecg figcaption{font:12px var(--f-mono);color:var(--muted)}
@media (prefers-reduced-motion: reduce){.fc{transition:none}}''')
rep("/* ───────── Navegación por hash ───────── */\nconst VIEWS=['practica','simulacro','flashcards','progreso'];",
    cx_js + "\n/* ───────── Navegación por hash ───────── */\nconst VIEWS=['practica','simulacro','cascada','flashcards','progreso'];")
rep("  if(booted){if(v==='flashcards')rRender();if(v==='progreso')gRender()}",
    "  if(booted){if(v==='flashcards')rRender();if(v==='progreso')gRender();if(v==='cascada')cxRender()}")
rep("  try{await restoreSim()}catch(e){}", "  try{await restoreSim()}catch(e){}\n  await cxRestore();cxRender();")
rep("$('g-wipe').onclick=doWipeCards;", "$('g-wipe').onclick=doWipeCards;\n$('p-xt').onclick=()=>{if(CASOS.length>1){CX.view=-1;cxPick(-1)}try{history.replaceState(null,'','#cascada')}catch(_){}route('cascada');cxRender();window.scrollTo(0,0)};")

out = os.path.join(root, 'modulos', '39_banco_hemato.html')
open(out, 'w', encoding='utf-8').write(h)
print(os.path.basename(out), len(h.encode('utf-8')), 'bytes')
