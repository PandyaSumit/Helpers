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
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <article>
        <header className="border-b border-neutral-200 pb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
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
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{blog.title}</h1>
          <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">{blog.excerpt}</p>
          {blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {blog.coverImage && (
          <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-80">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
          </div>
        )}

        <div
          className="blog-prose mt-8 text-[17px] leading-relaxed text-neutral-700"
          dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
        />
      </article>
    </main>
  );
}
