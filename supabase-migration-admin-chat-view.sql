-- 管理员查看对话功能
-- 在 Supabase SQL Editor 中执行此文件

-- 1. 更新 chat_messages 表，添加更多字段用于追踪
alter table if exists chat_messages 
add column if not exists session_id text;

alter table if exists chat_messages 
add column if not exists model_used text default 'local';

alter table if exists chat_messages 
add column if not exists animal_key text;

-- 2. 创建管理员角色（可选，用于更细粒度的权限控制）
-- create role admin_user;
-- grant all on chat_messages to admin_user;

-- 3. 更新 RLS 策略 - 允许管理员查看所有对话
-- 首先删除旧的策略
drop policy if exists "Users can read own messages" on chat_messages;
drop policy if exists "Users can insert own messages" on chat_messages;
drop policy if exists "Users can delete own messages" on chat_messages;

-- 创建新的策略：用户只能查看自己的消息
create policy "Users can read own messages" on chat_messages
  for select using (user_id = auth.uid());

-- 用户可以插入消息
create policy "Users can insert own messages" on chat_messages
  for insert with check (user_id = auth.uid());

-- 用户可以删除自己的消息
create policy "Users can delete own messages" on chat_messages
  for delete using (user_id = auth.uid());

-- 管理员可以查看所有消息（使用服务角色密钥）
-- 服务角色可以绕过 RLS，所以我们创建一个视图供管理员使用
create view if not exists admin_chat_view as
select 
  cm.id,
  cm.created_at,
  cm.user_id,
  u.email,
  u.device_id,
  cm.content,
  cm.type,
  cm.session_id,
  cm.model_used,
  cm.animal_key
from chat_messages cm
left join users u on cm.user_id = u.id
order by cm.created_at desc;

-- 允许认证用户（管理员）查看视图
alter view admin_chat_view with (security_barrier);
create policy "Admin can view all chat messages" on admin_chat_view
  for select using (auth.uid() is not null);

-- 4. 创建对话会话表（用于分组对话）
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade,
  animal_key text not null,
  title text default '新对话',
  message_count integer default 0
);

alter table chat_sessions enable row level security;

create policy "Users can read own sessions" on chat_sessions
  for select using (user_id = auth.uid());

create policy "Users can insert own sessions" on chat_sessions
  for insert with check (user_id = auth.uid());

create policy "Users can update own sessions" on chat_sessions
  for update using (user_id = auth.uid());

create policy "Users can delete own sessions" on chat_sessions
  for delete using (user_id = auth.uid());

-- 为管理员创建会话视图
create view if not exists admin_session_view as
select 
  cs.id,
  cs.created_at,
  cs.updated_at,
  cs.user_id,
  u.email,
  u.device_id,
  cs.animal_key,
  cs.title,
  cs.message_count
from chat_sessions cs
left join users u on cs.user_id = u.id
order by cs.created_at desc;

alter view admin_session_view with (security_barrier);
create policy "Admin can view all sessions" on admin_session_view
  for select using (auth.uid() is not null);

-- 5. 创建索引
create index if not exists idx_chat_messages_user_created on chat_messages(user_id, created_at);
create index if not exists idx_chat_sessions_user on chat_sessions(user_id);

-- 6. 添加示例数据（可选）
-- insert into chat_sessions (user_id, animal_key, title, message_count) values
--   ('your-user-id', 'deer', '第一次对话', 5);

select 'Database setup completed successfully!' as message;