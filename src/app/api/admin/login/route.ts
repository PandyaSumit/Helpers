import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAge,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const inputEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const inputPassword = typeof password === 'string' ? password : '';

  if (!adminEmail || !adminPassword || !sessionSecret) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  if (!inputEmail || !inputPassword) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (inputEmail !== adminEmail || inputPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await createAdminSessionToken(adminEmail, sessionSecret);
  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: getAdminSessionMaxAge(),
    path: '/',
  });

  return response;
}
