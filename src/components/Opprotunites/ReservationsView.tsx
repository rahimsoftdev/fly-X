import { CircleAlert } from "lucide-react";
import { useSearchParams } from "react-router";
import Pagination from "@/components/ui/Pagination";
import OpportunityCardSkeleton from "@/components/ui/akeletons/OpportunityCardSkeleton";
import { useMyOpportunities } from "@/hooks/useMyOpportunities";
import type { OpportunityStatus } from "@/types/opportunity.types";
import ReservationCard, { type ReservationVariant } from "./ReservationCard";

const LIMIT = 8;

interface ReservationsViewProps {
  status: OpportunityStatus;
  variant: ReservationVariant;
  title: string;
  subtitle: string;
  notice?: string | undefined;
  emptyTitle: string;
  emptyText: string;
  onViewDetails?: ((id: string) => void) | undefined;
}

const ReservationsView = ({
  status,
  variant,
  title,
  subtitle,
  notice,
  emptyTitle,
  emptyText,
  onViewDetails,
}: ReservationsViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error, refetch } = useMyOpportunities({
    page,
    limit: LIMIT,
    status,
  });

  const goToPage = (p: number) => {
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ক্যানসেলের পর: পেজের শেষ কার্ড সরলে আগের পেজে যাও, নইলে শুধু রিফ্রেশ
  const handleCancelled = () => {
    if (data && data.data.length === 1 && page > 1) goToPage(page - 1);
    else refetch();
  };

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!data || data.data.length === 0) {
      return (
        <div className="rounded-xl border border-dashed border-(--border-color) p-10 text-center">
          <p className="font-medium text-(--heading-text)">{emptyTitle}</p>
          <p className="mt-1 text-sm text-(--paragraph-text)">{emptyText}</p>
        </div>
      );
    }

    return (
      <>
        <div
          className={`grid gap-4 transition-opacity ${isLoading ? "opacity-60" : ""}`}
        >
          {data.data.map((item) => (
            <ReservationCard
              key={item._id}
              reservation={item}
              variant={variant}
              onCancelled={handleCancelled}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        <div className="mt-8">
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onChange={goToPage}
          />
        </div>
      </>
    );
  };

  return (
    <section className="mx-auto w-full">
      <header className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-(--heading-text) sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-(--paragraph-text)">{subtitle}</p>
      </header>

      {notice && (
        <div
          role="note"
          className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
        >
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      {renderContent()}
    </section>
  );
};

export default ReservationsView;