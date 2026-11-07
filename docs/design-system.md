# Sistema visual de ECG School

Este documento describe el sistema visual que ya existe en los módulos y fija criterios para mantenerlo coherente sin uniformar a la fuerza las visualizaciones científicas.

## 1. Identidad tipográfica

| Uso | Familia | Criterio |
|---|---|---|
| Títulos y encabezados | Bricolage Grotesque | Jerarquía, personalidad y lectura rápida |
| Texto, controles y explicaciones | Source Sans 3 | Lectura prolongada y buena legibilidad |
| Cifras, unidades, etiquetas técnicas | JetBrains Mono | Alineación y diferenciación de datos |

Tamaños de referencia: texto base 16 px con interlineado 1.5; títulos principales fluidos con `clamp()`; metadatos y etiquetas técnicas entre 0.72 y 0.8 rem. Evitar reducir el texto explicativo por debajo de 14 px.

## 2. Tokens de color

### Tema claro
- Fondo: `#F1F4F4`
- Superficie: `#FFFFFF`
- Texto: `#16211F`
- Texto secundario: `#586966`
- Bordes: `#D5DEDC`
- Vector / acento principal: `#0A7C76`
- Sangre / señal: `#B23A3A`
- Predicción / advertencia: `#C2480F`
- Acento secundario: `#4A5D8A`

### Tema oscuro
- Fondo: `#0D1514`
- Superficie: `#142120`
- Texto: `#E5EFEC`
- Texto secundario: `#98ADA8`
- Bordes: `#2A3C39`
- Acento principal: `#3FD0C6`

Los colores semánticos deben mantener su significado dentro de cada módulo. No usar el color como único indicador de un estado: acompañarlo con texto, forma o icono.

## 3. Geometría y espaciado

Patrón común de los módulos 1–23:
- Contenedor de lectura cercano a 1040 px.
- Espaciado de página de aproximadamente 20 px vertical y 16 px horizontal, respetando safe areas.
- Paneles con borde fino, superficie sólida y radio discreto (aprox. 6 px).
- Separación entre paneles de 14–20 px.
- Cuadrícula principal de dos columnas cuando la visualización lo permite; una columna en anchos menores a 820 px.

El módulo 24 es un laboratorio integrado y utiliza una cuadrícula de 12 columnas y tarjetas de dashboard. Esa diferencia es funcional y puede conservarse; debe seguir usando los mismos tokens, tipografías, controles, estados de foco y comportamiento responsive.

## 4. Interacción y accesibilidad

- Estados `:focus-visible` visibles para teclado.
- Controles con etiquetas comprensibles y valores/unidades explícitos.
- No depender exclusivamente del color para explicar resultados.
- Respetar `prefers-reduced-motion` en animaciones.
- Mantener contraste suficiente en los dos temas.
- En móvil: evitar desbordamiento horizontal, conservar áreas táctiles y respetar `safe-area-inset`.
- Canvas y SVG deben conservar proporción y escalar al ancho disponible.

## 5. Reglas de consistencia

1. No introducir una tercera familia tipográfica sin una razón pedagógica concreta.
2. No redefinir colores semánticos localmente si existe un token equivalente.
3. No reducir la tipografía para hacer caber un panel; reorganizar la cuadrícula.
4. Mantener controles y componentes con estados visuales equivalentes.
5. La visualización científica puede ser distinta entre módulos; la interfaz que la rodea debe sentirse parte de la misma plataforma.
6. Cualquier cambio compartido debe probarse en móvil, escritorio, tema claro y oscuro.

## 6. Alcance y límites de esta auditoría

Este estándar se construyó inspeccionando el HTML/CSS versionado de los 24 módulos, el generador `tools/build_index.py` y la interfaz `web/index.html`. Es una auditoría estática del código, no una certificación visual en navegadores ni una validación clínica. Las diferencias identificadas deben confirmarse con pruebas visuales reales antes de hacer cambios masivos.

## 7. Comprobación automática

Ejecutar desde la raíz:

```bash
python3 tools/audit_design.py
```

El script informa por módulo si detecta las familias tipográficas esperadas, el tamaño base, el soporte de tema oscuro, el layout responsive, el foco visible y el respeto a movimiento reducido. Los avisos son señales para revisión, no errores definitivos: algunas páginas pueden resolver un criterio de otra manera.
