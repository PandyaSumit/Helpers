import type { Metadata } from 'next';
import BlogPostEditor from '@/components/BlogPostEditor';

export const metadata: Metadata = {
  title: 'New Blog Post — Admin',
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <div className="lg:-mx-10 lg:-mb-12 lg:-mt-8">
      <BlogPostEditor mode="create" />
    </div>
  );
}
