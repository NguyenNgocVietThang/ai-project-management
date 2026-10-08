-- Application uses its existing auth, NOT Supabase Auth. Run after all Alembic
-- migrations as database owner. App DB role must be owner/BYPASSRLS; NEVER expose it.
-- Disable Supabase Data API if not used. Defense in depth: deny anonymous and
-- authenticated Data API roles direct access to every application table.
do $$
declare t record; role_name text;
begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('revoke all on table public.%I from public', t.tablename);
    foreach role_name in array array['anon','authenticated'] loop
      if exists(select 1 from pg_roles where rolname=role_name) then
        execute format('revoke all on table public.%I from %I', t.tablename, role_name);
      end if;
    end loop;
  end loop;
end $$;

-- Create bucket in Dashboard Storage with Public OFF; adapter verifies private
-- flag before using it. No anon/authenticated storage object policy is needed:
-- only backend service-role access. Never make a bucket public to fix a403.
-- Existing MinIO objects must be copied explicitly before changing provider.
