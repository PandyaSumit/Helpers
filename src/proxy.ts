import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from '@/lib/admin-auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get(getAdminSessionCookieName())?.value;
  const session = await verifyAdminSessionToken(
    token,
    process.env.ADMIN_SESSION_SECRET,
  );

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', `${pathname}${request.nextUrl.search}`);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(getAdminSessionCookieName());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
