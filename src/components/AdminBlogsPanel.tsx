'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

export default function AdminBlogsPanel({ initialBlogs }: { initialBlogs: BlogPost[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const remove = async (id: string) => {
    if (!confirm('Delete this post? This action cannot be undone.')) return;
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to delete post');
      }
      setBlogs((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Blog Posts</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-neutral-900">{blog.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{blog.excerpt}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        blog.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{timeAgo(blog.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title="Edit post"
                      >
                        <Pencil size={14} />
                      </Link>
                      {blog.status === 'published' && (
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          title="Open post"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                      <button
                        onClick={() => remove(blog.id)}
                        disabled={deletingId === blog.id}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {blogs.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-neutral-400">No posts yet.</p>
            <Link href="/admin/blogs/new" className="mt-3 inline-block text-sm font-medium text-neutral-900 underline">
              Write your first blog post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
