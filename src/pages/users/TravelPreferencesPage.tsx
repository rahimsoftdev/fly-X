import { useCallback, useState } from "react";
import { Info } from "lucide-react";
import { useMyTravels } from "@/hooks/useMyTravels";
import { deleteTravel } from "@/services/travel.api";
import type { ITravel } from "@/types/travel.type";
import RecurringTravelForm from "@/components/travel/RecurringTravelForm";
import OneTimeTravelForm from "@/components/travel/OneTimeTravelForm";
import SavedTravelList from "@/components/travel/SavedTravelList";
import DeleteConfirmModal from "@/components/travel/DeleteConfirmModal";

export default function TravelPreferencesPage() {
  const { data, error, isLoading, refetch } = useMyTravels();

  // kon post delete korte chacche (null = modal bondho)
  const [target, setTarget] = useState<ITravel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDeleteModal = (travel: ITravel) => {
    setDeleteError(null);
    setTarget(travel);
  };

  const closeDeleteModal = useCallback(() => {
    setTarget(null);
    setDeleteError(null);
  }, []);

  const handleConfirmDelete = async () => {
    if (!target) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteTravel(target._id);

      setTarget(null);
      refetch(); // list abar anbe
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen ">
      <div className="mx-auto ">
        <header>
          <h1 className="font-serif! text-2xl font-semibold text-(--heading-text) sm:text-3xl">
            Travel Preferences
          </h1>
          <p className="mt-2 text-sm text-(--paragraph-text)">
            Help us understand your travel patterns so we can match you with
            curated flight opportunities
          </p>
        </header>

        {/* ager kora post gulo */}
        <div className="mt-8">
          {isLoading && !data ? (
            <div className="space-y-2" aria-busy="true">
              <div className="h-12 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
              <div className="h-12 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
            </div>
          ) : error && !data ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          ) : (
            <SavedTravelList travels={data ?? []} onDelete={openDeleteModal} />
          )}
        </div>

        {/* duita alada form, post hole list refetch */}
        <RecurringTravelForm onCreated={refetch} />
        <OneTimeTravelForm onCreated={refetch} />

        <div className="mt-10 flex items-center gap-2 rounded-lg border border-(--border-color) bg-(--card) px-4 py-3 text-xs text-(--paragraph-text)">
          <Info className="size-4 shrink-0" />
          Your preferences help us match you with other members and create
          curated flight opportunities.
        </div>
      </div>

      <DeleteConfirmModal
        travel={target}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}