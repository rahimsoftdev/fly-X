export interface IHighDemandRoute {
  origin: string;
  destination: string;
  dayOfWeek: string;
  preferredTime: string;
  growth: number;
}

export interface IPopularDate {
  date: string; // "2026-06-15"
  routes: number;
  members: number;
}

export interface IUpcomingTrip {
  id: string;
  origin: string;
  destination: string;
  type: "regular" | "one-time";
  dayOfWeek: string | null;
  date: string | null;
  preferredTime: string;
}

export interface IDashboard {
  user: { name: string };
  stats: {
    travelOpportunities: number;
    pendingReservations: number;
    upcomingTrips: number;
  };
  highDemandRoutes: IHighDemandRoute[];
  popularDates: IPopularDate[];
  upcomingTrips: IUpcomingTrip[];
}