-- 若项目已执行过 supabase-setup.sql，仅需在 SQL Editor 中单独执行本文件（或从 setup 中复制 chat_support_message 相关段落）。
-- 与对话流水 chat_messages 不同：本表仅存「动物正向话术」模板，供前端随机回复。

create table if not exists chat_support_message (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  animal_key text not null check (animal_key in ('deer', 'rabbit', 'bear')),
  content text not null,
  sort_order integer default 0
);

alter table chat_support_message enable row level security;

drop policy if exists "Anyone can read chat support messages" on chat_support_message;
create policy "Anyone can read chat support messages"
  on chat_support_message for select using (true);

drop policy if exists "Authenticated users insert chat support messages" on chat_support_message;
create policy "Authenticated users insert chat support messages"
  on chat_support_message for insert with check (auth.uid() is not null);

drop policy if exists "Authenticated users update chat support messages" on chat_support_message;
create policy "Authenticated users update chat support messages"
  on chat_support_message for update using (auth.uid() is not null);

drop policy if exists "Authenticated users delete chat support messages" on chat_support_message;
create policy "Authenticated users delete chat support messages"
  on chat_support_message for delete using (auth.uid() is not null);

create index if not exists idx_chat_support_animal on chat_support_message(animal_key);
