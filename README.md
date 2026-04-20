# Helpers

Helpers is a curated job platform built with Next.js + Tailwind CSS.

Public users can browse curated jobs and blog content.  
Admin workflows (job/blog publishing) are private under `/admin`.

## Architecture

- Public app routes live in `src/app/(public)`.
- Admin routes live in `src/app/admin`.
- Admin APIs are protected with cookie-based checks in `src/lib/admin-auth.ts`.
- Route-level admin protection is enforced by `src/proxy.ts`.
- Search indexing is blocked for admin routes (`robots` + admin metadata).

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (see below).

3. Start dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Required Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=admin@helpers.app
ADMIN_PASSWORD=choose_a_strong_admin_password
ADMIN_SESSION_SECRET=choose_a_long_random_secret
```

## Vercel Deployment Checklist

1. Push code to GitHub.
2. Import the repo into Vercel.
3. Add all required environment variables for **Production** (and Preview if needed):
   - `NEXT_PUBLIC_SITE_URL` (your production domain, e.g. `https://helpers.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. In Supabase Auth settings, add your Vercel domain to allowed URLs (if using auth redirects).
5. Deploy and verify:
   - Public pages work (`/`, `/jobs`, `/blog`)
   - `/admin` redirects to `/admin/login` when unauthenticated
   - Admin pages are not indexed (`robots` / metadata)
6. Set your production domain and update `NEXT_PUBLIC_SITE_URL` if it changes.

## Security Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` on the client.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` periodically.
- Keep admin links out of public UI to maintain candidate-first experience.
