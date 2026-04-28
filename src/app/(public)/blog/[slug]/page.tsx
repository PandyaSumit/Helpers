import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPublishedBlogBySlug } from '@/lib/blogs';
import { timeAgo } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) return {};

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      images: blog.coverImage ? [blog.coverImage] : undefined,
      publishedTime: blog.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <article>
        <header className="border-b border-neutral-200 pb-5 sm:pb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 sm:text-xs">
            <span>{blog.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>{timeAgo(blog.publishedAt ?? blog.createdAt)}</span>
            {blog.featured && (
              <>
                <span>•</span>
                <span className="font-medium text-amber-700">Featured</span>
              </>
            )}
          </div>
          <h1 className="text-[clamp(1.65rem,5.5vw,2.45rem)] font-bold tracking-tight text-neutral-900">
            {blog.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg">
            {blog.excerpt}
          </p>
          {blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {blog.coverImage && (
          <div className="relative mt-5 h-48 w-full overflow-hidden rounded-xl bg-neutral-100 sm:mt-6 sm:h-72 sm:rounded-2xl md:h-80">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
          </div>
        )}

        <div
          className="blog-prose mt-6 text-neutral-700 sm:mt-8"
          dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
        />
      </article>
    </main>
  );
}
