'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, Edit3, ExternalLink, Star, StarOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Job } from '@/types';
import { timeAgo, formatSalary } from '@/lib/utils';
import AdminDataTable from '@/components/AdminDataTable';

interface AdminPanelProps {
  initialJobs: Job[];
}

const EMPTY_FORM = {
  title: '',
  company: '',
  companyLogo: '',
  location: '',
  locationType: 'remote',
  jobType: 'full-time',
  experienceLevel: 'mid',
  category: 'Engineering',
  description: '',
  responsibilities: '',
  requirements: '',
  niceToHave: '',
  tags: '',
  applicationUrl: '',
  sourceUrl: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  featured: false,
};

type FormState = typeof EMPTY_FORM;

export default function AdminPanel({ initialJobs }: AdminPanelProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo ?? '',
      location: job.location,
      locationType: job.locationType,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      category: job.category,
      description: job.description,
      responsibilities: job.responsibilities.join('\n'),
      requirements: job.requirements.join('\n'),
      niceToHave: (job.niceToHave ?? []).join('\n'),
      tags: job.tags.join(', '),
      applicationUrl: job.applicationUrl,
      sourceUrl: job.sourceUrl,
      salaryMin: job.salary?.min?.toString() ?? '',
      salaryMax: job.salary?.max?.toString() ?? '',
      salaryCurrency: job.salary?.currency ?? 'USD',
      featured: job.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        company: form.company,
        companyLogo: form.companyLogo,
        location: form.location,
        locationType: form.locationType,
        jobType: form.jobType,
        experienceLevel: form.experienceLevel,
        category: form.category,
        description: form.description,
        responsibilities: form.responsibilities.split('\n').filter(Boolean),
        requirements: form.requirements.split('\n').filter(Boolean),
        niceToHave: form.niceToHave.split('\n').filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        applicationUrl: form.applicationUrl,
        sourceUrl: form.sourceUrl || form.applicationUrl,
        featured: form.featured,
        salary:
          form.salaryMin && form.salaryMax
            ? {
                min: parseInt(form.salaryMin),
                max: parseInt(form.salaryMax),
                currency: form.salaryCurrency,
                period: 'year',
              }
            : undefined,
      };

      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)));
        showToast('success', 'Job updated successfully');
      } else {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setJobs((prev) => [created, ...prev]);
        showToast('success', 'Job posted successfully');
      }

      setShowForm(false);
      setEditingJob(null);
    } catch {
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('success', 'Job deleted');
    } catch {
      showToast('error', 'Failed to delete job');
    }
  };

  const toggleFeatured = async (job: Job) => {
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !job.featured }),
      });
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
    } catch {
      showToast('error', 'Failed to update job');
    }
  };

  const inputCls = 'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100';
  const labelCls = 'block mb-1 text-xs font-semibold text-neutral-600 uppercase tracking-wide';

  useEffect(() => {
    if (!showForm) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showForm]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
              : 'bg-red-50 text-red-800 ring-1 ring-red-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Job Listings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {jobs.length} {jobs.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 sm:w-auto"
        >
          <Plus size={16} />
          New Job
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total Jobs</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{jobs.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Featured</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{jobs.filter((job) => job.featured).length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Companies</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">{new Set(jobs.map((job) => job.company)).size}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Remote</p>
          <p className="mt-2 text-2xl font-bold text-neutral-900">
            {jobs.filter((job) => job.locationType === 'remote').length}
          </p>
        </div>
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm">
          <div className="flex h-full items-end justify-center p-0 sm:items-center sm:px-6 sm:py-6">
            <div className="flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-[min(92dvh,900px)] sm:rounded-2xl">
              <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {editingJob ? 'Edit Job' : 'Post New Job'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Job Title *</label>
                    <input required className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Senior Frontend Engineer" />
                  </div>
                  <div>
                    <label className={labelCls}>Company *</label>
                    <input required className={inputCls} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Corp" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Company Logo URL</label>
                  <input className={inputCls} value={form.companyLogo} onChange={(e) => setForm((f) => ({ ...f, companyLogo: e.target.value }))} placeholder="https://logo.clearbit.com/company.com" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Location *</label>
                    <input required className={inputCls} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Remote / New York, NY" />
                  </div>
                  <div>
                    <label className={labelCls}>Location Type</label>
                    <select className={inputCls} value={form.locationType} onChange={(e) => setForm((f) => ({ ...f, locationType: e.target.value }))}>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>Job Type</label>
                    <select className={inputCls} value={form.jobType} onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))}>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Experience Level</label>
                    <select className={inputCls} value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select className={inputCls} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Data & AI</option>
                      <option>Marketing</option>
                      <option>Product</option>
                      <option>Operations</option>
                      <option>Sales</option>
                      <option>Finance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Application URL *</label>
                  <input required type="url" className={inputCls} value={form.applicationUrl} onChange={(e) => setForm((f) => ({ ...f, applicationUrl: e.target.value }))} placeholder="https://company.com/jobs/role" />
                </div>

                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea required rows={3} className={inputCls} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief overview of the role…" />
                </div>

                <div>
                  <label className={labelCls}>Responsibilities (one per line)</label>
                  <textarea rows={4} className={inputCls} value={form.responsibilities} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))} placeholder="Lead frontend development&#10;Collaborate with designers&#10;…" />
                </div>

                <div>
                  <label className={labelCls}>Requirements (one per line)</label>
                  <textarea rows={4} className={inputCls} value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} placeholder="5+ years React experience&#10;TypeScript proficiency&#10;…" />
                </div>

                <div>
                  <label className={labelCls}>Nice to Have (one per line)</label>
                  <textarea rows={3} className={inputCls} value={form.niceToHave} onChange={(e) => setForm((f) => ({ ...f, niceToHave: e.target.value }))} placeholder="GraphQL knowledge&#10;Open source contributions&#10;…" />
                </div>

                <div>
                  <label className={labelCls}>Tags (comma-separated)</label>
                  <input className={inputCls} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="React, TypeScript, Node.js" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>Salary Min (USD/yr)</label>
                    <input type="number" className={inputCls} value={form.salaryMin} onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))} placeholder="120000" />
                  </div>
                  <div>
                    <label className={labelCls}>Salary Max (USD/yr)</label>
                    <input type="number" className={inputCls} value={form.salaryMax} onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))} placeholder="160000" />
                  </div>
                  <div>
                    <label className={labelCls}>Currency</label>
                    <select className={inputCls} value={form.salaryCurrency} onChange={(e) => setForm((f) => ({ ...f, salaryCurrency: e.target.value }))}>
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>CAD</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                    Mark as featured
                  </label>
                </div>

                </div>
                <div className="flex flex-shrink-0 justify-end gap-3 border-t border-neutral-100 bg-white px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving…' : editingJob ? 'Save Changes' : 'Post Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Job List */}
      <AdminDataTable
        columns={[
          { key: 'job', label: 'Job' },
          { key: 'type', label: 'Type' },
          { key: 'salary', label: 'Salary' },
          { key: 'posted', label: 'Posted' },
          { key: 'actions', label: 'Actions', className: 'text-right' },
        ]}
        rows={jobs}
        rowKey={(job) => job.id}
        scrollHeightClass="h-[clamp(26rem,calc(100dvh-15.5rem),52rem)]"
        renderRow={(job) => (
          <>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                  {job.companyLogo ? (
                    <Image src={job.companyLogo} alt={job.company} fill className="object-contain p-1" unoptimized />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400">
                      {job.company[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-900">{job.title}</p>
                    {job.featured && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{job.company}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-xs text-neutral-600 capitalize">{job.jobType}</td>
            <td className="px-4 py-3 text-xs text-neutral-600">{formatSalary(job)}</td>
            <td className="px-4 py-3 text-xs text-neutral-500">{timeAgo(job.postedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => toggleFeatured(job)}
                  title={job.featured ? 'Remove featured' : 'Mark featured'}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600"
                >
                  {job.featured ? <StarOff size={14} /> : <Star size={14} />}
                </button>
                <Link
                  href={`/jobs/${job.slug}`}
                  target="_blank"
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={() => openEdit(job)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </>
        )}
        emptyState={
          <>
            <p className="text-neutral-400">No jobs yet.</p>
            <button onClick={openCreate} className="mt-3 text-sm font-medium text-neutral-900 underline">
              Post your first job
            </button>
          </>
        }
      />

      <div className="space-y-3 md:hidden">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                  {job.companyLogo ? (
                    <Image src={job.companyLogo} alt={job.company} fill className="object-contain p-1" unoptimized />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400">
                      {job.company[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">{job.title}</p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">{job.company}</p>
                </div>
              </div>
              {job.featured && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <p className="rounded-lg bg-neutral-50 px-2 py-1 capitalize">{job.jobType}</p>
              <p className="rounded-lg bg-neutral-50 px-2 py-1 text-right">{timeAgo(job.postedAt)}</p>
              <p className="col-span-2 rounded-lg bg-neutral-50 px-2 py-1">{formatSalary(job)}</p>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1">
              <button
                onClick={() => toggleFeatured(job)}
                title={job.featured ? 'Remove featured' : 'Mark featured'}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600"
              >
                {job.featured ? <StarOff size={15} /> : <Star size={15} />}
              </button>
              <Link
                href={`/jobs/${job.slug}`}
                target="_blank"
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <ExternalLink size={15} />
              </Link>
              <button
                onClick={() => openEdit(job)}
                className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => handleDelete(job.id)}
                className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="rounded-2xl border border-neutral-100 bg-white py-12 text-center shadow-sm">
            <p className="text-neutral-400">No jobs yet.</p>
            <button onClick={openCreate} className="mt-3 text-sm font-medium text-neutral-900 underline">
              Post your first job
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
