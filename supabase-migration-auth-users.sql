-- 将 Auth 用户与 public.users 对齐（仅数据库结构；不同步用数据库触发器，避免注册失败）
-- 在 Supabase SQL Editor 执行

create extension if not exists "pgcrypto";

-- 登录用户可没有 device_id；email 供 Table Editor 查看
alter table public.users
  alter column device_id drop not null;

alter table public.users add column if not exists email text;

-- 若曾添加过 auth 触发器导致「Database error saving new user」，执行下面两行清理：
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- public.users 中带 id = auth.uid() 的行：由 App（services.ts ensureAuthUserRow）在登录后首次访问时插入。
