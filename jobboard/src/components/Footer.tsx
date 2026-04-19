'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-neutral-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white">
                <Briefcase size={16} />
              </span>
              <span className="text-lg tracking-tight">JobBoard</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-neutral-500">
              Curated job opportunities from top companies, hand-picked for quality.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/jobs" className="hover:text-neutral-900">Browse Jobs</Link></li>
                <li><Link href="/admin" className="hover:text-neutral-900">Post a Job</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/jobs?category=Engineering" className="hover:text-neutral-900">Engineering</Link></li>
                <li><Link href="/jobs?category=Design" className="hover:text-neutral-900">Design</Link></li>
                <li><Link href="/jobs?category=Data+%26+AI" className="hover:text-neutral-900">Data & AI</Link></li>
                <li><Link href="/jobs?category=Marketing" className="hover:text-neutral-900">Marketing</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-100 pt-6">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} JobBoard. Curated opportunities, not direct applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
