import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const getPageNumbers = (page: number, totalPages: number) => {
  const pages: (number | "...")[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
};

const btnBase =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-(--border-color) bg-(--background) px-3 text-sm font-medium text-(--foreground) transition hover:bg-(--card) disabled:cursor-not-allowed disabled:opacity-40";

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2"
    >
      <button
        className={btnBase}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* মোবাইলে শুধু "Page 1 of 4" */}
      <span className="px-2 text-sm text-(--paragraph-text) sm:hidden">
        Page {page} of {totalPages}
      </span>

      {/* ট্যাবলেট/ডেস্কটপে পেজ নম্বর */}
      <div className="hidden items-center gap-2 sm:flex">
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-(--paragraph-text)">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-white"
                  : btnBase
              }
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={btnBase}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;