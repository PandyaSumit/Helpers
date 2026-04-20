-- Helpers platform bootstrap migration (idempotent)
-- Safe to run multiple times. Creates/aligns required tables for:
-- 1) public.jobs
-- 2) public.blogs
-- and required helpers (updated_at trigger + increment_job_views RPC + RLS policies).

create extension if not exists pgcrypto;

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- jobs table
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title            text not null,
  company          text not null,
  company_logo     text default '',
  location         text not null,
  location_type    text not null check (location_type in ('remote', 'hybrid', 'onsite')),
  job_type         text not null check (job_type in ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
  experience_level text not null check (experience_level in ('entry', 'mid', 'senior', 'lead', 'executive')),
  salary_min       integer,
  salary_max       integer,
  salary_currency  text default 'USD',
  salary_period    text default 'year' check (salary_period in ('year', 'month', 'hour')),
  description      text not null default '',
  responsibilities text[] not null default '{}',
  requirements     text[] not null default '{}',
  nice_to_have     text[] default '{}',
  tags             text[] not null default '{}',
  category         text not null,
  application_url  text not null,
  source_url       text not null,
  featured         boolean not null default false,
  posted_at        timestamptz not null default now(),
  expires_at       timestamptz,
  views            integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Align columns if table already existed with partial schema
alter table public.jobs add column if not exists company_logo text default '';
alter table public.jobs add column if not exists salary_min integer;
alter table public.jobs add column if not exists salary_max integer;
alter table public.jobs add column if not exists salary_currency text default 'USD';
alter table public.jobs add column if not exists salary_period text default 'year';
alter table public.jobs add column if not exists description text not null default '';
alter table public.jobs add column if not exists responsibilities text[] not null default '{}';
alter table public.jobs add column if not exists requirements text[] not null default '{}';
alter table public.jobs add column if not exists nice_to_have text[] default '{}';
alter table public.jobs add column if not exists tags text[] not null default '{}';
alter table public.jobs add column if not exists featured boolean not null default false;
alter table public.jobs add column if not exists posted_at timestamptz not null default now();
alter table public.jobs add column if not exists expires_at timestamptz;
alter table public.jobs add column if not exists views integer not null default 0;
alter table public.jobs add column if not exists created_at timestamptz not null default now();
alter table public.jobs add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'jobs_location_type_check'
      and conrelid = 'public.jobs'::regclass
  ) then
    alter table public.jobs
      add constraint jobs_location_type_check
      check (location_type in ('remote', 'hybrid', 'onsite'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'jobs_job_type_check'
      and conrelid = 'public.jobs'::regclass
  ) then
    alter table public.jobs
      add constraint jobs_job_type_check
      check (job_type in ('full-time', 'part-time', 'contract', 'freelance', 'internship'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'jobs_experience_level_check'
      and conrelid = 'public.jobs'::regclass
  ) then
    alter table public.jobs
      add constraint jobs_experience_level_check
      check (experience_level in ('entry', 'mid', 'senior', 'lead', 'executive'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'jobs_salary_period_check'
      and conrelid = 'public.jobs'::regclass
  ) then
    alter table public.jobs
      add constraint jobs_salary_period_check
      check (salary_period in ('year', 'month', 'hour'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'jobs_updated_at'
      and tgrelid = 'public.jobs'::regclass
  ) then
    create trigger jobs_updated_at
      before update on public.jobs
      for each row execute function public.set_updated_at();
  end if;
end $$;

create index if not exists jobs_featured_idx on public.jobs (featured) where featured = true;
create index if not exists jobs_category_idx on public.jobs (category);
create index if not exists jobs_job_type_idx on public.jobs (job_type);
create index if not exists jobs_exp_level_idx on public.jobs (experience_level);
create index if not exists jobs_location_type_idx on public.jobs (location_type);
create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);

alter table public.jobs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'jobs' and policyname = 'Jobs are publicly readable'
  ) then
    create policy "Jobs are publicly readable"
      on public.jobs for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'jobs' and policyname = 'Authenticated users can insert'
  ) then
    create policy "Authenticated users can insert"
      on public.jobs for insert
      to authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'jobs' and policyname = 'Authenticated users can update'
  ) then
    create policy "Authenticated users can update"
      on public.jobs for update
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'jobs' and policyname = 'Authenticated users can delete'
  ) then
    create policy "Authenticated users can delete"
      on public.jobs for delete
      to authenticated
      using (true);
  end if;
end $$;

create or replace function public.increment_job_views(job_id uuid)
returns void
language sql
security definer
as $$
  update public.jobs
  set views = views + 1
  where id = job_id;
$$;

-- ---------------------------------------------------------------------------
-- blogs table
-- ---------------------------------------------------------------------------
create table if not exists public.blogs (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  title                text not null,
  excerpt              text not null default '',
  cover_image          text,
  content_html         text not null default '',
  tags                 text[] not null default '{}',
  featured             boolean not null default false,
  status               text not null default 'draft' check (status in ('draft', 'published')),
  reading_time_minutes integer not null default 1,
  published_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.blogs add column if not exists excerpt text not null default '';
alter table public.blogs add column if not exists cover_image text;
alter table public.blogs add column if not exists content_html text not null default '';
alter table public.blogs add column if not exists tags text[] not null default '{}';
alter table public.blogs add column if not exists featured boolean not null default false;
alter table public.blogs add column if not exists status text not null default 'draft';
alter table public.blogs add column if not exists reading_time_minutes integer not null default 1;
alter table public.blogs add column if not exists published_at timestamptz;
alter table public.blogs add column if not exists created_at timestamptz not null default now();
alter table public.blogs add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blogs_status_check'
      and conrelid = 'public.blogs'::regclass
  ) then
    alter table public.blogs
      add constraint blogs_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'blogs_updated_at'
      and tgrelid = 'public.blogs'::regclass
  ) then
    create trigger blogs_updated_at
      before update on public.blogs
      for each row execute function public.set_updated_at();
  end if;
end $$;

create index if not exists blogs_status_idx on public.blogs (status);
create index if not exists blogs_featured_idx on public.blogs (featured) where featured = true;
create index if not exists blogs_published_at_idx on public.blogs (published_at desc);

alter table public.blogs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blogs' and policyname = 'Blogs are publicly readable'
  ) then
    create policy "Blogs are publicly readable"
      on public.blogs for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blogs' and policyname = 'Authenticated users can insert blogs'
  ) then
    create policy "Authenticated users can insert blogs"
      on public.blogs for insert
      to authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blogs' and policyname = 'Authenticated users can update blogs'
  ) then
    create policy "Authenticated users can update blogs"
      on public.blogs for update
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'blogs' and policyname = 'Authenticated users can delete blogs'
  ) then
    create policy "Authenticated users can delete blogs"
      on public.blogs for delete
      to authenticated
      using (true);
  end if;
end $$;
