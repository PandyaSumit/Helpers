"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-neutral-900"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
                <Briefcase size={16} />
              </span>
              <span className="text-base tracking-tight">Helpers</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">
              Curated job opportunities from top companies, hand-picked for
              quality and clarity.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/jobs" className="hover:text-neutral-900">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-neutral-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Categories
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link
                    href="/jobs?category=Engineering"
                    className="hover:text-neutral-900"
                  >
                    Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs?category=Design"
                    className="hover:text-neutral-900"
                  >
                    Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs?category=Data+%26+AI"
                    className="hover:text-neutral-900"
                  >
                    Data & AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jobs?category=Marketing"
                    className="hover:text-neutral-900"
                  >
                    Marketing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Helpers. Curated opportunities, not
            direct applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
