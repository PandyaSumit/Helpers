"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
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
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [createQueryString, pathname, router],
  );

  const setFilter = (key: string, value: string) =>
    navigateWithFilters({ [key]: value });

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
  }, [activeSearch, searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchValue === activeSearch) return;
      navigateWithFilters({ search: searchValue });
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [activeSearch, navigateWithFilters, searchValue]);

  const selectClass =
    "h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none transition-colors hover:border-neutral-300 focus:border-neutral-400 cursor-pointer";

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          placeholder="Search by title, company, skill, or keyword…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-neutral-400"
        />
        {searchValue && (
          <button
            onClick={() => {
              setSearchValue("");
              navigateWithFilters({ search: "" });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
          <SlidersHorizontal size={12} />
          Filter:
        </span>

        <select
          value={searchParams.get("category") ?? "all"}
          onChange={(e) => setFilter("category", e.target.value)}
          className={selectClass}
          style={{ width: "auto", minWidth: "130px" }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("jobType") ?? "all"}
          onChange={(e) => setFilter("jobType", e.target.value)}
          className={selectClass}
          style={{ width: "auto", minWidth: "120px" }}
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
          className={selectClass}
          style={{ width: "auto", minWidth: "110px" }}
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
          className={selectClass}
          style={{ width: "auto", minWidth: "130px" }}
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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
