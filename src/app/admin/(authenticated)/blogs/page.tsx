import type { Metadata } from 'next';
import { getAllBlogsAdmin } from '@/lib/blogs';
import AdminBlogsPanel from '@/components/AdminBlogsPanel';

export const metadata: Metadata = {
  title: 'Blogs — Admin',
  robots: { index: false, follow: false },
};

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogsAdmin();
  return <AdminBlogsPanel initialBlogs={blogs} />;
}
