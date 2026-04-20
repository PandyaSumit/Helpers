import { Suspense } from "react";
import type { Metadata } from "next";
import { getFilteredJobs, getCategories } from "@/lib/jobs";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { JobFilters as JobFiltersType } from "@/types";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Find curated engineering, design, data, and product jobs from top companies. Filter by role, location, type, and experience level.",
};

type SearchParams = { [key: string]: string | string[] | undefined };

function getString(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] ?? "";
  return val ?? "";
}

async function JobPageContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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

  const hasActiveFilter = Object.values(filters).some((v) => v && v !== "all");

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">{filteredJobs.length}</span>{" "}
          {filteredJobs.length === 1 ? "job" : "jobs"} found
          {hasActiveFilter ? " with active filters" : ""}
        </p>
      </div>
      <JobFilters categories={categories} />

      <div>
        {filteredJobs.length > 0 ? (
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured={job.featured} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-neutral-300 py-20 text-center">
            <p className="text-lg font-semibold text-neutral-600">
              No jobs found
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Try broadening your search or clearing filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const JobPageSkeleton = () => (
  <div className="animate-pulse space-y-7">
    <div className="h-5 w-40 rounded bg-neutral-200" />
    <div className="space-y-3 border-y border-neutral-200 py-5">
      <div className="h-10 rounded-md bg-neutral-100" />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded-md bg-neutral-100" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3 py-6">
          <div className="h-4 w-32 rounded bg-neutral-200" />
          <div className="h-5 w-2/3 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
        </div>
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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8 space-y-3 border-b border-neutral-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Helpers
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Browse Jobs
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Find curated roles in engineering, design, data, and product with a
          clean, scan-first layout that helps you decide faster.
        </p>
      </div>

      <Suspense fallback={<JobPageSkeleton />}>
        <JobPageContent searchParams={params} />
      </Suspense>
    </main>
  );
}
