import { useSearchParams } from "react-router";
import { Link } from "react-router";
import Pagination from "@/components/ui/Pagination";
import { useMyOpportunities } from "@/hooks/useMyOpportunities";
import BookingCard from "./components/BookingCard";
import OpportunityCardSkeleton from "../Opportunities/components/OpportunityCardSkeleton";

const LIMIT = 8;

const MyBookingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error, refetch } = useMyOpportunities({
    page,
    limit: LIMIT,
  });

  const goToPage = (p: number) => {
    setSearchParams({ page: String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <p className="font-medium text-(--heading-text)">
            You have no reservations yet
          </p>
          <p className="mt-1 text-sm text-(--paragraph-text)">
            Browse available opportunities and place your first reservation.
          </p>
          <Link
            to="/user/opportunities"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Browse opportunities
          </Link>
        </div>
      );
    }

    return (
      <>
        <div
          className={`grid gap-4 transition-opacity ${isLoading ? "opacity-60" : ""}`}
        >
          {data.data.map((item) => (
            <BookingCard key={item._id} opportunity={item} />
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
    <section className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-(--heading-text) sm:text-3xl lg:text-4xl">
          My Reservations
        </h1>
        <p className="mt-1 text-sm text-(--paragraph-text)">
          Opportunities you have reserved a seat on
        </p>
      </header>

      {renderContent()}
    </section>
  );
};

export default MyBookingsPage;