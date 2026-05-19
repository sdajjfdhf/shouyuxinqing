-- 修复：Table Editor 里 public.users 始终为空 / 初始化报 RLS、permission
-- 在 Supabase → SQL Editor 整段执行一次

-- 1. 登录用户可 device_id 为空；email 便于在后台辨认真实用户
alter table public.users
  alter column device_id drop not null;

alter table public.users add column if not exists email text;

-- 2. 重置 public.users 上的 RLS 策略，允许 anon + authenticated 完成应用自带的「创建设备用户」
alter table public.users enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'users'
  loop
    execute format('drop policy if exists %I on public.users', pol.policyname);
  end loop;
end $$;

create policy "senyu_users_allow_all"
  on public.users
  for all
  using (true)
  with check (true);

grant select, insert, update, delete on public.users to anon;
grant select, insert, update, delete on public.users to authenticated;
grant select, insert, update, delete on public.users to service_role;

-- 3. 不要在 auth.users 上挂「写入 public.users」的触发器：易导致注册报
--    Database error saving new user (unexpected_failure)。同步逻辑由前端登录后的 API 完成。
--    若你曾执行过旧脚本，请再运行：supabase-fix-registration-database-error.sql
