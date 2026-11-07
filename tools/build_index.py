import json,re,sys,os,glob
root=sys.argv[1]
mods=sorted(glob.glob(os.path.join(root,'modulos','*.html')))
G=[('Fundamentos (F)',['09','07','08']),('Electrocardiograma (A)',['01','02','03','04','05']),
   ('Hemodinamia (B)',['06','10','11','12','14','16','17','19','22','23']),('Regulación y circulaciones regionales (D)',['21','13','20','15','18'])]
data={}
for p in mods:
    n=os.path.basename(p)[:2]; h=open(p,encoding='utf-8').read()
    t=re.search(r'<title>([^<]*)',h).group(1); e=re.search(r'class="eyebrow">([^<]*)',h).group(1)
    data[n]={'n':n,'t':t,'e':e,'h':h,'f':os.path.basename(p)}
assert sum(len(g[1]) for g in G)==len(data)
nav=''.join('<div class="grp"><div class="gl">%s</div>%s</div>'%(g,''.join('<a href="#m%s" data-n="%s"><span class="num">%s</span><span><b>%s</b><small>%s</small></span></a>'%(k,k,k,data[k]['t'],data[k]['e']) for k in ks)) for g,ks in G)
js=json.dumps({k:{'t':v['t'],'h':v['h']} for k,v in data.items()},ensure_ascii=False).replace('</','<\\/').replace('<!--','<\\!--')
order=json.dumps([k for g in G for k in g[1]])
page='''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ECG School</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
:root{--bg:#F1F4F4;--panel:#FFFFFF;--fg:#16211F;--muted:#586966;--line:#D5DEDC;--vec:#0A7C76;--vecSoft:rgba(10,124,118,.14);color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0D1514;--panel:#142120;--fg:#E5EFEC;--muted:#98ADA8;--line:#2A3C39;--vec:#3FD0C6;--vecSoft:rgba(63,208,198,.16);color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0D1514;--panel:#142120;--fg:#E5EFEC;--muted:#98ADA8;--line:#2A3C39;--vec:#3FD0C6;--vecSoft:rgba(63,208,198,.16);color-scheme:dark}
*{box-sizing:border-box}html,body{margin:0}body{background:var(--bg);color:var(--fg);font:16px/1.5 "Source Sans 3","Segoe UI",system-ui,sans-serif}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line)}
.top h1{margin:0;font:700 1.15rem "Bricolage Grotesque",system-ui,sans-serif}.top .cur{color:var(--muted);font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
.top button{font:600 .9rem inherit;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:5px;padding:6px 10px;cursor:pointer}
.top button:hover{border-color:var(--vec)}
.lay{display:grid;grid-template-columns:290px minmax(0,1fr);min-height:calc(100vh - 53px)}
nav{border-right:1px solid var(--line);background:var(--panel);padding:12px 10px 40px;position:sticky;top:53px;height:calc(100vh - 53px);overflow-y:auto}
.grp{margin-bottom:14px}.gl{font:600 .7rem "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:4px 8px 6px}
nav a{display:flex;gap:10px;align-items:flex-start;padding:7px 8px;border-radius:5px;color:var(--fg);text-decoration:none;border-left:3px solid transparent}
nav a:hover{background:var(--vecSoft)}nav a[aria-current="page"]{background:var(--vecSoft);border-left-color:var(--vec)}
nav b{display:block;font-weight:600;font-size:.92rem}nav small{display:block;color:var(--muted);font-size:.75rem;line-height:1.3}
.num{font:600 .75rem "JetBrains Mono",monospace;color:var(--vec);padding-top:2px}
main{min-width:0}iframe{display:block;width:100%;border:0;min-height:calc(100vh - 53px);background:var(--bg)}
#menu{display:none}
@media (max-width:820px){.lay{grid-template-columns:minmax(0,1fr)}#menu{display:inline-block}nav{position:fixed;left:0;top:53px;width:min(320px,88vw);z-index:4;transform:translateX(-102%);transition:transform .2s;box-shadow:0 8px 24px rgba(0,0,0,.2)}body.open nav{transform:none}}
a:focus-visible,button:focus-visible{outline:2px solid var(--vec);outline-offset:2px}
</style></head><body>
<header class="top"><button id="menu" aria-label="Mostrar módulos">☰</button><h1>ECG School</h1><span class="cur" id="cur"></span><button id="prev" aria-label="Módulo anterior">‹</button><button id="next" aria-label="Módulo siguiente">›</button></header>
<div class="lay"><nav aria-label="Módulos">'''+nav+'''<p style="font-size:.78rem;color:var(--muted);margin:10px 8px">Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales. Alineado con los objetivos de la Unidad 6 como referencia; sin aval institucional.</p></nav>
<main><iframe id="fr" title="Módulo"></iframe></main></div>
<script>
var MODS='''+js+''';var ORDER='''+order+''';
(function(){var fr=document.getElementById('fr'),cur=document.getElementById('cur'),ro=null,now=null;
function fitH(){try{var d=fr.contentDocument;if(!d||!d.documentElement)return;fr.style.height=Math.max(d.documentElement.scrollHeight,window.innerHeight-53)+'px'}catch(e){}}
function show(n){if(!MODS[n])n=ORDER[0];if(n===now)return;now=n;
  document.querySelectorAll('nav a').forEach(function(a){if(a.dataset.n===n)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  cur.textContent=n+' · '+MODS[n].t;document.title=MODS[n].t+' · ECG School';
  if(ro){ro.disconnect();ro=null}fr.style.height='';fr.srcdoc=MODS[n].h;window.scrollTo(0,0);document.body.classList.remove('open')}
fr.addEventListener('load',function(){fitH();try{if(window.ResizeObserver){ro=new ResizeObserver(fitH);ro.observe(fr.contentDocument.body)}}catch(e){}});
function fromHash(){var m=/^#m(\\d\\d)$/.exec(location.hash);show(m?m[1]:ORDER[0])}
window.addEventListener('hashchange',fromHash);window.addEventListener('resize',fitH);
function step(d){var i=ORDER.indexOf(now);location.hash='#m'+ORDER[(i+d+ORDER.length)%ORDER.length]}
document.getElementById('prev').onclick=function(){step(-1)};document.getElementById('next').onclick=function(){step(1)};
document.getElementById('menu').onclick=function(){document.body.classList.toggle('open')};
fromHash()})();
</script></body></html>'''
open(os.path.join(root,'index.html'),'w',encoding='utf-8').write(page)
print(len(data),len(page))
