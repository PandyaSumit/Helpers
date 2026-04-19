import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Users, Layers } from 'lucide-react';
import { getFeaturedJobs, getStats } from '@/lib/jobs';
import JobCard from '@/components/JobCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JobBoard — Curated Tech Jobs from Top Companies',
  description:
    'Discover hand-picked engineering, design, and product opportunities from companies like Google, Stripe, Notion, and more. No noise, just great jobs.',
  openGraph: {
    title: 'JobBoard — Curated Tech Jobs from Top Companies',
    description: 'Discover hand-picked engineering, design, and product opportunities.',
    type: 'website',
  },
};

const CATEGORIES = [
  { name: 'Engineering', icon: '⚙️', color: 'bg-blue-50 border-blue-100' },
  { name: 'Design', icon: '🎨', color: 'bg-purple-50 border-purple-100' },
  { name: 'Data & AI', icon: '🤖', color: 'bg-green-50 border-green-100' },
  { name: 'Marketing', icon: '📣', color: 'bg-orange-50 border-orange-100' },
  { name: 'Product', icon: '🗺️', color: 'bg-pink-50 border-pink-100' },
  { name: 'Operations', icon: '🔧', color: 'bg-yellow-50 border-yellow-100' },
];

export default function HomePage() {
  const featuredJobs = getFeaturedJobs();
  const stats = getStats();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-neutral-100/80 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {stats.total} curated opportunities available
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Find your next great{' '}
            <span className="relative">
              <span className="relative z-10">opportunity</span>
              <span className="absolute bottom-1 left-0 z-0 h-3 w-full bg-amber-200/60" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">
            We curate and verify job postings from top companies so you don&apos;t have to sift through
            noise. Every listing is reviewed, structured, and linked directly to the application.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Browse all jobs
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/jobs?locationType=remote"
              className="flex items-center gap-2 rounded-xl border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              Remote only
              <Globe size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-100 bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { icon: <Briefcase size={20} />, value: stats.total, label: 'Active Jobs' },
            { icon: <Users size={20} />, value: stats.companies, label: 'Companies' },
            { icon: <Globe size={20} />, value: stats.remote, label: 'Remote Jobs' },
            { icon: <Layers size={20} />, value: stats.categories, label: 'Categories' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-100">
                {icon}
              </div>
              <div className="text-2xl font-bold text-neutral-900">{value}+</div>
              <div className="text-sm text-neutral-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Featured Jobs</h2>
              <p className="mt-1 text-sm text-neutral-500">Hand-picked opportunities worth your attention</p>
            </div>
            <Link
              href="/jobs"
              className="hidden items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} featured />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View all jobs <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-neutral-100 bg-neutral-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-neutral-900">Browse by Category</h2>
            <p className="mt-2 text-sm text-neutral-500">Explore opportunities across different disciplines</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm ${cat.color}`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-neutral-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-neutral-900 px-8 py-14 text-center">
          <h2 className="text-3xl font-bold text-white">Hiring great talent?</h2>
          <p className="mx-auto mt-4 max-w-md text-neutral-400">
            Submit a job opening and reach thousands of qualified candidates actively looking for their next role.
          </p>
          <Link
            href="/admin"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            Post a job <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
