import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostEditor from '@/components/BlogPostEditor';
import { getBlogById } from '@/lib/blogs';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Blog Post — Admin',
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogById(id);
  if (!post) notFound();
  return <BlogPostEditor mode="edit" initialBlog={post} />;
}
