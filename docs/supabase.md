# Acceso con Supabase: solo correos autorizados

La versión publicable vive en `web/`:

| Archivo | Qué hace |
|---|---|
| `web/login.html` | Iniciar sesión, crear cuenta y recuperar contraseña. |
| `web/index.html` | Portada y menú. **No contiene los simuladores**: cada módulo se descarga del bucket privado `modulos` solo si hay sesión y el correo está autorizado. Se genera con `python3 tools/build_index.py .` |
| `web/config.js` | URL y anon key públicas de tu proyecto. |
| `supabase/setup.sql` | Lista de correos, hook que rechaza registros, bucket privado y su política. |
| `tools/upload_modules.mjs` | Sube `modulos/*.html` al bucket (con la clave service_role, solo en tu computadora). |

## Cómo se bloquea el acceso (tres capas, todas en Supabase)

1. **Registro:** el hook *Before User Created* rechaza cualquier correo que no esté en `public.allowed_emails`. Nadie de fuera puede crear cuenta.
2. **Contenido:** el bucket `modulos` es privado; su política solo deja descargar a usuarios con sesión cuyo correo está en la lista (`public.is_allowed()`). Sin acceso, el navegador no recibe el código de los simuladores.
3. **Página:** al entrar, `web/index.html` vuelve a llamar a `is_allowed()`; si el correo ya no está en la lista, cierra la sesión y regresa al login.

Quitar un correo de la lista corta su acceso de inmediato, aunque ya tenga cuenta.

## Pasos de configuración

1. **SQL.** Supabase → *SQL Editor* → pega `supabase/setup.sql` → *Run*.
2. **Correos permitidos.** En el mismo editor:
   ```sql
   insert into public.allowed_emails (email, note) values
     ('tu-correo@ejemplo.com', 'administrador')
   on conflict (email) do nothing;
   ```
   También puedes agregarlos en *Table Editor → allowed_emails*. Escríbelos en minúsculas.
3. **Hook.** *Authentication → Hooks* → *Before User Created* → tipo *Postgres* → función `public.hook_before_user_created` → activar.
4. **URLs.** *Authentication → URL Configuration*: pon en *Site URL* la dirección pública de `web/` y agrega en *Redirect URLs* la de `web/index.html` y la de `web/login.html` (las usan la confirmación de correo y la recuperación de contraseña).
5. **Claves públicas.** Edita `web/config.js` con *Project URL* y la clave *anon/publishable* (*Project Settings → API*). Nunca pongas ahí la service_role.
6. **Subir los módulos** (cada vez que cambies alguno):
   ```bash
   SUPABASE_URL=https://TU-PROYECTO.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=tu-clave-secreta \
   node tools/upload_modules.mjs
   ```
   Alternativa: *Storage → modulos → Upload* y arrastra los archivos de `modulos/` (deben conservar su nombre, p. ej. `01_camara_cardiaca.html`).
7. **Publicar solo `web/`.** En Vercel o Netlify, usa `web` como carpeta raíz (*Root Directory* / *Publish directory*).

## Importante para que el bloqueo sea real

- Publica **solo la carpeta `web/`**. El `index.html` de la raíz y la carpeta `modulos/` contienen los simuladores completos: si se publican (p. ej. GitHub Pages desde la raíz), cualquiera los ve sin login.
- Si el repositorio de GitHub es **público**, cualquiera puede leer `modulos/` ahí mismo. Para proteger el contenido, hazlo **privado** (*Settings → General → Danger Zone → Change visibility*).
- La portada de `web/index.html` sí incluye títulos y descripciones breves de los módulos (se ocultan hasta validar la sesión, pero están en el HTML). Los simuladores no.
- Con la confirmación de correo activada (opción por defecto), tras registrarse el usuario debe abrir el enlace del correo antes de entrar.
