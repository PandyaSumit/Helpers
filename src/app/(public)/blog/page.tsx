import type { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { getPublishedBlogs } from '@/lib/blogs';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Editorial guides for job seekers: hiring trends, interview prep, resume advice, and curated career insights.',
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-neutral-200 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Blog</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Insights, guides, and market updates from our curation team.
        </p>
      </div>

      {blogs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-lg font-semibold text-neutral-400">No blog posts published yet</p>
          <p className="mt-1 text-sm text-neutral-400">Check back soon for fresh content.</p>
        </div>
      )}
    </main>
  );
}
