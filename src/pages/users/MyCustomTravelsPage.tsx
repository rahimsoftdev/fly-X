import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useMyCustomTravels } from "@/hooks/useMyCustomTravels";
import CustomTravelCard from "@/components/custom-travel/CustomTravelCard";

// New Travel Request form-er page
const NEW_REQUEST_PATH = "/user/custom-travel";

const addButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90";

export default function MyCustomTravelsPage() {
  const { data, error, isLoading, refetch } = useMyCustomTravels();

  return (
    <main className="min-h-screen">
      <div className="mx-auto">
        {/* header + add button */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif! text-2xl font-semibold text-(--heading-text) sm:text-3xl">
              My Travel Requests
            </h1>
            <p className="mt-2 text-sm text-(--paragraph-text)">
              Track the custom travel requests you've submitted and see their
              current status
            </p>
          </div>

          <Link to={NEW_REQUEST_PATH} className={addButtonClass}>
            <Plus className="size-4" />
            Add New Request
          </Link>
        </header>

        <div className="mt-8">
          {isLoading && !data ? (
            // loading skeleton
            <div className="space-y-4" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl bg-black/10 dark:bg-white/10"
                />
              ))}
            </div>
          ) : error && !data ? (
            // error
            <div className="rounded-xl bg-red-50 px-4 py-4 dark:bg-red-500/10">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Try again
              </button>
            </div>
          ) : data && data.length === 0 ? (
            // empty
            <div className="rounded-xl border border-dashed border-(--border-color) px-4 py-12 text-center">
              <p className="text-base font-medium text-(--heading-text)">
                No travel requests yet
              </p>
              <p className="mt-1 text-sm text-(--paragraph-text)">
                Submit your first request and our concierge team will take it
                from there.
              </p>
              <Link to={NEW_REQUEST_PATH} className={`mt-5 ${addButtonClass}`}>
                <Plus className="size-4" />
                Add New Request
              </Link>
            </div>
          ) : (
            // list
            <>
              <p className="mb-3 text-sm text-(--paragraph-text)">
                {data?.length} {data?.length === 1 ? "request" : "requests"}
              </p>

              <div className="space-y-4">
                {data?.map((travel) => (
                  <CustomTravelCard key={travel._id} travel={travel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}