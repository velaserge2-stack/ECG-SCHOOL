# Hematología (módulos 34–39): verificación

Los modelos son educativos y semicuantitativos. La **dirección** de cada efecto es la descrita en la teoría;
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

## Preajuste → esperado → obtenido (modelo)

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

| Escenario | Esperado | Obtenido |
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

## Casos cascada (dificultad extrema)

La pestaña «Casos cascada» del Banco Hemato tiene una lista de casos. Cada caso guarda su progreso
por separado: el caso 1 conserva la clave anterior y el caso 2 usa `cascada2`. Al terminar un caso,
el resultado se guarda con su número de caso.

### Caso 1 · «Don Ramiro y la sangre espesa»

Hombre de 58 años, fumador con EPOC, que vive en altura. Son 44 preguntas en 6 actos:

1. La sangre espesa: eritrocitosis secundaria, EPO, curva de O₂, viscosidad y cor pulmonale.
2. El trombo: IAM inferior, potencial de acción, bloqueo AV y gasto cardiaco.
3. Anticoagulado y sangrando: fármacos y respuesta hemodinámica a la hemorragia.
4. La bolsa equivocada: reacción ABO, hemólisis, bilirrubina e hiperpotasemia.
5. La fiebre: inmunidad, choque, curva y hepcidina.
6. El mapa completo: integración.

Notas (ampliaciones):
- el oxímetro de pulso no detecta la carboxihemoglobina;
- la coronaria derecha suele irrigar el nodo AV;
- la orina roja de la hemólisis es hemoglobinuria;
- en el infarto del ventrículo derecho se evitan los nitratos.

### Caso 2 · «Lucía, Mateo y el anticuerpo que recordó»

Madre O Rh negativo sensibilizada en un primer parto sin inmunoglobulina anti-D, y su hijo A Rh
positivo. Son 46 preguntas en 6 actos:

1. **La memoria del primer parto:**
   - anti-D no natural; IgM frente a IgG;
   - memoria B y refuerzos de vacunas;
   - inmunidad pasiva frente a activa;
   - Coombs indirecto e hipersensibilidad tipo II;
   - herencia ABO y Rh por genotipo.
2. **El feto que se rompe:**
   - Coombs directo;
   - hematopoyesis en el hígado fetal, EPO y eritroblastos;
   - HbF;
   - circulación de alto gasto y edema por fuerzas de Starling;
   - bilirrubina que pasa por la placenta.
3. **Las primeras 24 horas:**
   - ictericia patológica y ausencia de coluria;
   - albúmina y kernícterus;
   - fototerapia;
   - elección de sangre O Rh− para la exanguinotransfusión;
   - hierro en la hemólisis.
4. **El corazón durante el recambio:**
   - el citrato baja el Ca²⁺ y alarga la meseta y el QT;
   - el K⁺ de la sangre almacenada y la secuencia del ECG en la hiperpotasemia;
   - la acidosis que agrava el K⁺; efecto Bohr;
   - el gasto del recién nacido depende de la FC.
5. **La pierna de la madre:**
   - Hb tras la hemorragia; tríada de Virchow;
   - bomba muscular y válvulas venosas;
   - edema por presión hidrostática;
   - dímero-D;
   - tromboembolia pulmonar: poscarga del VD, interdependencia ventricular, V/Q y ECG.
6. **Dos meses después:**
   - heparina y antitrombina;
   - traslape de warfarina (proteína C);
   - anemia tardía arregenerativa por menos EPO con HbA transfundida;
   - anticuerpos pasivos y vacunas;
   - riesgo en el siguiente embarazo;
   - integración.

Notas (ampliaciones), todas señaladas en su explicación:
- el mecanismo de la inmunoglobulina anti-D;
- el nombre «eritroblastosis fetal»;
- el Doppler fetal;
- la hidropesía (albúmina baja y falla de alto gasto);
- el paso de la bilirrubina por la placenta;
- la bilirrubina libre;
- el anti-A IgG de la madre O;
- el citrato y el calcio;
- el K⁺ de la sangre almacenada;
- el intercambio de H⁺ y K⁺;
- la dependencia de la FC en el neonato;
- la hipercoagulabilidad del puerperio;
- el desajuste V/Q;
- el patrón de sobrecarga derecha en el ECG;
- la proteína C con warfarina.

Puntos marcados **VERIFICAR**:
- la hidropesía;
- la anemia tardía tras el recambio;
- la interferencia de los anticuerpos pasivos con vacunas de virus vivos (depende del esquema vigente).

### Pruebas

- **Caso 1 (sin cambios, sigue funcionando):** reanuda en la pregunta 21; resumen 22/44 con 12
  sistemas.
- **Caso 2 completo:**
  - el avance del caso 1 se conserva al cambiar de caso;
  - recarga en la pregunta 24;
  - resumen 30/46 con 14 sistemas;
  - mapa de 46 eslabones;
  - resultado `h:cascada-c2-…`.
- **Móvil:** sin desplazamiento horizontal ni errores en consola.
- **Longitud de las opciones:** la correcta es claramente la más larga en 2 de 44 preguntas (caso 1)
  y en 2 de 46 (caso 2).

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

## Decisiones de diseño

- **Notas de seguridad**, señaladas como «nota»: los oxímetros de pulso convencionales
  no distinguen la carboxihemoglobina; la carboxihemoglobina se confirma midiéndola; la anemia
  perniciosa como ejemplo de falta de factor intrínseco; las menstruaciones abundantes en la enfermedad
  de von Willebrand; el dímero-D también sube en otras situaciones con formación de fibrina; la
  talasemia se confirma con estudio de hemoglobinas.
- **Hepatopatía vs déficit de vitamina K**: se distinguen por el factor V. Es una deducción (el hígado sintetiza la mayoría de los factores; la vitamina K solo actúa sobre
  II, VII, IX y X).
- **Hipersensibilidad tipo II**: se usan la transfusión incompatible y la EHRN como ejemplos (nota); no se dan ejemplos para los tipos III y IV y el módulo lo dice.
- **Metahemoglobina**: el modelo solo le resta capacidad; no simula su efecto sobre la descarga de los
  hemos restantes (está en «Simplificaciones»).
- **Anemia sideroblástica**: no se incluye.
- **Banco Hemato** con espacio de nombres `h:` en IndexedDB. El Banco Cardio quedó con prefijo vacío, así
  que sus datos guardados no cambian. Se generó desde el 33 con `tools/build_bank_hemato.py` para no
  duplicar el motor.
- **Filtro «Sólo con trazo»**: en el Banco Hemato se quitó de la interfaz; queda un checkbox oculto e
  inerte para no tocar la lógica compartida con el Banco Cardio.
