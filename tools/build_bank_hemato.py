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
rep('<div class="eyebrow">Banco de preguntas · Unidad 6 · fisiología cardiovascular</div>',
    '<div class="eyebrow">Banco de preguntas · Hematología</div>')
rep('<h1>Banco Cardio</h1>', '<h1>Banco Hemato</h1>')
rep('<p class="sub">Preguntas en el estilo de tu examen, con trazos de ECG para leer, y tarjetas con los valores que más se preguntan. Cada respuesta trae su enseñanza, aciertes o no.</p>',
    '<p class="sub">Preguntas tipo examen y casos clínicos de hematología, con tarjetas de repaso espaciado. Cada respuesta explica el mecanismo y la trampa clásica, aciertes o no.</p>')
f0 = h.index('<footer>Material de estudio para la Unidad 6')
f1 = h.index('</footer>', f0)
h = h[:f0] + ('<footer>Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales. '
              'Basado en la Guía de Hematología (apuntes del Dr. Alejandro Leal). Sin aval institucional. '
              'Los valores de referencia dependen del laboratorio; las cifras marcadas VERIFICAR deben confirmarse con el libro o las diapositivas del curso. '
              'Tu avance se guarda sólo en este navegador, separado del Banco Cardio.') + h[f1:]

# 4) sin trazos de ECG
rep('<label class="chk"><input type="checkbox" id="p-ecg"> Sólo con trazo</label>',
    '<input type="checkbox" id="p-ecg" hidden aria-hidden="true">')
e0 = h.index('/* ───────── Generador de ECG ─────────')
e1 = h.index('/* ───────── Interfaz de una pregunta ─────────')
h = h[:e0] + h[e1:]
rep("${q.s?'<span class=\"pill\">Con trazo</span>':''}", '')
rep("  if(q.s)h+=`<div class=\"ecg\">${ECG.svg(q.s).html}</div>`;\n", '')
rep("<span>${QS.filter(q=>q.s).length} con trazo de ECG</span>", "<span>${QS.filter(q=>/\\b(años|Paciente|paciente|Mujer|Hombre|Niñ[oa]|Varón|Recién nacido|Embarazada|Adolescente|Atleta|Corredor|Fumador|Alcohólico)\\b/.test(q.q)).length} casos clínicos</span>")
rep("window.__dbg={QS,FS,ECG,optOrder,", "window.__dbg={QS,FS,optOrder,")
assert 'ECG.svg' not in h and 'const ECG=' not in h

out = os.path.join(root, 'modulos', '39_banco_hemato.html')
open(out, 'w', encoding='utf-8').write(h)
print(os.path.basename(out), len(h.encode('utf-8')), 'bytes')
