"""Genera dos índices con la misma página de inicio y menú:

- index.html      versión local: los módulos de modulos/ van incrustados sin modificar.
- web/index.html  versión publicable con login: no contiene módulos; cada uno se descarga
                  del bucket privado de Supabase Storage solo con una sesión autorizada.

Uso: python3 tools/build_index.py .
El orden y los grupos del menú se definen en G.
"""
import json, re, sys, os, glob, math, html

root = sys.argv[1]
mods = sorted(glob.glob(os.path.join(root, 'modulos', '*.html')))
G = [
    ('F', 'Fundamentos', 'La célula, la conducción y el circuito: la base de todo lo demás.', ['09', '07', '08']),
    ('A', 'Electrocardiograma', 'Del vector al trazo: deduce cada onda, intervalo y patrón.', ['01', '02', '03', '04', '05']),
    ('B', 'Hemodinamia', 'La bomba, los vasos y las presiones, del ciclo cardiaco al cateterismo.', ['06', '10', '32', '11', '12', '28', '14', '16', '17', '19', '22', '25', '26', '23']),
    ('D', 'Regulación y circulaciones regionales', 'Reflejos y órganos en paralelo: cómo se reparte el gasto.', ['27', '21', '13', '20', '15', '18']),
    ('E', 'Integración fisiológica', 'Un solo estado compartido para tejido, señal, contracción, circulación, control y medición.', ['24']),
    ('P', 'Práctica y evaluación', 'Preguntas tipo examen con trazos de ECG, simulacros y tarjetas de repaso.', ['33']),
]

data = {}
mods_by = {}
for p in mods:
    n = os.path.basename(p)[:2]
    mods_by[n] = p
    h = open(p, encoding='utf-8').read()
    t = re.search(r'<title>([^<]*)', h).group(1)
    e = re.search(r'class="eyebrow">([^<]*)', h).group(1)
    o = re.search(r'<span>Unidad 6: ([^<]*)</span>', h)
    lede = re.search(r'<p class="(?:[^"]*\s)?(?:lede|sub)(?:\s[^"]*)?">([^<]*)</p>', h)
    data[n] = {'t': t, 'e': e, 'h': h, 'o': o.group(1) if o else '', 'l': lede.group(1) if lede else ''}
assert sum(len(g[3]) for g in G) == len(data), 'Hay módulos sin grupo en G'
assert set(k for g in G for k in g[3]) == set(data), 'Hay módulos duplicados o fuera de grupo'

esc = html.escape
first = G[1][3][0]  # MVP: Cámara cardiaca

nav = '<a href="#inicio" data-n="inicio" class="home"><span class="num">⌂</span><span><b>Inicio</b><small>Presentación y mapa de módulos</small></span></a>'
nav += ''.join(
    '<div class="grp g%s"><div class="gl">%s · %s</div>%s</div>' % (
        L, L, esc(name),
        ''.join('<a href="#m%s" data-n="%s"><span class="num">%s</span><span><b>%s</b><small>%s</small></span></a>'
                % (k, k, k, esc(data[k]['t']), esc(data[k]['e'])) for k in ks))
    for L, name, _, ks in G)


def card(k):
    d = data[k]
    obj = d['o'].split('(')[0].strip()
    if len(obj) > 46:
        obj = obj[:44].rsplit(',', 1)[0] + '…'
    return ('<a class="card" href="#m%s"><span class="cn">%s</span><span class="ce">%s</span>'
            '<span class="ct">%s</span><span class="cl">%s</span>%s</a>'
            % (k, k, esc(d['e']), esc(d['t']), esc(d['l']),
               ('<span class="co">Unidad 6 · %s</span>' % esc(obj)) if obj else ''))


groups = ''.join(
    '<section class="part g%s"><div class="ph"><span class="badge">%s</span><div><h3>%s</h3><p>%s</p></div>'
    '<span class="cnt">%d módulos</span></div><div class="cards">%s</div></section>'
    % (L, L, esc(name), esc(desc), len(ks), ''.join(card(k) for k in ks))
    for L, name, desc, ks in G)

