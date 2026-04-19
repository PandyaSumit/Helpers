import { MetadataRoute } from 'next';
import { getAllJobs } from '@/lib/jobs';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getAllJobs();

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE}/jobs/${job.slug}`,
    lastModified: new Date(job.postedAt),
    changeFrequency: 'weekly',
    priority: job.featured ? 0.9 : 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...jobEntries,
  ];
}
