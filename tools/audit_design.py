#!/usr/bin/env python3
"""Auditoría estática ligera del sistema visual de los módulos HTML."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
MODULES = sorted((ROOT / "modulos").glob("*.html"))
CHECKS = [
    ("Bricolage Grotesque", re.compile(r"Bricolage\\s*Grotesque", re.I)),
    ("Source Sans 3", re.compile(r"Source\\s*Sans\\s*3", re.I)),
    ("JetBrains Mono", re.compile(r"JetBrains\\s*Mono", re.I)),
    ("tema oscuro", re.compile(r"prefers-color-scheme\\s*:\\s*dark|data-theme\\s*=\\s*dark", re.I)),
    ("layout responsive", re.compile(r"@media\\s*\\([^)]*(?:max-width|width)", re.I)),
    ("foco visible", re.compile(r":focus-visible", re.I)),
    ("movimiento reducido", re.compile(r"prefers-reduced-motion", re.I)),
]

def main():
    if not MODULES:
        raise SystemExit("No se encontraron archivos HTML en modulos/.")
    print(f"ECG School · auditoría visual estática · {len(MODULES)} módulos\n")
    totals = {name: 0 for name, _ in CHECKS}
    for path in MODULES:
        html = path.read_text(encoding="utf-8")
        body16 = bool(re.search(r"font-size\\s*:\\s*16px|font\\s*:\\s*16px", html, re.I))
        results = []
        for name, pattern in CHECKS:
            ok = bool(pattern.search(html))
            totals[name] += int(ok)
            results.append(f"{'OK' if ok else 'REV'} {name}")
        results.append(f"{'OK' if body16 else 'REV'} texto base 16 px")
        print(f"{path.name}")
        print("  " + " · ".join(results))
    print("\nCobertura detectada:")
    for name, _ in CHECKS:
        print(f"  {name}: {totals[name]}/{len(MODULES)}")
    print("\nNota: auditoría por patrones; REV significa revisar manualmente, no necesariamente defecto.")

if __name__ == "__main__":
    main()
