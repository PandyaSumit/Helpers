import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedJobs, getStats } from "@/lib/jobs";
import { getLatestBlogs } from "@/lib/blogs";
import JobCard from "@/components/JobCard";
import BlogCard from "@/components/BlogCard";
import HeroSearch from "@/components/HeroSearch";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpers — Curated Tech Jobs from Top Companies",
  description:
    "Discover hand-picked engineering, design, and product opportunities from top companies. No noise, just great jobs.",
  openGraph: {
    title: "Helpers — Curated Tech Jobs from Top Companies",
    description:
      "Discover hand-picked engineering, design, and product opportunities.",
    type: "website",
  },
};

const CATEGORIES = [
  { name: "Engineering", icon: "⚙️" },
  { name: "Design", icon: "🎨" },
  { name: "Data & AI", icon: "🤖" },
  { name: "Marketing", icon: "📣" },
  { name: "Product", icon: "📦" },
  { name: "Operations", icon: "🔧" },
];

const POPULAR_SEARCHES = [
  "React",
  "Python",
  "Product Manager",
  "UI/UX",
  "Remote",
  "Internship",
];

export default async function HomePage() {
  const [featuredJobs, stats, latestBlogs] = await Promise.all([
    getFeaturedJobs(),
    getStats(),
    getLatestBlogs(3),
  ]);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-amber-50/50 via-white to-white px-4 pb-16 pt-20 sm:pb-20 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          {/* Live badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {stats.total} curated opportunities live right now
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Hand-picked roles from top companies. No spam, no noise — just
            opportunities worth your time.
          </p>

          <div className="mt-8">
            <HeroSearch />
          </div>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-neutral-400">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/jobs?search=${encodeURIComponent(term)}`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="border-y border-neutral-200 bg-white px-4 py-6 sm:px-6">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { label: "Active Jobs", value: stats.total },
            { label: "Companies", value: stats.companies },
            { label: "Remote Jobs", value: stats.remote },
            { label: "Categories", value: stats.categories },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <dd className="text-2xl font-bold text-neutral-900">{value}</dd>
              <dt className="mt-0.5 text-xs text-neutral-500">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Featured Jobs ─────────────────────────────────────── */}
        <section className="py-14">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Featured
              </p>
              <h2 className="mt-1 text-2xl font-bold text-neutral-900">
                Top Opportunities
              </h2>
            </div>
            <Link
              href="/jobs"
              className="hidden items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:inline-flex"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 py-14 text-center">
              <p className="text-sm text-neutral-400">No featured jobs yet.</p>
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              View all jobs <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── Browse by Category ────────────────────────────────── */}
        <section className="border-t border-neutral-200 py-14">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Explore
            </p>
            <h2 className="mt-1 text-2xl font-bold text-neutral-900">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map(({ name, icon }) => (
              <Link
                key={name}
                href={`/jobs?category=${encodeURIComponent(name)}`}
                className="flex flex-col items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 py-5 text-center transition-all duration-150 hover:border-neutral-300 hover:shadow-sm"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-neutral-700">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Blog ─────────────────────────────────────────────── */}
        {latestBlogs.length > 0 && (
          <section className="border-t border-neutral-200 py-14">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Insights
                </p>
                <h2 className="mt-1 text-2xl font-bold text-neutral-900">
                  From the Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:inline-flex"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="border-t border-neutral-200 py-14">
          <div className="rounded-2xl bg-neutral-900 px-8 py-12 text-center sm:py-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to find your next role?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
              Every listing is reviewed before it goes live. Quality over
              quantity — always.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                Browse all jobs <ArrowRight size={14} />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
