import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { timeAgo } from '@/lib/utils';

export default function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-sm">
      <Link href={`/blog/${blog.slug}`} className="block">
        {blog.coverImage ? (
          <div className="relative h-44 w-full bg-neutral-100">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-r from-neutral-100 to-neutral-200" />
        )}
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-neutral-500">
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
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-neutral-900 hover:text-neutral-700">
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{blog.excerpt}</p>

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
