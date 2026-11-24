-- ==============================================================================
-- CAMPUS LOST & FOUND PORTAL - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all tables, triggers, storage bucket policies, and Row Level Security (RLS).
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. CREATE PROFILES TABLE (Linked with Supabase Auth auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  student_id text,
  department text,
  email text,
  phone text,
  role text default 'student' check (role in ('student', 'admin', 'staff')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger: Automatically create public.profiles entry upon user sign-up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, student_id, department, email, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'student_id', 'STU-' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'department', 'General'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/initials/svg?seed=' || coalesce(new.raw_user_meta_data->>'full_name', new.email))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==============================================================================
-- 3. CREATE LOST & FOUND ITEMS TABLE
-- ==============================================================================
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('lost', 'found')),
  title text not null,
  category text not null check (category in ('ID Card', 'Water Bottle', 'Books', 'Wallet', 'Earphones', 'Keys', 'Others')),
  color text not null,
  location text not null check (location in ('Classroom', 'Library', 'Canteen', 'Laboratory', 'Hostel', 'Other')),
  date date not null default current_date,
  description text not null,
  image_url text,
  status text not null default 'Open' check (status in ('Open', 'Pending', 'Returned')),
  reporter_name text not null,
  reporter_student_id text,
  reporter_contact_hidden text,
  return_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on items
alter table public.items enable row level security;

-- Policies for items
create policy "Items are viewable by everyone" 
  on public.items for select 
  using (true);

create policy "Authenticated users can report items" 
  on public.items for insert 
  with check (auth.role() = 'authenticated');

create policy "Users can update their own reported items or admins can update" 
  on public.items for update 
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
  );

create policy "Users can delete their own items or admins can delete" 
  on public.items for delete 
  using (
    auth.uid() = user_id or 
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
  );


-- ==============================================================================
-- 4. CREATE CLAIMS TABLE (For match verification & express interest)
-- ==============================================================================
create table if not exists public.claims (
  id uuid default gen_random_uuid() primary key,
  lost_item_id uuid references public.items(id) on delete cascade not null,
  found_item_id uuid references public.items(id) on delete cascade not null,
  claimant_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  status text not null default 'Pending Verification' check (status in ('Pending Verification', 'Approved', 'Resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on claims
alter table public.claims enable row level security;

create policy "Claims are viewable by claimant, item owners, and staff" 
  on public.claims for select 
  using (
    auth.uid() = claimant_id or
    auth.uid() in (select user_id from public.items where id in (lost_item_id, found_item_id)) or
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff'))
  );

create policy "Authenticated users can submit a claim" 
  on public.claims for insert 
  with check (auth.role() = 'authenticated');

create policy "Staff or involved users can update claim status" 
  on public.claims for update 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff')) or
    auth.uid() in (select user_id from public.items where id in (lost_item_id, found_item_id))
  );


-- ==============================================================================
-- 5. STORAGE BUCKET FOR ITEM PHOTOS
-- ==============================================================================
-- Create storage bucket for item images if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Item images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'item-images');

create policy "Authenticated users can upload item photos"
  on storage.objects for insert
  with check (bucket_id = 'item-images' and auth.role() = 'authenticated');

create policy "Users can update or delete their own uploaded photos"
  on storage.objects for delete
  using (bucket_id = 'item-images' and auth.uid() = owner);


-- ==============================================================================
-- 6. HELPER FUNCTION TO UPDATE UPDATED_AT
-- ==============================================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_items_updated_at before update on public.items
  for each row execute procedure public.update_updated_at_column();
