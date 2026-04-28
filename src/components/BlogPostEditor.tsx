"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Send, Image as ImageIcon, Tag, Star } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { BlogPost, BlogStatus } from "@/types";

interface BlogPostEditorProps {
  mode: "create" | "edit";
  initialBlog?: BlogPost;
}

const EMPTY_CONTENT = "<p></p>";

export default function BlogPostEditor({
  mode,
  initialBlog,
}: BlogPostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlog?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(
    initialBlog?.coverImage ?? ""
  );
  const [tagsInput, setTagsInput] = useState(
    (initialBlog?.tags ?? []).join(", ")
  );
  const [featured, setFeatured] = useState(initialBlog?.featured ?? false);
  const [status, setStatus] = useState<BlogStatus>(
    initialBlog?.status ?? "draft"
  );
  const [contentHtml, setContentHtml] = useState(
    initialBlog?.contentHtml ?? EMPTY_CONTENT
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showMeta, setShowMeta] = useState(false);

  const wordCount = useMemo(() => {
    return contentHtml
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
  }, [contentHtml]);

  const readingTime = useMemo(
    () => Math.max(1, Math.ceil(wordCount / 220)),
    [wordCount]
  );

  const onSubmit = async (nextStatus: BlogStatus) => {
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!contentHtml || contentHtml === "<p></p>") {
      setError("Please add some content before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        coverImage: coverImage.trim() || undefined,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured,
        status: nextStatus,
        contentHtml,
      };

      const endpoint =
        mode === "create" ? "/api/blogs" : `/api/blogs/${initialBlog?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save post.");
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* ── Sticky top bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Blogs</span>
          </Link>

          <span className="text-neutral-200">/</span>

          <span className="text-sm font-medium text-neutral-500">
            {mode === "create" ? "New post" : "Edit post"}
          </span>

          {status === "published" ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              Published
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-neutral-400 sm:block">
            {wordCount} words · {readingTime} min read
          </span>

          <button
            type="button"
            onClick={() => setShowMeta(!showMeta)}
            title="Post settings"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors sm:gap-2 ${
              showMeta
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <Tag size={14} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit(status)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => onSubmit("published")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>
      </header>

      {/* ── Error banner ───────────────────────────────────── */}
      {error && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ── Settings panel (slide-in) ──────────────────────── */}
      {showMeta && (
        <div className="border-b border-neutral-100 bg-neutral-50/80 px-4 py-5 sm:px-6">
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
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

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Tags
              </label>
              <div className="relative">
                <Tag
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Career, Tips"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-700 outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            {/* Cover image */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Cover Image URL
              </label>
              <div className="relative">
                <ImageIcon
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-8 pr-3 text-sm text-neutral-700 outline-none focus:border-neutral-400"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700">
                <span
                  onClick={() => setFeatured(!featured)}
                  className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                    featured
                      ? "border-amber-400 bg-amber-400 text-white"
                      : "border-neutral-300 bg-white text-transparent"
                  }`}
                >
                  <Star size={11} fill="currentColor" />
                </span>
                Feature this post
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── Writing area ───────────────────────────────────── */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-6 sm:py-14">
        {/* Cover preview */}
        {coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover"
              className="h-48 w-full object-cover sm:h-64"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          </div>
        )}

        {/* Title */}
        <textarea
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          className="w-full resize-none border-none bg-transparent text-3xl font-bold leading-tight tracking-tight text-neutral-900 outline-none placeholder:text-neutral-300 sm:text-4xl md:text-5xl"
          onInput={(e) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
        />

        {/* Excerpt / subtitle */}
        <textarea
          rows={1}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Add a brief subtitle or summary (optional, used for SEO)…"
          className="mt-3 w-full resize-none border-none bg-transparent text-lg leading-relaxed text-neutral-500 outline-none placeholder:text-neutral-300"
          onInput={(e) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
        />

        {/* Divider */}
        <div className="my-6 border-t border-neutral-100" />

        {/* Rich text editor */}
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>
    </div>
  );
}
