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
  supabaseUrl: 'https://jusoxfzkucjmeiygjcuq.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1c294ZnprdWNqbWVpeWdqY3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNzE0NjAsImV4cCI6MjEwOTY0NzQ2MH0.Wy2uyfE5gCmJCnCYZsFpz56JOw0WFJhVTs8A2brQahs',
  bucket: 'modulos'
};
