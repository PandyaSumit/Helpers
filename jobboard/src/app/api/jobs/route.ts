import { NextRequest, NextResponse } from 'next/server';
import { getAllJobs, saveJob, generateSlug } from '@/lib/jobs';
import { Job } from '@/types';

export async function GET() {
  const jobs = getAllJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = Date.now().toString();
    const slug = generateSlug(body.title, body.company);

    const job: Job = {
      id,
      slug,
      title: body.title,
      company: body.company,
      companyLogo: body.companyLogo ?? '',
      location: body.location,
      locationType: body.locationType,
      jobType: body.jobType,
      experienceLevel: body.experienceLevel,
      salary: body.salary ?? undefined,
      description: body.description,
      responsibilities: body.responsibilities ?? [],
      requirements: body.requirements ?? [],
      niceToHave: body.niceToHave ?? [],
      tags: body.tags ?? [],
      category: body.category,
      applicationUrl: body.applicationUrl,
      sourceUrl: body.sourceUrl ?? body.applicationUrl,
      featured: body.featured ?? false,
      postedAt: new Date().toISOString(),
      views: 0,
    };

    saveJob(job);
    return NextResponse.json(job, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
