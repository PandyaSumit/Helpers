import { NextRequest, NextResponse } from 'next/server';
import { createBlog, getPublishedBlogs } from '@/lib/blogs';
import { isAdminRequest } from '@/lib/admin-auth';

export async function GET() {
  const blogs = await getPublishedBlogs();
  return NextResponse.json(blogs);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const blog = await createBlog({
      title: body.title,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      contentHtml: body.contentHtml,
      tags: body.tags ?? [],
      featured: body.featured ?? false,
      status: body.status ?? 'draft',
      publishedAt: body.publishedAt,
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
