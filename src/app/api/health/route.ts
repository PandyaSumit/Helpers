import { NextResponse } from 'next/server';

/** Use GET /api/health to confirm the deployment is running Next server routes (not an empty static root). */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'helpers',
    time: new Date().toISOString(),
  });
}
