-- public.users 增加邮箱列（已在 App 登录/注册后由前端写入）
-- 在 Supabase SQL Editor 执行一次即可；若已跑过「一键修复」脚本可跳过

alter table public.users add column if not exists email text;
