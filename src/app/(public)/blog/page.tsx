import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { getPublishedBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Blog — Helpers",
  description:
    "Editorial guides for job seekers: hiring trends, interview prep, resume advice, and curated career insights.",
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Insights
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
          Guides, market updates, and career insights from our curation team.
        </p>
      </div>

      {blogs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-base font-semibold text-neutral-400">
            No posts published yet
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Check back soon for fresh content.
          </p>
        </div>
      )}
    </main>
  );
}
