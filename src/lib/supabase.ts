import { createClient } from '@supabase/supabase-js';

export type DbJob = {
  id: string;
  slug: string;
  title: string;
  company: string;
  company_logo: string | null;
  location: string;
  location_type: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[] | null;
  tags: string[];
  category: string;
  application_url: string;
  source_url: string;
  featured: boolean;
  posted_at: string;
  expires_at: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = ReturnType<typeof createClient<any>>;

export function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.'
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
