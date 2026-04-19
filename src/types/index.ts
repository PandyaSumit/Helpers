export type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type LocationType = 'remote' | 'hybrid' | 'onsite';

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  locationType: LocationType;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'year' | 'month' | 'hour';
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  tags: string[];
  category: string;
  applicationUrl: string;
  sourceUrl: string;
  featured: boolean;
  postedAt: string;
  expiresAt?: string;
  views: number;
}

export interface JobFilters {
  search: string;
  category: string;
  jobType: string;
  experienceLevel: string;
  locationType: string;
  tags: string[];
}
