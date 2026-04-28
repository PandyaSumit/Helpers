import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  MapPin,
  Clock,
  DollarSign,
  ExternalLink,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";
import { getJobBySlug } from "@/lib/jobs";
import {
  timeAgo,
  formatSalary,
  jobTypeLabel,
  locationTypeLabel,
  experienceLevelLabel,
  generateJobSchema,
} from "@/lib/utils";
import ShareButton from "@/components/ShareButton";

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
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: job.postedAt,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const locationTypeColors: Record<string, string> = {
  remote: "bg-neutral-100 text-neutral-700 border-neutral-200",
  hybrid: "bg-neutral-100 text-neutral-700 border-neutral-200",
  onsite: "bg-neutral-100 text-neutral-700 border-neutral-200",
};

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const schema = generateJobSchema(job);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/jobs"
        className="mb-7 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors duration-200 hover:text-neutral-900"
      >
        <ArrowLeft size={14} />
        Back to jobs
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <header className="border-b border-neutral-200 pb-7">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {job.companyLogo ? (
                  <Image
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    fill
                    className="object-contain p-2.5"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl font-bold text-neutral-400">
                    {job.company[0]}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-neutral-600">{job.company}</p>
                  {job.featured && (
                    <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="mt-1 text-[clamp(1.6rem,6.2vw,2.25rem)] font-semibold leading-tight text-neutral-900">
                  {job.title}
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                  Posted {timeAgo(job.postedAt)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${locationTypeColors[job.locationType] ?? "bg-neutral-100 text-neutral-700 border-neutral-200"}`}
              >
                <MapPin size={13} />
                {job.location} · {locationTypeLabel(job.locationType)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <Clock size={13} />
                {jobTypeLabel(job.jobType)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                <BriefcaseBusiness size={13} />
                {experienceLevelLabel(job.experienceLevel)}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700">
                  <DollarSign size={13} />
                  {formatSalary(job)}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?search=${encodeURIComponent(tag)}`}
                  className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          <section className="py-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 sm:text-xl">
              About the role
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-neutral-700 sm:text-[15px]">
              {job.description}
            </p>
          </section>

          <section className="border-t border-neutral-200 py-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 sm:text-xl">
              Responsibilities
            </h2>
            <ul className="space-y-3">
              {job.responsibilities.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-7 text-neutral-700 sm:text-[15px]"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-neutral-200 py-8">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900 sm:text-xl">
              Requirements
            </h2>
            <ul className="space-y-3">
              {job.requirements.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-7 text-neutral-700 sm:text-[15px]"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-900" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {job.niceToHave && job.niceToHave.length > 0 && (
            <section className="border-t border-neutral-200 py-8">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900 sm:text-xl">
                Nice to have
              </h2>
              <ul className="space-y-3">
                {job.niceToHave.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm leading-7 text-neutral-600 sm:text-[15px]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="lg:border-l lg:border-neutral-200 lg:pl-8">
          <div className="space-y-5 lg:sticky lg:top-24">
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-700"
            >
              Apply now <ExternalLink size={14} />
            </a>
            <p className="text-center text-xs text-neutral-500">
              Opens the original job posting on {job.company}&apos;s site
            </p>

            <div className="space-y-3 border-y border-neutral-200 py-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Quick facts
              </h2>
              {[
                ["Company", job.company],
                ["Location", job.location],
                ["Type", jobTypeLabel(job.jobType)],
                ["Level", experienceLevelLabel(job.experienceLevel)],
                ["Category", job.category],
                ...(job.salary ? [["Salary", formatSalary(job)]] : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-3 text-xs sm:text-sm"
                >
                  <span className="text-neutral-500">{label}</span>
                  <span className="text-right font-medium text-neutral-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <ShareButton />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
