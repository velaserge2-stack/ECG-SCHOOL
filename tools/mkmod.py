#!/usr/bin/env python3
"""Arma los módulos de src/<carpeta>/NN.body.html en modulos/.

Cada cuerpo empieza con metadatos en comentarios:
  <!--file: 34_nombre.html-->
  <!--title: Título-->
  <!--desc: Descripción para <meta name=description>-->
  <!--css ... -->            (opcional, CSS propio del módulo)
y puede usar @@QUIZ@@ (bloque «Predice y observa») y @@COMMON@@ (helpers JS).
Uso: python3 tools/mkmod.py src/hemato
"""
import glob, os, re, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
src = os.path.join(root, sys.argv[1] if len(sys.argv) > 1 else 'src/hemato')
head = open(os.path.join(src, '_head.html'), encoding='utf-8').read()
quiz = open(os.path.join(src, '_quiz.html'), encoding='utf-8').read()
common = open(os.path.join(src, '_common.js'), encoding='utf-8').read()
for p in sorted(glob.glob(os.path.join(src, '[0-9][0-9].body.html'))):
    b = open(p, encoding='utf-8').read()
    meta = lambda k: re.search(r'<!--%s: (.*?)-->' % k, b).group(1)
    css = re.search(r'<!--css\n(.*?)-->', b, re.S)
    body = re.sub(r'<!--(file|title|desc): .*?-->\n?', '', b)
    body = re.sub(r'<!--css\n.*?-->\n?', '', body, flags=re.S)
    out = (head.replace('@@TITLE@@', meta('title')).replace('@@DESC@@', meta('desc'))
           .replace('@@CSS@@', css.group(1) if css else '')
           + body.replace('@@QUIZ@@', quiz).replace('@@COMMON@@', common))
    dest = os.path.join(root, 'modulos', meta('file'))
    open(dest, 'w', encoding='utf-8').write(out)
    print(os.path.basename(dest), len(out.encode('utf-8')), 'bytes')
