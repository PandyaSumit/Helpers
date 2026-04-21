# Helpers

Helpers is a curated job platform built with Next.js + Tailwind CSS.

Public users can browse curated jobs and blog content.  
Admin workflows (job/blog publishing) are private under `/admin`.

## Architecture

- Public app routes live in `src/app/(public)`.
- Admin routes live in `src/app/admin`.
- Admin APIs are protected with cookie-based checks in `src/lib/admin-auth.ts`.
- Route-level admin protection is enforced by `src/proxy.ts` (Next.js 16 `proxy`; matches `/admin/*` only).
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

### Repo verification (matches common Next.js 16 + Vercel guidance)

| Check | Status in this repo |
|--------|----------------------|
| Framework preset | `vercel.json` sets `"framework": "nextjs"`. In Vercel **Settings → General**, preset should also be **Next.js** (dashboard can override; keep them aligned). |
| Build command | `vercel.json` → `"buildCommand": "npm run vercel-build"`. That script logs then runs `npm run build` → **`next build --webpack`**. In Vercel **Build & Development**, either leave **Build Command empty** (uses `vercel.json`) or set it **exactly** to `npm run vercel-build`. |
| Install command | `vercel.json` → `"installCommand": "npm install"`. Match in dashboard or leave default. |
| Output directory | **Must be blank** in Vercel (Next uses `.next` internally). This repo has **no** `output` / `distDir` in `next.config.ts`. |
| Middleware vs proxy | **No** `src/middleware.ts`. **Yes** `src/proxy.ts` with `export async function proxy` and `matcher: ['/admin/:path*']` only — correct for Next.js 16. |

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

### If you see `404: NOT_FOUND` on `*.vercel.app` or build logs look empty

These almost always come from **Vercel project settings**, not from missing app routes (this repo builds `/` correctly).

1. **Vercel → Project → Settings → General**
   - **Root Directory:** must be **empty** (repo root), unless this app lives in a subfolder.
   - **Framework Preset:** **Next.js**.

2. **Settings → Build & Development**
   - **Build Command:** leave **default** so Vercel uses `vercel.json` → `npm run vercel-build`, or set it explicitly to `npm run vercel-build`.
   - **Output Directory:** must be **empty** for Next.js. If it is set to `dist`, `build`, `out`, etc., clear it — wrong output causes platform `NOT_FOUND`.

3. **Deployments**
   - Open the **latest** deployment. Confirm status is **Ready** (not Error/Canceled).
   - Use **Build** / **Building** tab for logs. Runtime logs are under **Functions** / **Logs**, not the build step.

4. **Git**
   - Confirm the connected repository and **production branch** contain this Next app (with `package.json` and `src/app/`).

5. **Redeploy**
   - **Redeploy** → enable **Clear cache and redeploy** once after fixing settings.

This repo includes `vercel.json` so every production build runs `npm run vercel-build`, which prints a visible `[helpers] vercel-build` line at the top of the build log, then **`next build --webpack`** (Turbopack is avoided on Vercel for more predictable output).

After deploy, open **`/api/health`**. If that returns JSON but `/` still shows Vercel `NOT_FOUND`, the Next app is running but the **Production Domain** or **Output Directory** in Vercel is still misconfigured. If `/api/health` is also `NOT_FOUND`, the deployment is not serving this Next project at all (wrong repo, root directory, or failed build).

## Security Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` on the client.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` periodically.
- Keep admin links out of public UI to maintain candidate-first experience.
