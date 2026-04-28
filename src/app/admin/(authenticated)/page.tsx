import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllJobs, getStats } from '@/lib/jobs';
import { timeAgo, formatSalary } from '@/lib/utils';
import { BarChart3, Briefcase, Building2, Globe, Plus, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboard() {
  const [stats, jobs] = await Promise.all([getStats(), getAllJobs()]);
  const featuredCount = jobs.filter((j) => j.featured).length;
  const recentJobs = jobs.slice(0, 6);

  const statCards = [
    { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Featured', value: featuredCount, icon: Star, color: 'bg-amber-50 text-amber-600' },
    { label: 'Companies', value: stats.companies, icon: Building2, color: 'bg-violet-50 text-violet-600' },
    { label: 'Remote Jobs', value: stats.remote, icon: Globe, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Overview of your job listings</p>
        </div>
        <Link
          href="/admin/jobs"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 sm:w-auto"
        >
          <Plus size={15} />
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
            <p className="mt-1 text-sm text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Recent Listings</h2>
            <Link href="/admin/jobs" className="text-sm font-medium text-neutral-400 hover:text-neutral-900">
              View all →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            {recentJobs.length > 0 ? (
              <div className="divide-y divide-neutral-50">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex flex-col gap-3 px-4 py-4 hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                        {job.companyLogo ? (
                          <Image src={job.companyLogo} alt={job.company} fill className="object-contain p-1" unoptimized />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400">
                            {job.company[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">{job.title}</p>
                        <p className="text-xs text-neutral-500">{job.company} · {timeAgo(job.postedAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-auto">
                      {job.featured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Featured
                        </span>
                      )}
                      <span className="text-xs text-neutral-400">{formatSalary(job)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-neutral-400">No jobs yet</p>
                <Link href="/admin/jobs" className="mt-2 block text-sm font-medium text-neutral-900 underline">
                  Post your first job
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick stats sidebar */}
        <div>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-neutral-900">By Category</h2>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            {stats.categories > 0 ? (
              <div className="space-y-3">
                {Array.from(
                  jobs.reduce((acc, j) => {
                    acc.set(j.category, (acc.get(j.category) ?? 0) + 1);
                    return acc;
                  }, new Map<string, number>())
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <BarChart3 size={13} className="flex-shrink-0 text-neutral-300" />
                        <span className="truncate text-sm text-neutral-700">{category}</span>
                      </div>
                      <span className="flex-shrink-0 text-sm font-semibold text-neutral-900">{count}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
