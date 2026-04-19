import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { MapPin, Clock, DollarSign, ExternalLink, ArrowLeft, Building2, Zap } from 'lucide-react';
import { getJobBySlug } from '@/lib/jobs';
import { timeAgo, formatSalary, jobTypeLabel, locationTypeLabel, experienceLevelLabel, generateJobSchema } from '@/lib/utils';
import ShareButton from '@/components/ShareButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};

  const title = `${job.title} at ${job.company}`;
  const description = job.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: { title, description, type: 'article', publishedTime: job.postedAt },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const locationTypeColors: Record<string, string> = {
  remote: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  hybrid: 'bg-blue-50 text-blue-700 border-blue-100',
  onsite: 'bg-orange-50 text-orange-700 border-orange-100',
};

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const schema = generateJobSchema(job);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft size={14} />
        Back to jobs
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl font-bold text-neutral-400">
                    {job.company[0]}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-500">{job.company}</p>
                  {job.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <Zap size={10} /> Featured
                    </span>
                  )}
                </div>
                <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">{job.title}</h1>
                <p className="mt-1 text-xs text-neutral-400">Posted {timeAgo(job.postedAt)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${locationTypeColors[job.locationType] ?? 'bg-neutral-100 text-neutral-700'}`}>
                <MapPin size={13} />
                {job.location} · {locationTypeLabel(job.locationType)}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <Clock size={13} />
                {jobTypeLabel(job.jobType)}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <Building2 size={13} />
                {experienceLevelLabel(job.experienceLevel)}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700">
                  <DollarSign size={13} />
                  {formatSalary(job)}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?search=${encodeURIComponent(tag)}`}
                  className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">About the role</h2>
            <p className="leading-relaxed text-neutral-600">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Responsibilities</h2>
            <ul className="space-y-2.5">
              {job.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Requirements</h2>
            <ul className="space-y-2.5">
              {job.requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-900" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Nice to have */}
          {job.niceToHave && job.niceToHave.length > 0 && (
            <div className="mt-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Nice to have</h2>
              <ul className="space-y-2.5">
                {job.niceToHave.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-500">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="sticky top-20 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
            >
              Apply Now <ExternalLink size={14} />
            </a>
            <p className="mt-3 text-center text-xs text-neutral-400">
              Opens the original job posting on {job.company}&apos;s site
            </p>

            <div className="mt-6 space-y-3 border-t border-neutral-100 pt-5">
              {[
                ['Company', job.company],
                ['Location', job.location],
                ['Type', jobTypeLabel(job.jobType)],
                ['Level', experienceLevelLabel(job.experienceLevel)],
                ['Category', job.category],
                ...(job.salary ? [['Salary', formatSalary(job)]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-neutral-400">{label}</span>
                  <span className="text-xs font-medium text-neutral-700">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
