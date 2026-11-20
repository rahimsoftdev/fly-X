import { useSearchParams } from "react-router";
import Pagination from "@/components/ui/Pagination";
import { useOpportunities } from "@/hooks/useOpportunities";
import type {
  OpportunityStatus,
  OpportunityType,
} from "@/types/opportunity.types";
import OpportunityCardSkeleton from "@/components/ui/akeletons/OpportunityCardSkeleton";
import OpportunityCard from "@/components/Opprotunites/OpportunityCard";
import OpportunityFilters from "@/components/Opprotunites/OpportunityFilters";

const LIMIT = 8;

const OpportunitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL থেকে ফিল্টার পড়া: ?page=2&status=open&type=one-way
  const page = Number(searchParams.get("page")) || 1;
  const status =
    (searchParams.get("status") as OpportunityStatus | null) ?? "open";
  const type = (searchParams.get("type") as OpportunityType | null) ?? "";

  const { data, isLoading, error, refetch } = useOpportunities({
    page,
    limit: LIMIT,
    status,
    type: type || undefined,
  });

  const changeFilter = (key: "status" | "type", value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const goToPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    if (isLoading && !data) {
      return (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <p className="font-medium text-(--heading-text)">
            No opportunities found
          </p>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            Try changing the filters to see more results.
          </p>
        </div>
      );
    }

    return (
      <>
        <div
          className={`grid gap-4 transition-opacity ${isLoading ? "opacity-60" : ""}`}
        >
          {data.data.map((item) => (
            <OpportunityCard
              key={item._id}
              opportunity={item}
              onReserved={refetch}
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
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-(--heading-text) sm:text-3xl lg:text-4xl">
            Available Opportunities
          </h1>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            Browse shared charter opportunities on popular routes
          </p>
        </div>

        <OpportunityFilters
          status={status}
          type={type}
          onChange={changeFilter}
        />
      </header>

      {renderContent()}
    </section>
  );
};

export default OpportunitiesPage;