#!/usr/bin/env python3
"""Incrusta las bibliotecas de lib/ en los módulos que las usan.

Los módulos son HTML autocontenidos (se cargan dentro de un iframe srcdoc),
así que no pueden pedir archivos relativos de forma fiable. Este script copia
el contenido de lib/<nombre>.js entre los marcadores

    <!--LIB:nombre--> ... <!--/LIB:nombre-->

de cada módulo, y copia también las bibliotecas a web/lib/ para el marco.
Uso:  python3 tools/inline_libs.py .
"""
import os, re, shutil, sys

root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
libdir = os.path.join(root, 'lib')
pat = re.compile(r'<!--LIB:([\w.-]+)-->.*?<!--/LIB:\1-->', re.S)


def lib_tag(name):
    src = open(os.path.join(libdir, name + '.js'), encoding='utf-8').read()
    if '</script' in src.lower():
        raise SystemExit(name + '.js contiene </script>; no se puede incrustar')
    return '<!--LIB:%s--><script>\n%s\n</script><!--/LIB:%s-->' % (name, src, name)


changed = 0
for d in ('modulos',):
    for fn in sorted(os.listdir(os.path.join(root, d))):
        if not fn.endswith('.html'):
            continue
        p = os.path.join(root, d, fn)
        h = open(p, encoding='utf-8').read()
        names = pat.findall(h)
        if not names:
            continue
        n = pat.sub(lambda m: lib_tag(m.group(1)), h)
        if n != h:
            open(p, 'w', encoding='utf-8').write(n)
            changed += 1
        print(fn, '←', ', '.join(names))

os.makedirs(os.path.join(root, 'web', 'lib'), exist_ok=True)
for fn in os.listdir(libdir):
    shutil.copy2(os.path.join(libdir, fn), os.path.join(root, 'web', 'lib', fn))
print(changed, 'módulo(s) actualizados; web/lib sincronizado')
