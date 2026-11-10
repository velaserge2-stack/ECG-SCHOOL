# Hematología (módulos 34–39): verificación

Fuente única: *Guía de Hematología — versión reconstruida* (apuntes del Dr. Alejandro Leal).
Los modelos son educativos y semicuantitativos. La **dirección** de cada efecto viene de la guía;
las **magnitudes** son ilustrativas y están marcadas VERIFICAR en cada módulo.

## Pruebas automáticas realizadas

- Cada módulo (34–39) abierto en Chromium headless a 1280 px (claro) y 360 px (oscuro): sin errores
  en consola, sin desplazamiento horizontal, todos los preajustes, retos y casos ejecutados, y los
  gráficos se redibujan al cambiar el tamaño.
- Los 36 módulos cargan sin errores dentro del índice unificado.
- Banco Hemato: 245 preguntas con ≥ 4 opciones únicas y explicación, sin enunciados duplicados; 140
  flashcards con categoría válida; las 25 tarjetas del mini-repaso de los módulos 34–38 existen idénticas
  en el banco.
- IndexedDB: el Banco Hemato guarda respuestas, reanuda el simulacro y repasa con FSRS en su espacio de
  nombres `h:`; tras usarlo, el progreso del Banco Cardio queda idéntico (verificado).

## Preajuste → esperado (guía) → obtenido (modelo)

### Módulo 34 · curva de disociación (P50 basal 26,8 mmHg)

| Preajuste | Esperado | Obtenido |
|---|---|---|
| Músculo en ejercicio | Curva a la derecha, más descarga | P50 37,7; descarga 325 % de lo normal |
| Anemia | PaO₂ y saturación normales, contenido bajo; ↑2,3-DPG | Sat 96 %, CaO₂ 10,5 (normal 19,7); P50 30,1 |
| Intoxicación por CO | PaO₂ normal; contenido y liberación bajos; curva a la izquierda | PaO₂ 95; CaO₂ 12,8; descarga 52 %; P50 21,6 |
| Metahemoglobinemia | PaO₂ normal, contenido bajo | PaO₂ 95; CaO₂ 12,9 |
| Gran altitud | PaO₂ baja; saturación aún en la meseta alta | PaO₂ 55; Sat 88 % |
| Alcalosis + frío | Curva a la izquierda | P50 19,1 |
| Sangre fetal (HbF) | Curva a la izquierda | P50 19,3 |

### Módulo 35 · bilirrubina, EPO y hierro

| Preajuste | Esperado | Obtenido |
|---|---|---|
| Hemólisis | Predomina indirecta, sin coluria ni acolia, urobilinógeno urinario ↑ | BI 2,4×, BD sin cambio, sin coluria, heces normales/oscuras, urobilinógeno 3× → «prehepática» |
| Hepatitis | Ambas ↑, coluria posible, heces hipocólicas | BI 1,25×, BD ↑, coluria, urobilinógeno 1,9× → «hepática» |
| Coledocolitiasis | Directa ↑, coluria, acolia, urobilinógeno urinario ↓ | BD ↑, coluria, acolia, urobilinógeno 0,15× → «posthepática» |
| Detective (300 casos aleatorios) | Clasificación = causa | 0 discrepancias |
| Insuficiencia renal | EPO baja, anemia | EPO 0,51×, Hb 11,7 |
| Policitemia vera | EPO baja con Hb alta | EPO 0,34×, Hb 21,7 |
| Eritrocitosis secundaria | EPO alta con Hb alta | EPO 1,22×, Hb 16,3 |
| Ferropenia | Hierro ↓, ferritina ↓, saturación ↓, TIBC ↑ | 0,38× / 0,20× / 0,22× / 1,76× |
| Inflamación | Hierro ↓ con ferritina ↑ | 0,36× con ferritina 2,2× |

### Módulo 36 · biometría y anemias

| Preajuste / caso | Esperado | Obtenido |
|---|---|---|
| Ferropénica, rasgo talasémico | Microcítica | microcítica |
| Megaloblástica | Macrocítica | macrocítica |
| Hemolítica, hemorragia (día 4) | Normocítica regenerativa | normocítica regenerativa |
| Aplásica | Normocítica arregenerativa | normocítica arregenerativa |
| Árbol diagnóstico (7 casos) | Cada ruta llega al diagnóstico del caso | 7/7 |
| Hemorragia de 30 % | Hct inicial sin cambio; baja al reponerse el plasma | 45 % → 33 % al día 2 |

