import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, DollarSign, Zap } from 'lucide-react';
import { Job } from '@/types';
import { timeAgo, formatSalary, jobTypeLabel, locationTypeLabel } from '@/lib/utils';

const locationTypeColors: Record<string, string> = {
  remote: 'bg-emerald-50 text-emerald-700',
  hybrid: 'bg-blue-50 text-blue-700',
  onsite: 'bg-orange-50 text-orange-700',
};

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`group block rounded-2xl border bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-200 hover:shadow-md ${
        featured
          ? 'border-neutral-200 shadow-sm ring-1 ring-neutral-100'
          : 'border-neutral-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-400">
                {job.company[0]}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500">{job.company}</p>
            <h3 className="mt-0.5 text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 sm:text-base">
              {job.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          {featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <Zap size={10} />
              Featured
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              locationTypeColors[job.locationType] ?? 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {locationTypeLabel(job.locationType)}
          </span>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-neutral-500 sm:text-sm">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={12} />
          {job.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-500">
          <Clock size={12} />
          {jobTypeLabel(job.jobType)}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <DollarSign size={12} />
            {formatSalary(job)}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 4 && (
          <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-400">
            +{job.tags.length - 4}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-neutral-400">{timeAgo(job.postedAt)}</span>
        <span className="text-xs font-medium text-neutral-900 underline-offset-2 group-hover:underline">
          View details →
        </span>
      </div>
    </Link>
  );
}
