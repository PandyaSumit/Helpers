import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Job } from "@/types";
import {
  timeAgo,
  formatSalary,
  jobTypeLabel,
  locationTypeLabel,
} from "@/lib/utils";

const locationTypeColors: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700",
  hybrid: "bg-blue-50 text-blue-700",
  onsite: "bg-orange-50 text-orange-700",
};

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block border-b border-neutral-200 py-6 transition-colors duration-200 hover:bg-neutral-50/60"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-white">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  fill
                  className="object-contain p-1.5"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400">
                  {job.company[0]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm font-medium text-neutral-600">{job.company}</p>
              {featured && (
                <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                  Featured
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold leading-snug text-neutral-900 transition-colors duration-200 group-hover:text-neutral-700 sm:text-xl">
            {job.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
            {job.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-neutral-500">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${locationTypeColors[job.locationType] ?? "bg-neutral-100 text-neutral-600"}`}
            >
              {locationTypeLabel(job.locationType)}
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <MapPin size={12} />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Clock size={12} />
              {jobTypeLabel(job.jobType)}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1.5 text-xs">
                <DollarSign size={12} />
                {formatSalary(job)}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-4 md:flex-col md:items-end md:justify-start md:pt-1">
          <span className="text-xs text-neutral-400">
            {timeAgo(job.postedAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 transition-colors duration-200 group-hover:text-neutral-900">
            View role
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
