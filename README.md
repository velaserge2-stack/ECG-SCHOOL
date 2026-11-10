# ECG School

Plataforma interactiva para **entender** el corazón (ECG y hemodinamia como un solo sistema), alineada con los objetivos de la Unidad 6 "Sistema cardiovascular" de la guía de Fisiología como referencia. Sin aval institucional.

**Todo en uno:** abre [`index.html`](index.html). Abre con una página de inicio (presentación, cómo se aprende, las perillas y el mapa de módulos) y reúne los 36 módulos en una sola página con menú lateral (agrupados en Fundamentos, ECG, Hemodinamia, Regulación, Integración fisiológica, Hematología y Práctica). Cada módulo se carga sin modificaciones dentro de su propio marco; los enlaces directos usan `index.html#m01`, `#m02`, etc.

Cada módulo también existe como archivo HTML autocontenido en `modulos/`.

## Módulos

| # | Archivo | Módulos del temario / capa | Objetivos (Unidad 6) |
|---|---------|----------------------------|----------------------|
| 1 | [Cámara cardiaca](modulos/01_camara_cardiaca.html) | A1 + A2 (MVP) | 6.46–6.55, 6.67–6.75, 6.91–6.96 |
| 2 | [Del nodo al trazo](modulos/02_del_nodo_al_trazo.html) | A3 + A4 | 6.54–6.66, 6.76–6.90 |
| 3 | [Ritmo y conducción](modulos/03_ritmo_y_conduccion.html) | A5 + A6 | 6.97–6.111 |
| 4 | [Masa y tejido](modulos/04_masa_y_tejido.html) | A7 + A8 | 6.97–6.108 |
| 5 | [Iones y lectura](modulos/05_iones_y_lectura.html) | A9 + A10 | 6.112, 6.91–6.111 |
| 6 | [Plomería del flujo](modulos/06_plomeria_del_flujo.html) | B0 | 6.150–6.190 |
| 7 | [La célula cardiaca](modulos/07_la_celula_cardiaca.html) | F2 + F3 | 6.4–6.20, 6.24–6.29 |
| 8 | [Mando y marcapasos](modulos/08_mando_y_marcapasos.html) | F4 + F5 | 6.21–6.23, 6.25–6.27, 6.30–6.45 |
| 9 | [Sangre y dipolo](modulos/09_sangre_y_dipolo.html) | F1 + A0 | 6.1–6.3, 6.115–6.119, 6.150–6.152 |
| 10 | [Ciclo de Wiggers](modulos/10_ciclo_de_wiggers.html) | B1 | 6.119–6.138 |
| 11 | [Pulso venoso](modulos/11_pulso_venoso.html) | B2 | 6.189 |
| 12 | [Asa presión–volumen](modulos/12_asa_presion_volumen.html) | B3 | 6.119–6.138 |
| 13 | [Flujo cerebral](modulos/13_flujo_cerebral.html) | D4 | 6.236–6.240 |
| 14 | [Curvas de Guyton](modulos/14_curvas_de_guyton.html) | B4 | 6.139–6.144, 6.219–6.232 (parcial) |
| 15 | [Hígado y vena porta](modulos/15_higado_y_vena_porta.html) | D7 | 6.256–6.264 |
| 16 | [Catéter derecho virtual](modulos/16_cateter_derecho_virtual.html) | B7 | capa L8; apoya 6.136 y 6.189 |
| 17 | [Arritmias y dispositivos](modulos/17_arritmias_y_dispositivos.html) | B14 | 6.109–6.111 (con A5/A6: 6.97–6.108) |
| 18 | [Calor, frío y piel](modulos/18_calor_frio_y_piel.html) | D8 | 6.265–6.271 |
| 19 | [Pericardio, tres formas](modulos/19_pericardio_tres_formas.html) | B11 | apoyo a 6.145–6.149 y 6.189 (VERIFICAR) |
| 20 | [Flujo coronario](modulos/20_flujo_coronario.html) | D5 (complementa B13) | 6.241–6.252 |
| 21 | [Lazo del barorreflejo](modulos/21_lazo_del_barorreflejo.html) | D2 | 6.219–6.232 |
| 22 | [Vasos y presión](modulos/22_vasos_y_presion.html) | B17 | 6.150–6.168, 6.174–6.190 |
| 23 | [Valvulopatías en el ciclo cardiaco](modulos/23_valvulopatias_en_el_ciclo_cardiaco.html) | B9 | 6.124, 6.145–6.149 |
| 24 | [Modelo integrado L2–L8](modulos/24_modelo_integrado_l2_l8.html) | L2–L8: tejido, señal, excitación–contracción, hemodinamia, control, sincronía y medición; escenario C2 (elevación pasiva de piernas) | Laboratorio transversal simplificado; C2 es una primera implementación y la cobertura curricular fina sigue pendiente |
| 25 | [Microcirculación y fuerzas de Starling](modulos/25_microcirculacion_y_fuerzas_de_starling.html) | B18 | 6.191–6.198 |
| 26 | [Edema y sistema linfático](modulos/26_edema_y_sistema_linfatico.html) | B19 | 6.198, 6.204–6.211 |
| 27 | [Regulación local y humoral](modulos/27_regulacion_local_y_humoral.html) | D1 + D3 | 6.212–6.218, 6.233–6.235 |
| 28 | [Las perillas del corazón](modulos/28_las_perillas_del_corazon.html) | B3 + F5 | 6.42–6.44, 6.136–6.144 |
| 32 | [Ruidos cardiacos y soplos](modulos/32_ruidos_cardiacos_y_soplos.html) | B16 | 6.120–6.124, 6.145–6.149, 6.169–6.173 |
| 33 | [Banco Cardio](modulos/33_banco_cardio.html) | Práctica y evaluación | 378 preguntas tipo examen (42 con trazo de ECG), incluidos 134 casos clínicos de hemodinamia y bases moleculares; simulacro reanudable, 112 flashcards con repaso espaciado FSRS y panel de progreso con respaldo |
| 34 | [Hemoglobina y transporte de oxígeno](modulos/34_hemoglobina_y_transporte_de_oxigeno.html) | H1 · Hematología | Guía de Hematología §1–3, §4.1: curva de disociación, PaO₂/saturación/contenido, CO, MetHb, mioglobina, HbF, CO₂ |
| 35 | [Vida del eritrocito, hierro y bilirrubina](modulos/35_vida_del_eritrocito_hierro_y_bilirrubina.html) | H2 · Hematología | §2, §4.2–4.4, §5, §7: bilirrubina e ictericias, EPO, hepcidina, G6PD, esferocitosis, ictericia neonatal |
| 36 | [Biometría y anemias](modulos/36_biometria_y_anemias.html) | H3 · Hematología | §6, §8, §9: índices, reticulocitos, árbol diagnóstico, hierro, B12/folato, hemorragia, talasemias |
| 37 | [Hemostasia y coagulación](modulos/37_hemostasia_y_coagulacion.html) | H4 · Hematología | §12–13: cascada con TP/INR, TTPa y TT, plaquetas y fármacos, Virchow, diátesis |
| 38 | [Inmunidad y grupos sanguíneos](modulos/38_inmunidad_y_grupos_sanguineos.html) | H5 · Hematología | §10–11: respuesta inmune, complemento, hipersensibilidad, ABO/Rh, pruebas cruzadas, herencia, EHRN |
| 39 | [Banco Hemato](modulos/39_banco_hemato.html) | Práctica y evaluación | 245 preguntas de hematología (≈ 39 % casos clínicos) y 140 flashcards con repaso FSRS; progreso separado del Banco Cardio |