# Trazo de ECG decorativo (latidos sintéticos)
def ecg_path(w=1200, h=160, beats=5):
    pts = []
    base = h * 0.62
    for i in range(0, w + 1, 2):
        t = (i / w * beats) % 1
        g = lambda c, s, a: a * math.exp(-((t - c) / s) ** 2)
        v = g(.16, .03, 9) - g(.30, .008, 8) + g(.33, .012, 62) - g(.36, .01, 16) + g(.62, .05, 15)
        pts.append('%d,%.1f' % (i, base - v))
    return 'M' + ' L'.join(pts)


trace = ecg_path()
def jsdump(o):
    return json.dumps(o, ensure_ascii=False).replace('</', '<\\/').replace('<!--', '<\\!--')


js_local = jsdump({k: {'t': v['t'], 'h': v['h']} for k, v in data.items()})
js_web = jsdump({k: {'t': v['t'], 'f': os.path.basename(mods_by[k])} for k, v in data.items()})
order = json.dumps([k for g in G for k in g[3]])

def render(js, HEADX, BODYATTR, USERBOX, LOADER, START):
    return '''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ECG School</title>
<meta name="description" content="Plataforma interactiva para entender el ECG y la hemodinamia como un solo sistema.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap">
''' + HEADX + '''<style>
:root{--bg:#F1F4F4;--panel:#FFFFFF;--fg:#16211F;--muted:#586966;--line:#D5DEDC;--vec:#0A7C76;--vecSoft:rgba(10,124,118,.12);
 --blood:#B23A3A;--guess:#C2480F;--slate:#4A5D8A;--gridMinor:rgba(205,95,108,.13);--gridMajor:rgba(205,95,108,.28);color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0D1514;--panel:#142120;--fg:#E5EFEC;--muted:#98ADA8;--line:#2A3C39;--vec:#3FD0C6;--vecSoft:rgba(63,208,198,.14);
 --blood:#E27A7A;--guess:#FF9A5C;--slate:#9DB2E8;--gridMinor:rgba(255,125,135,.09);--gridMajor:rgba(255,125,135,.2);color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0D1514;--panel:#142120;--fg:#E5EFEC;--muted:#98ADA8;--line:#2A3C39;--vec:#3FD0C6;--vecSoft:rgba(63,208,198,.14);
 --blood:#E27A7A;--guess:#FF9A5C;--slate:#9DB2E8;--gridMinor:rgba(255,125,135,.09);--gridMajor:rgba(255,125,135,.2);color-scheme:dark}
*{box-sizing:border-box}html,body{margin:0}body{background:var(--bg);color:var(--fg);font:16px/1.5 "Source Sans 3","Segoe UI",system-ui,sans-serif}
.gF{--acc:var(--slate)}.gA{--acc:var(--vec)}.gB{--acc:var(--blood)}.gD{--acc:var(--guess)}.gE{--acc:var(--vec)}.gP{--acc:var(--guess)}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line);height:53px}
.brand{display:flex;align-items:center;gap:8px;color:var(--fg);text-decoration:none;font:700 1.15rem "Bricolage Grotesque",system-ui,sans-serif;white-space:nowrap}
.brand svg{flex:none}
.top .cur{color:var(--muted);font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
.top button{font:600 .9rem inherit;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:5px;padding:6px 10px;cursor:pointer}
.top button:hover{border-color:var(--vec)}
.lay{display:grid;grid-template-columns:290px minmax(0,1fr);min-height:calc(100vh - 53px)}
nav{border-right:1px solid var(--line);background:var(--panel);padding:12px 10px 40px;position:sticky;top:53px;height:calc(100vh - 53px);overflow-y:auto}
.grp{margin:14px 0}.gl{font:600 .7rem "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--acc);margin:4px 8px 6px}
nav a{display:flex;gap:10px;align-items:flex-start;padding:7px 8px;border-radius:5px;color:var(--fg);text-decoration:none;border-left:3px solid transparent}
nav a:hover{background:var(--vecSoft)}nav a[aria-current="page"]{background:var(--vecSoft);border-left-color:var(--acc,var(--vec))}
nav b{display:block;font-weight:600;font-size:.92rem}nav small{display:block;color:var(--muted);font-size:.75rem;line-height:1.3}
.num{font:600 .75rem "JetBrains Mono",monospace;color:var(--acc,var(--vec));padding-top:2px;min-width:1.4em}
main{min-width:0}iframe{display:block;width:100%;border:0;min-height:calc(100vh - 53px);background:var(--bg)}
#menu{display:none}
@media (max-width:820px){.lay{grid-template-columns:minmax(0,1fr)}#menu{display:inline-block}nav{position:fixed;left:0;top:53px;width:min(320px,88vw);z-index:4;transform:translateX(-102%);transition:transform .2s;box-shadow:0 8px 24px rgba(0,0,0,.2)}body.open nav{transform:none}}
a:focus-visible,button:focus-visible{outline:2px solid var(--vec);outline-offset:2px}
[hidden]{display:none!important}

/* ---- inicio ---- */
#home{max-width:1080px;margin:0 auto;padding:24px 16px 56px;display:flex;flex-direction:column;gap:44px}
.hero{position:relative;border:1px solid var(--line);border-radius:10px;overflow:hidden;background-color:var(--panel);
 background-image:linear-gradient(var(--gridMajor) 1px,transparent 1px),linear-gradient(90deg,var(--gridMajor) 1px,transparent 1px),linear-gradient(var(--gridMinor) 1px,transparent 1px),linear-gradient(90deg,var(--gridMinor) 1px,transparent 1px);
 background-size:50px 50px,50px 50px,10px 10px,10px 10px;padding:44px 32px 0}
.hero::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--panel) 30%,transparent 78%);pointer-events:none}
.hero>*{position:relative}
.eyebrow{font:600 .74rem "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--vec)}
.hero h2{font:800 clamp(2.1rem,6vw,3.6rem)/1.04 "Bricolage Grotesque",system-ui,sans-serif;letter-spacing:-.02em;margin:10px 0 14px;max-width:16ch;text-wrap:balance}
.hero h2 em{font-style:normal;color:var(--vec)}
.hero p.lede{max-width:60ch;color:var(--muted);font-size:1.08rem;margin:0}
.cta{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 6px}
.bt{display:inline-flex;align-items:center;gap:8px;font:600 .98rem "Source Sans 3",sans-serif;text-decoration:none;border-radius:6px;padding:10px 16px;border:1px solid var(--line);color:var(--fg);background:var(--panel)}
.bt:hover{border-color:var(--vec)}.bt.pri{background:var(--vec);border-color:var(--vec);color:var(--bg)}.bt.pri:hover{filter:brightness(1.08)}
.trace{display:block;width:100%;height:150px;margin-top:8px}
.trace path{fill:none;stroke:var(--vec);stroke-width:2.4;stroke-linejoin:round;stroke-dasharray:4200;stroke-dashoffset:4200;animation:draw 3.2s ease-out .2s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.trace path{animation:none;stroke-dashoffset:0}}
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--line);margin:0 -32px;background:var(--panel)}
.stats div{padding:16px 20px;border-right:1px solid var(--line)}.stats div:last-child{border-right:0}
.stats b{display:block;font:700 1.7rem "Bricolage Grotesque",sans-serif;line-height:1.1}.stats span{font-size:.86rem;color:var(--muted)}
@media (max-width:680px){.hero{padding:30px 18px 0}.stats{grid-template-columns:repeat(2,minmax(0,1fr));margin:0 -18px}.stats div:nth-child(2){border-right:0}.stats div:nth-child(-n+2){border-bottom:1px solid var(--line)}}
.sh{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.sh h3{font:700 1.5rem "Bricolage Grotesque",sans-serif;margin:0}.sh p{margin:0;color:var(--muted);max-width:64ch}
.steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;counter-reset:s}
.step{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:16px;counter-increment:s;position:relative}
.step::before{content:counter(s);display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--vec);color:var(--bg);font:700 .8rem "JetBrains Mono",monospace;margin-bottom:10px}
.step h4{margin:0 0 4px;font:700 1.05rem "Bricolage Grotesque",sans-serif}.step p{margin:0;font-size:.92rem;color:var(--muted)}
@media (max-width:820px){.steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
.knobs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
@media (max-width:760px){.knobs{grid-template-columns:minmax(0,1fr)}}
.kb{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:18px;border-top:3px solid var(--acc)}
.kb h4{margin:0 0 10px;font:700 1.1rem "Bricolage Grotesque",sans-serif}
.kb ol{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.kb li{display:grid;grid-template-columns:minmax(0,12em) minmax(0,1fr);gap:10px;font-size:.92rem}
.kb li b{font-weight:600}.kb li span{color:var(--muted)}
@media (max-width:480px){.kb li{grid-template-columns:minmax(0,1fr);gap:0}}
.parts{display:flex;flex-direction:column;gap:28px}
.ph{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.ph h3{margin:0;font:700 1.25rem "Bricolage Grotesque",sans-serif}.ph p{margin:0;color:var(--muted);font-size:.93rem}
.ph .cnt{margin-left:auto;font:600 .75rem "JetBrains Mono",monospace;color:var(--muted);white-space:nowrap}
.badge{flex:none;width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font:800 1.2rem "Bricolage Grotesque",sans-serif;color:var(--panel);background:var(--acc)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.card{position:relative;display:flex;flex-direction:column;gap:6px;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:16px 16px 14px;color:var(--fg);text-decoration:none;transition:border-color .15s,transform .15s,box-shadow .15s;overflow:hidden}
.card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--acc);opacity:.7}
.card:hover{border-color:var(--acc);transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.08)}
@media (prefers-reduced-motion:reduce){.card,.card:hover{transition:none;transform:none}}
.cn{position:absolute;right:14px;top:12px;font:700 .8rem "JetBrains Mono",monospace;color:var(--acc)}
.ce{font:600 .68rem "JetBrains Mono",monospace;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding-right:2.5em}
.ct{font:700 1.12rem "Bricolage Grotesque",sans-serif;line-height:1.2}
.cl{font-size:.88rem;color:var(--muted);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.co{margin-top:auto;padding-top:6px;font:400 .72rem "JetBrains Mono",monospace;color:var(--muted)}
.fine{border-top:1px solid var(--line);padding-top:16px;font-size:.85rem;color:var(--muted);display:flex;flex-direction:column;gap:6px}
.fine p{margin:0}
</style></head><body''' + BODYATTR + '''>
<header class="top"><button id="menu" aria-label="Mostrar módulos">☰</button>
<a class="brand" href="#inicio"><svg width="26" height="18" viewBox="0 0 26 18" aria-hidden="true"><path d="M1 11h6l2-3 2 3 2-10 3 16 2-6h7" fill="none" stroke="var(--vec)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>ECG School</a>
<span class="cur" id="cur"></span><button id="prev" aria-label="Módulo anterior">‹</button><button id="next" aria-label="Módulo siguiente">›</button>''' + USERBOX + '''</header>
<div class="lay"><nav aria-label="Módulos">''' + nav + '''<p style="font-size:.78rem;color:var(--muted);margin:10px 8px">Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales. Alineado con los objetivos de la Unidad 6 como referencia; sin aval institucional.</p></nav>
<main>
<div id="home">
  <section class="hero">
    <div class="eyebrow">Fisiología cardiovascular · ECG y hemodinamia</div>
    <h2>Entiende el corazón, <em>no lo memorices</em>.</h2>
    <p class="lede">Un mismo modelo une lo eléctrico y lo mecánico. Mueve una perilla, predice qué pasará con el trazo y las presiones, y comprueba el porqué con una cadena causal, no con una regla suelta.</p>
    <div class="cta"><a class="bt pri" href="#m''' + first + '''">Empezar con «''' + esc(data[first]['t']) + '''» →</a><a class="bt" href="#mapa">Ver los ''' + str(len(data)) + ''' módulos</a></div>
    <svg class="trace" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true"><path d="''' + trace + '''"/></svg>
    <div class="stats">
      <div><b>''' + str(len(data)) + '''</b><span>módulos interactivos</span></div>
      <div><b>''' + str(len(G)) + '''</b><span>partes: ''' + ' · '.join(g[0] for g in G) + '''</span></div>
      <div><b>9</b><span>perillas causales</span></div>
      <div><b>6.1–6.283</b><span>objetivos de referencia (Unidad 6)</span></div>
    </div>
  </section>

  <section>
    <div class="sh"><h3>Cómo se aprende aquí</h3><p>Cada módulo repite el mismo ciclo. Lo importante no es acertar, sino saber en qué eslabón de la cadena se rompió tu razonamiento.</p></div>
    <div class="steps">
      <div class="step"><h4>Predice</h4><p>Antes de tocar nada, elige qué crees que pasará y con cuánta seguridad.</p></div>
      <div class="step"><h4>Observa</h4><p>Mueve la perilla: el ECG, las presiones y las curvas cambian a la vez.</p></div>
      <div class="step"><h4>Explica</h4><p>Arma la cadena causal con sus «porque», paso a paso.</p></div>
      <div class="step"><h4>Transfiere</h4><p>Resuelve un caso nuevo, un contraejemplo o un trazo desconocido.</p></div>
    </div>
  </section>

  <section>
    <div class="sh"><h3>Las perillas que lo explican todo</h3><p>Todo cambio del trazo o de la hemodinamia se puede atribuir a una de estas preguntas físicas.</p></div>
    <div class="knobs">
      <div class="kb gA"><h4>ECG: cuatro perillas</h4><ol>
        <li><b>Origen y secuencia</b><span>ritmo, onda P, eje, arritmias</span></li>
        <li><b>Tiempo y conducción</b><span>PR, QRS ancho, bloqueos, QT</span></li>
        <li><b>Masa y voltaje</b><span>hipertrofia, voltaje bajo</span></li>
        <li><b>Tejido y viabilidad</b><span>ST, T, onda Q, iones y fármacos</span></li></ol></div>
      <div class="kb gB"><h4>Hemodinamia: cinco perillas</h4><ol>
        <li><b>Volumen y retorno</b><span>precarga, presiones de llenado</span></li>
        <li><b>Resistencia y rigidez</b><span>poscarga, PAM, onda arterial</span></li>
        <li><b>Bomba</b><span>contractilidad y relajación, asa P–V</span></li>
        <li><b>Frecuencia, ritmo, sincronía</b><span>llenado, ondas A, gasto</span></li>
        <li><b>Estructura</b><span>válvulas, pericardio, cortocircuitos</span></li></ol></div>
    </div>
  </section>

  <section id="mapa">
    <div class="sh"><h3>Mapa de módulos</h3><p>Ruta sugerida: Fundamentos → Electrocardiograma → Hemodinamia → Regulación → Integración, y practica con el banco de preguntas. Puedes entrar a cualquiera; cada uno indica lo que requiere.</p></div>
    <div class="parts">''' + groups + '''</div>
  </section>

  <footer class="fine">
    <p>Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales.</p>
    <p>Alineado con los objetivos de la Unidad 6 de Fisiología como referencia verificable. Sin aval institucional. Las cifras marcadas VERIFICAR deben confirmarse con el libro del curso.</p>
  </footer>
</div>
<iframe id="fr" title="Módulo" hidden></iframe>
</main></div>
<script>
var MODS=''' + js + ''';var ORDER=''' + order + ''';
(function(){var fr=document.getElementById('fr'),home=document.getElementById('home'),cur=document.getElementById('cur'),ro=null,now=null;
''' + LOADER + '''
function fitH(){if(fr.hidden)return;try{var d=fr.contentDocument;if(!d||!d.documentElement)return;fr.style.height=Math.max(d.documentElement.scrollHeight,window.innerHeight-53)+'px'}catch(e){}}
function mark(n){document.querySelectorAll('nav a').forEach(function(a){if(a.dataset.n===n)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function goHome(anchor){if(ro){ro.disconnect();ro=null}if(now!=='inicio'){now='inicio';fr.hidden=true;fr.removeAttribute('srcdoc');home.hidden=false;mark('inicio');cur.textContent='';document.title='ECG School'}
  document.body.classList.remove('open');if(anchor){var el=document.getElementById(anchor);if(el)el.scrollIntoView({behavior:'smooth'})}else window.scrollTo(0,0)}
function show(n){if(!MODS[n])return goHome();if(n===now)return;now=n;mark(n);
  cur.textContent=n+' · '+MODS[n].t;document.title=MODS[n].t+' · ECG School';
  if(ro){ro.disconnect();ro=null}home.hidden=true;fr.hidden=false;fr.style.height='';load(n);window.scrollTo(0,0);document.body.classList.remove('open')}
fr.addEventListener('load',function(){fitH();try{if(window.ResizeObserver&&fr.contentDocument){ro=new ResizeObserver(fitH);ro.observe(fr.contentDocument.body)}}catch(e){}});
function fromHash(){var h=location.hash,m=/^#m(\\d\\d)$/.exec(h);if(m&&MODS[m[1]])show(m[1]);else goHome(h==='#mapa'?'mapa':null)}
window.addEventListener('hashchange',fromHash);window.addEventListener('resize',fitH);
function step(d){var i=ORDER.indexOf(now);var j=i<0?(d>0?0:ORDER.length-1):(i+d+ORDER.length)%ORDER.length;location.hash='#m'+ORDER[j]}
document.getElementById('prev').onclick=function(){step(-1)};document.getElementById('next').onclick=function(){step(1)};
document.getElementById('menu').onclick=function(){document.body.classList.toggle('open')};
''' + START + '''})();
</script></body></html>'''
local = render(js_local, '', '', '', 'function load(n){fr.srcdoc=MODS[n].h}', 'fromHash()')
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(local)

