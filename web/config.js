/* Configuración pública de Supabase para la versión web de ECG School.
 *
 * Copia aquí los valores de tu proyecto (Supabase → Project Settings → API):
 *   - supabaseUrl:     "Project URL", p. ej. https://abcd1234.supabase.co
 *   - supabaseAnonKey: la clave "anon" / "publishable". Es pública por diseño:
 *                      la seguridad la ponen las políticas RLS y el hook del SQL.
 *
 * NUNCA pongas aquí la clave service_role / secret.
 */
window.ECG_CONFIG = {
  supabaseUrl: 'https://TU-PROYECTO.supabase.co',
  supabaseAnonKey: 'TU-ANON-KEY',
  bucket: 'modulos'
};
