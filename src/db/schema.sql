
-- Vyclo Labs Database Schema

-- 1. PROFILES
-- Stores user biometrics and settings. Links to Supabase Auth.
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  
  -- Biometrics
  age int,
  gender text check (gender in ('male', 'female', 'other')),
  weight numeric, -- in kg
  height numeric, -- in cm
  activity_level text,
  goal text default 'maintenance',
  
  constraint username_length check (char_length(username) >= 3)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. DAILY LOGS
-- Stores all daily tracking data in a JSONB column for flexibility 
-- (matching the NoSQL-style nature of the current Zustand store).
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  
  -- Data Modules (JSONB allows flexible schema as app evolves)
  nutrition jsonb default '{}'::jsonb,
  training jsonb default '{}'::jsonb,
  sleep jsonb default '{}'::jsonb,
  learning jsonb default '{}'::jsonb,
  screen jsonb default '{}'::jsonb,
  hydration numeric default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  unique(user_id, date) -- One log per user per day
);

alter table public.daily_logs enable row level security;

create policy "Users can view own logs."
  on daily_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert/update own logs."
  on daily_logs for all
  using ( auth.uid() = user_id );

-- 3. SCORES (Optional: Cached Calculations)
create table public.daily_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  
  system_score numeric,
  sleep_score numeric,
  nutrition_score numeric,
  training_score numeric,
  cognitive_score numeric,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, date)
);

alter table public.daily_scores enable row level security;

create policy "Users can view own scores."
  on daily_scores for select
  using ( auth.uid() = user_id );

create policy "Users can insert/update own scores."
  on daily_scores for all
  using ( auth.uid() = user_id );
