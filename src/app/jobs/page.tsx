import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getFilteredJobs, getCategories } from '@/lib/jobs';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import { JobFilters as JobFiltersType } from '@/types';

export const metadata: Metadata = {
  title: 'Browse Jobs',
  description: 'Find curated engineering, design, data, and product jobs from top companies. Filter by role, location, type, and experience level.',
};

type SearchParams = { [key: string]: string | string[] | undefined };

function getString(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] ?? '';
  return val ?? '';
}

async function JobPageContent({ searchParams }: { searchParams: SearchParams }) {
  const filters: Partial<JobFiltersType> = {
    search: getString(searchParams.search),
    category: getString(searchParams.category),
    jobType: getString(searchParams.jobType),
    experienceLevel: getString(searchParams.experienceLevel),
    locationType: getString(searchParams.locationType),
  };

  const [filteredJobs, categories] = await Promise.all([
    getFilteredJobs(filters),
    getCategories(),
  ]);

  const hasActiveFilter = Object.values(filters).some((v) => v && v !== 'all');

  return (
    <>
      <p className="mb-4 text-sm text-neutral-500">
        {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        {hasActiveFilter ? ' matching your filters' : ''}
      </p>

      <JobFilters categories={categories} />

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
    </>
  );
}

const JobPageSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-5 w-32 rounded bg-neutral-200" />
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 w-32 rounded-lg bg-neutral-100" />
      ))}
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-52 rounded-2xl bg-neutral-100" />
      ))}
    </div>
  </div>
);

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Browse Jobs</h1>
      </div>

      <Suspense fallback={<JobPageSkeleton />}>
        <JobPageContent searchParams={params} />
      </Suspense>
    </main>
  );
}
