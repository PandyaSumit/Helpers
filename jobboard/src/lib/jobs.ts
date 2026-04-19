import { Job, JobFilters } from '@/types';
import jobsData from '@/data/jobs.json';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/jobs.json');

export function getAllJobs(): Job[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as Job[];
  } catch {
    return jobsData as Job[];
  }
}

export function getJobBySlug(slug: string): Job | undefined {
  return getAllJobs().find((j) => j.slug === slug);
}

export function getFeaturedJobs(): Job[] {
  return getAllJobs().filter((j) => j.featured);
}

export function filterJobs(jobs: Job[], filters: Partial<JobFilters>): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q)) ||
        job.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.category && filters.category !== 'all') {
      if (job.category !== filters.category) return false;
    }
    if (filters.jobType && filters.jobType !== 'all') {
      if (job.jobType !== filters.jobType) return false;
    }
    if (filters.experienceLevel && filters.experienceLevel !== 'all') {
      if (job.experienceLevel !== filters.experienceLevel) return false;
    }
    if (filters.locationType && filters.locationType !== 'all') {
      if (job.locationType !== filters.locationType) return false;
    }
    return true;
  });
}

export function getCategories(): string[] {
  const jobs = getAllJobs();
  return Array.from(new Set(jobs.map((j) => j.category))).sort();
}

export function getStats() {
  const jobs = getAllJobs();
  return {
    total: jobs.length,
    companies: new Set(jobs.map((j) => j.company)).size,
    remote: jobs.filter((j) => j.locationType === 'remote').length,
    categories: new Set(jobs.map((j) => j.category)).size,
  };
}

export function saveJob(job: Job): void {
  const jobs = getAllJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    jobs[idx] = job;
  } else {
    jobs.unshift(job);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(jobs, null, 2));
}

export function deleteJob(id: string): void {
  const jobs = getAllJobs().filter((j) => j.id !== id);
  fs.writeFileSync(DATA_PATH, JSON.stringify(jobs, null, 2));
}

export function generateSlug(title: string, company: string): string {
  return `${title}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
