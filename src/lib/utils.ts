import { formatDistanceToNow } from 'date-fns';
import { Job } from '@/types';

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatSalary(job: Job): string {
  if (!job.salary) return 'Salary not disclosed';
  const { min, max, currency, period } = job.salary;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  const periodLabel = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';
  return `${fmt(min)} – ${fmt(max)}${periodLabel}`;
}

export function jobTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
    internship: 'Internship',
  };
  return map[type] ?? type;
}

export function locationTypeLabel(type: string): string {
  const map: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  };
  return map[type] ?? type;
}

export function experienceLevelLabel(level: string): string {
  const map: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level',
    lead: 'Lead',
    executive: 'Executive',
  };
  return map[level] ?? level;
}

export function generateJobSchema(job: Job) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.sourceUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: job.location,
    },
    employmentType: job.jobType.toUpperCase().replace('-', '_'),
    datePosted: job.postedAt,
    validThrough: job.expiresAt,
    baseSalary: job.salary
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salary.currency,
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary.min,
            maxValue: job.salary.max,
            unitText: job.salary.period === 'year' ? 'YEAR' : 'MONTH',
          },
        }
      : undefined,
    applicantLocationRequirements:
      job.locationType === 'remote'
        ? { '@type': 'Country', name: 'Worldwide' }
        : undefined,
    jobLocationType: job.locationType === 'remote' ? 'TELECOMMUTE' : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/jobs/${job.slug}`,
    directApply: false,
  };
}
