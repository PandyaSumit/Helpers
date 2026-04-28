"use client";

import Link from "next/link";
import BrandMark from "@/components/BrandMark";

const footerLinks = {
  Platform: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/blog", label: "Blog" },
  ],
  Categories: [
    { href: "/jobs?category=Engineering", label: "Engineering" },
    { href: "/jobs?category=Design", label: "Design" },
    { href: "/jobs?category=Data+%26+AI", label: "Data & AI" },
    { href: "/jobs?category=Marketing", label: "Marketing" },
    { href: "/jobs?category=Product", label: "Product" },
  ],
  "Job Types": [
    { href: "/jobs?locationType=remote", label: "Remote Jobs" },
    { href: "/jobs?locationType=hybrid", label: "Hybrid Jobs" },
    { href: "/jobs?jobType=full-time", label: "Full-time" },
    { href: "/jobs?jobType=internship", label: "Internships" },
    { href: "/jobs?jobType=contract", label: "Contract" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold tracking-tight text-neutral-900"
            >
              <BrandMark className="h-7 w-7" />
              <span className="text-sm">Helpers</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              Curated job opportunities from top companies — hand-picked for quality and clarity.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Helpers. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Curated opportunities — not direct applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
