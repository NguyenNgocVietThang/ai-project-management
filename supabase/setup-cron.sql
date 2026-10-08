-- Run once in the Supabase SQL editor AFTER the API is deployed and migrated.
-- Enable pg_cron / pg_net / Vault in Dashboard Integrations first.
-- Add Vault secrets using Dashboard UI (never commit their values):
--   demo_backend_origin = https://YOUR-BACKEND.onrender.com
--   demo_cron_secret = the same CRON_SECRET as the backend
-- Cron schedules use UTC: Vietnam08:00 = UTC01:00;08:30 = UTC01:30.

create schema if not exists demo_ops;
revoke all on schema demo_ops from public;
create table if not exists demo_ops.cron_http_requests (
  requested_at timestamptz not null default now(),
  request_id bigint primary key
);
revoke all on demo_ops.cron_http_requests from public;

create or replace function demo_ops.enqueue_schedules_http()
returns void language plpgsql security definer
set search_path = pg_catalog
as $$
declare api_origin text; api_secret text; request bigint;
begin
  select decrypted_secret into api_origin from vault.decrypted_secrets where name='demo_backend_origin';
  select decrypted_secret into api_secret from vault.decrypted_secrets where name='demo_cron_secret';
  if api_origin is null or api_secret is null or length(api_secret)<32
     or api_origin !~ '^https://[a-zA-Z0-9-]+[.]onrender[.]com/?$' then
    raise exception 'Cron Vault configuration is missing or invalid';
  end if;
  request := net.http_post(
    url := rtrim(api_origin, '/') || '/api/v1/internal/jobs/schedules',
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||api_secret),
    body := '{}'::jsonb,
    timeout_milliseconds := 90000
  );
  insert into demo_ops.cron_http_requests(request_id) values(request);
  delete from demo_ops.cron_http_requests where requested_at < now()-interval '7 days';
end $$;
revoke all on function demo_ops.enqueue_schedules_http() from public;

-- Initial attempt + two bounded cold-start retries. No every-minute keepalive.
-- Duplicate successful HTTP calls are safe: backend keys jobs by Vietnam date.
select cron.schedule('demo-reminders-0800', '0,2,5 1 * * *', 'select demo_ops.enqueue_schedules_http()');
select cron.schedule('demo-risk-0830', '30,32,35 1 * * *', 'select demo_ops.enqueue_schedules_http()');

-- pg_cron success means SQL HTTP enqueue succeeded, NOT HTTP delivery success.
-- Inspect status_code/timed_out/error_msg; do not select response content or secrets.
-- select r.requested_at, h.status_code, h.timed_out, h.error_msg
-- from demo_ops.cron_http_requests r left join net._http_response h on h.id=r.request_id
-- order by r.requested_at desc limit 20;
-- select jobid,status,start_time,end_time from cron.job_run_details order by start_time desc limit 20;
-- Disable: select cron.unschedule('demo-reminders-0800'); select cron.unschedule('demo-risk-0830');
