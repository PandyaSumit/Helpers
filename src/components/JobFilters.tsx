"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface JobFiltersProps {
  categories: string[];
}

const JOB_TYPES = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const EXPERIENCE_LEVELS = [
  { value: "all", label: "All Levels" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
];

const LOCATION_TYPES = [
  { value: "all", label: "All Locations" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export default function JobFilters({ categories }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const activeSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(activeSearch);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      return params.toString();
    },
    [searchParams],
  );

  const navigateWithFilters = useCallback(
    (updates: Record<string, string>) => {
      const query = createQueryString(updates);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  const setFilter = (key: string, value: string) => {
    navigateWithFilters({ [key]: value });
  };

  const clearAll = () => {
    setSearchValue("");
    router.replace(pathname, { scroll: false });
  };

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("category") ||
    searchParams.has("jobType") ||
    searchParams.has("experienceLevel") ||
    searchParams.has("locationType");

  useEffect(() => {
    setSearchValue(activeSearch);
  }, [activeSearch, searchParamsString]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchValue === activeSearch) return;
      navigateWithFilters({ search: searchValue });
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [activeSearch, navigateWithFilters, searchValue]);

  const baseSelectClass =
    "h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors duration-200 hover:border-neutral-400 focus:border-neutral-500";

  return (
    <div className="space-y-3 border-y border-neutral-200 py-5">
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          placeholder="Search by title, company, skill, or keyword"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10 w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors duration-200 focus:border-neutral-500"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        <select
          value={searchParams.get("category") ?? "all"}
          onChange={(e) => setFilter("category", e.target.value)}
          className={baseSelectClass}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("jobType") ?? "all"}
          onChange={(e) => setFilter("jobType", e.target.value)}
          className={baseSelectClass}
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("experienceLevel") ?? "all"}
          onChange={(e) => setFilter("experienceLevel", e.target.value)}
          className={baseSelectClass}
        >
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("locationType") ?? "all"}
          onChange={(e) => setFilter("locationType", e.target.value)}
          className={baseSelectClass}
        >
          {LOCATION_TYPES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-md border border-neutral-300 px-3 text-sm font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
