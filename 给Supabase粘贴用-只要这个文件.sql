-- 森愈 App · 一次性建齐所有表 + 权限（贴进 Supabase SQL Editor → Run）
-- 解决：Could not find the table 'public.chat_messages'、无法注册/同步 等

create extension if not exists "pgcrypto";

-- 勿用会拖垮注册的 auth 触发器
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ========== 表结构 ==========
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  device_id text unique,
  email text
);

alter table public.users alter column device_id drop not null;
alter table public.users add column if not exists email text;

create table if not exists public.emotion_records (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references public.users(id) on delete cascade,
  date text not null,
  mood text not null,
  intensity integer default 5,
  note text
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  type text not null check (type in ('user', 'ai'))
);

create table if not exists public.user_stats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references public.users(id) on delete cascade unique,
  streak_days integer default 0,
  meditation_minutes integer default 0,
  chat_count integer default 0,
  total_stars integer default 0,
  level integer default 1,
  level_name text default '初学者'
);

create table if not exists public.selected_animals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references public.users(id) on delete cascade unique,
  animal_id text not null
);

create table if not exists public.animals (
  id text primary key,
  name text not null,
  emoji text not null,
  personality text not null,
  greeting text not null,
  color text not null
);

insert into public.animals (id, name, emoji, personality, greeting, color) values
  ('1', '小鹿露露', '🦌', '温柔体贴', '今天过得怎么样？我一直在这里等你', 'from-amber-100 to-orange-100'),
  ('2', '小熊阿悟', '🐻', '沉稳睿智', '休息一下吧，我会在这里陪你', 'from-amber-100 to-yellow-100'),
  ('3', '小兔朵朵', '🐰', '活泼开朗', '嗨！有什么开心的事想分享吗？', 'from-pink-100 to-rose-100'),
  ('4', '小猫米亚', '🐱', '安静治愈', '嘘...安静的时刻，我们一起度过', 'from-gray-100 to-slate-100'),
  ('5', '小猫球球', '🐱', '调皮可爱', '喵～今天想聊些什么呢？', 'from-orange-100 to-amber-100')
on conflict (id) do nothing;

create table if not exists public.chat_support_message (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  animal_key text not null check (animal_key in ('deer', 'rabbit', 'bear')),
  content text not null,
  sort_order integer default 0
);

insert into public.chat_support_message (animal_key, content, sort_order) values
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

-- ========== RLS：清掉旧策略再建（可重复执行）==========
alter table public.users enable row level security;
alter table public.emotion_records enable row level security;
alter table public.chat_messages enable row level security;
alter table public.user_stats enable row level security;
alter table public.selected_animals enable row level security;
alter table public.animals enable row level security;
alter table public.chat_support_message enable row level security;

do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array[
        'users','emotion_records','chat_messages','user_stats',
        'selected_animals','animals','chat_support_message'
      ])
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      pol.policyname,
      pol.schemaname,
      pol.tablename
    );
  end loop;
end $$;

create policy "senyu_users_all" on public.users for all using (true) with check (true);
create policy "senyu_emotion_all" on public.emotion_records for all using (true) with check (true);
create policy "senyu_chat_all" on public.chat_messages for all using (true) with check (true);
create policy "senyu_stats_all" on public.user_stats for all using (true) with check (true);
create policy "senyu_selected_animal_all" on public.selected_animals for all using (true) with check (true);
create policy "senyu_animals_read" on public.animals for select using (true);
create policy "senyu_support_all" on public.chat_support_message for all using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;

create index if not exists idx_emotion_records_user_date on public.emotion_records(user_id, date);
create index if not exists idx_chat_messages_user on public.chat_messages(user_id);
create index if not exists idx_user_stats_user on public.user_stats(user_id);
create index if not exists idx_chat_support_animal on public.chat_support_message(animal_key);

-- 执行后等约 1 分钟或刷新 Supabase 页面，再打开 App
