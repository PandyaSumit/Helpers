import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedJobs, getStats } from "@/lib/jobs";
import { getLatestBlogs } from "@/lib/blogs";
import JobCard from "@/components/JobCard";
import BlogCard from "@/components/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Helpers — Curated Tech Jobs from Top Companies",
  description:
    "Discover hand-picked engineering, design, and product opportunities from companies like Google, Stripe, Notion, and more. No noise, just great jobs.",
  openGraph: {
    title: "Helpers — Curated Tech Jobs from Top Companies",
    description:
      "Discover hand-picked engineering, design, and product opportunities.",
    type: "website",
  },
};

const CATEGORIES = [
  "Engineering",
  "Design",
  "Data & AI",
  "Marketing",
  "Product",
  "Operations",
];

export default async function HomePage() {
  const [featuredJobs, stats, latestBlogs] = await Promise.all([
    getFeaturedJobs(),
    getStats(),
    getLatestBlogs(3),
  ]);

  return (
    <main className="px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm text-neutral-500">
            {stats.total} curated opportunities available right now.
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Find your next role without scrolling through noise.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            A clean, editorial-style job board for engineering, design, and
            product roles. We focus on readability and quality so every listing
            feels worth your time.
          </p>
          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Browse all jobs
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/jobs?locationType=remote"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Remote only
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-5xl border-y border-neutral-200 py-6">
        <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4">
          {[
            { label: "Active Jobs", value: stats.total },
            { label: "Companies", value: stats.companies },
            { label: "Remote Jobs", value: stats.remote },
            { label: "Categories", value: stats.categories },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">
                {label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-neutral-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-12 max-w-5xl">
        <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Featured Roles
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Hand-picked opportunities worth reading.
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-2">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} featured />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            View all jobs <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-semibold text-neutral-900">
          Browse by category
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Explore focused tracks if you already know where you want to go.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {CATEGORIES.map((name) => (
            <Link
              key={name}
              href={`/jobs?category=${encodeURIComponent(name)}`}
              className="rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-5xl border-t border-neutral-200 pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">From the blog</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Editorial insights for smarter job hunting.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {latestBlogs.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-neutral-200 py-10 text-center">
            <p className="text-sm text-neutral-400">No blog posts yet.</p>
          </div>
        )}
      </section>

      <section className="mx-auto mt-12 max-w-5xl border-t border-neutral-200 pt-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Why Helpers?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Every listing is reviewed before it goes live. Helpers is curated for
            job seekers, so public pages stay focused on quality roles, clear
            details, and a faster decision-making experience.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
            >
              Explore curated jobs <ArrowRight size={16} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
            >
              Read hiring insights
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