WEB_HEAD = '''<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
<script src="config.js"></script>
<style>body.gate .lay{visibility:hidden}.who{font-size:.8rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:22ch}
@media (max-width:600px){.who{display:none}}</style>
'''
WEB_USER = '<span class="who" id="who"></span><button id="logout">Salir</button>'
WEB_LOADER = r'''var CFG=window.ECG_CONFIG||{},SB=null,CACHE={};
function msgDoc(t,d){return '<!doctype html><meta charset="utf-8"><body style="margin:0;padding:40px 20px;font:16px/1.5 system-ui,sans-serif;color:#586966;background:#F1F4F4;text-align:center"><p style="font-weight:600;color:#16211F">'+t+'</p><p>'+(d||'')+'</p></body>'}
function load(n){var my=n;if(CACHE[n]){fr.srcdoc=CACHE[n];return}fr.srcdoc=msgDoc('Cargando «'+MODS[n].t+'»…');
  SB.storage.from(CFG.bucket||'modulos').download(MODS[n].f).then(function(r){if(r.error)throw r.error;return r.data.text()})
  .then(function(h){CACHE[my]=h;if(now===my)fr.srcdoc=h})
  .catch(function(e){if(now===my)fr.srcdoc=msgDoc('No se pudo cargar el módulo.','Revisa tu conexión. Si el problema sigue, el módulo puede no estar subido al bucket o tu correo ya no está autorizado. ('+(e&&e.message||e)+')')})}'''
WEB_START = r'''if(!CFG.supabaseUrl||/TU-PROYECTO/.test(CFG.supabaseUrl)||!window.supabase){location.replace('login.html');return}
SB=supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey);
function out(q){location.replace('login.html'+(q||'')+(location.hash?'#'+location.hash.slice(1):''))}
document.getElementById('logout').onclick=function(){SB.auth.signOut().then(function(){location.replace('login.html')})};
SB.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT')location.replace('login.html')});
SB.auth.getSession().then(function(r){var s=r.data&&r.data.session;if(!s)return out();
  return SB.rpc('is_allowed').then(function(a){if(a.error||a.data!==true){return SB.auth.signOut().then(function(){location.replace('login.html?e=noautorizado')})}
    document.getElementById('who').textContent=s.user.email;document.body.classList.remove('gate');fromHash()})})'''
web = render(js_web, WEB_HEAD, ' class="gate"', WEB_USER, WEB_LOADER, WEB_START)
os.makedirs(os.path.join(root, 'web'), exist_ok=True)
open(os.path.join(root, 'web', 'index.html'), 'w', encoding='utf-8').write(web)
print(len(data), 'módulos · index.html', len(local), 'bytes · web/index.html', len(web), 'bytes')
