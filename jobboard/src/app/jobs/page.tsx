import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllJobs, filterJobs, getCategories } from '@/lib/jobs';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { JobFilters as JobFiltersType } from '@/types';

export const metadata: Metadata = {
  title: 'Browse Jobs',
  description: 'Find curated engineering, design, data, and product jobs from top companies. Filter by role, location, type, and experience level.',
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function getString(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] ?? '';
  return val ?? '';
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;

  const filters: Partial<JobFiltersType> = {
    search: getString(params.search),
    category: getString(params.category),
    jobType: getString(params.jobType),
    experienceLevel: getString(params.experienceLevel),
    locationType: getString(params.locationType),
  };

  const allJobs = getAllJobs();
  const filteredJobs = filterJobs(allJobs, filters);
  const categories = getCategories();

  const hasActiveFilter = Object.values(filters).some((v) => v && v !== 'all');

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Browse Jobs</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          {hasActiveFilter ? ' matching your filters' : ''}
        </p>
      </div>

      <Suspense>
        <JobFilters categories={categories} />
      </Suspense>

      <div className="mt-8">
        {filteredJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured={job.featured} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
            <p className="text-lg font-semibold text-neutral-400">No jobs found</p>
            <p className="mt-1 text-sm text-neutral-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  );
}
