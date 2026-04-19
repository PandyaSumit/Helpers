-- Create jobs table
create table if not exists public.jobs (
  id              uuid        primary key default gen_random_uuid(),
  slug            text        unique not null,
  title           text        not null,
  company         text        not null,
  company_logo    text        default '',
  location        text        not null,
  location_type   text        not null check (location_type in ('remote', 'hybrid', 'onsite')),
  job_type        text        not null check (job_type in ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
  experience_level text       not null check (experience_level in ('entry', 'mid', 'senior', 'lead', 'executive')),
  salary_min      integer,
  salary_max      integer,
  salary_currency text        default 'USD',
  salary_period   text        default 'year' check (salary_period in ('year', 'month', 'hour')),
  description     text        not null default '',
  responsibilities text[]     not null default '{}',
  requirements    text[]      not null default '{}',
  nice_to_have    text[]      default '{}',
  tags            text[]      not null default '{}',
  category        text        not null,
  application_url text        not null,
  source_url      text        not null,
  featured        boolean     not null default false,
  posted_at       timestamptz not null default now(),
  expires_at      timestamptz,
  views           integer     not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- Indexes for common query patterns
create index jobs_featured_idx   on public.jobs (featured)       where featured = true;
create index jobs_category_idx   on public.jobs (category);
create index jobs_job_type_idx   on public.jobs (job_type);
create index jobs_exp_level_idx  on public.jobs (experience_level);
create index jobs_location_type_idx on public.jobs (location_type);
create index jobs_posted_at_idx  on public.jobs (posted_at desc);

-- Row Level Security
alter table public.jobs enable row level security;

-- Anyone can read jobs
create policy "Jobs are publicly readable"
  on public.jobs for select
  using (true);

-- Only authenticated users / service role can mutate
-- (service role key bypasses RLS automatically)
create policy "Authenticated users can insert"
  on public.jobs for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update"
  on public.jobs for update
  to authenticated
  using (true);

create policy "Authenticated users can delete"
  on public.jobs for delete
  to authenticated
  using (true);

-- Helper function for safe view count increment
create or replace function public.increment_job_views(job_id uuid)
returns void language sql security definer as $$
  update public.jobs set views = views + 1 where id = job_id;
$$;
