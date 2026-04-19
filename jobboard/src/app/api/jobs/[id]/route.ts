import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, saveJob, deleteJob } from '@/lib/jobs';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const jobs = getAllJobs();
    const existing = jobs.find((j) => j.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const updated = { ...existing, ...body, id };
    saveJob(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  deleteJob(id);
  return NextResponse.json({ success: true });
}
