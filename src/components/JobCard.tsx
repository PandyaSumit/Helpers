import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Job } from "@/types";
import { timeAgo, formatSalary, jobTypeLabel, locationTypeLabel } from "@/lib/utils";

const locationTypeBadge: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700 border-emerald-100",
  hybrid: "bg-blue-50 text-blue-700 border-blue-100",
  onsite: "bg-orange-50 text-orange-700 border-orange-100",
};

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block px-5 py-5 transition-colors duration-150 hover:bg-neutral-50/80 sm:px-6 sm:py-6"
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${job.company} logo`}
              fill
              className="object-contain p-1.5"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-400">
              {job.company[0]}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-neutral-500">
              {job.company}
            </span>
            {featured && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                Featured
              </span>
            )}
          </div>

          <h3 className="mt-0.5 text-base font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-neutral-700 sm:text-lg">
            {job.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-500">
            {job.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${locationTypeBadge[job.locationType] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}
            >
              {locationTypeLabel(job.locationType)}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <MapPin size={11} />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock size={11} />
              {jobTypeLabel(job.jobType)}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <DollarSign size={11} />
                {formatSalary(job)}
              </span>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden shrink-0 flex-col items-end gap-3 sm:flex">
          <span className="text-xs text-neutral-400">{timeAgo(job.postedAt)}</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 transition-colors group-hover:text-neutral-700">
            View <ArrowUpRight size={12} />
          </span>
        </div>
      </div>

      {/* Mobile timestamp */}
      <p className="mt-2 text-right text-xs text-neutral-400 sm:hidden">
        {timeAgo(job.postedAt)}
      </p>
    </Link>
  );
}
