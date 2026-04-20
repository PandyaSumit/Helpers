import type { Metadata } from 'next';
import BlogPostEditor from '@/components/BlogPostEditor';

export const metadata: Metadata = {
  title: 'New Blog Post — Admin',
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return <BlogPostEditor mode="create" />;
}
