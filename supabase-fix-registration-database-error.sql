-- 修复：注册 / 登录时报「Database error saving new user (unexpected_failure)」
-- 原因：auth.users 上 AFTER INSERT 触发器向 public.users 插入时，在部分项目上会被 RLS 拦截，
--       导致整笔 Auth 注册回滚。
-- 做法：移除该触发器；public.users 由 App 在登录后首次请求时写入（ensureAuthUserRow）。
-- 在 Supabase → SQL Editor 执行本文件后，再试注册。

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
