'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type AdminTableColumn = {
  key: string;
  label: string;
  className?: string;
};

interface AdminDataTableProps<T> {
  columns: AdminTableColumn[];
  rows: T[];
  rowKey: (row: T) => string;
  renderRow: (row: T) => React.ReactNode;
  emptyState: React.ReactNode;
  scrollHeightClass: string;
  pageSize?: number;
}

export default function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  renderRow,
  emptyState,
  scrollHeightClass,
  pageSize = 12,
}: AdminDataTableProps<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRootRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visibleCount < rows.length;
  const visibleRows = useMemo(() => rows.slice(0, visibleCount), [rows, visibleCount]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [rows.length, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollRootRef.current;
    if (!sentinel || !root || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setVisibleCount((current) => Math.min(current + pageSize, rows.length));
      },
      { root, threshold: 0.2 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize, rows.length]);

  return (
    <div className="hidden md:block">
      <div className="overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-sm">
        <div ref={scrollRootRef} className={`overflow-y-auto overflow-x-auto ${scrollHeightClass}`}>
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-neutral-50">
              <tr className="border-b border-neutral-100">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-semibold text-neutral-500 ${column.className ?? ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {visibleRows.map((row) => (
                <tr key={rowKey(row)}>{renderRow(row)}</tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && <div className="py-16 text-center">{emptyState}</div>}

          {hasMore && (
            <div ref={sentinelRef} className="py-3 text-center text-xs text-neutral-400">
              Loading more...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
