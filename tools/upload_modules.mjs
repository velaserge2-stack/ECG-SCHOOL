// Sube los módulos de modulos/ al bucket privado de Supabase Storage (sobrescribe si ya existen).
//
// Uso (Node 18 o superior, sin dependencias):
//   SUPABASE_URL=https://TU-PROYECTO.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=... \
//   node tools/upload_modules.mjs
//
// La clave service_role es SECRETA: úsala solo en tu computadora, nunca en web/ ni en el repositorio.
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const bucket = process.env.SUPABASE_BUCKET || 'modulos';
if (!url || !key) {
  console.error('Faltan SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'modulos');
const files = (await readdir(dir)).filter((f) => f.endsWith('.html')).sort();
let fail = 0;
for (const f of files) {
  const body = await readFile(join(dir, f));
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${encodeURIComponent(f)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'text/html; charset=utf-8',
      'x-upsert': 'true',
      'Cache-Control': 'no-cache',
    },
    body,
  });
  if (res.ok) console.log('✓', f);
  else { fail++; console.error('✗', f, res.status, await res.text()); }
}
console.log(`${files.length - fail} de ${files.length} módulos subidos a «${bucket}».`);
process.exit(fail ? 1 : 0);