### Módulo 37 · pruebas de coagulación

| Escenario | Esperado (guía) | Obtenido |
|---|---|---|
| Hemofilia A / B | TTPa ↑; TP, plaquetas y TS normales | TTPa 3,3×; resto normal |
| Enf. de von Willebrand | TS ↑; TTPa normal o ↑ según VIII | TS 1,8×; TTPa 1,36× |
| Warfarina (inicio) | TP ↑ primero | INR 1,66; TTPa 1,12× (normal) |
| Warfarina estable / déficit de vit. K | TP ↑ y, en déficits importantes, TTPa ↑ | INR 3,2; TTPa 2,4× |
| Heparina no fraccionada | TTPa y TT ↑ | TTPa 2,4×; TT 3×; INR 1,15 |
| Hepatopatía | TP ↑ (y otros); factor V bajo | INR 2,5; TTPa 2,5×; V 35 % |
| Déficit de fibrinógeno | TP, TTPa y TT ↑ | 1,97 / 1,65× / 3,25× |
| Trombocitopenia | Plaquetas ↓, coagulación normal | plaquetas ↓; TS ↑; resto normal |
| Aspirina / clopidogrel | Función ↓ con recuento y coagulación normales | TS 1,98× / 1,80×; resto normal |

### Módulo 38 · ABO, Rh y herencia

| Preajuste | Esperado | Obtenido |
|---|---|---|
| O− → AB+ (eritrocitos) | Compatible | compatible |
| B+ → A+ / A+ → O+ (eritrocitos) | Incompatible (anti-B / anti-A) | incompatible |
| O+ → O− no sensibilizado | Sin reacción inmediata; riesgo de anti-D | riesgo Rh |
| O+ → O− sensibilizado | Incompatible por anti-D | incompatible |
| Plasma AB → cualquiera / plasma O → A | Compatible / incompatible | compatible / incompatible |
| Receptores compatibles (eritrocitos) | O: 8 grupos; AB: 2 | O−/O+: 8; AB: 2 |
| Receptores compatibles (plasma) | AB: 8; O: 2 | AB: 8; O: 2 |
| AO × BO | A, B, AB y O | AB, A, B, O (25 % cada uno) |
| EHRN sin / con anti-D | Hemólisis en el 2.º / ninguna | sí / no |

## Banco Hemato: conteos reales

| Tema | Preguntas | Fácil · Media · Difícil |
|---|---|---|
| HB · Hemoglobina, curva de O₂, CO, MetHb, CO₂ | 40 | 15 · 17 · 8 |
| ER · Eritrocito, hierro, EPO, hepcidina | 35 | 13 · 12 · 10 |
| BR · Bilirrubina e ictericias | 30 | 7 · 14 · 9 |
| AN · Biometría y anemias (B12 y folato) | 48 | 12 · 21 · 15 |
| HM · Hemostasia, coagulación y fármacos | 47 | 17 · 17 · 13 |
| IN · Inmunidad e hipersensibilidad | 25 | 8 · 11 · 6 |
| GS · Grupos sanguíneos, transfusión y EHRN | 20 | 6 · 8 · 6 |
| **Total** | **245** | 32 % · 41 % · 27 % |

Casos clínicos: 95 (39 %). La opción correcta es claramente la más larga (> 8 caracteres) en 24 % de
las preguntas, cerca de lo esperable por azar con 4 opciones.

Flashcards: 140 (Hemoglobina 23, Eritrocito 16, Hierro 9, Bilirrubina 14, Anemias 15, Biometría 10,
Hemostasia 24, Fármacos 7, Inmunidad 12, Grupos sanguíneos 10).

## Caso cascada (dificultad extrema)

«Don Ramiro y la sangre espesa»: hombre de 58 años, fumador con EPOC, que vive en altura. Son 44 preguntas
encadenadas en 6 actos, y cada respuesta desbloquea el siguiente dato. Los actos y lo que cubren:

