// import ReservationsView from "@/components/Reservations/ReservationsView";

import ReservationsView from "@/components/Opprotunites/ReservationsView";

const PendingReservationsPage = () => (
  <ReservationsView
    status="open"
    variant="pending"
    title="Pending Reservations"
    subtitle="Reservations awaiting concierge confirmation"
    notice="You can cancel your reservation before it's confirmed. Once confirmed by Flyx, cancellation is not available."
    emptyTitle="No pending reservations"
    emptyText="Reservations you place will appear here until they are confirmed."
  />
);

export default PendingReservationsPage;