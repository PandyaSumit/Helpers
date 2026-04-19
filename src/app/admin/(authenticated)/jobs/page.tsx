import type { Metadata } from 'next';
import { getAllJobs } from '@/lib/jobs';
import AdminJobsPanel from '../../AdminPanel';

export const metadata: Metadata = {
  title: 'Jobs — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminJobsPage() {
  const jobs = await getAllJobs();
  return <AdminJobsPanel initialJobs={jobs} />;
}
