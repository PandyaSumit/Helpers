import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createSupabaseClient, DbJob } from './supabase';
import { Job, JobFilters, JobType, ExperienceLevel, LocationType } from '@/types';

// ─── Mappers ────────────────────────────────────────────────────────────────

function mapJob(row: DbJob): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    company: row.company,
    companyLogo: row.company_logo ?? undefined,
    location: row.location,
    locationType: row.location_type as LocationType,
    jobType: row.job_type as JobType,
    experienceLevel: row.experience_level as ExperienceLevel,
    salary:
      row.salary_min != null && row.salary_max != null
        ? {
            min: row.salary_min,
            max: row.salary_max,
            currency: row.salary_currency ?? 'USD',
            period: (row.salary_period ?? 'year') as 'year' | 'month' | 'hour',
          }
        : undefined,
    description: row.description,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    niceToHave: row.nice_to_have ?? undefined,
    tags: row.tags ?? [],
    category: row.category,
    applicationUrl: row.application_url,
    sourceUrl: row.source_url,
    featured: row.featured,
    postedAt: row.posted_at,
    expiresAt: row.expires_at ?? undefined,
    views: row.views,
  };
}

function toDbInsert(job: Omit<Job, 'id'>) {
  return {
    slug: job.slug,
    title: job.title,
    company: job.company,
    company_logo: job.companyLogo ?? null,
    location: job.location,
    location_type: job.locationType,
    job_type: job.jobType,
    experience_level: job.experienceLevel,
    salary_min: job.salary?.min ?? null,
    salary_max: job.salary?.max ?? null,
    salary_currency: job.salary?.currency ?? null,
    salary_period: job.salary?.period ?? null,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    nice_to_have: job.niceToHave ?? null,
    tags: job.tags,
    category: job.category,
    application_url: job.applicationUrl,
    source_url: job.sourceUrl,
    featured: job.featured,
    posted_at: job.postedAt,
    expires_at: job.expiresAt ?? null,
    views: job.views,
  };
}

function toDbUpdate(patch: Partial<Job>) {
  const out: Record<string, unknown> = {};
  if (patch.slug !== undefined) out.slug = patch.slug;
  if (patch.title !== undefined) out.title = patch.title;
  if (patch.company !== undefined) out.company = patch.company;
  if (patch.companyLogo !== undefined) out.company_logo = patch.companyLogo;
  if (patch.location !== undefined) out.location = patch.location;
  if (patch.locationType !== undefined) out.location_type = patch.locationType;
  if (patch.jobType !== undefined) out.job_type = patch.jobType;
  if (patch.experienceLevel !== undefined) out.experience_level = patch.experienceLevel;
  if (patch.salary !== undefined) {
    out.salary_min = patch.salary?.min ?? null;
    out.salary_max = patch.salary?.max ?? null;
    out.salary_currency = patch.salary?.currency ?? null;
    out.salary_period = patch.salary?.period ?? null;
  }
  if (patch.description !== undefined) out.description = patch.description;
  if (patch.responsibilities !== undefined) out.responsibilities = patch.responsibilities;
  if (patch.requirements !== undefined) out.requirements = patch.requirements;
  if (patch.niceToHave !== undefined) out.nice_to_have = patch.niceToHave;
  if (patch.tags !== undefined) out.tags = patch.tags;
  if (patch.category !== undefined) out.category = patch.category;
  if (patch.applicationUrl !== undefined) out.application_url = patch.applicationUrl;
  if (patch.sourceUrl !== undefined) out.source_url = patch.sourceUrl;
  if (patch.featured !== undefined) out.featured = patch.featured;
  if (patch.expiresAt !== undefined) out.expires_at = patch.expiresAt ?? null;
  return out;
}

// ─── Read Operations (cached) ────────────────────────────────────────────────