El módulo 24 es un laboratorio de integración fisiológica que conecta las capas L2–L8 en un mismo estado de simulación. Un cursor animado recorre un latido (con pausa, cámara lenta y desplazamiento manual) sincronizado en el mapa de activación, el ECG, el calcio, las presiones, el asa P–V y la línea temporal; los eventos mecánicos (S1, eyección, S2, apertura mitral) salen de la simulación. Tiene escenarios guiados con referencia basal superpuesta, retos de predicción cuya respuesta calcula el propio modelo y una gráfica de los dos relojes de compensación basada en la PAM con y sin barorreflejo. Incluye el escenario C2 de elevación pasiva de piernas, con comparación contra el estado basal y un desplazamiento venoso aproximado de 300 mL. Es una implementación educativa simplificada: no representa por separado los reservorios de piernas y abdomen ni la cinética completa de la maniobra, y no es un simulador clínico validado. Sus supuestos, rangos y ecuaciones requieren pruebas numéricas y revisión por especialistas.

Para regenerar los módulos de Hematología desde sus fuentes (`src/hemato/`): `python3 tools/mkmod.py src/hemato` y `python3 tools/build_bank_hemato.py .` (el Banco Hemato se genera a partir del Banco Cardio, así que hereda sus mejoras).

Para regenerar `index.html` tras añadir o cambiar módulos: `python3 tools/build_index.py .` (el orden y los grupos del menú están al inicio del script).

## App instalable y progreso guardado

La versión web se instala en la pantalla de inicio del iPhone o Android como app (PWA) y funciona sin conexión con los módulos ya visitados. El Banco Cardio guarda solo, en el navegador (IndexedDB), cada respuesta, el historial de intentos, los simulacros y el estado de cada flashcard, y repasa las tarjetas con FSRS (la biblioteca oficial ts-fsrs). Desde su pestaña «Progreso» se ve la racha, la retención y el calendario de repasos, y se puede exportar o importar un respaldo. Detalles y límites en [`docs/pwa-y-progreso.md`](docs/pwa-y-progreso.md).

Si cambias algo en `lib/`, ejecuta `python3 tools/inline_libs.py .` antes de `tools/build_index.py`.

## Versión web con acceso (Supabase)

La carpeta [`web/`](web/) es la versión publicable: tiene página de login y registro, solo admite los correos de una lista en Supabase, y los simuladores se descargan de un bucket privado únicamente con una sesión autorizada. Configuración paso a paso en [`docs/supabase.md`](docs/supabase.md).

Para que el bloqueo sea real, publica solo `web/` (el `index.html` de la raíz y `modulos/` contienen los simuladores completos) y mantén el repositorio privado.

## Aviso

Contenido educativo. No sirve para tomar decisiones clínicas en pacientes reales. Las cifras marcadas VERIFICAR deben confirmarse con el libro del curso.
