import { NextRequest } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  email: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function sign(payloadBase64Url: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payloadBase64Url),
  );
  const signatureBytes = new Uint8Array(signatureBuffer);

  let binary = '';
  signatureBytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function verifySignature(
  payloadBase64Url: string,
  signatureBase64Url: string,
  secret: string,
): Promise<boolean> {
  const key = await importHmacKey(secret);

  const signatureBinary = atob(
    signatureBase64Url.replace(/-/g, '+').replace(/_/g, '/') +
      '='.repeat((4 - (signatureBase64Url.length % 4 || 4)) % 4),
  );
  const signature = Uint8Array.from(signatureBinary, (c) => c.charCodeAt(0));

  return crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    new TextEncoder().encode(payloadBase64Url),
  );
}

export function getAdminSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}

export function getAdminSessionCookieName(): string {
  return SESSION_COOKIE;
}

export async function createAdminSessionToken(email: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    email,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const payloadBase64Url = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(payloadBase64Url, secret);

  return `${payloadBase64Url}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<AdminSessionPayload | null> {
  if (!token || !secret) return null;

  const [payloadBase64Url, signatureBase64Url] = token.split('.');
  if (!payloadBase64Url || !signatureBase64Url) return null;

  const validSignature = await verifySignature(payloadBase64Url, signatureBase64Url, secret);
  if (!validSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadBase64Url)) as AdminSessionPayload;
    if (!payload.email || typeof payload.exp !== 'number') return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const session = await verifyAdminSessionToken(token, secret);
  return Boolean(session);
}
