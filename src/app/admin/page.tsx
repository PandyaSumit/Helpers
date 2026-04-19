import type { Metadata } from 'next';
import AdminPanel from './AdminPanel';
import { getAllJobs } from '@/lib/jobs';

export const metadata: Metadata = {
  title: 'Admin — Manage Jobs',
  description: 'Admin panel for managing job listings.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const jobs = await getAllJobs();
  return <AdminPanel initialJobs={jobs} />;
}
