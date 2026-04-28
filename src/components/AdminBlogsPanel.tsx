'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import AdminDataTable from '@/components/AdminDataTable';

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
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Blog Posts</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 sm:w-auto"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total Posts</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{blogs.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Published</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">
            {blogs.filter((blog) => blog.status === 'published').length}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Drafts</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">
            {blogs.filter((blog) => blog.status !== 'published').length}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <AdminDataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'status', label: 'Status' },
          { key: 'updated', label: 'Updated' },
          { key: 'actions', label: 'Actions', className: 'text-right' },
        ]}
        rows={blogs}
        rowKey={(blog) => blog.id}
        scrollHeightClass="h-[clamp(18rem,calc(100dvh-20rem),36rem)]"
        renderRow={(blog) => (
          <>
            <td className="px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">{blog.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{blog.excerpt}</p>
            </td>
            <td className="px-4 py-3">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  blog.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
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
          </>
        )}
        emptyState={
          <>
            <p className="text-neutral-400">No posts yet.</p>
            <Link href="/admin/blogs/new" className="mt-3 inline-block text-sm font-medium text-neutral-900 underline">
              Write your first blog post
            </Link>
          </>
        }
      />

      <div className="space-y-3 md:hidden">
        {blogs.map((blog) => (
          <div key={blog.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold text-neutral-900">{blog.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{blog.excerpt}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  blog.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {blog.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-neutral-500">{timeAgo(blog.updatedAt)}</p>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  title="Edit post"
                >
                  <Pencil size={15} />
                </Link>
                {blog.status === 'published' && (
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    title="Open post"
                  >
                    <ExternalLink size={15} />
                  </Link>
                )}
                <button
                  onClick={() => remove(blog.id)}
                  disabled={deletingId === blog.id}
                  className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Delete post"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="rounded-2xl border border-neutral-100 bg-white py-12 text-center shadow-sm">
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
