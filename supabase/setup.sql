-- ECG School · acceso solo para correos autorizados
-- Pega este archivo completo en Supabase → SQL Editor y ejecútalo (se puede re-ejecutar).
-- Después activa el hook (paso 3, ver docs/supabase.md) y agrega los correos permitidos.

-- 1. Lista de correos permitidos --------------------------------------------------------
create table if not exists public.allowed_emails (
  email      text primary key check (email = lower(btrim(email)) and position('@' in email) > 1),
  note       text,
  created_at timestamptz not null default now()
);
alter table public.allowed_emails enable row level security;
-- Sin políticas: nadie la lee ni la escribe desde la página. Se administra en el panel
-- (Table Editor) o con SQL; las funciones de abajo la consultan como security definer.
revoke all on public.allowed_emails from anon, authenticated;

-- 2. ¿El usuario con sesión está autorizado? ----------------------------------------------
-- La usa la política de Storage y la página (rpc 'is_allowed'). Si quitas un correo de la
-- lista, ese usuario pierde el acceso de inmediato aunque ya tenga cuenta.
create or replace function public.is_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.allowed_emails a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_allowed() from public, anon;
grant execute on function public.is_allowed() to authenticated;

-- 3. Hook "Before User Created": rechaza el registro de correos que no estén en la lista --
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  e text := lower(btrim(coalesce(event -> 'user' ->> 'email', '')));
begin
  if e <> '' and exists (select 1 from public.allowed_emails where email = e) then
    return '{}'::jsonb;  -- permitido
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'Este correo no está autorizado para registrarse en ECG School.'
  ));
end;
$$;
revoke all on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;

-- 4. Bucket privado con los módulos -------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('modulos', 'modulos', false)
on conflict (id) do update set public = false;

drop policy if exists "modulos: lectura solo para correos autorizados" on storage.objects;
create policy "modulos: lectura solo para correos autorizados"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'modulos' and public.is_allowed());
-- No hay políticas de insert/update/delete: los módulos solo se suben con la clave
-- service_role (tools/upload_modules.mjs) o desde el panel.

-- 5. Correos autorizados (edita y repite cuando quieras agregar más) ----------------------
-- insert into public.allowed_emails (email, note) values
--   ('administrador@ejemplo.com', 'administrador'),
--   ('alumno1@ejemplo.com', 'grupo A')
-- on conflict (email) do nothing;
--
-- Quitar acceso:  delete from public.allowed_emails where email = 'alumno1@ejemplo.com';
