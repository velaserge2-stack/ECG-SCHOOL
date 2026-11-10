# App instalable, progreso local y repaso con FSRS

Este documento describe tres piezas de ECG School: la instalación como app (PWA), el
guardado del progreso en el navegador (IndexedDB) y el repaso espaciado de las flashcards
del Banco Cardio (FSRS).

## 1. App instalable (PWA)

Archivos en `web/` (la carpeta que se publica en Vercel):

| Archivo | Para qué sirve |
|---|---|
| `manifest.webmanifest` | Nombre, colores, `display: standalone`, orientación libre e íconos. |
| `sw.js` | Service worker: guarda el marco para abrir sin conexión y los módulos ya visitados. |
| `icons/` | Ícono maestro `icon.svg` y PNG: 180/167/152/120 (Apple), 192/512 (normal y *maskable*), 32 (favicon). |
| `vercel.json` | Encabezados: `sw.js` y el manifest sin caché, tipo MIME del manifest. |
| `lib/ecg-db.js` | Copia de `lib/ecg-db.js` para el marco (la sincroniza `tools/inline_libs.py`). |

Las etiquetas de iOS (`apple-mobile-web-app-*`, `apple-touch-icon`) y el registro del service
worker se generan en `web/index.html` desde `tools/build_index.py`; `web/login.html` las tiene
escritas a mano.

**Anuncio de instalación.** Aparece como hoja inferior sólo en Inicio, a los 8 s (o al volver
de un módulo), nunca encima de un módulo.
- iPhone/iPad: muestra los tres pasos de Safari (Compartir → «Agregar a pantalla de inicio» →
  «Agregar»). En Chrome/Firefox de iOS indica usar su botón Compartir o abrir en Safari.
- Android/Chrome/Edge: usa el instalador nativo (`beforeinstallprompt`) con un botón «Instalar».
- No aparece si la app ya corre instalada (`display-mode: standalone` o `navigator.standalone`).
- «×» lo oculta 30 días; «Ahora no», 7 días (`localStorage: ecg-install-until`).

**Sin conexión.** Cuando el correo se verifica con conexión, se recuerda 30 días
(`localStorage: ecg-allowed-v1`). Sin internet, la app entra con esa verificación y abre los
módulos ya visitados desde la caché del service worker. «Salir» borra la verificación y la
caché de módulos. Las respuestas de `/auth/v1` y `/rest/v1` nunca se guardan.

**Al publicar cambios del marco**, sube `VERSION` en `web/sw.js` para que los dispositivos
renueven la caché.

## 2. Progreso local (IndexedDB)

`lib/ecg-db.js` expone `window.ECGDB`. Base `ecg-school`, versión de esquema 1:

| Almacén | Clave | Contenido |
|---|---|---|
| `meta` | `key` | Ajustes de FSRS, lista del mazo, banderas de migración. |
| `answers` | `qid` | Última respuesta por pregunta (opción, correcta, fecha). |
| `attempts` | `qid\|ts` | Historial de intentos: tema, nivel, opción, tiempo, origen (práctica/simulacro). |
| `sessions` | `id` | Estado reanudable: filtros y pregunta actual, simulacro en curso, vista, mazo. |
| `results` | `id` | Simulacros terminados (calificación, tiempo, aciertos por tema). |
| `cards` | `cid` | Estado FSRS de cada flashcard (o suspendida). |
| `reviews` | `cid\|ts` | Historial de repasos de flashcards. |

- **Identificadores estables.** `qid`/`cid` son un hash del contenido (tema, enunciado, opciones,
  trazo / categoría, frente, reverso). Agregar o reordenar preguntas no mezcla historiales.
  Si se corrige el texto de una pregunta, cuenta como pregunta nueva.
- **Guardado automático.** Cada respuesta y cada repaso se escriben en una transacción en el
  momento. Los estados de vista se agrupan (250 ms) y se vacían al ocultar o cerrar la página.
