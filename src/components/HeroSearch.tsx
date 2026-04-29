"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const EXPERIENCE_LEVELS = [
  { value: "", label: "Experience Level" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const terms = [skills, location].filter(Boolean).join(" ");
    if (terms) params.set("search", terms);
    if (experience) params.set("experienceLevel", experience);
    router.push(`/jobs${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md sm:flex-row sm:items-center sm:rounded-full sm:shadow-lg">
        {/* Skills input */}
        <div className="flex flex-1 items-center gap-2.5 px-5 py-3.5 sm:h-14 sm:py-0">
          <Search size={15} className="shrink-0 text-neutral-400" />
          <input
            type="text"
            placeholder="Job title, skills, or company"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
          />
        </div>

        {/* Dividers */}
        <div className="mx-5 border-t border-neutral-100 sm:mx-0 sm:h-6 sm:w-px sm:border-t-0 sm:border-l sm:border-neutral-200" />

        {/* Experience select */}
        <div className="flex items-center px-5 py-3 sm:h-14 sm:py-0">
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-sm text-neutral-600 outline-none sm:w-auto"
          >
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-5 border-t border-neutral-100 sm:mx-0 sm:h-6 sm:w-px sm:border-t-0 sm:border-l sm:border-neutral-200" />

        {/* Location input */}
        <div className="flex flex-1 items-center gap-2.5 px-5 py-3.5 sm:h-14 sm:py-0">
          <MapPin size={15} className="shrink-0 text-neutral-400" />
          <input
            type="text"
            placeholder="City or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
          />
        </div>

        {/* Search button */}
        <div className="p-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 sm:w-auto sm:rounded-full sm:py-2.5"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
