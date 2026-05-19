-- Supabase Database Setup for Senyu App
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Users table（匿名：device_id；登录：id 与 auth.users.id 一致，device_id 可为空，email 为登录邮箱）
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  device_id text unique,
  email text
);

alter table public.users add column if not exists email text;

-- Emotion records table
create table if not exists emotion_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade,
  date text not null,
  mood text not null,
  intensity integer default 5,
  note text
);

-- Chat messages table
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade,
  content text not null,
  type text not null check (type in ('user', 'ai'))
);

-- User stats table
create table if not exists user_stats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade unique,
  streak_days integer default 0,
  meditation_minutes integer default 0,
  chat_count integer default 0,
  total_stars integer default 0,
  level integer default 1,
  level_name text default '初学者'
);

-- Selected animals table
create table if not exists selected_animals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade unique,
  animal_id text not null
);

-- Animals reference table
create table if not exists animals (
  id text primary key,
  name text not null,
  emoji text not null,
  personality text not null,
  greeting text not null,
  color text not null
);

-- Insert default animals
insert into animals (id, name, emoji, personality, greeting, color) values
  ('1', '小鹿露露', '🦌', '温柔体贴', '今天过得怎么样？我一直在这里等你', 'from-amber-100 to-orange-100'),
  ('2', '小熊阿悟', '🐻', '沉稳睿智', '休息一下吧，我会在这里陪你', 'from-amber-100 to-yellow-100'),
  ('3', '小兔朵朵', '🐰', '活泼开朗', '嗨！有什么开心的事想分享吗？', 'from-pink-100 to-rose-100'),
  ('4', '小猫米亚', '🐱', '安静治愈', '嘘...安静的时刻，我们一起度过', 'from-gray-100 to-slate-100'),
  ('5', '小猫球球', '🐱', '调皮可爱', '喵～今天想聊些什么呢？', 'from-orange-100 to-amber-100')
on conflict (id) do nothing;

-- Row Level Security (RLS) - Essential for user data isolation
alter table users enable row level security;
alter table emotion_records enable row level security;
alter table chat_messages enable row level security;
alter table user_stats enable row level security;
alter table selected_animals enable row level security;

-- Create policies for users table
create policy "Users can manage own data" on users
  for all using (true) with check (true);

-- Create policies for emotion_records
create policy "Users can read own records" on emotion_records
  for select using (true);

create policy "Users can insert own records" on emotion_records
  for insert with check (true);

create policy "Users can update own records" on emotion_records
  for update using (true);

create policy "Users can delete own records" on emotion_records
  for delete using (true);

-- Create policies for chat_messages
create policy "Users can read own messages" on chat_messages
  for select using (true);

create policy "Users can insert own messages" on chat_messages
  for insert with check (true);

create policy "Users can delete own messages" on chat_messages
  for delete using (true);

-- Create policies for user_stats
create policy "Users can read own stats" on user_stats
  for select using (true);

create policy "Users can insert own stats" on user_stats
  for insert with check (true);

create policy "Users can update own stats" on user_stats
  for update using (true);

-- Create policies for selected_animals
create policy "Users can read own selected animal" on selected_animals
  for select using (true);

create policy "Users can insert own selected animal" on selected_animals
  for insert with check (true);

create policy "Users can update own selected animal" on selected_animals
  for update using (true);

-- Animals table is read-only for all
alter table animals enable row level security;
create policy "Anyone can read animals" on animals
  for select using (true);

-- 动物正向话术（AI 不可用时随机回复；表名 chat_support_message，与对话流水 chat_messages 区分）
create table if not exists chat_support_message (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  animal_key text not null check (animal_key in ('deer', 'rabbit', 'bear')),
  content text not null,
  sort_order integer default 0
);

alter table chat_support_message enable row level security;

create policy "Anyone can read chat support messages"
  on chat_support_message for select using (true);

create policy "Authenticated users insert chat support messages"
  on chat_support_message for insert with check (auth.uid() is not null);

create policy "Authenticated users update chat support messages"
  on chat_support_message for update using (auth.uid() is not null);

create policy "Authenticated users delete chat support messages"
  on chat_support_message for delete using (auth.uid() is not null);

create index if not exists idx_chat_support_animal on chat_support_message(animal_key);

-- 首次部署可执行：内置与前端 ANIMALS 一致的默认话术（重复执行可能重复插入，可先 truncate chat_support_message）
insert into chat_support_message (animal_key, content, sort_order) values
  ('deer', '我在这里听着呢，不急，我们慢慢说 🌿', 1),
  ('deer', '你的感受都很重要，愿意多告诉我一点吗？', 2),
  ('deer', '抱抱你。要不要一起深呼吸，像林间风一样轻？', 3),
  ('deer', '谢谢你信任我，这需要勇气。', 4),
  ('deer', '今天能遇见你，森林又多了一点温柔。', 5),
  ('rabbit', '嗯嗯，绵绵在听哦，你可以小声说～', 1),
  ('rabbit', '有点累也没关系，靠着我歇一会儿吧。', 2),
  ('rabbit', '给你一颗想象中的棉花糖，甜甜的。', 3),
  ('rabbit', '你的情绪像云朵，飘过去就好了。', 4),
  ('rabbit', '我们一起数三声，好吗？一…二…三… 🐰', 5),
  ('bear', '团团的怀抱永远为你留着。', 1),
  ('bear', '难过的时候，可以靠在我肚子上发呆。', 2),
  ('bear', '你已经很棒了，真的。', 3),
  ('bear', '慢慢说，我哪儿也不去。', 4),
  ('bear', '把烦恼交给森林的风吧，我陪你。', 5);

-- Create indexes for better performance
create index if not exists idx_emotion_records_user_date on emotion_records(user_id, date);
create index if not exists idx_chat_messages_user on chat_messages(user_id);
create index if not exists idx_user_stats_user on user_stats(user_id);

-- Auth 用户写入 public.users：由客户端在登录后完成（勿对 auth.users 使用 AFTER INSERT 触发器，
-- 否则易出现注册错误 Database error saving new user (unexpected_failure）。）
