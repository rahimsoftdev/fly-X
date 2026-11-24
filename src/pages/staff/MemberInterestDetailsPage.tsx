import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import { useFetch } from "@/hooks/useFetch";
import { getCustomTravelById } from "@/services/custom-travel.service";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB") : "—";

/* মোবাইলে label উপরে/value নিচে, sm থেকে এক লাইনে দুই পাশে */
const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-0.5 py-2 text-xs sm:flex-row sm:items-start sm:justify-between sm:gap-6">
    <span className="shrink-0 text-(--paragraph-text)">{label}</span>
    <span className="min-w-0 wrap-break-word font-medium text-(--foreground) sm:text-right">
      {value || "—"}
    </span>
  </div>
);

const BackLink = () => (
  <Link
    to="/staff/members-interest"
    className="mb-4 inline-flex items-center gap-1.5 text-xs text-(--paragraph-text) hover:text-(--foreground)"
  >
    <ArrowLeft size={14} /> Back to Dashboard
  </Link>
);

const MemberInterestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  console.log("DETAILS PAGE RENDERED", id);

  const { data, isLoading, error } = useFetch(
    (signal) => getCustomTravelById(id as string, signal),
    [id]
  );

 if (isLoading) {
  const bar = "animate-pulse rounded-md bg-(--border-color)/70";

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full"
    >
      {/* Back link */}
      <div className={`mb-4 h-3.5 w-32 ${bar}`} />

      {/* Member Details */}
      <section className="rounded-xl border border-(--border-color) bg-(--background) p-4 sm:p-5">
        <div className={`mb-4 h-5 w-36 ${bar}`} />
        <div className="divide-y divide-(--border-color)/60">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className={`h-3 w-24 ${bar}`} />
              <div className={`h-3 w-48 max-w-full ${bar}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Passenger Information */}
      <section className="mt-6">
        <div className={`mb-3 h-4 w-40 ${bar}`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-(--border-color) bg-(--background) p-4"
            >
              <div className={`h-3 w-20 ${bar}`} />
              <div className={`mt-2.5 h-4 w-36 ${bar}`} />
              <div className={`mt-2.5 h-3 w-full ${bar}`} />
              <div className={`mt-2 h-3 w-4/5 ${bar}`} />
              <div className={`mt-2 h-3 w-1/2 ${bar}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="mt-6 rounded-xl border border-(--border-color) bg-(--background) p-4 sm:p-5">
        <div className={`mb-3 h-4 w-16 ${bar}`} />
        <div className={`h-3 w-full ${bar}`} />
        <div className={`mt-2 h-3 w-2/3 ${bar}`} />
      </section>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-350 p-4 sm:p-5 lg:p-6">
        <BackLink />
        <p className="text-sm text-red-600">{error ?? "Request not found"}</p>
      </div>
    );
  }

  const first = data.passengers[0];
  const memberName =
    data.member?.name ?? (first ? `${first.firstName} ${first.lastName}` : "—");
  const email = data.member?.email ?? first?.email;
  const phone = data.member?.phone ?? first?.phone;
  const address =
    data.member?.address ??
    (first ? `${first.streetAddress}, ${first.zipCode}` : undefined);

  const directionText =
    data.type === "two-way"
      ? `${data.origin} - ${data.destination}, ${data.returnOrigin ?? data.destination} - ${data.returnDestination ?? data.origin}`
      : `${data.origin} - ${data.destination}`;

  return (
    <div className="mx-auto w-full ">
      <BackLink />

      {/* ---------- Member Details ---------- */}
      <section className="rounded-xl border border-(--border-color) bg-(--background) p-4 sm:p-5">
        <h2 className="mb-2 font-serif text-base font-semibold text-(--heading-text) sm:text-lg">
          Member Details
        </h2>

        <div className="divide-y divide-(--border-color)/60">
          <Row label="Member Name" value={memberName} />
          <Row label="Direction" value={directionText} />
          <Row
            label="Preferred Date"
            value={formatDate(data.preferredDeparture)}
          />
          <Row label="Return Date" value={formatDate(data.returnDate)} />
          <Row label="Phone Number" value={phone} />
          <Row label="Email" value={email} />
          <Row label="Address" value={address} />
        </div>
      </section>

      {/* ---------- Passenger Information ---------- */}
      <section className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-(--heading-text) sm:text-base">
          Passenger Information
        </h3>

        {data.passengers.length === 0 ? (
          <p className="text-xs text-(--paragraph-text)">No passenger added</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.passengers.map((p, index) => (
              <div
                key={`${p.email}-${index}`}
                className="min-w-0 rounded-xl border border-(--border-color) bg-(--background) p-4"
              >
                <p className="text-xs font-medium text-primary">
                  Passenger {index + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-(--foreground)">
                  {p.firstName} {p.lastName}
                </p>
                <p className="mt-1 wrap-break-word text-[11px] text-(--paragraph-text)">
                  {p.streetAddress}, {p.zipCode}
                </p>
                <p className="break-all text-[11px] text-(--paragraph-text)">
                  {p.email}
                </p>
                <p className="text-[11px] text-(--paragraph-text)">{p.phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Note ---------- */}
      <section className="mt-6 rounded-xl border border-(--border-color) bg-(--background) p-4 sm:p-5">
        <h3 className="mb-1 text-sm font-semibold text-(--heading-text) sm:text-base">
          Note
        </h3>
        <p className="wrap-break-word text-xs text-(--paragraph-text) sm:text-sm">
          {data.specialRequests || "No special request"}
        </p>
      </section>
    </div>
  );
};

export default MemberInterestDetailsPage;