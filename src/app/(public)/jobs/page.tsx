import { Suspense } from "react";
import type { Metadata } from "next";
import { getFilteredJobs, getCategories } from "@/lib/jobs";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { JobFilters as JobFiltersType } from "@/types";

export const metadata: Metadata = {
  title: "Browse Jobs — Helpers",
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
    <div className="space-y-6">
      <JobFilters categories={categories} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">
            {filteredJobs.length}
          </span>{" "}
          {filteredJobs.length === 1 ? "job" : "jobs"} found
          {hasActiveFilter && (
            <span className="text-neutral-400"> with active filters</span>
          )}
        </p>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {filteredJobs.map((job) => (
            <div key={job.id} className="border-b border-neutral-100 last:border-0">
              <JobCard job={job} featured={job.featured} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-base font-semibold text-neutral-500">
            No jobs found
          </p>
          <p className="mt-1.5 text-sm text-neutral-400">
            Try broadening your search or clearing the filters.
          </p>
        </div>
      )}
    </div>
  );
}

const JobPageSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="space-y-3">
      <div className="h-10 rounded-xl bg-neutral-100" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-32 rounded-lg bg-neutral-100" />
        ))}
      </div>
    </div>
    <div className="h-4 w-28 rounded bg-neutral-100" />
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border-b border-neutral-100 p-6 last:border-0">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-neutral-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-neutral-100" />
              <div className="h-5 w-2/3 rounded bg-neutral-200" />
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-neutral-100" />
                <div className="h-5 w-20 rounded-full bg-neutral-100" />
              </div>
            </div>
          </div>
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
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Helpers
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Browse Jobs
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Curated roles in engineering, design, data, and product — reviewed
          before they go live.
        </p>
      </div>

      <Suspense fallback={<JobPageSkeleton />}>
        <JobPageContent searchParams={params} />
      </Suspense>
    </main>
  );
}
