-- Create blogs table
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