- **Migraciones.** Para cambiar el esquema, sube `VERSION` y agrega `MIGRATIONS[n]`. Otra pestaña
  abierta con la versión anterior cierra su conexión sola para no bloquear la actualización.
- **Migración inicial.** Lo que el banco guardaba antes en `localStorage` (`bancoCardio.v1`) se
  copia una sola vez a IndexedDB; el original no se borra.
- **Errores.** Si IndexedDB no está disponible (algunos modos privados), se usa memoria más
  `localStorage` como respaldo y el banco muestra un aviso para exportar.
- **Persistencia.** Se pide `navigator.storage.persist()`; el panel Progreso indica si se concedió.

**Dos bancos, un almacén.** El Banco Cardio (33) y el Banco Hemato (39) comparten la base `ecg-school`, pero cada uno usa un espacio de nombres: el Cardio no lleva prefijo (sus claves de siempre, sin migración) y el Hemato antepone `h:` a todo (`h:q-…`, `h:f-…`, `h:practica`, `h:srs-settings`, `h:deck`). Cada banco lee, cuenta y borra solo lo suyo (`ECGDB.belongs`), y `ECGDB.summary(now, ns)` calcula los pendientes por banco; el menú del índice los suma. El 39 se genera a partir del 33 con `tools/build_bank_hemato.py`.

**Respaldo** (Banco Cardio o Banco Hemato › Progreso; el archivo incluye el progreso de ambos bancos): «Exportar» descarga un JSON (`format:
ecg-school-backup`); en iPhone abre el menú Compartir para guardarlo en Archivos. «Importar»
combina sin borrar nada: los historiales se agregan sin duplicar, y en respuestas, tarjetas y
sesiones gana el registro más reciente. Importar el mismo archivo dos veces no cambia nada.

**Límites que conviene saber.**
- El progreso vive en ese navegador y ese dispositivo: no se sincroniza ni depende de la cuenta.
  Si dos personas comparten navegador, comparten progreso.
- En iPhone/iPad, la app instalada y Safari tienen almacenamiento separado: el progreso hecho en
  Safari no aparece en la app (se pasa con un respaldo).
- Safari puede borrar los datos de sitios **no instalados** tras 7 días sin visitarlos; la app
  instalada en la pantalla de inicio no tiene ese límite. Instalarla es la forma más segura.
- Si el usuario borra los datos del sitio, o el sistema libera espacio, el progreso se pierde;
  sólo un respaldo exportado lo recupera.

## 3. Flashcards como Anki (pestaña «Flashcards»)

Desde noviembre de 2026 la pestaña «Flashcards» funciona como Anki. Sustituye a la antigua vista
de «voltear y marcar La sé» y a la pestaña «Repaso». Los enlaces viejos a `#repaso` abren
«Flashcards». El progreso FSRS que ya existía se conserva.

Los intervalos los calcula la biblioteca oficial **ts-fsrs 5.4.2** (FSRS-6, 21 parámetros,
licencia MIT). Está copiada sin modificar en `lib/ts-fsrs.umd.js` y se incrusta en los bancos con
`tools/inline_libs.py`. La biblioteca maneja los pasos de aprendizaje igual que Anki con FSRS.

### Pantallas

1. **Mazos.** El banco es el mazo padre y cada categoría es un submazo, en orden alfabético.
   Cada mazo muestra sus contadores: Nuevas en azul, Aprender en rojo y Repasar en verde.
   Debajo se lee: «Hoy estudiaste N tarjetas en X min».
2. **Vista general.** Muestra los contadores del mazo y el botón «Estudiar ahora».
   - Cuando no queda nada aparece «¡Felicidades! Has terminado este mazo por ahora». También avisa
     de las tarjetas en aprendizaje que vencen más tarde, del límite de nuevas alcanzado y de las
     tarjetas enterradas o suspendidas.
   - «Estudio personalizado» sube, solo por hoy, los límites de nuevas y de repasos de ese mazo.
