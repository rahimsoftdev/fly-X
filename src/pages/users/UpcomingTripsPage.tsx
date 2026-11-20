// import ReservationsView from "@/components/Reservations/ReservationsView";

import ReservationsView from "@/components/Opprotunites/ReservationsView";

const UpcomingTripsPage = () => {
  const handleViewDetails = (id: string) => {
    // TODO: ডিটেইলস পেজ বা মোডাল এখানে খুলবে
    console.log("View details:", id);
  };

  return (
    <ReservationsView
      status="confirmed"
      variant="confirmed"
      title="Upcoming Trips"
      subtitle="Your confirmed curated flights"
      emptyTitle="No upcoming trips"
      emptyText="Once a reservation is confirmed, your trip will appear here."
      onViewDetails={handleViewDetails}
    />
  );
};

export default UpcomingTripsPage;