export const getAllJobs = unstable_cache(
  async (): Promise<Job[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      if (error) throw new Error(error.message);
      return ((data ?? []) as DbJob[]).map(mapJob);
    } catch (err) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
      throw err;
    }
  },
  ['all-jobs'],
  { tags: ['jobs'], revalidate: 60 }
);

export const getFilteredJobs = unstable_cache(
  async (filters: Partial<JobFilters>): Promise<Job[]> => {
    try {
      const supabase = createSupabaseClient();
      let query = supabase.from('jobs').select('*');

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.jobType && filters.jobType !== 'all') {
        query = query.eq('job_type', filters.jobType);
      }
      if (filters.experienceLevel && filters.experienceLevel !== 'all') {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.locationType && filters.locationType !== 'all') {
        query = query.eq('location_type', filters.locationType);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim();
        query = query.or(
          `title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`
        );
      }

      const { data, error } = await query.order('posted_at', { ascending: false });
      if (error) throw new Error(`getFilteredJobs: ${error.message}`);
      return ((data ?? []) as DbJob[]).map(mapJob);
    } catch (err) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
      throw err;
    }
  },
  ['filtered-jobs'],
  { tags: ['jobs'], revalidate: 60 }
);

export const getJobBySlug = unstable_cache(
  async (slug: string): Promise<Job | undefined> => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return undefined;
    return mapJob(data as DbJob);
  },
  ['job-by-slug'],
  { tags: ['jobs'], revalidate: 3600 }
);

export const getFeaturedJobs = unstable_cache(
  async (): Promise<Job[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('featured', true)
        .order('posted_at', { ascending: false })
        .limit(6);
      if (error) throw new Error(error.message);
      return ((data ?? []) as DbJob[]).map(mapJob);
    } catch {
      return [];
    }
  },
  ['featured-jobs'],
  { tags: ['jobs'], revalidate: 60 }
);

export const getCategories = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw new Error(error.message);
      return Array.from(new Set(((data ?? []) as DbJob[]).map((r) => r.category))).sort();
    } catch {
      return [];
    }
  },
  ['categories'],
  { tags: ['jobs'], revalidate: 3600 }
);

export const getStats = unstable_cache(
  async (): Promise<{ total: number; companies: number; remote: number; categories: number }> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw new Error(error.message);
      const rows = (data ?? []) as DbJob[];
      return {
        total: rows.length,
        companies: new Set(rows.map((r) => r.company)).size,
        remote: rows.filter((r) => r.location_type === 'remote').length,
        categories: new Set(rows.map((r) => r.category)).size,
      };
    } catch {
      return { total: 0, companies: 0, remote: 0, categories: 0 };
    }
  },
  ['stats'],
  { tags: ['jobs'], revalidate: 60 }
);

export const getAllSlugs = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) return [];
      return ((data ?? []) as DbJob[]).map((r) => r.slug);
    } catch {
      return [];
    }
  },
  ['all-slugs'],
  { tags: ['jobs'], revalidate: 3600 }
);

// ─── Write Operations (mutating, invalidate cache) ──────────────────────────

export async function createJob(jobData: Omit<Job, 'id'>): Promise<Job> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .insert(toDbInsert(jobData))
    .select()
    .single();

  if (error) throw new Error(`createJob: ${error.message}`);
  revalidateTag('jobs', 'max');
  return mapJob(data as DbJob);
}

export async function updateJob(id: string, patch: Partial<Job>): Promise<Job> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('jobs')
    .update(toDbUpdate(patch))
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateJob: ${error.message}`);
  revalidateTag('jobs', 'max');
  return mapJob(data as DbJob);
}

export async function deleteJob(id: string): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw new Error(`deleteJob: ${error.message}`);
  revalidateTag('jobs', 'max');
}

export async function incrementViews(id: string): Promise<void> {
  const supabase = createSupabaseClient();
  await supabase.rpc('increment_job_views', { job_id: id });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function generateSlug(title: string, company: string): string {
  return `${title}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
