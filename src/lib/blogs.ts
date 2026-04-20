import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createSupabaseClient, DbBlog } from './supabase';
import { BlogPost, BlogStatus } from '@/types';

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeRichTextHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function estimateReadingTime(contentHtml: string): number {
  const words = stripHtml(contentHtml).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function mapBlog(row: DbBlog): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image ?? undefined,
    contentHtml: row.content_html,
    tags: row.tags ?? [],
    featured: row.featured,
    status: row.status,
    readingTimeMinutes: row.reading_time_minutes,
    publishedAt: row.published_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbInsert(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    cover_image: blog.coverImage ?? null,
    content_html: sanitizeRichTextHtml(blog.contentHtml),
    tags: blog.tags,
    featured: blog.featured,
    status: blog.status,
    reading_time_minutes: blog.readingTimeMinutes,
    published_at: blog.publishedAt ?? null,
  };
}

function toDbUpdate(patch: Partial<BlogPost>) {
  const out: Record<string, unknown> = {};
  if (patch.slug !== undefined) out.slug = patch.slug;
  if (patch.title !== undefined) out.title = patch.title;
  if (patch.excerpt !== undefined) out.excerpt = patch.excerpt;
  if (patch.coverImage !== undefined) out.cover_image = patch.coverImage ?? null;
  if (patch.contentHtml !== undefined) {
    out.content_html = sanitizeRichTextHtml(patch.contentHtml);
    out.reading_time_minutes = estimateReadingTime(patch.contentHtml);
  }
  if (patch.tags !== undefined) out.tags = patch.tags;
  if (patch.featured !== undefined) out.featured = patch.featured;
  if (patch.status !== undefined) out.status = patch.status;
  if (patch.readingTimeMinutes !== undefined) {
    out.reading_time_minutes = patch.readingTimeMinutes;
  }
  if (patch.publishedAt !== undefined) out.published_at = patch.publishedAt ?? null;
  return out;
}

function fallback<T>(value: T, err: unknown): T {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("Could not find the table 'public.blogs'")) return value;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return value;
  throw err;
}

export const getPublishedBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false });
      if (error) throw new Error(error.message);
      return ((data ?? []) as DbBlog[]).map(mapBlog);
    } catch (err) {
      return fallback([], err);
    }
  },
  ['published-blogs'],
  { tags: ['blogs'], revalidate: 120 }
);

export const getLatestBlogs = unstable_cache(
  async (limit = 3): Promise<BlogPost[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return ((data ?? []) as DbBlog[]).map(mapBlog);
    } catch (err) {
      return fallback([], err);
    }
  },
  ['latest-blogs'],
  { tags: ['blogs'], revalidate: 120 }
);

export const getPublishedBlogBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | undefined> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error || !data) return undefined;
      return mapBlog(data as DbBlog);
    } catch (err) {
      return fallback(undefined, err);
    }
  },
  ['published-blog-by-slug'],
  { tags: ['blogs'], revalidate: 120 }
);

export const getAllBlogsAdmin = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw new Error(error.message);
      return ((data ?? []) as DbBlog[]).map(mapBlog);
    } catch (err) {
      return fallback([], err);
    }
  },
  ['all-blogs-admin'],
  { tags: ['blogs'], revalidate: 60 }
);

export async function getBlogById(id: string): Promise<BlogPost | undefined> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).maybeSingle();
    if (error || !data) return undefined;
    return mapBlog(data as DbBlog);
  } catch (err) {
    return fallback(undefined, err);
  }
}

export async function createBlog(input: {
  title: string;
  excerpt?: string;
  coverImage?: string;
  contentHtml: string;
  tags?: string[];
  featured?: boolean;
  status?: BlogStatus;
  publishedAt?: string;
}): Promise<BlogPost> {
  const status = input.status ?? 'draft';
  const contentHtml = sanitizeRichTextHtml(input.contentHtml);
  const excerpt =
    input.excerpt?.trim() || stripHtml(contentHtml).slice(0, 180).trim();
  const post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
    slug: generateBlogSlug(input.title),
    title: input.title.trim(),
    excerpt,
    coverImage: input.coverImage?.trim() || undefined,
    contentHtml,
    tags: input.tags ?? [],
    featured: input.featured ?? false,
    status,
    readingTimeMinutes: estimateReadingTime(contentHtml),
    publishedAt:
      status === 'published' ? input.publishedAt ?? new Date().toISOString() : undefined,
  };

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('blogs').insert(toDbInsert(post)).select().single();
  if (error) throw new Error(`createBlog: ${error.message}`);
  revalidateTag('blogs', 'max');
  return mapBlog(data as DbBlog);
}

export async function updateBlog(
  id: string,
  patch: Partial<BlogPost> & { title?: string; status?: BlogStatus }
): Promise<BlogPost> {
  const updatePayload: Partial<BlogPost> = { ...patch };
  if (patch.title !== undefined) {
    updatePayload.title = patch.title.trim();
    updatePayload.slug = generateBlogSlug(patch.title);
  }
  if (patch.status === 'published' && !patch.publishedAt) {
    updatePayload.publishedAt = new Date().toISOString();
  }
  if (patch.excerpt !== undefined && patch.excerpt.trim() === '' && patch.contentHtml) {
    updatePayload.excerpt = stripHtml(patch.contentHtml).slice(0, 180).trim();
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('blogs')
    .update(toDbUpdate(updatePayload))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`updateBlog: ${error.message}`);
  revalidateTag('blogs', 'max');
  return mapBlog(data as DbBlog);
}

export async function deleteBlog(id: string): Promise<void> {
  const supabase = createSupabaseClient();
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw new Error(`deleteBlog: ${error.message}`);
  revalidateTag('blogs', 'max');
}

export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
