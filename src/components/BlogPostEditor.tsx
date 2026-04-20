'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { BlogPost, BlogStatus } from '@/types';

interface BlogPostEditorProps {
  mode: 'create' | 'edit';
  initialBlog?: BlogPost;
}

const EMPTY_CONTENT = '<p></p>';

export default function BlogPostEditor({ mode, initialBlog }: BlogPostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlog?.title ?? '');
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt ?? '');
  const [coverImage, setCoverImage] = useState(initialBlog?.coverImage ?? '');
  const [tagsInput, setTagsInput] = useState((initialBlog?.tags ?? []).join(', '));
  const [featured, setFeatured] = useState(initialBlog?.featured ?? false);
  const [status, setStatus] = useState<BlogStatus>(initialBlog?.status ?? 'draft');
  const [contentHtml, setContentHtml] = useState(initialBlog?.contentHtml ?? EMPTY_CONTENT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const readingTime = useMemo(() => {
    const words = contentHtml
      .replace(/<[^>]+>/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
  }, [contentHtml]);

  const onSubmit = async (nextStatus: BlogStatus) => {
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!contentHtml || contentHtml === '<p></p>') {
      setError('Please add content before saving.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim() || undefined,
        tags: tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        featured,
        status: nextStatus,
        contentHtml,
      };

      const endpoint = mode === 'create' ? '/api/blogs' : `/api/blogs/${initialBlog?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const response = await res.json();
        throw new Error(response.error ?? 'Failed to save post.');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/blogs"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft size={14} />
            Back to blogs
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">
            {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Write with a clean editorial canvas and publish when ready.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(status)}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
          >
            <Save size={15} />
            Save
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit('published')}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            <Send size={15} />
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a clear, compelling headline..."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-3xl font-bold tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />

          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary for cards and SEO. Leave empty to auto-generate."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
          />

          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Post Settings</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BlogStatus)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Cover Image URL
                </label>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Tags
                </label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Hiring, Career Tips, Resume"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                Feature this post
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-900">Quick Info</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
              <li>{readingTime} min read</li>
              <li>{contentHtml.replace(/<[^>]+>/g, ' ').trim().length} characters</li>
              <li className="inline-flex items-center gap-1">
                <Eye size={14} />
                Live formatting preview in editor
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