3. **Estudio.**
   - Se ve el frente de la tarjeta. Al pulsar «Mostrar respuesta», el reverso aparece debajo de
     una línea y el frente sigue visible.
   - Hay cuatro botones: Otra vez, Difícil, Bien y Fácil. Sobre cada uno se ve el intervalo.
   - Abajo aparece el contador `nuevas + aprendiendo + repaso`. Está subrayada la cola de la que
     viene la tarjeta actual.
4. **Explorar.** Busca en las tarjetas y filtra por mazo y estado (nuevas, aprendiendo, de repaso,
   vencen hoy, suspendidas, enterradas, sanguijuelas). Muestra la fecha de vencimiento, el
   intervalo y los olvidos. Permite suspender o reactivar una tarjeta, y «Olvidar» para volverla
   nueva.
5. **Opciones.** Es un preajuste compartido por todos los mazos.

### Reglas del planificador (las del planificador v3 de Anki)

- **Orden de la cola.**
  1. Aprendizaje intradía vencido.
  2. Repasos y aprendizaje interdía mezclados por fecha. Las nuevas se reparten de forma pareja
     entre ellos («mezclar con repasos»). Las nuevas se toman en el orden en que se agregaron,
     submazo por submazo.
  3. Si no queda nada más, las tarjetas en aprendizaje que vencen en los próximos 20 minutos.
- **Límites diarios.**
  - Cada mazo tiene sus propios límites. Al estudiar el mazo padre se aplican el límite del padre
    y el de cada submazo. Al estudiar un submazo solo cuenta el suyo.
  - Las nuevas también cuentan contra el límite de repasos.
- **Día de estudio.** Cambia a las 4:00.
- **Tiempo por tarjeta.** Se registra con un máximo de 60 s, como en Anki.

### Atajos de teclado

| Tecla | Acción |
|---|---|
| Espacio o Intro | Mostrar respuesta; con la respuesta visible, «Bien» |
| 1–4 | Calificar |
| Z o Ctrl+Z | Deshacer, en varios niveles: vuelve a mostrar la tarjeta por el frente |
| − | Enterrar hasta mañana |
| @ | Suspender |
| Esc | Volver a la vista general |
| S | Estudiar desde la vista general |

### Sanguijuelas

Al llegar a 8 olvidos, y después cada 4 olvidos más, la tarjeta se marca como sanguijuela y
aparece un aviso. Solo se marca: no se suspende.

### Valores predeterminados

Son los de Anki. «Restaurar valores de Anki» los vuelve a cargar. Si alguien ya había guardado
sus propios ajustes, esos se respetan.

| Ajuste | Valor |
|---|---|
| Nuevas por día | 20 |
| Máximo de repasos por día | 200 |
| Pasos de aprendizaje | `1m 10m` |
| Pasos de reaprendizaje | `10m` |
| Retención deseada | 90 % |
| Intervalo máximo | 36 500 d |
| Umbral de sanguijuela | 8 |
| Aprendizaje anticipado | 20 min |
| Variación aleatoria de intervalos | activada |

### Contador del menú

`ECGDB.summary()` cuenta igual que el mazo padre:
- respeta el límite de repasos;
- excluye las tarjetas enterradas;
- incluye el estudio personalizado del mazo padre.

### Diferencias conocidas con Anki

- No hay editor de tarjetas: el contenido viene del banco.
- No hay hermanas que enterrar, porque cada tarjeta es una nota.
- No se pueden crear preajustes distintos por mazo.
- No se optimizan los parámetros FSRS con el historial propio: se usan los predeterminados de
  FSRS-6.

## Comandos

```bash
python3 tools/inline_libs.py .     # incrusta lib/*.js en los módulos y copia lib/ a web/lib
python3 tools/build_index.py .     # regenera index.html y web/index.html
```
