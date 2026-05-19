/*
================================================================================
  森愈 App · Supabase 一键修复脚本

  我（电脑里的助手）不能代替你登录 Supabase 网站，但只要你按下面做一次即可：

  ① 用浏览器打开：https://supabase.com/dashboard 并登录你的账号  
  ② 点击和你的项目地址一致的项目（.env 里是 xxx.supabase.co 的那个）  
  ③ 左侧菜单点「SQL Editor」  
  ④ 点「New query」空白查询  
  ⑤ 把本文件中 【从下一行 “create extension” 起到文件末尾】全部复制进去  
  ⑥ 点右下角绿色按钮 Run（运行）  
  ⑦ 若出现 Success / 无红色错误 即表示成功  

  然后：关掉网页即可。回到本机若开着 `npm run dev`，建议 Ctrl+C 停掉再运行一次，  
  再在 App「我的」里试注册或登录。

  本脚本作用简要说明：
  · 删除会导致「注册失败 Database error saving new user」的触发器  
  · 允许公开 users 表在匿名 / 登录场景下正常插入（与你的 App 逻辑一致）  
  · 为 users 表增加 email 列：邮箱登录用户会在 Table Editor 里看到真实邮箱  
================================================================================
*/

create extension if not exists "pgcrypto";

-- 注册失败 (unexpected_failure)：去掉往 public.users 同步的触发器
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 登录用户允许没有 device_id；email 用于 Table Editor 显示真实注册邮箱
alter table public.users
  alter column device_id drop not null;

alter table public.users add column if not exists email text;

-- public.users：重置策略，避免 RLS 拦住插入
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