1. La sangre espesa: eritrocitosis secundaria, EPO, curva de O₂, viscosidad y cor pulmonale.
2. El trombo: IAM inferior, potencial de acción, bloqueo AV y gasto cardiaco.
3. Anticoagulado y sangrando: fármacos y respuesta hemodinámica a la hemorragia.
4. La bolsa equivocada: reacción ABO, hemólisis, bilirrubina e hiperpotasemia en el ECG.
5. La fiebre: inmunidad, choque, curva y hepcidina.
6. El mapa completo: integración de todo el caso.

Cada pregunta trae «Mecanismo» y «Conexión con la cascada». El resumen agrupa los aciertos en 12 sistemas.

- Prueba de extremo a extremo realizada:
  - el avance y la historia se acumulan por acto;
  - al recargar, el caso se reanuda en la pregunta 21;
  - el resultado se guarda como `h:cascada-…`;
  - el mapa permite repasar cada eslabón;
  - en móvil no hay desplazamiento horizontal ni errores en consola.
- La opción correcta es claramente la más larga en solo 2 de 44 preguntas.
- Notas fuera de la guía, señaladas como «nota»:
  - el oxímetro de pulso no detecta la carboxihemoglobina;
  - la coronaria derecha irriga habitualmente el nodo AV;
  - la orina roja de la hemólisis intravascular es hemoglobinuria, no coluria;
  - se evitan los nitratos en el infarto del ventrículo derecho.

## Puntos marcados VERIFICAR

- P50 basal (26,8 mmHg), exponente de Hill (2,7), constante de O₂ disuelto (0,003) y coeficientes de
  desplazamiento de la curva; P50 de la HbF (≈ 19) y de la mioglobina (≈ 2,8); PO₂ intervellosa.
- Porcentajes de cada forma de transporte de CO₂.
- Umbral de ictericia visible (≈ 2,5 × lo normal) y escala de la ictericia neonatal (sin nomograma).
- Constantes del lazo de la EPO; comportamiento de la TIBC en la inflamación.
- Supervivencia eritrocitaria en esferocitosis y G6PD (ilustrativa).
- Límites de VCM (80–100 fL) y reticulocitos (0,5–2,5 %): orientativos, dependen del laboratorio.
- Hierro normal en el rasgo talasémico (nota orientativa).
- Magnitudes de la respuesta compensatoria a la anemia.
- Intervalos de TP, TTPa y TT (se expresan como cociente/INR; dependen del reactivo).
- Riesgo relativo de la tríada de Virchow (esquemático).
- Tabla completa de compatibilidad transfusional (se deduce de la regla antígeno–anticuerpo).
- Curvas de IgM/IgG sin unidades.

## Decisiones de diseño donde la guía era ambigua

- **Notas de seguridad fuera de la guía**, señaladas como «nota»: los oxímetros de pulso convencionales
  no distinguen la carboxihemoglobina; la carboxihemoglobina se confirma midiéndola; la anemia
  perniciosa como ejemplo de falta de factor intrínseco; las menstruaciones abundantes en la enfermedad
  de von Willebrand; el dímero-D también sube en otras situaciones con formación de fibrina; la
  talasemia se confirma con estudio de hemoglobinas.
- **Hepatopatía vs déficit de vitamina K**: se distinguen por el factor V. No está escrito así en la guía,
  pero se deduce de ella (el hígado sintetiza la mayoría de los factores; la vitamina K solo actúa sobre
  II, VII, IX y X).
- **Hipersensibilidad tipo II**: se usan la transfusión incompatible y la EHRN como ejemplos (nota); la
  guía no da ejemplos para los tipos III y IV y el módulo lo dice.
- **Metahemoglobina**: el modelo solo le resta capacidad; no simula su efecto sobre la descarga de los
  hemos restantes (está en «Simplificaciones»).
- **Anemia sideroblástica**: no está en la guía y no se incluye.
- **Banco Hemato** con espacio de nombres `h:` en IndexedDB. El Banco Cardio quedó con prefijo vacío, así
  que sus datos guardados no cambian. Se generó desde el 33 con `tools/build_bank_hemato.py` para no
  duplicar el motor.
- **Filtro «Sólo con trazo»**: en el Banco Hemato se quitó de la interfaz; queda un checkbox oculto e
  inerte para no tocar la lógica compartida con el Banco Cardio.
