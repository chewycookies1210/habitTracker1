-- Habit Tracker schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

create table if not exists habits (
  id text primary key,
  name text not null,
  category text not null check (category in ('non_negotiable','structured','bad')),
  weekday_behavior text not null default 'expected', -- expected | optional | hidden
  weekend_behavior text not null default 'expected',
  sort_order int not null default 0
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  habit_id text references habits(id) on delete cascade,
  date date not null,
  value int not null default 0, -- 0/1 for toggles, 0-3 for water counter
  created_at timestamptz default now(),
  unique(habit_id, date)
);

create table if not exists settings (
  key text primary key,
  value jsonb not null
);

insert into settings (key, value) values ('reading_target_minutes', '15')
  on conflict (key) do nothing;

-- Seed habits (idempotent)
insert into habits (id, name, category, weekday_behavior, weekend_behavior, sort_order) values
  -- Non-negotiables (always pinned, expected every day)
  ('morning_routine',        'Morning routine',              'non_negotiable', 'expected', 'expected', 10),
  ('phoneless_morning',      'Phoneless time — start of day','non_negotiable', 'expected', 'expected', 20),
  ('phoneless_evening',      'Phoneless time — end of day',  'non_negotiable', 'expected', 'expected', 30),
  ('reading',                'Reading',                      'non_negotiable', 'expected', 'expected', 40),
  ('water',                  'Water',                        'non_negotiable', 'expected', 'expected', 50),

  -- Structured good habits
  ('work',                   'Work',                         'structured', 'expected', 'hidden',   60),
  ('university',             'University up to date',        'structured', 'expected', 'hidden',   70),
  ('healthy_eating',         'Healthy eating',                'structured', 'expected', 'optional', 80),
  ('meditation',             'Meditation',                    'structured', 'expected', 'expected', 90),
  ('family_friends',         'Family & friends time',         'structured', 'optional', 'expected', 100),

  -- Bad habits (framed positively, default unchecked/neutral)
  ('smoking',                'Smoke-free today',              'bad', 'expected', 'expected', 110),
  ('adult_content',          'Stayed clear today',            'bad', 'expected', 'expected', 120),
  ('doom_scrolling',         'No doom-scrolling',             'bad', 'expected', 'expected', 130)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  weekday_behavior = excluded.weekday_behavior,
  weekend_behavior = excluded.weekend_behavior,
  sort_order = excluded.sort_order;
