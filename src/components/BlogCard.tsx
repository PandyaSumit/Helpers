import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { timeAgo } from '@/lib/utils';

export default function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-sm sm:rounded-2xl">
      <Link href={`/blog/${blog.slug}`} className="block">
        {blog.coverImage ? (
          <div className="relative h-40 w-full bg-neutral-100 sm:h-44">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-r from-neutral-100 to-neutral-200 sm:h-44" />
        )}
      </Link>

      <div className="p-4 sm:p-5">
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

        <Link href={`/blog/${blog.slug}`}>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-neutral-900 transition-colors hover:text-neutral-700 sm:text-xl">
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {blog.excerpt}
        </p>

        {blog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
